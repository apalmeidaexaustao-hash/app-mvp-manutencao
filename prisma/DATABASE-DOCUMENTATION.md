# 🗄️ BANCO DE DADOS - DOCUMENTAÇÃO COMPLETA

## 📊 Visão Geral

Sistema de banco de dados completo usando **Prisma ORM + PostgreSQL**, totalmente integrado com os checklists técnicos e sistema de geração de PDFs.

---

## 🏗️ ARQUITETURA DO BANCO

### **Módulos Principais:**

1. **Usuários e Autenticação** (User, Company, Technician)
2. **Clientes e Equipamentos** (Client, Branch, Equipment)
3. **Checklists e Templates** (ChecklistTemplate, Section, Item)
4. **Ordens de Serviço** (ServiceOrder, ChecklistExecution)
5. **Documentos e PDFs** (MaintenanceReport, Quotation)
6. **Histórico e Alertas** (MaintenanceHistory, MaintenanceAlert)

---

## 📋 DIAGRAMA DE RELACIONAMENTOS

```
┌─────────────┐
│   Company   │───┐
└─────────────┘   │
       │          │
       ├──────────┼────────────────────────────┐
       │          │                            │
┌──────▼──────┐   │   ┌────────────┐   ┌──────▼─────┐
│    User     │───┼───│ Technician │   │   Client   │
└─────────────┘   │   └────────────┘   └────────────┘
                  │          │                │
                  │          │         ┌──────▼──────┐
                  │          │         │   Branch    │
                  │          │         └─────────────┘
                  │          │                │
            ┌─────▼──────────▼────────────────▼──────┐
            │             Equipment                  │
            └───────────────┬────────────────────────┘
                            │
            ┌───────────────▼────────────────────────┐
            │          ServiceOrder                  │
            └───┬────────────┬──────────────┬────────┘
                │            │              │
    ┌───────────▼──┐  ┌──────▼─────┐  ┌────▼─────────┐
    │ Checklist    │  │ Maintenance │  │  Quotation   │
    │ Execution    │  │   Report    │  └──────────────┘
    └──────┬───────┘  └─────────────┘
           │
    ┌──────▼───────┐
    │   Finding    │
    └──────────────┘
```

---

## 📦 MODELS DETALHADOS

### **1. USUÁRIOS E AUTENTICAÇÃO**

#### **User**
```prisma
- id: UUID (PK)
- email: String (unique)
- password: String (bcrypt hash)
- name: String
- phone: String
- role: ADMIN | MANAGER | TECHNICIAN | CLIENT
- isActive: Boolean
- companyId: UUID (FK → Company)
- createdAt: DateTime
- updatedAt: DateTime
```

**Relacionamentos:**
- Pertence a uma `Company`
- Pode ter perfil de `Technician`
- Cria `ServiceOrder`, `MaintenanceReport`, `Quotation`

#### **Company**
```prisma
- id: UUID (PK)
- name: String
- cnpj: String (unique)
- address, phone, email, website, logoUrl
- subscriptionPlan: FREE | INDIVIDUAL | BUSINESS | ENTERPRISE
- subscriptionStatus: ACTIVE | CANCELED | SUSPENDED | TRIAL
- trialEndsAt, subscriptionEndsAt: DateTime
```

**Relacionamentos:**
- Possui múltiplos `User`, `Technician`, `Client`, `Equipment`

#### **Technician**
```prisma
- id: UUID (PK)
- userId: UUID (FK → User, unique)
- companyId: UUID (FK → Company)
- registration: String (ex: CREA-SP 123456)
- specialties: String[] (ex: ["Refrigeração", "Elétrica"])
- isAvailable: Boolean
```

**Relacionamentos:**
- Vinculado a um `User`
- Executa `ServiceOrder`, `ChecklistExecution`

---

### **2. CLIENTES E EQUIPAMENTOS**

#### **Client**
```prisma
- id: UUID (PK)
- name: String
- cnpj: String
- contactName, phone, email, address
- companyId: UUID (FK → Company)
- isActive: Boolean
```

