import { 
  MaintenanceReportData, 
  PDFGenerationOptions, 
  ReportSummary, 
  ReportSeverity 
} from './pdf-types';
import { ChecklistStatus, CriticalityLevel } from '../technical-checklists/checklist-model';

export class MaintenanceReportGenerator {
  private readonly pageWidth = 210;
  private readonly pageHeight = 297;
  private readonly margin = 15;
  private readonly contentWidth = this.pageWidth - (this.margin * 2);
  
  private currentY = 0;
  private currentPage = 1;

  constructor(
    private data: MaintenanceReportData,
    private options: PDFGenerationOptions = {
      includePhotos: true,
      includeDetailedChecklist: true,
      language: 'pt-BR'
    }
  ) {}

  public generateHTML(): string {
    const summary = this.calculateSummary();
    
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Relatório Técnico - ${this.data.client.name}</title>
  <style>
    ${this.getStyles()}
  </style>
</head>
<body>
  <div class="page">
    ${this.renderHeader()}
    ${this.renderServiceInfo()}
    ${this.renderSummaryBox(summary)}
    ${this.renderCriticalFindings()}
    ${this.renderDetailedChecklist()}
    ${this.renderObservations()}
    ${this.renderRecommendations()}
    ${this.renderSignatures()}
    ${this.renderFooter()}
  </div>
</body>
</html>
    `.trim();
  }

  private getStyles(): string {
    const primaryColor = this.options.colorScheme?.primary || '#2563eb';
    const secondaryColor = this.options.colorScheme?.secondary || '#64748b';
    const accentColor = this.options.colorScheme?.accent || '#f59e0b';

    return `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: 'Segoe UI', Arial, sans-serif;
        font-size: 10pt;
        color: #1e293b;
        line-height: 1.5;
      }

      .page {
        width: 210mm;
        min-height: 297mm;
        padding: 15mm;
        background: white;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 12px;
        border-bottom: 3px solid ${primaryColor};
        margin-bottom: 16px;
      }

      .company-info {
        flex: 1;
      }

      .company-name {
        font-size: 18pt;
        font-weight: bold;
        color: ${primaryColor};
        margin-bottom: 4px;
      }

      .company-details {
        font-size: 9pt;
        color: ${secondaryColor};
        line-height: 1.4;
      }

      .logo {
        width: 80px;
        height: 80px;
        object-fit: contain;
      }

      .report-title {
        text-align: center;
        font-size: 14pt;
        font-weight: bold;
        color: ${primaryColor};
        margin: 16px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-bottom: 16px;
      }

      .info-section {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 10px;
      }

      .info-section-title {
        font-size: 10pt;
        font-weight: bold;
        color: ${primaryColor};
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .info-section-title::before {
        content: '▸';
        font-size: 12pt;
      }

      .info-row {
        display: flex;
        margin-bottom: 3px;
        font-size: 9pt;
      }

      .info-label {
        font-weight: 600;
        color: ${secondaryColor};
        min-width: 100px;
      }

      .info-value {
        color: #1e293b;
      }

      .summary-box {
        background: linear-gradient(135deg, ${primaryColor} 0%, #1e40af 100%);
        color: white;
        border-radius: 8px;
        padding: 14px;
        margin-bottom: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .summary-title {
        font-size: 12pt;
        font-weight: bold;
        margin-bottom: 10px;
        text-align: center;
      }

      .summary-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        text-align: center;
      }

      .stat-item {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 6px;
        padding: 8px;
      }

      .stat-value {
        font-size: 20pt;
        font-weight: bold;
        line-height: 1;
      }

      .stat-label {
        font-size: 8pt;
        margin-top: 4px;
        opacity: 0.9;
      }

      .severity-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 9pt;
        font-weight: bold;
        margin-top: 8px;
      }

      .severity-excellent {
        background: #10b981;
        color: white;
      }

      .severity-good {
        background: #3b82f6;
        color: white;
      }

      .severity-attention {
        background: ${accentColor};
        color: white;
      }

      .severity-critical {
        background: #ef4444;
        color: white;
      }

      .findings-section {
        margin-bottom: 16px;
      }

      .section-title {
        font-size: 11pt;
        font-weight: bold;
        color: ${primaryColor};
        margin-bottom: 10px;
        padding-bottom: 4px;
        border-bottom: 2px solid ${primaryColor};
      }

      .finding-card {
        background: white;
        border-left: 4px solid #64748b;
        padding: 10px;
        margin-bottom: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }

      .finding-card.critical {
        border-left-color: #ef4444;
        background: #fef2f2;
      }

      .finding-card.high {
        border-left-color: ${accentColor};
        background: #fffbeb;
      }

      .finding-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }

