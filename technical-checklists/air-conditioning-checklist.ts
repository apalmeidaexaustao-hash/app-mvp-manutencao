import {
  EquipmentChecklist,
  ChecklistSection,
  ChecklistItem,
  ChecklistItemType,
  CriticalityLevel,
  MaintenanceCategory
} from './checklist-model';

export const airConditioningChecklist: EquipmentChecklist = {
  equipmentType: 'Ar-condicionado Split/VRF',
  equipmentCategory: 'Climatização',
  version: '1.0.0',
  lastUpdated: new Date('2026-02-04'),
  createdBy: 'Sistema',

  metadata: {
    estimatedDuration: 45,
    minimumTechnicianLevel: 'pleno',
    requiredTools: [
      'Multímetro',
      'Alicate amperímetro',
      'Manifold',
      'Termômetro digital',
      'Detector de vazamento',
      'Chaves Allen',
      'Escada',
      'Bomba de vácuo (se necessário)'
    ],
    requiredPPE: [
      'Luvas de proteção',
      'Óculos de segurança',
      'Capacete (trabalho em altura)',
      'Cinto de segurança (se aplicável)'
    ],
    safetyWarnings: [
      'Desligar energia antes de abrir painéis elétricos',
      'Verificar pressão do sistema antes de abrir tubulações',
      'Trabalho em altura requer certificação NR-35',
      'Gás refrigerante pressurizado - risco de queimadura por frio'
    ]
  },

  sections: [
    {
      id: 'ac-001',
      title: '1. INSPEÇÃO VISUAL GERAL',
      order: 1,
      category: MaintenanceCategory.STRUCTURE,
      description: 'Verificações iniciais sem necessidade de ferramentas',
      items: [
        {
          id: 'ac-001-01',
          code: 'AC-VIS-001',
          description: 'Estado geral da carcaça (unidade interna)',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.STRUCTURE,
          criticality: CriticalityLevel.LOW,
          expectedResult: 'Sem danos, rachaduras ou oxidação',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: false,
          aiSuggestion: 'Verificar se há danos visíveis, deformações, oxidação ou entrada de água',
          estimatedTimeMinutes: 2
        },
        {
          id: 'ac-001-02',
          code: 'AC-VIS-002',
          description: 'Estado geral da carcaça (unidade externa)',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.STRUCTURE,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Sem danos, oxidação ou obstruções',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: false,
          riskIfFailed: 'Oxidação pode causar vazamento de refrigerante',
          estimatedTimeMinutes: 2
        },
        {
          id: 'ac-001-03',
          code: 'AC-VIS-003',
          description: 'Fixação das unidades (parede/piso)',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.SAFETY,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Fixação firme e nivelada',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Queda da unidade - risco de acidente grave',
          regulatoryReference: 'NBR 16401',
          estimatedTimeMinutes: 3
        },
        {
          id: 'ac-001-04',
          code: 'AC-VIS-004',
          description: 'Dreno de condensado (vazamentos ou entupimento)',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.HYGIENE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Drenagem livre e sem vazamentos',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Vazamento de água, proliferação de fungos e mau cheiro',
          estimatedTimeMinutes: 3
        }
      ]
    },

    {
      id: 'ac-002',
      title: '2. SISTEMA ELÉTRICO',
      order: 2,
      category: MaintenanceCategory.ELECTRICAL,
      description: 'Verificações elétricas e de segurança',
      items: [
        {
          id: 'ac-002-01',
          code: 'AC-ELE-001',
          description: 'Tensão de alimentação (V)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.ELECTRICAL,
          criticality: CriticalityLevel.CRITICAL,
          measurementRange: {
            min: 200,
            max: 240,
            ideal: 220,
            unit: 'V',
            tolerance: 10
          },
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Tensão inadequada causa danos ao compressor',
          regulatoryReference: 'NBR 5410',
          estimatedTimeMinutes: 3
        },
        {
          id: 'ac-002-02',
          code: 'AC-ELE-002',
          description: 'Corrente elétrica do compressor (A)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.ELECTRICAL,
          criticality: CriticalityLevel.HIGH,
          measurementRange: {
            unit: 'A',
            tolerance: 15
          },
          aiSuggestion: 'Comparar com corrente nominal da placa do equipamento',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Sobrecarga indica falha mecânica ou elétrica',
          estimatedTimeMinutes: 4
        },
        {
          id: 'ac-002-03',
          code: 'AC-ELE-003',
          description: 'Estado dos cabos elétricos e conexões',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.ELECTRICAL,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Cabos íntegros, sem ressecamento ou exposição',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Risco de curto-circuito e incêndio',
          regulatoryReference: 'NR-10',
          estimatedTimeMinutes: 3
        },
        {
          id: 'ac-002-04',
          code: 'AC-ELE-004',
          description: 'Aterramento do equipamento',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.SAFETY,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Aterramento presente e funcional',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Risco de choque elétrico',
          regulatoryReference: 'NBR 5410',
          estimatedTimeMinutes: 2
        },
        {
          id: 'ac-002-05',
          code: 'AC-ELE-005',
          description: 'Funcionamento do disjuntor/fusível',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.ELECTRICAL,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Dimensionamento correto e funcionamento normal',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          estimatedTimeMinutes: 2
        }
      ]
    },

    {
      id: 'ac-003',
      title: '3. SISTEMA DE REFRIGERAÇÃO',
      order: 3,
      category: MaintenanceCategory.REFRIGERATION,
      description: 'Verificações do circuito frigorífico',
      items: [
        {
          id: 'ac-003-01',
          code: 'AC-REF-001',
          description: 'Pressão de sucção (PSI)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.HIGH,
          measurementRange: {
            min: 60,
            max: 80,
            ideal: 70,
            unit: 'PSI',
            tolerance: 10
          },
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Pressão anormal indica vazamento ou carga incorreta',
          estimatedTimeMinutes: 5
        },
        {
          id: 'ac-003-02',
          code: 'AC-REF-002',
          description: 'Pressão de descarga (PSI)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.HIGH,
          measurementRange: {
            min: 200,
            max: 280,
            ideal: 240,
            unit: 'PSI',
            tolerance: 15
          },
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Pressão alta pode danificar compressor',
          estimatedTimeMinutes: 3
        },
        {
          id: 'ac-003-03',
          code: 'AC-REF-003',
          description: 'Temperatura de insuflamento (°C)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.PERFORMANCE,
          criticality: CriticalityLevel.MEDIUM,
          measurementRange: {
            min: 8,
            max: 14,
            ideal: 11,
            unit: '°C',
            tolerance: 2
          },
          allowPhoto: false,
          allowNotes: true,
          requiresAction: false,
          aiSuggestion: 'Medir com termômetro digital no difusor',
          estimatedTimeMinutes: 3
        },
        {
          id: 'ac-003-04',
          code: 'AC-REF-004',
          description: 'Teste de vazamento (detector eletrônico)',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Sem vazamentos detectados',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Perda de gás = perda de eficiência e dano ambiental',
          regulatoryReference: 'Lei 14.024/2020 (Controle de gases refrigerantes)',
          estimatedTimeMinutes: 8
        },
        {
          id: 'ac-003-05',
          code: 'AC-REF-005',
          description: 'Estado das tubulações de cobre',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.REFRIGERATION,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Sem amassamentos, oxidação ou óleo visível',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Vazamento de gás refrigerante',
          estimatedTimeMinutes: 4
        },
        {
          id: 'ac-003-06',
          code: 'AC-REF-006',
          description: 'Isolamento térmico das tubulações',
          type: ChecklistItemType.VISUAL_INSPECTION,
          category: MaintenanceCategory.PERFORMANCE,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Isolamento íntegro, sem rasgos ou compressão',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: false,
          riskIfFailed: 'Perda de eficiência energética',
          estimatedTimeMinutes: 3
        }
      ]
    },

    {
      id: 'ac-004',
      title: '4. LIMPEZA E MANUTENÇÃO',
      order: 4,
      category: MaintenanceCategory.HYGIENE,
      description: 'Procedimentos de limpeza preventiva',
      items: [
        {
          id: 'ac-004-01',
          code: 'AC-LIM-001',
          description: 'Limpeza do filtro de ar (unidade interna)',
          type: ChecklistItemType.CLEANING,
          category: MaintenanceCategory.HYGIENE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Filtro limpo e sem obstruções',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Redução de eficiência, aumento de consumo e risco microbiológico',
          frequency: {
            preventive: 1,
            unit: 'months'
          },
          estimatedTimeMinutes: 10
        },
        {
          id: 'ac-004-02',
          code: 'AC-LIM-002',
          description: 'Limpeza do evaporador (serpentina interna)',
          type: ChecklistItemType.CLEANING,
          category: MaintenanceCategory.HYGIENE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Serpentina limpa e sem sujeira acumulada',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Perda de troca térmica e proliferação de fungos',
          aiSuggestion: 'Usar produto específico para serpentinas. Higienizar com água sob pressão',
          frequency: {
            preventive: 3,
            unit: 'months'
          },
          estimatedTimeMinutes: 20
        },
        {
          id: 'ac-004-03',
          code: 'AC-LIM-003',
          description: 'Limpeza do condensador (serpentina externa)',
          type: ChecklistItemType.CLEANING,
          category: MaintenanceCategory.PERFORMANCE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Serpentina livre de sujeira, folhas e obstruções',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Superaquecimento do sistema e falha do compressor',
          frequency: {
            preventive: 3,
            unit: 'months'
          },
          estimatedTimeMinutes: 15
        },
        {
          id: 'ac-004-04',
          code: 'AC-LIM-004',
          description: 'Limpeza da bandeja de condensado',
          type: ChecklistItemType.CLEANING,
          category: MaintenanceCategory.HYGIENE,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Bandeja limpa e sem acúmulo de lodo',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Entupimento do dreno e vazamento de água',
          frequency: {
            preventive: 3,
            unit: 'months'
          },
          estimatedTimeMinutes: 10
        },
        {
          id: 'ac-004-05',
          code: 'AC-LIM-005',
          description: 'Limpeza/desobstrução do dreno',
          type: ChecklistItemType.CLEANING,
          category: MaintenanceCategory.HYGIENE,
          criticality: CriticalityLevel.HIGH,
          expectedResult: 'Dreno desobstruído e com escoamento livre',
          allowPhoto: true,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Vazamento interno e danos ao imóvel',
          frequency: {
            preventive: 3,
            unit: 'months'
          },
          estimatedTimeMinutes: 8
        },
        {
          id: 'ac-004-06',
          code: 'AC-LIM-006',
          description: 'Higienização do gabinete e difusores',
          type: ChecklistItemType.CLEANING,
          category: MaintenanceCategory.HYGIENE,
          criticality: CriticalityLevel.LOW,
          expectedResult: 'Superfícies limpas e sem acúmulo de poeira',
          allowPhoto: false,
          allowNotes: false,
          requiresAction: false,
          estimatedTimeMinutes: 5
        }
      ]
    },

    {
      id: 'ac-005',
      title: '5. TESTES DE FUNCIONAMENTO',
      order: 5,
      category: MaintenanceCategory.PERFORMANCE,
      description: 'Verificações operacionais finais',
      items: [
        {
          id: 'ac-005-01',
          code: 'AC-FUN-001',
          description: 'Teste de acionamento do compressor',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.PERFORMANCE,
          criticality: CriticalityLevel.CRITICAL,
          expectedResult: 'Compressor parte sem ruídos anormais',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Compressor travado ou com falha iminente',
          estimatedTimeMinutes: 3
        },
        {
          id: 'ac-005-02',
          code: 'AC-FUN-002',
          description: 'Teste de oscilação das aletas',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.MECHANICAL,
          criticality: CriticalityLevel.LOW,
          expectedResult: 'Aletas oscilam livremente sem travamentos',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: false,
          estimatedTimeMinutes: 2
        },
        {
          id: 'ac-005-03',
          code: 'AC-FUN-003',
          description: 'Teste do controle remoto e funções',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.PERFORMANCE,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Todas as funções respondem corretamente',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: false,
          estimatedTimeMinutes: 3
        },
        {
          id: 'ac-005-04',
          code: 'AC-FUN-004',
          description: 'Teste de ruído operacional (dB)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.PERFORMANCE,
          criticality: CriticalityLevel.LOW,
          measurementRange: {
            max: 55,
            unit: 'dB',
            tolerance: 5
          },
          allowPhoto: false,
          allowNotes: true,
          requiresAction: false,
          aiSuggestion: 'Ruídos anormais podem indicar rolamento gasto ou ventilador desbalanceado',
          estimatedTimeMinutes: 3
        },
        {
          id: 'ac-005-05',
          code: 'AC-FUN-005',
          description: 'Teste de vibração anormal',
          type: ChecklistItemType.TEST,
          category: MaintenanceCategory.MECHANICAL,
          criticality: CriticalityLevel.MEDIUM,
          expectedResult: 'Sem vibrações excessivas',
          allowPhoto: false,
          allowNotes: true,
          requiresAction: true,
          riskIfFailed: 'Vibração excessiva pode soltar fixações e causar vazamentos',
          estimatedTimeMinutes: 2
        },
        {
          id: 'ac-005-06',
          code: 'AC-FUN-006',
          description: 'Delta T (diferença entrada/saída °C)',
          type: ChecklistItemType.MEASUREMENT,
          category: MaintenanceCategory.PERFORMANCE,
          criticality: CriticalityLevel.MEDIUM,
          measurementRange: {
            min: 8,
            max: 15,
            ideal: 12,
            unit: '°C',
            tolerance: 2
          },
          allowPhoto: false,
          allowNotes: true,
          requiresAction: false,
          aiSuggestion: 'Delta T baixo indica problema de carga ou troca térmica',
          estimatedTimeMinutes: 5
        }
      ]
    }
  ]
};
