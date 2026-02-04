# 📄 SISTEMA DE GERAÇÃO DE PDF - DOCUMENTAÇÃO

## 🎯 Visão Geral

Sistema profissional de geração de PDFs para relatórios técnicos e orçamentos, otimizado para empresas de manutenção de equipamentos de restaurantes e fast-food.

---

## 📦 ARQUIVOS CRIADOS

```
pdf-generator/
├── pdf-types.ts                          ← Tipos TypeScript
├── maintenance-report-generator.ts       ← Gerador de relatórios técnicos
├── quotation-generator.ts                ← Gerador de orçamentos
├── pdf-service.ts                        ← Serviço principal
├── examples.ts                           ← Exemplos de uso
└── DOCUMENTATION.md                      ← Esta documentação
```

---

## 🏗️ ARQUITETURA

### **1. Tipos de Documento**

#### **A) Relatório Técnico** (`MaintenanceReportData`)
Documento completo após manutenção preventiva ou corretiva.

**Seções:**
1. **Cabeçalho** - Logo e dados da empresa
2. **Informações** - Cliente, equipamento, técnico, OS
3. **Resumo Visual** - Taxa de conformidade, status geral
4. **Achados Críticos** - Problemas que requerem atenção
5. **Checklist Detalhado** - Todos os itens verificados
6. **Observações Técnicas** - Notas do técnico
7. **Recomendações** - Ações sugeridas + IA
8. **Próxima Manutenção** - Data da preventiva
9. **Assinaturas** - Técnico e cliente

#### **B) Orçamento** (`QuotationData`)
Proposta comercial profissional.

**Seções:**
1. **Cabeçalho** - Logo e dados da empresa
2. **Informações** - Cliente, equipamento, validade
3. **Problemas Identificados** - Resumo dos achados
4. **Tabela de Itens** - Peças, serviços, mão de obra
5. **Totais** - Subtotal, desconto, total
6. **Condições Comerciais** - Pagamento, garantia, prazo
7. **Recomendações IA** - Sugestões inteligentes
8. **Rodapé** - Contato e validade

---

## 🎨 DESIGN PROFISSIONAL

### **Características Visuais:**

✅ **Layout Limpo** - Espaçamento adequado, hierarquia clara  
✅ **Cores Corporativas** - Personalizável por empresa  
✅ **Ícones Visuais** - Emojis discretos para destaque  
✅ **Tabelas Responsivas** - Dados organizados  
✅ **Badges de Status** - Conformidade visual clara  
✅ **Gradientes Modernos** - Caixas de resumo elegantes  
✅ **Tipografia Profissional** - Segoe UI, Arial  
✅ **Print-Friendly** - Otimizado para impressão  

### **Esquema de Cores Padrão:**

- **Primário:** `#2563eb` (Azul profissional)
- **Secundário:** `#64748b` (Cinza neutro)
- **Acento:** `#10b981` (Verde sucesso) / `#f59e0b` (Laranja alerta)
- **Crítico:** `#ef4444` (Vermelho)

---

## 🔧 COMO USAR

### **Exemplo 1: Gerar Relatório Técnico**

```typescript
import { pdfService, MaintenanceReportData } from './pdf-generator/pdf-service';

const reportData: MaintenanceReportData = {
  company: {
    name: 'TechFrio Manutenção',
    cnpj: '12345678000190',
    phone: '11987654321',
    email: 'contato@techfrio.com.br',
    address: 'Rua das Flores, 123',
    website: 'www.techfrio.com.br'
  },
  client: {
    id: 'client-001',
    name: 'Restaurante Sabor & Cia',
    phone: '11912345678',
    address: 'Av. Paulista, 1000'
  },
  equipment: {
    id: 'equip-001',
    type: 'Câmara Fria',
    brand: 'Gelopar',
    model: 'GMCR-2400',
    location: 'Área de estoque'
  },
  technician: {
    id: 'tech-001',
    name: 'Carlos Eduardo',
    phone: '11999887766'
  },
  serviceOrder: {
    id: 'OS-2026-001',
    type: 'preventive',
    date: new Date()
  },
  checklistExecution: {
    // ... dados do checklist executado
  },
  nextMaintenanceDate: new Date('2026-05-04')
};

// Gerar HTML
const html = await pdfService.generateMaintenanceReport(reportData);

// Mensagem para WhatsApp
const whatsappMsg = pdfService.getWhatsAppMessage('report', 'Restaurante Sabor & Cia');
```

---

### **Exemplo 2: Gerar Orçamento**