      .finding-title {
        font-weight: bold;
        font-size: 10pt;
        color: #1e293b;
      }

      .finding-badge {
        font-size: 8pt;
        font-weight: bold;
        padding: 3px 8px;
        border-radius: 12px;
        text-transform: uppercase;
      }

      .badge-critical {
        background: #ef4444;
        color: white;
      }

      .badge-high {
        background: ${accentColor};
        color: white;
      }

      .badge-medium {
        background: #3b82f6;
        color: white;
      }

      .finding-description {
        font-size: 9pt;
        color: #475569;
        margin-bottom: 4px;
      }

      .finding-recommendation {
        font-size: 9pt;
        color: #0f172a;
        background: rgba(255, 255, 255, 0.7);
        padding: 6px;
        border-radius: 4px;
        margin-top: 4px;
      }

      .finding-recommendation::before {
        content: '💡 Recomendação: ';
        font-weight: bold;
        color: ${primaryColor};
      }

      .checklist-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
        font-size: 9pt;
      }

      .checklist-table th {
        background: ${primaryColor};
        color: white;
        padding: 8px;
        text-align: left;
        font-weight: bold;
        font-size: 9pt;
      }

      .checklist-table td {
        padding: 6px 8px;
        border-bottom: 1px solid #e2e8f0;
      }

      .checklist-table tr:hover {
        background: #f8fafc;
      }

      .status-icon {
        font-size: 12pt;
        font-weight: bold;
      }

      .status-compliant {
        color: #10b981;
      }

      .status-non-compliant {
        color: #ef4444;
      }

      .status-attention {
        color: ${accentColor};
      }

      .status-na {
        color: #94a3b8;
      }

      .observations-box {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 16px;
      }

      .observations-title {
        font-weight: bold;
        font-size: 10pt;
        color: ${primaryColor};
        margin-bottom: 6px;
      }

      .observations-text {
        font-size: 9pt;
        color: #475569;
        line-height: 1.6;
        white-space: pre-wrap;
      }

      .recommendations-box {
        background: #fffbeb;
        border: 2px solid ${accentColor};
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 16px;
      }

      .recommendations-title {
        font-weight: bold;
        font-size: 10pt;
        color: #92400e;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .recommendations-title::before {
        content: '⚠️';
      }

      .recommendation-item {
        font-size: 9pt;
        color: #78350f;
        margin-bottom: 4px;
        padding-left: 16px;
        position: relative;
      }

      .recommendation-item::before {
        content: '•';
        position: absolute;
        left: 6px;
        font-weight: bold;
      }

      .next-maintenance {
        background: #ecfdf5;
        border: 2px solid #10b981;
        border-radius: 6px;
        padding: 10px;
        margin-bottom: 16px;
        text-align: center;
      }

      .next-maintenance-title {
        font-size: 10pt;
        font-weight: bold;
        color: #065f46;
        margin-bottom: 4px;
      }

      .next-maintenance-date {
        font-size: 14pt;
        font-weight: bold;
        color: #10b981;
      }

      .signatures {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
        margin-top: 30px;
        margin-bottom: 16px;
      }

      .signature-box {
        text-align: center;
      }

      .signature-line {
        border-top: 2px solid #1e293b;
        margin-bottom: 6px;
        padding-top: 40px;
      }

      .signature-name {
        font-weight: bold;
        font-size: 10pt;
        color: #1e293b;
      }

      .signature-role {
        font-size: 8pt;
        color: ${secondaryColor};
      }

      .footer {
        text-align: center;
        font-size: 8pt;
        color: ${secondaryColor};
        padding-top: 12px;
        border-top: 1px solid #e2e8f0;
        margin-top: 20px;
      }

      .page-number {
        font-weight: bold;
      }

      @media print {
        body {
          margin: 0;
          padding: 0;
        }

        .page {
          margin: 0;
          box-shadow: none;
        }

        .page-break {
          page-break-before: always;
        }
      }
    `;
  }

  private renderHeader(): string {
    const { company } = this.data;
    
    return `
      <div class="header">
        <div class="company-info">
          <div class="company-name">${company.name}</div>
          <div class="company-details">
            ${company.cnpj ? `CNPJ: ${this.formatCNPJ(company.cnpj)}<br>` : ''}
            ${company.address ? `${company.address}<br>` : ''}
            Tel: ${this.formatPhone(company.phone)} | Email: ${company.email}
            ${company.website ? ` | ${company.website}` : ''}
          </div>
        </div>
        ${company.logo ? `<img src="${company.logo}" alt="Logo" class="logo">` : ''}
      </div>
      
      <div class="report-title">
        Relatório Técnico de Manutenção ${this.data.serviceOrder.type === 'preventive' ? 'Preventiva' : 'Corretiva'}
      </div>
    `;
  }

  private renderServiceInfo(): string {
    const { client, equipment, technician, serviceOrder } = this.data;
    
    return `
      <div class="info-grid">
        <div class="info-section">
          <div class="info-section-title">Cliente</div>
          <div class="info-row">
            <span class="info-label">Nome:</span>
            <span class="info-value">${client.name}</span>
          </div>
          ${client.branchName ? `
          <div class="info-row">
            <span class="info-label">Filial:</span>
            <span class="info-value">${client.branchName}</span>
          </div>
          ` : ''}
          ${client.cnpj ? `
          <div class="info-row">
            <span class="info-label">CNPJ:</span>
            <span class="info-value">${this.formatCNPJ(client.cnpj)}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">Endereço:</span>
            <span class="info-value">${client.address}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Telefone:</span>
            <span class="info-value">${this.formatPhone(client.phone)}</span>
          </div>
        </div>

        <div class="info-section">
          <div class="info-section-title">Equipamento</div>
          <div class="info-row">
            <span class="info-label">Tipo:</span>
            <span class="info-value">${equipment.type}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Marca/Modelo:</span>
            <span class="info-value">${equipment.brand} ${equipment.model}</span>
          </div>
          ${equipment.serialNumber ? `
          <div class="info-row">
            <span class="info-label">Nº Série:</span>
            <span class="info-value">${equipment.serialNumber}</span>
          </div>
          ` : ''}
          ${equipment.capacity ? `
          <div class="info-row">
            <span class="info-label">Capacidade:</span>
            <span class="info-value">${equipment.capacity}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">Localização:</span>
            <span class="info-value">${equipment.location}</span>
          </div>
        </div>

        <div class="info-section">
          <div class="info-section-title">Técnico Responsável</div>
          <div class="info-row">
            <span class="info-label">Nome:</span>
            <span class="info-value">${technician.name}</span>
          </div>
          ${technician.registration ? `
          <div class="info-row">
            <span class="info-label">Registro:</span>
            <span class="info-value">${technician.registration}</span>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="info-label">Telefone:</span>
            <span class="info-value">${this.formatPhone(technician.phone)}</span>
          </div>
          ${technician.email ? `
          <div class="info-row">
            <span class="info-label">Email:</span>
            <span class="info-value">${technician.email}</span>
          </div>
          ` : ''}
        </div>

        <div class="info-section">
          <div class="info-section-title">Ordem de Serviço</div>
          <div class="info-row">
            <span class="info-label">OS Nº:</span>
            <span class="info-value">${serviceOrder.id}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Data:</span>
            <span class="info-value">${this.formatDate(serviceOrder.date)}</span>
          </div>
          ${serviceOrder.startTime && serviceOrder.endTime ? `
          <div class="info-row">
            <span class="info-label">Horário:</span>
            <span class="info-value">${serviceOrder.startTime} às ${serviceOrder.endTime}</span>
          </div>
          ` : ''}
          ${serviceOrder.duration ? `
          <div class="info-row">
            <span class="info-label">Duração:</span>
            <span class="info-value">${serviceOrder.duration} minutos</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  private renderSummaryBox(summary: ReportSummary): string {
    const complianceRate = ((summary.compliantItems / summary.totalItems) * 100).toFixed(1);
    
    return `
      <div class="summary-box">
        <div class="summary-title">Resumo da Inspeção</div>
        <div class="summary-stats">
          <div class="stat-item">
            <div class="stat-value">${summary.totalItems}</div>
            <div class="stat-label">Itens<br>Verificados</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${summary.compliantItems}</div>
            <div class="stat-label">Conformes</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${summary.requiresAttentionItems + summary.nonCompliantItems}</div>
            <div class="stat-label">Não<br>Conformes</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${complianceRate}%</div>
            <div class="stat-label">Taxa de<br>Conformidade</div>
          </div>
        </div>
        <div style="text-align: center;">
          <span class="severity-badge severity-${summary.overallSeverity}">
            ${this.getSeverityText(summary.overallSeverity)}
          </span>
        </div>
      </div>
    `;
  }

  private renderCriticalFindings(): string {
    const criticalFindings = this.data.checklistExecution.findings.filter(
      f => f.severity === CriticalityLevel.CRITICAL || f.severity === CriticalityLevel.HIGH
    );

    if (criticalFindings.length === 0) {
      return `
        <div class="findings-section">
          <div class="section-title">✅ Achados Críticos</div>
          <div class="finding-card" style="border-left-color: #10b981; background: #f0fdf4;">
            <div class="finding-title">Nenhum problema crítico identificado</div>
            <div class="finding-description">
              Todos os itens críticos estão em conformidade. O equipamento está operando dentro dos parâmetros esperados.
            </div>
          </div>
        </div>
      `;
    }

    const findingsHTML = criticalFindings.map(finding => `
      <div class="finding-card ${finding.severity}">
        <div class="finding-header">
          <div class="finding-title">${finding.description}</div>
          <span class="finding-badge badge-${finding.severity}">
            ${this.getCriticalityText(finding.severity)}
          </span>
        </div>
        <div class="finding-description">
          Urgência: <strong>${this.getUrgencyText(finding.urgency)}</strong>
          ${finding.estimatedCost ? ` | Custo estimado: <strong>R$ ${finding.estimatedCost.toFixed(2)}</strong>` : ''}
        </div>
        <div class="finding-recommendation">
          ${finding.recommendation}
        </div>
      </div>
    `).join('');

    return `
      <div class="findings-section">
        <div class="section-title">⚠️ Achados Críticos (${criticalFindings.length})</div>
        ${findingsHTML}
      </div>
    `;
  }

  private renderDetailedChecklist(): string {
    if (!this.options.includeDetailedChecklist) {
      return '';
    }

    const rows = this.data.checklistExecution.items.map(item => {
      const statusIcon = this.getStatusIcon(item.status);
      const statusClass = this.getStatusClass(item.status);
      
      return `
        <tr>
          <td class="status-icon ${statusClass}">${statusIcon}</td>
          <td>${item.itemId}</td>
          <td>
            ${item.measuredValue ? `${item.measuredValue}` : ''}
            ${item.textValue || '-'}
          </td>
          <td>${item.notes || '-'}</td>
        </tr>
      `;
    }).join('');

    return `
      <div class="findings-section">
        <div class="section-title">📋 Checklist Detalhado</div>
        <table class="checklist-table">
          <thead>
            <tr>
              <th style="width: 40px;">Status</th>
              <th style="width: 120px;">Item</th>
              <th style="width: 100px;">Valor/Resultado</th>
              <th>Observações</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }

  private renderObservations(): string {
    if (!this.data.generalObservations && !this.data.checklistExecution.technicianNotes) {
      return '';
    }

    const observations = this.data.generalObservations || this.data.checklistExecution.technicianNotes || '';

    return `
      <div class="observations-box">
        <div class="observations-title">📝 Observações Técnicas</div>
        <div class="observations-text">${observations}</div>
      </div>
    `;
  }

  private renderRecommendations(): string {
    const findings = this.data.checklistExecution.findings;
    const aiRecommendations = this.data.checklistExecution.aiRecommendations || [];
    
    if (findings.length === 0 && aiRecommendations.length === 0) {
      return '';
    }

    const recommendationsHTML = [
      ...findings.map(f => f.recommendation),
      ...aiRecommendations
    ].map(rec => `<div class="recommendation-item">${rec}</div>`).join('');

    const nextMaintenance = this.data.nextMaintenanceDate ? `
      <div class="next-maintenance">
        <div class="next-maintenance-title">🗓️ Próxima Manutenção Preventiva</div>
        <div class="next-maintenance-date">${this.formatDate(this.data.nextMaintenanceDate)}</div>
      </div>
    ` : '';

    return `
      ${nextMaintenance}
      
      <div class="recommendations-box">
        <div class="recommendations-title">Recomendações e Ações Necessárias</div>
        ${recommendationsHTML}
      </div>
    `;
  }

  private renderSignatures(): string {
    return `
      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-name">${this.data.technician.name}</div>
          <div class="signature-role">Técnico Responsável</div>
          ${this.data.technician.registration ? `<div class="signature-role">Registro: ${this.data.technician.registration}</div>` : ''}
        </div>
        
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-name">${this.data.client.contactName || 'Responsável pelo Estabelecimento'}</div>
          <div class="signature-role">Cliente</div>
          <div class="signature-role">Data: ${this.formatDate(new Date())}</div>
        </div>
      </div>
    `;
  }

  private renderFooter(): string {
    return `
      <div class="footer">
        <div>
          Relatório gerado automaticamente em ${this.formatDate(new Date())} às ${new Date().toLocaleTimeString('pt-BR')}
        </div>
        <div class="page-number">Página ${this.currentPage}</div>
      </div>
    `;
  }

  private calculateSummary(): ReportSummary {
    const items = this.data.checklistExecution.items;
    const findings = this.data.checklistExecution.findings;

    const totalItems = items.length;
    const compliantItems = items.filter(i => i.status === ChecklistStatus.COMPLIANT).length;
    const nonCompliantItems = items.filter(i => i.status === ChecklistStatus.NON_COMPLIANT).length;
    const requiresAttentionItems = items.filter(i => i.status === ChecklistStatus.REQUIRES_ATTENTION).length;

    const criticalFindings = findings.filter(f => f.severity === CriticalityLevel.CRITICAL).length;
    const highPriorityFindings = findings.filter(f => f.severity === CriticalityLevel.HIGH).length;

    let overallSeverity: ReportSeverity;
    if (criticalFindings > 0) {
      overallSeverity = ReportSeverity.CRITICAL;
    } else if (highPriorityFindings > 0 || nonCompliantItems > 2) {
      overallSeverity = ReportSeverity.ATTENTION;
    } else if (requiresAttentionItems > 0 || nonCompliantItems > 0) {
      overallSeverity = ReportSeverity.GOOD;
    } else {
      overallSeverity = ReportSeverity.EXCELLENT;
    }

    return {
      totalItems,
      compliantItems,
      nonCompliantItems,
      requiresAttentionItems,
      overallSeverity,
      criticalFindings,
      highPriorityFindings
    };
  }

  private getStatusIcon(status: ChecklistStatus): string {
    switch (status) {
      case ChecklistStatus.COMPLIANT:
        return '✓';
      case ChecklistStatus.NON_COMPLIANT:
        return '✗';
      case ChecklistStatus.REQUIRES_ATTENTION:
        return '⚠';
      case ChecklistStatus.NOT_APPLICABLE:
        return '○';
      default:
        return '-';
    }
  }

  private getStatusClass(status: ChecklistStatus): string {
    switch (status) {
      case ChecklistStatus.COMPLIANT:
        return 'status-compliant';
      case ChecklistStatus.NON_COMPLIANT:
        return 'status-non-compliant';
      case ChecklistStatus.REQUIRES_ATTENTION:
        return 'status-attention';
      case ChecklistStatus.NOT_APPLICABLE:
        return 'status-na';
      default:
        return '';
    }
  }

  private getSeverityText(severity: ReportSeverity): string {
    switch (severity) {
      case ReportSeverity.EXCELLENT:
        return '✓ EXCELENTE - Equipamento em perfeito estado';
      case ReportSeverity.GOOD:
        return 'BOM - Pequenas atenções necessárias';
      case ReportSeverity.ATTENTION:
        return '⚠ ATENÇÃO - Requer manutenção corretiva';
      case ReportSeverity.CRITICAL:
        return '🔴 CRÍTICO - Ação imediata necessária';
      default:
        return '';
    }
  }

  private getCriticalityText(criticality: CriticalityLevel): string {
    switch (criticality) {
      case CriticalityLevel.CRITICAL:
        return 'CRÍTICO';
      case CriticalityLevel.HIGH:
        return 'ALTO';
      case CriticalityLevel.MEDIUM:
        return 'MÉDIO';
      case CriticalityLevel.LOW:
        return 'BAIXO';
      default:
        return '';
    }
  }

  private getUrgencyText(urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term'): string {
    switch (urgency) {
      case 'immediate':
        return 'Imediata (24h)';
      case 'short_term':
        return 'Curto prazo (até 7 dias)';
      case 'medium_term':
        return 'Médio prazo (até 30 dias)';
      case 'long_term':
        return 'Longo prazo (próxima preventiva)';
      default:
        return '';
    }
  }

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }

  private formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    }
    if (cleaned.length === 10) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`;
    }
    return phone;
  }

  private formatCNPJ(cnpj: string): string {
    const cleaned = cnpj.replace(/\D/g, '');
    if (cleaned.length === 14) {
      return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/${cleaned.substring(8, 12)}-${cleaned.substring(12)}`;
    }
    return cnpj;
  }
}
