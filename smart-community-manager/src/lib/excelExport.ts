// Excel Export Utilities
// Note: XLSX library needs to be installed: npm install xlsx
// This is a placeholder implementation

export interface ExcelExportOptions {
  filename?: string;
  sheetName?: string;
}

export interface ExcelSheet {
  name: string;
  data: Array<{ [key: string]: string | number }>;
}

/**
 * Export array of objects to Excel
 * Requires xlsx library to be installed
 */
export function exportToExcel(
  data: Array<{ [key: string]: string | number }>,
  options: ExcelExportOptions = {}
): void {
  const { filename = 'export.xlsx', sheetName = 'Sheet1' } = options;

  try {
    // This would use XLSX once installed:
    // import * as XLSX from 'xlsx';

    if (data.length === 0) {
      console.warn('No data to export');
      return;
    }

    console.warn('XLSX library not installed. Install with: npm install xlsx');

    // Actual implementation would be:
    // const worksheet = XLSX.utils.json_to_sheet(data);
    // const workbook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    // XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
}

/**
 * Export multiple sheets to Excel workbook
 */
export function exportMultipleSheets(
  sheets: ExcelSheet[],
  filename: string = 'export.xlsx'
): void {
  try {
    // This would use XLSX:
    // import * as XLSX from 'xlsx';

    if (sheets.length === 0) {
      console.warn('No sheets to export');
      return;
    }

    console.warn('XLSX library not installed. Install with: npm install xlsx');

    // Actual implementation:
    // const workbook = XLSX.utils.book_new();
    // sheets.forEach(sheet => {
    //   const worksheet = XLSX.utils.json_to_sheet(sheet.data);
    //   XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
    // });
    // XLSX.writeFile(workbook, filename);
  } catch (error) {
    console.error('Error exporting multiple sheets:', error);
  }
}

/**
 * Export table data to CSV format
 * CSV can be opened in Excel and doesn't require additional libraries
 */
export function exportToCSV(
  data: Array<{ [key: string]: string | number }>,
  filename: string = 'export.csv'
): void {
  try {
    if (data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row =>
        headers
          .map(header => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          })
          .join(',')
      ),
    ].join('\n');

    // Create blob and download
    downloadCSV(csvContent, filename);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
}

/**
 * Download CSV file
 */
export function downloadCSV(content: string, filename: string): void {
  try {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error downloading CSV:', error);
  }
}

/**
 * Export income report data
 */
export function exportIncomeReport(
  data: Array<{
    date: string;
    unitNumber: string;
    amount: string;
    method: string;
    status: string;
  }>
): void {
  exportToCSV(data, 'income-report.csv');
}

/**
 * Export expense report data
 */
export function exportExpenseReport(
  data: Array<{
    date: string;
    title: string;
    category: string;
    amount: string;
    vendor: string;
  }>
): void {
  exportToCSV(data, 'expense-report.csv');
}

/**
 * Export debt report data
 */
export function exportDebtReport(
  data: Array<{
    name: string;
    unitNumber: string;
    amount: string;
    daysOverdue: number;
    lastPaymentDate: string;
  }>
): void {
  exportToCSV(data, 'debt-report.csv');
}

/**
 * Export unit payment data
 */
export function exportUnitReport(
  data: Array<{
    unitNumber: string;
    residentName: string;
    totalPayment: string;
    paymentCount: number;
    status: string;
  }>
): void {
  exportToCSV(data, 'unit-report.csv');
}

/**
 * Export fund transactions
 */
export function exportFundTransactions(
  data: Array<{
    date: string;
    type: string;
    amount: string;
    description: string;
    recordedBy: string;
  }>
): void {
  exportToCSV(data, 'fund-transactions.csv');
}

/**
 * Create a formatted Excel-style CSV with proper Persian support
 */
export function createPersianCSV(
  headers: string[],
  rows: (string | number)[][]
): string {
  const headerLine = headers.map(h => `"${h}"`).join(',');
  const dataLines = rows.map(row =>
    row
      .map(cell => {
        const stringCell = String(cell);
        // Wrap in quotes to preserve formatting
        return `"${stringCell.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  return [headerLine, ...dataLines].join('\n');
}
