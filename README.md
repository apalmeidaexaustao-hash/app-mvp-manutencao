# 🚀 MVP - Sistema de Manutenção Técnica

Sistema SaaS B2B para gestão de manutenção de equipamentos de restaurantes e fast-food.

---

## 🎯 INÍCIO RÁPIDO

**Primeira vez aqui?**

1. 📖 **Leia:** `START-HERE.md` - Início rápido em 5 minutos
2. 📚 **Explore:** `INDEX.md` - Índice completo da documentação
3. 🔧 **Instale:** `NODE-INSTALLATION-GUIDE.md` - Se Node.js não estiver instalado

**Já tem o ambiente pronto?**

```powershell
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

---

## 📋 Sobre o Projeto

Aplicativo voltado para **técnicos autônomos e empresas de manutenção** que atendem restaurantes, focado em:

- Ar-condicionado
- Câmara fria
- Freezers e geladeiras industriais
- Equipamentos de cozinha
- Painéis elétricos

### 🎯 Problemas que o App Resolve

- ✅ Perda de histórico de manutenção
- ✅ Falta de controle de preventivas
- ✅ Orçamentos pouco profissionais
- ✅ Esquecimento de revisões
- ✅ Risco de parada de equipamentos críticos

---

## 🏗️ Arquitetura

### **Stack Tecnológica:**

- **Backend:** Node.js + TypeScript + Express
- **Banco de Dados:** PostgreSQL + Prisma ORM
- **Documentos:** Sistema de geração de PDF profissional
- **Checklists:** Modelo modular e escalável

### **Estrutura de Pastas:**

```
APP MVP/
├── src/                         # Backend API
│   ├── config/                 # Configurações
│   ├── controllers/            # Controllers REST
│   ├── middlewares/            # Middlewares Express
│   ├── routes/                 # Rotas da API
│   ├── services/               # Lógica de negócio
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utilitários
│   ├── app.ts                  # Express app
│   └── server.ts               # HTTP server
│
├── prisma/                      # Banco de dados
│   ├── schema.prisma           # Schema completo (683 linhas)
│   ├── seed.ts                 # Dados de exemplo
│   └── DATABASE-DOCUMENTATION.md
│
├── technical-checklists/        # Sistema de checklists
│   ├── checklist-model.ts      # Modelo genérico
│   ├── air-conditioning-checklist.ts
│   ├── cold-room-checklist.ts
│   ├── index.ts
│   └── DOCUMENTATION.md
│
├── pdf-generator/               # Geração de PDFs
│   ├── pdf-types.ts
│   ├── maintenance-report-generator.ts
│   ├── quotation-generator.ts
│   ├── pdf-service.ts
│   ├── examples.ts
│   ├── index.ts
│   └── DOCUMENTATION.md
│
├── package.json
├── tsconfig.json
└── env.example
```

---

## 🗄️ Banco de Dados

### **Models Principais:**

1. **User, Company, Technician** - Autenticação e usuários
2. **Client, Branch, Equipment** - Clientes e equipamentos
3. **ChecklistTemplate, Section, Item** - Checklists modulares
4. **ServiceOrder, ChecklistExecution** - Ordens de serviço
5. **MaintenanceReport, Quotation** - Documentos e PDFs
6. **MaintenanceHistory, MaintenanceAlert** - Histórico e alertas

### **Relacionamentos:**

```
Company → User → Technician
Company → Client → Branch → Equipment
Equipment → ServiceOrder → ChecklistExecution → Finding
ServiceOrder → MaintenanceReport + Quotation
Equipment → MaintenanceAlert (preventiva automática)
```

---

## 📋 Checklists Técnicos

### **Sistema Modular:**

**Modelo Genérico** que serve para qualquer equipamento:
- 7 tipos de verificação
- 7 categorias técnicas
- 4 níveis de criticidade
- Medições com faixas e tolerâncias
- Sugestões de IA
- Conformidade regulatória (NBR, NR, ANVISA)

### **Checklists Implementados:**

1. **Ar-condicionado Split/VRF**
   - 27 itens em 5 seções
   - Duração: 45 minutos

2. **Câmara Fria**
   - 36 itens em 6 seções
   - Duração: 60 minutos
   - Inclui verificações de segurança críticas (NR-36)

---

## 📄 Sistema de PDF

### **Documentos Profissionais:**

**1. Relatório Técnico de Manutenção**
- Cabeçalho com logo da empresa
- Resumo visual com taxa de conformidade
- Achados críticos destacados
- Checklist completo com status visual
- Recomendações + IA
- Próxima manutenção
- Assinaturas (técnico + cliente)

**2. Orçamento Profissional**
- Número e validade em destaque
- Problemas identificados
- Tabela de itens (peças + serviços + mão de obra)
- Badges de urgência
- Totais com desconto
- Condições comerciais
- Recomendações de IA

### **Design Profissional:**
- Layout limpo e moderno
- Cores corporativas personalizáveis
- Badges visuais de status
- Gradientes elegantes
- Print-friendly (A4)

---

## 🤖 Integração com IA

### **Funcionalidades de IA:**

1. **Sugestão de Checklist** - Automática conforme equipamento
2. **Geração de Texto Técnico** - Para orçamentos
3. **Alertas Preditivos** - Baseado em histórico
4. **Recomendações Técnicas** - Padrões de falha
5. **Estimativa de Custos** - Por problema identificado

**Exemplo de Recomendações:**
```
🤖 IA detectou:
- Este equipamento apresentou falha similar há 4 meses
- Upgrade para componente digital reduz manutenções em 60%
- Troca de vedação economiza R$ 80/mês em energia
```

---

## 📱 Integração WhatsApp

### **Mensagens Automáticas:**

Após cada manutenção/orçamento, o sistema:
1. Gera PDF profissional
2. Cria mensagem personalizada
3. Envia via WhatsApp Business API
4. Cliente visualiza no celular
5. Cliente aprova via mensagem

---

## 🔄 Fluxo Completo

```
1. Dashboard mostra alerta de preventiva
   ↓
