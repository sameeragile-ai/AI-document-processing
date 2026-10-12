import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileSpreadsheet, 
  Download, 
  History, 
  FileText, 
  X,
  ExternalLink,
  ShieldCheck,
  Building2,
  FolderCheck
} from 'lucide-react';
import { Submission, SubmissionStatus } from '../../types';
import { downloadCsvFile, generateCsvContent } from '../../services/csvExport';
import { DEFAULT_MAPPING_CONFIG } from '../../services/storage';

interface SubmissionsListViewProps {
  submissions: Submission[];
  onSelectSubmissionForReview: (submissionId: string) => void;
  onNavigateToExport: (submissionId: string) => void;
}

export const SubmissionsListView: React.FC<SubmissionsListViewProps> = ({
  submissions,
  onSelectSubmissionForReview,
  onNavigateToExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | SubmissionStatus>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedAuditSubmission, setSelectedAuditSubmission] = useState<Submission | null>(null);

  const filtered = submissions
    .filter((s) => {
      const matchesSearch = 
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.documents.some((d) => d.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
    });

  const handleInstantDownload = (sub: Submission) => {
    const content = generateCsvContent(sub, DEFAULT_MAPPING_CONFIG);
    downloadCsvFile(content, `LedgerFlow_${sub.id}_QuickExport.csv`);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E7EAF1] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#172033]">Client Submission Ledger & Audit History</h1>
          <p className="text-xs text-[#697386] mt-0.5">
            Search submissions, audit SHA-256 cryptographic hashes, and download verified client CSV files.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortOrder((o) => (o === 'newest' ? 'oldest' : 'newest'))}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-[#E7EAF1] hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort: {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-xl border border-[#E7EAF1] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#697386] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, client name, or document filename..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-[#E7EAF1] rounded-lg text-[#172033]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#697386]">Status:</span>
          {(['all', 'needs_review', 'completed'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md font-medium capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-[#697386] hover:text-[#172033]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions List Table */}
      <div className="bg-white rounded-xl border border-[#E7EAF1] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E7EAF1] bg-[#F7F8FC] text-[#697386] font-medium">
                <th className="py-3 px-4 font-mono">Reference</th>
                <th className="py-3 px-4">Title & Client</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4">Files</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Flags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7EAF1]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#697386]">
                    No submission records found.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const dateStr = new Date(sub.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-[#172033]">
                        {sub.id}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#172033]">{sub.title}</div>
                        <div className="text-[11px] text-[#697386]">{sub.clientName} · Ref: {sub.clientReference}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {dateStr}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-[11px] text-slate-800">
                          {sub.documents.length} document(s)
                        </div>
                        <div className="text-[10px] text-[#697386] truncate max-w-[160px]">
                          {sub.documents.map((d) => d.name).join(', ')}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {sub.status === 'completed' && (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Completed</span>
                          </span>
                        )}
                        {sub.status === 'needs_review' && (
                          <span className="text-amber-700 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Needs review</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center font-mono">
                        {sub.reviewFieldsCount > 0 ? (
                          <span className="font-bold text-amber-700">{sub.reviewFieldsCount}</span>
                        ) : (
                          <span className="text-emerald-700">0</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedAuditSubmission(sub)}
                            className="px-2 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="View Audit Trail & Hashes"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onSelectSubmissionForReview(sub.id)}
                            className="px-2.5 py-1 text-xs font-semibold text-[#5146E5] hover:bg-indigo-50 rounded transition-colors cursor-pointer"
                          >
                            Review
                          </button>

                          <button
                            onClick={() => handleInstantDownload(sub)}
                            className="px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                            title="Quick CSV Download"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-600" />
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
      </div>

      {/* Audit Log Modal / Drawer */}
      {selectedAuditSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#E7EAF1] max-w-xl w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF1]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#5146E5]" />
                <h3 className="text-sm font-bold text-[#172033]">
                  Cryptographic Audit Trail: {selectedAuditSubmission.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAuditSubmission(null)}
                className="text-[#697386] hover:text-[#172033] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-[#E7EAF1]">
                <div className="font-semibold text-[#172033]">Documents & Checksums:</div>
                <div className="mt-1 space-y-1 font-mono text-[11px] text-slate-600">
                  {selectedAuditSubmission.documents.map((d) => (
                    <div key={d.id} className="truncate">
                      <strong>{d.name}</strong>: {d.sha256Hash}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="font-semibold text-[#172033]">Event Timeline:</h4>
                {selectedAuditSubmission.auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-lg border border-[#E7EAF1] text-xs">
                    <div className="flex justify-between items-center text-[#697386] text-[11px]">
                      <span className="font-semibold text-[#172033]">{log.action}</span>
                      <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-[11px] text-[#697386] mt-0.5">Actor: {log.actor}</div>
                    <p className="mt-1 text-slate-800">{log.details}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E7EAF1] flex justify-end">
              <button
                onClick={() => setSelectedAuditSubmission(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