```typescript
import { pdfService, QuotationData } from './pdf-generator/pdf-service';

const quotationData: QuotationData = {
  company: { /* ... */ },
  client: { /* ... */ },
  equipment: { /* ... */ },
  technician: { /* ... */ },
  
  quotationNumber: 'ORC-2026-0045',
  issueDate: new Date(),
  validUntil: new Date('2026-02-14'), // 10 dias
  
  findings: [
    {
      id: 'find-001',
      severity: CriticalityLevel.HIGH,
      description: 'Sistema de degelo com falha',
      recommendation: 'Substituir timer de degelo',
      estimatedCost: 450.00,
      urgency: 'short_term'
    }
  ],
  
  items: [
    {
      id: 'item-001',
      type: 'part',
      description: 'Timer de degelo digital',
      quantity: 1,
      unitPrice: 320.00,
      total: 320.00,
      urgency: 'short_term'
    },
    {
      id: 'item-002',
      type: 'service',
      description: 'Mão de obra - Troca de timer',
      quantity: 1,
      unitPrice: 250.00,
      total: 250.00
    }
  ],
  
  subtotal: 570.00,
  discount: 50.00,
  discountPercentage: 8.77,
  total: 520.00,
  
  paymentConditions: '50% aprovação + 50% conclusão',
  warranty: '90 dias para peças',
  estimatedDelivery: '2 a 3 dias úteis',
  
  aiRecommendations: [
    'Upgrade para timer digital aumenta confiabilidade',
    'Histórico indica falha recorrente a cada 5 meses'
  ]
};

const html = await pdfService.generateQuotation(quotationData);

const whatsappMsg = pdfService.getWhatsAppMessage(
  'quotation', 
  'Restaurante Sabor & Cia',
  'ORC-2026-0045'
);
```

---

## 📊 FUNCIONALIDADES

### **Relatório Técnico:**

✅ **Resumo Visual** - Taxa de conformidade em destaque  
✅ **Sistema de Criticidade** - Cores por gravidade (crítico/alto/médio/baixo)  
✅ **Checklist Completo** - Todos os itens com status visual  
✅ **Achados Destacados** - Problemas críticos em evidência  
✅ **Recomendações IA** - Sugestões baseadas em histórico  
✅ **Próxima Manutenção** - Data em destaque  
✅ **Assinaturas** - Campo para técnico e cliente  
✅ **Conformidade Legal** - Referências a normas (NBR, NR, ANVISA)  

### **Orçamento:**

✅ **Validade Destacada** - Prazo em evidência  
✅ **Tipos de Item** - Badge visual (Peça/Serviço/Mão de Obra)  
✅ **Urgência Colorida** - Imediata/Curto/Médio/Longo prazo  
✅ **Justificativas** - Explicação técnica por item  
✅ **Cálculo Automático** - Subtotal, desconto, total  
✅ **Condições Comerciais** - Pagamento, garantia, prazo  
✅ **Recomendações IA** - Contexto técnico e comercial  
✅ **Contato Direto** - Telefone e email em destaque  

---

## 🤖 INTEGRAÇÃO COM IA

### **Campos que Alimentam IA:**

1. **`aiRecommendations`**: Sugestões técnicas baseadas em histórico
2. **`aiSuggestion`** (checklist): Procedimentos recomendados
3. **`estimatedCost`**: Previsão de custos por problema
4. **Padrões de Falha**: IA identifica recorrências

### **Exemplos de Recomendações IA:**

```typescript
aiRecommendations: [
  'Este equipamento apresentou falha similar há 4 meses',
  'Upgrade para componente digital reduz manutenções em 60%',
  'Troca de vedação pode economizar R$ 80/mês em energia',
  'Baseado em 150 câmaras similares, vida útil média: 8 anos',
  'Contrato preventivo evitaria 85% das paradas emergenciais'
]
```

---

## 📱 INTEGRAÇÃO WHATSAPP

### **Mensagens Automáticas:**

**Para Relatório:**
```
Olá! 👋

Segue o *Relatório Técnico* da manutenção realizada.

📋 *Cliente:* Restaurante Sabor & Cia

O relatório contém:
✅ Itens verificados
✅ Problemas encontrados
✅ Serviços realizados
✅ Recomendações técnicas
✅ Data da próxima manutenção

Equipamento em perfeito funcionamento! ✓

Qualquer dúvida, estou à disposição.
```

**Para Orçamento:**
```
Olá! 👋

Segue o *Orçamento ORC-2026-0045* para manutenção.

📋 *Cliente:* Restaurante Sabor & Cia

O orçamento contém:
✅ Problemas identificados
✅ Serviços e peças necessárias
✅ Valores detalhados
✅ Condições de pagamento

Qualquer dúvida, estou à disposição!

Para aprovar, basta responder esta mensagem.
```

---

## 🔄 FLUXO COMPLETO

```
┌─────────────────────────────────────────────────────────┐
│ 1. Técnico executa checklist no app                    │
│    ↓                                                    │
│ 2. Sistema identifica não conformidades                 │
│    ↓                                                    │
│ 3. IA sugere ações e estima custos                      │
│    ↓                                                    │
│ 4. Técnico revisa e aprova achados                      │
│    ↓                                                    │
│ 5. Sistema gera:                                        │
│    • Relatório Técnico (HTML → PDF)                     │
│    • Orçamento (se necessário)                          │
│    ↓                                                    │
│ 6. Envio automático via WhatsApp                        │
│    ↓                                                    │
│ 7. Cliente visualiza no celular                         │
│    ↓                                                    │
│ 8. Cliente aprova via mensagem                          │
│    ↓                                                    │
│ 9. Sistema agenda execução                              │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 PRÓXIMOS PASSOS

### **Integração com Bibliotecas de PDF:**

**Opção 1: Puppeteer** (Recomendado para servidor)
```typescript
import puppeteer from 'puppeteer';