2. Técnico cria Ordem de Serviço
   ↓
3. Técnico executa checklist no app
   ↓
4. Sistema identifica problemas
   ↓
5. IA sugere ações e custos
   ↓
6. Técnico revisa e aprova
   ↓
7. PDF gerado automaticamente
   ↓
8. Envio via WhatsApp
   ↓
9. Cliente aprova
   ↓
10. Sistema agenda próxima preventiva
```

---

## 🚀 Setup do Projeto

### **⚠️ Pré-requisitos:**
- Node.js v18+ ([Download](https://nodejs.org/))
- PostgreSQL v14+ ([Download](https://www.postgresql.org/download/))

**📘 Guia completo:** Veja `INSTALLATION-GUIDE.md` para instruções detalhadas de instalação no Windows/Linux/Mac.

---

### **Resumo de Instalação:**

**1. Instalar dependências**

```powershell
cd "C:\Users\Dell\Desktop\APP MVP"
npm install
```

**2. Configurar variáveis de ambiente**

Crie `.env` na raiz:

```env
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/manutencao_mvp?schema=public"
JWT_SECRET="sua-chave-secreta-forte"
JWT_EXPIRES_IN="7d"
PORT=3000
NODE_ENV="development"
```

**3. Configurar banco de dados**

```powershell
# Gerar Prisma Client
npm run prisma:generate

# Criar tabelas
npm run prisma:migrate

# Popular com dados de teste
npm run prisma:seed
```

**Credenciais de teste:**
- Email: `admin@techfrio.com.br`
- Senha: `123456`

**4. Iniciar servidor**

```powershell
npm run dev
```

Servidor rodando em: `http://localhost:3000`

**5. Testar API**

