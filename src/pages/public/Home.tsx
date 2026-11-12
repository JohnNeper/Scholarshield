import React, { useState } from 'react';
import { useTranslation } from '../../services/i18n/context';
import { useData, SAMPLE_DOCUMENTS } from '../../services/store/dataContext';
import {
  Shield,
  Search,
  Sparkles,
  FileText,
  Building2,
  Lock,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cpu,
  BarChart2,
  Eye,
  FileCheck,
  Scale,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (path: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { t, language } = useTranslation();
  const isFr = language === 'fr';
  const { startAnalysisJob, addDocument } = useData();

  // Interactive Live Demo Box on Landing Page
  const [demoText, setDemoText] = useState(
    isFr
      ? 'Les mécanismes d’attention sur graphes pour les séquences biologiques de haute dimension représentent une avancée majeure en bio-informatique. Les approches antérieures ne permettaient pas de capturer les contraintes topologiques des réseaux d’interactions protéiques. Les travaux récents à l’Université de Dschang démontrent une nette amélioration de la précision prédictive.'
      : 'Graph Attention Mechanisms for High-Dimensional Biological Sequences have emerged as a cornerstone in computational biology. Furthermore, it is crucial to note that prior approaches failed to capture topological constraints in protein-protein interaction networks.'
  );
  const [analyzingDemo, setAnalyzingDemo] = useState(false);
  const [demoResults, setDemoResults] = useState<{ similarity: number; aiProb: number; matchedSource: string } | null>({
    similarity: 18,
    aiProb: 24,
    matchedSource: isFr
      ? 'Annales de la Faculté des Sciences (Université de Dschang / Univ. Bamenda, 2024)'
      : 'IEEE Transactions on Neural Networks (Zhang & Vance, 2024)',
  });

  const handleRunQuickDemo = () => {
    setAnalyzingDemo(true);
    setTimeout(() => {
      setAnalyzingDemo(false);
      setDemoResults({
        similarity: Math.min(88, Math.max(12, Math.round((demoText.length % 40) + 15))),
        aiProb: demoText.includes('en outre') || demoText.includes('furthermore') || demoText.includes('crucial de noter') || demoText.includes('crucial to note') ? 78 : 20,
        matchedSource: isFr
          ? 'Dépôt Institutionnel UDs : Thèse de Doctorat en Bioinformatique & Systèmes Complexes (2024)'
          : 'IEEE Transactions on Neural Networks (Zhang & Vance, 2024)',
      });
    }, 600);
  };

  const handleLoadSample = (sampleIndex: number) => {
    const doc = SAMPLE_DOCUMENTS[sampleIndex];
    if (doc) {
      setDemoText(doc.content.slice(0, 320));
      handleRunQuickDemo();
    }
  };

  return (
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#3978D5] bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 px-3 py-1 rounded-full">
              <Scale className="w-3.5 h-3.5" />
              <span>
                {isFr ? "Architecture d'Intégrité Académique & Universitaire 2026" : 'Academic Integrity Architecture 2026'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white leading-[1.15]">
              {isFr ? (
                <>
                  L'Intégrité Académique, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3978D5] via-[#8B68D8] to-[#14243A] dark:to-white">
                    Propulsée par l'Analyse Intelligente.
                  </span>
                </>
              ) : (
                <>
                  Academic Integrity, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3978D5] via-[#8B68D8] to-[#14243A] dark:to-white">
                    Powered by Intelligent Analysis.
                  </span>
                </>
              )}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {t('heroSubtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('/signup')}
                className="flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-md transition-all group"
              >
                <span>{t('heroPrimaryCta', isFr ? 'Créer un Compte & Démarrer' : 'Start Your Analysis')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => onNavigate('/features')}
                className="px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 rounded-xl transition-all"
              >
                {t('heroSecondaryCta', isFr ? 'Découvrir les Fonctionnalités' : 'Explore Features')}
              </button>
            </div>

            {/* Micro Trust Points */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
                <span>
                  {isFr ? 'Zéro réentraînement des modèles sur les travaux étudiants' : 'Zero model retraining on student papers'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
                <span>
                  {isFr ? 'Double moteur indépendant (Similarité & IA)' : 'Dual Plagiarism & AI engines'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#269B72]" />
                <span>
                  {isFr ? 'Conformité & souveraineté des données académiques' : 'FERPA & GDPR isolated'}
                </span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Interactive Live Heuristic Sandbox */}
          <div className="lg:col-span-5">
            <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl shadow-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 ml-2">
                    {isFr ? 'Aperçu Heuristique en Direct' : 'Live Heuristic Preview'}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500">
                  <button
                    onClick={() => handleLoadSample(0)}
                    className="hover:text-[#3978D5] underline"
                  >
                    {isFr ? 'Exemple 1 (UDs)' : 'Sample 1'}
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => handleLoadSample(1)}
                    className="hover:text-[#3978D5] underline"
                  >
                    {isFr ? 'Exemple 2 (UBa)' : 'Sample 2'}
                  </button>
                </div>
              </div>

              {/* Text Input Sandbox */}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                  {isFr ? 'Extrait académique à analyser :' : 'Academic Passage to Test:'}
                </label>
                <textarea
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  rows={4}
                  className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#3978D5] resize-none"
                  placeholder={isFr ? 'Collez votre texte académique à tester ici...' : 'Paste academic text to inspect...'}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-400">
                  {demoText.split(/\s+/).filter(Boolean).length} {isFr ? 'mots' : 'words'}
                </span>
                <button
                  onClick={handleRunQuickDemo}
                  disabled={analyzingDemo}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  {analyzingDemo ? (
                    <span>{isFr ? 'Analyse en cours...' : 'Evaluating...'}</span>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>{isFr ? "Analyser l'extrait" : 'Evaluate Text'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Live Heuristic Readout */}
              {demoResults && (
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {/* Card 1: Plagiarism Indicator */}
                  <div className="p-3 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-blue-900 dark:text-blue-300 font-medium">
                      <span>{isFr ? 'Indice de Similarité' : 'Similarity Index'}</span>
                      <span className="font-mono font-bold text-sm tabular-nums">
                        {demoResults.similarity}%
                      </span>
                    </div>
                    <div className="w-full bg-blue-200/60 dark:bg-blue-900/40 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#3978D5] h-full rounded-full"
                        style={{ width: `${demoResults.similarity}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-blue-700/80 dark:text-blue-400 truncate pt-0.5">
                      {isFr ? '1 source identifiée' : '1 source match'}
                    </p>
                  </div>

                  {/* Card 2: AI Probability Indicator */}
                  <div className="p-3 bg-purple-50/60 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-purple-900 dark:text-purple-300 font-medium">
                      <span>{isFr ? 'Probabilité IA' : 'AI Probability'}</span>
                      <span className="font-mono font-bold text-sm tabular-nums text-[#8B68D8]">
                        {demoResults.aiProb}%
                      </span>
                    </div>
                    <div className="w-full bg-purple-200/60 dark:bg-purple-900/40 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#8B68D8] h-full rounded-full"
                        style={{ width: `${demoResults.aiProb}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-purple-700/80 dark:text-purple-400 truncate pt-0.5">
                      {isFr ? 'Régularité stylométrique' : 'Statistical burstiness'}
                    </p>
                  </div>
                </div>
              )}

              <div className="text-[11px] text-slate-400 text-center pt-1">
                <span>{isFr ? 'Vérifier un mémoire ou document complet (PDF, Word) ? ' : 'Want full PDF parsing? '}</span>
                <button
                  onClick={() => onNavigate('/signup')}
                  className="text-[#3978D5] hover:underline font-medium"
                >
                  {isFr ? 'Déposer votre travail académique →' : 'Upload your full paper →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Trust Banner with Cameroonian Context */}
      <section className="bg-white dark:bg-[#14243A]/60 border-y border-[#E7EBF1] dark:border-[#23334A] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400">
            {isFr
              ? 'Universités partenaires et établissements d’enseignement supérieur en cours de validation'
              : 'Pioneer validation universities & higher education institutions'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-700 dark:text-slate-300 font-semibold text-sm font-['Plus_Jakarta_Sans']">
            <span className="px-3 py-1 rounded-lg bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-[#3978D5]">
              Université de Dschang (UDs)
            </span>
            <span className="text-slate-300">·</span>
            <span className="px-3 py-1 rounded-lg bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 text-purple-600 dark:text-purple-400">
              University of Bamenda (UBa)
            </span>
            <span className="text-slate-300">·</span>
            <span>Université de Yaoundé I</span>
            <span className="text-slate-300">·</span>
            <span>Université de Douala</span>
            <span className="text-slate-300">·</span>
            <span>École Nationale Supérieure Polytechnique</span>
          </div>
        </div>
      </section>

      {/* Dual Engine Architecture Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            {isFr ? 'Deux Moteurs Spécialisés et Indépendants' : 'Two Independent, Specialized Engines'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isFr
              ? 'La détection de similarités textuelles et l’analyse du contenu généré par IA répondent à des principes scientifiques distincts. ScholarShield garantit une stricte indépendance méthodologique, des scores séparés et des certificats d’intégrité vérifiables.'
              : 'Plagiarism detection and AI-content detection solve fundamentally different problems. ScholarShield keeps them strictly separate with independent methodology, scoring, and disclaimers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Engine 1: Plagiarism */}
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-7 space-y-5 hover:border-[#3978D5]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#3978D5]">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                {isFr ? 'Moteur 1 — Détection de Similarités & Plagiat' : 'Engine 1 — Academic Plagiarism & Similarity'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isFr
                  ? 'Algorithmes de shingling n-grammes, fenêtrage winnowing et recoupement inter-corpus.'
                  : 'Cross-document sequence shingling and citation boundary extraction.'}
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#269B72] shrink-0 mt-0.5" />
                <span>
                  {isFr
                    ? 'Indexation de plus de 120M de publications, thèses, archives ouvertes et banques de données matières.'
                    : '120M+ open access academic journals, arXiv preprints & dissertations.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#269B72] shrink-0 mt-0.5" />
                <span>
                  {isFr
                    ? 'Exclusion automatique des citations régulières entre guillemets et des bibliographies (normes APA, IEEE, CAMES).'
                    : 'Automatic exclusion for quotation marks, blockquotes, and APA/IEEE reference lists.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#269B72] shrink-0 mt-0.5" />
                <span>
                  {isFr
                    ? 'Visualiseur split-screen côte à côte comparant le texte du candidat avec les mémoires antérieurs.'
                    : 'Side-by-side passage comparison with color-coded verbatim matches.'}
                </span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/features')}
                className="text-xs font-semibold text-[#3978D5] hover:underline flex items-center gap-1"
              >
                <span>{isFr ? 'Comprendre le moteur de similarité' : 'Learn about similarity shingling'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Engine 2: AI Detection */}
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-7 space-y-5 hover:border-[#8B68D8]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-[#8B68D8]">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
                {isFr ? 'Moteur 2 — Analyse de Contenu Généré par IA' : 'Engine 2 — AI-Generated Content Analysis'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {isFr
                  ? 'Évaluation de la variance stylométrique, de la perplexité lexicale et du score de burstiness.'
                  : 'Multilingual stylometric variance, perplexity modeling, and burstiness scoring.'}
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B68D8] shrink-0 mt-0.5" />
                <span>
                  {isFr
                    ? 'Mesure de l’écart-type de longueur des phrases (burstiness) et régularité stéréotypée des tokens.'
                    : 'Evaluates sentence length deviation (burstiness) and token predictability.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B68D8] shrink-0 mt-0.5" />
                <span>
                  {isFr
                    ? 'Surlignage en violet des formulations artificielles avec justification stylistique détaillée.'
                    : 'Passage-level purple highlighting with linguistic rationale explanations.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8B68D8] shrink-0 mt-0.5" />
                <span>
                  {isFr
                    ? 'Rapports nuancés d’aide à la décision professorale avec seuils paramétrables par faculté.'
                    : 'Strict non-accusatory disclaimers; scores serve as advisory indicators.'}
                </span>
              </li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('/features')}
                className="text-xs font-semibold text-[#8B68D8] hover:underline flex items-center gap-1"
              >
                <span>{isFr ? 'Comprendre la détection stylométrique' : 'Learn about stylometric detection'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works: 3 Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
            {isFr ? 'Comment Fonctionne ScholarShield' : 'How ScholarShield Works'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {isFr
              ? 'Un processus rigoureux en 3 étapes garantissant la souveraineté des données et la transparence des évaluations.'
              : 'A transparent 3-step verification workflow built for academic rigor and student privacy.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-mono font-bold text-[#3978D5] bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded inline-block">
              {isFr ? 'ÉTAPE 01' : 'STEP 01'}
            </div>
            <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              {isFr ? 'Dépôt du Document' : 'Upload Academic Work'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isFr
                ? 'Déposez votre mémoire, thèse ou devoir (PDF, DOCX, TXT). Définissez si vous souhaitez exclure les citations directes et la bibliographie.'
                : 'Drag and drop any PDF, DOCX, or TXT file. Configure whether to exclude direct quotations and reference bibliographies.'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-mono font-bold text-[#8B68D8] bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded inline-block">
              {isFr ? 'ÉTAPE 02' : 'STEP 02'}
            </div>
            <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              {isFr ? 'Exécution Parallèle des Moteurs' : 'Dual-Engine Execution'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isFr
                ? 'Les serveurs calculent simultanément les empreintes n-grammes de similarité et les métriques de perplexité sans jamais céder vos documents aux IA publiques.'
                : 'Our distributed workers process textual N-grams and stylometric perplexity metrics concurrently without saving your work to public AI training datasets.'}
            </p>
          </div>

          <div className="bg-white dark:bg-[#14243A] border border-[#E7EBF1] dark:border-[#23334A] rounded-2xl p-6 space-y-3">
            <div className="text-xs font-mono font-bold text-[#269B72] bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded inline-block">
              {isFr ? 'ÉTAPE 03' : 'STEP 03'}
            </div>
            <h3 className="text-base font-bold font-['Plus_Jakarta_Sans'] text-slate-900 dark:text-white">
              {isFr ? 'Rapports & Certificat d’Antériorité' : 'Verifiable Dual Reports'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isFr
                ? 'Consultez les correspondances en vis-à-vis et générez un certificat officiel d’intégrité signé avec empreinte cryptographique SHA-256 pour la soutenance.'
                : 'Review side-by-side matches in an interactive document reader and export digitally signed PDF integrity certificates for faculty submission.'}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#14243A] border border-[#23334A] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-['Plus_Jakarta_Sans'] tracking-tight">
              {isFr
                ? 'Prêt à valider vos mémoires et thèses en toute sérénité ?'
                : 'Ready to verify academic integrity with total clarity?'}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {isFr
                ? 'Rejoignez les étudiants, doctorants et professeurs de l’Université de Dschang, de l’University of Bamenda et des grandes universités partenaires.'
                : 'Join thousands of graduate students, faculty members, and research institutions using ScholarShield.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/signup')}
              className="px-6 py-3 text-sm font-semibold text-white bg-[#3978D5] hover:bg-[#2F65B5] rounded-xl shadow-md transition-all"
            >
              {isFr ? 'Créer un Compte Gratuit' : 'Start Free Analysis'}
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
            >
              {isFr ? 'Demander une Démonstration Campus' : 'Request Institutional Demo'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
