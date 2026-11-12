import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { Building2, Shield, Lock, CheckCircle2, Save } from 'lucide-react';

interface InstitutionSettingsProps {
  onNavigate: (path: string) => void;
}

export const InstitutionSettings: React.FC<InstitutionSettingsProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [campusName, setCampusName] = useState(user?.institutionName || 'Institut Polytechnique de Paris');
  const [enableCorpusSharing, setEnableCorpusSharing] = useState(true);
  const [enableSSO, setEnableSSO] = useState(true);
  const [retentionDays, setRetentionDays] = useState('730');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
          Institutional Governance & Tenant Configuration
        </h1>
        <p className="text-xs text-slate-500">
          Configure campus branding, internal dissertation repository sharing, and SAML SSO integration.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
          <span>Institutional configurations updated.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Accredited University / Campus Name
            </label>
            <input
              type="text"
              value={campusName}
              onChange={(e) => setCampusName(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Tenant Identifier (System Immutable)
            </label>
            <input
              type="text"
              disabled
              value="inst-polytechnique-01"
              className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 font-mono"
            />
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Campus Repository & Single Sign-On
            </h3>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableCorpusSharing}
                onChange={(e) => setEnableCorpusSharing(e.target.checked)}
                className="mt-0.5 rounded text-[#3978D5]"
              />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Internal Thesis Repository Cross-Checking
                </p>
                <p className="text-[11px] text-slate-500">
                  Allow professors to cross-reference student coursework against previous years' dissertations from your university without exposing full text outside your campus tenant.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={enableSSO}
                onChange={(e) => setEnableSSO(e.target.checked)}
                className="mt-0.5 rounded text-[#3978D5]"
              />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  SAML 2.0 / Campus Active Directory Single Sign-On
                </p>
                <p className="text-[11px] text-slate-500">
                  Authenticate faculty and students through university identity providers (Shibboleth, Okta, Microsoft Azure).
                </p>
              </div>
            </label>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Retention Schedule (FERPA / GDPR Compliance)
            </label>
            <select
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            >
              <option value="365">1 Academic Year (365 days) then purge</option>
              <option value="730">2 Academic Years (730 days) then purge</option>
              <option value="1825">5 Academic Years (1825 days) then archive</option>
              <option value="indefinite">Indefinite Institutional Archive</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Tenant Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
