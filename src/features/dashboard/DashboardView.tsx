import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  IdCard, 
  Receipt, 
  Coins, 
  ArrowRight, 
  Download, 
  ExternalLink, 
  Search, 
  SlidersHorizontal, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet,
  ShieldCheck,
  Sparkles,
  Info
} from 'lucide-react';
import { DocumentType, Submission, SubmissionStatus } from '../../types';

interface DashboardViewProps {
  submissions: Submission[];
  onStartNewSubmission: (presetType?: DocumentType) => void;
  onSelectSubmissionForReview: (submissionId: string) => void;
  onNavigateToExport: (submissionId: string) => void;
  onViewAllSubmissions: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  submissions,
  onStartNewSubmission,
  onSelectSubmissionForReview,
  onNavigateToExport,
  onViewAllSubmissions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>('all');

  // Filter submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = 
      sub.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.clientName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCount = submissions.length;
  const processingCount = submissions.filter((s) => s.status === 'processing').length;
  const needsReviewCount = submissions.filter((s) => s.status === 'needs_review').length;
  const completedCount = submissions.filter((s) => s.status === 'completed').length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Demo Mode / Environment Banner */}
      <div className="bg-white border border-[#E7EAF1] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-[#5146E5] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#172033]">
              Consulting Workspace Active · Demo & Vercel Preview Mode
            </div>
            <div className="text-xs text-[#697386]">
              Deterministic OCR & AI schema extraction enabled. Ready for Google Drive & PostgreSQL credentials.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-[#697386]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Zero-Leakage Memory Buffer</span>
        </div>
      </div>

      {/* Hero Welcome & Greeting Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-2">
        <div className="max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#172033]">
            Welcome back, Sarah
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#697386] leading-relaxed">
            Upload consulting client bank statements, identity documents, payslips, and cash records. 
            LedgerFlow extracts financial entities, verifies balances, and outputs consulting-ready CSVs.
          </p>
        </div>

        <button
          onClick={() => onStartNewSubmission()}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#5146E5] to-[#7C6CF5] hover:opacity-95 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <span>New document submission</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E7EAF1] shadow-xs">
          <div className="text-xs font-medium text-[#697386]">Total Submissions</div>
          <div className="text-2xl font-bold text-[#172033] mt-1 tabular-nums">{totalCount}</div>
          <div className="text-[11px] text-[#697386] mt-1">Across 4 client accounts</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E7EAF1] shadow-xs">
          <div className="text-xs font-medium text-[#697386]">In Processing</div>
          <div className="text-2xl font-bold text-[#172033] mt-1 tabular-nums">{processingCount}</div>
          <div className="text-[11px] text-[#697386] mt-1">&lt; 60s average turnaround</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E7EAF1] shadow-xs">
          <div className="text-xs font-medium text-amber-700">Needs Review</div>
          <div className="text-2xl font-bold text-amber-700 mt-1 tabular-nums">{needsReviewCount}</div>
          <div className="text-[11px] text-amber-700 mt-1">Low confidence or flags</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E7EAF1] shadow-xs">
          <div className="text-xs font-medium text-emerald-700">Completed</div>
          <div className="text-2xl font-bold text-emerald-700 mt-1 tabular-nums">{completedCount}</div>
          <div className="text-[11px] text-emerald-700 mt-1">Ready for export</div>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-xl border border-[#E7EAF1] shadow-xs">
          <div className="text-xs font-medium text-[#697386]">Benchmark Accuracy</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1 tabular-nums">97.2%</div>
          <div className="text-[11px] text-emerald-700 mt-1">Exceeds 95.0% target</div>
        </div>
      </div>

      {/* 4 Document Type Cards (with distinct tasteful icons and upload actions) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#172033]">Document Intake Categories</h2>
            <p className="text-xs text-[#697386]">Select a document type to start a targeted extraction workflow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Bank Statements */}
          <div className="bg-white rounded-xl border border-[#E7EAF1] p-5 shadow-xs hover:border-[#5146E5]/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-[#5146E5] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#172033]">Bank Statements</h3>
              <p className="mt-1 text-xs text-[#697386] leading-relaxed">
                Checking, savings, and treasury statements. Extracts balances, sort codes, and reconciled transaction ledgers.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E7EAF1] flex items-center justify-between">
              <span className="text-[11px] text-[#697386]">PDF, TIFF, Scans</span>
              <button
                onClick={() => onStartNewSubmission('bank_statement')}
                className="text-xs font-semibold text-[#5146E5] hover:text-[#4338CA] flex items-center gap-1 cursor-pointer"
              >
                <span>Upload</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. Identity Documents */}
          <div className="bg-white rounded-xl border border-[#E7EAF1] p-5 shadow-xs hover:border-[#5146E5]/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <IdCard className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#172033]">Identity Documents</h3>
              <p className="mt-1 text-xs text-[#697386] leading-relaxed">
                Passports, photocard driving licences, and EU ID cards. Validates MRZ lines, expiry dates, and KYC residency.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E7EAF1] flex items-center justify-between">
              <span className="text-[11px] text-[#697386]">PDF, JPG, PNG</span>
              <button
                onClick={() => onStartNewSubmission('identity_document')}
                className="text-xs font-semibold text-[#5146E5] hover:text-[#4338CA] flex items-center gap-1 cursor-pointer"
              >
                <span>Upload</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. Payslips */}
          <div className="bg-white rounded-xl border border-[#E7EAF1] p-5 shadow-xs hover:border-[#5146E5]/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#172033]">Payslips</h3>
              <p className="mt-1 text-xs text-[#697386] leading-relaxed">
                Corporate payroll and salary vouchers. Extracts gross/net pay, PAYE income tax, national insurance, and pension deductions.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E7EAF1] flex items-center justify-between">
              <span className="text-[11px] text-[#697386]">PDF, Images</span>
              <button
                onClick={() => onStartNewSubmission('payslip')}
                className="text-xs font-semibold text-[#5146E5] hover:text-[#4338CA] flex items-center gap-1 cursor-pointer"
              >
                <span>Upload</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4. Cash Statements */}
          <div className="bg-white rounded-xl border border-[#E7EAF1] p-5 shadow-xs hover:border-[#5146E5]/40 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-[#172033]">Cash Statements</h3>
              <p className="mt-1 text-xs text-[#697386] leading-relaxed">
                Petty cash books, till tapes, register journals, and expense vouchers. Balances cash floats with physical receipts.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[#E7EAF1] flex items-center justify-between">
              <span className="text-[11px] text-[#697386]">PDF, Scans</span>
              <button
                onClick={() => onStartNewSubmission('cash_statement')}
                className="text-xs font-semibold text-[#5146E5] hover:text-[#4338CA] flex items-center gap-1 cursor-pointer"
              >
                <span>Upload</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Submissions Section */}
      <div className="bg-white rounded-xl border border-[#E7EAF1] shadow-xs overflow-hidden">
        
        {/* Table Filter & Search Header */}
        <div className="p-4 sm:p-5 border-b border-[#E7EAF1] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-[#172033]">Recent Document Submissions</h2>
            <p className="text-xs text-[#697386]">Review extraction accuracy, inspect OCR provenance, and export verified CSV files</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-[#697386] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search submission or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-[#E7EAF1] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5146E5] w-56 text-[#172033]"
              />
            </div>

            {/* Filter Tabs (Interactive Segmented Control) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'all' ? 'bg-white text-[#172033] shadow-xs' : 'text-[#697386] hover:text-[#172033]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('needs_review')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'needs_review' ? 'bg-white text-amber-700 shadow-xs' : 'text-[#697386] hover:text-[#172033]'
                }`}
              >
                Needs Review
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === 'completed' ? 'bg-white text-emerald-700 shadow-xs' : 'text-[#697386] hover:text-[#172033]'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E7EAF1] bg-[#F7F8FC]/60 text-[#697386] font-medium">
                <th className="py-3 px-4">Submission Ref</th>
                <th className="py-3 px-4">Client & Title</th>
                <th className="py-3 px-4">Doc Types</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Review Flags</th>
                <th className="py-3 px-4">CSV & Drive</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EAF1]">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#697386]">
                    No submissions matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => {
                  const dateFormatted = new Date(sub.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                      
                      {/* Submission ID & Date */}
                      <td className="py-3.5 px-4 font-mono font-medium text-[#172033]">
                        <div>{sub.id}</div>
                        <div className="text-[11px] text-[#697386] font-sans">{dateFormatted}</div>
                      </td>

                      {/* Title & Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#172033]">{sub.title}</div>
                        <div className="text-[11px] text-[#697386]">{sub.clientName}</div>
                      </td>

                      {/* Document Types */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 text-[11px] text-[#697386]">
                          {sub.documentTypes.map((t, idx) => (
                            <span key={t}>
                              {t === 'bank_statement' && 'Bank Statement'}
                              {t === 'identity_document' && 'ID Document'}
                              {t === 'payslip' && 'Payslip'}
                              {t === 'cash_statement' && 'Cash Statement'}
                              {idx < sub.documentTypes.length - 1 && ' · '}
                            </span>
                          ))}
                        </div>
                        <div className="text-[11px] text-[#697386]">
                          {sub.documents.length} file(s) attached
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {sub.status === 'completed' && (
                          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Completed</span>
                          </div>
                        )}
                        {sub.status === 'needs_review' && (
                          <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Needs review</span>
                          </div>
                        )}
                        {sub.status === 'processing' && (
                          <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing</span>
                          </div>
                        )}
                      </td>

                      {/* Review Flags */}
                      <td className="py-3.5 px-4 text-center">
                        {sub.reviewFieldsCount > 0 ? (
                          <span className="font-semibold text-amber-700 tabular-nums">
                            {sub.reviewFieldsCount} field{sub.reviewFieldsCount > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-medium">0 flags (100%)</span>
                        )}
                      </td>

                      {/* CSV & Drive */}
                      <td className="py-3.5 px-4">
                        <div className="text-[11px]">
                          <span className="text-slate-700">CSV: </span>
                          <span className={sub.csvExported ? "text-emerald-700 font-medium" : "text-slate-600 font-medium"}>
                            {sub.csvExported ? "Exported" : "Ready"}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#697386]">
                          {sub.googleDriveSynced ? "Drive synced" : "Pending sync"}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectSubmissionForReview(sub.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#5146E5] hover:bg-indigo-50 rounded-md transition-colors cursor-pointer"
                          >
                            Review
                          </button>
                          
                          <button
                            onClick={() => onNavigateToExport(sub.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
                            <span>CSV</span>
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Link to All Submissions */}
        <div className="p-3 bg-[#F7F8FC]/50 border-t border-[#E7EAF1] flex items-center justify-between text-xs text-[#697386]">
          <span>Showing {filteredSubmissions.length} of {totalCount} total submissions</span>
          <button
            onClick={onViewAllSubmissions}
            className="font-semibold text-[#5146E5] hover:underline cursor-pointer"
          >
            View full history & audit trails →
          </button>
        </div>

      </div>

    </div>
  );
};
