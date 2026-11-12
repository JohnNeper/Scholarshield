import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { useTranslation } from '../../services/i18n/context';
import {
  Shield,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Globe,
  Eye,
  EyeOff,
  Building2,
  GraduationCap,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

interface LoginProps {
  onNavigate: (path: string) => void;
  redirectPath?: string;
}

export const Login: React.FC<LoginProps> = ({ onNavigate, redirectPath }) => {
  const { login } = useAuth();
  const { language } = useTranslation();
  const isFr = language === 'fr';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [ssoLoading, setSsoLoading] = useState(false);
  const [showDemoCredentials, setShowDemoCredentials] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email.trim()) {
      setError(
        isFr
          ? 'Veuillez saisir votre adresse e-mail académique.'
          : 'Please enter your academic email address.'
      );
      return;
    }

    if (!password) {
      setError(
        isFr
          ? 'Veuillez saisir votre mot de passe.'
          : 'Please enter your password.'
      );
      return;
    }

    // Le login authentifie l'utilisateur et identifie automatiquement son rôle
    const res = login(email.trim(), password);
    if (!res.success) {
      setError(
        res.error ||
          (isFr
            ? 'Identifiants invalides. Vérifiez votre adresse ou mot de passe.'
            : 'Invalid credentials. Check your email or password.')
      );
      return;
    }

    const authenticatedUser = res.user;
    const userRole = authenticatedUser?.role || 'student';

    setSuccess(
      isFr
        ? `Connexion réussie ! Bienvenue, ${authenticatedUser?.fullName || 'Utilisateur'}. Redirection...`
        : `Sign in successful! Welcome, ${authenticatedUser?.fullName || 'User'}. Redirecting...`
    );

    setTimeout(() => {
      if (redirectPath) {
        onNavigate(redirectPath);
      } else if (userRole === 'institution_admin') {
        onNavigate('/institution/dashboard');
      } else if (userRole === 'super_admin') {
        onNavigate('/admin/dashboard');
      } else {
        onNavigate('/app/dashboard');
      }
    }, 450);
  };

  const handleSSOLogin = () => {
    setSsoLoading(true);
    setError('');
    setTimeout(() => {
      setSsoLoading(false);
      // Connexion SSO simulée vers le compte étudiant institutionnel Université de Dschang
      const res = login('amina.njoya@univ-dschang.org', 'password123');
      setSuccess(
        isFr
          ? 'Fédération d’identité universitaire validée (EduGAIN / UDs). Redirection...'
          : 'University identity federation validated (EduGAIN / UDs). Redirecting...'
      );
      setTimeout(() => {
        onNavigate('/app/dashboard');
      }, 500);
    }, 700);
  };

  // Remplissage rapide discret pour les tests d'évaluation
  const fillCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-3xl p-6 sm:p-9 shadow-sm space-y-6">
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-2xl bg-[#14243A] dark:bg-[#3978D5] flex items-center justify-center text-white mx-auto shadow-md">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            {isFr ? 'Connexion à ScholarShield' : 'Sign In to ScholarShield'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {isFr
              ? 'Accédez à votre espace d’analyse d’intégrité académique et à vos rapports de similarité.'
              : 'Access your academic integrity workspace and similarity analysis reports.'}
          </p>
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

        {/* Dedicated Admin Portal Banner with Credentials */}
        <div className="p-3.5 bg-gradient-to-br from-indigo-50/80 via-blue-50/50 to-slate-50 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-slate-900/40 border border-indigo-200/80 dark:border-indigo-800/50 rounded-2xl space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200">
              <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Accès Super Admin & Validation Institutions</span>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded">
              ADMIN OPÉRATIONS
            </span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Identifiants pour valider les institutions en attente et piloter l’ensemble des campus :
          </p>
          <div className="p-2 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-[11px] font-mono space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Email :</span>
              <span className="font-semibold text-indigo-700 dark:text-indigo-300 select-all">admin.ops@scholarshield.cm</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Mot de passe :</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 select-all">password123</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('admin.ops@scholarshield.cm');
              setPassword('password123');
              setError('');
            }}
            className="w-full py-2 text-[11px] font-bold text-indigo-700 dark:text-indigo-200 bg-indigo-100/70 hover:bg-indigo-200/80 dark:bg-indigo-900/40 dark:hover:bg-indigo-900/70 rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Remplir les identifiants Super Admin en 1 clic</span>
          </button>
        </div>

        {/* Clean Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isFr ? 'Adresse Électronique' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isFr ? 'ex. amina.njoya@univ-dschang.org' : 'name@university.edu'}
                className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isFr ? 'Mot de Passe' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="text-[11px] text-[#3978D5] hover:underline"
              >
                {isFr ? 'Mot de passe oublié ?' : 'Forgot password?'}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs pl-9 pr-10 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="submit"
              className="w-full py-3 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>{isFr ? 'Se Connecter' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* University SSO Federation */}
            <button
              type="button"
              disabled={ssoLoading}
              onClick={handleSSOLogin}
              className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Globe className="w-3.5 h-3.5 text-[#3978D5]" />
              <span>
                {ssoLoading
                  ? isFr ? 'Connexion Fédération en cours...' : 'Connecting via SSO...'
                  : isFr ? 'Connexion SSO Établissement (EduGAIN / SAML)' : 'University SSO Sign In (EduGAIN / SAML)'}
              </span>
            </button>
          </div>
        </form>

        {/* Institution commercial notice */}
        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-2">
          <span>{isFr ? 'Vous représentez une université ou un établissement ?' : 'Representing a university or institution?'}</span>
          <button
            onClick={() => onNavigate('/contact')}
            className="text-[#3978D5] font-semibold hover:underline shrink-0"
          >
            {isFr ? 'Déployer sur votre campus' : 'Campus Deployment'}
          </button>
        </div>

        {/* Discreet Test / Evaluation Accounts Collapsible Drawer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowDemoCredentials(!showDemoCredentials)}
            className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 py-1"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3 h-3 text-[#3978D5]" />
              <span>{isFr ? 'Profils de démonstration & évaluation' : 'Evaluation Profiles'}</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemoCredentials ? 'rotate-180' : ''}`} />
          </button>

          {showDemoCredentials && (
            <div className="mt-2 p-2.5 bg-slate-50 dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] space-y-1.5">
              <p className="text-slate-500 dark:text-slate-400 font-medium pb-1 border-b border-slate-200 dark:border-slate-800">
                {isFr ? 'Sélectionnez un profil pour renseigner les accès de test :' : 'Select a profile to populate test credentials:'}
              </p>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => fillCredentials('admin.ops@scholarshield.cm')}
                  className="p-1.5 text-left rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 flex items-center justify-between text-indigo-900 dark:text-indigo-200 border border-indigo-200/50 dark:border-indigo-800/40"
                >
                  <span className="font-bold flex items-center gap-1">
                    <Shield className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    <span>{isFr ? 'Super Admin Ops (Validation Institutions)' : 'Super Admin Ops (Institution Validation)'}</span>
                  </span>
                  <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-mono">admin.ops@scholarshield.cm</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('amina.njoya@univ-dschang.org')}
                  className="p-1.5 text-left rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300"
                >
                  <span className="font-semibold">{isFr ? 'Amina Njoya (Espace Personnel · Univ. Dschang)' : 'Amina Njoya (Personal Workspace · UDs)'}</span>
                  <span className="text-[10px] text-[#3978D5] font-mono">amina.njoya@univ-dschang.org</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('emmanuel.tabi@uniba-edu.cm')}
                  className="p-1.5 text-left rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300"
                >
                  <span className="font-semibold">{isFr ? 'Dr. Emmanuel Tabi (Espace Enseignant · Univ. Bamenda)' : 'Dr. Emmanuel Tabi (Faculty · UBa)'}</span>
                  <span className="text-[10px] text-[#3978D5] font-mono">emmanuel.tabi@uniba-edu.cm</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('rectorat.conseil@univ-dschang.org')}
                  className="p-1.5 text-left rounded-lg hover:bg-white dark:hover:bg-slate-800 flex items-center justify-between text-slate-700 dark:text-slate-300"
                >
                  <span className="font-semibold">{isFr ? 'Pr. Roger Tsafack (Doyen · Conseil Scientifique)' : 'Prof. Roger Tsafack (Dean · Scientific Council)'}</span>
                  <span className="text-[10px] text-[#3978D5] font-mono">rectorat.conseil@univ-dschang.org</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Link to Signup */}
        <div className="pt-2 text-center text-xs text-slate-500">
          <span>{isFr ? 'Vous ne disposez pas encore d’un compte ? ' : 'Don’t have an account yet? '}</span>
          <button
            onClick={() => onNavigate('/signup')}
            className="text-[#3978D5] font-semibold hover:underline"
          >
            {isFr ? 'Créer un Compte Personnel' : 'Create a Personal Account'}
          </button>
        </div>
      </div>
    </div>
  );
};
