import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  X, 
  Check, 
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (user: any, token: string) => void;
  onClose: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState('admin@nexura.bd');
  const [password, setPassword] = useState('803zPL6ZUh7NWK5');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLoginSuccess(data.user, data.token);
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[92dvh] overflow-y-auto shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close login modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="bg-[#10183F] text-white p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="w-14 h-14 bg-[#F10D27] text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-900/40">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
            NEXURA<span className="text-[#F10D27]">.BD</span>
          </h2>
          <p className="text-xs text-slate-300 font-semibold tracking-wider uppercase mt-1">
            Store Administration Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nexura.bd"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 focus:border-[#F10D27]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#10183F] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-[#F10D27] hover:underline font-semibold cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#F10D27]/20 focus:border-[#F10D27]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F10D27] hover:bg-[#d60a20] active:scale-98 text-white font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-600/20 transition-all cursor-pointer"
            >
              <span>{isLoading ? 'Verifying Credentials...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Box */}
          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 text-center">
              Quick Role Sign-In Credentials
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickFill('admin@nexura.bd', '803zPL6ZUh7NWK5')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-[#F10D27] border border-slate-200 text-center transition-colors font-semibold"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('manager@nexura.bd', 'Manager@Nexura2026')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-[#F10D27] border border-slate-200 text-center transition-colors font-semibold"
              >
                Store Manager
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('staff@nexura.bd', 'Staff@Nexura2026')}
                className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-[#F10D27] border border-slate-200 text-center transition-colors font-semibold"
              >
                Order Staff
              </button>
            </div>
          </div>
        </div>

        {/* Forgot Password Flow */}
        {showForgotModal && (
          <div className="absolute inset-0 bg-white p-6 sm:p-8 flex flex-col justify-between z-20 animate-in fade-in">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2 text-[#10183F] font-bold text-base">
                  <KeyRound className="w-5 h-5 text-[#F10D27]" />
                  <span>Admin Password Recovery</span>
                </div>
                <button onClick={() => setShowForgotModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {forgotSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Recovery Link Sent</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    If this administrator email exists in our records, a secure reset token has been dispatched.
                  </p>
                  <button
                    onClick={() => {
                      setForgotSubmitted(false);
                      setShowForgotModal(false);
                    }}
                    className="mt-4 px-4 py-2 bg-[#10183F] text-white text-xs font-bold rounded-xl"
                  >
                    Return to Login
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Enter your registered administrator email to receive secure recovery verification instructions.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Registered Email
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="admin@nexura.bd"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <button
                    onClick={() => setForgotSubmitted(true)}
                    className="w-full bg-[#10183F] hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl"
                  >
                    Send Recovery Instructions
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="text-xs text-slate-500 hover:text-slate-800 text-center block mt-4"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
