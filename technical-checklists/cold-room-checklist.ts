import {
  EquipmentChecklist,
  ChecklistSection,
  ChecklistItem,
  ChecklistItemType,
  CriticalityLevel,
  MaintenanceCategory
} from './checklist-model';

export const coldRoomChecklist: EquipmentChecklist = {
  equipmentType: 'Câmara Fria / Câmara Frigorífica',
  equipmentCategory: 'Refrigeração Industrial',
  version: '1.0.0',
  lastUpdated: new Date('2026-02-04'),
  createdBy: 'Sistema',

  metadata: {
    estimatedDuration: 60,
    minimumTechnicianLevel: 'pleno',
    requiredTools: [
      'Multímetro',
      'Alicate amperímetro',
      'Manifold',
      'Termômetro digital com sonda',
      'Detector de vazamento',
      'Vacuômetro',
      'Chave de fenda e Phillips',
      'Chaves Allen',
      'Escada',
      'Lanterna'
    ],
    requiredPPE: [
      'Luvas térmicas',
      'Óculos de proteção',
      'Roupa térmica (entrada na câmara)',
      'Luvas de segurança elétrica',
      'Calçado de segurança'
    ],
    safetyWarnings: [
      'NUNCA entrar na câmara sem garantir saída de emergência funcional',
      'Usar roupa térmica para câmaras abaixo de 0°C',
      'Desligar sistema antes de manutenção elétrica',
      'Gás refrigerante sob alta pressão - risco de queimadura',
      'Verificar nível de O2 em câmaras herméticas',
      'Atenção a pisos escorregadios por gelo'
    ]
  },

  sections: [
    {
      id: 'cf-001',
      title: '1. INSPEÇÃO DE SEGURANÇA CRÍTICA',
      order: 1,
      category: MaintenanceCategory.SAFETY,
      description: 'Verificações obrigatórias de segurança - NÃO pular',
      items: [
        {
          id: 'cf-001-01',
          code: 'CF-SEG-001',
          description: 'Teste da trava de segurança interna (antipânico)',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.SAFETY,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Porta abre livremente de dentro sem chave',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'RISCO DE MORTE - pessoa pode ficar trancada',
          regulatoryReference: 'NR-36, Portaria 555/2013',
          frequency: {
            preventive: 1,
            unit: 'months'
          },
          estimatedTimeMinutes: 3
        },
        {
          id: 'cf-001-02',
          code: 'CF-SEG-002',
          description: 'Funcionamento da luz interna de emergência',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.SAFETY,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Luz acende quando porta fecha',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Risco de acidente no escuro',
          estimatedTimeMinutes: 2
        },
        {
          id: 'cf-001-03',
          code: 'CF-SEG-003',
          description: 'Alarme sonoro/visual interno',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.SAFETY,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Alarme funcional e audível externamente',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Impossibilidade de pedir socorro',
          estimatedTimeMinutes: 2
        },
        {
          id: 'cf-001-04',
          code: 'CF-SEG-004',
          description: 'Integridade estrutural (paredes, teto, piso)',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.STRUCTURE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Sem rachaduras, infiltrações ou deformações',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Risco de desabamento ou perda de isolamento',
          estimatedTimeMinutes: 5
        },
        {
          id: 'cf-001-05',
          code: 'CF-SEG-005',
          description: 'Ventilação/exaustão (câmaras herméticas)',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.SAFETY,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Sistema funcional e com fluxo adequado',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Risco de asfixia por falta de O2',
          regulatoryReference: 'NR-33 (espaços confinados, se aplicável)',
          estimatedTimeMinutes: 3
        }
      ]
    },

    {
      id: 'cf-002',
      title: '2. SISTEMA ELÉTRICO',
      order: 2,
      category: MaintenanceCategory.ELECTRICAL,
      description: 'Verificações elétricas da câmara',
      items: [
        {
          id: 'cf-002-01',
          code: 'CF-ELE-001',
          description: 'Tensão de alimentação trifásica (V)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.ELECTRICAL,
          criticality: CriticalityLevel.CRITICAL,
          measurementRange: {
            min: 360,
            max: 400,
            ideal: 380,
            unit: 'V',
            tolerance: 10
          },
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Tensão incorreta danifica compressor',
          regulatoryReference: 'NBR 5410',
          estimatedTimeMinutes: 4
        },
        {
          id: 'cf-002-02',
          code: 'CF-ELE-002',
          description: 'Corrente elétrica do compressor (A)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.ELECTRICAL,
          criticality: CriticalityLevel.HIGH,
          measurementRange: {
            unit: 'A',
            tolerance: 15
          },
          aiSuggestion: 'Comparar com a placa do compressor. Sobrecarga indica problema mecânico',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Sobrecarga queima motor',
          estimatedTimeMinutes: 4
        },
        {
          id: 'cf-002-03',
          code: 'CF-ELE-003',
          description: 'Equilíbrio de fases (diferença % entre fases)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.ELECTRICAL,
          criticality: CriticalityLevel.HIGH,
          measurementRange: {
            max: 3,
            unit: '%',
            tolerance: 1
          },
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Desequilíbrio causa superaquecimento',
          estimatedTimeMinutes: 3
        },
        {
          id: 'cf-002-04',
          code: 'CF-ELE-004',
          description: 'Estado dos contatores e relés',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.ELECTRICAL,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Contatos limpos, sem carbonização',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Falha no acionamento ou curto-circuito',
          estimatedTimeMinutes: 4
        },
        {
          id: 'cf-002-05',
          code: 'CF-ELE-005',
          description: 'Aperto dos bornes elétricos',
          type: ChecklistItemType.ADJUSTMENT,
          category: MaintenanceCategory.ELECTRICAL,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Todos os bornes bem apertados',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Mau contato gera aquecimento e incêndio',
          frequency: {
            preventive: 6,
            unit: 'months'
          },
          estimatedTimeMinutes: 5
        },
        {
          id: 'cf-002-06',
          code: 'CF-ELE-006',
          description: 'Funcionamento do termostato/controlador digital',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.ELECTRICAL,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Temperatura setada = temperatura lida',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Perda de controle de temperatura = perda de produto',
          estimatedTimeMinutes: 5
        }
      ]
    },

    {
      id: 'cf-003',
      title: '3. SISTEMA DE REFRIGERAÇÃO',
      order: 3,
      category: MaintenanceCategory.REFRIGERATION,
      description: 'Circuito frigorífico completo',
      items: [
        {
          id: 'cf-003-01',
          code: 'CF-REF-001',
          description: 'Pressão de sucção (PSI)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.HIGH,
          measurementRange: {
            min: 15,
            max: 40,
            ideal: 28,
            unit: 'PSI',
            tolerance: 10
          },
          aiSuggestion: 'Para R404A ou R134a. Ajustar conforme gás utilizado',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Pressão baixa = vazamento ou carga insuficiente',
          estimatedTimeMinutes: 5
        },
        {
          id: 'cf-003-02',
          code: 'CF-REF-002',
          description: 'Pressão de descarga (PSI)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.HIGH,
          measurementRange: {
            min: 180,
            max: 250,
            ideal: 215,
            unit: 'PSI',
            tolerance: 15
          },
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Pressão alta = condensador sujo ou ventilador parado',
          estimatedTimeMinutes: 3
        },
        {
          id: 'cf-003-03',
          code: 'CF-REF-003',
          description: 'Temperatura interna da câmara (°C)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.PERFORMANCE,
          criticality: CriticalityLevel.CRITICAL,
          measurementRange: {
            unit: '°C',
            tolerance: 2
          },
          aiSuggestion: 'Verificar especificação do cliente: resfriado (0~4°C) ou congelado (-18~-22°C)',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Temperatura incorreta = perda de alimentos',
          frequency: {
            preventive: 15,
            unit: 'days'
          },
          estimatedTimeMinutes: 2
        },
        {
          id: 'cf-003-04',
          code: 'CF-REF-004',
          description: 'Teste de vazamento (detector eletrônico)',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Sem vazamentos no sistema',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Perda de gás = equipamento para',
          regulatoryReference: 'Lei 14.024/2020',
          estimatedTimeMinutes: 10
        },
        {
          id: 'cf-003-05',
          code: 'CF-REF-005',
          description: 'Estado do evaporador (serpentina interna)',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Limpo, sem gelo excessivo ou obstrução',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Formação excessiva de gelo = perda de eficiência',
          estimatedTimeMinutes: 5
        },
        {
          id: 'cf-003-06',
          code: 'CF-REF-006',
          description: 'Funcionamento do degelo (automático/manual)',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Degelo completa ciclo corretamente',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Acúmulo de gelo bloqueia circulação de ar',
          estimatedTimeMinutes: 8
        },
        {
          id: 'cf-003-07',
          code: 'CF-REF-007',
          description: 'Dreno de degelo (desobstrução)',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Dreno livre e funcional',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Água do degelo congela dentro da câmara',
          estimatedTimeMinutes: 4
        },
        {
          id: 'cf-003-08',
          code: 'CF-REF-008',
          description: 'Estado do condensador (serpentina externa)',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Limpo, sem obstruções ou sujeira',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Condensador sujo = alta pressão = compressor para',
          frequency: {
            preventive: 2,
            unit: 'months'
          },
          estimatedTimeMinutes: 5
        },
        {
          id: 'cf-003-09',
          code: 'CF-REF-009',
          description: 'Funcionamento dos ventiladores (evaporador)',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.MECHANICAL,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Ventiladores girando livremente, sem ruído',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Sem circulação = distribuição irregular de frio',
          estimatedTimeMinutes: 3
        },
        {
          id: 'cf-003-10',
          code: 'CF-REF-010',
          description: 'Funcionamento dos ventiladores (condensador)',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.MECHANICAL,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Ventiladores operando normalmente',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Ventilador parado = superaquecimento',
          estimatedTimeMinutes: 3
        }
      ]
    },

    {
      id: 'cf-004',
      title: '4. ISOLAMENTO E VEDAÇÃO',
      order: 4,
      category: MaintenanceCategory.STRUCTURE,
      description: 'Integridade térmica da câmara',
      items: [
        {
          id: 'cf-004-01',
          code: 'CF-ISO-001',
          description: 'Estado das borrachas de vedação da porta',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.STRUCTURE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Borrachas íntegras, sem rachaduras ou descolamento',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Entrada de ar quente = aumento de consumo',
          frequency: {
            preventive: 3,
            unit: 'months'
          },
          estimatedTimeMinutes: 3
        },
        {
          id: 'cf-004-02',
          code: 'CF-ISO-002',
          description: 'Teste de vedação da porta (papel)',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.STRUCTURE,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Papel preso ao fechar porta (resistência ao puxar)',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          aiSuggestion: 'Testar em vários pontos da porta',
          riskIfFailed: 'Vedação ruim = desperdício de energia',
          estimatedTimeMinutes: 4
        },
        {
          id: 'cf-004-03',
          code: 'CF-ISO-003',
          description: 'Integridade dos painéis isolantes',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.STRUCTURE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Painéis sem danos, infiltração ou condensação externa',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Isolamento danificado = perda térmica',
          estimatedTimeMinutes: 5
        },
        {
          id: 'cf-004-04',
          code: 'CF-ISO-004',
          description: 'Vedação de passagens de tubulação',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.STRUCTURE,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Todas as passagens vedadas com espuma/silicone',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Entrada de ar externo',
          estimatedTimeMinutes: 4
        },
        {
          id: 'cf-004-05',
          code: 'CF-ISO-005',
          description: 'Cortina de ar (se aplicável)',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.STRUCTURE,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Cortina íntegra e bem fixada',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: false,
          estimatedTimeMinutes: 2
        }
      ]
    },

    {
      id: 'cf-005',
      title: '5. LIMPEZA E HIGIENIZAÇÃO',
      order: 5,
      category: MaintenanceCategory.HYGIENE,
      description: 'Manutenção sanitária obrigatória',
      items: [
        {
          id: 'cf-005-01',
          code: 'CF-HIG-001',
          description: 'Limpeza do evaporador (serpentina interna)',
          type: ChecklistItemType.CLEANING,
          category: MaintenanceCategory.HYGIENE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Serpentina limpa e sem acúmulo de sujeira',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Contaminação de alimentos',
          regulatoryReference: 'RDC 216/2004 ANVISA',
          frequency: {
            preventive: 3,
            unit: 'months'
          },
          estimatedTimeMinutes: 20
        },
        {
          id: 'cf-005-02',
          code: 'CF-HIG-002',
          description: 'Limpeza do condensador',
          type: ChecklistItemType.CLEANING,
          category: MaintenanceCategory.PERFORMANCE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Sem sujeira, poeira ou obstruções',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Perda de eficiência',
          frequency: {
            preventive: 2,
            unit: 'months'
          },
          estimatedTimeMinutes: 15
        },
        {
          id: 'cf-005-03',
          code: 'CF-HIG-003',
          description: 'Limpeza interna (piso, paredes, teto)',
          type: ChecklistItemType.CLEANING,
          category: MaintenanceCategory.HYGIENE,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Ambiente limpo e higienizado',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Contaminação cruzada',
          regulatoryReference: 'RDC 216/2004 ANVISA',
          estimatedTimeMinutes: 15
        },
        {
          id: 'cf-005-04',
          code: 'CF-HIG-004',
          description: 'Limpeza das borrachas de vedação',
          type: ChecklistItemType.CLEANING,
          category: MaintenanceCategory.HYGIENE,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Borrachas limpas e sem fungos',
          allowPhoto: false,
          allowNotes: false,
          requiresAction: false,
          estimatedTimeMinutes: 5
        },
        {
          id: 'cf-005-05',
          code: 'CF-HIG-005',
          description: 'Verificação de presença de pragas (insetos/roedores)',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.HYGIENE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Sem sinais de infestação',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Contaminação alimentar',
          regulatoryReference: 'RDC 216/2004 ANVISA',
          estimatedTimeMinutes: 3
        }
      ]
    },

    {
      id: 'cf-006',
      title: '6. TESTES FINAIS E DOCUMENTAÇÃO',
      order: 6,
      category: MaintenanceCategory.DOCUMENTATION,
      description: 'Validação e registro',
      items: [
        {
          id: 'cf-006-01',
          code: 'CF-DOC-001',
          description: 'Registro de temperatura (termômetro de referência)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.DOCUMENTATION,
          criticality: CriticalityLevel.CRITICAL,
          measurementRange: {
            unit: '°C',
            tolerance: 2
          },
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          aiSuggestion: 'Usar termômetro calibrado e registrar em múltiplos pontos',
          riskIfFailed: 'Não conformidade com ANVISA',
          regulatoryReference: 'RDC 216/2004',
          estimatedTimeMinutes: 5
        },
        {
          id: 'cf-006-02',
          code: 'CF-DOC-002',
          description: 'Teste de tempo de recuperação (retorno à temperatura)',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.PERFORMANCE,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Câmara retorna à temperatura setada em tempo adequado',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: false,
          aiSuggestion: 'Tempo normal: 20-40 minutos após abertura de porta',
          estimatedTimeMinutes: 30
        },
        {
          id: 'cf-006-03',
          code: 'CF-DOC-003',
          description: 'Verificação de datalogger/termômetro digital',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.DOCUMENTATION,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Equipamento registrando corretamente',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Perda de rastreabilidade',
          estimatedTimeMinutes: 3
        },
        {
          id: 'cf-006-04',
          code: 'CF-DOC-004',
          description: 'Etiqueta de próxima manutenção atualizada',
          type: ChecklistItemType.DOCUMENTATION,
          category: MaintenanceCategory.DOCUMENTATION,
          criticality: CriticalityLevel.LOW,
          expectedResult: 'Etiqueta afixada com data visível',
          allowPhoto: true,
          allowNotes: false,
          requiresAction: false,
          estimatedTimeMinutes: 2
        },
        {
          id: 'cf-006-05',
          code: 'CF-DOC-005',
          description: 'Orientação ao cliente sobre uso correto',
          type: ChecklistItemType.DOCUMENTATION,
          category: MaintenanceCategory.DOCUMENTATION,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Cliente orientado sobre boas práticas',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: false,
          aiSuggestion: 'Orientar sobre: não sobrecarregar, manter porta fechada, verificar temperatura diariamente',
          estimatedTimeMinutes: 5
        }
      ]
    }
  ]
};
