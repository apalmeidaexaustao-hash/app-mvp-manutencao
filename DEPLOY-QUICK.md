# ⚡ DEPLOY RÁPIDO - 10 PASSOS

**Tempo estimado:** 30 minutos

---

## 📋 PRÉ-REQUISITOS

- ✅ Código no GitHub
- ✅ Conta Render
- ✅ Conta Vercel

---

## 🗄️ BACKEND (RENDER)

### **1. Criar PostgreSQL**
```
New + → PostgreSQL
Name: manutencao-mvp-db
Plan: Free
→ Copiar Internal Database URL
```

### **2. Criar Web Service**
```
New + → Web Service
Repository: manutencao-mvp
Runtime: Node
Build: npm install && npm run build && npm run deploy
Start: npm start
```

### **3. Variáveis de Ambiente**
```
NODE_ENV=production
DATABASE_URL=[Internal DB URL]
JWT_SECRET=[32+ caracteres aleatórios]
JWT_EXPIRES_IN=7d
FRONTEND_URL=[vai preencher depois]
```

### **4. Deploy**
```
Create Web Service
→ Aguardar 5-10min
→ Copiar URL: https://xxx.onrender.com
```

---

## 🎨 FRONTEND (VERCEL)

### **5. Importar Projeto**
```
Add New → Project
Repository: manutencao-mvp
Framework: Vite
Root Directory: frontend
```

### **6. Variável de Ambiente**
```
VITE_API_URL=https://xxx.onrender.com/api
```

### **7. Deploy**
```
Deploy
→ Aguardar 2-5min
→ Copiar URL: https://xxx.vercel.app
```

---

## 🔧 FINALIZAR

### **8. Atualizar CORS**
```
Render → Environment
FRONTEND_URL=https://xxx.vercel.app
→ Save (vai redeploy)
```

### **9. Executar Seed**
```
Render → Shell
npm run prisma:seed
```

### **10. Testar**
```
Acesse: https://xxx.vercel.app
Login: admin@techfrio.com.br / 123456
```

---

## ✅ PRONTO!

**Backend:** https://xxx.onrender.com  
**Frontend:** https://xxx.vercel.app  
**Custo:** $0/mês (Free Tier)

---

**Guia completo:** `DEPLOY-GUIDE.md`
