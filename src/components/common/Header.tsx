import React from 'react';
import { ShieldCheck, Plus, CheckCircle2, User, Database, ArrowUpRight } from 'lucide-react';
import { UserSession } from '../../types';

export type NavTab = 
  | 'dashboard' 
  | 'submissions' 
  | 'review' 
  | 'export' 
  | 'benchmark' 
  | 'settings';

interface HeaderProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onNewSubmission: () => void;
  user: UserSession;
  onLogout: () => void;
  reviewCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onNewSubmission,
  user,
  reviewCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E7EAF1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant 3-Zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-8 h-16">
          
          {/* Zone 1: Brand Wordmark (Single text element, no pill badges) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5146E5] rounded-md"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#5146E5] to-[#7C6CF5] flex items-center justify-center text-white shadow-xs">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight text-[#172033] whitespace-nowrap">
                LedgerFlow
              </span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 ml-2 pl-3 border-l border-[#E7EAF1] text-xs text-[#697386]">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span>Encrypted Vercel/Node API</span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Clean single-line typography with hover underlines) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#697386] overflow-x-auto py-1">
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`whitespace-nowrap transition-colors py-1 ${
                currentTab === 'dashboard'
                  ? 'text-[#172033] font-semibold border-b-2 border-[#5146E5]'
                  : 'hover:text-[#172033]'
              }`}
            >
              Dashboard
            </button>

            <button
              onClick={() => onSelectTab('submissions')}
              className={`whitespace-nowrap transition-colors py-1 ${
                currentTab === 'submissions'
                  ? 'text-[#172033] font-semibold border-b-2 border-[#5146E5]'
                  : 'hover:text-[#172033]'
              }`}
            >
              Submissions
            </button>

            <button
              onClick={() => onSelectTab('review')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'review'
                  ? 'text-[#172033] font-semibold border-b-2 border-[#5146E5]'
                  : 'hover:text-[#172033]'
              }`}
            >
              <span>Review Workspace</span>
              {reviewCount > 0 && (
                <span className="text-xs px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium tabular-nums">
                  {reviewCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('export')}
              className={`whitespace-nowrap transition-colors py-1 ${
                currentTab === 'export'
                  ? 'text-[#172033] font-semibold border-b-2 border-[#5146E5]'
                  : 'hover:text-[#172033]'
              }`}
            >
              CSV Export & Schema
            </button>

            <button
              onClick={() => onSelectTab('benchmark')}
              className={`whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 ${
                currentTab === 'benchmark'
                  ? 'text-[#172033] font-semibold border-b-2 border-[#5146E5]'
                  : 'hover:text-[#172033]'
              }`}
            >
              <span>20-Doc QA Benchmark</span>
              <span className="text-[11px] text-emerald-700 font-semibold tabular-nums">97.2%</span>
            </button>

            <button
              onClick={() => onSelectTab('settings')}
              className={`whitespace-nowrap transition-colors py-1 ${
                currentTab === 'settings'
                  ? 'text-[#172033] font-semibold border-b-2 border-[#5146E5]'
                  : 'hover:text-[#172033]'
              }`}
            >
              Settings & Deployment
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNewSubmission}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#5146E5] to-[#7C6CF5] hover:opacity-95 rounded-lg shadow-xs transition-all whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#5146E5]/40"
            >
              <Plus className="w-4 h-4" />
              <span>New submission</span>
            </button>

            <button
              onClick={() => onSelectTab('settings')}
              title={`Logged in as ${user.fullName} (${user.organization})`}
              className="p-1.5 rounded-lg text-[#697386] hover:text-[#172033] hover:bg-slate-100 transition-colors focus:outline-none"
            >
              <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs">
                {user.fullName.split(' ').map((n) => n[0]).join('')}
              </div>
            </button>
          </div>

        </div>

        {/* Mobile secondary navigation bar */}
        <div className="md:hidden flex items-center gap-4 overflow-x-auto py-2.5 border-t border-[#E7EAF1] text-xs font-medium text-[#697386]">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`whitespace-nowrap ${currentTab === 'dashboard' ? 'text-[#5146E5] font-semibold' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('submissions')}
            className={`whitespace-nowrap ${currentTab === 'submissions' ? 'text-[#5146E5] font-semibold' : ''}`}
          >
            Submissions
          </button>
          <button
            onClick={() => onSelectTab('review')}
            className={`whitespace-nowrap flex items-center gap-1 ${currentTab === 'review' ? 'text-[#5146E5] font-semibold' : ''}`}
          >
            Review ({reviewCount})
          </button>
          <button
            onClick={() => onSelectTab('export')}
            className={`whitespace-nowrap ${currentTab === 'export' ? 'text-[#5146E5] font-semibold' : ''}`}
          >
            CSV Export
          </button>
          <button
            onClick={() => onSelectTab('benchmark')}
            className={`whitespace-nowrap ${currentTab === 'benchmark' ? 'text-[#5146E5] font-semibold' : ''}`}
          >
            QA Benchmark
          </button>
          <button
            onClick={() => onSelectTab('settings')}
            className={`whitespace-nowrap ${currentTab === 'settings' ? 'text-[#5146E5] font-semibold' : ''}`}
          >
            Deploy / Settings
          </button>
        </div>
      </div>
    </header>
  );
};
