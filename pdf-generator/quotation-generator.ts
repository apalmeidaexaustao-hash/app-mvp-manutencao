import { QuotationData, PDFGenerationOptions, QuotationItem } from './pdf-types';

export class QuotationGenerator {
  private readonly pageWidth = 210;
  private readonly pageHeight = 297;
  private readonly margin = 15;
  private readonly contentWidth = this.pageWidth - (this.margin * 2);

  constructor(
    private data: QuotationData,
    private options: PDFGenerationOptions = {
      includePhotos: false,
      includeDetailedChecklist: false,
      language: 'pt-BR'
    }
  ) {}

  public generateHTML(): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orçamento - ${this.data.client.name}</title>
  <style>
    ${this.getStyles()}
  </style>
</head>
<body>
  <div class="page">
    ${this.renderHeader()}
    ${this.renderQuotationInfo()}
    ${this.renderFindings()}
    ${this.renderItemsTable()}
    ${this.renderTotals()}
    ${this.renderConditions()}
    ${this.renderAIRecommendations()}
    ${this.renderFooter()}
  </div>
</body>
</html>
    `.trim();
  }

  private getStyles(): string {
    const primaryColor = this.options.colorScheme?.primary || '#2563eb';
    const secondaryColor = this.options.colorScheme?.secondary || '#64748b';
    const accentColor = this.options.colorScheme?.accent || '#10b981';

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

      .quotation-title {
        text-align: center;
        font-size: 16pt;
        font-weight: bold;
        color: ${primaryColor};
        margin: 16px 0;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .quotation-number {
        text-align: center;
        font-size: 11pt;
        color: ${secondaryColor};
        margin-bottom: 16px;
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
      }

      .info-row {
        display: flex;
        margin-bottom: 3px;
        font-size: 9pt;
      }

      .info-label {
        font-weight: 600;
        color: ${secondaryColor};
        min-width: 90px;
      }

      .info-value {
        color: #1e293b;
      }

      .findings-summary {
        background: #fef2f2;
        border-left: 4px solid #ef4444;
        padding: 12px;
        margin-bottom: 16px;
        border-radius: 4px;
      }

      .findings-title {
        font-size: 11pt;
        font-weight: bold;
        color: #991b1b;
        margin-bottom: 8px;
      }

      .finding-item {
        font-size: 9pt;
        color: #7f1d1d;
        margin-bottom: 4px;
        padding-left: 16px;
        position: relative;
      }

      .finding-item::before {
        content: '⚠';
        position: absolute;
        left: 0;
        color: #ef4444;
      }

      .items-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 16px;
        font-size: 9pt;
      }

      .items-table th {
        background: ${primaryColor};
        color: white;
        padding: 10px 8px;
        text-align: left;
        font-weight: bold;
        font-size: 9pt;
      }

      .items-table th.center {
        text-align: center;
      }

      .items-table th.right {
        text-align: right;
      }

      .items-table td {
        padding: 8px;
        border-bottom: 1px solid #e2e8f0;
        vertical-align: top;
      }

      .items-table td.center {
        text-align: center;
      }

      .items-table td.right {
        text-align: right;
      }

      .items-table tr:hover {
        background: #f8fafc;
      }

      .item-type {
        display: inline-block;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 8pt;
        font-weight: bold;
        text-transform: uppercase;
      }

      .type-part {
        background: #dbeafe;
        color: #1e40af;
      }

      .type-service {
        background: #dcfce7;
        color: #166534;
      }

      .type-labor {
        background: #fef3c7;
        color: #92400e;
      }

      .urgency-badge {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 8pt;
        font-weight: bold;
        margin-left: 6px;
      }

      .urgency-immediate {
        background: #ef4444;
        color: white;
      }

      .urgency-short {
        background: #f59e0b;
        color: white;
      }

      .urgency-medium {
        background: #3b82f6;
        color: white;
      }

      .urgency-long {
        background: #64748b;
        color: white;
      }

      .item-description {
        font-weight: 600;
        color: #0f172a;
        margin-bottom: 2px;
      }

      .item-justification {
        font-size: 8pt;
        color: ${secondaryColor};
        font-style: italic;
      }

      .totals-section {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 20px;
      }

      .totals-box {
        width: 300px;
        background: #f8fafc;
        border: 2px solid #e2e8f0;
        border-radius: 6px;
        padding: 12px;
      }

      .total-row {
        display: flex;
        justify-content: space-between;
        padding: 6px 0;
        font-size: 10pt;
      }

      .total-row.subtotal {
        border-bottom: 1px solid #cbd5e1;
      }

      .total-row.discount {
        color: ${accentColor};
        font-weight: 600;
      }

      .total-row.final {
        border-top: 2px solid ${primaryColor};
        margin-top: 8px;
        padding-top: 12px;
        font-size: 14pt;
        font-weight: bold;
        color: ${primaryColor};
      }

      .conditions-section {
        background: #fffbeb;
        border: 1px solid #fbbf24;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 16px;
      }

      .conditions-title {
        font-size: 11pt;
        font-weight: bold;
        color: #92400e;
        margin-bottom: 8px;
      }

      .condition-item {
        font-size: 9pt;
        color: #78350f;
        margin-bottom: 4px;
        padding-left: 16px;
        position: relative;
      }

      .condition-item::before {
        content: '📌';
        position: absolute;
        left: 0;
      }

      .ai-recommendations {
        background: #f0f9ff;
        border: 2px solid #0284c7;
        border-radius: 6px;
        padding: 12px;
        margin-bottom: 16px;
      }

      .ai-title {
        font-size: 11pt;
        font-weight: bold;
        color: #075985;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .ai-title::before {
        content: '🤖';
      }

      .ai-item {
        font-size: 9pt;
        color: #0c4a6e;
        margin-bottom: 4px;
        padding-left: 16px;
        position: relative;
      }

      .ai-item::before {
        content: '💡';
        position: absolute;
        left: 0;
      }

      .validity-box {
        background: #fef2f2;
        border: 1px solid #fca5a5;
        border-radius: 6px;
        padding: 10px;
        text-align: center;
        margin-bottom: 16px;
      }

      .validity-text {
        font-size: 10pt;
        color: #991b1b;
        font-weight: 600;
      }

      .footer {
        text-align: center;
        font-size: 8pt;
        color: ${secondaryColor};
        padding-top: 12px;
        border-top: 1px solid #e2e8f0;
        margin-top: 20px;
      }

      .contact-info {
        margin-top: 8px;
        font-weight: 600;
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
        ${company.logo ? `<img src="${company.logo}" alt="Logo" style="width: 80px; height: 80px; object-fit: contain;">` : ''}
      </div>

      <div class="quotation-title">Orçamento</div>
      <div class="quotation-number">Nº ${this.data.quotationNumber}</div>
    `;
  }

  private renderQuotationInfo(): string {
    const { client, equipment, issueDate, validUntil } = this.data;

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
          <div class="info-row">
            <span class="info-label">Localização:</span>
            <span class="info-value">${equipment.location}</span>
          </div>
        </div>

        <div class="info-section">
          <div class="info-section-title">Dados do Orçamento</div>
          <div class="info-row">
            <span class="info-label">Emissão:</span>
            <span class="info-value">${this.formatDate(issueDate)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Validade:</span>
            <span class="info-value">${this.formatDate(validUntil)}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Técnico:</span>
            <span class="info-value">${this.data.technician.name}</span>
          </div>
        </div>
      </div>

      <div class="validity-box">
        <div class="validity-text">
          ⏰ Orçamento válido até ${this.formatDate(validUntil)}
        </div>
      </div>
    `;
  }

  private renderFindings(): string {
    if (this.data.findings.length === 0) {
      return '';
    }

    const findingsHTML = this.data.findings.map(finding => `
      <div class="finding-item">${finding.description}</div>
    `).join('');

    return `
      <div class="findings-summary">
        <div class="findings-title">Problemas Identificados</div>
        ${findingsHTML}
      </div>
    `;
  }

  private renderItemsTable(): string {
    const itemsHTML = this.data.items.map((item, index) => {
      const typeClass = `type-${item.type}`;
      const typeText = this.getItemTypeText(item.type);
      const urgencyBadge = item.urgency ? this.getUrgencyBadge(item.urgency) : '';

      return `
        <tr>
          <td class="center">${index + 1}</td>
          <td>
            <div class="item-description">${item.description} ${urgencyBadge}</div>
            ${item.justification ? `<div class="item-justification">${item.justification}</div>` : ''}
          </td>
          <td class="center">
            <span class="item-type ${typeClass}">${typeText}</span>
          </td>
          <td class="center">${item.quantity}</td>
          <td class="right">R$ ${item.unitPrice.toFixed(2)}</td>
          <td class="right"><strong>R$ ${item.total.toFixed(2)}</strong></td>
        </tr>
      `;
    }).join('');

    return `
      <table class="items-table">
        <thead>
          <tr>
            <th class="center" style="width: 40px;">#</th>
            <th>Descrição</th>
            <th class="center" style="width: 80px;">Tipo</th>
            <th class="center" style="width: 60px;">Qtd</th>
            <th class="right" style="width: 100px;">Valor Unit.</th>
            <th class="right" style="width: 100px;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
    `;
  }

  private renderTotals(): string {
    const { subtotal, discount, discountPercentage, total } = this.data;

    return `
      <div class="totals-section">
        <div class="totals-box">
          <div class="total-row subtotal">
            <span>Subtotal:</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
          </div>
          ${discount && discount > 0 ? `
          <div class="total-row discount">
            <span>Desconto ${discountPercentage ? `(${discountPercentage}%)` : ''}:</span>
            <span>- R$ ${discount.toFixed(2)}</span>
          </div>
          ` : ''}
          <div class="total-row final">
            <span>VALOR TOTAL:</span>
            <span>R$ ${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  }

  private renderConditions(): string {
    const conditions = [];

    if (this.data.paymentConditions) {
      conditions.push(`Pagamento: ${this.data.paymentConditions}`);
    }

    if (this.data.warranty) {
      conditions.push(`Garantia: ${this.data.warranty}`);
    }

    if (this.data.estimatedDelivery) {
      conditions.push(`Prazo de execução: ${this.data.estimatedDelivery}`);
    }

    conditions.push('Valores sujeitos a alteração após confirmação de disponibilidade de peças');
    conditions.push('Serviço realizado em horário comercial (Segunda a Sexta, 8h às 18h)');

    if (this.data.notes) {
      conditions.push(this.data.notes);
    }

    const conditionsHTML = conditions.map(condition => `
      <div class="condition-item">${condition}</div>
    `).join('');

    return `
      <div class="conditions-section">
        <div class="conditions-title">Condições Comerciais</div>
        ${conditionsHTML}
      </div>
    `;
  }

  private renderAIRecommendations(): string {
    if (!this.data.aiRecommendations || this.data.aiRecommendations.length === 0) {
      return '';
    }

    const recommendationsHTML = this.data.aiRecommendations.map(rec => `
      <div class="ai-item">${rec}</div>
    `).join('');

    return `
      <div class="ai-recommendations">
        <div class="ai-title">Recomendações Técnicas</div>
        ${recommendationsHTML}
      </div>
    `;
  }

  private renderFooter(): string {
    const { company, technician } = this.data;

    return `
      <div class="footer">
        <div>
          Orçamento gerado em ${this.formatDate(new Date())} | ${this.data.company.name}
        </div>
        <div class="contact-info">
          Entre em contato: ${this.formatPhone(company.phone)} | ${company.email}
        </div>
        <div style="margin-top: 6px; font-size: 7pt;">
          Atendimento realizado por ${technician.name} | ${this.formatPhone(technician.phone)}
        </div>
      </div>
    `;
  }

  private getItemTypeText(type: 'part' | 'service' | 'labor'): string {
    switch (type) {
      case 'part':
        return 'Peça';
      case 'service':
        return 'Serviço';
      case 'labor':
        return 'Mão de Obra';
      default:
        return '';
    }
  }

  private getUrgencyBadge(urgency: 'immediate' | 'short_term' | 'medium_term' | 'long_term'): string {
    let className = '';
    let text = '';

    switch (urgency) {
      case 'immediate':
        className = 'urgency-immediate';
        text = 'URGENTE';
        break;
      case 'short_term':
        className = 'urgency-short';
        text = 'CURTO PRAZO';
        break;
      case 'medium_term':
        className = 'urgency-medium';
        text = 'MÉDIO PRAZO';
        break;
      case 'long_term':
        className = 'urgency-long';
        text = 'LONGO PRAZO';
        break;
    }

    return `<span class="urgency-badge ${className}">${text}</span>`;
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
