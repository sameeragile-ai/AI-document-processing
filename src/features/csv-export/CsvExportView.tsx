import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Settings2, 
  CheckCircle2, 
  AlertCircle, 
  FolderCheck, 
  ArrowRight, 
  Copy, 
  Check, 
  Eye, 
  ShieldCheck, 
  RefreshCw,
  Plus,
  Trash2
} from 'lucide-react';
import { MappingConfig, Submission } from '../../types';
import { 
  downloadCsvFile, 
  formatDateForCsv, 
  generateCsvContent, 
  validateCsvRows, 
  CsvValidationIssue 
} from '../../services/csvExport';

interface CsvExportViewProps {
  submission: Submission;
  allSubmissions: Submission[];
  mappingConfig: MappingConfig;
  onUpdateMappingConfig: (newConfig: MappingConfig) => void;
  onSelectSubmission: (submissionId: string) => void;
}

export const CsvExportView: React.FC<CsvExportViewProps> = ({
  submission,
  allSubmissions,
  mappingConfig,
  onUpdateMappingConfig,
  onSelectSubmission,
}) => {
  const [config, setConfig] = useState<MappingConfig>(mappingConfig);
  const [copiedPreview, setCopiedPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportCompleteNotification, setExportCompleteNotification] = useState(false);

  // Validation
  const validationResult = validateCsvRows(submission, config);
  const csvContent = generateCsvContent(submission, config);

  const handleDownload = () => {
    setIsExporting(true);
    setTimeout(() => {
      const fileName = `LedgerFlow_${submission.id}_${config.targetSystem.replace(/[\s/]/g, '_')}.csv`;
      downloadCsvFile(csvContent, fileName);
      setIsExporting(false);
      setExportCompleteNotification(true);
      setTimeout(() => setExportCompleteNotification(false), 4000);
    }, 400);
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(csvContent);
    setCopiedPreview(true);
    setTimeout(() => setCopiedPreview(false), 2500);
  };

  // Update target column name
  const updateColumnTarget = (id: string, newTarget: string) => {
    const updated = {
      ...config,
      mappings: config.mappings.map((m) => (m.id === id ? { ...m, targetColumnName: newTarget } : m)),
    };
    setConfig(updated);
    onUpdateMappingConfig(updated);
  };

  // Preset selector
  const applyPreset = (preset: MappingConfig['targetSystem']) => {
    let newMappings = [...config.mappings];
    let newDateFormat: MappingConfig['dateFormat'] = 'YYYY-MM-DD';

    if (preset === 'Sage 50/Cloud') {
      newDateFormat = 'DD/MM/YYYY';
      newMappings = [
        { id: 'm1', sourceKey: 'date', sourceLabel: 'Transaction Date', targetColumnName: 'TRANS_DATE', isRequired: true, dataType: 'date', sampleValue: '15/03/2026' },
        { id: 'm2', sourceKey: 'description', sourceLabel: 'Narrative / Description', targetColumnName: 'DETAILS', isRequired: true, dataType: 'string', sampleValue: 'AWS Cloud Hosting' },
        { id: 'm3', sourceKey: 'reference', sourceLabel: 'Reference / Cheque No.', targetColumnName: 'REF', isRequired: false, dataType: 'string', sampleValue: 'INV-98234' },
        { id: 'm4', sourceKey: 'debit', sourceLabel: 'Outflow (Debit)', targetColumnName: 'NET_AMOUNT', isRequired: false, dataType: 'currency', sampleValue: '1420.50' },
        { id: 'm5', sourceKey: 'credit', sourceLabel: 'Inflow (Credit)', targetColumnName: 'TAX_AMOUNT', isRequired: false, dataType: 'currency', sampleValue: '0.00' },
        { id: 'm6', sourceKey: 'balance', sourceLabel: 'Running Balance', targetColumnName: 'POST_BALANCE', isRequired: true, dataType: 'currency', sampleValue: '48950.25' },
      ];
    } else if (preset === 'Xero Accounting') {
      newDateFormat = 'DD/MM/YYYY';
      newMappings = [
        { id: 'm1', sourceKey: 'date', sourceLabel: 'Transaction Date', targetColumnName: '*Date', isRequired: true, dataType: 'date', sampleValue: '15/03/2026' },
        { id: 'm2', sourceKey: 'debit', sourceLabel: 'Outflow (Debit)', targetColumnName: '*Amount', isRequired: true, dataType: 'currency', sampleValue: '-1420.50' },
        { id: 'm3', sourceKey: 'description', sourceLabel: 'Narrative / Description', targetColumnName: 'Payee', isRequired: true, dataType: 'string', sampleValue: 'AWS EMEA' },
        { id: 'm4', sourceKey: 'description', sourceLabel: 'Description', targetColumnName: 'Description', isRequired: false, dataType: 'string', sampleValue: 'Hosting Subscription' },
        { id: 'm5', sourceKey: 'reference', sourceLabel: 'Reference', targetColumnName: 'Reference', isRequired: false, dataType: 'string', sampleValue: 'INV-98234' },
        { id: 'm6', sourceKey: 'balance', sourceLabel: 'Running Balance', targetColumnName: 'Balance', isRequired: false, dataType: 'currency', sampleValue: '48950.25' },
      ];
    } else if (preset === 'QuickBooks Online') {
      newDateFormat = 'MM/DD/YYYY';
      newMappings = [
        { id: 'm1', sourceKey: 'date', sourceLabel: 'Transaction Date', targetColumnName: 'Date', isRequired: true, dataType: 'date', sampleValue: '03/15/2026' },
        { id: 'm2', sourceKey: 'description', sourceLabel: 'Narrative / Description', targetColumnName: 'Description', isRequired: true, dataType: 'string', sampleValue: 'AWS Cloud Hosting' },
        { id: 'm3', sourceKey: 'credit', sourceLabel: 'Inflow (Credit)', targetColumnName: 'Received', isRequired: false, dataType: 'currency', sampleValue: '0.00' },
        { id: 'm4', sourceKey: 'debit', sourceLabel: 'Outflow (Debit)', targetColumnName: 'Spent', isRequired: false, dataType: 'currency', sampleValue: '1420.50' },
        { id: 'm5', sourceKey: 'balance', sourceLabel: 'Running Balance', targetColumnName: 'Balance', isRequired: true, dataType: 'currency', sampleValue: '48950.25' },
      ];
    }

    const updated: MappingConfig = {
      ...config,
      targetSystem: preset,
      dateFormat: newDateFormat,
      mappings: newMappings,
    };
    setConfig(updated);
    onUpdateMappingConfig(updated);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Export Header */}
      <div className="bg-white rounded-xl border border-[#E7EAF1] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-[#5146E5]">Custom CSV Synthesis & ERP Mapping</div>
          <h1 className="text-lg font-bold text-[#172033] mt-0.5">
            Export Verified Financial Ledger: {submission.id}
          </h1>
          <p className="text-xs text-[#697386] mt-0.5">
            Configure column mappings for Sage, Xero, QuickBooks, or custom consulting schemas.
          </p>
        </div>

        {/* Selected Submission Switcher */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-[#697386]">Submission:</label>
          <select
            value={submission.id}
            onChange={(e) => onSelectSubmission(e.target.value)}
            className="text-xs font-semibold text-[#172033] bg-slate-50 border border-[#E7EAF1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#5146E5]"
          >
            {allSubmissions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id} - {s.clientName} ({s.transactions.length} rows)
              </option>
            ))}
          </select>
        </div>
      </div>

      {exportCompleteNotification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold">CSV File Downloaded & Successfully Synced</div>
              <div className="text-[11px] text-emerald-700">
                Generated with UTF-8 BOM encoding for seamless Microsoft Excel & ERP opening. Encrypted copy staged to Google Drive.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Left Column Settings & Mapping (4 cols), Right Preview (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Target Configuration & Schema Mapping */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-xl border border-[#E7EAF1] p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF1]">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-[#5146E5]" />
                <h3 className="text-xs font-semibold text-[#172033]">Target Accounting Preset</h3>
              </div>
            </div>

            {/* Target ERP Preset Buttons */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['Custom Consulting Ledger', 'Sage 50/Cloud', 'Xero Accounting', 'QuickBooks Online'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => applyPreset(preset)}
                  className={`p-2.5 rounded-lg border text-left font-medium transition-all cursor-pointer ${
                    config.targetSystem === preset
                      ? 'border-[#5146E5] bg-indigo-50/50 text-[#5146E5] font-semibold'
                      : 'border-[#E7EAF1] text-[#697386] hover:border-slate-300'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Format Rules */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
              <div>
                <label className="text-[11px] text-[#697386] block mb-1">Date Format</label>
                <select
                  value={config.dateFormat}
                  onChange={(e) => {
                    const updated = { ...config, dateFormat: e.target.value as any };
                    setConfig(updated);
                    onUpdateMappingConfig(updated);
                  }}
                  className="w-full bg-slate-50 border border-[#E7EAF1] rounded-md px-2 py-1.5 text-xs text-[#172033]"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY (UK/EU)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#697386] block mb-1">Delimiter</label>
                <select
                  value={config.delimiter}
                  onChange={(e) => {
                    const updated = { ...config, delimiter: e.target.value as any };
                    setConfig(updated);
                    onUpdateMappingConfig(updated);
                  }}
                  className="w-full bg-slate-50 border border-[#E7EAF1] rounded-md px-2 py-1.5 text-xs text-[#172033]"
                >
                  <option value=",">Comma (,)</option>
                  <option value=";">Semicolon (;)</option>
                  <option value="	">Tab (\t)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configurable Column Mapping List */}
          <div className="bg-white rounded-xl border border-[#E7EAF1] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-semibold text-[#172033]">
              Column Header Mapping ({config.mappings.length} columns)
            </h3>
            <p className="text-[11px] text-[#697386]">
              Customize destination column names to match your accounting software's CSV template.
            </p>

            <div className="space-y-2 max-h-[340px] overflow-y-auto pt-1">
              {config.mappings.map((m) => (
                <div key={m.id} className="p-2.5 rounded-lg border border-[#E7EAF1] bg-slate-50/50 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#172033]">{m.sourceLabel}</span>
                    <span className="text-[10px] text-[#697386] uppercase font-mono">{m.dataType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#697386] shrink-0">Maps to:</span>
                    <input
                      type="text"
                      value={m.targetColumnName}
                      onChange={(e) => updateColumnTarget(m.id, e.target.value)}
                      className="bg-white border border-[#E7EAF1] rounded px-2 py-1 text-xs font-mono text-[#172033] w-full focus:ring-1 focus:ring-[#5146E5]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Google Drive Status */}
          <div className="bg-white rounded-xl border border-[#E7EAF1] p-4 shadow-xs text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[#172033]">
              <FolderCheck className="w-4 h-4 text-[#5146E5]" />
              <span>Google Drive Auto-Archive</span>
            </div>
            <p className="text-[11px] text-[#697386]">
              Files generated are saved directly to your client folder:
            </p>
            <div className="p-2 bg-slate-50 border border-[#E7EAF1] rounded text-[11px] font-mono text-slate-700 truncate">
              {submission.googleDrivePath}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Drive Service Account Authenticated</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Real Data Preview & One-Click Download */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white rounded-xl border border-[#E7EAF1] shadow-xs overflow-hidden">
            
            {/* Table Header & Download Action */}
            <div className="p-4 sm:p-5 border-b border-[#E7EAF1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[#172033]">
                  Export Preview ({submission.transactions.length} rows)
                </h2>
                <div className="text-[11px] text-[#697386] mt-0.5">
                  Preset: {config.targetSystem} · Delimiter: {config.delimiter === ',' ? 'Comma' : config.delimiter}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyClipboard}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#E7EAF1] hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedPreview ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPreview ? 'Copied' : 'Copy CSV'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  disabled={isExporting}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#5146E5] to-[#7C6CF5] hover:opacity-95 rounded-lg shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isExporting ? 'Generating...' : 'Download CSV File'}</span>
                </button>
              </div>
            </div>

            {/* Validation Alert */}
            {!validationResult.isValid ? (
              <div className="p-3 bg-red-50 border-b border-red-200 text-red-800 text-xs">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>CSV Schema Validation Warnings:</span>
                </div>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                  {validationResult.issues.map((issue, idx) => (
                    <li key={idx}>{issue.message}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50/70 border-b border-emerald-100 text-emerald-800 text-xs flex items-center gap-1.5 px-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>All {config.mappings.length} column schemas and date formats verified for export.</span>
              </div>
            )}

            {/* Formatted Data Table Preview */}
            <div className="overflow-x-auto max-h-[440px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E7EAF1] bg-[#F7F8FC] text-[#172033] font-semibold">
                    {config.mappings.map((m) => (
                      <th key={m.id} className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
                        {m.targetColumnName}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EAF1] font-mono text-xs">
                  {submission.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      {config.mappings.map((m) => {
                        let display = '';
                        if (m.sourceKey === 'date') display = formatDateForCsv(tx.date, config.dateFormat);
                        else if (m.sourceKey === 'description') display = tx.description;
                        else if (m.sourceKey === 'reference') display = tx.reference || '-';
                        else if (m.sourceKey === 'debit') display = tx.debit ? tx.debit.toFixed(2) : '-';
                        else if (m.sourceKey === 'credit') display = tx.credit ? tx.credit.toFixed(2) : '-';
                        else if (m.sourceKey === 'balance') display = tx.balance.toFixed(2);

                        return (
                          <td 
                            key={m.id} 
                            className={`py-2 px-3 whitespace-nowrap ${
                              m.sourceKey === 'debit' && tx.debit ? 'text-red-600 font-semibold text-right' :
                              m.sourceKey === 'credit' && tx.credit ? 'text-emerald-700 font-semibold text-right' :
                              m.sourceKey === 'balance' ? 'font-bold text-right text-[#172033]' : 'text-slate-800'
                            }`}
                          >
                            {display}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Raw Text Output Accordion / Preview */}
            <div className="p-3 bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-36">
              <div className="text-slate-500 mb-1 text-[10px] uppercase">Raw Output Stream (UTF-8 BOM Encoded):</div>
              <pre className="whitespace-pre">{csvContent.slice(0, 500)}...</pre>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
