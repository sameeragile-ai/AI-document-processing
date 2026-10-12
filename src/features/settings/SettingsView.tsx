import React, { useState } from 'react';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Trash2, 
  FolderCheck, 
  Server, 
  CheckCircle2, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Code2,
  FileCode,
  Terminal,
  Database
} from 'lucide-react';
import { UserSession } from '../../types';
import { getRetentionDays, saveRetentionDays, resetDemoData } from '../../services/storage';

interface SettingsViewProps {
  user: UserSession;
  onUpdateUser: (user: UserSession) => void;
  onResetDemo: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onResetDemo,
}) => {
  const [activeTab, setActiveTab] = useState<'security' | 'deployment' | 'drive' | 'retention'>('deployment');
  const [retentionDays, setRetentionDaysState] = useState(getRetentionDays());
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [copiedVercelCmd, setCopiedVercelCmd] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveRetention = (days: number) => {
    setRetentionDaysState(days);
    saveRetentionDays(days);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E7EAF1] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[#172033]">Settings, Security & Vercel / Next.js Deployment</h1>
          <p className="text-xs text-[#697386] mt-0.5">
            Configure client data retention, Google Drive service credentials, and view production Vercel & Next.js guides.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('deployment')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'deployment' ? 'bg-white text-[#172033] shadow-xs font-semibold' : 'text-[#697386] hover:text-[#172033]'
            }`}
          >
            Vercel & Next.js Deploy
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'security' ? 'bg-white text-[#172033] shadow-xs font-semibold' : 'text-[#697386] hover:text-[#172033]'
            }`}
          >
            Security Architecture
          </button>
          <button
            onClick={() => setActiveTab('drive')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'drive' ? 'bg-white text-[#172033] shadow-xs font-semibold' : 'text-[#697386] hover:text-[#172033]'
            }`}
          >
            Google Drive Vault
          </button>
          <button
            onClick={() => setActiveTab('retention')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'retention' ? 'bg-white text-[#172033] shadow-xs font-semibold' : 'text-[#697386] hover:text-[#172033]'
            }`}
          >
            Data Retention
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings successfully updated and applied.</span>
        </div>
      )}

      {/* TAB 1: VERCEL & NEXT.JS DEPLOYMENT CENTER */}
      {activeTab === 'deployment' && (
        <div className="space-y-5">
          
          <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF1]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
                  ▲
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#172033]">Vercel Zero-Config Deployment</h3>
                  <span className="text-xs text-[#697386]">Ready to deploy via Vercel CLI or GitHub Git Integration</span>
                </div>
              </div>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>vercel.json Configured</span>
              </span>
            </div>

            <p className="text-xs text-[#697386] leading-relaxed">
              LedgerFlow includes a pre-configured <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">vercel.json</code> file 
              at the project root with complete production headers, immutable asset caching, and SPA fallback rewrites.
            </p>

            {/* Vercel CLI One-Liner */}
            <div className="bg-slate-900 rounded-lg p-3 text-slate-200 font-mono text-xs flex items-center justify-between">
              <div>
                <span className="text-emerald-400">$</span> npx vercel --prod
              </div>
              <button
                onClick={() => copyToClipboard('npx vercel --prod', setCopiedVercelCmd)}
                className="text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 text-[11px] flex items-center gap-1 cursor-pointer"
              >
                {copiedVercelCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedVercelCmd ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Next.js 15 Compatibility & Architecture Mapping */}
          <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#E7EAF1]">
              <Code2 className="w-5 h-5 text-[#5146E5]" />
              <h3 className="text-sm font-bold text-[#172033]">Next.js 15 Framework Standards Mapping</h3>
            </div>

            <p className="text-xs text-[#697386] leading-relaxed">
              LedgerFlow is designed according to Next.js App Router conventions. All features are isolated into modular domain packages, 
              making it 100% compliant if you choose to mount it within a Next.js App Router codebase:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E7EAF1] bg-[#F7F8FC] text-[#697386]">
                    <th className="py-2 px-3">Current LedgerFlow Module</th>
                    <th className="py-2 px-3">Next.js 15 Target Route</th>
                    <th className="py-2 px-3">Execution Environment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7EAF1] font-mono text-xs">
                  <tr>
                    <td className="py-2 px-3 text-[#172033]">src/features/dashboard</td>
                    <td className="py-2 px-3 text-[#5146E5]">app/dashboard/page.tsx</td>
                    <td className="py-2 px-3 text-slate-600">Client / Server Component</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#172033]">src/features/document-review</td>
                    <td className="py-2 px-3 text-[#5146E5]">app/submissions/[id]/review/page.tsx</td>
                    <td className="py-2 px-3 text-slate-600">Client Component (Interactive)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#172033]">src/features/csv-export</td>
                    <td className="py-2 px-3 text-[#5146E5]">app/submissions/[id]/export/page.tsx</td>
                    <td className="py-2 px-3 text-slate-600">Client / Server Action</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#172033]">src/services/aiProcessing.ts</td>
                    <td className="py-2 px-3 text-[#5146E5]">app/api/submissions/process/route.ts</td>
                    <td className="py-2 px-3 text-slate-600">Node.js Runtime Route Handler</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-[#172033]">src/services/csvExport.ts</td>
                    <td className="py-2 px-3 text-[#5146E5]">app/api/submissions/[id]/csv/route.ts</td>
                    <td className="py-2 px-3 text-slate-600">Streaming Edge / Serverless Route</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Next.js Route Handler Sample */}
            <div className="pt-2">
              <div className="text-xs font-semibold text-[#172033] mb-1 flex items-center justify-between">
                <span>Sample Next.js Route Handler (<code className="font-mono text-[#5146E5]">app/api/submissions/route.ts</code>):</span>
                <button
                  onClick={() => copyToClipboard(`import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  // OCR & AI extraction logic
  return NextResponse.json({
    status: 'success',
    submissionId: 'SUB-2026-' + Date.now(),
    reconciled: true,
  });
}`, setCopiedEnv)}
                  className="text-xs text-[#5146E5] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedEnv ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Next.js Route Handler Code</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-slate-300 rounded-lg text-[11px] font-mono overflow-x-auto">
{`import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  
  // 1. Checksum validation (SHA-256)
  // 2. Google Document AI OCR parse
  // 3. Schema-constrained JSON extraction
  // 4. Staging to Google Drive via Service Account
  return NextResponse.json({
    status: 'success',
    submissionId: 'SUB-2026-' + Date.now(),
    reconciled: true,
  });
}`}
              </pre>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SECURITY ARCHITECTURE */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E7EAF1]">
            <ShieldCheck className="w-5 h-5 text-[#5146E5]" />
            <h3 className="text-sm font-bold text-[#172033]">Security Controls & Governance Checklist</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            <div className="p-3.5 rounded-lg border border-[#E7EAF1] bg-[#F7F8FC]">
              <div className="font-semibold text-[#172033] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>TLS 1.3 & AES-256 Encryption at Rest</span>
              </div>
              <p className="text-[11px] text-[#697386] mt-1 leading-relaxed">
                All network transit utilizes TLS 1.3. Stored database documents, tokens, and CSV artifacts are encrypted with AES-256.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-[#E7EAF1] bg-[#F7F8FC]">
              <div className="font-semibold text-[#172033] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Argon2id Password Hashing</span>
              </div>
              <p className="text-[11px] text-[#697386] mt-1 leading-relaxed">
                Passwords and internal session nonces are hashed with Argon2id using salt parameters resistant to GPU/ASIC attacks.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-[#E7EAF1] bg-[#F7F8FC]">
              <div className="font-semibold text-[#172033] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Multi-Tenant Client Isolation</span>
              </div>
              <p className="text-[11px] text-[#697386] mt-1 leading-relaxed">
                Submissions and Google Drive folders are strictly segregated by organization tenant ID to prevent cross-tenant data leaks.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-[#E7EAF1] bg-[#F7F8FC]">
              <div className="font-semibold text-[#172033] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Sanitized Audit Logging</span>
              </div>
              <p className="text-[11px] text-[#697386] mt-1 leading-relaxed">
                Audit logs record actor IDs, timestamps, and SHA-256 hashes, strictly excluding confidential tax IDs and raw account numbers.
              </p>
            </div>

          </div>

          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900">
            <strong>GDPR & Compliance Note:</strong> LedgerFlow's architectural controls support GDPR compliance, 
            including data minimization, automated purge schedules, and tenant encryption. Client-side enterprise contracts 
            must maintain corresponding Data Processing Agreements (DPAs) with Google Cloud and cloud hosting providers.
          </div>
        </div>
      )}

      {/* TAB 3: GOOGLE DRIVE VAULT */}
      {activeTab === 'drive' && (
        <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7EAF1]">
            <div className="flex items-center gap-2">
              <FolderCheck className="w-5 h-5 text-[#5146E5]" />
              <h3 className="text-sm font-bold text-[#172033]">Google Drive Service Account Vault</h3>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              Connected & Verified
            </span>
          </div>

          <p className="text-xs text-[#697386]">
            Configured to automatically synchronize uploaded documents and synthesized CSV files directly 
            to your consulting practice's authorized Google Shared Drive.
          </p>

          <div className="space-y-3 text-xs pt-1">
            <div className="p-3 bg-slate-50 border border-[#E7EAF1] rounded-lg">
              <label className="text-[11px] text-[#697386] block">Service Account Email (Least Privilege)</label>
              <div className="font-mono text-[#172033] font-semibold mt-0.5">
                ledgerflow-vault-sa@apex-advisory-prod.iam.gserviceaccount.com
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-[#E7EAF1] rounded-lg">
              <label className="text-[11px] text-[#697386] block">Root Organization Drive Folder ID</label>
              <div className="font-mono text-[#172033] font-semibold mt-0.5">
                0B8291048_Consulting_Client_Vaults_Prod
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DATA RETENTION */}
      {activeTab === 'retention' && (
        <div className="bg-white rounded-xl border border-[#E7EAF1] p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E7EAF1]">
            <Trash2 className="w-5 h-5 text-red-600" />
            <h3 className="text-sm font-bold text-[#172033]">Automated Ephemeral Data Retention Schedule</h3>
          </div>

          <p className="text-xs text-[#697386] leading-relaxed">
            In compliance with client privacy standards, raw document binaries stored in temporary memory staging 
            can be automatically scheduled for deletion once the CSV file is generated or after a defined retention window.
          </p>

          <div className="space-y-3 max-w-md text-xs">
            <label className="font-semibold text-[#172033] block">
              Auto-Purge Raw Files After: <span className="font-mono text-[#5146E5]">{retentionDays} days</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSaveRetention(7)}
                className={`px-3 py-1.5 rounded-lg border font-medium ${retentionDays === 7 ? 'bg-indigo-50 border-[#5146E5] text-[#5146E5] font-semibold' : 'border-[#E7EAF1]'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => handleSaveRetention(14)}
                className={`px-3 py-1.5 rounded-lg border font-medium ${retentionDays === 14 ? 'bg-indigo-50 border-[#5146E5] text-[#5146E5] font-semibold' : 'border-[#E7EAF1]'}`}
              >
                14 Days (Recommended)
              </button>
              <button
                onClick={() => handleSaveRetention(30)}
                className={`px-3 py-1.5 rounded-lg border font-medium ${retentionDays === 30 ? 'bg-indigo-50 border-[#5146E5] text-[#5146E5] font-semibold' : 'border-[#E7EAF1]'}`}
              >
                30 Days
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E7EAF1] flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-[#172033]">Reset Demo & Testing Datasets</div>
              <div className="text-[11px] text-[#697386]">Restore initial Barclays, Payslip, and Petty Cash mock datasets.</div>
            </div>
            <button
              onClick={() => {
                resetDemoData();
                onResetDemo();
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Reset Demo Records
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
