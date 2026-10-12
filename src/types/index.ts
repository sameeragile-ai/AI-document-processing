export type DocumentType = 
  | 'bank_statement' 
  | 'identity_document' 
  | 'payslip' 
  | 'cash_statement';

export type SubmissionStatus = 
  | 'draft' 
  | 'uploaded' 
  | 'processing' 
  | 'needs_review' 
  | 'completed' 
  | 'failed';

export type FieldConfidence = 
  | 'high' 
  | 'review_recommended' 
  | 'needs_verification';

export interface ExtractedField {
  id: string;
  key: string;
  label: string;
  value: string;
  originalValue: string;
  confidence: FieldConfidence;
  confidenceScore: number; // 0.0 - 1.0
  category: 'account' | 'period' | 'transaction' | 'balance' | 'identity' | 'employer';
  isValid: boolean;
  validationMessage?: string;
  sourceBoundingBox?: {
    page: number;
    top: number;
    left: number;
    width: number;
    height: number;
  };
  isEdited?: boolean;
}

export interface TransactionRecord {
  id: string;
  date: string;
  description: string;
  reference?: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  confidence: FieldConfidence;
  confidenceScore: number;
  isEdited?: boolean;
  validationError?: string;
}

export interface UploadedDoc {
  id: string;
  name: string;
  size: number;
  type: string;
  docType: DocumentType;
  uploadedAt: string;
  status: 'pending' | 'processing' | 'processed' | 'error';
  sha256Hash: string;
  pageCount: number;
  previewUrl?: string;
}

export interface FinancialSummary {
  openingBalance: number;
  closingBalance: number;
  totalDebits: number;
  totalCredits: number;
  calculatedClosingBalance: number;
  isReconciled: boolean;
  currency: string;
  periodStart: string;
  periodEnd: string;
  accountHolder: string;
  accountNumber: string;
  sortCodeOrRouting: string;
  financialInstitution: string;
}

export interface Submission {
  id: string; // e.g., SUB-2026-8941
  title: string;
  clientName: string;
  clientReference: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  documentTypes: DocumentType[];
  status: SubmissionStatus;
  documents: UploadedDoc[];
  reviewFieldsCount: number;
  totalFieldsCount: number;
  csvExported: boolean;
  googleDriveSynced: boolean;
  googleDrivePath: string;
  extractedFields: ExtractedField[];
  transactions: TransactionRecord[];
  summary: FinancialSummary;
  auditLogs: AuditLogEvent[];
}

export interface AuditLogEvent {
  id: string;
  timestamp: string;
  action: string;
  actor: string;
  details: string;
  securityHash?: string;
}

export interface ColumnMappingItem {
  id: string;
  sourceKey: string;
  sourceLabel: string;
  targetColumnName: string;
  isRequired: boolean;
  dataType: 'string' | 'date' | 'number' | 'currency';
  sampleValue: string;
}

export interface MappingConfig {
  id: string;
  name: string;
  targetSystem: 'Generic CSV' | 'Sage 50/Cloud' | 'Xero Accounting' | 'QuickBooks Online' | 'Custom Consulting Ledger';
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  decimalSeparator: '.' | ',';
  delimiter: ',' | ';' | '\t';
  includeHeaderRow: boolean;
  mappings: ColumnMappingItem[];
}

export interface BenchmarkItem {
  id: string;
  documentName: string;
  documentType: DocumentType;
  issuerOrSubject: string;
  totalFields: number;
  correctFields: number;
  flaggedForReview: number;
  accuracyRate: number; // percentage
  status: 'passed' | 'review_required';
  verifiedDate: string;
}

export interface UserSession {
  email: string;
  fullName: string;
  role: string;
  organization: string;
  isAuthenticated: boolean;
  isDemoUser: boolean;
}
