# 📋 API CRUD - CLIENTES E EQUIPAMENTOS

## 🎯 Visão Geral

Endpoints CRUD completos para Clientes e Equipamentos, otimizados para uso em campo por técnicos via app mobile.

---

## 🔐 AUTENTICAÇÃO

Todos os endpoints requerem autenticação JWT:

```
Authorization: Bearer <token>
```

**Obter token:**
```bash
POST /api/auth/login
{
  "email": "tecnico@empresa.com",
  "password": "Senha123"
}
```

---

## 👥 CLIENTES (Restaurantes)

Base URL: `/api/clients`

### **1. Listar Clientes**

```http
GET /api/clients?search=sabor&isActive=true&page=1&limit=20
```

**Query Parameters:**
- `search` (opcional) - Busca por nome, contato, CNPJ ou telefone
- `isActive` (opcional) - Filtrar por ativo/inativo (true/false)
- `page` (opcional) - Página atual (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 20)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Restaurante Sabor & Cia",
      "cnpj": "98765432000188",
      "contactName": "Maria Santos",
      "phone": "+5511912345678",
      "email": "contato@saborcia.com.br",
      "address": "Av. Paulista, 1000",
      "isActive": true,
      "createdAt": "2026-02-04T...",
      "_count": {
        "equipments": 5,
        "branches": 2
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

### **2. Buscar Cliente por ID**

```http
GET /api/clients/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Restaurante Sabor & Cia",
    "cnpj": "98765432000188",
    "contactName": "Maria Santos",
    "phone": "+5511912345678",
    "email": "contato@saborcia.com.br",
    "address": "Av. Paulista, 1000",
    "isActive": true,
    "createdAt": "2026-02-04T...",
    "branches": [
      {
        "id": "uuid",
        "name": "Unidade Shopping",
        "address": "Shopping Center Plaza",
        "_count": {
          "equipments": 3
        }
      }
    ],
    "equipments": [
      {
        "id": "uuid",
        "type": "COLD_ROOM",
        "brand": "Gelopar",
        "model": "GMCR-2400",
        "location": "Estoque",
        "status": "ACTIVE"
      }
    ],
    "_count": {
      "equipments": 5,
      "branches": 2,
      "serviceOrders": 15
    }
  }
}
```

---

### **3. Cadastrar Cliente**

```http
POST /api/clients
```

**Body:**
```json
{
  "name": "Fast Food Express",
  "cnpj": "11223344000155",
  "contactName": "Pedro Oliveira",
  "phone": "+5511923456789",
  "email": "pedro@fastfood.com",
  "address": "Rua Augusta, 500 - São Paulo/SP"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Cliente cadastrado com sucesso",
  "data": {
    "id": "uuid",
    "name": "Fast Food Express",
    ...
  }
}
```

**Validações:**
- `name`: 3-200 caracteres (obrigatório)
- `cnpj`: 14 dígitos (opcional)
- `phone`: formato internacional (obrigatório)
- `email`: formato válido (opcional)
- `address`: 10-300 caracteres (obrigatório)

---

### **4. Atualizar Cliente**

```http
PUT /api/clients/:id
```

**Body:**
```json
{
  "contactName": "João Silva",
  "phone": "+5511987654321",
  "email": "joao@fastfood.com"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Cliente atualizado com sucesso",
  "data": { ... }
}
```

---

### **5. Desativar Cliente**

```http
PATCH /api/clients/:id/deactivate
```

**Response 200:**
```json
{
  "success": true,
  "message": "Cliente desativado com sucesso",
  "data": {
    "id": "uuid",
    "isActive": false,
    ...
  }
}
```

---

### **6. Ativar Cliente**

```http
PATCH /api/clients/:id/activate
```

---

### **7. Excluir Cliente**

```http
DELETE /api/clients/:id
```

**Response 200:**
```json
{
  "success": true,
  "message": "Cliente excluído com sucesso"
}
```

**Erro 400** (se tiver equipamentos):
```json
{
  "success": false,
  "message": "Não é possível excluir cliente com 5 equipamento(s) cadastrado(s)"
}
```

---

### **8. Estatísticas do Cliente**

```http
GET /api/clients/:id/stats
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "equipmentCount": 5,
    "activeEquipmentCount": 4,
    "inactiveEquipmentCount": 1,
    "serviceOrderCount": 15,
    "lastServiceOrder": {
      "id": "uuid",
      "orderNumber": "OS-2026-015",
      "type": "PREVENTIVE",
      "scheduledDate": "2026-02-01T...",
      "equipment": {
        "type": "AIR_CONDITIONING",
        "brand": "LG",
        "model": "Inverter 18000 BTU"
      },
      "technician": {
        "user": {
          "name": "Carlos Silva"
        }
      }
    }
  }
}
```

---

## ❄️ EQUIPAMENTOS

Base URL: `/api/equipments`

### **1. Listar Equipamentos**

```http
GET /api/equipments?search=&type=COLD_ROOM&status=ACTIVE&clientId=uuid&page=1&limit=20
```

**Query Parameters:**
- `search` (opcional) - Busca por marca, modelo, nº série, localização ou cliente
- `type` (opcional) - Filtrar por tipo de equipamento
- `status` (opcional) - Filtrar por status (ACTIVE, INACTIVE, MAINTENANCE, RETIRED)
- `clientId` (opcional) - Filtrar por cliente
- `branchId` (opcional) - Filtrar por filial
- `page` (opcional) - Página atual (padrão: 1)
- `limit` (opcional) - Itens por página (padrão: 20)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "COLD_ROOM",
      "brand": "Gelopar",
      "model": "GMCR-2400",
      "serialNumber": "CF2024001234",
      "capacity": "2400 litros",
      "location": "Área de estoque",
      "status": "ACTIVE",
      "installationDate": "2023-06-15T...",
      "createdAt": "2026-02-04T...",
      "client": {
        "id": "uuid",
        "name": "Restaurante Sabor & Cia",
        "phone": "+5511912345678"
      },
      "branch": {
        "id": "uuid",
        "name": "Unidade Shopping"
      },
      "_count": {
        "serviceOrders": 10,
        "maintenanceHistory": 8
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 120,
    "totalPages": 6
  }
}
```

**Tipos de Equipamento:**
- `AIR_CONDITIONING` - Ar-condicionado
- `COLD_ROOM` - Câmara fria
- `FREEZER` - Freezer
- `REFRIGERATOR` - Geladeira
- `ICE_MACHINE` - Máquina de gelo
- `CHILLER` - Chiller
- `OVEN` - Forno
- `FRYER` - Fritadeira
- `EXHAUST` - Exaustor
- `ELECTRICAL_PANEL` - Painel elétrico
- `GENERATOR` - Gerador

---

### **2. Buscar Equipamento por ID**

```http
GET /api/equipments/:id
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "COLD_ROOM",
    "brand": "Gelopar",
    "model": "GMCR-2400",
    "serialNumber": "CF2024001234",
    "capacity": "2400 litros",
    "location": "Área de estoque - fundos",
    "status": "ACTIVE",
    "notes": "Equipamento principal da cozinha",
    "installationDate": "2023-06-15T...",
    "client": {
      "id": "uuid",
      "name": "Restaurante Sabor & Cia",
      "contactName": "Maria Santos",
      "phone": "+5511912345678",
      "email": "contato@saborcia.com.br",
      "address": "Av. Paulista, 1000"
    },
    "branch": {
      "id": "uuid",
      "name": "Unidade Shopping",
      "address": "Shopping Center Plaza",
      "phone": "+5511934567890"
    },
    "maintenanceHistory": [
      {
        "id": "uuid",
        "type": "PREVENTIVE",
        "executedAt": "2026-02-01T...",
        "duration": 90,
        "summary": "Manutenção preventiva trimestral",
        "findingsCount": 2,
        "criticalFindings": 0,
        "cost": 350.0,
        "serviceOrder": {
          "id": "uuid",
          "orderNumber": "OS-2026-015",
          "type": "PREVENTIVE"
        }
      }
    ],
    "maintenanceAlerts": [
      {
        "id": "uuid",
        "type": "PREVENTIVE",
        "dueDate": "2026-05-01T...",
        "description": "Manutenção preventiva trimestral",
        "status": "PENDING"
      }
    ],
    "_count": {
      "serviceOrders": 10,
      "maintenanceHistory": 8,
      "checklistExecutions": 7
    }
  }
}
```

---

### **3. Cadastrar Equipamento**

```http
POST /api/equipments
```

**Body:**
```json
{
  "type": "AIR_CONDITIONING",
  "brand": "LG",
  "model": "Inverter V 18.000 BTU",
  "serialNumber": "AC2024005678",
  "capacity": "18000 BTU",
  "installationDate": "2023-08-20",
  "location": "Salão principal",
  "clientId": "uuid",
  "branchId": "uuid",
  "notes": "Equipamento novo, instalado recentemente"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Equipamento cadastrado com sucesso",
  "data": {
    "id": "uuid",
    "type": "AIR_CONDITIONING",
    ...
  }
}
```

**Validações:**
- `type`: um dos tipos válidos (obrigatório)
- `brand`: 2-100 caracteres (obrigatório)
- `model`: 2-100 caracteres (obrigatório)
- `location`: 3-200 caracteres (obrigatório)
- `clientId`: UUID válido (obrigatório)
- `serialNumber`: max 100 caracteres (opcional)
- `capacity`: max 50 caracteres (opcional)

---

### **4. Atualizar Equipamento**

```http
PUT /api/equipments/:id
```

**Body:**
```json
{
  "location": "Salão VIP",
  "notes": "Movido para área VIP após reforma",
  "status": "MAINTENANCE"
}
```

---

### **5. Atualizar Status do Equipamento**

```http
PATCH /api/equipments/:id/status
```

**Body:**
```json
{
  "status": "MAINTENANCE"
}
```

**Status válidos:**
- `ACTIVE` - Ativo
- `INACTIVE` - Inativo
- `MAINTENANCE` - Em manutenção
- `RETIRED` - Aposentado

**Response 200:**
```json
{
  "success": true,
  "message": "Equipamento marcado como MAINTENANCE",
  "data": { ... }
}
```

---

### **6. Histórico de Manutenções**

```http
GET /api/equipments/:id/history?limit=10
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "PREVENTIVE",
      "executedAt": "2026-02-01T...",
      "duration": 90,
      "summary": "Manutenção preventiva completa",
      "findingsCount": 2,
      "criticalFindings": 0,
      "cost": 350.0,
      "serviceOrder": {
        "id": "uuid",
        "orderNumber": "OS-2026-015",
        "type": "PREVENTIVE",
        "status": "COMPLETED"
      }
    }
  ]
}
```

---

### **7. Manutenções Próximas** (📱 Útil para Mobile)

```http
GET /api/equipments/upcoming-maintenance?days=30
```

**Query Parameters:**
- `days` (opcional) - Dias futuros (padrão: 30)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "PREVENTIVE",
      "dueDate": "2026-02-15T...",
      "description": "Manutenção preventiva trimestral - Câmara Fria",
      "status": "PENDING",
      "equipment": {
        "id": "uuid",
        "type": "COLD_ROOM",
        "brand": "Gelopar",
        "model": "GMCR-2400",
        "location": "Estoque",
        "client": {
          "id": "uuid",
          "name": "Restaurante Sabor & Cia",
          "phone": "+5511912345678"
        }
      }
    }
  ],
  "count": 5
}
```

