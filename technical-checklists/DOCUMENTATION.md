# 📋 SISTEMA DE CHECKLISTS TÉCNICOS - DOCUMENTAÇÃO

## 🎯 Visão Geral

Sistema modular e escalável de checklists técnicos para manutenção de equipamentos industriais, com foco em refrigeração comercial e equipamentos de food service.

---

## 📐 ARQUITETURA DO MODELO

### **1. MODELO GENÉRICO (`checklist-model.ts`)**

Sistema base reutilizável para **qualquer tipo de equipamento**.

#### **Componentes Principais:**

**A) ChecklistItem** - Item individual de verificação
- `type`: Tipo de ação (inspeção, medição, teste, limpeza, ajuste, troca, documentação)
- `category`: Categoria técnica (elétrico, refrigeração, mecânico, segurança, etc)
- `criticality`: Nível de criticidade (crítico, alto, médio, baixo)
- `measurementRange`: Faixas de medição com tolerâncias (para itens de medição)
- `expectedResult`: Resultado esperado da verificação
- `aiSuggestion`: Sugestão automática de procedimento
- `riskIfFailed`: Descrição do risco caso item falhe
- `frequency`: Frequência recomendada de verificação

**B) ChecklistSection** - Agrupamento lógico de itens
- Organiza itens por categoria técnica
- Ordem de execução sequencial
- Descrição do objetivo da seção

**C) EquipmentChecklist** - Checklist completo do equipamento
- Metadata: duração estimada, nível técnico mínimo, ferramentas necessárias, EPIs
- Avisos de segurança críticos
- Seções organizadas

**D) ChecklistExecution** - Registro da execução
- Vinculado a ordem de serviço
- Registro timestamp de cada item
- Fotos e observações
- Status geral de conformidade
- Achados e recomendações

---

## 🏗️ SISTEMA DE CATEGORIZAÇÃO

### **Tipos de Verificação (ChecklistItemType)**
```
VISUAL_INSPECTION  → Inspeção visual sem ferramentas
MEASUREMENT        → Medição com instrumento (requer range)
TEST               → Teste funcional (liga/desliga, movimento)
CLEANING           → Procedimento de limpeza
ADJUSTMENT         → Ajuste ou regulagem
REPLACEMENT        → Substituição de componente
DOCUMENTATION      → Registro ou documentação
```

### **Categorias Técnicas (MaintenanceCategory)**
```
ELECTRICAL       → Sistema elétrico
REFRIGERATION    → Circuito frigorífico
MECHANICAL       → Componentes mecânicos
SAFETY           → Segurança operacional
STRUCTURE        → Estrutura e isolamento
HYGIENE          → Limpeza e sanitização
PERFORMANCE      → Desempenho e eficiência
```

### **Níveis de Criticidade (CriticalityLevel)**
```
CRITICAL  → Risco imediato à segurança ou operação
HIGH      → Problema grave que deve ser corrigido urgentemente
MEDIUM    → Problema que requer atenção em curto prazo
LOW       → Melhoria ou problema estético
```

### **Status de Conformidade (ChecklistStatus)**
```
COMPLIANT             → Conforme / Aprovado
NON_COMPLIANT         → Não conforme / Reprovado
REQUIRES_ATTENTION    → Requer atenção / Atenção
NOT_APPLICABLE        → Não aplicável
```

---

## 🔧 EXEMPLOS IMPLEMENTADOS

### **1. Ar-condicionado Split/VRF** (`air-conditioning-checklist.ts`)

**Seções:**
1. Inspeção Visual Geral (4 itens)
2. Sistema Elétrico (5 itens)
3. Sistema de Refrigeração (6 itens)
4. Limpeza e Manutenção (6 itens)
5. Testes de Funcionamento (6 itens)

**Total:** 27 itens | Duração estimada: 45 min

**Destaques:**
- Medições de pressão (sucção/descarga)
- Teste de vazamento
- Delta T (diferença de temperatura)
- Limpeza de filtros e serpentinas

---

### **2. Câmara Fria** (`cold-room-checklist.ts`)

