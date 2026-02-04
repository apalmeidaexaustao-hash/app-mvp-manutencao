# 🚀 START HERE - QUICK START

**Projeto:** MVP Sistema de Manutenção Técnica B2B SaaS  
**Status:** ✅ Backend API 70% completo  
**Tecnologias:** Node.js + TypeScript + Express + PostgreSQL + Prisma

---

## ⚡ INSTALAÇÃO RÁPIDA (5 MINUTOS)

### **Pré-requisitos:**
1. ✅ Node.js v18+ → [Download](https://nodejs.org/)
2. ✅ PostgreSQL v14+ → [Download](https://postgresql.org/download/)

**⚠️ Node.js não instalado?** → Leia `NODE-INSTALLATION-GUIDE.md`

---

### **Comandos:**

```powershell
# 1. Instalar dependências
cd "C:\Users\Dell\Desktop\APP MVP"
npm install

# 2. Criar .env (copiar de env.example e editar)
Copy-Item env.example .env
notepad .env
# Configure: DATABASE_URL, JWT_SECRET

# 3. Configurar banco
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# 4. Iniciar servidor
npm run dev
```

**Server:** http://localhost:3000

---

## 🧪 TESTAR

### **Login:**
```powershell
$body = '{"email":"admin@techfrio.com.br","password":"123456"}' | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST -ContentType "application/json" -Body $body
$token = $response.data.token
```

### **Listar clientes:**
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/clients" `
  -Headers @{ "Authorization" = "Bearer $token" }
```

### **Postman (Recomendado):**
Importar `postman-collection-crud.json` → 20+ endpoints prontos

---

## 📚 DOCUMENTAÇÃO

**Guias de Instalação:**
- 🚀 `NODE-INSTALLATION-GUIDE.md` - Instalação completa passo a passo
- 🔧 `INSTALLATION-GUIDE.md` - Configuração do projeto
- 📊 `PROJECT-STATUS.md` - Status e métricas do projeto

**Documentação Técnica:**
- 🔐 `src/AUTH-DOCUMENTATION.md` - Sistema de autenticação JWT
- 📋 `src/CRUD-API-DOCUMENTATION.md` - 17 endpoints CRUD (816 linhas)
- 🗄️ `prisma/DATABASE-DOCUMENTATION.md` - 18 models do banco
- ✅ `technical-checklists/DOCUMENTATION.md` - Sistema de checklists
- 📄 `pdf-generator/DOCUMENTATION.md` - Geração de PDFs

**Planejamento:**
- 🎯 `NEXT-STEPS.md` - Roadmap e próximas fases
- 📖 `README.md` - Visão geral completa

---

## 📦 O QUE ESTÁ PRONTO

### **✅ Backend API (17 endpoints)**

**Autenticação JWT:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- POST /api/auth/refresh

**Clientes (8 endpoints):**
- GET /api/clients (listar + busca + paginação)
- GET /api/clients/:id
- POST /api/clients
- PUT /api/clients/:id
- PATCH /api/clients/:id/activate
- PATCH /api/clients/:id/deactivate
- DELETE /api/clients/:id
- GET /api/clients/:id/stats

**Equipamentos (9 endpoints):**
- GET /api/equipments (filtros avançados)
- GET /api/equipments/:id
- POST /api/equipments
- PUT /api/equipments/:id
- PATCH /api/equipments/:id/status
- DELETE /api/equipments/:id
- GET /api/equipments/:id/history
- GET /api/equipments/upcoming-maintenance (mobile)
- GET /api/equipments/client/:clientId (mobile)

### **✅ Infraestrutura:**
- Schema Prisma completo (18 models)
- Checklists técnicos (AC + Câmara Fria)
- Sistema de geração de PDF
- Multi-tenant (isolamento por companyId)
- Validações + Error handling

---

## 🎯 PRÓXIMOS PASSOS

**Fase 1 (AGORA):**
- [ ] Endpoints de Ordem de Serviço
- [ ] Execução de checklist via API
- [ ] Geração de PDF via endpoint

**Fase 2 (Semana 2):**
- [ ] Upload de fotos (AWS S3)
- [ ] Integração WhatsApp Business API

**Fase 3 (Semana 3-4):**
- [ ] App mobile MVP (React Native)
- [ ] Dashboard web

**Detalhes completos:** `NEXT-STEPS.md`

---

## ❌ PROBLEMAS COMUNS

| Erro | Solução |
|------|---------|
| `npm not found` | Instalar Node.js → `NODE-INSTALLATION-GUIDE.md` |
| `Cannot connect to database` | Verificar PostgreSQL rodando + senha no .env |
| `Port 3000 in use` | Mudar PORT=3001 no .env |
| `Prisma Client not found` | `npm run prisma:generate` |

---

## 📊 MÉTRICAS

- **Código backend:** 3.500+ linhas
- **TypeScript:** 100% tipado
- **Documentação:** 8 arquivos .md (~3.000 linhas)
- **Models Prisma:** 18
- **Endpoints:** 21
- **Tempo de desenvolvimento:** ~85 horas

---

## 🔐 CREDENCIAIS DE TESTE

Após executar `npm run prisma:seed`:

- **Email:** admin@techfrio.com.br
- **Senha:** 123456
- **Role:** ADMIN
- **Empresa:** TechFrio Manutenção

Dados criados:
- 2 clientes (restaurantes)
- 3 equipamentos
- 2 templates de checklist

---

## 💡 DICA RÁPIDA

**Primeira vez?**
1. Leia: `NODE-INSTALLATION-GUIDE.md` (instalação Node + PostgreSQL)
2. Execute: Comandos de instalação acima
3. Teste: Postman com `postman-collection-crud.json`
4. Explore: `npm run prisma:studio` (interface visual do banco)
5. Próximo: `NEXT-STEPS.md` (implementar ServiceOrder)

---

**Desenvolvido para:** Técnicos e empresas de manutenção em restaurantes  
**Versão:** 1.0.0  
**Última atualização:** 04/02/2026
