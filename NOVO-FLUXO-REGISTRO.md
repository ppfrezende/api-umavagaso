# Novo Fluxo de Registro de Usuário

## Mudanças Implementadas

O fluxo de registro foi refatorado para garantir que o usuário só seja criado se o email de verificação for enviado com sucesso.

### Antes (Problema)
1. ✅ Criava usuário no banco
2. ❌ Tentava enviar email
3. ❌ Se o email falhar, usuário já foi criado (inconsistência)

### Agora (Solução)
1. ✅ Valida se email já existe
2. ✅ Gera hash da senha e token de verificação
3. ✅ **TENTA ENVIAR EMAIL PRIMEIRO**
4. ✅ Se email falhar → retorna erro e NÃO cria usuário
5. ✅ Se email enviado → cria usuário com `isActive: false`
6. ✅ Na verificação → ativa usuário (`isActive: true`)

## Fluxo Completo

### 1. Registro (POST /users)
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Processo:**
- Verifica se email já existe
- Gera token de verificação
- **Envia email com código**
- Se email enviado → cria usuário com `isActive: false`
- Retorna sucesso

**Se email falhar:**
- Retorna erro 500
- Usuário NÃO é criado
- Pode tentar novamente

### 2. Verificação (POST /users/verify)
```json
{
  "token": "abc123xyz"
}
```

**Processo:**
- Busca usuário pelo token
- Valida se token não expirou
- Marca `emailVerified = now()`
- **Ativa usuário `isActive = true`**
- Retorna sucesso

### 3. Login (POST /users/authenticate)
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Validações:**
- ✅ Email existe?
- ✅ Senha correta?
- ✅ **Email verificado?** (novo)
- ✅ **Usuário ativo?** (novo)

Se alguma validação falhar → erro de credenciais inválidas

## Proteções Implementadas

### 1. Email deve ser enviado antes de criar usuário
- Se SMTP falhar, usuário não é criado
- Evita registros "fantasma" no banco

### 2. Usuário começa inativo
- `isActive: false` na criação
- Só ativa após verificar email

### 3. Validação de expiração do token
- Token expira em 24 horas
- Verificado antes de ativar usuário

### 4. Bloqueio de login
- Não permite login de usuários não verificados
- Não permite login de usuários inativos

## Arquivos Modificados

1. **[src/use-cases/users/create-user.ts](src/use-cases/users/create-user.ts)**
   - Inverteu ordem: envia email → cria usuário
   - Usuário criado com `isActive: false`

2. **[src/use-cases/users/verify-email.ts](src/use-cases/users/verify-email.ts)**
   - Adiciona validação de expiração
   - Ativa usuário após verificação

3. **[src/use-cases/users/authenticatet.ts](src/use-cases/users/authenticatet.ts)**
   - Bloqueia login de não verificados
   - Bloqueia login de inativos

## Cenários de Uso

### Cenário 1: Registro com sucesso
```
1. POST /users → Email enviado → Usuário criado (inativo)
2. Usuário recebe email com código
3. POST /users/verify → Usuário ativado
4. POST /users/authenticate → Login permitido ✅
```

### Cenário 2: Falha no envio de email
```
1. POST /users → Email falha → Usuário NÃO criado
2. Retorna erro 500
3. Usuário pode tentar registrar novamente
```

### Cenário 3: Tentativa de login sem verificar
```
1. POST /users → Email enviado → Usuário criado (inativo)
2. POST /users/authenticate → Login bloqueado ❌
3. Erro: credenciais inválidas
```

### Cenário 4: Token expirado
```
1. POST /users → Email enviado → Usuário criado (inativo)
2. Espera mais de 24h
3. POST /users/verify → Erro: token inválido ❌
4. POST /users/resend-code → Novo código enviado
5. POST /users/verify → Usuário ativado ✅
```

## Próximos Passos

### Para usar em produção, configure:

1. **Gmail App Password** (se usar Gmail):
   - Ative 2FA na conta Google
   - Gere App Password em: https://myaccount.google.com/apppasswords
   - Adicione no `.env`:
   ```env
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=seu-app-password-16-digitos
   ```

2. **Ou use serviço de email profissional**:
   - SendGrid (100 emails/dia grátis)
   - Mailgun (5000 emails/mês grátis)
   - Resend (3000 emails/mês grátis)
   - AWS SES (muito barato)

## Testando Localmente

Para testar sem configurar email:

1. O código já loga o email no console se SMTP não configurado
2. Copie o token do log
3. Use no endpoint de verificação

```bash
# 1. Registrar
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"123456"}'

# 2. Verificar (use o token do log)
curl -X POST http://localhost:3333/users/verify \
  -H "Content-Type: application/json" \
  -d '{"token":"TOKEN_DO_LOG"}'

# 3. Login
curl -X POST http://localhost:3333/users/authenticate \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```
