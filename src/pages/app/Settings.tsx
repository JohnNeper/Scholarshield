import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/store/authContext';
import { useData } from '../../services/store/dataContext';
import { useTranslation } from '../../services/i18n/context';
import { useTheme } from '../../services/theme/context';
import {
  User,
  Sliders,
  Lock,
  CreditCard,
  Bell,
  Laptop,
  CheckCircle2,
  Trash2,
  Shield,
  Download,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  Scale,
} from 'lucide-react';
import { Language, IntegrityThresholds } from '../../types';

interface SettingsProps {
  initialTab?: 'profile' | 'thresholds' | 'preferences' | 'security' | 'billing' | 'notifications' | 'sessions';
  onNavigate: (path: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ initialTab = 'thresholds', onNavigate }) => {
  const { user, updateUser } = useAuth();
  const { thresholds, updateThresholds } = useData();
  const { language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [institutionName, setInstitutionName] = useState(user?.institutionName || '');
  const [academicField, setAcademicField] = useState(user?.academicField || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [thresholdsSaved, setThresholdsSaved] = useState(false);

  // Local state for thresholds editing
  const [localThresholds, setLocalThresholds] = useState<IntegrityThresholds>(thresholds);

  useEffect(() => {
    setLocalThresholds(thresholds);
  }, [thresholds]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      fullName,
      institutionName,
      academicField,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveThresholds = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateThresholds(localThresholds);
    setThresholdsSaved(true);
    setTimeout(() => setThresholdsSaved(false), 3000);
  };

  const applyPreset = (preset: 'strict' | 'standard' | 'flexible') => {
    if (preset === 'strict') {
      const p: IntegrityThresholds = {
        similarityWarningThreshold: 10,
        similarityCriticalThreshold: 20,
        aiWarningThreshold: 10,
        aiCriticalThreshold: 25,
        minMatchingWords: 6,
        autoFlagSubmissions: true,
        requireHumanReviewOnBreach: true,
        excludeQuotedByDefault: true,
        excludeBibliographyByDefault: true,
      };
      setLocalThresholds(p);
      updateThresholds(p);
    } else if (preset === 'standard') {
      const p: IntegrityThresholds = {
        similarityWarningThreshold: 15,
        similarityCriticalThreshold: 30,
        aiWarningThreshold: 20,
        aiCriticalThreshold: 40,
        minMatchingWords: 8,
        autoFlagSubmissions: true,
        requireHumanReviewOnBreach: false,
        excludeQuotedByDefault: true,
        excludeBibliographyByDefault: true,
      };
      setLocalThresholds(p);
      updateThresholds(p);
    } else {
      const p: IntegrityThresholds = {
        similarityWarningThreshold: 25,
        similarityCriticalThreshold: 45,
        aiWarningThreshold: 35,
        aiCriticalThreshold: 55,
        minMatchingWords: 10,
        autoFlagSubmissions: false,
        requireHumanReviewOnBreach: false,
        excludeQuotedByDefault: true,
        excludeBibliographyByDefault: true,
      };
      setLocalThresholds(p);
      updateThresholds(p);
    }
    setThresholdsSaved(true);
    setTimeout(() => setThresholdsSaved(false), 3000);
  };

  const tabs = [
    { id: 'thresholds', label: 'Seuils & Tolérances (Plagiat & IA)', icon: Sliders },
    { id: 'profile', label: 'Profil Institutionnel', icon: User },
    { id: 'preferences', label: 'Préférences & Langue', icon: Laptop },
    { id: 'security', label: 'Sécurité & 2FA', icon: Lock },
    { id: 'billing', label: 'Abonnement & Quotas', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'sessions', label: 'Sessions Actives', icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
          Account & Security Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage your personal details, academic affiliation, and cryptographic security credentials.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
          <span>Profil et paramètres mis à jour avec succès.</span>
        </div>
      )}

      {thresholdsSaved && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
            <span className="font-semibold">Seuils institutionnels d'intégrité enregistrés et appliqués aux analyses !</span>
          </div>
          <span className="text-[11px] opacity-75">Pris en compte sur tous les rapports</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 dark:border-slate-800 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-[#3978D5] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 0: Thresholds (Seuils d'Intégrité Plagiat & IA) */}
      {activeTab === 'thresholds' && (
        <div className="space-y-6">
          {/* Header & Preset Selector */}
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#3978D5]" />
                  <h2 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                    Politique des Seuils d'Acceptabilité Institutionnelle
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                  Définissez les pourcentages maximaux tolérés pour le plagiat (similarité textuelle multi-sources) et la génération par Intelligence Artificielle. Ces seuils s'appliquent automatiquement à chaque rapport d'analyse.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Préréglages :</span>
                <button
                  type="button"
                  onClick={() => applyPreset('strict')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 hover:bg-red-100 transition-colors"
                  title="Thèse / Doctorat (Plagiat max 10%, IA max 10%)"
                >
                  Strict (Thèse)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('standard')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#3978D5] border border-blue-200 dark:border-blue-900/50 hover:bg-blue-100 transition-colors"
                  title="Master / Université (Plagiat max 15%, IA max 20%)"
                >
                  Standard (Master)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('flexible')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100 transition-colors"
                  title="Licence / Projets libres (Plagiat max 25%, IA max 35%)"
                >
                  Flexible (Licence)
                </button>
              </div>
            </div>
          </div>

          {/* Section 1: Similarité & Plagiat */}
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#3978D5] flex items-center justify-center font-bold text-xs">
                  %
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Seuil de Similarité & Plagiat (Corpus Multi-Sources & Publics)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Pourcentage maximal de correspondance textuelle brute avant déclenchement d'une alerte ou sanction
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#3978D5] font-bold">
                  Alerte: {localThresholds.similarityWarningThreshold}%
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/40 text-red-600 font-bold">
                  Critique: {localThresholds.similarityCriticalThreshold}%
                </span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400">0% — Conforme / Toléré</span>
                <span className="text-amber-600 dark:text-amber-400">Avertissement ({localThresholds.similarityWarningThreshold}%)</span>
                <span className="text-red-600 dark:text-red-400">Violation Critique ({localThresholds.similarityCriticalThreshold}%+)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${Math.min(100, localThresholds.similarityWarningThreshold)}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  title="Zone Conforme"
                />
                <div
                  style={{
                    width: `${Math.max(0, Math.min(100 - localThresholds.similarityWarningThreshold, localThresholds.similarityCriticalThreshold - localThresholds.similarityWarningThreshold))}%`,
                  }}
                  className="bg-amber-400 h-full transition-all duration-300"
                  title="Zone d'Avertissement"
                />
                <div
                  style={{
                    width: `${Math.max(0, 100 - localThresholds.similarityCriticalThreshold)}%`,
                  }}
                  className="bg-red-500 h-full transition-all duration-300"
                  title="Zone Critique"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Absence totale de similarité)</span>
                <span>50%</span>
                <span>100% (Copie intégrale)</span>
              </div>
            </div>

            {/* Sliders & Numeric Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Seuil d'Alerte Précoce (Warning)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={localThresholds.similarityCriticalThreshold - 1}
                      value={localThresholds.similarityWarningThreshold}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(localThresholds.similarityCriticalThreshold - 1, parseInt(e.target.value) || 1));
                        setLocalThresholds({ ...localThresholds, similarityWarningThreshold: val });
                      }}
                      className="w-16 text-xs text-center font-mono font-bold p-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                    <span className="text-xs font-semibold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={2}
                  max={45}
                  value={localThresholds.similarityWarningThreshold}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setLocalThresholds({
                      ...localThresholds,
                      similarityWarningThreshold: Math.min(val, localThresholds.similarityCriticalThreshold - 1),
                    });
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#3978D5]"
                />
                <p className="text-[11px] text-slate-500">
                  En-dessous de ce seuil, les citations et correspondances sont considérées comme ordinaires et tolérées.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Seuil Critique d'Infraction (Critical)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={localThresholds.similarityWarningThreshold + 1}
                      max={95}
                      value={localThresholds.similarityCriticalThreshold}
                      onChange={(e) => {
                        const val = Math.max(localThresholds.similarityWarningThreshold + 1, Math.min(95, parseInt(e.target.value) || 50));
                        setLocalThresholds({ ...localThresholds, similarityCriticalThreshold: val });
                      }}
                      className="w-16 text-xs text-center font-mono font-bold p-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                    <span className="text-xs font-semibold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={15}
                  max={80}
                  value={localThresholds.similarityCriticalThreshold}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setLocalThresholds({
                      ...localThresholds,
                      similarityCriticalThreshold: Math.max(val, localThresholds.similarityWarningThreshold + 1),
                    });
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-red-600"
                />
                <p className="text-[11px] text-slate-500">
                  Au-dessus de ce niveau, le document est automatiquement classé en infraction majeure de plagiat.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Contenu Généré par l'IA */}
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-[#8B68D8] flex items-center justify-center font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Seuil de Contenu Généré par l'IA (Modèles LLM & Stylométrie)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Probabilité globale maximale tolérée pour l'assistance à la rédaction ou le texte synthétique non annoté
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-[#8B68D8] font-bold">
                  Alerte IA: {localThresholds.aiWarningThreshold}%
                </span>
                <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-600 font-bold">
                  Critique IA: {localThresholds.aiCriticalThreshold}%
                </span>
              </div>
            </div>

            {/* Visual Gauge Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400">0% — Stylométrie Naturelle (Humain)</span>
                <span className="text-purple-600 dark:text-purple-400">Assistance Tolérée ({localThresholds.aiWarningThreshold}%)</span>
                <span className="text-rose-600 dark:text-rose-400">Dominance Synthétique IA ({localThresholds.aiCriticalThreshold}%+)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${Math.min(100, localThresholds.aiWarningThreshold)}%` }}
                  className="bg-emerald-500 h-full transition-all duration-300"
                  title="Zone Naturelle Humaine"
                />
                <div
                  style={{
                    width: `${Math.max(0, Math.min(100 - localThresholds.aiWarningThreshold, localThresholds.aiCriticalThreshold - localThresholds.aiWarningThreshold))}%`,
                  }}
                  className="bg-purple-400 h-full transition-all duration-300"
                  title="Zone de Suspicion Modérée"
                />
                <div
                  style={{
                    width: `${Math.max(0, 100 - localThresholds.aiCriticalThreshold)}%`,
                  }}
                  className="bg-rose-500 h-full transition-all duration-300"
                  title="Zone Synthétique IA Inacceptable"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (100% Rédaction Humaine)</span>
                <span>50%</span>
                <span>100% (100% Généré par IA)</span>
              </div>
            </div>

            {/* Sliders & Numeric Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Seuil d'Avertissement IA (Assistance permise)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={localThresholds.aiCriticalThreshold - 1}
                      value={localThresholds.aiWarningThreshold}
                      onChange={(e) => {
                        const val = Math.max(1, Math.min(localThresholds.aiCriticalThreshold - 1, parseInt(e.target.value) || 1));
                        setLocalThresholds({ ...localThresholds, aiWarningThreshold: val });
                      }}
                      className="w-16 text-xs text-center font-mono font-bold p-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                    <span className="text-xs font-semibold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={localThresholds.aiWarningThreshold}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setLocalThresholds({
                      ...localThresholds,
                      aiWarningThreshold: Math.min(val, localThresholds.aiCriticalThreshold - 1),
                    });
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#8B68D8]"
                />
                <p className="text-[11px] text-slate-500">
                  Tolérance pour la correction grammaticale automatique, paraphrase légère ou reformulation assistée.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Seuil Critique de Contenu IA (Rejet / Signalement)
                  </label>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={localThresholds.aiWarningThreshold + 1}
                      max={95}
                      value={localThresholds.aiCriticalThreshold}
                      onChange={(e) => {
                        const val = Math.max(localThresholds.aiWarningThreshold + 1, Math.min(95, parseInt(e.target.value) || 50));
                        setLocalThresholds({ ...localThresholds, aiCriticalThreshold: val });
                      }}
                      className="w-16 text-xs text-center font-mono font-bold p-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                    <span className="text-xs font-semibold text-slate-500">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={20}
                  max={85}
                  value={localThresholds.aiCriticalThreshold}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setLocalThresholds({
                      ...localThresholds,
                      aiCriticalThreshold: Math.max(val, localThresholds.aiWarningThreshold + 1),
                    });
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
                <p className="text-[11px] text-slate-500">
                  Déclenche une alerte de rédaction générative non autorisée avec demande de justificatif à l'étudiant/chercheur.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Paramètres d'analyse et actions automatisées */}
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-7 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Sensibilité de Détection & Actions Automatisées
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Longueur minimale de correspondance (Mots consécutifs)
                  </label>
                  <p className="text-[11px] text-slate-400 mb-2">
                    Nombre minimal de mots identiques consécutifs requis pour constituer un passage plagié.
                  </p>
                  <div className="flex gap-2">
                    {[6, 8, 10, 12, 16].map((words) => (
                      <button
                        key={words}
                        type="button"
                        onClick={() => setLocalThresholds({ ...localThresholds, minMatchingWords: words })}
                        className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                          localThresholds.minMatchingWords === words
                            ? 'bg-[#3978D5] text-white border-[#3978D5]'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {words} mots
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localThresholds.excludeQuotedByDefault}
                      onChange={(e) =>
                        setLocalThresholds({ ...localThresholds, excludeQuotedByDefault: e.target.checked })
                      }
                      className="mt-0.5 rounded text-[#3978D5] focus:ring-[#3978D5]"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Exclure par défaut les citations entre guillemets ("...")
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Les citations exactes correctement référencées ne feront pas gonfler le score de plagiat.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localThresholds.excludeBibliographyByDefault}
                      onChange={(e) =>
                        setLocalThresholds({ ...localThresholds, excludeBibliographyByDefault: e.target.checked })
                      }
                      className="mt-0.5 rounded text-[#3978D5] focus:ring-[#3978D5]"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Exclure par défaut les bibliographies & références
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Ignore automatiquement les listes bibliographiques en fin de mémoire/thèse.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Actions Déclenchées en Cas de Dépassement
                </span>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <input
                      type="checkbox"
                      checked={localThresholds.autoFlagSubmissions}
                      onChange={(e) =>
                        setLocalThresholds({ ...localThresholds, autoFlagSubmissions: e.target.checked })
                      }
                      className="mt-0.5 rounded text-[#3978D5] focus:ring-[#3978D5]"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Marquage automatique en Alerte d'Intégrité
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Assigne immédiatement le statut "En Alerte" dans le tableau de bord enseignant/superviseur.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
                    <input
                      type="checkbox"
                      checked={localThresholds.requireHumanReviewOnBreach}
                      onChange={(e) =>
                        setLocalThresholds({ ...localThresholds, requireHumanReviewOnBreach: e.target.checked })
                      }
                      className="mt-0.5 rounded text-[#3978D5] focus:ring-[#3978D5]"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        Comité de révision humaine obligatoire
                      </span>
                      <p className="text-[11px] text-slate-400">
                        Interdit la validation du mémoire tant qu'un rapporteur n'a pas signé manuellement le rapport.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions & Save button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => applyPreset('standard')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rétablir les valeurs par défaut</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveThresholds()}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Enregistrer et Appliquer les Nouveaux Seuils</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Profile */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal / Academic Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Academic Email Address (Primary Identity)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full text-xs p-2.5 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Institution / Affiliation
                </label>
                <input
                  type="text"
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Department / Research Field
                </label>
                <input
                  type="text"
                  value={academicField}
                  onChange={(e) => setAcademicField(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#3978D5]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Preferences */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Interface Language
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    language === 'en'
                      ? 'border-[#3978D5] bg-blue-50 dark:bg-blue-950/40 text-[#3978D5]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  English (United States / UK)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('fr')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    language === 'fr'
                      ? 'border-[#3978D5] bg-blue-50 dark:bg-blue-950/40 text-[#3978D5]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Français (France)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Color Theme
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    theme === 'light'
                      ? 'border-[#3978D5] bg-blue-50 text-[#3978D5]'
                      : 'border-slate-200 text-slate-700'
                  }`}
                >
                  Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                    theme === 'dark'
                      ? 'border-[#3978D5] bg-blue-950/40 text-[#3978D5]'
                      : 'border-slate-700 text-slate-300'
                  }`}
                >
                  Dark Mode
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Security */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Update Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full text-xs p-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert('Password updated securely.')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#3978D5] rounded-xl"
              >
                Update Password
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Multi-Factor Authentication (2FA)</h3>
            <p className="text-xs text-slate-500">Protect your academic submissions with TOTP Authenticator apps.</p>
            <button
              type="button"
              onClick={() => alert('TOTP Authenticator enrollment active.')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200"
            >
              Enable 2FA Authenticator
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: Billing */}
      {activeTab === 'billing' && (
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Current Plan</p>
              <h3 className="text-base font-bold text-slate-900 dark:text-white capitalize">
                {user?.plan} Pro ($12 / month)
              </h3>
            </div>
            <button
              onClick={() => onNavigate('/pricing')}
              className="px-4 py-2 text-xs font-semibold text-[#3978D5] hover:underline"
            >
              Change Tier
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Invoices</h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span>Invoice #INV-2026-1102 ($12.00)</span>
                <span className="font-mono text-emerald-600 font-semibold">PAID</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span>Invoice #INV-2026-1002 ($12.00)</span>
                <span className="font-mono text-emerald-600 font-semibold">PAID</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Notifications */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email & In-App Alerts</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3978D5]" />
              <span>Email notification when an academic analysis completes</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-[#3978D5]" />
              <span>Monthly quota balance reminders</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded text-[#3978D5]" />
              <span>Institutional campus newsletter and research integrity alerts</span>
            </label>
          </div>
        </div>
      )}

      {/* TAB 6: Sessions */}
      {activeTab === 'sessions' && (
        <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm text-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Login Sessions</h3>
          <div className="space-y-2">
            <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">Chrome on macOS (Current Session)</p>
                <p className="text-[11px] text-slate-400">Paris, France · IP: 82.64.120.44</p>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-mono">
                ACTIVE
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => alert('Account deletion request queued under FERPA/GDPR compliance.')}
              className="text-xs text-red-600 hover:underline font-semibold flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Request Account & Document Data Deletion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
