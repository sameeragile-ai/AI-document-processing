import { DocumentType, ExtractedField, Submission, TransactionRecord, UploadedDoc } from '../types';

export interface ProcessingStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  durationMs?: number;
}

export const PROCESSING_STAGES: Omit<ProcessingStage, 'status'>[] = [
  {
    id: 'stage-1',
    name: 'Secure Upload & Cryptographic Checksum',
    description: 'Validating file MIME signatures, verifying SHA-256 hashes, and allocating encrypted staging buffer.',
  },
  {
    id: 'stage-2',
    name: 'Document Validation & Sanitization',
    description: 'Checking PDF raster integrity, DPI resolution, and page boundary orientation.',
  },
  {
    id: 'stage-3',
    name: 'Optical Character Recognition (OCR)',
    description: 'Running Google Document AI high-fidelity OCR engine with tabular layout reconstruction.',
  },
  {
    id: 'stage-4',
    name: 'AI Financial Structuring & Entity Extraction',
    description: 'Parsing unstructured bank lines, tax identifiers, dates, and amounts into typed JSON schemas.',
  },
  {
    id: 'stage-5',
    name: 'Mathematical Reconcile & Deterministic Rules',
    description: 'Cross-verifying Opening Balance + Total Inflow - Total Outflow = Closing Balance.',
  },
  {
    id: 'stage-6',
    name: 'CSV Synthesis & Secure Drive Staging',
    description: 'Generating consulting schema columns and preparing Google Drive sync payload.',
  },
];

