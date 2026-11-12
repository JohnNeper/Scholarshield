import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { useTranslation } from '../../services/i18n/context';
import { LanguageToggle } from './LanguageToggle';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Clock,
  FileCheck2,
  FolderKanban,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ExternalLink,
  HelpCircle,
  User,
  GraduationCap,
  BookOpen,
  ClipboardList,
} from 'lucide-react';

interface AppLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const { user, role, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isFaculty = role === 'faculty';

  const menuItems = isFaculty
    ? [
        { label: t('navDashboard'), path: '/app/dashboard', icon: LayoutDashboard },
        { label: t('navNewAnalysis'), path: '/app/analysis/new', icon: PlusCircle, isHighlight: true },
        { label: t('copiesStudents', "Copies d'Étudiants"), path: '/app/teaching/submissions', icon: FileCheck2 },
        { label: t('courseAssignments', 'Devoirs de Cours'), path: '/institution/assignments', icon: ClipboardList },
        { label: t('myDocsCourses', 'Mes Documents & Cours'), path: '/app/documents', icon: FileText },
        { label: t('antiFraudCorpus', 'Corpus Anti-Fraude'), path: '/app/collections', icon: FolderKanban },
        { label: t('evaluationReports', "Rapports d'Évaluation"), path: '/app/reports', icon: Clock },
        { label: t('settingsThresholds', 'Paramètres & Seuils'), path: '/app/settings', icon: Settings },
      ]
    : [
        { label: t('navDashboard'), path: '/app/dashboard', icon: LayoutDashboard },
        { label: t('navNewAnalysis'), path: '/app/analysis/new', icon: PlusCircle, isHighlight: true },
        { label: t('courseAssignments', 'Devoirs de Cours'), path: '/app/student-assignments', icon: ClipboardList },
        { label: t('navMyDocuments'), path: '/app/documents', icon: FileText },
        { label: t('navCollections'), path: '/app/collections', icon: FolderKanban },
        { label: t('navHistory'), path: '/app/history', icon: Clock },
        { label: t('navReports'), path: '/app/reports', icon: FileCheck2 },
        { label: t('navCredits'), path: '/app/usage', icon: CreditCard },
        { label: t('navSettings'), path: '/app/settings', icon: Settings },
      ];

  const getBreadcrumbs = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length <= 1) return 'Dashboard';
    const last = parts[parts.length - 1];
    return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-[#0C1420] text-[#1B2638] dark:text-[#E2E8F0] transition-colors">
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#14243A] border-r border-[#E7EBF1] dark:border-[#23334A] shrink-0">
          {/* Workspace Brand / Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#E7EBF1] dark:border-[#23334A]">
            <button
              onClick={() => onNavigate('/app/dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-7 h-7 rounded-lg bg-[#14243A] dark:bg-[#3978D5] flex items-center justify-center text-white shadow-sm">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white tracking-tight">
                Scholar<span className="text-[#3978D5]">Shield</span>
              </span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path || (item.path !== '/app/dashboard' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    item.isHighlight && !isActive
                      ? 'text-[#3978D5] hover:bg-blue-50 dark:hover:bg-slate-800/80 font-semibold'
                      : isActive
                      ? 'bg-[#3978D5] text-white font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.isHighlight ? 'text-[#3978D5]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.isHighlight && !isActive && (
                    <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-[#3978D5] dark:text-blue-200 px-1.5 py-0.5 rounded font-mono">
                      +New
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Credit & Quota Card */}
          <div className="p-4 mx-3 mb-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Credits Quota</span>
              <span className="font-mono text-slate-900 dark:text-white font-semibold">
                {user?.creditsRemaining ?? 45} / {user?.creditsTotal ?? 50}
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#3978D5] h-full rounded-full transition-all"
                style={{ width: `${Math.round(((user?.creditsRemaining ?? 45) / (user?.creditsTotal ?? 50)) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="capitalize">{user?.plan === 'student' ? 'Individuel' : (user?.plan ?? 'Individuel')}</span>
              <button
                onClick={() => onNavigate('/app/usage')}
                className="text-[#3978D5] hover:underline font-medium"
              >
                Top-up
              </button>
            </div>
          </div>

          {/* User Profile Footer */}
          <div className="p-3 border-t border-[#E7EBF1] dark:border-[#23334A] flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shrink-0 font-medium text-xs">
                {user?.fullName?.charAt(0) ?? 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user?.fullName ?? 'Academic User'}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
                  <span className="font-mono text-[#3978D5] font-semibold">{user?.role === 'faculty' ? 'Enseignant' : 'Compte Personnel'}</span>
                  <span>·</span>
                  <span className="truncate">{user?.institutionName?.split('—')[0] || 'Utilisateur'}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Mobile Header & Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Header Bar */}
          <header className="h-16 px-4 sm:px-8 bg-white dark:bg-[#14243A] border-b border-[#E7EBF1] dark:border-[#23334A] flex items-center justify-between gap-4 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>{t('personalWorkspace', 'Espace Personnel')}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-medium text-slate-900 dark:text-white">{getBreadcrumbs()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LanguageToggle variant="pill" />
              <button
                onClick={() => onNavigate('/app/analysis/new')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{t('analyzeDoc', 'Nouvelle Analyse')}</span>
              </button>
              <button
                onClick={() => {
                  logout();
                  onNavigate('/login');
                }}
                title="Se déconnecter"
                className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-64 max-w-xs bg-white dark:bg-[#14243A] h-full flex flex-col shadow-xl z-10">
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <span className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                Scholar<span className="text-[#3978D5]">Shield</span>
              </span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium ${
                      isActive
                        ? 'bg-[#3978D5] text-white font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
};
