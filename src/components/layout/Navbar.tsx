import React, { useState } from 'react';
import { useTranslation } from '../../services/i18n/context';
import { useAuth } from '../../services/store/authContext';
import { LanguageToggle } from './LanguageToggle';
import { Shield, Menu, X, ArrowRight, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: t('navFeatures'), path: '/features' },
    { label: t('navSolutions'), path: '/solutions' },
    { label: t('navPricing'), path: '/pricing' },
    { label: t('navResources'), path: '/resources' },
    { label: t('navContact'), path: '/contact' },
  ];

  const getWorkspacePath = () => {
    if (!user) return '/app/dashboard';
    if (user.role === 'institution_admin') return '/institution/dashboard';
    if (user.role === 'super_admin') return '/admin/dashboard';
    return '/app/dashboard';
  };

  const getWorkspaceLabel = () => {
    if (!user) return t('navDashboard');
    if (user.role === 'institution_admin') return t('institutionOverview', 'Portail Campus');
    if (user.role === 'super_admin') return 'Administration';
    if (user.role === 'faculty') return 'Espace Enseignant';
    return t('navDashboard', 'Mon Espace');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#14243A]/95 backdrop-blur-md border-b border-[#E7EBF1] dark:border-[#23334A] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Brand wordmark */}
        <button
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 text-left text-slate-900 dark:text-white whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#14243A] dark:bg-[#3978D5] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold font-['Plus_Jakarta_Sans'] tracking-tight">
            Scholar<span className="text-[#3978D5]">Shield</span>
          </span>
        </button>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                  isActive
                    ? 'text-[#3978D5] dark:text-[#3978D5] font-semibold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#3978D5] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right action area + Language Toggle */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <LanguageToggle />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(getWorkspacePath())}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{getWorkspaceLabel()}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => {
                  logout();
                  onNavigate('/login');
                }}
                title="Se déconnecter"
                className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => onNavigate('/login')}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {t('navLogin', 'Connexion')}
              </button>
              <button
                onClick={() => onNavigate('/signup')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
              >
                <span>Créer un compte</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageToggle variant="minimal" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E7EBF1] dark:border-[#23334A] bg-white dark:bg-[#14243A] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentPath === link.path
                    ? 'bg-blue-50 dark:bg-slate-800 text-[#3978D5] font-semibold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <LanguageToggle variant="pill" />
          </div>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <button
                  onClick={() => {
                    onNavigate(getWorkspacePath());
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#3978D5] rounded-lg"
                >
                  Accéder à {getWorkspaceLabel()}
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    onNavigate('/login');
                  }}
                  className="w-full py-2 text-center text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    onNavigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg"
                >
                  {t('navLogin', 'Connexion')}
                </button>
                <button
                  onClick={() => {
                    onNavigate('/signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#3978D5] rounded-lg"
                >
                  Créer un compte
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
