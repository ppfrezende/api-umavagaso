# Sistema de Verificação de Email

Este documento descreve como funciona o sistema de verificação de email implementado na API Uma Vaga Só.

## Funcionalidades Implementadas

### 1. Criação de Usuário com Envio de Email
Quando um novo usuário é criado através do endpoint `POST /users`, o sistema:
- Gera um código de verificação de 6 dígitos
- Define uma data de expiração de 24 horas
- Envia um email com o código e um link de verificação
- Retorna os dados do usuário (com `emailVerified: null`)

### 2. Verificação de Email
Endpoint: `POST /users/verify`

**Body:**
```json
{
  "token": "123456"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "uuid",
    "name": "Nome do Usuário",
    "email": "email@example.com",
    "emailVerified": "2025-12-15T19:30:00.000Z",
    "role": "MENTOR",
    "isActive": true,
    "createdAt": "2025-12-15T19:00:00.000Z",
    "updatedAt": "2025-12-15T19:30:00.000Z"
  }
}
```

**Possíveis Erros:**
- `400 Bad Request` - Token inválido ou expirado
- `400 Bad Request` - Email já verificado

### 3. Reenvio de Código de Verificação
Endpoint: `POST /users/resend-code`

**Body:**
```json
{
  "email": "email@example.com"
}
```

**Resposta de Sucesso (200):**
```json
{
  "message": "Verification code resent successfully"
}
```

**Possíveis Erros:**
- `404 Not Found` - Usuário não encontrado
- `400 Bad Request` - Email já verificado

## Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis ao arquivo `.env`:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM=noreply@umavagaso.com

# App Configuration
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001
```

### Configuração do Gmail

Para usar o Gmail como provedor SMTP:

1. Acesse sua conta Google
2. Vá em "Segurança"
3. Ative a verificação em duas etapas
4. Gere uma "Senha de app"
5. Use essa senha no `SMTP_PASS`

### Outros Provedores SMTP

Você pode usar qualquer provedor SMTP (SendGrid, Mailgun, AWS SES, etc.):

```env
# SendGrid Example
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxx

# Mailgun Example
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@seu-dominio.mailgun.org
SMTP_PASS=sua-senha
```

## Estrutura de Dados

### Campos Adicionados ao Modelo User

```prisma
model User {
  // ... campos existentes
  emailVerified           DateTime?
  emailVerificationToken  String?
  emailVerificationExpiry DateTime?
}
```

## Fluxo de Verificação

```
1. Usuário se registra
   ↓
2. Sistema gera código de 6 dígitos
   ↓
3. Sistema salva código e expiry no banco
   ↓
4. Sistema envia email com código
   ↓
5. Usuário recebe email
   ↓
6. Usuário insere código no frontend
   ↓
7. Frontend envia código para /users/verify
   ↓
8. Sistema valida código e marca email como verificado
   ↓
9. Sistema limpa token e expiry do banco
```

## Template de Email

O email enviado contém:
- Mensagem de boas-vindas personalizada
- Botão com link direto para verificação
- Link completo (caso o botão não funcione)
- Código de verificação de 6 dígitos
- Aviso de expiração em 24 horas

## Integração com Frontend

### 1. Após Cadastro

```typescript
// Usuário preenche formulário de cadastro
const response = await fetch('/users', {
  method: 'POST',
  body: JSON.stringify({
    name: 'João Silva',
    email: 'joao@example.com',
    password: 'senha123'
  })
})

// Redirecionar para página de verificação
// O usuário receberá um email com o código
```

### 2. Verificação

```typescript
// Usuário insere código recebido por email
const response = await fetch('/users/verify', {
  method: 'POST',
  body: JSON.stringify({
    token: '123456'
  })
})

if (response.ok) {
  // Email verificado! Redirecionar para login ou dashboard
}
```

### 3. Reenvio de Código

```typescript
// Usuário clica em "Reenviar código"
const response = await fetch('/users/resend-code', {
  method: 'POST',
  body: JSON.stringify({
    email: 'joao@example.com'
  })
})

if (response.ok) {
  // Novo código enviado! Mostrar mensagem de sucesso
}
```

## Modo de Desenvolvimento

Se as credenciais SMTP não estiverem configuradas, o sistema:
- Não enviará emails reais
- Imprimirá o conteúdo do email no console
- Continuará funcionando normalmente

Isso facilita o desenvolvimento local sem necessidade de configurar SMTP.

## Segurança

- Tokens expiram após 24 horas
- Tokens são códigos numéricos de 6 dígitos (gerados aleatoriamente)
- Tokens são validados no backend com verificação de expiração
- Após verificação bem-sucedida, o token é removido do banco
- Não é possível verificar um email já verificado

## Troubleshooting

### Email não está sendo enviado

1. Verifique as credenciais SMTP no `.env`
2. Verifique os logs do console para mensagens de erro
3. Teste com outro provedor SMTP
4. Verifique se a porta 587 não está bloqueada pelo firewall

### Token inválido

1. Verifique se o token não expirou (24 horas)
2. Verifique se o usuário está usando o token mais recente
3. Use o endpoint de resend para gerar novo token

### Email já verificado

- Este é o comportamento esperado
- O usuário não precisa verificar novamente
- Pode fazer login normalmente
