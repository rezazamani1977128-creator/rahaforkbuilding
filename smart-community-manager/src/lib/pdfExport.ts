// PDF Export Utilities
// Note: jsPDF and jspdf-autotable need to be installed: npm install jspdf jspdf-autotable
// This is a placeholder implementation that can be used with actual jsPDF once installed

export interface PDFExportOptions {
  title?: string;
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'a3' | 'letter';
}

export interface TableRow {
  [key: string]: string | number;
}

/**
 * Generate PDF from table data
 * Requires jsPDF library to be installed
 */
export function generatePDF(
  columns: string[],
  rows: TableRow[],
  options: PDFExportOptions = {}
): Blob | null {
  const {
    title = 'گزارش',
    filename = 'report.pdf',
    orientation = 'portrait',
    format = 'a4',
  } = options;

  try {
    // This would use jsPDF once installed:
    // import jsPDF from 'jspdf';
    // import 'jspdf-autotable';

    // For now, return null as a placeholder
    console.warn('jsPDF not installed. Install with: npm install jspdf jspdf-autotable');
    return null;

    // Actual implementation would be:
    // const doc = new jsPDF({ orientation, format });
    // doc.setFontSize(16);
    // doc.text(title, 20, 20);
    // doc.autoTable({
    //   head: [columns],
    //   body: rows.map(row => columns.map(col => row[col])),
    //   startY: 30,
    // });
    // return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return null;
  }
}

/**
 * Generate receipt PDF for a payment
 */
export function generateReceiptPDF(
  paymentData: {
    receiptNumber: string;
    date: string;
    unitNumber: string;
    residentName: string;
    amount: string;
    paymentMethod: string;
    description?: string;
  },
  options: PDFExportOptions = {}
): Blob | null {
  const { filename = 'receipt.pdf' } = options;

  try {
    // Placeholder for receipt generation
    console.warn('jsPDF not installed. Install with: npm install jspdf');
    return null;

    // Actual implementation:
    // const doc = new jsPDF();
    // doc.setFontSize(20);
    // doc.text('رسید پرداخت', 20, 20);
    // doc.setFontSize(12);
    // doc.text(`شماره رسید: ${paymentData.receiptNumber}`, 20, 40);
    // doc.text(`تاریخ: ${paymentData.date}`, 20, 50);
    // doc.text(`واحد: ${paymentData.unitNumber}`, 20, 60);
    // doc.text(`نام: ${paymentData.residentName}`, 20, 70);
    // doc.text(`مبلغ: ${paymentData.amount}`, 20, 80);
    // doc.text(`روش پرداخت: ${paymentData.paymentMethod}`, 20, 90);
    // if (paymentData.description) {
    //   doc.text(`توضیحات: ${paymentData.description}`, 20, 100);
    // }
    // return new Blob([doc.output('arraybuffer')], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error generating receipt:', error);
    return null;
  }
}

/**
 * Download PDF blob as file
 */
export function downloadPDF(blob: Blob | null, filename: string): void {
  if (!blob) {
    console.error('No blob provided for download');
    return;
  }

  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
}

/**
 * Generate income report PDF
 */
export function generateIncomeReportPDF(
  reportData: {
    title: string;
    startDate: string;
    endDate: string;
    totalIncome: string;
    paymentCount: number;
    collectionRate: number;
    methods: {
      online: string;
      cardToCard: string;
      cash: string;
      check: string;
    };
  },
  options: PDFExportOptions = {}
): Blob | null {
  return generatePDF([], [], { ...options, title: reportData.title });
}

/**
 * Generate expense report PDF
 */
export function generateExpenseReportPDF(
  reportData: {
    title: string;
    startDate: string;
    endDate: string;
    totalExpenses: string;
    expenseCount: number;
    categories: {
      [key: string]: string;
    };
  },
  options: PDFExportOptions = {}
): Blob | null {
  return generatePDF([], [], { ...options, title: reportData.title });
}

/**
 * Generate debt report PDF
 */
export function generateDebtReportPDF(
  reportData: {
    title: string;
    totalDebt: string;
    debtorCount: number;
    averageDebt: string;
    debtors: Array<{
      name: string;
      unitNumber: string;
      amount: string;
      daysOverdue: number;
    }>;
  },
  options: PDFExportOptions = {}
): Blob | null {
  const columns = ['نام', 'واحد', 'مبلغ بدهی', 'روز تاخیر'];
  const rows: TableRow[] = reportData.debtors.map(debtor => ({
    نام: debtor.name,
    واحد: debtor.unitNumber,
    'مبلغ بدهی': debtor.amount,
    'روز تاخیر': debtor.daysOverdue,
  }));

  return generatePDF(columns, rows, { ...options, title: reportData.title });
}

/**
 * Print current document
 */
export function printReport(): void {
  try {
    window.print();
  } catch (error) {
    console.error('Error printing:', error);
  }
}

/**
 * Share report via native share API (if available)
 */
export async function shareReport(
  title: string,
  blob: Blob | null,
  filename: string
): Promise<void> {
  if (!navigator.share || !blob) {
    console.warn('Share API not available or no blob provided');
    return;
  }

  try {
    const file = new File([blob], filename, { type: 'application/pdf' });
    await navigator.share({
      title,
      files: [file],
    });
  } catch (error) {
    console.error('Error sharing:', error);
  }
}
