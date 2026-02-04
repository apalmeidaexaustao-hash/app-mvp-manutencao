# 🔐 SISTEMA DE AUTENTICAÇÃO JWT - DOCUMENTAÇÃO

## 📋 Visão Geral

Sistema completo de autenticação JWT para o MVP, com suporte a multi-tenant (SaaS), validação de assinatura e controle de acesso por roles.

---

## 🏗️ ARQUITETURA

### **Estrutura de Pastas:**

```
src/
├── config/                      # Configurações
│   ├── database.ts             # Conexão Prisma
│   └── index.ts                # Config geral (env vars)
│
├── types/                       # TypeScript types
│   └── index.ts                # JWTPayload, AuthRequest, DTOs
│
├── services/                    # Lógica de negócio
│   └── auth.service.ts         # Serviço de autenticação
│
├── middlewares/                 # Middlewares Express
│   ├── auth.middleware.ts      # Autenticação e autorização
│   ├── validation.middleware.ts # Validações
│   └── error.middleware.ts     # Error handling
│
├── controllers/                 # Controllers REST
│   └── auth.controller.ts      # Controller de auth
│
├── routes/                      # Rotas da API
│   ├── auth.routes.ts          # Rotas de autenticação
│   └── index.ts                # Router principal
│
├── app.ts                       # Configuração Express
└── server.ts                    # Servidor HTTP
```

---

## 🔑 FUNCIONALIDADES IMPLEMENTADAS

### ✅ **1. Cadastro de Usuário** (`POST /api/auth/register`)

**Request:**
```json
{
  "email": "carlos@techfrio.com.br",
  "password": "Senha123",
  "name": "Carlos Eduardo Santos",
  "phone": "+5511999887766",
  "companyName": "TechFrio Manutenção",
  "role": "TECHNICIAN"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "carlos@techfrio.com.br",
      "name": "Carlos Eduardo Santos",
      "role": "TECHNICIAN",
      "companyId": "uuid"
    }
  }
}
```

**Comportamento:**
- ✅ Email convertido para lowercase
- ✅ Senha com bcrypt (10 rounds)
- ✅ Se role = ADMIN/MANAGER → cria Company automaticamente
- ✅ Company criada com trial de 30 dias
- ✅ Se role = TECHNICIAN → cria perfil Technician
- ✅ Token JWT gerado automaticamente
- ✅ Validações rigorosas (email, senha forte, telefone)

---

### ✅ **2. Login** (`POST /api/auth/login`)

**Request:**
```json
{
  "email": "carlos@techfrio.com.br",
  "password": "Senha123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "carlos@techfrio.com.br",
      "name": "Carlos Eduardo Santos",
      "role": "TECHNICIAN",
      "companyId": "uuid"
    }
  }
}
```

**Validações:**
- ✅ Verifica se usuário existe
- ✅ Verifica se usuário está ativo (`isActive = true`)
- ✅ Compara senha com bcrypt
- ✅ Gera novo token JWT

---

### ✅ **3. Obter Usuário Autenticado** (`GET /api/auth/me`)

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "carlos@techfrio.com.br",
    "name": "Carlos Eduardo Santos",
    "phone": "+5511999887766",
    "role": "TECHNICIAN",
    "companyId": "uuid",
    "isActive": true,
    "createdAt": "2026-02-04T10:00:00.000Z",
    "company": {
      "id": "uuid",
      "name": "TechFrio Manutenção",
      "subscriptionPlan": "BUSINESS",
      "subscriptionStatus": "ACTIVE"
    },
    "technician": {
      "id": "uuid",
      "registration": "CREA-SP 123456",
      "specialties": ["Refrigeração", "Ar-condicionado"],
      "isAvailable": true
    }
  }
}
```

---

### ✅ **4. Renovar Token** (`POST /api/auth/refresh`)

**Headers:**
```
Authorization: Bearer <old-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Token renovado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 🛡️ MIDDLEWARES DE SEGURANÇA

### **1. `authenticate` - Validar Token JWT**

```typescript
import { authenticate } from './middlewares/auth.middleware';

router.get('/protected', authenticate, (req, res) => {
  // req.user está disponível
  res.json({ userId: req.user.userId });
});
```

