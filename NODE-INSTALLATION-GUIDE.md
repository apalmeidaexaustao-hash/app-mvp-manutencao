# ⚠️ NODE.JS NÃO ESTÁ INSTALADO

## 🔍 DIAGNÓSTICO

Você tentou executar `npm run dev` e recebeu o erro:

```
npm : O termo 'npm' não é reconhecido como nome de cmdlet, função,
arquivo de script ou programa operável.
```

**Causa:** Node.js não está instalado no sistema ou não está no PATH.

---

## ✅ SOLUÇÃO COMPLETA

### **Passo 1: Baixar Node.js**

**Opção A: Instalador Oficial (Recomendado)**

1. Acesse: https://nodejs.org/
2. Clique em **"Download Node.js (LTS)"** (versão v18.x.x ou superior)
3. Arquivo baixado: `node-v18.x.x-x64.msi` (~30 MB)

**Opção B: Winget (se disponível)**

```powershell
winget install OpenJS.NodeJS.LTS
```

---

### **Passo 2: Instalar Node.js**

1. Execute o arquivo `.msi` baixado
2. Siga o assistente de instalação:
   - ✅ Aceite os termos de licença
   - ✅ Mantenha o caminho padrão: `C:\Program Files\nodejs\`
   - ✅ **IMPORTANTE:** Marque a opção **"Add to PATH"**
   - ✅ Marque a opção **"Automatically install necessary tools"**
3. Clique em **Install**
4. Aguarde a instalação (~2 minutos)
5. Clique em **Finish**

---

### **Passo 3: Reiniciar Terminal**

**⚠️ CRÍTICO:** Você DEVE fechar e reabrir o PowerShell/terminal para que o PATH seja atualizado.

1. Feche todas as janelas do PowerShell
2. Abra uma nova janela do PowerShell
3. Teste se Node.js foi instalado corretamente

---

### **Passo 4: Verificar Instalação**

```powershell
node --version
npm --version
```

**Saída esperada:**
```
v18.19.0  (ou superior)
10.2.3    (ou superior)
```

Se você vir os números de versão, a instalação foi bem-sucedida! ✅

---

### **Passo 5: Instalar Dependências do Projeto**

```powershell
cd "C:\Users\Dell\Desktop\APP MVP"
npm install
```

**O que acontece:**
- npm baixa ~200 MB de dependências
- Cria a pasta `node_modules/`
- Instala: Express, Prisma, TypeScript, etc.
- Tempo estimado: 3-5 minutos

**Saída esperada:**
```
added 450 packages, and audited 451 packages in 2m
found 0 vulnerabilities
```

---

### **Passo 6: Configurar PostgreSQL**

**Se você ainda não tem PostgreSQL instalado:**

1. Baixe: https://www.postgresql.org/download/windows/
2. Execute o instalador
3. Durante instalação:
   - **Senha do postgres:** Defina uma senha (ex: `postgres123`)
   - **Porta:** Mantenha `5432`
   - **Locale:** Padrão do sistema
4. Após instalação, crie o banco de dados:

**Opção A: pgAdmin (Interface Visual)**
1. Abra pgAdmin
2. Conecte com usuário `postgres` e sua senha
3. Clique com botão direito em "Databases"
4. Create → Database
5. Nome: `manutencao_mvp`
6. Save

**Opção B: psql (Linha de comando)**
```powershell
psql -U postgres
# Digite a senha quando solicitado

CREATE DATABASE manutencao_mvp;
\q
```

---

### **Passo 7: Configurar Variáveis de Ambiente**

```powershell
cd "C:\Users\Dell\Desktop\APP MVP"

# Criar arquivo .env
Copy-Item env.example .env

# Editar .env
notepad .env
```

**Configure as seguintes variáveis:**

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/manutencao_mvp?schema=public"
JWT_SECRET="chave-secreta-forte-aqui-mude-em-producao"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

**⚠️ IMPORTANTE:**
- Substitua `SUA_SENHA_AQUI` pela senha que você definiu no PostgreSQL
- Altere `JWT_SECRET` para uma string aleatória longa

**Salve e feche o arquivo.**

---

### **Passo 8: Configurar Banco de Dados**

```powershell
# 1. Gerar Prisma Client (tipos TypeScript)
npm run prisma:generate

# 2. Criar todas as tabelas no banco
npm run prisma:migrate

# 3. Popular banco com dados de exemplo
npm run prisma:seed
```

**O que cada comando faz:**

1. **prisma:generate** → Cria o cliente TypeScript para acessar o banco
2. **prisma:migrate** → Cria as 18 tabelas no PostgreSQL
3. **prisma:seed** → Insere dados de teste:
   - 1 empresa: TechFrio Manutenção
   - 3 usuários (1 admin + 2 técnicos)
   - 2 clientes (restaurantes)
   - 3 equipamentos
   - 2 templates de checklist
   - 1 ordem de serviço

**Credenciais de teste criadas:**
- Email: `admin@techfrio.com.br`
- Senha: `123456`

---

### **Passo 9: Iniciar Servidor**

```powershell
npm run dev
```

**Saída esperada:**
```
[INFO] Server running on port 3000
[INFO] Database connected
```

**O servidor está rodando!** ✅

URL base: `http://localhost:3000`