**Relacionamentos:**
- Possui múltiplos `Branch`, `Equipment`, `ServiceOrder`

#### **Branch** (Filial)
```prisma
- id: UUID (PK)
- name: String (ex: "Unidade Shopping")
- address, phone
- clientId: UUID (FK → Client)
```

**Relacionamentos:**
- Pertence a um `Client`
- Possui múltiplos `Equipment`

#### **Equipment**
```prisma
- id: UUID (PK)
- type: EquipmentType (enum)
- brand, model, serialNumber, capacity
- installationDate: DateTime
- location: String
- clientId: UUID (FK → Client)
- branchId: UUID (FK → Branch, opcional)
- companyId: UUID (FK → Company)
- status: ACTIVE | INACTIVE | MAINTENANCE | RETIRED
- notes: String
```

**EquipmentType:**
```
AIR_CONDITIONING | COLD_ROOM | FREEZER | REFRIGERATOR
ICE_MACHINE | CHILLER | OVEN | FRYER | EXHAUST
ELECTRICAL_PANEL | GENERATOR
```

**Relacionamentos:**
- Pertence a `Client`, opcionalmente a `Branch`
- Possui histórico de `ServiceOrder`, `ChecklistExecution`, `MaintenanceAlert`

---

### **3. CHECKLISTS E TEMPLATES**

#### **ChecklistTemplate**
```prisma
- id: UUID (PK)
- name: String
- equipmentType: EquipmentType
- version: String (ex: "1.0.0")
- isActive, isPremium: Boolean
- estimatedDuration: Int (minutos)
- minimumTechnicianLevel: String
- requiredTools: String[]
- requiredPPE: String[]
- safetyWarnings: String[]
```

**Relacionamentos:**
- Possui múltiplas `ChecklistSection`
- Usado em `ChecklistExecution`

#### **ChecklistSection**
```prisma
- id: UUID (PK)
- title: String (ex: "1. INSPEÇÃO VISUAL")
- order: Int
- description: String
- category: MaintenanceCategory
- templateId: UUID (FK → ChecklistTemplate)
```

**Relacionamentos:**
- Pertence a `ChecklistTemplate`
- Possui múltiplos `ChecklistItem`

#### **ChecklistItem**
```prisma
- id: UUID (PK)
- code: String (ex: "AC-VIS-001")
- description: String
- type: ChecklistItemType
- category: MaintenanceCategory
- criticality: CriticalityLevel
- measurementMin/Max/Ideal/Tolerance: Float (para medições)
- measurementUnit: String (ex: "V", "PSI", "°C")
- expectedResult: String
- aiSuggestion: String
- allowPhoto, allowNotes, requiresAction: Boolean
- regulatoryReference: String (ex: "NBR 5410")
- frequencyValue/Unit: Int/String (para preventivas)
- riskIfFailed: String
- estimatedTimeMinutes: Int
- sectionId: UUID (FK → ChecklistSection)
```

**Enums:**
```prisma
ChecklistItemType:
  VISUAL_INSPECTION | MEASUREMENT | TEST | CLEANING
  ADJUSTMENT | REPLACEMENT | DOCUMENTATION

MaintenanceCategory:
  ELECTRICAL | REFRIGERATION | MECHANICAL | SAFETY
  STRUCTURE | HYGIENE | PERFORMANCE

CriticalityLevel:
  CRITICAL | HIGH | MEDIUM | LOW
```

---

### **4. ORDENS DE SERVIÇO E EXECUÇÃO**

#### **ServiceOrder**
```prisma
- id: UUID (PK)
- orderNumber: String (unique, ex: "OS-2026-001")
- type: PREVENTIVE | CORRECTIVE | INSTALLATION | EMERGENCY
- status: SCHEDULED | IN_PROGRESS | COMPLETED | CANCELED | ON_HOLD
- priority: LOW | MEDIUM | HIGH | URGENT
- scheduledDate: DateTime
- startTime, endTime: String (ex: "09:00")
- duration: Int (minutos)
- description: String
- clientId, equipmentId, technicianId, companyId, userId: UUID (FKs)
```

