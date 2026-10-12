import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2,
  X
} from 'lucide-react';
import { UserSession } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('sarah.jenkins@apexadvisory.com');
  const [password, setPassword] = useState('SecurePass2026!');
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [organization, setOrganization] = useState('Apex Advisory Partners');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid business email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setForgotSent(true);
      }, 600);
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        email,
        fullName: mode === 'signup' ? fullName : 'Sarah Jenkins',
        role: 'Senior Financial Consultant',
        organization: mode === 'signup' ? organization : 'Apex Advisory Partners',
        isAuthenticated: true,
        isDemoUser: false,
      });
      onClose();
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        email: 'sameer.agile@gmail.com',
        fullName: 'Sarah Jenkins',
        role: 'Senior Financial Consultant',
        organization: 'Apex Advisory Partners',
        isAuthenticated: true,
        isDemoUser: true,
      });
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#E7EAF1] max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-[#697386] hover:text-[#172033] p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5146E5] to-[#7C6CF5] flex items-center justify-center text-white mx-auto shadow-xs mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[#172033]">LedgerFlow</h2>
          <p className="text-xs text-[#697386] mt-1">Your documents, accurately processed.</p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
          <div className="text-left">
            <div className="text-xs font-semibold text-[#5146E5]">Fast Demo Access</div>
            <div className="text-[11px] text-[#697386]">Sign in directly as Senior Consultant</div>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#5146E5] hover:bg-[#4338CA] rounded-lg transition-colors cursor-pointer"
          >
            Quick Sign In
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-2.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium">
              {error}
            </div>
          )}

          {forgotSent ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-center space-y-1">
              <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600" />
              <div className="font-semibold">Reset instructions sent!</div>
              <div className="text-[11px]">Check {email} for password recovery instructions.</div>
            </div>
          ) : (
            <>
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="font-semibold text-[#172033] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#E7EAF1] rounded-lg focus:ring-1 focus:ring-[#5146E5] text-[#172033]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#172033] block mb-1">Consulting Firm / Company</label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-[#E7EAF1] rounded-lg focus:ring-1 focus:ring-[#5146E5] text-[#172033]"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="font-semibold text-[#172033] block mb-1">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#697386] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-[#E7EAF1] rounded-lg focus:ring-1 focus:ring-[#5146E5] text-[#172033]"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-[#172033]">Password</label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] text-[#5146E5] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#697386] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-[#E7EAF1] rounded-lg focus:ring-1 focus:ring-[#5146E5] text-[#172033]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697386] hover:text-[#172033]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 text-xs font-semibold text-white bg-gradient-to-r from-[#5146E5] to-[#7C6CF5] hover:opacity-95 rounded-lg shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <span>
                  {isLoading ? 'Authenticating...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Recovery Link'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Toggle Modes */}
          <div className="pt-2 text-center text-xs text-[#697386]">
            {mode === 'signin' ? (
              <div>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-[#5146E5] hover:underline"
                >
                  Create client account
                </button>
              </div>
            ) : (
              <div>
                Already have credentials?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setForgotSent(false); }}
                  className="font-semibold text-[#5146E5] hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Security Reassurance */}
        <div className="pt-2 border-t border-[#E7EAF1] flex items-center justify-center gap-1 text-[11px] text-[#697386]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted with TLS 1.3 & Argon2id Hash Nonce</span>
        </div>

      </div>
    </div>
  );
};
