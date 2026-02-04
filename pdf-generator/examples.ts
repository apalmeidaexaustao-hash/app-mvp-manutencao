import { 
  pdfService, 
  MaintenanceReportData, 
  QuotationData,
  CompanyInfo,
  ClientInfo,
  EquipmentInfo,
  TechnicianInfo,
  ServiceOrderInfo,
  QuotationItem
} from './pdf-service';
import { 
  ChecklistExecution, 
  ChecklistExecutionItem, 
  ChecklistStatus, 
  Finding, 
  CriticalityLevel 
} from '../technical-checklists/checklist-model';

const mockCompany: CompanyInfo = {
  name: 'TechFrio Manutenção',
  cnpj: '12345678000190',
  address: 'Rua das Flores, 123 - Centro - São Paulo/SP',
  phone: '11987654321',
  email: 'contato@techfrio.com.br',
  website: 'www.techfrio.com.br'
};

const mockClient: ClientInfo = {
  id: 'client-001',
  name: 'Restaurante Sabor & Cia',
  cnpj: '98765432000188',
  contactName: 'João Silva',
  phone: '11912345678',
  email: 'joao@saborcia.com.br',
  address: 'Av. Paulista, 1000 - Bela Vista - São Paulo/SP',
  branchName: 'Unidade Shopping'
};

const mockEquipment: EquipmentInfo = {
  id: 'equip-001',
  type: 'Câmara Fria',
  brand: 'Gelopar',
  model: 'GMCR-2400',
  serialNumber: 'CF2024001234',
  capacity: '2400 litros',
  installationDate: new Date('2023-06-15'),
  location: 'Área de estoque - fundos'
};

const mockTechnician: TechnicianInfo = {
  id: 'tech-001',
  name: 'Carlos Eduardo Santos',
  registration: 'CREA-SP 123456',
  phone: '11999887766',
  email: 'carlos@techfrio.com.br'
};

const mockServiceOrder: ServiceOrderInfo = {
  id: 'OS-2026-001',
  type: 'preventive',
  date: new Date('2026-02-04'),
  startTime: '09:00',
  endTime: '10:30',
  duration: 90
};

const mockChecklistItems: ChecklistExecutionItem[] = [
  {
    itemId: 'CF-SEG-001',
    status: ChecklistStatus.COMPLIANT,
    textValue: 'Trava de segurança funcionando perfeitamente',
    timestamp: new Date(),
    requiresFollowUp: false
  },
  {
    itemId: 'CF-ELE-001',
    status: ChecklistStatus.COMPLIANT,
    measuredValue: 380,
    notes: 'Tensão dentro da normalidade',
    timestamp: new Date(),
    requiresFollowUp: false
  },
  {
    itemId: 'CF-REF-001',
    status: ChecklistStatus.REQUIRES_ATTENTION,
    measuredValue: 25,
    notes: 'Pressão ligeiramente baixa, monitorar',
    timestamp: new Date(),
    requiresFollowUp: true
  },
  {
    itemId: 'CF-REF-005',
    status: ChecklistStatus.NON_COMPLIANT,
    textValue: 'Evaporador com acúmulo de gelo excessivo',
    notes: 'Sistema de degelo não está funcionando corretamente',
    timestamp: new Date(),
    requiresFollowUp: true
  },
  {
    itemId: 'CF-ISO-001',
    status: ChecklistStatus.NON_COMPLIANT,
    textValue: 'Borracha de vedação rachada',
    notes: 'Substituição necessária',
    timestamp: new Date(),
    requiresFollowUp: true
  }
];

const mockFindings: Finding[] = [
  {
    id: 'find-001',
    itemId: 'CF-REF-005',
    severity: CriticalityLevel.HIGH,
    description: 'Sistema de degelo automático apresentando falha',
    recommendation: 'Substituir timer de degelo e verificar resistências. Risco de perda de eficiência e possível dano ao compressor.',
    estimatedCost: 450.00,
    urgency: 'short_term'
  },
  {
    id: 'find-002',
    itemId: 'CF-ISO-001',
    severity: CriticalityLevel.MEDIUM,
    description: 'Borracha de vedação da porta com rachaduras',
    recommendation: 'Trocar borracha de vedação completa. Entrada de ar quente aumenta consumo de energia.',
    estimatedCost: 280.00,
    urgency: 'medium_term'
  },
  {
    id: 'find-003',
    itemId: 'CF-REF-001',
    severity: CriticalityLevel.MEDIUM,
    description: 'Pressão de sucção abaixo do ideal',
    recommendation: 'Monitorar nas próximas 48h. Se persistir, verificar possível vazamento de gás refrigerante.',
    urgency: 'short_term'
  }
];

const mockChecklistExecution: ChecklistExecution = {
  id: 'exec-001',
  checklistId: 'template-cold-room',
  equipmentId: 'equip-001',
  technicianId: 'tech-001',
  serviceOrderId: 'OS-2026-001',
  startedAt: new Date('2026-02-04T09:00:00'),
  completedAt: new Date('2026-02-04T10:30:00'),
  items: mockChecklistItems,
  overallStatus: 'completed',
  findings: mockFindings,
  photosUrls: [],
  technicianNotes: 'Câmara operando com temperatura adequada (-18°C), porém com problemas no sistema de degelo que requerem atenção. Recomendo manutenção corretiva em até 7 dias para evitar agravamento.',
  aiRecommendations: [
    'Com base no histórico, este equipamento apresenta falhas recorrentes no sistema de degelo a cada 4-5 meses.',
    'Recomendamos upgrade para timer digital programável para maior confiabilidade.',
    'A troca da borracha de vedação pode reduzir o consumo de energia em até 15%.'
  ]
};