**Relacionamentos:**
- Pertence a `Client`, `Equipment`, `Technician`, `Company`, `User`
- Pode ter `ChecklistExecution`, `MaintenanceReport`, `Quotation`, `MaintenanceHistory`

#### **ChecklistExecution**
```prisma
- id: UUID (PK)
- serviceOrderId: UUID (FK → ServiceOrder, unique)
- templateId: UUID (FK → ChecklistTemplate)
- equipmentId: UUID (FK → Equipment)
- technicianId: UUID (FK → Technician)
- startedAt, completedAt: DateTime
- status: IN_PROGRESS | COMPLETED | PARTIALLY_COMPLETED
- technicianNotes: String
- aiRecommendations: String[]
- photosUrls: String[]
```

**Relacionamentos:**
- Vinculado a `ServiceOrder` (1:1)
- Possui múltiplos `ChecklistExecutionItem`, `Finding`

#### **ChecklistExecutionItem**
```prisma
- id: UUID (PK)
- executionId: UUID (FK → ChecklistExecution)
- itemId: UUID (FK → ChecklistItem)
- status: COMPLIANT | NON_COMPLIANT | REQUIRES_ATTENTION | NOT_APPLICABLE
- measuredValue: Float (se tipo = MEASUREMENT)
- textValue: String
- photoUrls: String[]
- notes: String
- requiresFollowUp: Boolean
- timestamp: DateTime
```

#### **Finding** (Achado técnico)
```prisma
- id: UUID (PK)
- executionId: UUID (FK → ChecklistExecution)
- itemCode: String
- severity: CriticalityLevel
- description, recommendation: String
- estimatedCost: Float
- urgency: IMMEDIATE | SHORT_TERM | MEDIUM_TERM | LONG_TERM
- photos: String[]
```

**Relacionamentos:**
- Pertence a `ChecklistExecution`
- Pode gerar `QuotationItem`

---

### **5. DOCUMENTOS E PDFs**

#### **MaintenanceReport**
```prisma
- id: UUID (PK)
- serviceOrderId: UUID (FK → ServiceOrder, unique)
- equipmentId, technicianId, userId: UUID (FKs)
- reportNumber: String (unique, ex: "REL-2026-001")
- totalItems, compliantItems, nonCompliantItems, requiresAttentionItems: Int
- overallSeverity: EXCELLENT | GOOD | ATTENTION | CRITICAL
- generalObservations: String
- nextMaintenanceDate: DateTime
- pdfUrl: String (S3 URL)
- pdfGeneratedAt: DateTime
- clientSignature, clientSignatureDate: String/DateTime
```

**Relacionamentos:**
- Vinculado a `ServiceOrder` (1:1)
- Referencia `Equipment`, `Technician`, `User`

#### **Quotation**
```prisma
- id: UUID (PK)
- serviceOrderId: UUID (FK → ServiceOrder, unique, opcional)
- equipmentId, technicianId, userId: UUID (FKs)
- quotationNumber: String (unique, ex: "ORC-2026-0045")
- issueDate, validUntil: DateTime
- status: DRAFT | SENT | APPROVED | REJECTED | EXPIRED
- subtotal, discount, discountPercentage, total: Float
- paymentConditions, warranty, estimatedDelivery, notes: String
- aiRecommendations: String[]
- pdfUrl, pdfGeneratedAt: String/DateTime
- sentAt, approvedAt, rejectedAt: DateTime
```

**Relacionamentos:**
- Pode ser vinculado a `ServiceOrder`
- Possui múltiplos `QuotationItem`

#### **QuotationItem**
```prisma
- id: UUID (PK)
- quotationId: UUID (FK → Quotation)
- findingId: UUID (FK → Finding, opcional)
- type: PART | SERVICE | LABOR
- description: String
- quantity, unitPrice, total: Float
- urgency: FindingUrgency
- justification: String
- order: Int (para ordenação)
```