**Seções:**
1. Inspeção de Segurança Crítica (5 itens) ⚠️ **OBRIGATÓRIA**
2. Sistema Elétrico (6 itens)
3. Sistema de Refrigeração (10 itens)
4. Isolamento e Vedação (5 itens)
5. Limpeza e Higienização (5 itens)
6. Testes Finais e Documentação (5 itens)

**Total:** 36 itens | Duração estimada: 60 min

**Destaques:**
- Teste de trava antipânico (CRÍTICO - NR-36)
- Alarme de emergência interno
- Teste de vedação de porta
- Conformidade ANVISA (RDC 216/2004)

---

## 🚀 COMO CRIAR NOVO CHECKLIST

### **Passo a passo:**

1. **Importar o modelo base**
```typescript
import {
  EquipmentChecklist,
  ChecklistSection,
  ChecklistItem,
  ChecklistItemType,
  CriticalityLevel,
  MaintenanceCategory
} from './checklist-model';
```

2. **Definir metadata do equipamento**
```typescript
export const meuEquipamentoChecklist: EquipmentChecklist = {
  equipmentType: 'Nome do Equipamento',
  equipmentCategory: 'Categoria',
  version: '1.0.0',
  lastUpdated: new Date(),
  createdBy: 'Seu Nome',
  
  metadata: {
    estimatedDuration: 30, // minutos
    minimumTechnicianLevel: 'pleno',
    requiredTools: ['Multímetro', 'Chaves'],
    requiredPPE: ['Luvas', 'Óculos'],
    safetyWarnings: ['Desligar energia antes de abrir']
  },
  
  sections: [...]
};
```

3. **Criar seções organizadas**
```typescript
{
  id: 'eq-001',
  title: '1. NOME DA SEÇÃO',
  order: 1,
  category: MaintenanceCategory.ELECTRICAL,
  items: [...]
}
```

4. **Adicionar itens de verificação**

**Exemplo de inspeção visual:**
```typescript
{
  id: 'eq-001-01',
  code: 'EQ-VIS-001',
  description: 'Estado da carcaça',
  type: ChecklistItemType.VISUAL_INSPECTION,
  category: MaintenanceCategory.STRUCTURE,
  criticality: CriticalityLevel.LOW,
  expectedResult: 'Sem danos visíveis',
  allowPhoto: true,
  allowNotes: true,
  requiresAction: false,
  estimatedTimeMinutes: 2
}
```

**Exemplo de medição:**
```typescript
{
  id: 'eq-002-01',
  code: 'EQ-ELE-001',
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
  riskIfFailed: 'Dano ao equipamento',
  estimatedTimeMinutes: 3
}
```

---

## 🤖 INTEGRAÇÃO COM IA

### **Campos que alimentam IA:**

1. **`aiSuggestion`**: Sugestão de procedimento técnico
2. **`riskIfFailed`**: Descrição de risco para geração de alertas
3. **`regulatoryReference`**: Normativa para inclusão em relatórios
4. **Histórico de execuções**: Padrões de falha recorrente

### **Funcionalidades de IA planejadas:**

✅ Sugestão automática de checklist conforme tipo de equipamento  
✅ Geração de texto técnico para orçamentos baseado em achados  
✅ Alertas preditivos: "Este evaporador falhou 3x nos últimos 6 meses"  
✅ Recomendações: "Baseado no histórico, sugerimos trocar o contator"  
✅ Estimativa de custo automática por peça identificada  

---

## 📊 ESTRUTURA DE DADOS

### **Fluxo de Uso:**

```
1. Técnico abre Ordem de Serviço
   ↓
2. Sistema sugere checklist conforme equipamento cadastrado
   ↓
3. Técnico executa checklist no app
   ↓
4. Para cada item: registra status, valor medido, foto, observação
   ↓
5. Sistema identifica não conformidades automaticamente
   ↓
6. IA gera sugestões de ação e orçamento
   ↓
7. Técnico revisa e aprova
   ↓
8. Orçamento PDF gerado automaticamente
   ↓
9. Cliente recebe via WhatsApp
```

