import { 
  ChecklistExecution, 
  ChecklistExecutionItem, 
  Finding, 
  CriticalityLevel 
} from '../technical-checklists/checklist-model';

export interface CompanyInfo {
  name: string;
  cnpj?: string;
  address?: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

export interface ClientInfo {
  id: string;
  name: string;
  cnpj?: string;
  contactName?: string;
  phone: string;
  email?: string;
  address: string;
  branchName?: string;
}

export interface EquipmentInfo {
  id: string;
  type: string;
  brand: string;
  model: string;
  serialNumber?: string;
  capacity?: string;
  installationDate?: Date;
  location: string;
}

export interface TechnicianInfo {
  id: string;
  name: string;
  registration?: string;
  phone: string;
  email?: string;
  signature?: string;
}

export interface ServiceOrderInfo {
  id: string;
  type: 'preventive' | 'corrective' | 'installation';
  date: Date;
  startTime?: string;
  endTime?: string;
  duration?: number;
}

export interface MaintenanceReportData {
  company: CompanyInfo;
  client: ClientInfo;
  equipment: EquipmentInfo;
  technician: TechnicianInfo;
  serviceOrder: ServiceOrderInfo;
  checklistExecution: ChecklistExecution;
  
  generalObservations?: string;
  
  clientSignature?: string;
  clientSignatureDate?: Date;
  
  nextMaintenanceDate?: Date;
  
  photos?: PhotoAttachment[];
}

export interface PhotoAttachment {
  url: string;
  caption?: string;
  timestamp: Date;
  relatedItemId?: string;
}

export interface QuotationItem {
  id: string;
  type: 'part' | 'service' | 'labor';
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  urgency?: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  justification?: string;
}

export interface QuotationData {
  company: CompanyInfo;
  client: ClientInfo;
  equipment: EquipmentInfo;
  technician: TechnicianInfo;
  
  quotationNumber: string;
  issueDate: Date;
  validUntil: Date;
  
  findings: Finding[];
  
  items: QuotationItem[];
  
  subtotal: number;
  discount?: number;
  discountPercentage?: number;
  total: number;
  
  paymentConditions?: string;
  warranty?: string;
  estimatedDelivery?: string;
  
  notes?: string;
  
  aiRecommendations?: string[];
}

export interface PDFGenerationOptions {
  includePhotos: boolean;
  includeDetailedChecklist: boolean;
  language: 'pt-BR' | 'en' | 'es';
  colorScheme?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  watermark?: string;
}

export enum ReportSeverity {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  ATTENTION = 'attention',
  CRITICAL = 'critical'
}

export interface ReportSummary {
  totalItems: number;
  compliantItems: number;
  nonCompliantItems: number;
  requiresAttentionItems: number;
  overallSeverity: ReportSeverity;
  criticalFindings: number;
  highPriorityFindings: number;
}
