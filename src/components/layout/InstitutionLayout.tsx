import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { useTranslation } from '../../services/i18n/context';
import { LanguageToggle } from './LanguageToggle';
import {
  Building2,
  GraduationCap,
  Users,
  BookOpen,
  FileCheck,
  ClipboardList,
  UserCheck,
  BarChart3,
  Settings,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Shield,
  Layers,
  BookCheck,
  Database,
} from 'lucide-react';

interface InstitutionLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const InstitutionLayout: React.FC<InstitutionLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: t('institutionOverview', 'Vue d’Ensemble'), path: '/institution/dashboard', icon: Building2 },
    { label: t('institutionDatabase', 'Banques de Données'), path: '/institution/database', icon: Database },
    { label: t('institutionResearchPapers', 'Articles & Recherche'), path: '/institution/research-papers', icon: BookCheck },
    { label: t('institutionDepartments', 'Départements'), path: '/institution/departments', icon: Layers },
    { label: t('institutionClasses', 'Promotions & Classes'), path: '/institution/classes', icon: BookOpen },
    { label: t('institutionStudents', 'Étudiants Inscrits'), path: '/institution/students', icon: Users },
    { label: t('institutionSubmissions', 'Dépôts & Mémoires'), path: '/institution/submissions', icon: FileCheck },
    { label: t('institutionAssignments', 'Devoirs Académiques'), path: '/institution/assignments', icon: ClipboardList },
    { label: t('institutionTeam', 'Corps Professoral'), path: '/institution/team', icon: UserCheck },
    { label: t('institutionAnalytics', 'Campus Analytics'), path: '/institution/analytics', icon: BarChart3 },
    { label: t('institutionSettings', 'Paramètres Institutionnels'), path: '/institution/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-[#0C1420] text-[#1B2638] dark:text-[#E2E8F0] transition-colors">
      <div className="flex-1 flex overflow-hidden">
        {/* Institutional Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-[#14243A] border-r border-[#E7EBF1] dark:border-[#23334A] shrink-0">
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#E7EBF1] dark:border-[#23334A]">
            <button
              onClick={() => onNavigate('/institution/dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-7 h-7 rounded-lg bg-[#3978D5] flex items-center justify-center text-white shadow-sm">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white block leading-tight">
                  Campus Portal
                </span>
                <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                  {user?.institutionName ?? 'Higher Education'}
                </span>
              </div>
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#3978D5] text-white font-semibold shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Institutional Compliance Status */}
          <div className="p-3 mx-3 mb-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus License Active</span>
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 mt-1">
              9,800 / 10,000 document quotas remaining.
            </p>
          </div>

          <div className="p-3 border-t border-[#E7EBF1] dark:border-[#23334A] flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{user?.fullName}</p>
              <p className="text-[10px] text-slate-500 truncate">Dean / Admin</p>
            </div>
            <button
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Content Column */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <header className="h-16 px-4 sm:px-8 bg-white dark:bg-[#14243A] border-b border-[#E7EBF1] dark:border-[#23334A] flex items-center justify-between gap-4 sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>{t('envInstitution', 'Portail Universitaire')}</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-medium text-slate-900 dark:text-white">
                  {currentPath.replace('/institution/', '').replace('-', ' ') || 'Overview'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <LanguageToggle variant="pill" />
              <div className="hidden sm:flex items-center gap-1.5">
                <span className="text-slate-500">{t('tenant', 'Établissement')}:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  inst-polytechnique-01
                </span>
              </div>
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

          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 max-w-xs bg-white dark:bg-[#14243A] h-full flex flex-col shadow-xl z-10">
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
              <span className="text-sm font-bold">Campus Administration</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                      isActive ? 'bg-[#3978D5] text-white' : 'text-slate-700 dark:text-slate-300'
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
