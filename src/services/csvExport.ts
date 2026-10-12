import { MappingConfig, Submission, TransactionRecord } from '../types';

export interface CsvValidationIssue {
  row: number;
  column: string;
  type: 'error' | 'warning';
  message: string;
}

export function validateCsvRows(
  submission: Submission,
  mappingConfig: MappingConfig
): { isValid: boolean; issues: CsvValidationIssue[] } {
  const issues: CsvValidationIssue[] = [];

  submission.transactions.forEach((tx, idx) => {
    const rowNum = idx + 1;

    // Check required fields based on mapping
    mappingConfig.mappings.forEach((mapping) => {
      if (mapping.isRequired) {
        let val: any = '';
        if (mapping.sourceKey === 'date') val = tx.date;
        else if (mapping.sourceKey === 'description') val = tx.description;
        else if (mapping.sourceKey === 'balance') val = tx.balance;

        if (val === undefined || val === null || val === '') {
          issues.push({
            row: rowNum,
            column: mapping.targetColumnName,
            type: 'error',
            message: `Required column "${mapping.targetColumnName}" is empty in row ${rowNum}.`,
          });
        }
      }

      // Check date format
      if (mapping.sourceKey === 'date' && tx.date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(tx.date)) {
          issues.push({
            row: rowNum,
            column: mapping.targetColumnName,
            type: 'warning',
            message: `Date "${tx.date}" in row ${rowNum} may require normalization.`,
          });
        }
      }
    });

    // Check if both debit and credit are null or zero
    if ((tx.debit === null || tx.debit === 0) && (tx.credit === null || tx.credit === 0)) {
      issues.push({
        row: rowNum,
        column: 'Amount',
        type: 'warning',
        message: `Row ${rowNum} has neither debit nor credit amount entered.`,
      });
    }
  });

  const hasErrors = issues.some((i) => i.type === 'error');
  return { isValid: !hasErrors, issues };
}

export function formatDateForCsv(dateStr: string, format: MappingConfig['dateFormat']): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;

  const [year, month, day] = parts;
  if (format === 'DD/MM/YYYY') {
    return `${day}/${month}/${year}`;
  }
  if (format === 'MM/DD/YYYY') {
    return `${month}/${day}/${year}`;
  }
  return `${year}-${month}-${day}`;
}

export function escapeCsvField(val: string | number | null | undefined, delimiter: string): string {
  if (val === null || val === undefined) return '';
  const stringVal = String(val);

  // If contains delimiter, quotes, or newlines, surround with quotes and escape internal quotes
  if (
    stringVal.includes(delimiter) ||
    stringVal.includes('"') ||
    stringVal.includes('\n') ||
    stringVal.includes('\r')
  ) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return stringVal;
}

export function generateCsvContent(
  submission: Submission,
  mappingConfig: MappingConfig
): string {
  const { mappings, delimiter, includeHeaderRow, dateFormat, decimalSeparator } = mappingConfig;
  const rows: string[] = [];

  // Header Row
  if (includeHeaderRow) {
    const headers = mappings.map((m) => escapeCsvField(m.targetColumnName, delimiter));
    rows.push(headers.join(delimiter));
  }

  // Transaction Rows
  submission.transactions.forEach((tx) => {
    const rowValues = mappings.map((m) => {
      let rawVal: any = '';

      switch (m.sourceKey) {
        case 'date':
          rawVal = formatDateForCsv(tx.date, dateFormat);
          break;
        case 'description':
          rawVal = tx.description;
          break;
        case 'reference':
          rawVal = tx.reference || '';
          break;
        case 'debit':
          if (tx.debit !== null && tx.debit !== undefined) {
            const formatted = tx.debit.toFixed(2);
            rawVal = decimalSeparator === ',' ? formatted.replace('.', ',') : formatted;
          } else {
            rawVal = '';
          }
          break;
        case 'credit':
          if (tx.credit !== null && tx.credit !== undefined) {
            const formatted = tx.credit.toFixed(2);
            rawVal = decimalSeparator === ',' ? formatted.replace('.', ',') : formatted;
          } else {
            rawVal = '';
          }
          break;
        case 'balance':
          if (tx.balance !== null && tx.balance !== undefined) {
            const formatted = tx.balance.toFixed(2);
            rawVal = decimalSeparator === ',' ? formatted.replace('.', ',') : formatted;
          } else {
            rawVal = '';
          }
          break;
        default:
          rawVal = '';
      }

      return escapeCsvField(rawVal, delimiter);
    });

    rows.push(rowValues.join(delimiter));
  });

  // Prepend UTF-8 BOM to ensure Excel opens special characters correctly
  return '\uFEFF' + rows.join('\r\n');
}

export function downloadCsvFile(
  content: string,
  filename: string
): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
