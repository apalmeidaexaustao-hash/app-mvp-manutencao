# 🚀 GUIA DE DEPLOY - MVP MANUTENÇÃO

**Data:** 04/02/2026  
**Versão:** 1.0.0

---

## 📋 VISÃO GERAL

Este guia explica como fazer deploy do MVP completo:
- **Backend:** Render (Node.js + PostgreSQL)
- **Frontend:** Vercel (React + Vite)

---

## 🎯 PRÉ-REQUISITOS

### **Contas necessárias:**
1. ✅ [GitHub](https://github.com) - Para repositório do código
2. ✅ [Render](https://render.com) - Para backend + banco
3. ✅ [Vercel](https://vercel.com) - Para frontend

**Todas são gratuitas para começar!**

---

## 📦 PARTE 1: PREPARAR REPOSITÓRIO GITHUB

### **1.1 Criar repositório no GitHub**

```powershell
# 1. Inicializar Git
cd "C:\Users\Dell\Desktop\APP MVP"
git init
git add .
git commit -m "Initial commit - MVP Manutenção Técnica"

# 2. Criar repositório no GitHub (via web):
# https://github.com/new
# Nome: manutencao-mvp
# Público ou Privado

# 3. Conectar e enviar
git remote add origin https://github.com/SEU_USUARIO/manutencao-mvp.git
git branch -M main
git push -u origin main
```

### **1.2 Estrutura do repositório**

```
manutencao-mvp/
├── src/           # Backend
├── prisma/        # Schema + migrations
├── frontend/      # Frontend React
├── package.json   # Backend dependencies
└── .gitignore
```

---

## 🗄️ PARTE 2: DEPLOY DO BACKEND (RENDER)

### **2.1 Criar conta no Render**

1. Acesse: https://render.com
2. Sign up com GitHub
3. Autorize acesso ao repositório

### **2.2 Criar PostgreSQL Database**

1. No dashboard Render, clique **"New +"** → **"PostgreSQL"**

2. Configure:
   - **Name:** `manutencao-mvp-db`
   - **Database:** `manutencao_mvp`
   - **User:** `manutencao_user`
   - **Region:** escolha o mais próximo
   - **Plan:** **Free**

3. Clique **"Create Database"**

4. **IMPORTANTE:** Copie a **Internal Database URL** (formato: `postgresql://...`)

### **2.3 Criar Web Service (Backend)**

1. No dashboard, clique **"New +"** → **"Web Service"**

2. Conecte o repositório:
   - Autorize Render no GitHub
   - Selecione `manutencao-mvp`

3. Configure:
   ```
   Name: manutencao-mvp-api
   Region: [mesmo do banco]
   Branch: main
   Root Directory: [deixe vazio]
   Runtime: Node
   Build Command: npm install && npm run build && npm run deploy
   Start Command: npm start
   Plan: Free
   ```

4. **Environment Variables (Variáveis de Ambiente):**

   Clique em **"Advanced"** → **"Add Environment Variable"**

   Adicione:

   ```
   NODE_ENV=production
   PORT=3000
   
   DATABASE_URL=[Cole a Internal Database URL do passo 2.4]
   
   JWT_SECRET=[Gere uma chave forte: 32+ caracteres aleatórios]
   JWT_EXPIRES_IN=7d
   
   FRONTEND_URL=[Vai ser preenchido depois com URL da Vercel]
   ```

   **Para gerar JWT_SECRET seguro:**
   ```powershell
   # PowerShell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
   ```

5. Clique **"Create Web Service"**

6. Aguarde o build (~5-10 minutos)

7. Quando terminar, copie a URL:
   - Exemplo: `https://manutencao-mvp-api.onrender.com`

### **2.4 Executar migrations**

```powershell
# Localmente, execute:
$env:DATABASE_URL="[Cole a External Database URL do Render]"
npx prisma migrate deploy
npx prisma db seed
```

**OU** via Render Shell:
1. No dashboard do Web Service
2. Clique em **"Shell"**
3. Execute:
   ```bash
   npm run deploy
   npm run prisma:seed
   ```

### **2.5 Testar Backend**

```powershell
# Health check
Invoke-RestMethod -Uri "https://manutencao-mvp-api.onrender.com/api/health"
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "..."
}
```

---

## 🎨 PARTE 3: DEPLOY DO FRONTEND (VERCEL)

### **3.1 Criar conta na Vercel**

1. Acesse: https://vercel.com
2. Sign up com GitHub
3. Autorize acesso ao repositório

### **3.2 Importar projeto**

1. No dashboard Vercel, clique **"Add New..."** → **"Project"**

2. Selecione o repositório: `manutencao-mvp`

3. Configure:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables:**

   Clique em **"Environment Variables"**

   Adicione:
   ```
   VITE_API_URL=[Cole a URL do backend Render]/api
   ```

   Exemplo:
   ```
   VITE_API_URL=https://manutencao-mvp-api.onrender.com/api
   ```

5. Clique **"Deploy"**

6. Aguarde o build (~2-5 minutos)

7. Quando terminar, copie a URL:
   - Exemplo: `https://manutencao-mvp.vercel.app`

### **3.3 Atualizar CORS no Backend**

1. Volte no Render
2. Acesse o Web Service do backend
3. Vá em **"Environment"**
4. Edite `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://manutencao-mvp.vercel.app
   ```
5. Salve (vai fazer redeploy automático)

### **3.4 Testar Frontend**

1. Acesse: `https://manutencao-mvp.vercel.app`
2. Login: `admin@techfrio.com.br` / `123456`
3. Teste criar cliente, equipamento, OS

---

## ✅ PARTE 4: VERIFICAÇÃO PÓS-DEPLOY

### **Checklist:**

**Backend:**
- [ ] Health check responde: `GET /api/health`
- [ ] Login funciona: `POST /api/auth/login`
- [ ] Listar clientes: `GET /api/clients`
- [ ] CORS permite frontend
- [ ] Banco de dados conectado
- [ ] Migrations executadas
- [ ] Seed executado

**Frontend:**
- [ ] Site carrega sem erros
- [ ] Login funciona
- [ ] Navegação funciona
- [ ] Criar cliente funciona
- [ ] Criar equipamento funciona
- [ ] Criar OS funciona
- [ ] API calls conectam no backend

---

## 🔧 CONFIGURAÇÕES ADICIONAIS

### **4.1 Custom Domain (Opcional)**

**Vercel:**
1. Settings → Domains
2. Add Domain
3. Configure DNS (A/CNAME records)

**Render:**
1. Settings → Custom Domain
2. Add Domain
3. Configure DNS

### **4.2 SSL/HTTPS**

✅ **Automático!** Render e Vercel fornecem SSL grátis.

### **4.3 Logs**

**Render:**
- Dashboard → Logs (real-time)

**Vercel:**
- Dashboard → Deployments → View Logs

---

## 🐛 TROUBLESHOOTING

### **Erro: "Cannot connect to database"**

**Solução:**
1. Verifique `DATABASE_URL` no Render
2. Use **Internal Database URL** (não External)
3. Formato: `postgresql://user:pass@host/db`

---

### **Erro: "CORS error" no frontend**

**Solução:**
1. Verifique `FRONTEND_URL` no Render
2. Deve ser exatamente a URL da Vercel (sem `/` no final)
3. Faça redeploy do backend após alterar

---

### **Erro: "Prisma Client not found"**

**Solução:**
1. No Render, adicione ao Build Command:
   ```
   npm install && npm run build && npm run deploy
   ```
2. `npm run deploy` executa `prisma migrate deploy`

---

### **Erro: "Module not found" no frontend**

**Solução:**
1. Verifique Root Directory: `frontend`
2. Verifique Build Command: `npm run build`
3. Verifique Output Directory: `dist`

---

### **Backend demora a responder (sleep mode)**

**Causa:** Render Free Tier dorme após 15min de inatividade

**Soluções:**
1. Upgrade para paid plan ($7/mês)
2. Use cron job para manter ativo:
   - https://uptimerobot.com (grátis)
   - Ping a cada 14 minutos

---

## 💰 CUSTOS

### **Plano Gratuito:**

| Serviço | Free Tier | Limites |
|---------|-----------|---------|
| **Render PostgreSQL** | ✅ Grátis | 90 dias, depois $7/mês |
| **Render Web Service** | ✅ Grátis | 750h/mês, sleep após 15min |
| **Vercel** | ✅ Grátis | 100GB bandwidth/mês |

**Custo inicial:** $0  
**Após 90 dias:** ~$7/mês (só banco)

### **Plano Pago (Recomendado):**

| Serviço | Paid Plan | Benefícios |
|---------|-----------|------------|
| **Render PostgreSQL** | $7/mês | Backup automático, sem limite de tempo |
| **Render Web Service** | $7/mês | Sem sleep, mais recursos |
| **Vercel Pro** | $20/mês | Analytics, mais bandwidth |

**Total:** $14-34/mês

---

## 📊 MONITORAMENTO

### **Render Dashboard:**
- CPU/Memory usage
- Request logs
- Error logs
- Database connections

### **Vercel Dashboard:**
- Page views
- Bandwidth usage
- Build logs
- Function invocations

---

## 🔄 REDEPLOY

### **Backend (Render):**
```powershell
# Commit e push
git add .
git commit -m "Update backend"
git push

# Render faz deploy automático
```

### **Frontend (Vercel):**
```powershell
# Commit e push
git add .
git commit -m "Update frontend"
git push

# Vercel faz deploy automático
```

---

## 🎯 URLS FINAIS

**Backend API:**
```
https://manutencao-mvp-api.onrender.com/api
```

**Frontend:**
```
https://manutencao-mvp.vercel.app
```

**Credenciais de teste:**
- Email: `admin@techfrio.com.br`
- Senha: `123456`

---

## 📚 RECURSOS

**Render Docs:** https://render.com/docs  
**Vercel Docs:** https://vercel.com/docs  
**Prisma Deploy:** https://www.prisma.io/docs/guides/deployment

---

## 🎉 PRÓXIMOS PASSOS

Após deploy bem-sucedido:

1. ✅ Configurar domínio customizado
2. ✅ Configurar backup automático do banco
3. ✅ Implementar monitoring (Sentry)
4. ✅ Configurar CI/CD (GitHub Actions)
5. ✅ Adicionar analytics (Google Analytics)
6. ✅ Configurar email (SendGrid)
7. ✅ Configurar WhatsApp Business API

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Deploy:** Render + Vercel  
**Custo inicial:** $0  
**Data:** 04/02/2026
