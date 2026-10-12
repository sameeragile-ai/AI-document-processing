import { Submission, BenchmarkItem, MappingConfig, UserSession } from '../types';

const STORAGE_KEYS = {
  SUBMISSIONS: 'ledgerflow_submissions_v1',
  MAPPINGS: 'ledgerflow_mappings_v1',
  SESSION: 'ledgerflow_session_v1',
  RETENTION_DAYS: 'ledgerflow_retention_days',
};

export const INITIAL_USER: UserSession = {
  email: 'sameer.agile@gmail.com',
  fullName: 'Sarah Jenkins',
  role: 'Senior Financial Consultant',
  organization: 'Apex Advisory Partners',
  isAuthenticated: true,
  isDemoUser: true,
};

export const DEFAULT_MAPPING_CONFIG: MappingConfig = {
  id: 'map_sage_consulting',
  name: 'Standard Consulting Schema (Sage/Xero Compatible)',
  targetSystem: 'Custom Consulting Ledger',
  dateFormat: 'YYYY-MM-DD',
  decimalSeparator: '.',
  delimiter: ',',
  includeHeaderRow: true,
  mappings: [
    { id: 'm1', sourceKey: 'date', sourceLabel: 'Transaction Date', targetColumnName: 'Post_Date', isRequired: true, dataType: 'date', sampleValue: '2026-03-15' },
    { id: 'm2', sourceKey: 'description', sourceLabel: 'Narrative / Description', targetColumnName: 'Description_Memo', isRequired: true, dataType: 'string', sampleValue: 'AWS Cloud Hosting EMEA' },
    { id: 'm3', sourceKey: 'reference', sourceLabel: 'Reference / Cheque No.', targetColumnName: 'Ref_Code', isRequired: false, dataType: 'string', sampleValue: 'INV-98234' },
    { id: 'm4', sourceKey: 'debit', sourceLabel: 'Outflow (Debit)', targetColumnName: 'Amount_Debit', isRequired: false, dataType: 'currency', sampleValue: '1420.50' },
    { id: 'm5', sourceKey: 'credit', sourceLabel: 'Inflow (Credit)', targetColumnName: 'Amount_Credit', isRequired: false, dataType: 'currency', sampleValue: '0.00' },
    { id: 'm6', sourceKey: 'balance', sourceLabel: 'Running Balance', targetColumnName: 'Ledger_Balance', isRequired: true, dataType: 'currency', sampleValue: '48950.25' },
  ]
};

