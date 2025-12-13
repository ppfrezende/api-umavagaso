# Guia de Configuração - Sistema de Usuários

## Estrutura Criada

```
src/
├── repositories/
│   ├── users-repository.ts              # Interface do repositório
│   └── prisma/
│       └── prisma-users-repository.ts   # Implementação com Prisma
├── use-cases/
│   ├── create-user.ts                   # Use case de criação
│   ├── get-user-profile.ts              # Use case de perfil
│   ├── errors/
│   │   ├── user-already-exists-error.ts
│   │   └── resource-not-found-error.ts
│   └── factories/
│       ├── make-create-user-use-case.ts
│       └── make-get-user-profile-use-case.ts
└── http/
    └── controllers/
        └── users/
            ├── routes.ts                 # Rotas de usuários
            ├── create.ts                 # Controller de criação
            ├── profile.ts                # Controller de perfil
            └── webhook.ts                # Webhook do Clerk
```

## Endpoints Criados

### 1. **POST /webhooks/clerk** (Público)

Webhook para sincronização automática com Clerk quando um usuário é criado.

**Payload do Clerk:**

```json
{
  "type": "user.created",
  "data": {
    "id": "user_xyz",
    "email_addresses": [
      {
        "email_address": "user@example.com",
        "id": "email_xyz"
      }
    ],
    "first_name": "John",
    "last_name": "Doe",
    "image_url": "https://...",
    "public_metadata": {
      "role": "STUDENT",
      "tenantId": "uuid-here"
    }
  }
}
```

### 2. **POST /users** (Autenticado)

Criar usuário manualmente (requer autenticação).

**Request:**

```json
{
  "clerkId": "user_xyz",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT", // opcional: STUDENT ou MENTOR
  "avatar": "https://...", // opcional
  "tenantId": "uuid-here" // opcional
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "clerkId": "user_xyz",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "avatar": "https://...",
    "tenantId": "uuid-here",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### 3. **GET /users/profile** (Autenticado)

Obter perfil do usuário autenticado.

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "clerkId": "user_xyz",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "avatar": "https://...",
    "tenantId": "uuid-here",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

## Configuração do Webhook no Clerk

### Passo 1: Configurar o webhook no Clerk Dashboard

1. Acesse [Clerk Dashboard](https://dashboard.clerk.com)
2. Vá em **Webhooks** no menu lateral
3. Clique em **Add Endpoint**
4. Configure:
   - **Endpoint URL**: `https://seu-dominio.com/webhooks/clerk`
   - **Subscribe to events**: Selecione `user.created`
   - **Description**: "Sync users to database"

### Passo 2: Adicionar metadados públicos ao usuário

Para definir role e tenant ao criar usuário no Clerk:

```javascript
// No frontend, ao criar usuário
await clerk.signUp.create({
  emailAddress: 'user@example.com',
  password: 'password123',
  publicMetadata: {
    role: 'STUDENT', // ou "MENTOR"
    tenantId: 'uuid-do-tenant', // opcional
  },
});
```

## Como Testar

### 1. Iniciar o servidor

```bash
npm run start:dev
```

### 2. Testar criação manual de usuário

**Com cURL:**

```bash
curl -X POST http://localhost:3333/users \
  -H "Authorization: Bearer SEU_TOKEN_CLERK" \
  -H "Content-Type: application/json" \
  -d '{
    "clerkId": "user_2abc123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT"
  }'
```

**Com Postman:**

```http
POST http://localhost:3333/users
Authorization: Bearer SEU_TOKEN_CLERK
Content-Type: application/json

{
  "clerkId": "user_2abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "STUDENT"
}
```

### 3. Testar perfil do usuário

```bash
curl -X GET http://localhost:3333/users/profile \
  -H "Authorization: Bearer SEU_TOKEN_CLERK"
```

### 4. Testar webhook (simulação local)

Para testar localmente, você pode usar o [Clerk CLI](https://clerk.com/docs/testing/webhooks) ou ferramentas como ngrok:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta local
ngrok http 3333

# Use a URL gerada (ex: https://abc123.ngrok.io) no Clerk Dashboard
```

## Fluxo Recomendado

### Opção 1: Sincronização Automática (Recomendado)

1. Usuário se registra no frontend via Clerk
2. Clerk dispara webhook `user.created`
3. API recebe webhook e cria usuário automaticamente no banco
4. Usuário já está sincronizado

### Opção 2: Criação Manual

1. Usuário se registra via Clerk
2. Frontend chama `POST /users` com os dados do Clerk
3. API cria usuário no banco

## Validações

- **clerkId**: Deve ser único
- **email**: Deve ser único e válido
- **role**: Deve ser `STUDENT` ou `MENTOR`
- **tenantId**: Se fornecido, deve existir na tabela de tenants

## Erros Comuns

### 409 - User already exists

O usuário com este clerkId ou email já existe no banco.

### 404 - Resource not found

Usuário não encontrado (no endpoint de profile).

### 400 - Validation error

Dados inválidos no body da requisição.

### 401 - Unauthorized

Token de autenticação ausente ou inválido.

## Próximos Passos

1. **Configurar webhook no Clerk Dashboard**
2. **Testar criação de usuário via Clerk**
3. **Implementar mais use cases se necessário:**
   - Update user
   - Delete user
   - List users
   - Search users

## Observações Importantes

- O webhook do Clerk **não requer autenticação** (é público)
- Considere adicionar verificação de assinatura do Clerk para segurança
- As rotas de usuários (`POST /users` e `GET /users/profile`) **requerem autenticação**
- O middleware `requireAuth` já extrai o `userId` do token Clerk
