# 🚀 GUIA DE INSTALAÇÃO E CONFIGURAÇÃO

## ⚠️ PRÉ-REQUISITOS

### 1. **Node.js (v18 ou superior)**

**Windows:**
1. Acesse: https://nodejs.org/
2. Baixe o instalador LTS (recomendado)
3. Execute o instalador
4. Marque a opção "Add to PATH"
5. Reinicie o terminal após instalação

**Verificar instalação:**
```powershell
node --version
npm --version
```

Deve retornar algo como:
```
v18.x.x
10.x.x
```

---

### 2. **PostgreSQL (v14 ou superior)**

**Windows:**
1. Acesse: https://www.postgresql.org/download/windows/
2. Baixe o instalador
3. Durante instalação:
   - Defina senha do usuário `postgres` (ex: `postgres123`)
   - Porta padrão: `5432`
   - Instalar pgAdmin (recomendado)

**Criar banco de dados:**
```sql
-- Abrir pgAdmin ou psql
CREATE DATABASE manutencao_mvp;
```

---

## 📦 INSTALAÇÃO DO PROJETO

### Passo 1: Instalar dependências

```powershell
cd "C:\Users\Dell\Desktop\APP MVP"
npm install
```

Isso instalará:
- Express, Prisma, JWT, bcryptjs
- TypeScript e dependências de desenvolvimento
- Total: ~200MB

---

### Passo 2: Configurar variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto:

```powershell
cd "C:\Users\Dell\Desktop\APP MVP"
New-Item -Path ".env" -ItemType File -Force
notepad .env
```

**Conteúdo do `.env`:**

```env
# Database
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/manutencao_mvp?schema=public"

# JWT
JWT_SECRET="sua-chave-super-secreta-aqui-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# App Info
APP_NAME="Manutenção MVP"
```

**⚠️ IMPORTANTE:**
- Altere `postgres123` pela senha que você definiu no PostgreSQL
- Em produção, use uma `JWT_SECRET` forte e aleatória

---

### Passo 3: Configurar Prisma e Banco de Dados

```powershell
# 1. Gerar Prisma Client
npm run prisma:generate

# 2. Criar tabelas no banco de dados
npm run prisma:migrate

# 3. (Opcional) Popular banco com dados de teste
npm run prisma:seed
```

**O que cada comando faz:**

1. **prisma:generate**: Cria o cliente TypeScript para acessar o banco
2. **prisma:migrate**: Cria todas as 18 tabelas no PostgreSQL
3. **prisma:seed**: Insere dados de exemplo (empresa, usuário admin, clientes, equipamentos)

---

### Passo 4: Verificar instalação

```powershell
# Ver tabelas criadas
npm run prisma:studio
```

Abrirá interface web em `http://localhost:5555` mostrando todas as tabelas.

---

## ▶️ EXECUTAR O PROJETO

### Modo Desenvolvimento

```powershell
npm run dev
```

**Saída esperada:**
```
[INFO] Server running on port 3000
[INFO] Database connected
[INFO] API documentation: http://localhost:3000/api
```

### Testar API

**1. Health Check:**
```powershell
curl http://localhost:3000/api/health
```

**2. Login:**
```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"admin@techfrio.com.br\",\"password\":\"123456\"}'
```

**3. Listar clientes:**
```powershell
# Salve o token da resposta do login
$token = "SEU_TOKEN_AQUI"

curl http://localhost:3000/api/clients `
  -H "Authorization: Bearer $token"
```

---

## 🔧 COMANDOS ÚTEIS

### Desenvolvimento

```powershell
# Iniciar servidor com hot-reload
npm run dev

# Compilar TypeScript para JavaScript
npm run build

# Executar versão compilada
npm start
```

### Prisma

```powershell
# Abrir interface visual do banco
npm run prisma:studio

# Gerar cliente Prisma após mudanças no schema
npm run prisma:generate

# Criar nova migration
npm run prisma:migrate

