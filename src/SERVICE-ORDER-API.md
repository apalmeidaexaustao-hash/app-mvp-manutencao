# 📋 API - ORDENS DE SERVIÇO (ServiceOrder)

## 🎯 Visão Geral

Sistema completo de gerenciamento de ordens de serviço para manutenção técnica. Otimizado para uso mobile por técnicos em campo.

**Base URL:** `/api/service-orders`

---

## 🔐 AUTENTICAÇÃO

Todos os endpoints requerem autenticação JWT:

```
Authorization: Bearer <token>
```

---

## 📋 ENDPOINTS

### **1. Criar Ordem de Serviço**

```http
POST /api/service-orders
```

**Body:**
```json
{
  "clientId": "uuid",
  "equipmentId": "uuid",
  "branchId": "uuid",
  "type": "PREVENTIVE",
  "scheduledDate": "2026-02-10T10:00:00.000Z",
  "description": "Manutenção preventiva trimestral",
  "priority": "MEDIUM",
  "technicianId": "uuid"
}
```

**Campos:**
- `clientId` (obrigatório) - UUID do cliente
- `equipmentId` (obrigatório) - UUID do equipamento
- `branchId` (opcional) - UUID da filial
- `type` (obrigatório) - `PREVENTIVE`, `CORRECTIVE`, `INSTALLATION`, `EMERGENCY`
- `scheduledDate` (obrigatório) - Data/hora agendada (ISO 8601)
- `description` (opcional) - Descrição da OS (máx 1000 caracteres)
- `priority` (opcional) - `LOW`, `MEDIUM`, `HIGH`, `URGENT` (padrão: MEDIUM)
- `technicianId` (opcional) - UUID do técnico responsável

**Validações:**
- Cliente deve pertencer à empresa do usuário
- Equipamento deve pertencer ao cliente
- Data agendada não pode ser no passado
- Técnico (se fornecido) deve pertencer à empresa

**Número da OS:**
Gerado automaticamente no formato: `OS-2026-0001`

**Response 201:**
```json
{
  "success": true,
  "message": "Ordem de serviço criada com sucesso",
  "data": {
    "id": "uuid",
    "orderNumber": "OS-2026-0001",
    "companyId": "uuid",
    "clientId": "uuid",
    "equipmentId": "uuid",
    "branchId": "uuid",
    "type": "PREVENTIVE",
    "status": "SCHEDULED",
    "scheduledDate": "2026-02-10T10:00:00.000Z",
    "description": "Manutenção preventiva trimestral",
    "priority": "MEDIUM",
    "technicianId": "uuid",
    "startedAt": null,
    "completedAt": null,
    "createdAt": "2026-02-04T...",
    "client": {
      "id": "uuid",
      "name": "Restaurante Sabor & Cia",
      "phone": "+5511912345678"
    },
    "equipment": {
      "id": "uuid",
      "type": "COLD_ROOM",
      "brand": "Gelopar",
      "model": "GMCR-2400",
      "location": "Estoque",
      "branch": {
        "id": "uuid",
        "name": "Unidade Shopping"
      }
    },
    "technician": {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "name": "Carlos Silva",
        "email": "carlos@techfrio.com.br",
        "phone": "+5511987654321"
      }
    }
  }
}
```

---

### **2. Listar Ordens de Serviço**

```http
GET /api/service-orders?status=SCHEDULED&type=PREVENTIVE&clientId=uuid&page=1&limit=20
```

