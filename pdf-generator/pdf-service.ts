import { MaintenanceReportGenerator } from './maintenance-report-generator';
import { QuotationGenerator } from './quotation-generator';
import { MaintenanceReportData, QuotationData, PDFGenerationOptions } from './pdf-types';

export interface PDFExportOptions {
  format: 'html' | 'pdf';
  filename?: string;
}

export class PDFService {
  public async generateMaintenanceReport(
    data: MaintenanceReportData,
    options?: PDFGenerationOptions
  ): Promise<string> {
    const generator = new MaintenanceReportGenerator(data, options);
    const html = generator.generateHTML();
    return html;
  }

  public async generateQuotation(
    data: QuotationData,
    options?: PDFGenerationOptions
  ): Promise<string> {
    const generator = new QuotationGenerator(data, options);
    const html = generator.generateHTML();
    return html;
  }

  public async exportToPDF(html: string, options: PDFExportOptions): Promise<Buffer | string> {
    return html;
  }

  public getWhatsAppMessage(
    type: 'report' | 'quotation',
    clientName: string,
    quotationNumber?: string
  ): string {
    if (type === 'quotation') {
      return `
Olá! 👋

Segue o *Orçamento ${quotationNumber || ''}* para manutenção do seu equipamento.

📋 *Cliente:* ${clientName}

O orçamento está anexo em PDF e contém:
✅ Problemas identificados
✅ Serviços e peças necessárias
✅ Valores detalhados
✅ Condições de pagamento

Qualquer dúvida, estou à disposição!

Para aprovar este orçamento, basta responder esta mensagem.
      `.trim();
    }

    return `
Olá! 👋

Segue o *Relatório Técnico* da manutenção realizada.

📋 *Cliente:* ${clientName}

O relatório contém:
✅ Itens verificados
✅ Problemas encontrados
✅ Serviços realizados
✅ Recomendações técnicas
✅ Data da próxima manutenção

Equipamento em perfeito funcionamento! ✓

Qualquer dúvida, estou à disposição.
    `.trim();
  }
}

export const pdfService = new PDFService();

export * from './pdf-types';
export * from './maintenance-report-generator';
export * from './quotation-generator';
