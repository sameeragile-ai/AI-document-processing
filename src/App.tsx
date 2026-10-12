import React, { useState, useEffect } from 'react';
import { Header, NavTab } from './components/common/Header';
import { DashboardView } from './features/dashboard/DashboardView';
import { NewSubmissionWizard } from './features/new-submission/NewSubmissionWizard';
import { DocumentReviewView } from './features/document-review/DocumentReviewView';
import { CsvExportView } from './features/csv-export/CsvExportView';
import { AccuracyBenchmarkView } from './features/accuracy-benchmark/AccuracyBenchmarkView';
import { SubmissionsListView } from './features/history/SubmissionsListView';
import { SettingsView } from './features/settings/SettingsView';
import { AuthModal } from './features/auth/AuthModal';
import { WelcomeHero } from './features/welcome/WelcomeHero';
import { DocumentType, MappingConfig, Submission, UserSession } from './types';
import { 
  getStoredSubmissions, 
  saveStoredSubmissions, 
  getStoredMappingConfig, 
  saveStoredMappingConfig, 
  getStoredSession, 
  saveStoredSession, 
  resetDemoData 
} from './services/storage';

export default function App() {
  // Application Data State
  const [submissions, setSubmissions] = useState<Submission[]>(getStoredSubmissions);
  const [mappingConfig, setMappingConfig] = useState<MappingConfig>(getStoredMappingConfig);
  const [user, setUser] = useState<UserSession>(getStoredSession);

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string>('SUB-2026-8941');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardPresetType, setWizardPresetType] = useState<DocumentType>('bank_statement');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [showWelcomeHero, setShowWelcomeHero] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveStoredSubmissions(submissions);
  }, [submissions]);

  useEffect(() => {
    saveStoredMappingConfig(mappingConfig);
  }, [mappingConfig]);

  useEffect(() => {
    saveStoredSession(user);
  }, [user]);

  // Derived selected submission
  const activeSubmission = submissions.find((s) => s.id === selectedSubmissionId) || submissions[0];

  // Global review badge count
  const reviewCount = submissions.filter((s) => s.status === 'needs_review').length;

  // Handlers
  const handleStartNewSubmission = (presetType?: DocumentType) => {
    if (presetType) {
      setWizardPresetType(presetType);
    }
    setWizardOpen(true);
  };

  const handleCompleteNewSubmission = (newSub: Submission) => {
    setSubmissions((prev) => [newSub, ...prev]);
    setSelectedSubmissionId(newSub.id);
  };

  const handleUpdateSubmission = (updated: Submission) => {
    setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleSelectSubmissionForReview = (subId: string) => {
    setSelectedSubmissionId(subId);
    setWizardOpen(false);
    setCurrentTab('review');
  };

  const handleNavigateToExport = (subId: string) => {
    setSelectedSubmissionId(subId);
    setWizardOpen(false);
    setCurrentTab('export');
  };

  const handleResetDemo = () => {
    resetDemoData();
    setSubmissions(getStoredSubmissions());
    setMappingConfig(getStoredMappingConfig());
    setUser(getStoredSession());
    setSelectedSubmissionId('SUB-2026-8941');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex flex-col font-sans text-[#172033]">
      
      {/* Primary Top Bar (Strict 3-Zone Contract) */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setWizardOpen(false);
          setShowWelcomeHero(false);
          setCurrentTab(tab);
        }}
        onNewSubmission={() => handleStartNewSubmission()}
        user={user}
        onLogout={() => setAuthModalOpen(true)}
        reviewCount={reviewCount}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Toggleable Welcome Hero Section if requested */}
        {showWelcomeHero && (
          <WelcomeHero
            onGetStarted={() => {
              setShowWelcomeHero(false);
              handleStartNewSubmission();
            }}
            onOpenDemo={() => {
              setShowWelcomeHero(false);
              setCurrentTab('benchmark');
            }}
          />
        )}

        {/* Wizard View */}
        {wizardOpen ? (
          <NewSubmissionWizard
            initialDocType={wizardPresetType}
            onCancel={() => setWizardOpen(false)}
            onComplete={handleCompleteNewSubmission}
            onGoToReview={(subId) => handleSelectSubmissionForReview(subId)}
            onGoToExport={(subId) => handleNavigateToExport(subId)}
          />
        ) : (
          <>
            {/* 1. Dashboard View */}
            {currentTab === 'dashboard' && (
              <DashboardView
                submissions={submissions}
                onStartNewSubmission={handleStartNewSubmission}
                onSelectSubmissionForReview={handleSelectSubmissionForReview}
                onNavigateToExport={handleNavigateToExport}
                onViewAllSubmissions={() => setCurrentTab('submissions')}
              />
            )}

            {/* 2. Submissions History View */}
            {currentTab === 'submissions' && (
              <SubmissionsListView
                submissions={submissions}
                onSelectSubmissionForReview={handleSelectSubmissionForReview}
                onNavigateToExport={handleNavigateToExport}
              />
            )}

            {/* 3. Document Review Workspace (The 95% Accuracy Screen) */}
            {currentTab === 'review' && activeSubmission && (
              <DocumentReviewView
                submission={activeSubmission}
                onUpdateSubmission={handleUpdateSubmission}
                onGoToExport={handleNavigateToExport}
                onBackToDashboard={() => setCurrentTab('dashboard')}
              />
            )}

            {/* 4. CSV Export & Custom Schema Mapping View */}
            {currentTab === 'export' && activeSubmission && (
              <CsvExportView
                submission={activeSubmission}
                allSubmissions={submissions}
                mappingConfig={mappingConfig}
                onUpdateMappingConfig={setMappingConfig}
                onSelectSubmission={(subId) => setSelectedSubmissionId(subId)}
              />
            )}

            {/* 5. 20-Document QA Benchmark SLA View */}
            {currentTab === 'benchmark' && (
              <AccuracyBenchmarkView />
            )}

            {/* 6. Settings & Vercel / Next.js Deployment Center */}
            {currentTab === 'settings' && (
              <SettingsView
                user={user}
                onUpdateUser={setUser}
                onResetDemo={handleResetDemo}
              />
            )}
          </>
        )}

      </main>

      {/* Clean Minimalist Footer */}
      <footer className="mt-auto border-t border-[#E7EAF1] bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#697386]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#172033]">LedgerFlow</span>
            <span>·</span>
            <span>Your documents, accurately processed.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setShowWelcomeHero(!showWelcomeHero)}
              className="hover:text-[#172033] transition-colors cursor-pointer"
            >
              Product Overview
            </button>
            <button
              onClick={() => setCurrentTab('benchmark')}
              className="hover:text-[#172033] transition-colors cursor-pointer"
            >
              20-Doc QA SLA
            </button>
            <button
              onClick={() => setCurrentTab('settings')}
              className="hover:text-[#172033] transition-colors cursor-pointer"
            >
              Vercel Deployment
            </button>
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hover:text-[#172033] transition-colors cursor-pointer"
            >
              Security & Auth
            </button>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(newUser) => setUser(newUser)}
      />

    </div>
  );
}
