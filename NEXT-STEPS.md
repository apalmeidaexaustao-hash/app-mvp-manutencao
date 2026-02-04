# 🎯 PRÓXIMOS PASSOS - GUIA DE CONTINUAÇÃO

**Situação atual:** Backend API completo (Autenticação + CRUD Clientes/Equipamentos)  
**Próximo objetivo:** Implementar funcionalidades de Ordem de Serviço e execução de checklists

---

## 📋 ROADMAP DETALHADO

### **FASE 1: Ordem de Serviço (ServiceOrder)** - Prioridade: 🔴 ALTA
*Estimativa: 6-8 horas*

#### O que implementar:

**1. Service + Controller + Routes de ServiceOrder**

**Endpoints necessários:**
```typescript
POST   /api/service-orders              // Criar OS
GET    /api/service-orders               // Listar (filtros: status, tipo, técnico, cliente)
GET    /api/service-orders/:id           // Detalhes completos
PUT    /api/service-orders/:id           // Atualizar
PATCH  /api/service-orders/:id/status    // Mudar status (PENDING → IN_PROGRESS → COMPLETED)
DELETE /api/service-orders/:id           // Cancelar OS
GET    /api/service-orders/technician/me // OS do técnico logado (mobile)
GET    /api/service-orders/calendar      // Agenda (vista por dia/semana)
```

**Status da OS:**
- `SCHEDULED` - Agendada
- `IN_PROGRESS` - Em andamento
- `COMPLETED` - Concluída
- `CANCELLED` - Cancelada

**Tipos de serviço:**
- `PREVENTIVE` - Manutenção preventiva
- `CORRECTIVE` - Manutenção corretiva
- `INSTALLATION` - Instalação
- `EMERGENCY` - Emergência

**Validações importantes:**
- Técnico deve pertencer à mesma empresa
- Equipamento deve pertencer a um cliente da empresa
- Data agendada não pode ser no passado
- Apenas ADMIN/MANAGER podem atribuir OS a técnicos

**Relações a incluir:**
- `client` - Cliente
- `equipment` - Equipamento
- `technician.user` - Nome do técnico
- `checklistExecution` - Checklist executado (se houver)
- `maintenanceReport` - Relatório (se gerado)
- `quotation` - Orçamento (se gerado)

---

### **FASE 2: Execução de Checklist** - Prioridade: 🔴 ALTA
*Estimativa: 8-10 horas*

#### O que implementar:

**1. Service + Controller + Routes de ChecklistExecution**

**Endpoints necessários:**
```typescript
POST   /api/checklist-executions                    // Iniciar execução
GET    /api/checklist-executions/:id                // Detalhes (com itens respondidos)
PATCH  /api/checklist-executions/:id/item           // Responder item do checklist
PATCH  /api/checklist-executions/:id/complete       // Finalizar execução
POST   /api/checklist-executions/:id/finding        // Adicionar achado crítico
GET    /api/checklist-executions/:id/summary        // Resumo (taxa de conformidade)
```

**Fluxo de execução:**

1. **Iniciar execução:**
```json
POST /api/checklist-executions
{
  "serviceOrderId": "uuid",
  "checklistTemplateId": "uuid"
}
```

2. **Responder item por item:**
```json
PATCH /api/checklist-executions/:id/item
{
  "itemId": "uuid",
  "status": "OK" | "WARNING" | "CRITICAL" | "NOT_APPLICABLE",
  "notes": "Observações técnicas",
  "measurementValue": "22.5",
  "measurementUnit": "°C",
  "photos": ["url1.jpg", "url2.jpg"]
}
```

3. **Adicionar achados críticos:**
```json
POST /api/checklist-executions/:id/finding
{
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "description": "Compressor com ruído anormal",
  "recommendation": "Substituir compressor urgentemente",
  "estimatedCost": 1500.00,
  "urgency": "IMMEDIATE" | "URGENT" | "MODERATE" | "LOW",
  "photos": ["finding1.jpg"]
}
```

4. **Finalizar:**
```json
PATCH /api/checklist-executions/:id/complete
{
  "overallNotes": "Manutenção preventiva concluída. Equipamento em boas condições.",
  "nextMaintenanceDate": "2026-05-01"
}
```