**O que faz:**
- ✅ Extrai token do header `Authorization: Bearer <token>`
- ✅ Verifica se token é válido (não expirado, assinatura correta)
- ✅ Decodifica payload e injeta em `req.user`
- ✅ Valida assinatura da empresa (se expirou ou foi suspensa)
- ✅ Retorna 401 se token inválido/expirado
- ✅ Retorna 403 se assinatura suspensa

---

### **2. `authorize` - Controle de Acesso por Role**

```typescript
import { authenticate, authorize } from './middlewares/auth.middleware';

router.post(
  '/admin-only',
  authenticate,
  authorize('ADMIN'),
  (req, res) => {
    // Apenas ADMIN pode acessar
  }
);

router.get(
  '/managers-and-admins',
  authenticate,
  authorize('ADMIN', 'MANAGER'),
  (req, res) => {
    // ADMIN e MANAGER podem acessar
  }
);
```

**Roles disponíveis:**
- `ADMIN` - Acesso total ao sistema
- `MANAGER` - Gerente de empresa
- `TECHNICIAN` - Técnico
- `CLIENT` - Cliente (futuro)

---

### **3. `requireCompany` - Exigir Vínculo com Empresa**

```typescript
import { authenticate, requireCompany } from './middlewares/auth.middleware';

router.get(
  '/company-data',
  authenticate,
  requireCompany,
  (req, res) => {
    // Usuário DEVE ter companyId
  }
);
```

---

### **4. `ensureSameCompany` - Isolamento Multi-tenant**

```typescript
import { authenticate, ensureSameCompany } from './middlewares/auth.middleware';

router.get(
  '/clients/:id',
  authenticate,
  ensureSameCompany((req) => req.params.companyId),
  async (req, res) => {
    // Usuário só acessa clientes da própria empresa
  }
);
```

**O que faz:**
- ✅ Compara `req.user.companyId` com o `companyId` do recurso
- ✅ Permite acesso se forem iguais
- ✅ ADMIN tem acesso a todas as empresas
- ✅ Retorna 403 se empresa diferente

---

## 🔐 SEGURANÇA

### **1. Hashing de Senha (bcrypt)**

```typescript
// Registro
const hashedPassword = await bcrypt.hash(password, 10);

// Login
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

- ✅ Salt rounds: 10 (equilibra segurança e performance)
- ✅ Senhas NUNCA armazenadas em plaintext

---

### **2. JWT Token**

**Payload:**
```typescript
{
  userId: "uuid",
  email: "user@example.com",
  role: "TECHNICIAN",
  companyId: "uuid"
}
```

**Configuração:**
```typescript
jwt.sign(payload, SECRET, { expiresIn: '7d' });
```

- ✅ Expira em 7 dias (configurável)
- ✅ Assinado com secret key forte
- ✅ Stateless (não armazenado no servidor)

---

### **3. Validações de Input**

**Senha forte:**
```typescript
password
  .isLength({ min: 6 })
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
```
Requer: maiúsculas + minúsculas + números

**Email:**
```typescript
email
  .isEmail()
  .normalizeEmail()
  .toLowerCase()
```

**Telefone:**
```typescript
phone.matches(/^\+?[1-9]\d{10,14}$/)
```
Aceita: `+5511999999999` ou `11999999999`

---

### **4. Rate Limiting (Recomendado)**

Para produção, adicionar:

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas. Tente novamente em 15 minutos',
});

router.post('/login', authLimiter, loginValidation, authController.login);
```

---

## 🏢 MULTI-TENANT (SaaS)

### **Como Funciona:**

1. **Cadastro de Empresa:**
   - Ao cadastrar ADMIN/MANAGER, cria Company automaticamente
   - Trial de 30 dias grátis
   - Status: `TRIAL`

2. **Isolamento de Dados:**
   - Todas as queries filtram por `companyId`
   - Middleware `ensureSameCompany` garante isolamento
   - ADMIN pode acessar todas as empresas

3. **Validação de Assinatura:**
   ```typescript
   if (company.subscriptionStatus === 'SUSPENDED') {
     throw new ApiError(403, 'Assinatura suspensa');
   }
   
   if (company.trialEndsAt < new Date()) {
     // Trial expirado
   }
   ```

