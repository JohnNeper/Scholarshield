import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { useTranslation } from '../../services/i18n/context';
import { LanguageToggle } from './LanguageToggle';
import {
  ShieldAlert,
  Users2,
  Building,
  CreditCard,
  Receipt,
  Cpu,
  ListOrdered,
  ScrollText,
  Sliders,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Activity,
} from 'lucide-react';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPath, onNavigate, children }) => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: t('adminTelemetry', 'Télémétrie Système'), path: '/admin/dashboard', icon: Activity },
    { label: t('adminUsers', 'Utilisateurs Globaux'), path: '/admin/users', icon: Users2 },
    { label: t('adminInstitutions', 'Établissements & Campus'), path: '/admin/institutions', icon: Building },
    { label: t('adminPlans', 'Forfaits & Quotas'), path: '/admin/subscriptions', icon: CreditCard },
    { label: t('adminTransactions', 'Transactions & Ledger'), path: '/admin/transactions', icon: Receipt },
    { label: t('adminEngines', 'Santé des Moteurs'), path: '/admin/engines', icon: Cpu },
    { label: t('adminJobs', 'File d’Attente d’Analyse'), path: '/admin/analysis-jobs', icon: ListOrdered },
    { label: t('adminAuditLogs', 'Journaux d’Audit'), path: '/admin/audit-logs', icon: ScrollText },
    { label: t('adminSettings', 'Paramètres Système'), path: '/admin/settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F7FA] dark:bg-[#0C1420] text-[#1B2638] dark:text-[#E2E8F0] transition-colors">
      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#14243A] text-white border-r border-[#23334A] shrink-0">
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#23334A]">
            <button
              onClick={() => onNavigate('/admin/dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-bold font-['Plus_Jakarta_Sans'] text-white block leading-tight">
                  Super Admin
                </span>
                <span className="text-[10px] text-slate-400 block">Root Governance</span>
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
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Engine Status Health Widget */}
          <div className="p-3 mx-3 mb-3 bg-slate-800/80 border border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Engines Cluster</span>
              <span className="text-emerald-400 font-mono font-semibold">ONLINE</span>
            </div>
            <div className="text-[10px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Plagiarism Core:</span>
                <span className="font-mono text-slate-300">18ms</span>
              </div>
              <div className="flex justify-between">
                <span>Stylometric AI:</span>
                <span className="font-mono text-slate-300">14ms</span>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-[#23334A] flex items-center justify-between">
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-[10px] text-slate-400 truncate">Super Admin Privileges</p>
            </div>
            <button
              onClick={() => {
                logout();
                onNavigate('/login');
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </aside>

        {/* Content Viewport */}
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
                <span>Super Admin</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-medium text-slate-900 dark:text-white">
                  {currentPath.replace('/admin/', '').replace('-', ' ') || 'Telemetry'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LanguageToggle variant="pill" />
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                <span className="text-slate-500">Cluster:</span>
                <span className="font-mono font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                  eu-west-cluster-prod-01
                </span>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 max-w-xs bg-[#14243A] text-white h-full flex flex-col shadow-xl z-10">
            <div className="h-16 px-6 flex items-center justify-between border-b border-slate-700">
              <span className="text-sm font-bold">Admin Console</span>
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
                      isActive ? 'bg-[#3978D5] text-white' : 'text-slate-300'
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