---

### **6. HISTÓRICO E ALERTAS**

#### **MaintenanceHistory**
```prisma
- id: UUID (PK)
- serviceOrderId: UUID (FK → ServiceOrder, unique)
- equipmentId: UUID (FK → Equipment)
- type: ServiceOrderType
- executedAt: DateTime
- duration: Int
- summary: String
- findingsCount, criticalFindings: Int
- cost: Float
```

**Relacionamentos:**
- Vinculado a `ServiceOrder` (1:1)
- Referencia `Equipment`

#### **MaintenanceAlert**
```prisma
- id: UUID (PK)
- equipmentId: UUID (FK → Equipment)
- type: ServiceOrderType (geralmente PREVENTIVE)
- dueDate: DateTime
- description: String
- status: PENDING | SENT | ACKNOWLEDGED | RESOLVED
- sentAt, acknowledgedAt, resolvedAt: DateTime
```

**Relacionamentos:**
- Pertence a `Equipment`

---

## 🔄 FLUXO DE DADOS

### **Fluxo de Manutenção Preventiva:**

```
1. Sistema cria MaintenanceAlert automaticamente
   (baseado em frequência do ChecklistItem)
   ↓
2. Dashboard mostra alerta ao técnico
   ↓
3. Técnico cria ServiceOrder (tipo: PREVENTIVE)
   ↓
4. Técnico inicia ChecklistExecution no app
   ↓
5. Para cada ChecklistItem:
   - Cria ChecklistExecutionItem com status
   - Se NON_COMPLIANT → cria Finding
   ↓
6. Sistema finaliza ChecklistExecution
   ↓
7. Sistema gera MaintenanceReport automaticamente
   ↓
8. PDF é gerado e armazenado (S3)
   ↓
9. Cliente recebe via WhatsApp
   ↓
10. Sistema cria MaintenanceHistory
   ↓
11. Sistema calcula próxima preventiva
    (baseado em frequência) e cria novo Alert
```

### **Fluxo de Orçamento:**

```
1. Técnico encontra Findings durante execução
   ↓
2. Sistema sugere criação de Quotation
   ↓
3. IA gera itens sugeridos (QuotationItem) baseado em Findings
   ↓
4. Técnico revisa e ajusta valores
   ↓
5. Sistema calcula totais automaticamente
   ↓
6. PDF de orçamento é gerado
   ↓
7. Cliente recebe via WhatsApp (status: SENT)
   ↓
8. Cliente aprova via mensagem
   ↓
9. Sistema atualiza status para APPROVED
   ↓
10. Sistema cria nova ServiceOrder (tipo: CORRECTIVE)
    para execução do serviço
```

---

## 📊 QUERIES ÚTEIS

### **1. Listar equipamentos com manutenção atrasada**

```typescript
const overdueEquipments = await prisma.equipment.findMany({
  where: {
    status: 'ACTIVE',
    maintenanceAlerts: {
      some: {
        status: 'PENDING',
        dueDate: {
          lt: new Date()
        }
      }
    }
  },
  include: {
    client: true,
    maintenanceAlerts: {
      where: {
        status: 'PENDING',
        dueDate: {
          lt: new Date()
        }
      }
    }
  }
});
```

### **2. Histórico completo de um equipamento**

```typescript
const equipmentHistory = await prisma.equipment.findUnique({
  where: { id: equipmentId },
  include: {
    maintenanceHistory: {
      orderBy: { executedAt: 'desc' },
      include: {
        serviceOrder: {
          include: {
            technician: {
              include: { user: true }
            }
          }
        }
      }
    },
    checklistExecutions: {
      orderBy: { startedAt: 'desc' },
      include: {
        findings: true
      }
    }
  }
});
```

### **3. Relatórios de um técnico no mês**

