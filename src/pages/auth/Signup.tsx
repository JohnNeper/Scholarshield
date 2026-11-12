import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { useTranslation } from '../../services/i18n/context';
import {
  Shield,
  ArrowRight,
  Lock,
  Mail,
  User,
  Building,
  AlertCircle,
  CheckCircle2,
  Building2,
  ExternalLink,
  UserCheck,
} from 'lucide-react';

interface SignupProps {
  onNavigate: (path: string) => void;
}

export const Signup: React.FC<SignupProps> = ({ onNavigate }) => {
  const { signup } = useAuth();
  const { language } = useTranslation();
  const isFr = language === 'fr';

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [usageType, setUsageType] = useState('Recherche indépendante & rédaction de manuscrits');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim() || !email.trim() || !password) {
      setError(
        isFr
          ? 'Veuillez renseigner l’ensemble des champs obligatoires (*).'
          : 'Please complete all required fields (*).'
      );
      return;
    }

    if (password.length < 6) {
      setError(
        isFr
          ? 'Le mot de passe doit comporter au moins 6 caractères.'
          : 'The password must contain at least 6 characters.'
      );
      return;
    }

    if (!agreeTerms) {
      setError(
        isFr
          ? 'Veuillez accepter les Conditions d’Utilisation et la Charte d’Intégrité.'
          : 'Please accept the Terms of Service and Academic Integrity Charter.'
      );
      return;
    }

    const res = signup({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password,
      role: 'student', // Profil utilisateur standard individuel
      institutionName: affiliation.trim() || (isFr ? 'Utilisateur Indépendant' : 'Independent Author'),
      academicField: usageType,
      country: 'Cameroun',
    });

    if (!res.success) {
      setError(
        res.error ||
          (isFr ? 'Une erreur est survenue lors de l’inscription.' : 'An error occurred during registration.')
      );
      return;
    }

    setSuccess(
      isFr
        ? `Votre compte a été créé avec succès. Bienvenue, ${res.user?.fullName}. Redirection vers votre espace...`
        : `Your account has been created successfully. Welcome, ${res.user?.fullName}. Redirecting to your workspace...`
    );

    setTimeout(() => {
      onNavigate('/app/dashboard');
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-3xl p-6 sm:p-9 shadow-sm space-y-6">
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-[#14243A] dark:bg-[#3978D5] flex items-center justify-center text-white mx-auto shadow-md">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#3978D5] border border-blue-200 dark:border-blue-900/60">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{isFr ? 'Accès Individuel & Autonome' : 'Individual & Independent Access'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            {isFr ? 'Créer un Compte Personnel' : 'Create a Personal Account'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            {isFr
              ? 'Vérifiez la conformité de vos manuscrits, publications et travaux écrits avec une garantie absolue de confidentialité et de souveraineté documentaire.'
              : 'Verify the integrity of your manuscripts, publications, and writings with full data sovereignty and strict confidentiality.'}
          </p>
        </div>

        {/* Institutional Callout for Universities & Campus Affiliates */}
        <div className="p-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 dark:from-blue-950/30 dark:via-slate-900/40 dark:to-slate-900/60 border border-blue-200/80 dark:border-blue-900/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#3978D5] flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-slate-900 dark:text-white">
                {isFr ? 'Accès Universitaire & Enseignement Supérieur' : 'University & Campus Integration'}
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                {isFr
                  ? 'Pour les étudiants et enseignants rattachés à un établissement partenaire (ex. Université de Dschang, University of Bamenda), l’accès est administré directement par votre rectorat ou doyenné.'
                  : 'For students and faculty affiliated with a partner university (e.g., Université de Dschang, University of Bamenda), access is managed directly through your campus agreement.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/contact')}
            className="shrink-0 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-[#3978D5] dark:text-blue-300 font-semibold rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-1.5 transition-all text-xs shadow-xs"
          >
            <span>{isFr ? 'Convention Campus' : 'Campus License'}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Feedback Notifications */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-center gap-2 text-xs text-red-700 dark:text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* User Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isFr ? 'Nom & Prénom *' : 'Full Name *'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={isFr ? 'ex. Amina Njoya ou Dr. Paul Biwole' : 'e.g. Dr. John Doe'}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isFr ? 'Adresse Électronique *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isFr ? 'votre.adresse@domaine.com' : 'name@example.com'}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isFr ? 'Affiliation ou Organisme (Optionnel)' : 'Organization / Affiliation (Optional)'}
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  placeholder={isFr ? 'ex. Auteur indépendant, Laboratoire, Cabinet...' : 'e.g. Independent author, Lab, Agency...'}
                  className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isFr ? 'Cadre d’Utilisation Principal' : 'Primary Use Case'}
              </label>
              <select
                value={usageType}
                onChange={(e) => setUsageType(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
              >
                <option value="Recherche indépendante & rédaction de manuscrits">
                  {isFr ? 'Recherche indépendante & manuscrits' : 'Independent research & manuscripts'}
                </option>
                <option value="Pré-vérification de mémoires & thèses">
                  {isFr ? 'Pré-contrôle avant soutenance' : 'Pre-submission defense check'}
                </option>
                <option value="Contrôle d’antériorité éditoriale">
                  {isFr ? 'Contrôle d’antériorité éditoriale' : 'Editorial prior art review'}
                </option>
                <option value="Audit de contenu & détection d’IA">
                  {isFr ? 'Audit de contenu & détection stylométrique' : 'Content audit & stylometric detection'}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isFr ? 'Mot de Passe Sécurisé *' : 'Password *'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isFr ? 'Au moins 6 caractères' : 'At least 6 characters'}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
              />
            </div>
          </div>

          {/* Privacy & Terms */}
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded text-[#3978D5] focus:ring-[#3978D5]"
            />
            <label htmlFor="terms" className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
              {isFr
                ? 'Je confirme avoir pris connaissance des Conditions Générales et de la Charte d’Intégrité ScholarShield. Les documents déposés demeurent sous ma souveraineté exclusive et ne sont jamais exploités pour l’entraînement d’algorithmes tiers.'
                : 'I confirm that I have reviewed the Terms of Service and the ScholarShield Academic Integrity Charter. Submitted manuscripts remain under my exclusive intellectual ownership and are never used to train third-party models.'}
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{isFr ? 'Valider mon Inscription Personnelle' : 'Complete Personal Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
          <span>{isFr ? 'Vous disposez déjà d’un compte ? ' : 'Already have an account? '}</span>
          <button
            onClick={() => onNavigate('/login')}
            className="text-[#3978D5] font-semibold hover:underline"
          >
            {isFr ? 'Se Connecter' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};