---

### **8. Equipamentos por Cliente** (📱 Útil para Mobile)

```http
GET /api/equipments/client/:clientId
```

**Response 200:**
```json
{
  "success": true,
  "equipments": [
    {
      "id": "uuid",
      "type": "COLD_ROOM",
      "brand": "Gelopar",
      "model": "GMCR-2400",
      "location": "Estoque",
      "status": "ACTIVE",
      "branch": {
        "id": "uuid",
        "name": "Unidade Shopping"
      },
      "_count": {
        "serviceOrders": 10
      }
    }
  ],
  "summary": {
    "total": 5,
    "byStatus": {
      "active": 4,
      "inactive": 1,
      "maintenance": 0,
      "retired": 0
    },
    "byType": {
      "COLD_ROOM": 2,
      "AIR_CONDITIONING": 2,
      "FREEZER": 1
    }
  }
}
```

---

### **9. Excluir Equipamento**

```http
DELETE /api/equipments/:id
```

**Response 200:**
```json
{
  "success": true,
  "message": "Equipamento excluído com sucesso"
}
```

---

## 📱 FLUXOS MOBILE (Casos de Uso)

### **Fluxo 1: Técnico chegando no cliente**

```
1. GET /api/clients/:id
   → Dados do cliente + endereço

2. GET /api/equipments/client/:clientId
   → Lista todos os equipamentos do local

3. SELECT equipamento para manutenção

4. GET /api/equipments/:id
   → Detalhes + histórico + alertas
```