**Cálculos automáticos:**
- Taxa de conformidade: `(OK + NOT_APPLICABLE) / total * 100`
- Achados críticos: contagem por severidade
- Duração: `completedAt - startedAt`

---

### **FASE 3: Upload de Fotos (AWS S3)** - Prioridade: 🟡 MÉDIA
*Estimativa: 4-6 horas*

#### O que implementar:

**1. Configurar AWS SDK**

```powershell
npm install aws-sdk multer
npm install --save-dev @types/multer
```

**2. Service de upload**

```typescript
// src/services/upload.service.ts
import AWS from 'aws-sdk';
import multer from 'multer';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadPhoto = async (file: Express.Multer.File, folder: string) => {
  const key = `${folder}/${Date.now()}-${file.originalname}`;
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  };

  const result = await s3.upload(params).promise();
  return result.Location; // URL pública
};
```

**3. Endpoint de upload**

```typescript
POST /api/upload/photo
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body: {
  photo: <file>,
  folder: "checklist" | "equipment" | "finding"
}

Response: {
  success: true,
  url: "https://s3.amazonaws.com/bucket/checklist/12345-photo.jpg"
}
```

**Validações:**
- Tamanho máximo: 5MB
- Formatos: JPG, PNG, WEBP
- Redimensionar imagens grandes (usar `sharp`)

---

### **FASE 4: Integração WhatsApp Business API** - Prioridade: 🟡 MÉDIA
*Estimativa: 6-8 horas*

#### O que implementar:

**1. Biblioteca WhatsApp**

```powershell
npm install whatsapp-web.js qrcode-terminal
# OU usar API oficial:
npm install @green-api/whatsapp-api-client
```

**2. Service de WhatsApp**

```typescript
// src/services/whatsapp.service.ts
export const sendMaintenanceReport = async (
  phoneNumber: string,
  clientName: string,
  pdfUrl: string,
  orderNumber: string
) => {
  const message = `
🔧 *Relatório de Manutenção Técnica*

Olá ${clientName}!

Sua manutenção foi concluída com sucesso.

📋 *Ordem de Serviço:* ${orderNumber}
📄 *Relatório completo:* ${pdfUrl}

✅ Equipamento em perfeitas condições.
📅 Próxima revisão preventiva agendada.

Dúvidas? Responda esta mensagem!

_Equipe Técnica_
  `.trim();

  await sendWhatsAppMessage(phoneNumber, message);
};

export const sendQuotation = async (
  phoneNumber: string,
  clientName: string,
  pdfUrl: string,
  quotationNumber: string,
  total: number
) => {
  const message = `
💰 *Orçamento de Manutenção*

Olá ${clientName}!

Segue orçamento dos serviços identificados:

📋 *Orçamento:* ${quotationNumber}
💵 *Valor total:* R$ ${total.toFixed(2)}
📄 *Detalhes completos:* ${pdfUrl}

⏰ *Validade:* 7 dias

Para aprovar, responda: *APROVAR*

_Equipe Técnica_
  `.trim();

  await sendWhatsAppMessage(phoneNumber, message);
};
```

**3. Endpoint de teste**

```typescript
POST /api/whatsapp/test
{
  "phoneNumber": "+5511999999999",
  "message": "Teste de mensagem"
}
```

---

### **FASE 5: Geração de PDF via API** - Prioridade: 🔴 ALTA
*Estimativa: 4-6 horas*

#### O que implementar:

**1. Endpoint de geração de PDF**

```typescript
POST /api/reports/maintenance
{
  "checklistExecutionId": "uuid"
}

Response: {
  success: true,
  pdfUrl: "https://s3.../report-12345.pdf",
  reportId: "uuid"
}
```

```typescript
POST /api/quotations/generate
{
  "serviceOrderId": "uuid",
  "items": [
    {
      "description": "Troca de compressor",
      "quantity": 1,
      "unitPrice": 1200.00,
      "type": "PART"
    },
    {
      "description": "Mão de obra especializada",
      "quantity": 2,
      "unitPrice": 150.00,
      "type": "LABOR"
    }
  ],
  "discount": 50.00,
  "validUntil": "2026-02-11"
}
```