export const INITIAL_BENCHMARK_ITEMS: BenchmarkItem[] = [
  { id: 'bench-01', documentName: 'Barclays_Business_Checking_Oct2026.pdf', documentType: 'bank_statement', issuerOrSubject: 'Barclays Commercial UK', totalFields: 48, correctFields: 47, flaggedForReview: 1, accuracyRate: 97.9, status: 'passed', verifiedDate: '2026-10-10' },
  { id: 'bench-02', documentName: 'HSBC_Current_Statement_Sep2026.pdf', documentType: 'bank_statement', issuerOrSubject: 'HSBC Bank plc', totalFields: 54, correctFields: 53, flaggedForReview: 1, accuracyRate: 98.1, status: 'passed', verifiedDate: '2026-10-09' },
  { id: 'bench-03', documentName: 'Chase_Commercial_Treasury_Aug2026.pdf', documentType: 'bank_statement', issuerOrSubject: 'JPMorgan Chase', totalFields: 62, correctFields: 60, flaggedForReview: 2, accuracyRate: 96.8, status: 'passed', verifiedDate: '2026-10-08' },
  { id: 'bench-04', documentName: 'NatWest_Foundation_Oct2026.pdf', documentType: 'bank_statement', issuerOrSubject: 'NatWest Group', totalFields: 42, correctFields: 41, flaggedForReview: 1, accuracyRate: 97.6, status: 'passed', verifiedDate: '2026-10-08' },
  { id: 'bench-05', documentName: 'Lloyds_Corporate_Operating_Sep2026.pdf', documentType: 'bank_statement', issuerOrSubject: 'Lloyds Bank', totalFields: 56, correctFields: 55, flaggedForReview: 1, accuracyRate: 98.2, status: 'passed', verifiedDate: '2026-10-07' },
  { id: 'bench-06', documentName: 'Santander_Business_Growth_Jul2026.pdf', documentType: 'bank_statement', issuerOrSubject: 'Santander UK', totalFields: 39, correctFields: 38, flaggedForReview: 1, accuracyRate: 97.4, status: 'passed', verifiedDate: '2026-10-06' },
  { id: 'bench-07', documentName: 'Passport_UK_Citizen_Jenkins_S.pdf', documentType: 'identity_document', issuerOrSubject: 'HM Passport Office', totalFields: 22, correctFields: 22, flaggedForReview: 0, accuracyRate: 100.0, status: 'passed', verifiedDate: '2026-10-05' },
  { id: 'bench-08', documentName: 'Driving_Licence_DVLA_Vance_M.pdf', documentType: 'identity_document', issuerOrSubject: 'DVLA Swansea', totalFields: 18, correctFields: 18, flaggedForReview: 0, accuracyRate: 100.0, status: 'passed', verifiedDate: '2026-10-05' },
  { id: 'bench-09', documentName: 'EU_National_ID_Card_Kovacs_E.pdf', documentType: 'identity_document', issuerOrSubject: 'EU Ministry of Interior', totalFields: 20, correctFields: 19, flaggedForReview: 1, accuracyRate: 95.0, status: 'passed', verifiedDate: '2026-10-04' },
  { id: 'bench-10', documentName: 'Passport_Ireland_Byrne_P.pdf', documentType: 'identity_document', issuerOrSubject: 'Department of Foreign Affairs', totalFields: 22, correctFields: 22, flaggedForReview: 0, accuracyRate: 100.0, status: 'passed', verifiedDate: '2026-10-04' },
  { id: 'bench-11', documentName: 'Payslip_TechCorp_Sep2026_Executive.pdf', documentType: 'payslip', issuerOrSubject: 'TechCorp UK Ltd', totalFields: 32, correctFields: 31, flaggedForReview: 1, accuracyRate: 96.9, status: 'passed', verifiedDate: '2026-10-03' },
  { id: 'bench-12', documentName: 'Payslip_Novartis_Biotech_Aug2026.pdf', documentType: 'payslip', issuerOrSubject: 'Novartis Laboratories', totalFields: 34, correctFields: 33, flaggedForReview: 1, accuracyRate: 97.1, status: 'passed', verifiedDate: '2026-10-03' },
  { id: 'bench-13', documentName: 'Payslip_Deloitte_Consulting_Jul2026.pdf', documentType: 'payslip', issuerOrSubject: 'Deloitte Services', totalFields: 30, correctFields: 29, flaggedForReview: 1, accuracyRate: 96.7, status: 'passed', verifiedDate: '2026-10-02' },
  { id: 'bench-14', documentName: 'Payslip_NHS_Trust_Staff_Jun2026.pdf', documentType: 'payslip', issuerOrSubject: 'Imperial College Healthcare', totalFields: 28, correctFields: 27, flaggedForReview: 1, accuracyRate: 96.4, status: 'passed', verifiedDate: '2026-10-01' },
  { id: 'bench-15', documentName: 'Payslip_Acme_Holdings_May2026.pdf', documentType: 'payslip', issuerOrSubject: 'Acme Holdings Ltd', totalFields: 29, correctFields: 28, flaggedForReview: 1, accuracyRate: 96.5, status: 'passed', verifiedDate: '2026-09-30' },
  { id: 'bench-16', documentName: 'Petty_Cash_Register_London_Office_Q3.pdf', documentType: 'cash_statement', issuerOrSubject: 'Apex Advisory Facilities', totalFields: 36, correctFields: 34, flaggedForReview: 2, accuracyRate: 94.4, status: 'passed', verifiedDate: '2026-09-29' },
  { id: 'bench-17', documentName: 'Disbursement_Journal_Manchester_Branch.pdf', documentType: 'cash_statement', issuerOrSubject: 'Apex Manchester', totalFields: 38, correctFields: 36, flaggedForReview: 2, accuracyRate: 94.7, status: 'passed', verifiedDate: '2026-09-28' },
  { id: 'bench-18', documentName: 'Cash_Voucher_Summary_Bristol_Project.pdf', documentType: 'cash_statement', issuerOrSubject: 'Bristol Advisory Hub', totalFields: 30, correctFields: 29, flaggedForReview: 1, accuracyRate: 96.7, status: 'passed', verifiedDate: '2026-09-27' },
  { id: 'bench-19', documentName: 'Petty_Cash_Log_Edinburgh_Site.pdf', documentType: 'cash_statement', issuerOrSubject: 'Edinburgh Operations', totalFields: 32, correctFields: 31, flaggedForReview: 1, accuracyRate: 96.9, status: 'passed', verifiedDate: '2026-09-26' },
  { id: 'bench-20', documentName: 'Retail_Cash_Reconciliation_Sept2026.pdf', documentType: 'cash_statement', issuerOrSubject: 'Kensington Retail Partners', totalFields: 44, correctFields: 42, flaggedForReview: 2, accuracyRate: 95.5, status: 'passed', verifiedDate: '2026-09-25' },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'SUB-2026-8941',
    title: 'Q3 Financial Review & KYC Bundle',
    clientName: 'Meridian Global Assets Ltd',
    clientReference: 'CLI-84729',
    createdAt: '2026-10-11T14:22:00Z',
    updatedAt: '2026-10-12T09:15:00Z',
    documentTypes: ['bank_statement', 'identity_document'],
    status: 'needs_review',
    reviewFieldsCount: 2,
    totalFieldsCount: 42,
    csvExported: false,
    googleDriveSynced: true,
    googleDrivePath: 'Google Drive / Consulting_Clients / Meridian_Global / Submissions_2026 / SUB-2026-8941',
    documents: [
      {
        id: 'doc-01',
        name: 'Barclays_Commercial_Operating_Oct2026.pdf',
        size: 2458920,
        type: 'application/pdf',
        docType: 'bank_statement',
        uploadedAt: '2026-10-11T14:22:10Z',
        status: 'processed',
        sha256Hash: '9e8b7c3d2a1f4e5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
        pageCount: 3,
      },
      {
        id: 'doc-02',
        name: 'Managing_Director_Passport_Verified.pdf',
        size: 1104850,
        type: 'application/pdf',
        docType: 'identity_document',
        uploadedAt: '2026-10-11T14:22:30Z',
        status: 'processed',
        sha256Hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
        pageCount: 1,
      }
    ],
    summary: {
      accountHolder: 'Meridian Global Assets Ltd',
      accountNumber: '**** **** 4892',
      sortCodeOrRouting: '20-00-00',
      financialInstitution: 'Barclays Commercial Bank UK',
      currency: 'GBP (£)',
      periodStart: '2026-09-01',
      periodEnd: '2026-09-30',
      openingBalance: 42500.00,
      closingBalance: 59720.50,
      totalCredits: 38450.00,
      totalDebits: 21229.50,
      calculatedClosingBalance: 59720.50,
      isReconciled: true,
    },
    extractedFields: [
      {
        id: 'fld-1',
        key: 'account_holder',
        label: 'Account Holder Name',
        value: 'Meridian Global Assets Ltd',
        originalValue: 'Meridian Global Assets Ltd',
        confidence: 'high',
        confidenceScore: 0.99,
        category: 'account',
        isValid: true,
      },
      {
        id: 'fld-2',
        key: 'account_number',
        label: 'Account Number',
        value: '78294892',
        originalValue: '78294892',
        confidence: 'high',
        confidenceScore: 0.98,
        category: 'account',
        isValid: true,
      },
      {
        id: 'fld-3',
        key: 'sort_code',
        label: 'Sort Code / Branch Code',
        value: '20-00-00',
        originalValue: '20-00-00',
        confidence: 'high',
        confidenceScore: 0.97,
        category: 'account',
        isValid: true,
      },
      {
        id: 'fld-4',
        key: 'statement_period_start',
        label: 'Statement Period Start',
        value: '2026-09-01',
        originalValue: '01 Sep 2026',
        confidence: 'high',
        confidenceScore: 0.96,
        category: 'period',
        isValid: true,
      },
      {
        id: 'fld-5',
        key: 'statement_period_end',
        label: 'Statement Period End',
        value: '2026-09-30',
        originalValue: '30 Sep 2026',
        confidence: 'high',
        confidenceScore: 0.96,
        category: 'period',
        isValid: true,
      },
      {
        id: 'fld-6',
        key: 'opening_balance',
        label: 'Opening Balance',
        value: '42500.00',
        originalValue: '£42,500.00',
        confidence: 'high',
        confidenceScore: 0.99,
        category: 'balance',
        isValid: true,
      },
      {
        id: 'fld-7',
        key: 'closing_balance',
        label: 'Closing Balance',
        value: '59720.50',
        originalValue: '£59,720.50',
        confidence: 'high',
        confidenceScore: 0.99,
        category: 'balance',
        isValid: true,
      },
      {
        id: 'fld-8',
        key: 'director_full_name',
        label: 'Director Full Name (ID)',
        value: 'Charles Edward Montgomery',
        originalValue: 'MONTGOMERY, CHARLES EDWARD',
        confidence: 'high',
        confidenceScore: 0.98,
        category: 'identity',
        isValid: true,
      },
      {
        id: 'fld-9',
        key: 'passport_number',
        label: 'Passport Document Number',
        value: '948201847',
        originalValue: '948201847<5GBR',
        confidence: 'review_recommended',
        confidenceScore: 0.88,
        category: 'identity',
        isValid: true,
        validationMessage: 'Character 7 OCR clarity 88% — please confirm against visual scan',
      },
      {
        id: 'fld-10',
        key: 'director_dob',
        label: 'Date of Birth',
        value: '1978-04-14',
        originalValue: '14 APR 1978',
        confidence: 'high',
        confidenceScore: 0.98,
        category: 'identity',
        isValid: true,
      },
      {
        id: 'fld-11',
        key: 'tax_residency_code',
        label: 'Tax Reference / UTR',
        value: '84920 19482',
        originalValue: '84920 19482',
        confidence: 'review_recommended',
        confidenceScore: 0.89,
        category: 'identity',
        isValid: true,
        validationMessage: 'Format spacing flagged for validation against HMRC standard',
      }
    ],
    transactions: [
      { id: 'tx-1', date: '2026-09-02', description: 'BACS INWARD CLIENT RETAINER - KINETIC SA', reference: 'BACS-8912', debit: null, credit: 18500.00, balance: 61000.00, confidence: 'high', confidenceScore: 0.99 },
      { id: 'tx-2', date: '2026-09-05', description: 'DIRECT DEBIT - CANARY WHARF LEASE MGMT', reference: 'DD-00384', debit: 8400.00, credit: null, balance: 52600.00, confidence: 'high', confidenceScore: 0.98 },
      { id: 'tx-3', date: '2026-09-11', description: 'CARD PAYMENT - MICROSOFT AZURE CLOUD EMEA', reference: 'POS-7741', debit: 1240.50, credit: null, balance: 51359.50, confidence: 'high', confidenceScore: 0.99 },
      { id: 'tx-4', date: '2026-09-18', description: 'FASTER PAYMENT - ADVISORY SETTLEMENT VANCE', reference: 'FP-9921', debit: null, credit: 19950.00, balance: 71309.50, confidence: 'high', confidenceScore: 0.97 },
      { id: 'tx-5', date: '2026-09-24', description: 'PAYROLL DISBURSEMENT - APEX BATCH 0926', reference: 'SAL-0926', debit: 10589.00, credit: null, balance: 60720.50, confidence: 'high', confidenceScore: 0.99 },
      { id: 'tx-6', date: '2026-09-29', description: 'BANK CHARGES - INTERNATIONAL SWIFT CLEARING', reference: 'CHG-881', debit: 1000.00, credit: null, balance: 59720.50, confidence: 'review_recommended', confidenceScore: 0.87, validationError: 'Check transaction reference code' },
    ],
    auditLogs: [
      { id: 'log-1', timestamp: '2026-10-11T14:22:15Z', action: 'Upload & SHA-256 Hash Generated', actor: 'Sarah Jenkins (Consultant)', details: 'Uploaded 2 files. Checksum verified.' },
      { id: 'log-2', timestamp: '2026-10-11T14:23:05Z', action: 'OCR & AI Entity Extraction Completed', actor: 'Google Document AI + Claude Sonnet', details: 'Extracted 42 structured entities and 6 line items in 14.2s.' },
      { id: 'log-3', timestamp: '2026-10-11T14:23:12Z', action: 'Mathematical Balance Reconciliation', actor: 'LedgerFlow Validation Engine', details: 'Balance check PASSED: Opening (£42,500.00) + Inflow (£38,450.00) - Outflow (£21,229.50) = Closing (£59,720.50).' },
      { id: 'log-4', timestamp: '2026-10-11T14:23:18Z', action: 'Google Drive Document Sync', actor: 'Service Account (least-privilege)', details: 'Uploaded encrypted payload to Google Drive / Meridian_Global.' },
    ]
  },
  {
    id: 'SUB-2026-8938',
    title: 'Executive Payslip Audit & Tax Reconcile',
    clientName: 'Novartis BioVenture Hub',
    clientReference: 'CLI-77291',
    createdAt: '2026-10-10T11:05:00Z',
    updatedAt: '2026-10-10T11:42:00Z',
    completedAt: '2026-10-10T11:42:00Z',
    documentTypes: ['payslip'],
    status: 'completed',
    reviewFieldsCount: 0,
    totalFieldsCount: 34,
    csvExported: true,
    googleDriveSynced: true,
    googleDrivePath: 'Google Drive / Consulting_Clients / Novartis / Submissions_2026 / SUB-2026-8938',
    documents: [
      {
        id: 'doc-03',
        name: 'Payslip_Novartis_Sep2026_Executive.pdf',
        size: 1540200,
        type: 'application/pdf',
        docType: 'payslip',
        uploadedAt: '2026-10-10T11:05:12Z',
        status: 'processed',
        sha256Hash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
        pageCount: 1,
      }
    ],
    summary: {
      accountHolder: 'Dr. Aris Thorne',
      accountNumber: 'NINO: JH 92 84 10 C',
      sortCodeOrRouting: 'PAYE Ref: 914/N9201',
      financialInstitution: 'Novartis Services UK',
      currency: 'GBP (£)',
      periodStart: '2026-09-01',
      periodEnd: '2026-09-30',
      openingBalance: 0,
      closingBalance: 7842.10,
      totalCredits: 12500.00,
      totalDebits: 4657.90,
      calculatedClosingBalance: 7842.10,
      isReconciled: true,
    },
    extractedFields: [
      { id: 'f-1', key: 'employee_name', label: 'Employee Name', value: 'Dr. Aris Thorne', originalValue: 'Thorne, Aris Dr', confidence: 'high', confidenceScore: 0.99, category: 'employer', isValid: true },
      { id: 'f-2', key: 'employer_name', label: 'Employer Legal Name', value: 'Novartis BioVenture UK Ltd', originalValue: 'Novartis BioVenture UK Ltd', confidence: 'high', confidenceScore: 0.99, category: 'employer', isValid: true },
      { id: 'f-3', key: 'gross_pay', label: 'Gross Monthly Salary', value: '12500.00', originalValue: '£12,500.00', confidence: 'high', confidenceScore: 0.99, category: 'balance', isValid: true },
      { id: 'f-4', key: 'income_tax', label: 'PAYE Income Tax', value: '3120.40', originalValue: '£3,120.40', confidence: 'high', confidenceScore: 0.98, category: 'balance', isValid: true },
      { id: 'f-5', key: 'national_insurance', label: 'National Insurance Employee', value: '537.50', originalValue: '£537.50', confidence: 'high', confidenceScore: 0.98, category: 'balance', isValid: true },
      { id: 'f-6', key: 'pension_contribution', label: 'Workplace Pension Deduction', value: '1000.00', originalValue: '£1,000.00', confidence: 'high', confidenceScore: 0.97, category: 'balance', isValid: true },
      { id: 'f-7', key: 'net_pay', label: 'Net Pay to Bank', value: '7842.10', originalValue: '£7,842.10', confidence: 'high', confidenceScore: 0.99, category: 'balance', isValid: true },
    ],
    transactions: [
      { id: 'tx-p1', date: '2026-09-28', description: 'BASIC EARNINGS - EXECUTIVE DIRECTOR', reference: 'EARN-01', debit: null, credit: 12500.00, balance: 12500.00, confidence: 'high', confidenceScore: 0.99 },
      { id: 'tx-p2', date: '2026-09-28', description: 'PAYE TAX DEDUCTION HMRC', reference: 'DED-TAX', debit: 3120.40, credit: null, balance: 9379.60, confidence: 'high', confidenceScore: 0.98 },
      { id: 'tx-p3', date: '2026-09-28', description: 'EMPLOYEE CLASS 1 NI DEDUCTION', reference: 'DED-NI', debit: 537.50, credit: null, balance: 8842.10, confidence: 'high', confidenceScore: 0.98 },
      { id: 'tx-p4', date: '2026-09-28', description: 'NEST WORKPLACE PENSION CONTRIBUTION', reference: 'DED-PEN', debit: 1000.00, credit: null, balance: 7842.10, confidence: 'high', confidenceScore: 0.98 },
    ],
    auditLogs: [
      { id: 'log-p1', timestamp: '2026-10-10T11:05:15Z', action: 'Uploaded Payslip PDF', actor: 'Sarah Jenkins', details: '1 page processed' },
      { id: 'log-p2', timestamp: '2026-10-10T11:06:10Z', action: 'Field Verification Completed', actor: 'LedgerFlow Engine', details: 'All 34 fields passed 98%+ confidence threshold' },
      { id: 'log-p3', timestamp: '2026-10-10T11:42:00Z', action: 'CSV Exported to Consulting ERP', actor: 'Sarah Jenkins', details: 'Generated Sage-compatible CSV format' }
    ]
  },
  {
    id: 'SUB-2026-8932',
    title: 'Petty Cash Ledger & Expense Receipts',
    clientName: 'Apex Advisory London Facilities',
    clientReference: 'CLI-55018',
    createdAt: '2026-10-09T16:10:00Z',
    updatedAt: '2026-10-09T17:00:00Z',
    completedAt: '2026-10-09T17:00:00Z',
    documentTypes: ['cash_statement'],
    status: 'completed',
    reviewFieldsCount: 0,
    totalFieldsCount: 38,
    csvExported: true,
    googleDriveSynced: true,
    googleDrivePath: 'Google Drive / Consulting_Clients / Internal / Submissions_2026 / SUB-2026-8932',
    documents: [
      {
        id: 'doc-04',
        name: 'Petty_Cash_Register_London_Office_Q3.pdf',
        size: 980400,
        type: 'application/pdf',
        docType: 'cash_statement',
        uploadedAt: '2026-10-09T16:10:05Z',
        status: 'processed',
        sha256Hash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
        pageCount: 2,
      }
    ],
    summary: {
      accountHolder: 'Apex Facilities Petty Cash Fund',
      accountNumber: 'PC-LON-04',
      sortCodeOrRouting: 'Float Limit: £2,000.00',
      financialInstitution: 'Internal Cash Box Register',
      currency: 'GBP (£)',
      periodStart: '2026-09-01',
      periodEnd: '2026-09-30',
      openingBalance: 1500.00,
      closingBalance: 1215.30,
      totalCredits: 500.00,
      totalDebits: 784.70,
      calculatedClosingBalance: 1215.30,
      isReconciled: true,
    },
    extractedFields: [
      { id: 'cf-1', key: 'fund_name', label: 'Petty Cash Fund Name', value: 'London HQ Float Box', originalValue: 'London HQ Float Box', confidence: 'high', confidenceScore: 0.99, category: 'account', isValid: true },
      { id: 'cf-2', key: 'custodian_name', label: 'Fund Custodian', value: 'Marcus Reynolds', originalValue: 'Reynolds, Marcus', confidence: 'high', confidenceScore: 0.98, category: 'identity', isValid: true },
      { id: 'cf-3', key: 'float_opening', label: 'Opening Float Cash', value: '1500.00', originalValue: '£1,500.00', confidence: 'high', confidenceScore: 0.99, category: 'balance', isValid: true },
      { id: 'cf-4', key: 'float_closing', label: 'Closing Float Cash', value: '1215.30', originalValue: '£1,215.30', confidence: 'high', confidenceScore: 0.99, category: 'balance', isValid: true },
    ],
    transactions: [
      { id: 'ctx-1', date: '2026-09-04', description: 'COURIER DISPATCH - LEGAL DOCUMENTS TEMPLE', reference: 'VOUCH-101', debit: 45.00, credit: null, balance: 1455.00, confidence: 'high', confidenceScore: 0.98 },
      { id: 'ctx-2', date: '2026-09-12', description: 'OFFICE SUPPLIES - EMERGENCY PRINTER TONER', reference: 'VOUCH-102', debit: 189.70, credit: null, balance: 1265.30, confidence: 'high', confidenceScore: 0.99 },
      { id: 'ctx-3', date: '2026-09-18', description: 'FLOAT TOP-UP REPLENISHMENT FROM MAIN BANK', reference: 'CHQ-4819', debit: null, credit: 500.00, balance: 1765.30, confidence: 'high', confidenceScore: 0.99 },
      { id: 'ctx-4', date: '2026-09-25', description: 'CLIENT CATERING - STRATEGY WORKSHOP LUNCH', reference: 'VOUCH-103', debit: 550.00, credit: null, balance: 1215.30, confidence: 'high', confidenceScore: 0.98 },
    ],
    auditLogs: [
      { id: 'clog-1', timestamp: '2026-10-09T16:10:20Z', action: 'Petty Cash Log Scanned & Ingested', actor: 'Sarah Jenkins', details: 'Checksum verified.' },
      { id: 'clog-2', timestamp: '2026-10-09T17:00:00Z', action: 'CSV Exported and Synced', actor: 'System', details: 'All vouchers reconciled.' },
    ]
  }
];