# Popular banco com dados de teste
npm run prisma:seed
```

---

## 📝 TESTANDO A API

### Opção 1: Postman (Recomendado)

1. Baixe Postman: https://www.postman.com/downloads/
2. Abra Postman
3. Vá em **Import** → **File**
4. Selecione: `postman-collection-crud.json`
5. Collection será importada com:
   - 🔐 Auth (Login)
   - 👥 Clientes (8 endpoints)
   - ❄️ Equipamentos (9 endpoints)

**Workflow:**
1. Execute `Login` → Token salvo automaticamente
2. Execute qualquer outro endpoint → Token usado automaticamente

---

### Opção 2: cURL (PowerShell)

**1. Login e salvar token:**
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@techfrio.com.br","password":"123456"}'

$token = $response.data.token
Write-Host "Token: $token"
```

**2. Listar clientes:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients" `
  -Headers @{ "Authorization" = "Bearer $token" }
```

**3. Cadastrar cliente:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients" `
  -Method POST `
  -Headers @{ "Authorization" = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{
    "name": "Restaurante Teste",
    "phone": "+5511999999999",
    "address": "Rua Teste, 123 - São Paulo/SP"
  }'
```

---

## 🐛 SOLUÇÃO DE PROBLEMAS

### Erro: "npm command not found"

**Solução:**
1. Instale Node.js: https://nodejs.org/
2. Reinicie o terminal
3. Verifique: `node --version`

---

### Erro: "Cannot connect to database"

**Causas comuns:**
- PostgreSQL não está rodando
- Senha incorreta no `.env`
- Porta 5432 ocupada

**Soluções:**
1. Verificar se PostgreSQL está rodando:
   ```powershell
   # Windows: Abrir Services.msc
   # Procurar "postgresql-x64-14" ou similar
   # Verificar se está "Running"
   ```

2. Testar conexão manual:
   ```powershell
   psql -U postgres -d manutencao_mvp
   # Digite a senha quando solicitado
   ```

3. Verificar DATABASE_URL no `.env`:
   ```
   DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/manutencao_mvp?schema=public"
   ```

---

### Erro: "Port 3000 already in use"

**Solução 1:** Mudar porta no `.env`:
```env
PORT=3001
```

**Solução 2:** Matar processo na porta 3000:
```powershell
# Ver processos na porta 3000
netstat -ano | findstr :3000

# Matar processo (substitua PID pelo número retornado)
taskkill /PID <PID> /F
```

---

### Erro: Prisma Client não encontrado

**Solução:**
```powershell
npm run prisma:generate
```

---

### Erro: Tabelas não existem

**Solução:**
```powershell
# Resetar banco (⚠️ APAGA TODOS OS DADOS)
npx prisma migrate reset

# Criar tabelas novamente
npm run prisma:migrate

# Popular com dados de teste
npm run prisma:seed
```

---

## 📚 PRÓXIMOS PASSOS

Após instalação bem-sucedida:

1. ✅ Testar endpoints no Postman
2. ✅ Explorar banco com `prisma:studio`
3. ✅ Ler documentação técnica:
   - `AUTH-DOCUMENTATION.md` - Sistema de autenticação
   - `CRUD-API-DOCUMENTATION.md` - Endpoints CRUD
   - `TESTING-GUIDE.md` - Guia de testes

4. 🚀 Próximas features a implementar:
   - Execução de checklists
   - Sistema de ordens de serviço
   - Alertas de manutenção preventiva
   - Dashboard de estatísticas

---

## 🆘 SUPORTE

Se encontrar problemas:

1. Verificar logs do servidor
2. Verificar logs do PostgreSQL
3. Consultar documentação do Prisma: https://www.prisma.io/docs/
4. Verificar versões:
   ```powershell
   node --version  # >= v18
   npm --version   # >= v9
   psql --version  # >= v14
   ```

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Data:** 04/02/2026  
**Versão:** 1.0.0