```typescript
const technicianReports = await prisma.maintenanceReport.findMany({
  where: {
    technicianId: technicianId,
    createdAt: {
      gte: startOfMonth(new Date()),
      lte: endOfMonth(new Date())
    }
  },
  include: {
    serviceOrder: {
      include: {
        client: true,
        equipment: true
      }
    }
  }
});
```

### **4. Orçamentos pendentes de aprovação**

```typescript
const pendingQuotations = await prisma.quotation.findMany({
  where: {
    status: 'SENT',
    validUntil: {
      gte: new Date()
    }
  },
  include: {
    equipment: {
      include: {
        client: true
      }
    },
    items: true
  },
  orderBy: {
    issueDate: 'desc'
  }
});
```

### **5. Dashboard de empresa**

```typescript
const dashboard = await prisma.company.findUnique({
  where: { id: companyId },
  include: {
    _count: {
      select: {
        users: true,
        technicians: true,
        clients: true,
        equipments: true,
        serviceOrders: true
      }
    },
    serviceOrders: {
      where: {
        scheduledDate: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date())
        }
      },
      include: {
        client: true,
        equipment: true,
        technician: {
          include: { user: true }
        }
      }
    }
  }
});
```

---

## 🚀 SETUP E CONFIGURAÇÃO

### **1. Instalar dependências**

```bash
npm install
```

### **2. Configurar variáveis de ambiente**

Criar arquivo `.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/manutencao_mvp"
JWT_SECRET="your-secret-key"
```

### **3. Executar migrations**

```bash
npx prisma migrate dev --name init
```

### **4. Gerar Prisma Client**

```bash
npx prisma generate
```

### **5. Popular banco com dados de exemplo**

```bash
npm run prisma:seed
```

### **6. Abrir Prisma Studio (GUI)**

```bash
npm run prisma:studio
```

Abre interface visual em: `http://localhost:5555`

---

## 📈 ESCALABILIDADE

### **Índices Recomendados:**

```prisma
@@index([email])           // User
@@index([cnpj])            // Company, Client
@@index([orderNumber])     // ServiceOrder
@@index([scheduledDate])   // ServiceOrder
@@index([equipmentId])     // ChecklistExecution, Finding
@@index([status])          // ServiceOrder, Quotation
@@index([dueDate])         // MaintenanceAlert
```

### **Soft Delete:**

Para clientes/equipamentos que não devem ser removidos:

```prisma
model Equipment {
  isDeleted Boolean @default(false)
  deletedAt DateTime?
}
```

---

## 🔒 SEGURANÇA

### **Hashing de senha:**

```typescript
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### **JWT Token:**

```typescript
import jwt from 'jsonwebtoken';

const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);
```

---

## 📊 MÉTRICAS E KPIs

### **Queries para dashboard:**

**Taxa de conformidade média:**
```typescript
const avgCompliance = await prisma.maintenanceReport.aggregate({
  where: { companyId },
  _avg: {
    compliantItems: true
  }
});
```

**Tempo médio de execução:**
```typescript
const avgDuration = await prisma.serviceOrder.aggregate({
  where: {
    companyId,
    status: 'COMPLETED'
  },
  _avg: {
    duration: true
  }
});
```

**Equipamentos críticos:**
```typescript
const criticalEquipments = await prisma.equipment.count({
  where: {
    companyId,
    maintenanceReports: {
      some: {
        overallSeverity: 'CRITICAL'
      }
    }
  }
});
```

---

## 🎯 PRÓXIMOS PASSOS

1. **Criar API REST** com Express + endpoints CRUD
2. **Implementar autenticação JWT** middleware
3. **Adicionar upload de fotos** (AWS S3 / Cloudinary)
4. **Integrar WhatsApp Business API**
5. **Criar webhooks** para Stripe (pagamentos)
6. **Implementar sistema de notificações** (push + email)
7. **Adicionar logs de auditoria** (quem fez o quê e quando)

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Data:** 04/02/2026  
**Versão:** 1.0.0
