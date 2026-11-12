import React, { useState } from 'react';
import { useAuth } from '../../services/store/authContext';
import { useTranslation } from '../../services/i18n/context';
import { useTheme } from '../../services/theme/context';
import { ShieldCheck, Moon, Sun, Globe, ChevronDown, Check, Sparkles, Building2, User, KeyRound, Monitor } from 'lucide-react';
import { Role } from '../../types';

interface EnvironmentSwitcherProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const EnvironmentSwitcher: React.FC<EnvironmentSwitcherProps> = ({ currentPath, onNavigate }) => {
  const { role, switchRole, user } = useAuth();
  const { language, setLanguage, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  const environments = [
    {
      id: 'public',
      label: t('envPublic', 'Site Public'),
      path: '/',
      role: 'student' as Role,
      icon: Globe,
    },
    {
      id: 'student',
      label: t('envStudent', 'Espace Étudiant'),
      path: '/app/dashboard',
      role: 'student' as Role,
      icon: User,
    },
    {
      id: 'institution',
      label: t('envInstitution', 'Portail Universitaire'),
      path: '/institution/dashboard',
      role: 'institution_admin' as Role,
      icon: Building2,
    },
    {
      id: 'admin',
      label: t('envAdmin', 'Super Admin'),
      path: '/admin/dashboard',
      role: 'super_admin' as Role,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full bg-[#14243A] text-white border-b border-[#23334A] text-xs font-sans select-none relative z-50">
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Environment Badges & Notice */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#269B72] ring-2 ring-[#269B72]/30"></span>
            <span className="font-semibold text-white tracking-wide">VeritasAcademic</span>
          </div>

          <div className="h-3.5 w-[1px] bg-slate-700 hidden sm:block"></div>

          {/* Quick Environment Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded border border-slate-700">
            {environments.map((env) => {
              const Icon = env.icon;
              const isActive =
                (env.id === 'public' && (currentPath === '/' || currentPath.startsWith('/features') || currentPath.startsWith('/solutions') || currentPath.startsWith('/pricing') || currentPath.startsWith('/resources') || currentPath.startsWith('/contact') || currentPath.startsWith('/legal'))) ||
                (env.id === 'student' && currentPath.startsWith('/app')) ||
                (env.id === 'institution' && currentPath.startsWith('/institution')) ||
                (env.id === 'admin' && currentPath.startsWith('/admin'));

              return (
                <button
                  key={env.id}
                  onClick={() => {
                    switchRole(env.role);
                    onNavigate(env.path);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#3978D5] text-white font-medium shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{env.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Quick Role Info, Language & Theme Toggles */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800/80 rounded px-1.5 py-0.5 border border-slate-700">
            <button
              onClick={() => setLanguage('fr')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                language === 'fr' ? 'bg-[#3978D5] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Français"
            >
              <span>🇫🇷</span>
              <span>FR</span>
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                language === 'en' ? 'bg-[#3978D5] text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-1 text-slate-300 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-blue-300" />}
          </button>
        </div>
      </div>
    </div>
  );
};
