import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  IdCard, 
  Receipt, 
  Coins, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  FolderCheck, 
  Sparkles, 
  Clock, 
  RefreshCw,
  FileCheck
} from 'lucide-react';
import { DocumentType, Submission, UploadedDoc } from '../../types';
import { generateSyntheticSubmissionData, PROCESSING_STAGES, ProcessingStage } from '../../services/aiProcessing';

interface NewSubmissionWizardProps {
  initialDocType?: DocumentType;
  onCancel: () => void;
  onComplete: (submission: Submission) => void;
  onGoToReview: (submissionId: string) => void;
  onGoToExport: (submissionId: string) => void;
}

export const NewSubmissionWizard: React.FC<NewSubmissionWizardProps> = ({
  initialDocType = 'bank_statement',
  onCancel,
  onComplete,
  onGoToReview,
  onGoToExport,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [title, setTitle] = useState('Oct 2026 Monthly Consulting Reconciliation');
  const [clientName, setClientName] = useState('Horizon Capital Partners Ltd');
  const [clientReference, setClientReference] = useState('CLI-2026-9041');
  const [selectedTypes, setSelectedTypes] = useState<DocumentType[]>([initialDocType]);
  
  // Uploaded files
  const [uploadedFiles, setUploadedFiles] = useState<UploadedDoc[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  // Consent
  const [hasConsented, setHasConsented] = useState(false);
  const [dataRetentionNoticeAcknowledged, setDataRetentionNoticeAcknowledged] = useState(false);

  // Processing stages
  const [stages, setStages] = useState<ProcessingStage[]>(
    PROCESSING_STAGES.map((s) => ({ ...s, status: 'pending' }))
  );
  const [completedSubmission, setCompletedSubmission] = useState<Submission | null>(null);

  // Toggle document type
  const toggleDocType = (type: DocumentType) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  // Helper to load realistic sample bundle
  const loadSampleBundle = () => {
    const samples: UploadedDoc[] = [
      {
        id: `doc-${Date.now()}-1`,
        name: 'Horizon_Barclays_Commercial_Oct2026.pdf',
        size: 2184900,
        type: 'application/pdf',
        docType: 'bank_statement',
        uploadedAt: new Date().toISOString(),
        status: 'processed',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        pageCount: 3,
      },
      {
        id: `doc-${Date.now()}-2`,
        name: 'Director_Passport_Vance_M.pdf',
        size: 1420500,
        type: 'application/pdf',
        docType: 'identity_document',
        uploadedAt: new Date().toISOString(),
        status: 'processed',
        sha256Hash: 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149a',
        pageCount: 1,
      }
    ];

    setSelectedTypes(['bank_statement', 'identity_document']);
    setUploadedFiles(samples);
  };

  // Simulated file input handling
  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (files: File[]) => {
    const newDocs: UploadedDoc[] = files.map((file, i) => {
      // Determine docType based on primary selection
      const assignedType = selectedTypes[i % selectedTypes.length];
      return {
        id: `doc-${Date.now()}-${i}`,
        name: file.name,
        size: file.size,
        type: file.type || 'application/pdf',
        docType: assignedType,
        uploadedAt: new Date().toISOString(),
        status: 'processed',
        sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        pageCount: Math.max(1, Math.floor(file.size / 500000)),
      };
    });

    setUploadedFiles((prev) => [...prev, ...newDocs]);
  };

  const removeFile = (docId: string) => {
    setUploadedFiles((prev) => prev.filter((d) => d.id !== docId));
  };

  // Run the multi-stage processing simulation
  const startProcessing = () => {
    setCurrentStep(4);

    let stageIndex = 0;
    const initial = PROCESSING_STAGES.map((s, idx) => ({
      ...s,
      status: idx === 0 ? ('active' as const) : ('pending' as const),
    }));
    setStages(initial);

    const interval = setInterval(() => {
      stageIndex++;

      setStages((prev) =>
        prev.map((stage, idx) => {
          if (idx < stageIndex) return { ...stage, status: 'completed' as const };
          if (idx === stageIndex) return { ...stage, status: 'active' as const };
          return { ...stage, status: 'pending' as const };
        })
      );

      if (stageIndex >= PROCESSING_STAGES.length) {
        clearInterval(interval);
        
        // Generate submission data
        const sub = generateSyntheticSubmissionData(
          title,
          clientName,
          clientReference,
          selectedTypes,
          uploadedFiles.length > 0 ? uploadedFiles : [
            {
              id: `doc-default`,
              name: 'Statement_Uploaded_Oct2026.pdf',
              size: 2150000,
              type: 'application/pdf',
              docType: selectedTypes[0],
              uploadedAt: new Date().toISOString(),
              status: 'processed',
              sha256Hash: '9e8b7c3d2a1f4e5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
              pageCount: 2,
            }
          ]
        );

        setCompletedSubmission(sub);
        onComplete(sub);
        setCurrentStep(5);
      }
    }, 900);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Wizard Header & Stepper */}
      <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-[#E7EAF1]">
          <div>
            <span className="text-xs font-semibold text-[#5146E5]">New Document Intake</span>
            <h1 className="text-lg font-bold text-[#172033] mt-0.5">Submit Financial Documents for AI Extraction</h1>
          </div>
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-[#697386] hover:text-[#172033] transition-colors p-1"
          >
            Cancel
          </button>
        </div>

        {/* 5-Step Progress Indicators */}
        <div className="pt-6">
          <div className="grid grid-cols-5 gap-2 text-center text-xs">
            
            <div className={`flex flex-col items-center gap-1.5 ${currentStep >= 1 ? 'text-[#5146E5]' : 'text-[#697386]'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-colors ${
                currentStep > 1 ? 'bg-emerald-100 text-emerald-800' : currentStep === 1 ? 'bg-[#5146E5] text-white' : 'bg-slate-100 text-[#697386]'
              }`}>
                {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <span className="font-medium truncate max-w-full">Categories</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 ${currentStep >= 2 ? 'text-[#5146E5]' : 'text-[#697386]'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-colors ${
                currentStep > 2 ? 'bg-emerald-100 text-emerald-800' : currentStep === 2 ? 'bg-[#5146E5] text-white' : 'bg-slate-100 text-[#697386]'
              }`}>
                {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
              </div>
              <span className="font-medium truncate max-w-full">Files</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 ${currentStep >= 3 ? 'text-[#5146E5]' : 'text-[#697386]'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-colors ${
                currentStep > 3 ? 'bg-emerald-100 text-emerald-800' : currentStep === 3 ? 'bg-[#5146E5] text-white' : 'bg-slate-100 text-[#697386]'
              }`}>
                {currentStep > 3 ? <CheckCircle2 className="w-4 h-4" /> : '3'}
              </div>
              <span className="font-medium truncate max-w-full">Consent</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 ${currentStep >= 4 ? 'text-[#5146E5]' : 'text-[#697386]'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-colors ${
                currentStep > 4 ? 'bg-emerald-100 text-emerald-800' : currentStep === 4 ? 'bg-[#5146E5] text-white animate-pulse' : 'bg-slate-100 text-[#697386]'
              }`}>
                {currentStep > 4 ? <CheckCircle2 className="w-4 h-4" /> : '4'}
              </div>
              <span className="font-medium truncate max-w-full">Processing</span>
            </div>

            <div className={`flex flex-col items-center gap-1.5 ${currentStep === 5 ? 'text-emerald-700 font-semibold' : 'text-[#697386]'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold text-xs transition-colors ${
                currentStep === 5 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-[#697386]'
              }`}>
                5
              </div>
              <span className="font-medium truncate max-w-full">Results</span>
            </div>

          </div>
        </div>
      </div>

      {/* STEP 1: CHOOSE DOCUMENT TYPES & BASIC METADATA */}
      {currentStep === 1 && (
        <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-semibold text-[#172033]">Step 1: Choose Document Categories & Metadata</h2>
            <p className="text-xs text-[#697386] mt-0.5">
              Select one or more document categories included in this consulting client submission.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Bank Statements */}
            <div 
              onClick={() => toggleDocType('bank_statement')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTypes.includes('bank_statement')
                  ? 'border-[#5146E5] bg-indigo-50/40 ring-1 ring-[#5146E5]'
                  : 'border-[#E7EAF1] hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-[#5146E5] flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <input 
                  type="checkbox" 
                  checked={selectedTypes.includes('bank_statement')} 
                  onChange={() => {}} 
                  className="rounded text-[#5146E5] focus:ring-[#5146E5]" 
                />
              </div>
              <div className="mt-3">
                <h3 className="text-xs font-semibold text-[#172033]">Bank Statements</h3>
                <p className="text-[11px] text-[#697386] mt-0.5">
                  Business checking, savings accounts, credit statements, running balances.
                </p>
              </div>
            </div>

            {/* Identity Documents */}
            <div 
              onClick={() => toggleDocType('identity_document')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTypes.includes('identity_document')
                  ? 'border-[#5146E5] bg-indigo-50/40 ring-1 ring-[#5146E5]'
                  : 'border-[#E7EAF1] hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <IdCard className="w-4 h-4" />
                </div>
                <input 
                  type="checkbox" 
                  checked={selectedTypes.includes('identity_document')} 
                  onChange={() => {}} 
                  className="rounded text-[#5146E5] focus:ring-[#5146E5]" 
                />
              </div>
              <div className="mt-3">
                <h3 className="text-xs font-semibold text-[#172033]">Identity Documents</h3>
                <p className="text-[11px] text-[#697386] mt-0.5">
                  Passports, national ID cards, driving licences, KYC identity records.
                </p>
              </div>
            </div>

            {/* Payslips */}
            <div 
              onClick={() => toggleDocType('payslip')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTypes.includes('payslip')
                  ? 'border-[#5146E5] bg-indigo-50/40 ring-1 ring-[#5146E5]'
                  : 'border-[#E7EAF1] hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <input 
                  type="checkbox" 
                  checked={selectedTypes.includes('payslip')} 
                  onChange={() => {}} 
                  className="rounded text-[#5146E5] focus:ring-[#5146E5]" 
                />
              </div>
              <div className="mt-3">
                <h3 className="text-xs font-semibold text-[#172033]">Payslips</h3>
                <p className="text-[11px] text-[#697386] mt-0.5">
                  Monthly payslips, PAYE records, tax deductions, pension withholdings.
                </p>
              </div>
            </div>

            {/* Cash Statements */}
            <div 
              onClick={() => toggleDocType('cash_statement')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedTypes.includes('cash_statement')
                  ? 'border-[#5146E5] bg-indigo-50/40 ring-1 ring-[#5146E5]'
                  : 'border-[#E7EAF1] hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
                <input 
                  type="checkbox" 
                  checked={selectedTypes.includes('cash_statement')} 
                  onChange={() => {}} 
                  className="rounded text-[#5146E5] focus:ring-[#5146E5]" 
                />
              </div>
              <div className="mt-3">
                <h3 className="text-xs font-semibold text-[#172033]">Cash Statements</h3>
                <p className="text-[11px] text-[#697386] mt-0.5">
                  Petty cash disbursement journals, cash register logs, receipts.
                </p>
              </div>
            </div>

          </div>

          {/* Submission Details */}
          <div className="pt-4 border-t border-[#E7EAF1] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-[#172033] block mb-1">Submission Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E7EAF1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5146E5]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#172033] block mb-1">Client Legal Name</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E7EAF1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5146E5]"
              />
            </div>
            <div>
              <label className="font-semibold text-[#172033] block mb-1">Client Reference Code</label>
              <input
                type="text"
                value={clientReference}
                onChange={(e) => setClientReference(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-[#E7EAF1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5146E5]"
              />
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={selectedTypes.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#5146E5] to-[#7C6CF5] hover:opacity-95 rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>Continue to File Upload</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: UPLOAD FILES */}
      {currentStep === 2 && (
        <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#172033]">Step 2: Upload Documents</h2>
              <p className="text-xs text-[#697386] mt-0.5">
                Support for PDF, TIFF, PNG, JPG files up to 25MB each.
              </p>
            </div>
            <button
              onClick={loadSampleBundle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5146E5] bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Verified Sample Bundle</span>
            </button>
          </div>

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              isDragging ? 'border-[#5146E5] bg-indigo-50/50' : 'border-[#E7EAF1] bg-[#F7F8FC]/50 hover:border-slate-300'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-white border border-[#E7EAF1] text-[#5146E5] flex items-center justify-center mx-auto shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#172033] mt-3">
              Drag and drop your documents here, or browse
            </h3>
            <p className="text-xs text-[#697386] mt-1">
              Organized by document category: {selectedTypes.join(', ').replace(/_/g, ' ')}
            </p>

            <label className="inline-block mt-4">
              <span className="px-4 py-2 text-xs font-semibold text-[#172033] bg-white border border-[#E7EAF1] hover:bg-slate-50 rounded-lg shadow-xs cursor-pointer">
                Choose files
              </span>
              <input 
                type="file" 
                multiple 
                accept=".pdf,.png,.jpg,.jpeg,.tiff" 
                onChange={handleFileInput} 
                className="hidden" 
              />
            </label>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-semibold text-[#172033]">
                Staged Files ({uploadedFiles.length})
              </h4>
              <div className="space-y-2">
                {uploadedFiles.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border border-[#E7EAF1] bg-white text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-indigo-50 text-[#5146E5] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#172033]">{doc.name}</div>
                        <div className="text-[11px] text-[#697386]">
                          {(doc.size / 1024 / 1024).toFixed(2)} MB · {doc.pageCount} page(s) · Category: {doc.docType.replace('_', ' ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready</span>
                      </span>
                      <button
                        onClick={() => removeFile(doc.id)}
                        className="text-[#697386] hover:text-red-600 p-1 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E7EAF1]">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#697386] hover:text-[#172033] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => {
                if (uploadedFiles.length === 0) loadSampleBundle();
                setCurrentStep(3);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#5146E5] to-[#7C6CF5] hover:opacity-95 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <span>Continue to Consent & Privacy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CONSENT & CONFIRMATION */}
      {currentStep === 3 && (
        <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-semibold text-[#172033]">Step 3: Security, Privacy & Processing Consent</h2>
            <p className="text-xs text-[#697386] mt-0.5">
              Financial statements and identity records are confidential. Confirm consent prior to processing.
            </p>
          </div>

          {/* Privacy Safeguards Card */}
          <div className="bg-[#F7F8FC] rounded-xl border border-[#E7EAF1] p-4 space-y-3 text-xs text-[#172033]">
            <div className="flex items-center gap-2 font-semibold text-[#172033]">
              <Lock className="w-4 h-4 text-[#5146E5]" />
              <span>Regulatory Data Governance Notice</span>
            </div>
            <p className="text-[#697386] leading-relaxed">
              Documents submitted to LedgerFlow are processed in an encrypted ephemeral sandbox. Text entities 
              and tables extracted by Google Document AI and Claude Sonnet are strictly parsed into structured JSON schemas.
              Extracted results are staged to your authorized corporate Google Drive folder.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#E7EAF1] text-[11px] text-[#697386]">
              <div>• TLS 1.3 in-transit and AES-256 rest encryption</div>
              <div>• Least-privilege Google Service Account credentials</div>
              <div>• Zero LLM training on financial customer inputs</div>
              <div>• Automated file deletion policy (14-day schedule)</div>
            </div>
          </div>

          {/* Explicit Consent Checkboxes */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasConsented}
                onChange={(e) => setHasConsented(e.target.checked)}
                className="mt-0.5 rounded text-[#5146E5] focus:ring-[#5146E5]"
              />
              <span className="text-xs text-[#172033]">
                <strong>I provide explicit consent</strong> for LedgerFlow to process the selected {uploadedFiles.length || 2} documents, 
                extract financial ledgers and identity parameters, and synthesize consulting CSV files for {clientName}.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={dataRetentionNoticeAcknowledged}
                onChange={(e) => setDataRetentionNoticeAcknowledged(e.target.checked)}
                className="mt-0.5 rounded text-[#5146E5] focus:ring-[#5146E5]"
              />
              <span className="text-xs text-[#172033]">
                I acknowledge the <strong>14-day data retention schedule</strong>, after which temporary processing artifacts are permanently purged from staging memory.
              </span>
            </label>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E7EAF1]">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#697386] hover:text-[#172033] cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={startProcessing}
              disabled={!hasConsented || !dataRetentionNoticeAcknowledged}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#5146E5] to-[#7C6CF5] hover:opacity-95 rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Initiate AI Extraction Pipeline</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: PROCESSING TIMELINE */}
      {currentStep === 4 && (
        <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#5146E5] flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-base font-semibold text-[#172033]">Processing Documents</h2>
            <p className="text-xs text-[#697386] mt-1">
              Executing deterministic OCR extraction, JSON entity parsing, and mathematical ledger reconciliation.
            </p>
          </div>

          {/* Stage Timeline */}
          <div className="space-y-4 max-w-xl mx-auto pt-4">
            {stages.map((stage, idx) => (
              <div key={stage.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    stage.status === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : stage.status === 'active'
                      ? 'bg-[#5146E5] text-white animate-pulse'
                      : 'bg-slate-100 text-[#697386]'
                  }`}>
                    {stage.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  {idx < stages.length - 1 && (
                    <div className={`w-0.5 h-7 mt-1 ${
                      stage.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>

                <div className="pt-0.5 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-semibold ${
                      stage.status === 'active' ? 'text-[#5146E5]' : stage.status === 'completed' ? 'text-[#172033]' : 'text-[#697386]'
                    }`}>
                      {stage.name}
                    </h4>
                    {stage.status === 'completed' && (
                      <span className="text-[11px] text-emerald-700 font-medium">Passed</span>
                    )}
                    {stage.status === 'active' && (
                      <span className="text-[11px] text-indigo-600 font-medium">Running...</span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#697386] mt-0.5 leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4 text-xs text-[#697386]">
            Average duration per document bundle: &lt; 20 seconds.
          </div>
        </div>
      )}

      {/* STEP 5: RESULTS */}
      {currentStep === 5 && completedSubmission && (
        <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-700">Extraction Complete</span>
              <h2 className="text-lg font-bold text-[#172033]">{completedSubmission.title}</h2>
            </div>
          </div>

          {/* Results Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-[#E7EAF1]">
              <div className="text-[11px] text-[#697386]">Submission Ref</div>
              <div className="text-sm font-bold font-mono text-[#172033] mt-1">{completedSubmission.id}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-[#E7EAF1]">
              <div className="text-[11px] text-[#697386]">Entities Extracted</div>
              <div className="text-sm font-bold text-[#172033] mt-1 tabular-nums">{completedSubmission.totalFieldsCount} fields</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-[#E7EAF1]">
              <div className="text-[11px] text-[#697386]">Review Flags</div>
              <div className="text-sm font-bold text-amber-700 mt-1 tabular-nums">
                {completedSubmission.reviewFieldsCount} flagged field{completedSubmission.reviewFieldsCount > 1 ? 's' : ''}
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-[#E7EAF1]">
              <div className="text-[11px] text-[#697386]">Balance Reconciled</div>
              <div className="text-sm font-bold text-emerald-700 mt-1">Verified (£)</div>
            </div>
          </div>

          {/* Drive Location */}
          <div className="p-4 rounded-xl border border-[#E7EAF1] bg-[#F7F8FC] flex items-center gap-3 text-xs">
            <FolderCheck className="w-5 h-5 text-[#5146E5] shrink-0" />
            <div>
              <div className="font-semibold text-[#172033]">Staged to Google Drive Folder</div>
              <div className="text-[#697386] font-mono text-[11px] truncate">{completedSubmission.googleDrivePath}</div>
            </div>
          </div>

          {/* Hand-off CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-[#E7EAF1]">
            <button
              onClick={() => onGoToExport(completedSubmission.id)}
              className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-[#E7EAF1] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Export CSV Directly
            </button>

            <button
              onClick={() => onGoToReview(completedSubmission.id)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#5146E5] to-[#7C6CF5] hover:opacity-95 rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <span>Open Document Review Workspace (Recommended)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
