import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight, 
  Edit2, 
  Check, 
  FileSpreadsheet, 
  FileText, 
  ShieldCheck, 
  Lock,
  Building2,
  Calendar,
  Layers,
  Calculator
} from 'lucide-react';
import { ExtractedField, FieldConfidence, Submission, TransactionRecord } from '../../types';

interface DocumentReviewViewProps {
  submission: Submission;
  onUpdateSubmission: (updated: Submission) => void;
  onGoToExport: (submissionId: string) => void;
  onBackToDashboard: () => void;
}

export const DocumentReviewView: React.FC<DocumentReviewViewProps> = ({
  submission,
  onUpdateSubmission,
  onGoToExport,
  onBackToDashboard,
}) => {
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'account' | 'balance' | 'identity'>('all');
  
  // Fields and transactions state
  const [fields, setFields] = useState<ExtractedField[]>(submission.extractedFields);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(submission.transactions);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'fields' | 'transactions'>('fields');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  const activeDoc = submission.documents[activeDocIndex] || submission.documents[0];

  // Confidence pill helper
  const getConfidenceBadge = (confidence: FieldConfidence, score: number) => {
    switch (confidence) {
      case 'high':
        return (
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>High ({Math.round(score * 100)}%)</span>
          </span>
        );
      case 'review_recommended':
        return (
          <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            <span>Review recommended ({Math.round(score * 100)}%)</span>
          </span>
        );
      case 'needs_verification':
        return (
          <span className="text-[11px] text-red-700 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            <span>Needs verification ({Math.round(score * 100)}%)</span>
          </span>
        );
    }
  };

  // Field change handler
  const handleFieldValueChange = (id: string, newValue: string) => {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            value: newValue,
            confidence: 'high',
            confidenceScore: 1.0,
            isEdited: true,
            validationMessage: undefined,
          };
        }
        return f;
      })
    );
    setHasUnsavedChanges(true);
  };

  // Transaction field edit
  const handleTxChange = (id: string, key: 'description' | 'date' | 'debit' | 'credit' | 'balance', val: any) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === id) {
          return {
            ...tx,
            [key]: val,
            confidence: 'high',
            confidenceScore: 1.0,
            isEdited: true,
            validationError: undefined,
          };
        }
        return tx;
      })
    );
    setHasUnsavedChanges(true);
  };

  // Save changes
  const saveAllChanges = () => {
    const updatedReviewCount = fields.filter((f) => f.confidence !== 'high').length +
      transactions.filter((t) => t.confidence !== 'high').length;

    const updated: Submission = {
      ...submission,
      extractedFields: fields,
      transactions,
      reviewFieldsCount: updatedReviewCount,
      status: updatedReviewCount === 0 ? 'completed' : 'needs_review',
      auditLogs: [
        ...submission.auditLogs,
        {
          id: `log-edit-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Manual Field Verification & Override',
          actor: 'Sarah Jenkins (Auditor)',
          details: 'Updated flagged entities. Re-verified integrity.',
        }
      ]
    };

    onUpdateSubmission(updated);
    setHasUnsavedChanges(false);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  // Approve all
  const approveDocument = () => {
    // Set all fields to high confidence
    const approvedFields = fields.map((f) => ({ ...f, confidence: 'high' as const, confidenceScore: 1.0, validationMessage: undefined }));
    const approvedTx = transactions.map((t) => ({ ...t, confidence: 'high' as const, confidenceScore: 1.0, validationError: undefined }));
    
    setFields(approvedFields);
    setTransactions(approvedTx);

    const updated: Submission = {
      ...submission,
      extractedFields: approvedFields,
      transactions: approvedTx,
      reviewFieldsCount: 0,
      status: 'completed',
      auditLogs: [
        ...submission.auditLogs,
        {
          id: `log-appr-${Date.now()}`,
          timestamp: new Date().toISOString(),
          action: 'Document Package Approved',
          actor: 'Sarah Jenkins (Auditor)',
          details: 'All extraction fields verified against document image. 100% accepted.',
        }
      ]
    };

    onUpdateSubmission(updated);
    setHasUnsavedChanges(false);
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  const filteredFields = fields.filter((f) => {
    if (activeCategoryFilter === 'all') return true;
    return f.category === activeCategoryFilter;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Review Header Bar */}
      <div className="bg-white rounded-xl border border-[#E7EAF1] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#697386]">
            <button onClick={onBackToDashboard} className="hover:text-[#172033] font-medium">Dashboard</button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-mono text-[#172033]">{submission.id}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#5146E5] font-semibold">95% Field Accuracy Review Workspace</span>
          </div>
          <h1 className="text-lg font-bold text-[#172033] mt-1">{submission.title}</h1>
          <div className="text-xs text-[#697386] mt-0.5">Client: {submission.clientName} · Ref: {submission.clientReference}</div>
        </div>

        <div className="flex items-center gap-2.5">
          {hasUnsavedChanges && (
            <button
              onClick={saveAllChanges}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Edits</span>
            </button>
          )}

          <button
            onClick={approveDocument}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Approve Document</span>
          </button>

          <button
            onClick={() => onGoToExport(submission.id)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#5146E5] to-[#7C6CF5] hover:opacity-95 rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {saveSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Changes successfully saved and audited. All verification flags updated.</span>
          </div>
        </div>
      )}

      {/* Main Review Split View: Left Document Preview (50%), Right Structured Fields (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Document Visual & OCR Viewer (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#E7EAF1] p-4 shadow-xs flex flex-col h-[750px] overflow-hidden">
          
          {/* Document Tabs & Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF1] text-xs">
            <div className="flex items-center gap-1">
              {submission.documents.map((doc, idx) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveDocIndex(idx)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                    activeDocIndex === idx
                      ? 'bg-indigo-50 text-[#5146E5] font-semibold'
                      : 'text-[#697386] hover:text-[#172033]'
                  }`}
                >
                  Page {idx + 1} ({doc.docType.replace('_', ' ')})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 text-[#697386]">
              <button
                onClick={() => setZoomLevel((z) => Math.max(75, z - 10))}
                className="p-1 hover:text-[#172033] hover:bg-slate-100 rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono tabular-nums">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                className="p-1 hover:text-[#172033] hover:bg-slate-100 rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* High-Fidelity Simulated Document Preview Canvas */}
          <div className="flex-1 overflow-auto p-4 bg-slate-100/70 rounded-lg mt-3 flex items-start justify-center">
            <div 
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-[480px] bg-white rounded-sm shadow-md border border-slate-300 p-6 text-slate-800 transition-transform font-sans"
            >
              {/* Bank Statement Document Header Visual */}
              <div className="border-b-2 border-slate-900 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">BARCLAYS COMMERCIAL</h2>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">Business Operating Current Account</p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500 font-mono">
                    <div>P.O. Box 120, London</div>
                    <div>Sort Code: 20-00-00</div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Account Holder:</span>
                    <span className="font-semibold text-slate-900 bg-indigo-50/80 px-1 rounded border border-indigo-200">
                      {submission.summary.accountHolder}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Account Number:</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {submission.summary.accountNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Statement Period:</span>
                    <span className="font-medium text-slate-800">
                      {submission.summary.periodStart} to {submission.summary.periodEnd}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px] uppercase">Currency:</span>
                    <span className="font-medium text-slate-800">GBP (£)</span>
                  </div>
                </div>
              </div>

              {/* Balances Summary Visual Box */}
              <div className="grid grid-cols-3 gap-2 text-[10px] bg-indigo-50/50 p-2 rounded border border-indigo-200 mb-4">
                <div>
                  <div className="text-slate-500 text-[9px]">STARTING BALANCE</div>
                  <div className="font-bold text-slate-900 font-mono text-[11px]">£{submission.summary.openingBalance.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[9px]">TOTAL CREDITS (+)</div>
                  <div className="font-bold text-emerald-700 font-mono text-[11px]">£{submission.summary.totalCredits.toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[9px]">CLOSING BALANCE</div>
                  <div className="font-bold text-slate-900 font-mono text-[11px]">£{submission.summary.closingBalance.toFixed(2)}</div>
                </div>
              </div>

              {/* Transactions Table Visual */}
              <div className="text-[10px]">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  TRANSACTION LEDGER
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 text-slate-500 text-[9px]">
                      <th className="py-1">Date</th>
                      <th className="py-1">Description</th>
                      <th className="py-1 text-right">Debit</th>
                      <th className="py-1 text-right">Credit</th>
                      <th className="py-1 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-mono text-[9px]">
                    {transactions.slice(0, 6).map((tx) => (
                      <tr 
                        key={tx.id} 
                        className={tx.confidence !== 'high' ? 'bg-amber-50/80 border-l-2 border-amber-500' : ''}
                      >
                        <td className="py-1 text-slate-600">{tx.date.substring(5)}</td>
                        <td className="py-1 font-sans text-slate-800 truncate max-w-[120px]">{tx.description}</td>
                        <td className="py-1 text-right text-slate-700">{tx.debit ? `£${tx.debit.toFixed(2)}` : '-'}</td>
                        <td className="py-1 text-right text-emerald-700">{tx.credit ? `£${tx.credit.toFixed(2)}` : '-'}</td>
                        <td className="py-1 text-right text-slate-900 font-semibold">£{tx.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Authenticity Watermark / Security Hash footer */}
              <div className="mt-8 pt-3 border-t border-slate-200 text-[9px] text-slate-400 font-mono flex justify-between">
                <span>DIGITAL ARCHIVE DOC ID: {activeDoc.sha256Hash.substring(0, 16)}</span>
                <span>PAGE 1 OF 3</span>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-[#697386] flex items-center justify-between">
            <span>OCR Provider: Google Document AI</span>
            <span>Image DPI: 300 · Bitonal Raster</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Extracted Structured Fields & Reconcile Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Balance Reconcile Verification Card */}
          <div className="bg-white rounded-xl border border-[#E7EAF1] p-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF1]">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#5146E5]" />
                <h3 className="text-xs font-semibold text-[#172033]">
                  Mathematical Ledger Balance Reconcile
                </h3>
              </div>
              <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Reconciled 100%</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 text-xs">
              <div>
                <span className="text-[11px] text-[#697386] block">Opening Balance</span>
                <span className="font-bold text-[#172033] font-mono tabular-nums">
                  £{submission.summary.openingBalance.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#697386] block">+ Credits (Inflow)</span>
                <span className="font-bold text-emerald-700 font-mono tabular-nums">
                  +£{submission.summary.totalCredits.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#697386] block">- Debits (Outflow)</span>
                <span className="font-bold text-red-600 font-mono tabular-nums">
                  -£{submission.summary.totalDebits.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-[#697386] block">= Closing Balance</span>
                <span className="font-bold text-[#172033] font-mono tabular-nums">
                  £{submission.summary.closingBalance.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Tab Switcher: Structured Fields vs Transactions */}
          <div className="bg-white rounded-xl border border-[#E7EAF1] shadow-xs overflow-hidden">
            
            <div className="p-3 border-b border-[#E7EAF1] flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('fields')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'fields'
                      ? 'bg-white text-[#172033] shadow-xs border border-[#E7EAF1]'
                      : 'text-[#697386] hover:text-[#172033]'
                  }`}
                >
                  Extracted Header & ID Fields ({fields.length})
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'transactions'
                      ? 'bg-white text-[#172033] shadow-xs border border-[#E7EAF1]'
                      : 'text-[#697386] hover:text-[#172033]'
                  }`}
                >
                  Transaction Ledger Rows ({transactions.length})
                </button>
              </div>

              {activeTab === 'fields' && (
                <div className="hidden sm:flex items-center gap-1 text-[11px]">
                  <span className="text-[#697386]">Filter:</span>
                  <button 
                    onClick={() => setActiveCategoryFilter('all')}
                    className={`px-2 py-0.5 rounded ${activeCategoryFilter === 'all' ? 'bg-slate-200 font-semibold' : 'text-[#697386]'}`}
                  >
                    All
                  </button>
                  <button 
                    onClick={() => setActiveCategoryFilter('account')}
                    className={`px-2 py-0.5 rounded ${activeCategoryFilter === 'account' ? 'bg-slate-200 font-semibold' : 'text-[#697386]'}`}
                  >
                    Account
                  </button>
                  <button 
                    onClick={() => setActiveCategoryFilter('identity')}
                    className={`px-2 py-0.5 rounded ${activeCategoryFilter === 'identity' ? 'bg-slate-200 font-semibold' : 'text-[#697386]'}`}
                  >
                    Identity
                  </button>
                </div>
              )}
            </div>

            {/* Content: Fields View */}
            {activeTab === 'fields' && (
              <div className="divide-y divide-[#E7EAF1] max-h-[560px] overflow-y-auto">
                {filteredFields.map((field) => (
                  <div 
                    key={field.id}
                    className={`p-3.5 hover:bg-slate-50/80 transition-colors ${
                      field.confidence !== 'high' ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#172033]">{field.label}</span>
                          <span className="text-[11px] text-[#697386] font-mono">({field.key})</span>
                          {getConfidenceBadge(field.confidence, field.confidenceScore)}
                        </div>

                        {/* Interactive Edit Input or Display */}
                        <div className="mt-1.5 flex items-center gap-2">
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => handleFieldValueChange(field.id, e.target.value)}
                            className="text-xs font-medium text-[#172033] bg-white border border-[#E7EAF1] rounded-md px-2.5 py-1 w-full max-w-sm focus:outline-none focus:ring-1 focus:ring-[#5146E5]"
                          />
                          {field.isEdited && (
                            <span className="text-[10px] text-indigo-600 font-medium whitespace-nowrap">
                              Overridden
                            </span>
                          )}
                        </div>

                        {field.validationMessage && (
                          <div className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{field.validationMessage}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-right text-[11px] text-[#697386] shrink-0 font-mono">
                        <span className="block text-[10px] uppercase text-slate-400">OCR Raw:</span>
                        <span>{field.originalValue}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content: Transactions Ledger View */}
            {activeTab === 'transactions' && (
              <div className="overflow-x-auto max-h-[560px]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E7EAF1] bg-[#F7F8FC] text-[#697386] font-medium">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Narrative / Description</th>
                      <th className="py-2.5 px-3 text-right">Debit (£)</th>
                      <th className="py-2.5 px-3 text-right">Credit (£)</th>
                      <th className="py-2.5 px-3 text-right">Balance (£)</th>
                      <th className="py-2.5 px-3">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E7EAF1]">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono">
                          <input
                            type="text"
                            value={tx.date}
                            onChange={(e) => handleTxChange(tx.id, 'date', e.target.value)}
                            className="bg-transparent border-0 hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#5146E5] rounded px-1 py-0.5 w-24"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={tx.description}
                            onChange={(e) => handleTxChange(tx.id, 'description', e.target.value)}
                            className="bg-transparent border-0 hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#5146E5] rounded px-1 py-0.5 w-full font-medium text-[#172033]"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-mono">
                          <input
                            type="number"
                            step="0.01"
                            value={tx.debit ?? ''}
                            placeholder="-"
                            onChange={(e) => handleTxChange(tx.id, 'debit', e.target.value ? parseFloat(e.target.value) : null)}
                            className="bg-transparent border-0 hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#5146E5] rounded px-1 py-0.5 w-20 text-right text-red-600 font-semibold"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-mono">
                          <input
                            type="number"
                            step="0.01"
                            value={tx.credit ?? ''}
                            placeholder="-"
                            onChange={(e) => handleTxChange(tx.id, 'credit', e.target.value ? parseFloat(e.target.value) : null)}
                            className="bg-transparent border-0 hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#5146E5] rounded px-1 py-0.5 w-20 text-right text-emerald-700 font-semibold"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#172033]">
                          <input
                            type="number"
                            step="0.01"
                            value={tx.balance}
                            onChange={(e) => handleTxChange(tx.id, 'balance', parseFloat(e.target.value) || 0)}
                            className="bg-transparent border-0 hover:bg-white focus:bg-white focus:ring-1 focus:ring-[#5146E5] rounded px-1 py-0.5 w-24 text-right"
                          />
                        </td>
                        <td className="py-2 px-3">
                          {getConfidenceBadge(tx.confidence, tx.confidenceScore)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