---

### **Fluxo 2: Cadastrar novo equipamento em campo**

```
1. GET /api/clients?search=nome
   → Buscar cliente

2. POST /api/equipments
   → Cadastrar equipamento
   Body: { clientId, type, brand, model, location, ... }

3. Success: Equipamento cadastrado
```

---

### **Fluxo 3: Marcar equipamento como "Em Manutenção"**

```
1. PATCH /api/equipments/:id/status
   Body: { "status": "MAINTENANCE" }

2. [Executar manutenção...]

3. PATCH /api/equipments/:id/status
   Body: { "status": "ACTIVE" }
```

---

### **Fluxo 4: Ver agenda do dia (manutenções próximas)**

```
1. GET /api/equipments/upcoming-maintenance?days=1
   → Manutenções de hoje

2. Para cada alerta:
   - GET /api/equipments/:id
   - Executar checklist
```

---

## 🔒 SEGURANÇA E MULTI-TENANT

### **Isolamento Automático**

Todos os endpoints filtram automaticamente por `companyId`:

```typescript
// Técnico A (Empresa TechFrio)
GET /api/clients
→ Retorna apenas clientes da TechFrio

// Técnico B (Empresa OutraEmpresa)
GET /api/clients
→ Retorna apenas clientes da OutraEmpresa
```