export function generateSyntheticSubmissionData(
  title: string,
  clientName: string,
  clientReference: string,
  docTypes: DocumentType[],
  files: UploadedDoc[]
): Submission {
  const submissionId = `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const now = new Date().toISOString();

  const isBank = docTypes.includes('bank_statement');
  const isId = docTypes.includes('identity_document');
  const isPayslip = docTypes.includes('payslip');
  const isCash = docTypes.includes('cash_statement');

  const extractedFields: ExtractedField[] = [];
  const transactions: TransactionRecord[] = [];

  let openingBalance = 24500.00;
  let closingBalance = 38920.00;
  let totalDebits = 14580.00;
  let totalCredits = 29000.00;

  if (isBank) {
    extractedFields.push(
      {
        id: `f-${Math.random()}`,
        key: 'account_holder',
        label: 'Account Holder Name',
        value: clientName,
        originalValue: clientName.toUpperCase(),
        confidence: 'high',
        confidenceScore: 0.99,
        category: 'account',
        isValid: true,
      },
      {
        id: `f-${Math.random()}`,
        key: 'account_number',
        label: 'Account Number',
        value: '83921048',
        originalValue: '83921048',
        confidence: 'high',
        confidenceScore: 0.98,
        category: 'account',
        isValid: true,
      },
      {
        id: `f-${Math.random()}`,
        key: 'sort_code',
        label: 'Sort Code / Branch Code',
        value: '40-12-88',
        originalValue: '40-12-88',
        confidence: 'high',
        confidenceScore: 0.97,
        category: 'account',
        isValid: true,
      },
      {
        id: `f-${Math.random()}`,
        key: 'statement_period_start',
        label: 'Statement Period Start',
        value: '2026-09-01',
        originalValue: '01/09/2026',
        confidence: 'high',
        confidenceScore: 0.96,
        category: 'period',
        isValid: true,
      },
      {
        id: `f-${Math.random()}`,
        key: 'statement_period_end',
        label: 'Statement Period End',
        value: '2026-09-30',
        originalValue: '30/09/2026',
        confidence: 'high',
        confidenceScore: 0.96,
        category: 'period',
        isValid: true,
      },
      {
        id: `f-${Math.random()}`,
        key: 'opening_balance',
        label: 'Opening Balance',
        value: '24500.00',
        originalValue: '£24,500.00',
        confidence: 'high',
        confidenceScore: 0.99,
        category: 'balance',
        isValid: true,
      },
      {
        id: `f-${Math.random()}`,
        key: 'closing_balance',
        label: 'Closing Balance',
        value: '38920.00',
        originalValue: '£38,920.00',
        confidence: 'high',
        confidenceScore: 0.99,
        category: 'balance',
        isValid: true,
      }
    );

    transactions.push(
      { id: `tx-${Math.random()}`, date: '2026-09-03', description: 'INWARD FASTER PAYMENT - RETAINER ADVISORY', reference: 'FP-8812', debit: null, credit: 15000.00, balance: 39500.00, confidence: 'high', confidenceScore: 0.99 },
      { id: `tx-${Math.random()}`, date: '2026-09-08', description: 'COMMERCIAL PREMISES LEASE DIRECT DEBIT', reference: 'DD-4410', debit: 6200.00, credit: null, balance: 33300.00, confidence: 'high', confidenceScore: 0.98 },
      { id: `tx-${Math.random()}`, date: '2026-09-14', description: 'INWARD CLIENT INVOICE SETTLEMENT #1084', reference: 'INV-1084', debit: null, credit: 14000.00, balance: 47300.00, confidence: 'high', confidenceScore: 0.99 },
      { id: `tx-${Math.random()}`, date: '2026-09-22', description: 'STAFF PAYROLL BATCH TRANSMISSION BACS', reference: 'PAY-0926', debit: 7800.00, credit: null, balance: 39500.00, confidence: 'high', confidenceScore: 0.98 },
      { id: `tx-${Math.random()}`, date: '2026-09-29', description: 'ACCOUNT AUDIT FEE & TELECOM CHARGES', reference: 'CHG-991', debit: 580.00, credit: null, balance: 38920.00, confidence: 'review_recommended', confidenceScore: 0.88, validationError: 'Verify debit allocation category' }
    );
  }

  if (isId) {
    extractedFields.push(
      {
        id: `f-${Math.random()}`,
        key: 'passport_holder',
        label: 'Passport Holder Full Name',
        value: 'Marcus Alexander Vance',
        originalValue: 'VANCE, MARCUS ALEXANDER',
        confidence: 'high',
        confidenceScore: 0.99,
        category: 'identity',
        isValid: true,
      },
      {
        id: `f-${Math.random()}`,
        key: 'passport_number',
        label: 'Passport Number',
        value: '592810482',
        originalValue: '592810482<4GBR',
        confidence: 'review_recommended',
        confidenceScore: 0.89,
        category: 'identity',
        isValid: true,
        validationMessage: 'Confirm against original passport machine readable line',
      },
      {
        id: `f-${Math.random()}`,
        key: 'date_of_birth',
        label: 'Date of Birth',
        value: '1984-06-22',
        originalValue: '22 JUN 1984',
        confidence: 'high',
        confidenceScore: 0.99,
        category: 'identity',
        isValid: true,
      }
    );
  }

  if (isPayslip) {
    extractedFields.push(
      {
        id: `f-${Math.random()}`,
        key: 'employer_name',
        label: 'Employer Legal Name',
        value: `${clientName} UK Ltd`,
        originalValue: `${clientName} UK Ltd`,
        confidence: 'high',
        confidenceScore: 0.99,
        category: 'employer',
        isValid: true,
      },
      {
        id: `f-${Math.random()}`,
        key: 'gross_salary',
        label: 'Gross Salary',
        value: '9500.00',
        originalValue: '£9,500.00',
        confidence: 'high',
        confidenceScore: 0.98,
        category: 'balance',
        isValid: true,
      },
      {
        id: `f-${Math.random()}`,
        key: 'net_pay',
        label: 'Net Pay to Account',
        value: '6140.20',
        originalValue: '£6,140.20',
        confidence: 'high',
        confidenceScore: 0.99,
        category: 'balance',
        isValid: true,
      }
    );
  }

  if (isCash) {
    extractedFields.push(
      {
        id: `f-${Math.random()}`,
        key: 'petty_cash_custodian',
        label: 'Cash Register Custodian',
        value: 'Elena Rostova',
        originalValue: 'Rostova, Elena',
        confidence: 'high',
        confidenceScore: 0.98,
        category: 'identity',
        isValid: true,
      },
      {
        id: `f-${Math.random()}`,
        key: 'cash_float_closing',
        label: 'Cash Balance on Hand',
        value: '1850.00',
        originalValue: '£1,850.00',
        confidence: 'high',
        confidenceScore: 0.98,
        category: 'balance',
        isValid: true,
      }
    );
  }

  const reviewFields = extractedFields.filter((f) => f.confidence !== 'high').length +
    transactions.filter((t) => t.confidence !== 'high').length;

  return {
    id: submissionId,
    title,
    clientName,
    clientReference: clientReference || `REF-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: now,
    updatedAt: now,
    documentTypes: docTypes,
    status: reviewFields > 0 ? 'needs_review' : 'completed',
    documents: files.map((f) => ({ ...f, status: 'processed' })),
    reviewFieldsCount: reviewFields,
    totalFieldsCount: extractedFields.length + transactions.length,
    csvExported: false,
    googleDriveSynced: true,
    googleDrivePath: `Google Drive / Consulting_Clients / ${clientName.replace(/\s+/g, '_')} / Submissions_2026 / ${submissionId}`,
    extractedFields,
    transactions,
    summary: {
      accountHolder: clientName,
      accountNumber: '**** **** 1048',
      sortCodeOrRouting: '40-12-88',
      financialInstitution: 'Barclays / NatWest Clearing',
      currency: 'GBP (£)',
      periodStart: '2026-09-01',
      periodEnd: '2026-09-30',
      openingBalance,
      closingBalance,
      totalDebits,
      totalCredits,
      calculatedClosingBalance: openingBalance + totalCredits - totalDebits,
      isReconciled: true,
    },
    auditLogs: [
      {
        id: `log-${Date.now()}-1`,
        timestamp: now,
        action: 'Ingestion Checksum Created',
        actor: 'Client Upload Portal',
        details: `${files.length} document(s) uploaded. SHA-256 fingerprint saved.`,
      },
      {
        id: `log-${Date.now()}-2`,
        timestamp: new Date(Date.now() + 15000).toISOString(),
        action: 'OCR & AI Extraction Complete',
        actor: 'Document AI + LLM Schema Validator',
        details: `Successfully structured ${extractedFields.length + transactions.length} entities. Reconciled balances.`,
      },
      {
        id: `log-${Date.now()}-3`,
        timestamp: new Date(Date.now() + 18000).toISOString(),
        action: 'Google Drive Document Vault Encrypted',
        actor: 'Google Cloud Service Account',
        details: 'Stored in tenant isolated Google Drive storage directory.',
      },
    ],
  };
}
