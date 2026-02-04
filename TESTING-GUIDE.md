# 🧪 GUIA DE TESTE - AUTENTICAÇÃO JWT

## ✅ O QUE JÁ ESTÁ IMPLEMENTADO

A autenticação JWT completa já foi criada! Este guia vai te ajudar a **testar tudo**.

---

## 🚀 PASSO A PASSO PARA TESTAR

### **1. Preparar o Ambiente**

```powershell
# Instalar dependências
npm install

# Criar arquivo .env
Copy-Item env.example .env

# Editar .env e configurar DATABASE_URL:
# DATABASE_URL="postgresql://user:password@localhost:5432/manutencao_mvp"
```

### **2. Configurar Banco de Dados**

```powershell
# Criar database
npx prisma migrate dev --name init

# Popular com dados de exemplo
npm run prisma:seed
```

**Credenciais criadas:**
- Email: `admin@techfrio.com.br`
- Senha: `123456`

### **3. Iniciar o Servidor**

```powershell
npm run dev
```

Você verá:
```
🚀 ========================================
   Server running on port 3000
   Environment: development
   API URL: http://localhost:3000/api
========================================
```

---

## 🧪 TESTANDO A API

### **Teste 1: Health Check**

```powershell
curl http://localhost:3000/api/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2026-02-04T..."
}
```

---

### **Teste 2: Cadastro de Técnico**

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    \"email\": \"joao@techfrio.com.br\",
    \"password\": \"Senha123\",
    \"name\": \"João Silva\",
    \"phone\": \"+5511988776655\",
    \"companyName\": \"TechFrio Manutenção\",
    \"role\": \"TECHNICIAN\"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "joao@techfrio.com.br",
      "name": "João Silva",
      "role": "TECHNICIAN",
      "companyId": "uuid"
    }
  }
}
```

✅ **O que aconteceu:**
- Usuário criado
- Empresa criada automaticamente (TechFrio Manutenção)
- Perfil de Technician criado
- Trial de 30 dias ativado
- Token JWT gerado

**⚠️ Copie o token retornado!**

---

### **Teste 3: Login**

```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    \"email\": \"joao@techfrio.com.br\",
    \"password\": \"Senha123\"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "joao@techfrio.com.br",
      "name": "João Silva",
      "role": "TECHNICIAN",
      "companyId": "uuid"
    }
  }
}
```

**⚠️ Copie o token retornado!**

---

### **Teste 4: Rota Protegida (com token)**

Substitua `<TOKEN>` pelo token copiado:

```powershell
curl -X GET http://localhost:3000/api/auth/me `
  -H "Authorization: Bearer <TOKEN>"
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "joao@techfrio.com.br",
    "name": "João Silva",
    "phone": "+5511988776655",
    "role": "TECHNICIAN",
    "companyId": "uuid",
    "isActive": true,
    "createdAt": "2026-02-04T...",
    "company": {
      "id": "uuid",
      "name": "TechFrio Manutenção",
      "subscriptionPlan": "FREE",
      "subscriptionStatus": "TRIAL"
    },
    "technician": {
      "id": "uuid",
      "registration": null,
      "specialties": [],
      "isAvailable": true
    }
  }
}
```

✅ **Autenticação funcionando!**

---

### **Teste 5: Rota Protegida (sem token)**

```powershell
curl -X GET http://localhost:3000/api/auth/me
```

**Resposta esperada:**
```json
{
  "success": false,
  "message": "Token não fornecido"
}
```

✅ **Proteção funcionando!**

---

### **Teste 6: Token Inválido**

```powershell
curl -X GET http://localhost:3000/api/auth/me `
  -H "Authorization: Bearer token-invalido"
```

**Resposta esperada:**
```json
{
  "success": false,
  "message": "Token inválido"
}
```

✅ **Validação funcionando!**

---

### **Teste 7: Cadastro de Admin (cria empresa)**

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    \"email\": \"admin@minhaempresa.com.br\",
    \"password\": \"Admin123\",
    \"name\": \"Admin da Empresa\",
    \"phone\": \"+5511987654321\",
    \"companyName\": \"Minha Empresa LTDA\",
    \"role\": \"ADMIN\"
  }'
```

✅ **O que aconteceu:**
- Usuário ADMIN criado
- Nova empresa criada (Minha Empresa LTDA)
- Trial de 30 dias ativado
- Plano FREE

---

### **Teste 8: Validações (senha fraca)**

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    \"email\": \"teste@test.com\",
    \"password\": \"123456\",
    \"name\": \"Teste\",
    \"phone\": \"+5511999999999\"
  }'
```

**Resposta esperada:**
```json
{
  "success": false,
  "message": "Senha deve conter letras maiúsculas, minúsculas e números"
}
```

✅ **Validação funcionando!**

---

### **Teste 9: Email já cadastrado**

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    \"email\": \"joao@techfrio.com.br\",
    \"password\": \"Senha123\",
    \"name\": \"Outro Nome\",
    \"phone\": \"+5511999999999\"
  }'
```

**Resposta esperada:**
```json
{
  "success": false,
  "message": "Email já cadastrado"
}
```

✅ **Validação funcionando!**

---

### **Teste 10: Renovar Token**