### **Validação de Assinatura**

A cada request, o middleware valida:
- ✅ Token válido
- ✅ Assinatura ativa (não expirada/suspensa)
- ✅ Empresa vinculada

Se assinatura expirou:
```json
{
  "success": false,
  "message": "Assinatura expirada ou suspensa"
}
```

---

## ❌ CÓDIGOS DE ERRO

| Código | Descrição |
|--------|-----------|
| 400 | Bad Request - Validação falhou |
| 401 | Unauthorized - Token inválido/expirado |
| 403 | Forbidden - Sem permissão ou assinatura suspensa |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - CNPJ/Nº série duplicado |
| 500 | Internal Server Error |

---

## 🧪 TESTANDO A API

### **Com cURL:**

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@techfrio.com.br","password":"123456"}' \
  | jq -r '.data.token')

# 2. Listar clientes
curl http://localhost:3000/api/clients \
  -H "Authorization: Bearer $TOKEN"

# 3. Cadastrar cliente
curl -X POST http://localhost:3000/api/clients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Novo Restaurante",
    "phone": "+5511999999999",
    "address": "Rua Teste, 123"
  }'
```

### **Com Postman:**

Importe `postman-collection-crud.json` (será criado a seguir)

---

## 📊 PERFORMANCE

### **Paginação:**
- Padrão: 20 itens por página
- Máximo: 100 itens por página
- Use `page` e `limit` para navegar

### **Busca:**
- Case-insensitive
- Busca em múltiplos campos
- Performática (índices no banco)

### **Includes:**
- Dados relacionados já incluídos (evita N+1 queries)
- Contadores (`_count`) pré-calculados

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Data:** 04/02/2026  
**Versão:** 1.0.0