4. **Planos:**
   - `FREE` - Limitado
   - `INDIVIDUAL` - R$ 49/mês
   - `BUSINESS` - R$ 149/mês
   - `ENTERPRISE` - R$ 399/mês

---

## 📊 EXEMPLOS DE USO

### **Exemplo 1: Rota Pública**

```typescript
router.post('/auth/register', registerValidation, authController.register);
```

### **Exemplo 2: Rota Privada**

```typescript
router.get('/me', authenticate, authController.getMe);
```

### **Exemplo 3: Rota com Role**

```typescript
router.delete(
  '/users/:id',
  authenticate,
  authorize('ADMIN'),
  userController.delete
);
```

### **Exemplo 4: Rota Multi-tenant**

```typescript
router.get(
  '/clients',
  authenticate,
  requireCompany,
  async (req: AuthRequest, res) => {
    const clients = await prisma.client.findMany({
      where: { companyId: req.user!.companyId }
    });
    res.json({ success: true, data: clients });
  }
);
```

---

## 🧪 TESTANDO A API

### **1. Cadastrar Usuário (Técnico Individual)**

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@techfrio.com.br",
    "password": "Senha123",
    "name": "João Silva",
    "phone": "+5511988776655",
    "companyName": "TechFrio Manutenção",
    "role": "TECHNICIAN"
  }'
```

### **2. Login**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@techfrio.com.br",
    "password": "Senha123"
  }'
```

**Copiar o token retornado**

### **3. Obter Dados do Usuário**

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <seu-token>"
```

### **4. Health Check**

```bash
curl http://localhost:3000/api/health
```

---

## 🚀 COMO RODAR

### **1. Instalar dependências:**

```bash
npm install
```

### **2. Configurar `.env`:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/manutencao_mvp"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3000
NODE_ENV="development"
```

### **3. Executar migrations:**

```bash
npx prisma migrate dev
```

### **4. Popular banco:**

```bash
npm run prisma:seed
```

### **5. Iniciar servidor:**

```bash
npm run dev
```

Servidor rodando em: `http://localhost:3000`

---

## 📈 MELHORIAS FUTURAS

### **Autenticação:**
- [ ] OAuth 2.0 (Google, Microsoft)
- [ ] Two-factor authentication (2FA)
- [ ] Login social (Google, Facebook)
- [ ] Refresh token rotation
- [ ] Blacklist de tokens revogados

### **Segurança:**
- [ ] Rate limiting (express-rate-limit)
- [ ] CAPTCHA em login
- [ ] Logs de auditoria
- [ ] Detecção de login suspeito
- [ ] Notificação de novos dispositivos

### **Funcionalidades:**
- [ ] Recuperação de senha (email)
- [ ] Alteração de senha
- [ ] Convite de membros (empresa)
- [ ] Perfil de usuário completo
- [ ] Upload de foto de perfil

---

## 🔒 BOAS PRÁTICAS IMPLEMENTADAS

✅ **Senhas seguras** - Bcrypt com 10 rounds  
✅ **JWT stateless** - Não armazena tokens no servidor  
✅ **Validações rigorosas** - express-validator  
✅ **Multi-tenant** - Isolamento por companyId  
✅ **Error handling** - Middleware centralizado  
✅ **TypeScript** - Tipagem forte  
✅ **Helmet** - Headers de segurança  
✅ **CORS** - Proteção contra CSRF  
✅ **Email lowercase** - Normalização automática  
✅ **Usuário inativo** - Verificação no login  

---

## 📞 ERROS COMUNS

### **401 - Unauthorized**
```json
{
  "success": false,
  "message": "Token não fornecido"
}
```
**Solução:** Adicionar header `Authorization: Bearer <token>`

### **403 - Forbidden**
```json
{
  "success": false,
  "message": "Assinatura expirada ou suspensa"
}
```
**Solução:** Renovar assinatura da empresa

### **409 - Conflict**
```json
{
  "success": false,
  "message": "Email já cadastrado"
}
```
**Solução:** Usar email diferente ou fazer login

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Data:** 04/02/2026  
**Versão:** 1.0.0