**Query Parameters:**
- `status` (opcional) - `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- `type` (opcional) - `PREVENTIVE`, `CORRECTIVE`, `INSTALLATION`, `EMERGENCY`
- `clientId` (opcional) - Filtrar por cliente
- `equipmentId` (opcional) - Filtrar por equipamento
- `technicianId` (opcional) - Filtrar por técnico
- `startDate` (opcional) - Data inicial (ISO 8601)
- `endDate` (opcional) - Data final (ISO 8601)
- `page` (opcional) - Página atual (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 20, máx: 100)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "OS-2026-0001",
      "type": "PREVENTIVE",
      "status": "SCHEDULED",
      "scheduledDate": "2026-02-10T10:00:00.000Z",
      "description": "Manutenção preventiva trimestral",
      "priority": "MEDIUM",
      "client": {
        "id": "uuid",
        "name": "Restaurante Sabor & Cia",
        "phone": "+5511912345678"
      },
      "equipment": {
        "id": "uuid",
        "type": "COLD_ROOM",
        "brand": "Gelopar",
        "model": "GMCR-2400",
        "location": "Estoque"
      },
      "technician": {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "name": "Carlos Silva",
          "phone": "+5511987654321"
        }
      },
      "_count": {
        "checklistExecutions": 0
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

---

### **3. Buscar Ordem de Serviço por ID**

```http
GET /api/service-orders/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "OS-2026-0001",
    "companyId": "uuid",
    "type": "PREVENTIVE",
    "status": "SCHEDULED",
    "scheduledDate": "2026-02-10T10:00:00.000Z",
    "startedAt": null,
    "completedAt": null,
    "description": "Manutenção preventiva trimestral",
    "priority": "MEDIUM",
    "createdAt": "2026-02-04T...",
    "client": {
      "id": "uuid",
      "name": "Restaurante Sabor & Cia",
      "cnpj": "12345678000199",
      "contactName": "Maria Santos",
      "phone": "+5511912345678",
      "email": "contato@saborcia.com.br",
      "address": "Av. Paulista, 1000 - São Paulo/SP"
    },
    "equipment": {
      "id": "uuid",
      "type": "COLD_ROOM",
      "brand": "Gelopar",
      "model": "GMCR-2400",
      "serialNumber": "CF2024001234",
      "location": "Estoque - fundos",
      "status": "ACTIVE",
      "branch": {
        "id": "uuid",
        "name": "Unidade Shopping",
        "address": "Shopping Center Plaza"
      }
    },
    "branch": {
      "id": "uuid",
      "name": "Unidade Shopping",
      "address": "Shopping Center Plaza",
      "phone": "+5511934567890"
    },
    "technician": {
      "id": "uuid",
      "user": {
        "id": "uuid",
        "name": "Carlos Silva",
        "email": "carlos@techfrio.com.br",
        "phone": "+5511987654321"
      }
    },
    "checklistExecutions": [],
    "maintenanceReport": null,
    "quotation": null
  }
}
```

---

### **4. Atualizar Ordem de Serviço**

```http
PUT /api/service-orders/:id
```

**Body:**
```json
{
  "scheduledDate": "2026-02-12T14:00:00.000Z",
  "description": "Manutenção preventiva trimestral - Reagendada",
  "priority": "HIGH",
  "technicianId": "uuid"
}
```

**Regras:**
- Não é possível atualizar OS com status `COMPLETED` ou `CANCELLED`
- Data agendada não pode ser no passado
- Técnico deve pertencer à empresa

**Response 200:**
```json
{
  "success": true,
  "message": "Ordem de serviço atualizada com sucesso",
  "data": { ... }
}
```

---

### **5. Atualizar Status da OS**

```http
PATCH /api/service-orders/:id/status
```

**Body:**
```json
{
  "status": "IN_PROGRESS"
}
```

**Status válidos:**
- `SCHEDULED` - Agendada
- `IN_PROGRESS` - Em andamento
- `COMPLETED` - Concluída
- `CANCELLED` - Cancelada

**Transições de status:**
```
SCHEDULED → IN_PROGRESS → COMPLETED
SCHEDULED → CANCELLED
IN_PROGRESS → CANCELLED
```

**Automações:**
- Ao mudar para `IN_PROGRESS`: define `startedAt` automaticamente
- Ao mudar para `COMPLETED`: define `completedAt` automaticamente

**Regras:**
- Não é possível alterar status de OS `COMPLETED` (exceto para ela mesma)
- Não é possível alterar status de OS `CANCELLED` (exceto para ela mesma)

**Response 200:**
```json
{
  "success": true,
  "message": "Ordem de serviço marcada como IN_PROGRESS",
  "data": { ... }
}
```

---

### **6. Minhas Ordens (Técnico)** 📱 *Mobile*

```http
GET /api/service-orders/technician/me?status=SCHEDULED&startDate=2026-02-01&endDate=2026-02-28
```

**Query Parameters:**
- `status` (opcional) - Filtrar por status
- `startDate` (opcional) - Data inicial
- `endDate` (opcional) - Data final

**Comportamento:**
- Busca automaticamente o técnico vinculado ao usuário logado
- Retorna apenas as OS atribuídas ao técnico
- Ideal para app mobile (agenda do técnico)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "OS-2026-0001",
      "type": "PREVENTIVE",
      "status": "SCHEDULED",
      "scheduledDate": "2026-02-10T10:00:00.000Z",
      "priority": "MEDIUM",
      "client": {
        "id": "uuid",
        "name": "Restaurante Sabor & Cia",
        "phone": "+5511912345678",
        "address": "Av. Paulista, 1000 - São Paulo/SP"
      },
      "equipment": {
        "id": "uuid",
        "type": "COLD_ROOM",
        "brand": "Gelopar",
        "model": "GMCR-2400",
        "location": "Estoque",
        "status": "ACTIVE"
      },
      "branch": {
        "id": "uuid",
        "name": "Unidade Shopping",
        "address": "Shopping Center Plaza"
      },
      "_count": {
        "checklistExecutions": 0
      }
    }
  ],
  "count": 5
}
```