Importe `postman-collection-crud.json` no Postman para testar todos os endpoints.

```powershell
# Health check
curl http://localhost:3000/api/health
```

**6. Visualizar banco (opcional)**

```powershell
npm run prisma:studio
```

Interface visual em: `http://localhost:5555`

---

## 📊 Dados de Exemplo (Seed)

Ao executar `npm run prisma:seed`, o banco é populado com:

- ✅ 1 empresa (TechFrio Manutenção)
- ✅ 3 usuários (1 admin + 2 técnicos)
- ✅ 2 clientes (Restaurante Sabor & Cia, Fast Food Express)
- ✅ 2 filiais
- ✅ 3 equipamentos (Câmara Fria, Ar-condicionado, Freezer)
- ✅ 2 templates de checklist (AC + Câmara Fria)
- ✅ 4 itens de checklist de exemplo
- ✅ 1 ordem de serviço concluída
- ✅ 2 alertas de manutenção preventiva

---

## 📋 Funcionalidades Implementadas

### ✅ **Endpoints CRUD Completos**
- Clientes (8 endpoints)
- Equipamentos (9 endpoints)
- Busca avançada + paginação
- Filtros multi-critério
- Endpoints otimizados para mobile
- Estatísticas e histórico

### ✅ **Sistema de Autenticação JWT**
- Cadastro e login seguros
- Tokens JWT com expiração
- Middleware de proteção de rotas
- Controle de acesso por roles (ADMIN, MANAGER, TECHNICIAN, CLIENT)
- Multi-tenant (isolamento por empresa)
- Validação de assinatura automática
- Senhas com bcrypt hash

### ✅ **Sistema de Checklists**
- Modelo genérico e escalável
- 2 checklists completos (AC + Câmara Fria)
- Sistema de criticidade e alertas
- Conformidade legal (NBR, NR, ANVISA)

### ✅ **Banco de Dados Completo**
- Schema Prisma com 18 models
- Relacionamentos complexos
- Sistema de histórico
- Alertas de preventiva automáticos

### ✅ **Geração de PDF Profissional**
- Relatório técnico completo
- Orçamento profissional
- Design moderno e limpo
- Mensagens WhatsApp prontas

---

## 🔐 API Endpoints

### **Autenticação (JWT)**

```
POST   /api/auth/register      # Cadastro de usuário
POST   /api/auth/login         # Login
GET    /api/auth/me            # Dados do usuário autenticado
POST   /api/auth/refresh       # Renovar token
```

**Documentação completa:** `src/AUTH-DOCUMENTATION.md`

---

### **👥 Clientes (Restaurantes)**

```
GET    /api/clients                    # Listar clientes (paginado + busca)
GET    /api/clients/:id                # Detalhes do cliente
POST   /api/clients                    # Cadastrar cliente
PUT    /api/clients/:id                # Atualizar cliente
PATCH  /api/clients/:id/activate       # Ativar cliente
PATCH  /api/clients/:id/deactivate     # Desativar cliente
DELETE /api/clients/:id                # Excluir cliente
GET    /api/clients/:id/stats          # Estatísticas do cliente
```

**Documentação completa:** `src/CRUD-API-DOCUMENTATION.md`

---

### **❄️ Equipamentos**

```
GET    /api/equipments                      # Listar equipamentos (paginado + filtros)
GET    /api/equipments/:id                  # Detalhes do equipamento
POST   /api/equipments                      # Cadastrar equipamento
PUT    /api/equipments/:id                  # Atualizar equipamento
PATCH  /api/equipments/:id/status           # Atualizar status
DELETE /api/equipments/:id                  # Excluir equipamento
GET    /api/equipments/:id/history          # Histórico de manutenções
GET    /api/equipments/upcoming-maintenance # Manutenções próximas (mobile)
GET    /api/equipments/client/:clientId     # Equipamentos por cliente (mobile)
```

**Documentação completa:** `src/CRUD-API-DOCUMENTATION.md`