```powershell
curl -X POST http://localhost:3000/api/auth/refresh `
  -H "Authorization: Bearer <TOKEN>"
```

**Resposta esperada:**
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

## 🎨 TESTANDO COM POSTMAN

### **1. Importar Collection**

1. Abrir Postman
2. File → Import
3. Selecionar `postman-collection.json`
4. ✅ 6 requisições importadas

### **2. Testar Endpoints**

**Ordem recomendada:**

1. **Health Check** - Verifica se API está online
2. **Register - Technician** - Cadastra técnico
   - ✅ Token salvo automaticamente na variável `{{token}}`
3. **Login** - Faz login
   - ✅ Token atualizado automaticamente
4. **Get Me** - Busca dados do usuário autenticado
   - ✅ Usa token da variável `{{token}}`
5. **Refresh Token** - Renova o token
   - ✅ Novo token salvo automaticamente

### **3. Variáveis Disponíveis**

```
{{base_url}} = http://localhost:3000/api
{{token}}    = (salvo automaticamente após login)
```

---

## 🔍 VERIFICANDO NO BANCO

### **Abrir Prisma Studio:**

```powershell
npm run prisma:studio
```

Abre em: `http://localhost:5555`

### **Verificar:**

1. **User** - Usuários cadastrados
   - Email, nome, role, companyId
   - Senha está em hash (bcrypt) ✅

2. **Company** - Empresas criadas
   - Nome, subscriptionPlan, subscriptionStatus
   - trialEndsAt (+30 dias) ✅

3. **Technician** - Perfis técnicos
   - Vinculado ao User
   - specialties, isAvailable ✅

---

## 📊 ESTRUTURA JÁ IMPLEMENTADA

```
✅ Cadastro de usuário
   ├─ Técnico (cria perfil Technician)
   └─ Admin/Manager (cria Company automaticamente)

✅ Login
   ├─ Valida email e senha
   ├─ Verifica se usuário está ativo
   └─ Gera token JWT

✅ Proteção de Rotas
   ├─ authenticate (valida token)
   ├─ authorize (controla por role)
   ├─ requireCompany (exige empresa)
   └─ ensureSameCompany (multi-tenant)

✅ Multi-tenant (SaaS)
   ├─ Isolamento por companyId
   ├─ Trial de 30 dias
   ├─ Validação de assinatura
   └─ Suspensão automática

✅ Validações
   ├─ Email válido
   ├─ Senha forte (maiúscula + minúscula + número)
   ├─ Telefone formato internacional
   └─ Campos obrigatórios

✅ Segurança
   ├─ Senha com bcrypt (10 rounds)
   ├─ JWT com expiração (7 dias)
   ├─ Helmet (security headers)
   ├─ CORS (proteção CSRF)
   └─ Error handling centralizado
```

---

## 🐛 RESOLVENDO PROBLEMAS

### **Erro: Database not found**

```powershell
# Criar database
npx prisma migrate dev --name init
```

### **Erro: Port 3000 already in use**

```powershell
# Parar processo na porta 3000
Get-Process -Name node | Stop-Process

# Ou alterar porta no .env
PORT=3001
```

### **Erro: JWT_SECRET not defined**

```env
# Adicionar no .env
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
```

### **Erro: Cannot find module**

```powershell
# Reinstalar dependências
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 📚 DOCUMENTAÇÃO CRIADA

1. **`src/AUTH-DOCUMENTATION.md`** (598 linhas)
   - Arquitetura completa
   - Todos os endpoints
   - Exemplos de código
   - Middlewares explicados
   - Multi-tenant detalhado

2. **`README.md`** (atualizado)
   - Guia de setup
   - Exemplos de uso
   - Endpoints da API

3. **`postman-collection.json`**
   - Collection pronta para testar
   - Auto-save de token

4. **`src/examples/auth-test.ts`**
   - Testes automatizados
   - Exemplos de integração

---

## ✅ CHECKLIST DE VALIDAÇÃO

Marque cada item após testar:

- [ ] Health check funcionando
- [ ] Cadastro de técnico criando empresa
- [ ] Cadastro de admin criando empresa
- [ ] Login retornando token
- [ ] Rota protegida aceitando token válido
- [ ] Rota protegida rejeitando token inválido
- [ ] Rota protegida rejeitando sem token
- [ ] Validação de senha fraca
- [ ] Validação de email duplicado
- [ ] Renovação de token funcionando
- [ ] Prisma Studio mostrando dados
- [ ] Multi-tenant (companyId em todas as tabelas)

---

## 🎯 PRÓXIMOS PASSOS

Após validar tudo acima, você pode:

**A)** Criar endpoints CRUD (clientes, equipamentos, OS)  
**B)** Implementar upload de fotos (AWS S3)  
**C)** Desenvolver frontend mobile (React Native)  
**D)** Integrar WhatsApp Business API  
**E)** Adicionar recuperação de senha  
**F)** Implementar rate limiting  

---

## 📞 SUPORTE

Se encontrar algum problema:

1. Verificar logs do servidor
2. Verificar `.env` configurado corretamente
3. Verificar PostgreSQL rodando
4. Consultar `src/AUTH-DOCUMENTATION.md`

---

**🎉 A autenticação JWT está 100% implementada e pronta para uso!**