---

### **7. Calendário (Agenda)** 📱 *Mobile*

```http
GET /api/service-orders/calendar?startDate=2026-02-01&endDate=2026-02-28&technicianId=uuid
```

**Query Parameters:**
- `startDate` (obrigatório) - Data inicial (ISO 8601)
- `endDate` (obrigatório) - Data final (ISO 8601)
- `technicianId` (opcional) - Filtrar por técnico específico

**Comportamento:**
- Retorna apenas OS com status `SCHEDULED` ou `IN_PROGRESS`
- Agrupa OS por data
- Ideal para visualização de calendário/agenda

**Response 200:**
```json
{
  "success": true,
  "data": {
    "startDate": "2026-02-01T00:00:00.000Z",
    "endDate": "2026-02-28T23:59:59.999Z",
    "totalOrders": 12,
    "ordersByDate": {
      "2026-02-10": [
        {
          "id": "uuid",
          "orderNumber": "OS-2026-0001",
          "type": "PREVENTIVE",
          "status": "SCHEDULED",
          "scheduledDate": "2026-02-10T10:00:00.000Z",
          "priority": "MEDIUM",
          "client": {
            "id": "uuid",
            "name": "Restaurante Sabor & Cia",
            "phone": "+5511912345678"
          },
          "equipment": {
            "id": "uuid",
            "type": "COLD_ROOM",
            "brand": "Gelopar",
            "model": "GMCR-2400",
            "location": "Estoque"
          },
          "technician": {
            "id": "uuid",
            "user": {
              "id": "uuid",
              "name": "Carlos Silva",
              "phone": "+5511987654321"
            }
          }
        }
      ],
      "2026-02-12": [
        {
          "id": "uuid",
          "orderNumber": "OS-2026-0002",
          ...
        },
        {
          "id": "uuid",
          "orderNumber": "OS-2026-0003",
          ...
        }
      ]
    }
  }
}
```

---

### **8. Excluir Ordem de Serviço**

```http
DELETE /api/service-orders/:id
```

**Regras:**
- Não é possível excluir OS com status `COMPLETED` (use cancelamento)
- Não é possível excluir OS que tenha checklists executados

**Response 200:**
```json
{
  "success": true,
  "message": "Ordem de serviço excluída com sucesso"
}
```

**Response 400** (se tiver checklists):
```json
{
  "success": false,
  "message": "Não é possível excluir OS com 2 checklist(s) executado(s)"
}
```

---

## 🔄 FLUXOS DE USO

### **Fluxo 1: Técnico verifica agenda do dia** 📱

```
1. GET /api/service-orders/technician/me?startDate=2026-02-10&endDate=2026-02-10
   → Lista todas as OS do técnico para hoje

2. SELECT uma OS para executar

3. PATCH /api/service-orders/:id/status
   Body: { "status": "IN_PROGRESS" }
   → Marca como "em andamento"

4. [Técnico executa o serviço...]

5. PATCH /api/service-orders/:id/status
   Body: { "status": "COMPLETED" }
   → Finaliza a OS
```

---

### **Fluxo 2: Manager cria e atribui OS** 💼

```
1. POST /api/service-orders
   Body: {
     "clientId": "uuid",
     "equipmentId": "uuid",
     "type": "CORRECTIVE",
     "scheduledDate": "2026-02-15T09:00:00Z",
     "technicianId": "uuid",
     "priority": "HIGH",
     "description": "Equipamento com falha no compressor"
   }
   → OS criada e atribuída ao técnico

2. Técnico recebe notificação (push/email)

3. Técnico acessa app e vê nova OS na agenda
```