---

### **📋 Ordens de Serviço** ⭐ NOVO

```
POST   /api/service-orders                  # Criar OS
GET    /api/service-orders                  # Listar (filtros + paginação)
GET    /api/service-orders/:id              # Detalhes
PUT    /api/service-orders/:id              # Atualizar
PATCH  /api/service-orders/:id/status       # Alterar status
DELETE /api/service-orders/:id              # Excluir
GET    /api/service-orders/technician/me    # Minhas OS (mobile) 📱
GET    /api/service-orders/calendar         # Agenda (mobile) 📱
```

**Documentação completa:** `src/SERVICE-ORDER-API.md`

---

### **📱 Fluxos Mobile Otimizados:**

**Fluxo 1: Técnico chegando no cliente**
```
GET /api/clients/:id                    → Dados + endereço
GET /api/equipments/client/:clientId    → Listar equipamentos
GET /api/equipments/:id                 → Detalhes + histórico
```

**Fluxo 2: Agenda do dia**
```
GET /api/service-orders/technician/me?startDate=2026-02-10&endDate=2026-02-10
→ Todas as OS do técnico para hoje
```

**Fluxo 3: Calendário mensal**
```
GET /api/service-orders/calendar?startDate=2026-02-01&endDate=2026-02-28
→ OS agrupadas por data
```

**Fluxo 4: Cadastrar equipamento em campo**
```
GET  /api/clients?search=nome           → Buscar cliente
POST /api/equipments                    → Cadastrar equipamento
```

---

### **🔒 Segurança Multi-Tenant**

Todos os endpoints:
- ✅ Requerem autenticação JWT
- ✅ Isolamento automático por `companyId`
- ✅ Validação de assinatura ativa
- ✅ Proteção contra SQL injection (Prisma)

---

### **🧪 Testando a API**

**Postman (Recomendado):**
1. Importe `postman-collection-crud.json`
2. Execute `Login` (token salvo automaticamente)
3. Teste qualquer endpoint

**PowerShell:**
```powershell
# Login
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST -ContentType "application/json" `
  -Body '{"email":"admin@techfrio.com.br","password":"123456"}'

$token = $response.data.token

# Listar clientes
Invoke-RestMethod -Uri "http://localhost:3000/api/clients" `
  -Headers @{ "Authorization" = "Bearer $token" }
```

---

## 🎯 Próximos Passos

### **Backend:**
- [x] Criar API REST com Express
- [x] Implementar autenticação JWT
- [x] Endpoints CRUD completos (clientes, equipamentos)
- [ ] Endpoints de Ordem de Serviço (ServiceOrder)
- [ ] Endpoints de execução de checklist
- [ ] Upload de fotos (AWS S3)
- [ ] Integração WhatsApp Business API
- [ ] Webhooks Stripe (pagamentos)

### **Frontend:**
- [ ] App mobile com React Native
- [ ] Dashboard web com React
- [ ] Interface de execução de checklist
- [ ] Geração de PDF no cliente
- [ ] Notificações push

### **IA:**
- [ ] Integração OpenAI API
- [ ] Sistema de recomendações
- [ ] Análise preditiva de falhas
- [ ] Estimativa automática de custos

---

## 💰 Modelo de Negócio

**SaaS por assinatura mensal:**

- **FREE:** 1 técnico, 5 equipamentos
- **INDIVIDUAL:** R$ 49/mês - 1 técnico, equipamentos ilimitados
- **BUSINESS:** R$ 149/mês - 5 técnicos, equipamentos ilimitados
- **ENTERPRISE:** R$ 399/mês - Técnicos ilimitados + IA avançada

---

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através de:
- Email: contato@manutencao.app
- WhatsApp: +55 11 99999-9999

---

## 📄 Licença

MIT License - Livre para uso comercial

---

**Desenvolvido com ❤️ para profissionais de manutenção técnica**