---

### **Passo 10: Testar API**

**Teste 1: Health Check**

```powershell
# Em outro terminal PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/api/health"
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

**Teste 2: Login**

```powershell
$body = @{
  email = "admin@techfrio.com.br"
  password = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body

$token = $response.data.token
Write-Host "Token obtido: $token"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "name": "Admin TechFrio",
      "email": "admin@techfrio.com.br",
      "role": "ADMIN"
    }
  }
}
```

---

**Teste 3: Listar Clientes**

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients" `
  -Headers @{ "Authorization" = "Bearer $token" }
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Restaurante Sabor & Cia",
      "phone": "+5511912345678",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2
  }
}
```

---

## 🎉 SUCESSO!

Se você chegou até aqui e viu as respostas JSON acima, **PARABÉNS!** 🎊

Sua API está funcionando perfeitamente!

---

## 🧪 PRÓXIMOS PASSOS

### **1. Testar com Postman (Recomendado)**

1. Baixe Postman: https://www.postman.com/downloads/
2. Instale e abra
3. Clique em **Import**
4. Selecione o arquivo: `C:\Users\Dell\Desktop\APP MVP\postman-collection-crud.json`
5. Collection será importada com 20+ requests
6. Execute `Login` → Token salvo automaticamente
7. Teste todos os endpoints

---

### **2. Visualizar Banco de Dados**

```powershell
npm run prisma:studio
```

Abrirá interface web em `http://localhost:5555` onde você pode:
- Ver todas as tabelas
- Editar dados manualmente
- Explorar relacionamentos

---

### **3. Ler Documentação**

- **README.md** - Visão geral do projeto
- **INSTALLATION-GUIDE.md** - Este guia completo
- **CRUD-API-DOCUMENTATION.md** - Todos os endpoints
- **AUTH-DOCUMENTATION.md** - Sistema de autenticação
- **PROJECT-STATUS.md** - Status e próximos passos

---

## ❌ PROBLEMAS COMUNS

### **Erro: "Cannot connect to database"**

**Causa:** PostgreSQL não está rodando ou senha incorreta.

**Solução:**

1. Abrir `Services.msc` (Windows + R → `services.msc`)
2. Procurar `postgresql-x64-14` (ou similar)
3. Verificar se está "Running"
4. Se não, clicar com botão direito → Start

5. Verificar `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/manutencao_mvp?schema=public"
   ```

6. Testar conexão:
   ```powershell
   psql -U postgres -d manutencao_mvp
   # Digite senha
   # Se conectar, está OK
   ```

---

### **Erro: "Port 3000 already in use"**

**Causa:** Outro processo está usando a porta 3000.

**Solução 1:** Mudar porta no `.env`:
```env
PORT=3001
```

**Solução 2:** Matar o processo:
```powershell
# Ver qual processo está na porta 3000
netstat -ano | findstr :3000

# Matar processo (substitua <PID> pelo número)
taskkill /PID <PID> /F
```

---

### **Erro: "Prisma Client not found"**

**Causa:** Cliente Prisma não foi gerado.

**Solução:**
```powershell
npm run prisma:generate
```

---

### **Erro: "Module not found"**

**Causa:** Dependências não foram instaladas.

**Solução:**
```powershell
cd "C:\Users\Dell\Desktop\APP MVP"
npm install
```

---

## 📞 PRECISA DE AJUDA?

**Documentação completa:**
- `INSTALLATION-GUIDE.md` - Guia de instalação
- `PROJECT-STATUS.md` - Status do projeto
- `NEXT-STEPS.md` - Próximos passos

**Arquivos importantes:**
- `package.json` - Dependências e scripts
- `prisma/schema.prisma` - Estrutura do banco
- `.env` - Configurações (CRIE se não existe)

---

## ✅ CHECKLIST DE INSTALAÇÃO

Marque cada item quando completar:

- [ ] Node.js v18+ instalado
- [ ] PostgreSQL v14+ instalado
- [ ] Banco `manutencao_mvp` criado
- [ ] `npm install` executado (node_modules/ criado)
- [ ] Arquivo `.env` criado e configurado
- [ ] `npm run prisma:generate` executado
- [ ] `npm run prisma:migrate` executado
- [ ] `npm run prisma:seed` executado
- [ ] `npm run dev` iniciou sem erros
- [ ] Health check retornou JSON
- [ ] Login funcionou e retornou token
- [ ] Listar clientes retornou dados

**Se todos os itens estão marcados, você está pronto! 🚀**

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Suporte:** Veja documentação na pasta do projeto  
**Versão:** 1.0.0