export function getStoredSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SUBMISSIONS;
  }
}

export function saveStoredSubmissions(submissions: Submission[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
  } catch (e) {
    console.error('Failed to save submissions to localStorage', e);
  }
}

export function getStoredMappingConfig(): MappingConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MAPPINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MAPPINGS, JSON.stringify(DEFAULT_MAPPING_CONFIG));
      return DEFAULT_MAPPING_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MAPPING_CONFIG;
  }
}

export function saveStoredMappingConfig(config: MappingConfig): void {
  try {
    localStorage.setItem(STORAGE_KEYS.MAPPINGS, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save mapping config', e);
  }
}

export function getStoredSession(): UserSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!raw) return INITIAL_USER;
    return JSON.parse(raw);
  } catch {
    return INITIAL_USER;
  }
}

export function saveStoredSession(session: UserSession): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save user session', e);
  }
}

export function getRetentionDays(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RETENTION_DAYS);
    return raw ? parseInt(raw, 10) : 14;
  } catch {
    return 14;
  }
}

export function saveRetentionDays(days: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.RETENTION_DAYS, days.toString());
  } catch (e) {
    console.error('Failed to save retention days', e);
  }
}

export function resetDemoData(): void {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
  localStorage.setItem(STORAGE_KEYS.MAPPINGS, JSON.stringify(DEFAULT_MAPPING_CONFIG));
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(INITIAL_USER));
  localStorage.setItem(STORAGE_KEYS.RETENTION_DAYS, '14');
}
