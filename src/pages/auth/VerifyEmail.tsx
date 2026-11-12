import React, { useState } from 'react';
import { MailCheck, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';
import { useAuth } from '../../services/store/authContext';

interface VerifyEmailProps {
  onNavigate: (path: string) => void;
}

export const VerifyEmail: React.FC<VerifyEmailProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState(false);

  const handleResend = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResendNotice(true);
    }, 700);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-3xl p-8 shadow-sm space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#3978D5] flex items-center justify-center mx-auto border border-blue-100 dark:border-blue-900/60">
          <MailCheck className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            Verify Your Academic Email
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            We sent a verification link to <span className="font-semibold text-slate-900 dark:text-white">{user?.email ?? 'your email address'}</span>. Please confirm your academic account to unlock full document quotas.
          </p>
        </div>

        {resendNotice && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>New verification email dispatched.</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            onClick={() => onNavigate('/onboarding/role')}
            className="w-full py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            className="w-full py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            <span>Resend Verification Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