async function htmlToPDF(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });
  await browser.close();
  return pdf;
}
```

**Opção 2: jsPDF** (Cliente-side)
```typescript
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

async function htmlToPDF(elementId: string): Promise<Blob> {
  const element = document.getElementById(elementId);
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
  return pdf.output('blob');
}
```

**Opção 3: PDFKit** (Node.js)
```typescript
import PDFDocument from 'pdfkit';
import fs from 'fs';

function generatePDF(data: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    
    // Adicionar conteúdo
    doc.fontSize(20).text('Relatório Técnico', { align: 'center' });
    // ...
    
    doc.end();
  });
}
```

---

### **Integração WhatsApp Business API:**

**Opção 1: Twilio** (Oficial)
```typescript
import twilio from 'twilio';

const client = twilio(accountSid, authToken);

async function sendPDFWhatsApp(to: string, pdfBuffer: Buffer, message: string) {
  await client.messages.create({
    from: 'whatsapp:+14155238886',
    to: `whatsapp:${to}`,
    body: message,
    mediaUrl: [uploadedPDFUrl]
  });
}
```

**Opção 2: Evolution API** (Self-hosted)
```typescript
import axios from 'axios';

async function sendPDFWhatsApp(to: string, pdfBase64: string, message: string) {
  await axios.post('https://api.evolution.com/message/sendMedia', {
    number: to,
    mediatype: 'document',
    mimetype: 'application/pdf',
    caption: message,
    media: pdfBase64
  }, {
    headers: { 'apikey': process.env.EVOLUTION_API_KEY }
  });
}
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### **Backend (Node.js + Express):**

```typescript
// routes/pdf.routes.ts
router.post('/report/generate', async (req, res) => {
  const data: MaintenanceReportData = req.body;
  const html = await pdfService.generateMaintenanceReport(data);
  const pdf = await htmlToPDF(html);
  res.setHeader('Content-Type', 'application/pdf');
  res.send(pdf);
});

router.post('/quotation/generate', async (req, res) => {
  const data: QuotationData = req.body;
  const html = await pdfService.generateQuotation(data);
  const pdf = await htmlToPDF(html);
  res.send(pdf);
});

router.post('/send-whatsapp', async (req, res) => {
  const { type, clientPhone, pdfUrl, quotationNumber } = req.body;
  const message = pdfService.getWhatsAppMessage(type, clientName, quotationNumber);
  await sendWhatsApp(clientPhone, message, pdfUrl);
  res.json({ success: true });
});
```

### **Frontend (React):**

```typescript
// Gerar e baixar PDF
const handleGenerateReport = async () => {
  const response = await axios.post('/api/pdf/report/generate', reportData, {
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = `relatorio-${clientName}-${date}.pdf`;
  link.click();
};

// Enviar via WhatsApp
const handleSendWhatsApp = async () => {
  await axios.post('/api/pdf/send-whatsapp', {
    type: 'report',
    clientPhone: '+5511912345678',
    pdfUrl: uploadedPDFUrl
  });
  
  toast.success('Relatório enviado via WhatsApp!');
};
```

---

## 🎨 PERSONALIZAÇÃO

### **Cores Corporativas:**

```typescript
const html = await pdfService.generateMaintenanceReport(data, {
  includePhotos: true,
  includeDetailedChecklist: true,
  language: 'pt-BR',
  colorScheme: {
    primary: '#1e3a8a',    // Azul escuro
    secondary: '#475569',  // Cinza
    accent: '#16a34a'      // Verde
  }
});
```

### **Marca d'água:**

```typescript
const html = await pdfService.generateQuotation(data, {
  includePhotos: false,
  includeDetailedChecklist: false,
  language: 'pt-BR',
  watermark: 'ORÇAMENTO - Válido até 14/02/2026'
});
```

---

## 📊 MÉTRICAS DE SUCESSO

### **KPIs do Sistema de PDF:**

- Taxa de abertura dos PDFs enviados
- Tempo médio entre envio e aprovação
- Taxa de conversão (orçamento → serviço contratado)
- Feedback de clientes sobre clareza
- Tempo economizado vs. manual

---

## 🔐 CONFORMIDADE

### **Documentos incluem referências a:**

- **NBR 16401** (Ar-condicionado)
- **NBR 5410** (Instalações elétricas)
- **NR-10** (Segurança elétrica)
- **NR-36** (Câmaras frias)
- **RDC 216/2004 ANVISA** (Boas Práticas)
- **Lei 14.024/2020** (Gases refrigerantes)

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Data:** 04/02/2026  
**Versão:** 1.0.0
