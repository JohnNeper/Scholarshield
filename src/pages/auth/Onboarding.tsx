import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { useTranslation } from '../../services/i18n/context';
import {
  GraduationCap,
  BookOpen,
  Microscope,
  Building2,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Role, Language } from '../../types';

interface OnboardingProps {
  step: 'role' | 'profile' | 'preferences' | 'complete';
  onNavigate: (path: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ step, onNavigate }) => {
  const { user, updateUser, switchRole } = useAuth();
  const { language, setLanguage } = useTranslation();

  const [selectedRole, setSelectedRole] = useState<Role>(user?.role ?? 'student');
  const [fullName, setFullName] = useState(user?.fullName ?? 'Claire Dubois');
  const [country, setCountry] = useState(user?.country ?? 'France');
  const [preferredLang, setPreferredLang] = useState<Language>(language);
  const [institutionName, setInstitutionName] = useState(user?.institutionName ?? 'Sorbonne Université');
  const [academicField, setAcademicField] = useState(user?.academicField ?? 'Bioinformatics & Machine Learning');

  const handleFinish = () => {
    updateUser({
      fullName,
      country,
      preferredLanguage: preferredLang,
      institutionName,
      academicField,
      role: selectedRole,
    });
    switchRole(selectedRole);

    if (selectedRole === 'institution_admin') {
      onNavigate('/institution/dashboard');
    } else {
      onNavigate('/app/dashboard');
    }
  };

  const steps = [
    { id: 'role', label: 'Academic Role' },
    { id: 'profile', label: 'Profile Details' },
    { id: 'preferences', label: 'Field & Affiliation' },
    { id: 'complete', label: 'Ready' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-3xl p-8 sm:p-10 shadow-sm space-y-8">
        {/* Step Progress Tracker */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Step {currentStepIndex + 1} of 4</span>
            <span className="text-[#3978D5]">{steps[currentStepIndex]?.label}</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {steps.map((s, idx) => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full transition-all ${
                  idx <= currentStepIndex ? 'bg-[#3978D5]' : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: Academic Role */}
        {step === 'role' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                Select Your Academic Role
              </h2>
              <p className="text-xs text-slate-500">
                This configures your default workspace views, quotas, and reporting capabilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  role: 'student' as Role,
                  icon: GraduationCap,
                  title: 'Student',
                  desc: 'Undergraduate, Master’s, or Doctoral candidates verifying papers before submission.',
                },
                {
                  role: 'faculty' as Role,
                  icon: BookOpen,
                  title: 'Teacher / Professor',
                  desc: 'Lecturers and instructors evaluating student cohorts and assignment dropboxes.',
                },
                {
                  role: 'faculty' as Role,
                  icon: Microscope,
                  title: 'Researcher',
                  desc: 'Post-docs and research fellows preparing peer-reviewed journal preprints.',
                },
                {
                  role: 'institution_admin' as Role,
                  icon: Building2,
                  title: 'Institution Administrator',
                  desc: 'Deans and faculty heads managing campus departments and student licenses.',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.role;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedRole(item.role)}
                    className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-[#3978D5] bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-[#3978D5]'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#3978D5]">
                        <Icon className="w-4 h-4" />
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#3978D5]" />}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => onNavigate('/onboarding/profile')}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
              >
                <span>Next: Profile Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Profile Details */}
        {step === 'profile' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                Academic Profile & Language
              </h2>
              <p className="text-xs text-slate-500">
                Used to personalize certificates and match your academic language conventions.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Legal Name (as shown on thesis/certificate)
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Country
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                  >
                    <option value="France">France</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preferred Interface Language
                  </label>
                  <select
                    value={preferredLang}
                    onChange={(e) => {
                      const l = e.target.value as Language;
                      setPreferredLang(l);
                      setLanguage(l);
                    }}
                    className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                  >
                    <option value="en">English (US / UK)</option>
                    <option value="fr">Français (FR)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => onNavigate('/onboarding/role')}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => onNavigate('/onboarding/preferences')}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
              >
                <span>Next: Academic Affiliation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Academic Affiliation */}
        {step === 'preferences' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                Academic Institution & Research Field
              </h2>
              <p className="text-xs text-slate-500">
                These optional fields allow matching with internal institutional corpora.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Institution / University (Optional)
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="e.g. Sorbonne Université, University of Oxford, MIT..."
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Academic Field / Department (Optional)
                </label>
                <input
                  type="text"
                  value={academicField}
                  onChange={(e) => setAcademicField(e.target.value)}
                  placeholder="e.g. Computer Science, Molecular Biology, Philosophy, Law..."
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                />
              </div>

              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-[11px] text-blue-900 dark:text-blue-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3978D5] shrink-0 mt-0.5" />
                <span>
                  All fields can be updated or cleared at any time from your account settings.
                </span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => onNavigate('/onboarding/profile')}
                className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => onNavigate('/onboarding/complete')}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
              >
                <span>Review & Complete</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Complete */}
        {step === 'complete' && (
          <div className="space-y-6 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#269B72] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                Workspace Setup Complete!
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your academic integrity environment is calibrated and ready. You have 50 verification credits available.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-left text-xs space-y-1.5 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500">Academic User:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigned Role:</span>
                <span className="font-semibold text-[#3978D5] capitalize">{selectedRole}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Institution:</span>
                <span className="text-slate-900 dark:text-white">{institutionName || 'Independent Scholar'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Active Engine:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">Heuristic Dual Core</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto px-8 py-3 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-md transition-all inline-flex items-center justify-center gap-2"
              >
                <span>Launch My Academic Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