**2. Integrar com sistema de PDF existente**

O código de geração já está em `pdf-generator/`. Apenas criar endpoints que:
1. Buscam dados do banco (ChecklistExecution, ServiceOrder, Findings)
2. Chamam funções de geração de PDF
3. Fazem upload do PDF para S3
4. Salvam registro em `MaintenanceReport` ou `Quotation`
5. Retornam URL pública

---

## 📱 ENDPOINTS MOBILE-FIRST

### **Essenciais para app mobile:**

```typescript
// Agenda do técnico
GET /api/service-orders/technician/me?date=2026-02-04
→ Retorna todas as OS do técnico para o dia

// Checklists disponíveis
GET /api/checklist-templates?equipmentType=COLD_ROOM
→ Retorna templates compatíveis com o equipamento

// Executar checklist
POST /api/checklist-executions
PATCH /api/checklist-executions/:id/item
POST /api/checklist-executions/:id/finding
PATCH /api/checklist-executions/:id/complete

// Gerar e enviar relatório
POST /api/reports/maintenance → PDF gerado
POST /api/whatsapp/send → Cliente recebe no WhatsApp
```

---

## 🧪 TESTANDO CADA FASE

### **Workflow de teste:**

1. **Criar OS:**
```powershell
POST /api/service-orders
{
  "clientId": "<uuid>",
  "equipmentId": "<uuid>",
  "type": "PREVENTIVE",
  "scheduledDate": "2026-02-05T10:00:00Z"
}
```

2. **Iniciar checklist:**
```powershell
POST /api/checklist-executions
{
  "serviceOrderId": "<uuid>",
  "checklistTemplateId": "<uuid>"
}
```

3. **Responder itens:**
```powershell
PATCH /api/checklist-executions/:id/item
# Para cada item do checklist
```

4. **Finalizar:**
```powershell
PATCH /api/checklist-executions/:id/complete
```

5. **Gerar PDF:**
```powershell
POST /api/reports/maintenance
{
  "checklistExecutionId": "<uuid>"
}
```

6. **Enviar WhatsApp:**
```powershell
POST /api/whatsapp/send
{
  "phoneNumber": "+5511999999999",
  "type": "maintenance_report",
  "reportId": "<uuid>"
}
```

---

## 📊 PRIORIDADES

### **Implementar AGORA (Semana 1):**
1. ✅ ServiceOrder CRUD
2. ✅ ChecklistExecution completo
3. ✅ Geração de PDF via API

### **Implementar EM SEGUIDA (Semana 2):**
4. ✅ Upload de fotos (S3)
5. ✅ WhatsApp Business API

### **Implementar DEPOIS (Semana 3-4):**
6. App mobile MVP (React Native)
7. Dashboard web básico
8. Sistema de notificações

---

## 🛠️ COMANDOS ÚTEIS

### **Desenvolvimento:**
```powershell
# Iniciar servidor
npm run dev

# Ver logs do Prisma
$env:DEBUG="prisma:*"; npm run dev

# Abrir Prisma Studio
npm run prisma:studio

# Testar endpoints
# Importar postman-collection-crud.json
```

### **Banco de dados:**
```powershell
# Criar migration após mudanças no schema
npm run prisma:migrate

# Resetar banco (⚠️ APAGA DADOS)
npx prisma migrate reset

# Re-popular dados de teste
npm run prisma:seed
```

---

## 📞 PROBLEMAS CONHECIDOS

### **Node.js não instalado:**
- Baixar: https://nodejs.org/ (v18+)
- Reiniciar terminal
- Verificar: `node --version`

### **PostgreSQL não conecta:**
- Verificar se está rodando: Services.msc
- Testar: `psql -U postgres -d manutencao_mvp`
- Verificar DATABASE_URL no `.env`

### **Porta 3000 em uso:**
- Mudar PORT no `.env` para 3001
- OU matar processo: `netstat -ano | findstr :3000` → `taskkill /PID <PID> /F`

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Última atualização:** 04/02/2026  
**Versão atual:** 1.0.0 (70% completo)  
**Próxima milestone:** ServiceOrder + ChecklistExecution (85% completo)