---

### **Fluxo 3: Visualizar calendário mensal** 📅

```
1. GET /api/service-orders/calendar?startDate=2026-02-01&endDate=2026-02-28
   → Retorna todas as OS do mês agrupadas por dia

2. Frontend exibe em formato de calendário

3. Ao clicar em um dia, mostra detalhes das OS daquele dia
```

---

### **Fluxo 4: Reagendar OS** 🔄

```
1. GET /api/service-orders/:id
   → Buscar OS atual

2. PUT /api/service-orders/:id
   Body: {
     "scheduledDate": "2026-02-20T14:00:00Z",
     "description": "Reagendado a pedido do cliente"
   }
   → Atualiza data e descrição

3. Cliente recebe notificação da nova data
```

---

## 🔒 SEGURANÇA E MULTI-TENANT

### **Isolamento Automático:**
Todas as queries filtram automaticamente por `companyId`:

```typescript
// Técnico A (Empresa TechFrio)
GET /api/service-orders
→ Retorna apenas OS da TechFrio

// Técnico B (Empresa OutraEmpresa)
GET /api/service-orders
→ Retorna apenas OS da OutraEmpresa
```

### **Validações:**
- ✅ Token JWT válido
- ✅ Assinatura ativa (não expirada/suspensa)
- ✅ Cliente pertence à empresa
- ✅ Equipamento pertence ao cliente
- ✅ Técnico pertence à empresa

---

## ❌ CÓDIGOS DE ERRO

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Validação falhou ou regra de negócio violada |
| 401 | Unauthorized - Token inválido/expirado |
| 403 | Forbidden - Sem permissão ou assinatura suspensa |
| 404 | Not Found - OS/Cliente/Equipamento/Técnico não encontrado |
| 500 | Internal Server Error |

**Exemplos de erros 400:**
- "Data agendada não pode ser no passado"
- "Não é possível atualizar uma OS concluída ou cancelada"
- "Técnico não pertence à empresa"
- "Equipamento não pertence ao cliente"

---

## 📊 RESUMO DE ENDPOINTS

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/service-orders | Criar OS |
| GET | /api/service-orders | Listar OS (filtros + paginação) |
| GET | /api/service-orders/:id | Detalhes da OS |
| PUT | /api/service-orders/:id | Atualizar OS |
| PATCH | /api/service-orders/:id/status | Alterar status |
| DELETE | /api/service-orders/:id | Excluir OS |
| GET | /api/service-orders/technician/me | Minhas OS (técnico) 📱 |
| GET | /api/service-orders/calendar | Calendário/agenda 📱 |

**Total: 8 endpoints**

---

## 🧪 TESTANDO A API

### **Postman:**
Importe `postman-collection-service-orders.json`

### **PowerShell:**

```powershell
# 1. Login
$body = '{"email":"admin@techfrio.com.br","password":"123456"}'
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST -ContentType "application/json" -Body $body
$token = $response.data.token

# 2. Criar OS
$body = '{
  "clientId": "uuid-do-cliente",
  "equipmentId": "uuid-do-equipamento",
  "type": "PREVENTIVE",
  "scheduledDate": "2026-02-10T10:00:00.000Z",
  "priority": "MEDIUM"
}'
$response = Invoke-RestMethod -Uri "http://localhost:3000/api/service-orders" `
  -Method POST -Headers @{ "Authorization" = "Bearer $token" } `
  -ContentType "application/json" -Body $body

$serviceOrderId = $response.data.id

# 3. Listar OS
Invoke-RestMethod -Uri "http://localhost:3000/api/service-orders" `
  -Headers @{ "Authorization" = "Bearer $token" }

# 4. Atualizar status
$body = '{"status": "IN_PROGRESS"}'
Invoke-RestMethod -Uri "http://localhost:3000/api/service-orders/$serviceOrderId/status" `
  -Method PATCH -Headers @{ "Authorization" = "Bearer $token" } `
  -ContentType "application/json" -Body $body
```

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Data:** 04/02/2026  
**Versão:** 1.0.0  
**Progresso:** 70% → 75%
