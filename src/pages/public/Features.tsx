import React, { useState } from 'react';
import { useTranslation } from '../../services/i18n/context';
import {
  Search,
  Cpu,
  FileCheck2,
  GitCompare,
  Building2,
  Globe2,
  ShieldCheck,
  FileText,
  Lock,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

interface FeaturesProps {
  onNavigate: (path: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const isFr = language === 'fr';
  const [activeTab, setActiveTab] = useState<'all' | 'plagiarism' | 'ai' | 'institution'>('all');

  const featuresList = isFr
    ? [
        {
          id: 'plag-detection',
          category: 'plagiarism',
          icon: Search,
          title: 'Détection Approfondie du Plagiat & Similarités',
          tagline: 'Algorithmes n-grammes de haute précision adaptés aux corpus universitaires',
          description:
            'Compare vos mémoires et thèses avec plus de 120 millions de publications, dépôts universitaires en libre accès et corpus des universités partenaires (Université de Dschang, University of Bamenda).',
          bulletPoints: [
            'Alignement au niveau de la phrase et détection de sous-chaînes contiguës',
            'Isolement automatique des citations directes entre guillemets et passages en retrait',
            'Exclusion paramétrable des bibliographies (normes APA, IEEE, CAMES, MLA)',
            'Visualiseur split-screen côte à côte avec surlignage des passages concordants',
          ],
          badgeColor: 'text-[#3978D5] bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
        },
        {
          id: 'ai-detection',
          category: 'ai',
          icon: Cpu,
          title: 'Analyse Stylométrique du Contenu IA',
          tagline: 'Modélisation de la perplexité lexicale et score de burstiness',
          description:
            'Évalue la variation de rythme syntaxique et les schémas de transition stéréotypés pour identifier les passages statistiquement caractéristiques des grands modèles de langage génératifs.',
          bulletPoints: [
            'Mesure de burstiness : analyse de la variance de la longueur des phrases',
            'Estimation de la perplexité : repérage du vocabulaire prévisible et des formules convenues',
            'Passages surlignés en violet avec explications stylistiques et linguistiques contextuelles',
            'Charte déontologique claire : conçue comme aide à l’appréciation des jurys, sans accusation arbitraire',
          ],
          badgeColor: 'text-[#8B68D8] bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
        },
        {
          id: 'dual-reports',
          category: 'all',
          icon: FileCheck2,
          title: 'Rapports Doubles & Certificats Vérifiables',
          tagline: 'Attestations d’intégrité scellées avec empreinte cryptographique SHA-256',
          description:
            'Générez des rapports institutionnels complets avec métriques dissociées pour la similarité et la probabilité IA, prêts pour le dépôt officiel auprès des commissions de soutenance.',
          bulletPoints: [
            'Certificat officiel au format PDF téléchargeable avec QR code et horodatage certifié',
            'Dissociation explicite entre similarité documentaire et régularité de syntaxe IA',
            'Historique complet des soumissions et suivi des révisions successives',
            'Empreinte SHA-256 infalsifiable pour attester de l’intégrité du document déposé',
          ],
          badgeColor: 'text-[#269B72] bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        },
        {
          id: 'custom-sources',
          category: 'plagiarism',
          icon: GitCompare,
          title: 'Vérification Multi-Sources Personnalisée',
          tagline: 'Importez vos propres corpus de cours et travaux de recherche',
          description:
            'Uploadez vos propres documents de référence ou bases documentaires d’examen pour comparer un devoir ou un mémoire avec vos cours et travaux antérieurs spécifiques.',
          bulletPoints: [
            'Ajout rapide de documents de référence par glisser-déposer ou copier-coller',
            'Comparaison instantanée n-gramme avec pondération personnalisée par document',
            'Génération d’une matrice de recoupement multi-sources détaillée',
            'Idéal pour vérifier la conformité avec des supports de cours ou devoirs de la même promotion',
          ],
          badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        },
        {
          id: 'subject-banks',
          category: 'institution',
          icon: Building2,
          title: 'Banques de Données par Matière & Filière',
          tagline: 'Structuration des corpus universitaires par département académique',
          description:
            'Permet aux facultés (Sciences, FASA, FSEG, ColTech, Lettres) d’alimenter des banques de mémoires thématiques pour prévenir la réutilisation non créditée d’une année sur l’autre.',
          bulletPoints: [
            'Organisation par département, matière ou spécialité universitaire',
            'Indexation continue des mémoires de Master 2 et thèses soutenues avec succès',
            'Activation/désactivation sélective des banques lors des campagnes d’analyse',
            'Souveraineté universitaire totale : données hébergées de manière hermétique',
          ],
          badgeColor: 'text-[#3978D5] bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
        },
        {
          id: 'research-papers',
          category: 'institution',
          icon: ShieldCheck,
          title: 'Protection des Articles Pré-Publication',
          tagline: 'Validation de l’antériorité scientifique et prévention des litiges',
          description:
            'Permet aux enseignants-chercheurs d’enregistrer leurs manuscrits avant soumission externe, d’attester de l’antériorité de leurs résultats et d’obtenir le visa du Conseil Scientifique.',
          bulletPoints: [
            'Dépôt sécurisé des manuscrits en pré-publication avec archivage horodaté',
            'Recoupement avec les mémoires internes pour éviter toute auto-citation non déclarée',
            'Émission d’un certificat d’antériorité du Conseil Scientifique Universitaire',
            'Réservation et traçabilité des identifiants DOI et pré-prints',
          ],
          badgeColor: 'text-[#8B68D8] bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
        },
      ]
    : [
        {
          id: 'plag-detection',
          category: 'plagiarism',
          icon: Search,
          title: 'Plagiarism & Similarity Detection',
          tagline: 'Precision N-gram matching across academic literature',
          description:
            'Analyzes documents using winnowing shingling algorithms against 120M+ research publications, thesis repositories, and indexed online academic resources.',
          bulletPoints: [
            'Sentence-level alignment and contiguous substring matching',
            'Automatic detection and isolation of direct block quotations',
            'Optional exclusion of bibliography and reference lists (APA, IEEE, MLA)',
            'Side-by-side split screen document comparison viewer',
          ],
          badgeColor: 'text-[#3978D5] bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
        },
        {
          id: 'ai-detection',
          category: 'ai',
          icon: Cpu,
          title: 'AI Content Statistical Analysis',
          tagline: 'Linguistic burstiness and perplexity modeling',
          description:
            'Evaluates sentence variance, formulaic transitions, and token distribution to detect passages statistically associated with generative large language models.',
          bulletPoints: [
            'Burstiness measurement: analyzes variation in sentence length and rhythm',
            'Perplexity estimation: highlights predictable vocabulary and boilerplate transitions',
            'Purple highlighted passages with contextual linguistic explanations',
            'Clear ethical disclaimers: designed as advisory faculty guidance, not definitive accusations',
          ],
          badgeColor: 'text-[#8B68D8] bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
        },
        {
          id: 'dual-reports',
          category: 'all',
          icon: FileCheck2,
          title: 'Verifiable Dual Reports & Certificates',
          tagline: 'Independently computed similarity and AI probability metrics',
          description:
            'Generates comprehensive audit certificates with SHA-256 cryptographic hashes, designed for formal thesis submission and faculty review.',
          bulletPoints: [
            'Downloadable official PDF report with immutable verification certificate',
            'Strict separation between similarity index and AI probability',
            'Sentence-by-sentence match annotations with verbatim text side-by-side',
            'Exportable for institutional archive and LMS gradebooks',
          ],
          badgeColor: 'text-[#269B72] bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
        },
        {
          id: 'custom-sources',
          category: 'plagiarism',
          icon: GitCompare,
          title: 'Custom Multi-Source Plagiarism Engine',
          tagline: 'Upload your own datasets and course reference files',
          description:
            'Allows students and instructors to verify documents against their own uploaded data files, lecture slides, and custom corpora.',
          bulletPoints: [
            'Upload custom reference documents via drag-and-drop or pasting',
            'Sentence-by-sentence alignment against your private files',
            'Source-by-source contribution matrix and breakdown',
            '100% private to your session, never uploaded to public databases',
          ],
          badgeColor: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
        },
        {
          id: 'subject-banks',
          category: 'institution',
          icon: Building2,
          title: 'Subject-Specific Institutional Data Banks',
          tagline: 'Organize academic archives by departmental curriculum',
          description:
            'Enables university faculties (Sciences, Agronomy, Engineering, Economics, Humanities) to curate discipline-specific reference banks to prevent cross-cohort plagiarism.',
          bulletPoints: [
            'Structured by department, major, or degree cohort',
            'Continual indexing of past MSc theses and defended dissertations',
            'Toggle data banks active or inactive during plagiarism screening',
            'Full campus sovereignty with zero third-party commercial data sharing',
          ],
          badgeColor: 'text-[#3978D5] bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
        },
        {
          id: 'research-papers',
          category: 'institution',
          icon: ShieldCheck,
          title: 'Pre-Publication Research Paper Protection',
          tagline: 'Scientific priority registration and anti-fraud verification',
          description:
            'Empowers professors and doctoral researchers to register papers prior to external peer review, securing priority claims and certifying originality with the Scientific Board.',
          bulletPoints: [
            'Pre-submission manuscript escrow with cryptographic timestamping',
            'Cross-check against university repository to prevent duplicate publication',
            'Institutional certificate of priority and originality issued by the Dean',
            'DOI pre-reservation tracking and research grant compliance',
          ],
          badgeColor: 'text-[#8B68D8] bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
        },
      ];

  const filteredFeatures =
    activeTab === 'all' ? featuresList : featuresList.filter((f) => f.category === activeTab || f.category === 'all');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#3978D5] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 px-3 py-1 rounded-full">
          <Globe2 className="w-3.5 h-3.5" />
          <span>{isFr ? 'Fonctionnalités Plateforme ScholarShield' : 'ScholarShield Platform Capabilities'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white tracking-tight">
          {isFr ? 'Une Suite Complète pour la Rigueur Universitaire' : 'Enterprise Features for Academic Rigor'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {isFr
            ? 'Découvrez les capacités modulaires de ScholarShield, de la détection de similarités textuelles au surlignage stylométrique d’IA, adaptées aux réalités des universités camerounaises et internationales.'
            : 'Explore the modular capabilities powering ScholarShield, from sentence-level plagiarism cross-checking to stylometric AI content detection.'}
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-1.5 pt-4">
          <div className="inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-[#14243A] text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isFr ? 'Toutes' : 'All Features'}
            </button>
            <button
              onClick={() => setActiveTab('plagiarism')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'plagiarism'
                  ? 'bg-white dark:bg-[#14243A] text-[#3978D5] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isFr ? 'Plagiat & Similarités' : 'Plagiarism'}
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'ai'
                  ? 'bg-white dark:bg-[#14243A] text-[#8B68D8] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isFr ? 'Détection IA' : 'AI Detection'}
            </button>
            <button
              onClick={() => setActiveTab('institution')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'institution'
                  ? 'bg-white dark:bg-[#14243A] text-emerald-600 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isFr ? 'Portail Universitaire' : 'Institutional'}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFeatures.map((feat) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.id}
              className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-7 space-y-5 hover:border-[#3978D5]/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200">
                    <Icon className="w-5 h-5 text-[#3978D5]" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${feat.badgeColor}`}>
                    {feat.category.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs font-medium text-[#3978D5] dark:text-blue-400 mt-0.5">
                    {feat.tagline}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feat.description}
                </p>

                <ul className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {feat.bulletPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-[#269B72] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate('/signup')}
                  className="w-full py-2 text-xs font-semibold text-[#3978D5] hover:text-[#2F65B5] bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100/60 dark:hover:bg-blue-900/60 rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{isFr ? 'Tester cette fonctionnalité' : 'Try this feature'}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* University Integration Callout */}
      <div className="bg-[#14243A] text-white rounded-3xl p-8 sm:p-12 border border-[#23334A] flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#3978D5] bg-blue-950/80 px-2.5 py-1 rounded">
            <span>{isFr ? 'PÔLE UNIVERSITAIRE CAMEROUN' : 'CAMEROON ACADEMIC CONSORTIUM'}</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans']">
            {isFr
              ? 'Déployé en partenariat avec l’Université de Dschang et l’University of Bamenda'
              : 'Deployed in partnership with the University of Dschang and University of Bamenda'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {isFr
              ? 'Nos équipes travaillent en concertation étroite avec les doyens et jurys de thèse pour garantir la conformité aux exigences des diplômes d’État et du CAMES.'
              : 'Our technical teams work in direct collaboration with deans and doctoral committees to guarantee compliance with national academic evaluation standards.'}
          </p>
        </div>
        <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('/contact')}
            className="px-6 py-3 text-xs font-semibold text-[#14243A] bg-white hover:bg-slate-100 rounded-xl shadow-md transition-all text-center"
          >
            {isFr ? 'Contacter l’équipe Cameroun' : 'Contact Cameroon Team'}
          </button>
          <button
            onClick={() => onNavigate('/signup')}
            className="px-6 py-3 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-md transition-all text-center"
          >
            {isFr ? 'Créer un Compte' : 'Get Started'}
          </button>
        </div>
      </div>
    </div>
  );
};
