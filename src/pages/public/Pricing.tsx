import React, { useState } from 'react';
import { useTranslation } from '../../services/i18n/context';
import { Check, HelpCircle, ArrowRight, ShieldCheck, Zap, Sparkles, CreditCard, Smartphone } from 'lucide-react';

interface PricingProps {
  onNavigate: (path: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const isFr = language === 'fr';
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [currency, setCurrency] = useState<'XAF' | 'USD'>('XAF');

  const plansData = [
    {
      id: 'plan-free',
      name: isFr ? 'Découverte Académique' : 'Free Academic Starter',
      badge: null,
      priceXafMonthly: 0,
      priceXafYearly: 0,
      priceUsdMonthly: 0,
      priceUsdYearly: 0,
      quotaWords: '5 000',
      maxSize: '8 MB',
      description: isFr
        ? 'Idéal pour tester l’analyse de similarité sur un premier chapitre ou devoir universitaire.'
        : 'Ideal for trying out similarity screening on a first coursework chapter or short essay.',
      features: isFr
        ? [
            'Jusqu’à 3 analyses de documents / mois',
            'Détection de similarité textuelle standard (10M sources)',
            'Extraction et lecture complète de fichiers PDF / DOCX',
            'Rapport synthétique consultable en ligne',
          ]
        : [
            'Up to 3 document analyses / month',
            'Standard text similarity engine (10M sources)',
            'Full text parsing for PDF / Word DOCX files',
            'Web view analytical similarity report',
          ],
      buttonText: isFr ? 'Commencer gratuitement' : 'Start Free',
      isPopular: false,
    },
    {
      id: 'plan-student',
      name: isFr ? 'Formule Personnelle & Auteur' : 'Individual Author & Researcher',
      badge: isFr ? 'Le Plus Choisi' : 'Most Popular',
      priceXafMonthly: 3500,
      priceXafYearly: 35000,
      priceUsdMonthly: 6,
      priceUsdYearly: 60,
      quotaWords: '50 000',
      maxSize: '32 MB',
      description: isFr
        ? 'Dédiée aux auteurs indépendants, doctorants et chercheurs effectuant leurs vérifications documentaires en autonomie.'
        : 'Dedicated to independent authors, doctoral scholars, and writers conducting document verifications autonomously.',
      features: isFr
        ? [
            'Analyse approfondie face à 120M+ publications',
            'Détection probabiliste d’IA & analyse stylométrique',
            'Certificat d’intégrité officiel SHA-256 avec QR code',
            'Exclusion automatique des citations et bibliographies',
            'Accès au comparateur multi-sources de données personnelles',
          ]
        : [
            'Deep similarity detection against 120M+ publications',
            'AI content probability & stylometric burstiness score',
            'Official SHA-256 cryptographic certificate with QR code',
            'Automatic exclusion of citations and references',
            'Access to multi-source custom reference comparison',
          ],
      buttonText: isFr ? 'Choisir la formule Individuelle' : 'Select Individual Plan',
      isPopular: true,
    },
    {
      id: 'plan-faculty',
      name: isFr ? 'Enseignant & Chercheur' : 'Faculty & Researcher',
      badge: null,
      priceXafMonthly: 15000,
      priceXafYearly: 150000,
      priceUsdMonthly: 25,
      priceUsdYearly: 250,
      quotaWords: '250 000',
      maxSize: '64 MB',
      description: isFr
        ? 'Pour professeurs, membres de jurys de soutenance et chercheurs préparant des publications CAMES.'
        : 'For professors, defense jury members, and researchers preparing CAMES publications.',
      features: isFr
        ? [
            'Traitement prioritaire haute vitesse sur le cluster',
            'Détection translinguistique avancée (anglais/français/espagnol)',
            'Visualiseur interactif côte-à-côte passage par passage',
            'Vérification des banques de données scientifiques par matière',
            'Historique complet des soumissions et versions successives',
            'Support académique prioritaire par email & WhatsApp',
          ]
        : [
            'High-priority cluster queue processing',
            'Deep cross-lingual similarity (English/French/Spanish)',
            'Interactive side-by-side passage matching viewer',
            'Subject corpus data bank verification access',
            'Complete version history and revision tracking',
            'Priority academic support via email and WhatsApp',
          ],
      buttonText: isFr ? 'Choisir la formule Enseignant' : 'Select Faculty Plan',
      isPopular: false,
    },
    {
      id: 'plan-institution',
      name: isFr ? 'Campus Universitaire' : 'University Campus',
      badge: isFr ? 'Institutionnel' : 'Institutional',
      priceXafMonthly: 150000,
      priceXafYearly: 1500000,
      priceUsdMonthly: 249,
      priceUsdYearly: 2490,
      quotaWords: '5 000 000+',
      maxSize: '128 MB',
      description: isFr
        ? 'Déploiement global pour facultés et universités (UDs, UBa) avec base de mémoires fermée et souveraine.'
        : 'Campus-wide deployment for university faculties (UDs, UBa) with a private sovereign repository.',
      features: isFr
        ? [
            'Comptes illimités pour départements, enseignants et étudiants',
            'Banque souveraine de mémoires et thèses internes non exposée',
            'Authentification SSO (SAML 2.0 / Google Workspace / Azure)',
            'Intégration ENT / LMS (Moodle, Canvas, Classroom)',
            'Gestionnaire d’articles scientifiques avant publication',
            'Accord de niveau de service (SLA 99,9%) et formation sur site',
          ]
        : [
            'Unlimited departmental, faculty, and student seats',
            'Private sovereign internal thesis repository (unindexed externally)',
            'SSO Authentication (SAML 2.0 / Google / Azure AD)',
            'Campus LMS integration (Moodle, Canvas, Classroom)',
            'Pre-publication scientific research articles management',
            'Institutional SLA 99.9% and on-campus onboarding',
          ],
      buttonText: isFr ? 'Contacter la Direction Académique' : 'Contact Campus Sales',
      isPopular: false,
    },
  ];

  const comparisonFeatures = isFr
    ? [
        {
          feature: 'Moteur de Similarité & Plagiat',
          free: 'Standard (10M sources)',
          student: 'Étendu (120M+ publications)',
          pro: 'Étendu + Translinguistique',
          inst: 'Total + Archives Campus Souveraines',
        },
        {
          feature: 'Détection Stylométrique d’IA',
          free: '—',
          student: 'Probabilité & Écarts Inclus',
          pro: 'Inclus + Cartographie de perplexité',
          inst: 'Inclus + Tendances par facultés',
        },
        {
          feature: 'Quota Mensuel de Mots',
          free: '5 000 mots',
          student: '50 000 mots',
          pro: '250 000 mots',
          inst: '5 000 000+ mots (illimité sur devis)',
        },
        {
          feature: 'Taille Maximale de Fichier',
          free: '8 Mo',
          student: '32 Mo',
          pro: '64 Mo',
          inst: '128 Mo',
        },
        {
          feature: 'Certificat PDF Officiel Infalsifiable',
          free: 'Aperçu filigrané',
          student: 'Certificat Officiel SHA-256',
          pro: 'Prêt pour revues & colloques',
          inst: 'Certificat aux armoiries de l’Université',
        },
        {
          feature: 'Exclusion Citations & Bibliographie',
          free: '—',
          student: 'Inclus (Normes CAMES / APA / IEEE)',
          pro: 'Inclus',
          inst: 'Inclus avec paramétrage custom',
        },
        {
          feature: 'Banque de Données Personnalisée / Matières',
          free: '—',
          student: 'Jusqu’à 5 sources privées',
          pro: 'Sources illimitées',
          inst: 'Banques par matières & corpus global',
        },
        {
          feature: 'Gestion des Départements & Jurys',
          free: '—',
          student: '—',
          pro: '—',
          inst: 'Facultés et classes illimitées',
        },
        {
          feature: 'Moyens de Paiement Supportés',
          free: 'Accès libre',
          student: 'Orange Money, MTN MoMo, Visa/Mastercard',
          pro: 'Orange Money, MTN MoMo, Carte, Virement',
          inst: 'Bon de commande université / Virement Trésor',
        },
      ]
    : [
        {
          feature: 'Plagiarism & Similarity Engine',
          free: 'Basic (10M sources)',
          student: 'Comprehensive (120M+ papers)',
          pro: 'Comprehensive + Cross-lingual',
          inst: 'Full + Sovereign Campus Archive',
        },
        {
          feature: 'AI Content Stylometric Detection',
          free: '—',
          student: 'Included (Probability score)',
          pro: 'Included + Perplexity heatmap',
          inst: 'Included + Departmental trend analytics',
        },
        {
          feature: 'Monthly Word Allowance',
          free: '5,000 words',
          student: '50,000 words',
          pro: '250,000 words',
          inst: '5,000,000+ words',
        },
        {
          feature: 'Max Upload File Size',
          free: '8 MB',
          student: '32 MB',
          pro: '64 MB',
          inst: '128 MB',
        },
        {
          feature: 'Official Cryptographic Certificate',
          free: 'Watermarked Web View',
          student: 'Official SHA-256 Validated PDF',
          pro: 'Journal & Defense Ready',
          inst: 'University-Branded Custom PDF',
        },
        {
          feature: 'Citation & Bibliography Exclusion',
          free: '—',
          student: 'Included (CAMES / APA / IEEE)',
          pro: 'Included',
          inst: 'Included with customizable rules',
        },
        {
          feature: 'Custom Reference Sources / Data Banks',
          free: '—',
          student: 'Up to 5 private sources',
          pro: 'Unlimited custom sources',
          inst: 'Subject banks & full campus corpus',
        },
        {
          feature: 'Department & Faculty Management',
          free: '—',
          student: '—',
          pro: '—',
          inst: 'Unlimited faculties, cohorts & classes',
        },
        {
          feature: 'Supported Payment Channels',
          free: 'Free access',
          student: 'MTN MoMo, Orange Money, Credit Card',
          pro: 'MTN MoMo, Orange Money, Card, Bank Wire',
          inst: 'Institutional PO, Treasury Wire, Invoice',
        },
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#3978D5]/10 text-[#3978D5] border border-[#3978D5]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isFr ? 'Tarification Transparente & Adaptée' : 'Transparent & Adaptable Pricing'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white tracking-tight">
          {isFr ? 'Des Formules Conçues pour le Monde Universitaire' : 'Academic Plans Built for Integrity'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {isFr
            ? 'Adapté aux étudiants de Master, enseignants-chercheurs et universités camerounaises (Université de Dschang, University of Bamenda) avec paiements locaux simples.'
            : 'Tailored for postgraduate students, faculty members, and Cameroonian universities (Université de Dschang, University of Bamenda) with easy local payment methods.'}
        </p>

        {/* Controls: Billing Cycle + Currency */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          {/* Billing Cycle Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-[#14243A] text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {isFr ? 'Facturation Mensuelle' : 'Monthly Billing'}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly'
                  ? 'bg-white dark:bg-[#14243A] text-[#3978D5] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>{isFr ? 'Facturation Annuelle' : 'Annual Billing'}</span>
              <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
                {isFr ? '-20% d’économie' : 'Save 20%'}
              </span>
            </button>
          </div>

          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              onClick={() => setCurrency('XAF')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currency === 'XAF'
                  ? 'bg-[#3978D5] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>FCFA (XAF)</span>
              <span className="text-[10px] opacity-80">Cameroun</span>
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-3 py-2 rounded-lg transition-all ${
                currency === 'USD'
                  ? 'bg-[#3978D5] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plansData.map((plan) => {
          const isEnterprise = plan.id === 'plan-institution';
          const displayPrice =
            currency === 'XAF'
              ? billingCycle === 'monthly'
                ? plan.priceXafMonthly.toLocaleString()
                : Math.round(plan.priceXafYearly / 12).toLocaleString()
              : billingCycle === 'monthly'
              ? plan.priceUsdMonthly
              : Math.round(plan.priceUsdYearly / 12);

          const currencySymbol = currency === 'XAF' ? 'FCFA' : '$';

          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-[#14243A] rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                plan.isPopular
                  ? 'border-[#3978D5] shadow-lg ring-2 ring-[#3978D5]/20'
                  : 'border-[#E7EBF1] dark:border-[#23334A] hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#3978D5] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                      {currency === 'XAF' ? `${displayPrice} ${currencySymbol}` : `${currencySymbol}${displayPrice}`}
                    </span>
                    <span className="text-xs text-slate-500">
                      {isFr ? '/ mois' : '/ month'}
                    </span>
                  </div>
                  {billingCycle === 'yearly' && (plan.priceXafYearly > 0 || plan.priceUsdYearly > 0) && (
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                      {isFr
                        ? currency === 'XAF'
                          ? `${plan.priceXafYearly.toLocaleString()} FCFA facturés par an`
                          : `$${plan.priceUsdYearly} facturés par an`
                        : currency === 'XAF'
                        ? `${plan.priceXafYearly.toLocaleString()} FCFA billed annually`
                        : `$${plan.priceUsdYearly} billed annually`}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Quota overview */}
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1 text-xs border border-slate-100 dark:border-slate-700/50">
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>{isFr ? 'Quota mensuel :' : 'Monthly quota:'}</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {plan.quotaWords} {isFr ? 'mots' : 'words'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>{isFr ? 'Taille max fichier :' : 'Max file size:'}</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-white">
                      {plan.maxSize}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs text-slate-600 dark:text-slate-300">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#269B72] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    if (isEnterprise) {
                      onNavigate('/contact');
                    } else {
                      onNavigate('/signup');
                    }
                  }}
                  className={`w-full py-2.5 text-xs font-semibold rounded-xl transition-all ${
                    plan.isPopular
                      ? 'bg-[#3978D5] text-white hover:bg-[#2F65B5] shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Local Payment Methods Banner */}
      <div className="bg-slate-50 dark:bg-[#14243A]/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-[#3978D5] uppercase tracking-wider">
            <Smartphone className="w-4 h-4" />
            <span>{isFr ? 'Paiements Locaux au Cameroun & Internationaux' : 'Local Cameroonian & Global Payments'}</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {isFr
              ? 'Réglez vos analyses instantanément par Mobile Money'
              : 'Pay for analyses instantly via Mobile Money and Cards'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            {isFr
              ? 'Support complet des règlements Orange Money Cameroun, MTN Mobile Money (MoMo), cartes bancaires Visa / Mastercard, et bons de commande universitaires.'
              : 'Full support for Orange Money Cameroon, MTN Mobile Money (MoMo), Visa / Mastercard, and university institutional purchase orders.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold">
            MTN MoMo
          </span>
          <span className="px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 text-orange-700 dark:text-orange-400 rounded-lg text-xs font-bold">
            Orange Money
          </span>
          <span className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 rounded-lg text-xs font-bold">
            Visa / Mastercard
          </span>
          <span className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-lg text-xs font-bold">
            {isFr ? 'Virement Trésor / PO' : 'Bank Wire / PO'}
          </span>
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            {isFr ? 'Tableau Comparatif Détaillé des Fonctionnalités' : 'Comprehensive Tier Feature Comparison'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isFr
              ? 'Détail exhaustif des capacités du moteur d’analyse et des options d’intégration universitaire.'
              : 'Detailed breakdown of engine capabilities and institutional options across all plans.'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <tr>
                <th className="py-3 px-5 font-semibold">{isFr ? 'Capacité' : 'Capability'}</th>
                <th className="py-3 px-4 font-semibold">{isFr ? 'Gratuit' : 'Free'}</th>
                <th className="py-3 px-4 font-semibold text-[#3978D5]">{isFr ? 'Individuel' : 'Individual Pro'}</th>
                <th className="py-3 px-4 font-semibold">{isFr ? 'Enseignant' : 'Faculty'}</th>
                <th className="py-3 px-4 font-semibold">{isFr ? 'Université' : 'University'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {comparisonFeatures.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-5 font-medium text-slate-900 dark:text-white">{row.feature}</td>
                  <td className="py-3.5 px-4">{row.free}</td>
                  <td className="py-3.5 px-4 font-medium text-[#3978D5]">{row.student}</td>
                  <td className="py-3.5 px-4">{row.pro}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">{row.inst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
