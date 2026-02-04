/**
 * MODELO GENÉRICO DE CHECKLIST TÉCNICO
 * 
 * Sistema modular e escalável para qualquer tipo de equipamento
 * de manutenção industrial, refrigeração e elétrica
 */

export enum ChecklistItemType {
  VISUAL_INSPECTION = 'visual_inspection',
  MEASUREMENT = 'measurement',
  TEST = 'test',
  CLEANING = 'cleaning',
  ADJUSTMENT = 'adjustment',
  REPLACEMENT = 'replacement',
  DOCUMENTATION = 'documentation'
}

export enum CriticalityLevel {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export enum MaintenanceCategory {
  ELECTRICAL = 'electrical',
  REFRIGERATION = 'refrigeration',
  MECHANICAL = 'mechanical',
  SAFETY = 'safety',
  STRUCTURE = 'structure',
  HYGIENE = 'hygiene',
  PERFORMANCE = 'performance'
}

export enum ChecklistStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  REQUIRES_ATTENTION = 'requires_attention',
  NOT_APPLICABLE = 'not_applicable'
}

export interface MeasurementRange {
  min?: number;
  max?: number;
  ideal?: number;
  unit: string;
  tolerance?: number;
}

export interface ChecklistItem {
  id: string;
  code: string;
  description: string;
  type: ChecklistItemType;
  category: MaintenanceCategory;
  criticality: CriticalityLevel;
  
  measurementRange?: MeasurementRange;
  
  expectedResult?: string;
  
  aiSuggestion?: string;
  
  allowPhoto: boolean;
  allowNotes: boolean;
  requiresAction: boolean;
  
  regulatoryReference?: string;
  
  frequency?: {
    preventive: number;
    unit: 'days' | 'months' | 'years';
  };
  
  linkedItems?: string[];
  
  riskIfFailed?: string;
  
  estimatedTimeMinutes?: number;
}

export interface ChecklistSection {
  id: string;
  title: string;
  order: number;
  description?: string;
  category: MaintenanceCategory;
  items: ChecklistItem[];
}

export interface EquipmentChecklist {
  equipmentType: string;
  equipmentCategory: string;
  version: string;
  lastUpdated: Date;
  createdBy: string;
  
  sections: ChecklistSection[];
  
  metadata: {
    estimatedDuration: number;
    minimumTechnicianLevel: 'junior' | 'pleno' | 'senior';
    requiredTools: string[];
    requiredPPE: string[];
    safetyWarnings: string[];
  };
}

export interface ChecklistExecution {
  id: string;
  checklistId: string;
  equipmentId: string;
  technicianId: string;
  serviceOrderId: string;
  
  startedAt: Date;
  completedAt?: Date;
  
  items: ChecklistExecutionItem[];
  
  overallStatus: 'in_progress' | 'completed' | 'partially_completed';
  
  findings: Finding[];
  
  photosUrls: string[];
  
  technicianNotes?: string;
  
  aiRecommendations?: string[];
}

export interface ChecklistExecutionItem {
  itemId: string;
  status: ChecklistStatus;
  measuredValue?: number;
  textValue?: string;
  photoUrls?: string[];
  notes?: string;
  timestamp: Date;
  requiresFollowUp: boolean;
}

export interface Finding {
  id: string;
  itemId: string;
  severity: CriticalityLevel;
  description: string;
  recommendation: string;
  estimatedCost?: number;
  urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  photos?: string[];
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  equipmentTypes: string[];
  isActive: boolean;
  isPremium: boolean;
  checklist: EquipmentChecklist;
}
