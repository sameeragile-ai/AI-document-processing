import React from 'react';
import { ArrowRight, ShieldCheck, FileCheck, Lock, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface WelcomeHeroProps {
  onGetStarted: () => void;
  onOpenDemo: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  onGetStarted,
  onOpenDemo,
}) => {
  return (
    <div className="py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Split Hero (following Anti-Slop 2-column guidelines) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column (7 cols): Typography, Proposition, Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-[#5146E5] text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>SOC2 Type II & GDPR Structured Financial Processing</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#172033] leading-tight">
                Your documents, accurately processed.
              </h1>
              <p className="text-base sm:text-lg text-[#697386] leading-relaxed max-w-xl">
                LedgerFlow converts bank statements, identity cards, payslips, and petty cash ledgers into 
                consulting-grade structured CSV files. Built with deterministic OCR, AI entity extraction, and automated mathematical balance checks.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#5146E5] to-[#7C6CF5] hover:opacity-95 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Launch Consulting Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenDemo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 bg-white border border-[#E7EAF1] hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              >
                <span>Explore 20-Doc QA Benchmark</span>
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-[#E7EAF1] grid grid-cols-3 gap-4 text-xs text-[#697386]">
              <div>
                <span className="font-bold text-[#172033] block text-sm tabular-nums">&gt; 97.2%</span>
                <span>Field-level accuracy</span>
              </div>
              <div>
                <span className="font-bold text-[#172033] block text-sm tabular-nums">&lt; 20s</span>
                <span>Average turnaround</span>
              </div>
              <div>
                <span className="font-bold text-[#172033] block text-sm">Sage & Xero</span>
                <span>Native CSV compatibility</span>
              </div>
            </div>

          </div>

          {/* Right Column (5 cols): High-Fidelity Generated Visual */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl border border-[#E7EAF1] bg-white p-2.5 shadow-xl overflow-hidden">
              <img
                src="/src/assets/images/ledger_flow_hero_1791827370911.jpg"
                alt="LedgerFlow Financial Document Architecture"
                className="w-full h-auto rounded-xl object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Subtle floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm border border-[#E7EAF1] rounded-xl p-3 shadow-lg flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                ✓
              </div>
              <div>
                <div className="font-bold text-[#172033]">Balance Reconciled</div>
                <div className="text-[#697386] text-[11px]">Opening + Credits - Debits = Closing</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