---

## ⚙️ EXPANSÃO DO SISTEMA

### **Próximos Equipamentos Sugeridos:**

1. **Freezer Horizontal/Vertical**
2. **Geladeira Industrial**
3. **Balcão Refrigerado**
4. **Máquina de Gelo**
5. **Chiller Industrial**
6. **Forno Elétrico/A Gás**
7. **Fritadeira Industrial**
8. **Exaustor/Coifa**
9. **Painel Elétrico**
10. **Grupo Gerador**

### **Categorias de Equipamento:**

- **Refrigeração**: AC, Câmara Fria, Freezer, Geladeira
- **Cozinha Elétrica**: Forno, Fritadeira, Fogão Industrial
- **Elétrica**: Painéis, Geradores, Inversores
- **Exaustão**: Coifas, Exaustores, Ventilação

---

## 📋 REGRAS DE NEGÓCIO

### **Sistema de Alertas:**

1. **Criticidade CRITICAL**: Enviar alerta push + email imediatamente
2. **Criticidade HIGH**: Agendar follow-up em 7 dias
3. **Criticidade MEDIUM**: Incluir em próxima preventiva
4. **Criticidade LOW**: Apenas registrar

### **Frequência de Manutenção:**

- Itens com `frequency` definida geram alertas automáticos
- Sistema calcula próxima manutenção baseado em última execução
- Dashboard mostra "preventivas atrasadas" em destaque

### **Conformidade Regulatória:**

- Itens com `regulatoryReference` são marcados como "obrigatórios"
- Relatórios incluem seção de conformidade legal
- Auditoria: rastreabilidade completa de execuções

---

## 🎨 INTERFACE (Sugestão)

### **Tela de Execução:**

```
┌────────────────────────────────────┐
│ [←] CÂMARA FRIA - PREVENTIVA      │
│ Cliente: Restaurante XYZ           │
│ Equipamento: CF-001 | -18°C        │
├────────────────────────────────────┤
│                                    │
│ ☑ 1. SEGURANÇA CRÍTICA (5/5) ✓    │
│ ⚙ 2. SISTEMA ELÉTRICO (3/6)       │
│   ├─ ✓ Tensão alimentação: 380V   │
│   ├─ ✓ Corrente compressor: 12A   │
│   ├─ ✓ Equilíbrio fases: 2%       │
│   ├─ ⚠ Contatores: Requer atenção│
│   │    [📷 Foto] [📝 Observação]  │
│   ├─ ⚙ Aperto de bornes           │
│   └─ ⚙ Teste termostato           │
│                                    │
│ [ Continuar Seção ]                │
└────────────────────────────────────┘
```

---

## 📦 ENTREGÁVEIS

✅ **checklist-model.ts**: Modelo genérico completo  
✅ **air-conditioning-checklist.ts**: Checklist AC (27 itens)  
✅ **cold-room-checklist.ts**: Checklist Câmara Fria (36 itens)  
✅ **DOCUMENTATION.md**: Este arquivo  

---

## 🔐 CONFORMIDADE LEGAL

Checklists incluem referências a:

- **NBR 16401**: Instalações de ar-condicionado
- **NBR 5410**: Instalações elétricas de baixa tensão
- **NR-10**: Segurança em instalações e serviços em eletricidade
- **NR-36**: Segurança e saúde no trabalho em empresas de abate e processamento (câmaras frias)
- **RDC 216/2004 ANVISA**: Boas Práticas para Serviços de Alimentação
- **Lei 14.024/2020**: Controle de emissões de gases refrigerantes

---

## 🚀 PRÓXIMOS PASSOS

1. Implementar banco de dados (Prisma schema)
2. Criar API REST para CRUD de checklists
3. Desenvolver interface mobile (React Native)
4. Integrar geração de PDF
5. Conectar com WhatsApp Business API
6. Implementar sistema de IA para sugestões

---

**Desenvolvido para:** MVP App de Manutenção Técnica  
**Data:** 04/02/2026  
**Versão:** 1.0.0
