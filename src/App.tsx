/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './services/theme/context';
import { I18nProvider } from './services/i18n/context';
import { AuthProvider, useAuth } from './services/store/authContext';
import { DataProvider } from './services/store/dataContext';
import { Lock, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { InstitutionLayout } from './components/layout/InstitutionLayout';
import { AdminLayout } from './components/layout/AdminLayout';

// Public Pages
import { Home } from './pages/public/Home';
import { Features } from './pages/public/Features';
import { Solutions } from './pages/public/Solutions';
import { Pricing } from './pages/public/Pricing';
import { Resources } from './pages/public/Resources';
import { Contact } from './pages/public/Contact';
import { Legal } from './pages/public/Legal';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { Onboarding } from './pages/auth/Onboarding';

// Personal Workspace Pages
import { Dashboard } from './pages/app/Dashboard';
import { NewAnalysis } from './pages/app/NewAnalysis';
import { AnalysisConfigure } from './pages/app/AnalysisConfigure';
import { AnalysisProcessing } from './pages/app/AnalysisProcessing';
import { ResultsOverview } from './pages/app/ResultsOverview';
import { SimilarityReport } from './pages/app/SimilarityReport';
import { AIDetectionReport } from './pages/app/AIDetectionReport';
import { DocumentViewer } from './pages/app/DocumentViewer';
import { ReportsCenter } from './pages/app/ReportsCenter';
import { MyDocuments } from './pages/app/MyDocuments';
import { AnalysisHistory } from './pages/app/AnalysisHistory';
import { Collections } from './pages/app/Collections';
import { UsageCredits } from './pages/app/UsageCredits';
import { Settings } from './pages/app/Settings';
import { StudentAssignments } from './pages/app/StudentAssignments';
import { TeachingSubmissions } from './pages/app/TeachingSubmissions';

// Institutional Pages
import { InstitutionDashboard } from './pages/institution/InstitutionDashboard';
import { Departments } from './pages/institution/Departments';
import { Classes } from './pages/institution/Classes';
import { Students } from './pages/institution/Students';
import { Submissions } from './pages/institution/Submissions';
import { Assignments } from './pages/institution/Assignments';
import { Team } from './pages/institution/Team';
import { Analytics } from './pages/institution/Analytics';
import { InstitutionSettings } from './pages/institution/InstitutionSettings';
import { ResearchPublications } from './pages/institution/ResearchPublications';
import { InstitutionalDatabase } from './pages/institution/InstitutionalDatabase';

// Super Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { Users } from './pages/admin/Users';
import { Institutions } from './pages/admin/Institutions';
import { Subscriptions } from './pages/admin/Subscriptions';
import { Transactions } from './pages/admin/Transactions';
import { Engines } from './pages/admin/Engines';
import { AnalysisJobs } from './pages/admin/AnalysisJobs';
import { AuditLogs } from './pages/admin/AuditLogs';
import { AdminSettings } from './pages/admin/AdminSettings';

function AppRouter() {
  const { role, user, isAuthenticated, switchRole } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper parser for dynamic routes like /app/analysis/:id/results
  const parseRoute = (path: string) => {
    // Check Analysis sub-routes
    const analysisMatch = path.match(/^\/app\/analysis\/([^/]+)\/(configure|processing|results|similarity|ai-detection)$/);
    if (analysisMatch) {
      return {
        isAnalysisSubroute: true,
        id: analysisMatch[1],
        subpage: analysisMatch[2],
      };
    }

    // Check Document viewer route
    const docMatch = path.match(/^\/app\/documents\/([^/]+)$/);
    if (docMatch) {
      return {
        isDocViewer: true,
        id: docMatch[1],
      };
    }

    return null;
  };

  const parsed = parseRoute(currentPath);

  // 1. PUBLIC WEBSITE ROUTES
  if (
    currentPath === '/' ||
    currentPath === '/features' ||
    currentPath === '/solutions' ||
    currentPath === '/pricing' ||
    currentPath === '/resources' ||
    currentPath === '/contact' ||
    currentPath === '/privacy' ||
    currentPath === '/terms' ||
    currentPath === '/security' ||
    currentPath === '/data-policy'
  ) {
    return (
      <PublicLayout currentPath={currentPath} onNavigate={navigate}>
        {currentPath === '/' && <Home onNavigate={navigate} />}
        {currentPath === '/features' && <Features onNavigate={navigate} />}
        {currentPath === '/solutions' && <Solutions onNavigate={navigate} />}
        {currentPath === '/pricing' && <Pricing onNavigate={navigate} />}
        {currentPath === '/resources' && <Resources onNavigate={navigate} />}
        {currentPath === '/contact' && <Contact onNavigate={navigate} />}
        {currentPath === '/privacy' && <Legal initialTab="privacy" onNavigate={navigate} />}
        {currentPath === '/terms' && <Legal initialTab="terms" onNavigate={navigate} />}
        {currentPath === '/security' && <Legal initialTab="security" onNavigate={navigate} />}
        {currentPath === '/data-policy' && <Legal initialTab="data-policy" onNavigate={navigate} />}
      </PublicLayout>
    );
  }

  // 2. AUTHENTICATION & ONBOARDING ROUTES
  if (
    currentPath === '/login' ||
    currentPath === '/signup' ||
    currentPath === '/forgot-password' ||
    currentPath === '/verify-email' ||
    currentPath.startsWith('/onboarding')
  ) {
    return (
      <PublicLayout currentPath={currentPath} onNavigate={navigate}>
        {currentPath === '/login' && <Login onNavigate={navigate} />}
        {currentPath === '/signup' && <Signup onNavigate={navigate} />}
        {currentPath === '/forgot-password' && <ForgotPassword onNavigate={navigate} />}
        {currentPath === '/verify-email' && <VerifyEmail onNavigate={navigate} />}
        {currentPath === '/onboarding/role' && <Onboarding step="role" onNavigate={navigate} />}
        {currentPath === '/onboarding/profile' && <Onboarding step="profile" onNavigate={navigate} />}
        {currentPath === '/onboarding/preferences' && <Onboarding step="preferences" onNavigate={navigate} />}
        {currentPath === '/onboarding/complete' && <Onboarding step="complete" onNavigate={navigate} />}
        {currentPath === '/onboarding' && <Onboarding step="role" onNavigate={navigate} />}
      </PublicLayout>
    );
  }

  // 3. PERSONAL WORKSPACE ROUTES (/app/*)
  if (currentPath.startsWith('/app')) {
    if (!isAuthenticated || !user) {
      return (
        <PublicLayout currentPath={currentPath} onNavigate={navigate}>
          <div className="min-h-[75vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-[#14243A] border border-slate-200 dark:border-slate-800 rounded-3xl p-7 text-center space-y-5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#3978D5] mx-auto shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3978D5]">
                  Authentification Requise
                </span>
                <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                  Connexion à votre Espace ScholarShield
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Veuillez vous connecter avec votre compte universitaire ou créer un compte selon votre rôle pour accéder aux outils d'analyse et d'intégrité académique.
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
                >
                  Se Connecter
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl"
                >
                  Créer un Compte
                </button>
              </div>
            </div>
          </div>
        </PublicLayout>
      );
    }

    let content = null;

    if (parsed?.isAnalysisSubroute) {
      if (parsed.subpage === 'configure') {
        content = <AnalysisConfigure documentId={parsed.id} onNavigate={navigate} />;
      } else if (parsed.subpage === 'processing') {
        content = <AnalysisProcessing jobId={parsed.id} onNavigate={navigate} />;
      } else if (parsed.subpage === 'results') {
        content = <ResultsOverview jobId={parsed.id} onNavigate={navigate} />;
      } else if (parsed.subpage === 'similarity') {
        content = <SimilarityReport jobId={parsed.id} onNavigate={navigate} />;
      } else if (parsed.subpage === 'ai-detection') {
        content = <AIDetectionReport jobId={parsed.id} onNavigate={navigate} />;
      }
    } else if (parsed?.isDocViewer) {
      content = <DocumentViewer documentId={parsed.id} onNavigate={navigate} />;
    } else if (currentPath === '/app' || currentPath === '/app/dashboard') {
      content = <Dashboard onNavigate={navigate} />;
    } else if (currentPath === '/app/student-assignments') {
      content = <StudentAssignments onNavigate={navigate} />;
    } else if (currentPath === '/app/teaching/submissions') {
      content = <TeachingSubmissions onNavigate={navigate} />;
    } else if (currentPath === '/app/analysis/new') {
      content = <NewAnalysis onNavigate={navigate} />;
    } else if (currentPath === '/app/reports') {
      content = <ReportsCenter onNavigate={navigate} />;
    } else if (currentPath === '/app/documents') {
      content = <MyDocuments onNavigate={navigate} />;
    } else if (currentPath === '/app/history') {
      content = <AnalysisHistory onNavigate={navigate} />;
    } else if (currentPath === '/app/collections') {
      content = <Collections onNavigate={navigate} />;
    } else if (currentPath === '/app/usage') {
      content = <UsageCredits onNavigate={navigate} />;
    } else if (currentPath.startsWith('/app/settings')) {
      const sub = currentPath.replace('/app/settings/', '') as any;
      content = <Settings initialTab={sub || 'thresholds'} onNavigate={navigate} />;
    } else {
      content = <Dashboard onNavigate={navigate} />;
    }

    return (
      <AppLayout currentPath={currentPath} onNavigate={navigate}>
        {content}
      </AppLayout>
    );
  }

  // 4. INSTITUTIONAL WORKSPACE ROUTES (/institution/*)
  if (currentPath.startsWith('/institution')) {
    if (!isAuthenticated || !user) {
      return (
        <PublicLayout currentPath={currentPath} onNavigate={navigate}>
          <div className="min-h-[75vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-[#14243A] border border-blue-200 dark:border-blue-900/60 rounded-3xl p-7 text-center space-y-5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#3978D5] mx-auto shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3978D5]">
                  Portail Universitaire ScholarShield
                </span>
                <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                  Authentification Institutionnelle Requise
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  L'accès à la gouvernance de campus, aux banques de données matières et aux articles pré-publication requiert un compte autorisé.
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
                >
                  Se Connecter
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl"
                >
                  Créer un Compte Établissement
                </button>
              </div>
            </div>
          </div>
        </PublicLayout>
      );
    }

    // RBAC Security Guard: verify institution_admin or super_admin
    if (role === 'student') {
      return (
        <PublicLayout currentPath={currentPath} onNavigate={navigate}>
          <div className="min-h-[75vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-[#14243A] border border-blue-200 dark:border-blue-900/60 rounded-3xl p-7 text-center space-y-5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#3978D5] mx-auto shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#3978D5]">
                  Contrôle d'Accès Institutionnel (RBAC)
                </span>
                <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                  Portail Campus Réservé aux Administrateurs
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Votre session actuelle est connectée en tant qu'<strong>Étudiant</strong> ({user?.fullName || 'Claire Dubois'}). Ce portail gère les licences campus, les départements et les intégrations LMS de l'établissement.
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    switchRole('institution_admin');
                    navigate('/institution/dashboard');
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
                >
                  Basculer vers Profil Doyen / Admin (Dr. Hélène de Saint-Germain)
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/app/dashboard')}
                  className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl"
                >
                  Retourner à mon Espace Étudiant
                </button>
              </div>
            </div>
          </div>
        </PublicLayout>
      );
    }

    let instContent = null;
    if (currentPath === '/institution' || currentPath === '/institution/dashboard') {
      instContent = <InstitutionDashboard onNavigate={navigate} />;
    } else if (currentPath === '/institution/database' || currentPath === '/institution/corpus') {
      instContent = <InstitutionalDatabase onNavigate={navigate} />;
    } else if (currentPath === '/institution/departments') {
      instContent = <Departments onNavigate={navigate} />;
    } else if (currentPath === '/institution/research-papers') {
      instContent = <ResearchPublications onNavigate={navigate} />;
    } else if (currentPath === '/institution/classes') {
      instContent = <Classes onNavigate={navigate} />;
    } else if (currentPath === '/institution/students') {
      instContent = <Students onNavigate={navigate} />;
    } else if (currentPath === '/institution/submissions') {
      instContent = <Submissions onNavigate={navigate} />;
    } else if (currentPath === '/institution/assignments') {
      instContent = <Assignments onNavigate={navigate} />;
    } else if (currentPath === '/institution/team') {
      instContent = <Team onNavigate={navigate} />;
    } else if (currentPath === '/institution/analytics') {
      instContent = <Analytics onNavigate={navigate} />;
    } else if (currentPath === '/institution/settings') {
      instContent = <InstitutionSettings onNavigate={navigate} />;
    } else {
      instContent = <InstitutionDashboard onNavigate={navigate} />;
    }

    return (
      <InstitutionLayout currentPath={currentPath} onNavigate={navigate}>
        {instContent}
      </InstitutionLayout>
    );
  }

  // 5. SUPER ADMIN WORKSPACE ROUTES (/admin/*)
  if (currentPath.startsWith('/admin')) {
    if (!isAuthenticated || !user) {
      return (
        <PublicLayout currentPath={currentPath} onNavigate={navigate}>
          <div className="min-h-[75vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-[#14243A] border border-amber-200 dark:border-amber-900/60 rounded-3xl p-7 text-center space-y-5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto shadow-sm">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Sécurité Racine Plateforme ScholarShield
                </span>
                <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                  Authentification Super Administrateur Requise
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  L'accès à la télémétrie des serveurs, au cluster d'analyse et aux abonnements globaux nécessite une identification super admin.
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
                >
                  Se Connecter
                </button>
              </div>
            </div>
          </div>
        </PublicLayout>
      );
    }

    // RBAC Security Guard: verify super_admin
    if (role !== 'super_admin') {
      return (
        <PublicLayout currentPath={currentPath} onNavigate={navigate}>
          <div className="min-h-[75vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-[#14243A] border border-amber-200 dark:border-amber-900/60 rounded-3xl p-7 text-center space-y-5 shadow-lg">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mx-auto shadow-sm">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Sécurité Racine Plateforme
                </span>
                <h2 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                  Console Super Administrateur Protégée
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  L'accès à la télémétrie des serveurs, au cluster d'analyse et aux abonnements globaux est restreint aux ingénieurs système racine.
                </p>
              </div>
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    switchRole('super_admin');
                    navigate('/admin/dashboard');
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
                >
                  Basculer vers Profil Super Admin (Alexandre Sterling)
                </button>
                <button
                  type="button"
                  onClick={() => navigate(role === 'institution_admin' ? '/institution/dashboard' : '/app/dashboard')}
                  className="w-full py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl"
                >
                  Retourner à mon Espace Autorisé
                </button>
              </div>
            </div>
          </div>
        </PublicLayout>
      );
    }

    let adminContent = null;
    if (currentPath === '/admin' || currentPath === '/admin/dashboard') {
      adminContent = <AdminDashboard onNavigate={navigate} />;
    } else if (currentPath === '/admin/users') {
      adminContent = <Users onNavigate={navigate} />;
    } else if (currentPath === '/admin/institutions') {
      adminContent = <Institutions onNavigate={navigate} />;
    } else if (currentPath === '/admin/subscriptions') {
      adminContent = <Subscriptions onNavigate={navigate} />;
    } else if (currentPath === '/admin/transactions') {
      adminContent = <Transactions onNavigate={navigate} />;
    } else if (currentPath === '/admin/engines') {
      adminContent = <Engines onNavigate={navigate} />;
    } else if (currentPath === '/admin/analysis-jobs') {
      adminContent = <AnalysisJobs onNavigate={navigate} />;
    } else if (currentPath === '/admin/audit-logs') {
      adminContent = <AuditLogs onNavigate={navigate} />;
    } else if (currentPath === '/admin/settings') {
      adminContent = <AdminSettings onNavigate={navigate} />;
    } else {
      adminContent = <AdminDashboard onNavigate={navigate} />;
    }

    return (
      <AdminLayout currentPath={currentPath} onNavigate={navigate}>
        {adminContent}
      </AdminLayout>
    );
  }

  // Fallback -> Redirect to Home
  return (
    <PublicLayout currentPath="/" onNavigate={navigate}>
      <Home onNavigate={navigate} />
    </PublicLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <AuthProvider>
          <DataProvider>
            <AppRouter />
          </DataProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