async function testMaintenanceReport() {
  console.log('\n=== GERANDO RELATÓRIO TÉCNICO DE MANUTENÇÃO ===\n');

  const reportData: MaintenanceReportData = {
    company: mockCompany,
    client: mockClient,
    equipment: mockEquipment,
    technician: mockTechnician,
    serviceOrder: mockServiceOrder,
    checklistExecution: mockChecklistExecution,
    generalObservations: 'Manutenção preventiva realizada conforme cronograma. Cliente orientado sobre a necessidade de manutenção corretiva.',
    nextMaintenanceDate: new Date('2026-05-04')
  };

  const html = await pdfService.generateMaintenanceReport(reportData, {
    includePhotos: true,
    includeDetailedChecklist: true,
    language: 'pt-BR'
  });

  console.log('✅ Relatório técnico gerado com sucesso!');
  console.log(`📄 Tamanho do HTML: ${(html.length / 1024).toFixed(2)} KB`);
  console.log('\n📱 Mensagem WhatsApp:');
  console.log(pdfService.getWhatsAppMessage('report', mockClient.name));

  return html;
}

async function testQuotation() {
  console.log('\n=== GERANDO ORÇAMENTO ===\n');

  const quotationItems: QuotationItem[] = [
    {
      id: 'item-001',
      type: 'part',
      description: 'Timer de degelo digital programável',
      quantity: 1,
      unitPrice: 320.00,
      total: 320.00,
      urgency: 'short_term',
      justification: 'Substituição do timer analógico com defeito'
    },
    {
      id: 'item-002',
      type: 'part',
      description: 'Resistência de degelo 220V 400W',
      quantity: 2,
      unitPrice: 85.00,
      total: 170.00,
      urgency: 'short_term',
      justification: 'Resistências apresentando baixa eficiência'
    },
    {
      id: 'item-003',
      type: 'service',
      description: 'Mão de obra - Troca de sistema de degelo',
      quantity: 1,
      unitPrice: 250.00,
      total: 250.00,
      urgency: 'short_term'
    },
    {
      id: 'item-004',
      type: 'part',
      description: 'Borracha de vedação para porta (kit completo)',
      quantity: 1,
      unitPrice: 180.00,
      total: 180.00,
      urgency: 'medium_term',
      justification: 'Vedação atual com rachaduras causando entrada de ar'
    },
    {
      id: 'item-005',
      type: 'service',
      description: 'Mão de obra - Troca de borracha de vedação',
      quantity: 1,
      unitPrice: 100.00,
      total: 100.00,
      urgency: 'medium_term'
    },
    {
      id: 'item-006',
      type: 'labor',
      description: 'Teste e aferição pós-manutenção',
      quantity: 1,
      unitPrice: 150.00,
      total: 150.00
    }
  ];

  const subtotal = quotationItems.reduce((sum, item) => sum + item.total, 0);
  const discount = 50.00;
  const total = subtotal - discount;

  const quotationData: QuotationData = {
    company: mockCompany,
    client: mockClient,
    equipment: mockEquipment,
    technician: mockTechnician,
    quotationNumber: 'ORC-2026-0045',
    issueDate: new Date('2026-02-04'),
    validUntil: new Date('2026-02-14'),
    findings: mockFindings,
    items: quotationItems,
    subtotal,
    discount,
    discountPercentage: ((discount / subtotal) * 100),
    total,
    paymentConditions: '50% na aprovação + 50% após conclusão | PIX, Cartão ou Boleto',
    warranty: '90 dias para peças e 30 dias para mão de obra',
    estimatedDelivery: '2 a 3 dias úteis após aprovação',
    notes: 'Peças originais com nota fiscal. Serviço executado por técnicos certificados.',
    aiRecommendations: [
      'Baseado no histórico deste equipamento, a falha do sistema de degelo tende a se repetir. Considere upgrade para sistema digital.',
      'A troca da borracha pode economizar até R$ 80/mês na conta de energia.',
      'Recomendamos contrato de manutenção preventiva para evitar paradas inesperadas.'
    ]
  };

  const html = await pdfService.generateQuotation(quotationData, {
    includePhotos: false,
    includeDetailedChecklist: false,
    language: 'pt-BR'
  });

  console.log('✅ Orçamento gerado com sucesso!');
  console.log(`📄 Tamanho do HTML: ${(html.length / 1024).toFixed(2)} KB`);
  console.log(`💰 Valor total: R$ ${total.toFixed(2)}`);
  console.log('\n📱 Mensagem WhatsApp:');
  console.log(pdfService.getWhatsAppMessage('quotation', mockClient.name, 'ORC-2026-0045'));

  return html;
}

export async function runExamples() {
  try {
    const reportHTML = await testMaintenanceReport();
    const quotationHTML = await testQuotation();

    console.log('\n' + '='.repeat(60));
    console.log('✅ TODOS OS TESTES EXECUTADOS COM SUCESSO!');
    console.log('='.repeat(60));
    console.log('\n📌 PRÓXIMOS PASSOS:\n');
    console.log('1. Integrar com biblioteca de geração de PDF (Puppeteer, jsPDF, PDFKit)');
    console.log('2. Implementar upload de fotos');
    console.log('3. Conectar com WhatsApp Business API');
    console.log('4. Criar endpoints da API REST');
    console.log('5. Adicionar assinatura digital');

    return { reportHTML, quotationHTML };
  } catch (error) {
    console.error('❌ Erro ao executar exemplos:', error);
    throw error;
  }
}

if (require.main === module) {
  runExamples().catch(console.error);
}
