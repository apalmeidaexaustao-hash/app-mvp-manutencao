# 🔐 VARIÁVEIS DE AMBIENTE - CHECKLIST

## 🗄️ BACKEND (RENDER)

### **Obrigatórias:**

```env
# Node Environment
NODE_ENV=production

# Server Port
PORT=3000

# Database (copiar do Render PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/db

# JWT Authentication
JWT_SECRET=[GERAR: 32+ caracteres aleatórios]
JWT_EXPIRES_IN=7d

# CORS (URL do frontend Vercel)
FRONTEND_URL=https://seu-app.vercel.app
```

### **Como gerar JWT_SECRET:**

**PowerShell:**
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Bash/Linux:**
```bash
openssl rand -base64 32
```

**Online:**
https://randomkeygen.com/ → 256-bit WEP Key

---

### **Opcionais (futuro):**

```env
# AWS S3 (upload de fotos)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=

# WhatsApp Business API
WHATSAPP_API_URL=
WHATSAPP_API_KEY=
WHATSAPP_PHONE_NUMBER=

# OpenAI (IA features)
OPENAI_API_KEY=

# SendGrid (emails)
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=

# Sentry (monitoring)
SENTRY_DSN=
```

---

## 🎨 FRONTEND (VERCEL)

### **Obrigatória:**

```env
# Backend API URL (do Render)
VITE_API_URL=https://seu-backend.onrender.com/api
```

**⚠️ IMPORTANTE:**
- Deve terminar com `/api`
- Não incluir `/` no final
- Usar HTTPS em produção

### **Exemplo completo:**
```
VITE_API_URL=https://manutencao-mvp-api.onrender.com/api
```

---

## 📋 CHECKLIST DE CONFIGURAÇÃO

### **Render (Backend):**

- [ ] `NODE_ENV` = production
- [ ] `PORT` = 3000
- [ ] `DATABASE_URL` copiado do PostgreSQL
- [ ] `JWT_SECRET` gerado (32+ caracteres)
- [ ] `JWT_EXPIRES_IN` = 7d
- [ ] `FRONTEND_URL` = URL da Vercel

### **Vercel (Frontend):**

- [ ] `VITE_API_URL` = URL do Render + `/api`

---

## 🔄 ORDEM DE CONFIGURAÇÃO

**1. Primeiro: Render PostgreSQL**
```
Criar DB → Copiar Internal Database URL
```

**2. Segundo: Render Backend**
```
Configurar variáveis (exceto FRONTEND_URL)
Deploy
Copiar URL do backend
```

**3. Terceiro: Vercel Frontend**
```
Configurar VITE_API_URL com URL do backend
Deploy
Copiar URL do frontend
```

**4. Quarto: Atualizar Render**
```
Adicionar FRONTEND_URL com URL da Vercel
Redeploy automático
```

---

## ✅ VALIDAÇÃO

### **Testar variáveis:**

**Backend:**
```powershell
# Health check
curl https://seu-backend.onrender.com/api/health

# Deve retornar JSON com success: true
```

**Frontend:**
```
# Abrir no navegador
https://seu-frontend.vercel.app

# Dev Tools → Console
# Não deve ter erros de CORS
# API calls devem conectar no backend
```

---

## 🐛 ERROS COMUNS

### **"CORS error"**
- ✅ Verifique `FRONTEND_URL` no Render
- ✅ Deve ser exatamente a URL da Vercel
- ✅ Sem `/` no final

### **"Cannot connect to database"**
- ✅ Use **Internal Database URL** (não External)
- ✅ Formato: `postgresql://user:pass@host/db`

### **"API calls failing" no frontend**
- ✅ Verifique `VITE_API_URL` na Vercel
- ✅ Deve terminar com `/api`
- ✅ Usar HTTPS (não HTTP)

### **"Prisma Client not found"**
- ✅ Build Command: `npm install && npm run build && npm run deploy`
- ✅ Includes `prisma generate`

---

## 🔒 SEGURANÇA

### **⚠️ NUNCA COMMITAR:**
- ❌ `.env` files
- ❌ JWT_SECRET
- ❌ DATABASE_URL
- ❌ API keys

### **✅ SEMPRE:**
- ✅ Usar variáveis de ambiente
- ✅ Gerar JWT_SECRET único e forte
- ✅ Usar HTTPS em produção
- ✅ Rotacionar secrets periodicamente

---

## 📊 EXEMPLO COMPLETO

### **Render Backend:**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://manutencao_user:XyZ123@dpg-abc123.oregon-postgres.render.com/manutencao_mvp
JWT_SECRET=aB3dE5fG7hJ9kL1mN3pQ5rS7tU9vW1xY
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://manutencao-mvp.vercel.app
```

### **Vercel Frontend:**
```env
VITE_API_URL=https://manutencao-mvp-api.onrender.com/api
```

---

**Guia completo:** `DEPLOY-GUIDE.md`  
**Deploy rápido:** `DEPLOY-QUICK.md`
