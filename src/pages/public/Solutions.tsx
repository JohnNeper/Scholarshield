import React, { useState } from 'react';
import { useTranslation } from '../../services/i18n/context';
import {
  GraduationCap,
  BookOpen,
  Microscope,
  Building2,
  CheckCircle2,
  ArrowRight,
  Shield,
  FileCheck,
  Award,
  Sparkles,
} from 'lucide-react';

interface SolutionsProps {
  onNavigate: (path: string) => void;
}

export const Solutions: React.FC<SolutionsProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const isFr = language === 'fr';
  const [selectedRole, setSelectedRole] = useState<'students' | 'teachers' | 'researchers' | 'universities'>('students');

  const content = {
    fr: {
      badge: 'Architecture Spécialisée par Rôle',
      title: 'Solutions d’Intégrité Académique Dédiées',
      subtitle:
        'Conçu au Cameroun pour répondre aux exigences rigoureuses des mémoires d’ingénieurs, thèses de doctorat et publications scientifiques universitaires.',
      roles: {
        students: {
          tab: 'Étudiants & Masters',
          title: 'Pour Étudiants, Ingénieurs & Mémorants',
          subtitle:
            'Déposez vos mémoires, rapports de stage et thèses en toute sérénité devant vos jurys académiques.',
          points: [
            'Contrôle préventif avant soutenance officielle (Université de Dschang, University of Bamenda, etc.) pour éliminer tout emprunt non cité.',
            'Isolement automatique des citations bibliographiques et formules conformes aux normes APA, MLA, IEEE ou CAMES.',
            'Génération d’un certificat officiel d’intégrité infalsifiable avec empreinte cryptographique SHA-256 à annexer au mémoire.',
            'Support multi-format immédiat pour fichiers PDF, Word (.docx) et documents numérisés avec extraction textuelle UTF-8.',
          ],
          ctaText: 'Lancer une vérification de mémoire',
          ctaPath: '/app/analysis/new',
          stat: '98,7%',
          statLabel: 'Taux de validation sans réserve auprès des jurys de soutenance',
        },
        teachers: {
          tab: 'Enseignants & Jurys',
          title: 'Pour Professeurs, Chargés de Cours & Jurys',
          subtitle:
            'Accélérez l’évaluation des promotions entières grâce à des rapports de similarité objectifs et traçables.',
          points: [
            'Analyse simultanée par cohorte de centaines de copies et mémoires de fin de semestre.',
            'Comparaison synchrone côte-à-côte avec surlignage des concordances issues du web, de revues et des archives internes.',
            'Distinction scientifique rigoureuse entre plagiat textuel direct et indices probabilistes de génération IA.',
            'Rapports d’expertise téléchargeables pour les délibérations de jurys et conseils de discipline.',
          ],
          ctaText: 'Accéder à l’espace enseignant',
          ctaPath: '/institution/dashboard',
          stat: '4,5x',
          statLabel: 'Gain de temps lors des corrections et évaluations de jurys',
        },
        researchers: {
          tab: 'Chercheurs & Doctorants',
          title: 'Pour Enseignants-Chercheurs & Candidats CAMES',
          subtitle:
            'Protégez vos articles scientifiques, communications de colloque et dossiers d’avancement académique.',
          points: [
            'Confrontation pré-soumission face à un corpus mondial de plus de 120M+ publications indexées (arXiv, PubMed, Springer, IEEE).',
            'Détection translinguistique avancée (anglais, français, espagnol) pour identifier les paraphrases et traductions non attribuées.',
            'Conformité stricte avec les exigences d’éthique et de probité scientifique du CAMES et des comités éditoriaux.',
            'Garantie absolue de non-divulgation : vos manuscrits inédits restent strictement confidentiels et ne sont jamais indexés publiquement.',
          ],
          ctaText: 'Vérifier un manuscrit scientifique',
          ctaPath: '/app/analysis/new',
          stat: '120M+',
          statLabel: 'Publications et revues scientifiques indexées dans la base de référence',
        },
        universities: {
          tab: 'Universités & Campus',
          title: 'Pour Rectorats, Doyens & Conseils Scientifiques',
          subtitle:
            'Déployez une infrastructure d’intégrité institutionnelle souveraine à l’échelle de l’ensemble de vos campus.',
          points: [
            'Constitution d’une banque de données institutionnelle fermée : croisez les mémoires de vos facultés (FASA, ColTech, Sciences, FSJP) sans exposition externe.',
            'Validation pilote en cours à l’Université de Dschang (UDs) et à l’University of Bamenda (UBa) pour la protection du patrimoine intellectuel national.',
            'Gestion hiérarchique par facultés, départements et filières avec quotas personnalisés et rôles stricts.',
            'Tableaux de bord analytiques sur l’évolution pluriannuelle des indices d’intégrité et statistiques d’audit.',
          ],
          ctaText: 'Demander un accord universitaire',
          ctaPath: '/contact',
          stat: '2+',
          statLabel: 'Grandes universités camerounaises pilotes en cours de validation active',
        },
      },
      partnersTitle: 'Partenariats Académiques Pilotes en Cours au Cameroun',
      partnersSubtitle:
        'ScholarShield collabore étroitement avec les institutions d’enseignement supérieur pour valoriser et protéger la recherche camerounaise.',
      privacyBadge: 'Souveraineté des Données & Confidentialité Totale',
    },
    en: {
      badge: 'Role-Specific Academic Architecture',
      title: 'Dedicated Academic Integrity Solutions',
      subtitle:
        'Engineered in Cameroon to meet the rigorous standards of engineering dissertations, doctoral theses, and university scientific research.',
      roles: {
        students: {
          tab: 'Students & Postgraduates',
          title: 'For Students, Engineers & Thesis Authors',
          subtitle:
            'Submit dissertations, internships reports, and theses with total confidence before academic defense committees.',
          points: [
            'Pre-defense thesis verification (Université de Dschang, University of Bamenda, etc.) to eliminate accidental uncited borrowings.',
            'Automated exclusion of formal bibliography and citation blocks compliant with APA, MLA, IEEE, or CAMES guidelines.',
            'Generate a tamper-proof SHA-256 cryptographic integrity certificate to bind directly with your dissertation.',
            'Instant multi-format parsing for PDF, Word (.docx), and digitized documents with clean UTF-8 extraction.',
          ],
          ctaText: 'Start Thesis Verification',
          ctaPath: '/app/analysis/new',
          stat: '98.7%',
          statLabel: 'Unconditional defense approval rate across partner juries',
        },
        teachers: {
          tab: 'Faculty & Juries',
          title: 'For Professors, Lecturers & Defense Juries',
          subtitle:
            'Accelerate grading across entire cohorts with objective, verifiable, and legally defensible similarity reports.',
          points: [
            'Simultaneous cohort screening for hundreds of semester assignments and master theses.',
            'Side-by-side passage comparisons highlighting matched academic journals and fellow student works.',
            'Clear distinction between direct text plagiarism and probabilistic AI linguistic markers.',
            'Official audit-ready PDF reports for faculty councils and defense committee records.',
          ],
          ctaText: 'Explore Faculty Portal',
          ctaPath: '/institution/dashboard',
          stat: '4.5x',
          statLabel: 'Grading and dissertation evaluation speed improvement',
        },
        researchers: {
          tab: 'Researchers & PhDs',
          title: 'For Academic Researchers & CAMES Candidates',
          subtitle:
            'Protect your pre-print manuscripts, journal articles, and academic rank promotion applications.',
          points: [
            'Comprehensive cross-checking against 120M+ research publications across arXiv, PubMed, Springer, and IEEE.',
            'Deep cross-lingual similarity detection (English, French, Spanish) to flag untranslated and paraphrased borrowings.',
            'Full compliance with CAMES scientific ethics guidelines and peer-reviewed international editorial standards.',
            'Zero data training guarantee: unpublished findings remain 100% confidential and are never indexed publicly.',
          ],
          ctaText: 'Verify Scientific Manuscript',
          ctaPath: '/app/analysis/new',
          stat: '120M+',
          statLabel: 'Peer-reviewed academic publications indexed in the global engine',
        },
        universities: {
          tab: 'Universities & Campus',
          title: 'For Rectors, Deans & Academic Senates',
          subtitle:
            'Deploy campus-wide sovereign academic integrity infrastructure across all faculties and research centers.',
          points: [
            'Private institutional repository: cross-check faculty theses (FASA, ColTech, Sciences, FSJP) without external exposure.',
            'Pilot university validation currently ongoing at Université de Dschang (UDs) and University of Bamenda (UBa).',
            'Hierarchical multi-campus management with independent departmental quotas and role-based permissions.',
            'Comprehensive campus analytics tracking long-term academic probity trends and audit compliance.',
          ],
          ctaText: 'Request University Partnership',
          ctaPath: '/contact',
          stat: '2+',
          statLabel: 'Pioneer Cameroonian State Universities currently under active validation',
        },
      },
      partnersTitle: 'Pioneer University Pilot Partnerships in Cameroon',
      partnersSubtitle:
        'ScholarShield collaborates directly with higher education institutions to protect and elevate Cameroonian scientific research.',
      privacyBadge: 'Complete Data Sovereignty & Strict Confidentiality',
    },
  };

  const currentStrings = isFr ? content.fr : content.en;
  const currentRole = currentStrings.roles[selectedRole];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#3978D5]/10 text-[#3978D5] border border-[#3978D5]/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{currentStrings.badge}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white tracking-tight">
          {currentStrings.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {currentStrings.subtitle}
        </p>

        {/* Persona Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setSelectedRole('students')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'students'
                ? 'bg-[#3978D5] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>{currentStrings.roles.students.tab}</span>
          </button>

          <button
            onClick={() => setSelectedRole('teachers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'teachers'
                ? 'bg-[#3978D5] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{currentStrings.roles.teachers.tab}</span>
          </button>

          <button
            onClick={() => setSelectedRole('researchers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'researchers'
                ? 'bg-[#3978D5] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Microscope className="w-4 h-4" />
            <span>{currentStrings.roles.researchers.tab}</span>
          </button>

          <button
            onClick={() => setSelectedRole('universities')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              selectedRole === 'universities'
                ? 'bg-[#3978D5] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{currentStrings.roles.universities.tab}</span>
          </button>
        </div>
      </div>

      {/* Feature Showcase Card */}
      <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3978D5]">
                {currentRole.tab}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                {currentRole.title}
              </h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {currentRole.subtitle}
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-200">
              {currentRole.points.map((pt, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#269B72] shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate(currentRole.ctaPath)}
                className="flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-sm transition-all"
              >
                <span>{currentRole.ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('/signup')}
                className="px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
              >
                {isFr ? 'Créer un compte' : 'Create Account'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#3978D5]/10 text-[#3978D5] flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6" />
            </div>
            <div className="text-4xl sm:text-5xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#3978D5] tabular-nums">
              {currentRole.stat}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {currentRole.statLabel}
            </p>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
              <Shield className="w-4 h-4 text-[#269B72]" />
              <span>{currentStrings.privacyBadge}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cameroonian Universities in Validation */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-emerald-50/70 dark:from-slate-900/60 dark:via-[#14243A] dark:to-slate-900/60 border border-blue-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-6">
          <h3 className="text-base sm:text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            {currentStrings.partnersTitle}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            {currentStrings.partnersSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#3978D5] flex items-center justify-center font-bold font-mono shrink-0">
              UDs
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Université de Dschang</h4>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  {isFr ? 'Validation en cours' : 'Pilot Validation'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isFr
                  ? 'Faculté d’Agronomie et des Sciences Agricoles (FASA), Faculté des Sciences, Faculté des Lettres et Sciences Humaines.'
                  : 'Faculty of Agronomy and Agricultural Sciences (FASA), Faculty of Science, Faculty of Letters and Social Sciences.'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-[#269B72] flex items-center justify-center font-bold font-mono shrink-0">
              UBa
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">University of Bamenda</h4>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-medium">
                  {isFr ? 'Validation en cours' : 'Pilot Validation'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isFr
                  ? 'College of Technology (ColTech), Faculty of Science, Higher Teachers Training College (HTTC) Bambili.'
                  : 'College of Technology (ColTech), Faculty of Science, Higher Teachers Training College (HTTC) Bambili.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
