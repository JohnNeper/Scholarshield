import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AcademicClass,
  AcademicCollection,
  AcademicDocument,
  AnalysisJob,
  AnalysisType,
  Assignment,
  AuditLog,
  CustomReferenceSource,
  Department,
  IntegrityThresholds,
  ScientificArticle,
  Student,
  SubjectDataBank,
  BankCorpusDocument,
  Submission,
  SubscriptionPlanConfig,
} from '../../types';
import { ClientHeuristicPlagiarismAdapter } from '../engine/plagiarism';
import { ClientStylometricAIAdapter } from '../engine/aiDetection';
import { MultiSourcePlagiarismEngine } from '../engine/multiSourcePlagiarism';

const plagiarismEngine = new ClientHeuristicPlagiarismAdapter();
const aiEngine = new ClientStylometricAIAdapter();
const multiSourceEngine = new MultiSourcePlagiarismEngine();

export const DEFAULT_THRESHOLDS: IntegrityThresholds = {
  similarityWarningThreshold: 15,
  similarityCriticalThreshold: 30,
  aiWarningThreshold: 20,
  aiCriticalThreshold: 45,
  minMatchingWords: 8,
  autoFlagSubmissions: true,
  requireHumanReviewOnBreach: true,
  excludeQuotedByDefault: true,
  excludeBibliographyByDefault: true,
};

export const INITIAL_COLLECTIONS: AcademicCollection[] = [
  {
    id: 'col-thesis-2026',
    userId: 'usr-student-01',
    title: "Thèse de Master : Génomique & Graph Neural Networks",
    description: "Chapitres méthodologiques, revues de littérature et manuscrits de thèse pour soutenance devant le jury académique.",
    category: "Thèse & Mémoire",
    color: "#3978D5",
    createdAt: '2026-10-15T09:00:00Z',
    updatedAt: '2026-11-08T14:32:00Z',
  },
  {
    id: 'col-bioethics-law',
    userId: 'usr-student-01',
    title: "Bioéthique, Droit Médical & Systèmes Autonomes",
    description: "Travaux de recherche et essais sur la responsabilité légale, l'éthique des diagnostics cliniques et la protection des données de santé.",
    category: "Droit & Éthique",
    color: "#8B68D8",
    createdAt: '2026-10-20T11:30:00Z',
    updatedAt: '2026-11-06T09:18:00Z',
  },
  {
    id: 'col-hpc-distributed',
    userId: 'usr-student-01',
    title: "Systèmes Distribués & Protocoles de Consensus",
    description: "Prépublications de conférences, analyses de tolérance aux pannes byzantines et vérifications de citations croisées.",
    category: "Informatique & HPC",
    color: "#269B72",
    createdAt: '2026-11-01T15:00:00Z',
    updatedAt: '2026-11-07T18:40:00Z',
  },
];

export const DEFAULT_CUSTOM_SOURCES: CustomReferenceSource[] = [
  {
    id: 'csrc-gnn-prior',
    title: 'Lab Archive: Graph Attention Mechanisms on Macromolecules',
    content: `Graph Attention Mechanisms for High-Dimensional Biological Sequences have emerged as a cornerstone in computational biology. In this thesis, we evaluate graph neural networks applied to macromolecular structural prediction. Furthermore, it is crucial to note that prior approaches failed to capture topological constraints in protein-protein interaction networks. Zhang & Vance (2024) demonstrated that attention weights correlate with biochemical binding affinities. Direct contiguous sequence alignments show that deep architectures can predict enzymatic catalytic residues with over 92% sensitivity.`,
    wordCount: 88,
    addedAt: '2026-11-05T10:00:00Z',
    authors: 'Zhang & Vance Research Group',
    category: 'thesis',
  },
  {
    id: 'csrc-ethics-prev',
    title: 'Bioethics Repository: Clinical Autonomy and Fiduciary Duty',
    content: `Autonomous Ethical Decision Frameworks in Modern Clinical Diagnostics represent a significant paradigm shift in medical jurisprudence. When algorithmic models assist clinical triage, questions of moral agency and accountability arise. According to Thornton (2023), machine learning models cannot hold fiduciary duty toward patients. Furthermore, it is crucial to note that autonomous diagnostic tools introduce liability ambiguity between medical practitioners and software vendors.`,
    wordCount: 65,
    addedAt: '2026-11-04T12:00:00Z',
    authors: 'Oxford Bioethics Lab',
    category: 'journal',
  },
];

export const SAMPLE_DOCUMENTS: AcademicDocument[] = [
  {
    id: 'doc-scholarshield-cameroun-00',
    userId: 'usr-student-01',
    title: 'ScholarShield — Document de Cadrage & BMC Cameroun',
    filename: 'ScholarShield_Cadrage_BMC_Cameroun.pdf',
    fileSizeBytes: 1850000,
    wordCount: 520,
    mimeType: 'application/pdf',
    uploadedAt: '2026-11-12T08:00:00Z',
    tags: ['Cameroun', 'Business Model Canvas', 'Cadre Institutionnel', 'Intégrité Académique'],
    collectionId: 'col-thesis-2026',
    content: `ScholarShield est une plateforme SaaS conçue pour l'Afrique, dédiée à la détection du plagiat académique et du contenu généré par l'intelligence artificielle, destinée aux écoles, universités et centres de recherche. Aujourd'hui, les vérifications de plagiat s'appuient surtout sur des ressources en ligne et ne retiennent ni ne valorisent les mémoires et travaux locaux des anciens étudiants, tandis que l'usage non contrôlé de l'IA affaiblit l'effort intellectuel et fragilise la crédibilité de la qualité académique africaine. ScholarShield combine une base de référence locale (mémoires, thèses et travaux des établissements partenaires), une analyse de similarité avec le Web et un détecteur de texte produit par IA, afin de promouvoir un usage responsable et éthique de l'IA et de protéger la valeur des diplômes africains. Le modèle économique repose principalement sur des abonnements annuels des établissements, complétés par des offres à l'usage pour les chercheurs, revues et étudiants.

=== BUSINESS MODEL CANVAS ===

[1. PARTENAIRES CLÉS]
• Universités publiques et privées, grandes écoles (partage de mémoires et travaux locaux)
• Bibliothèques universitaires et dépôts de thèses
• MINESUP, CAMES, AUF et réseaux universitaires (légitimité et accès aux établissements)
• Orange Money, MTN MoMo et agrégateurs de paiement
• Hébergeurs cloud / data centers (sécurité et conformité des données)
• Laboratoires IA et universités (recherche et amélioration des modèles)
• Revues et archives en accès ouvert (enrichissement de la base)

[2. ACTIVITÉS CLÉS]
• Développer les moteurs de détection du plagiat et du texte généré par IA
• Constituer et sécuriser la base locale (numérisation, OCR, indexation)
• Vendre, déployer et former les établissements
• Veille sur les nouveaux modèles d'IA et mise à jour des détecteurs
• Sensibiliser à l'usage éthique de l'IA

[3. PROPOSITION DE VALEUR]
• Seule solution qui compare les travaux aux mémoires locaux des anciens étudiants, en plus du Web
• Détection du contenu généré par IA, avec score global et passages signalés
• Seuil d'usage de l'IA paramétrable par établissement : usage responsable et encadré
• Rapport clair, argumenté et exploitable pour les enseignants, jurys et commissions disciplinaires
• Adaptée à l'Afrique : tarifs en FCFA, paiement mobile money, français / anglais, faible débit
• Confidentialité : travaux protégés et jamais réutilisés sans l'accord de l'établissement
• Renforce la crédibilité des diplômes et de la recherche africains à l'international

[4. RELATIONS CLIENTS]
• Accompagnement dédié à l'intégration de chaque établissement
• Formation des enseignants et ateliers d'intégrité académique
• Support par e-mail et WhatsApp, centre d'aide en ligne
• Communauté d'établissements partenaires et retours produit réguliers

[5. SEGMENTS DE CLIENTS]
• Universités publiques et privées, grandes écoles (Cameroun d'abord, puis Afrique francophone et anglophone)
• Lycées, instituts et centres de formation
• Centres de recherche et revues scientifiques africaines
• Enseignants et chercheurs à titre individuel
• Étudiants (Master / doctorat) : vérification avant dépôt du mémoire
• Autorités de régulation de l'enseignement supérieur

[6. RESSOURCES CLÉS]
• Équipe technique : IA / NLP, développement, produit
• Base de mémoires, thèses et travaux locaux : avantage concurrentiel central
• Infrastructure cloud sécurisée
• Capital d'amorçage

[7. CANAUX]
• Vente directe aux directions, bibliothèques et services de scolarité
• Partenariats institutionnels, conférences, salons de l'éducation
• Plateforme Web SaaS, API et intégration aux plateformes (ex: Moodle)
• LinkedIn, WhatsApp, Webinaires
• Ambassadeurs enseignants et étudiants

[8. STRUCTURE DE COÛTS]
• Salaires de l'équipe, loyers et outils, sécurité des données
• Variables : hébergement, stockage et calcul IA selon le volume de documents analysés, frais de transaction mobile money, support client
• Constitution de la base locale : numérisation, OCR, accords avec les établissements
• Commercial et marketing : prospection, déplacements, événements, formation des clients

[9. SOURCES DE REVENUS]
• Abonnement annuel par établissement, selon le nombre d'étudiants et le volume de documents
• Packs de vérifications à l'usage (par document) pour étudiants et chercheurs, payables par mobile money
• Licences pour revues scientifiques et centres de recherche
• Services : intégration API / LMS, formation et certification à l'intégrité académique
• Partenariats institutionnels et financements pour l'éducation`,
  },
  {
    id: 'doc-bioinformatics-01',
    userId: 'usr-student-01',
    title: 'Neural Graph Attention Networks in Bioinformatics',
    filename: 'Neural_GAT_Bioinformatics_Thesis_Final.pdf',
    fileSizeBytes: 2450000,
    wordCount: 8420,
    mimeType: 'application/pdf',
    uploadedAt: '2026-11-08T14:32:00Z',
    tags: ['Master Thesis', 'Bioinformatics', 'Deep Learning'],
    lastAnalysisJobId: 'job-bioinformatics-01',
    collectionId: 'col-thesis-2026',
    content: `Abstract
Graph Attention Mechanisms for High-Dimensional Biological Sequences have emerged as a cornerstone in computational biology. In this thesis, we evaluate graph neural networks applied to macromolecular structural prediction. Furthermore, it is crucial to note that prior approaches failed to capture topological constraints in protein-protein interaction networks.

Introduction and Literature Review
Graph neural networks extend classical convolution operations to non-Euclidean geometric manifolds. Zhang & Vance (2024) demonstrated that attention weights correlate with biochemical binding affinities. Direct contiguous sequence alignments show that deep architectures can predict enzymatic catalytic residues with over 92% sensitivity.

Methodology
We formulate protein backbone residues as nodes in an undirected graph G = (V, E). Edge attributes represent Euclidean spatial proximity derived from high-resolution X-ray crystallography and cryo-EM density maps. Comparative Benchmark of Transformer Architectures on Unstructured Academic Corpora reveals that multi-head attention stabilizes message passing across heterogeneous graph partitions. Moreover, our model implements winnowing algorithms to prune redundant sparse representations.

Results & Discussion
In summary, empirical evaluations on the CASP15 benchmark demonstrate statistically significant improvements over baseline convolutional baselines. The integration of structural priors plays a pivotal role in preventing overfitting on constrained biological samples. In conclusion, topological deep learning provides a robust methodology for future pharmaceutical drug discovery pipelines.`,
  },
  {
    id: 'doc-ethics-02',
    userId: 'usr-student-01',
    title: 'Ethics of Autonomous Systems in Modern Healthcare',
    filename: 'Autonomous_Healthcare_Ethics_Essay.docx',
    fileSizeBytes: 890000,
    wordCount: 3150,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadedAt: '2026-11-06T09:15:00Z',
    tags: ['Bioethics', 'Healthcare AI', 'Philosophy'],
    lastAnalysisJobId: 'job-ethics-02',
    collectionId: 'col-bioethics-law',
    content: `Autonomous Ethical Decision Frameworks in Modern Clinical Diagnostics represent a significant paradigm shift in medical jurisprudence. When algorithmic models assist clinical triage, questions of moral agency and accountability arise.

According to Thornton (2023), machine learning models cannot hold fiduciary duty toward patients. Furthermore, it is crucial to note that autonomous diagnostic tools introduce liability ambiguity between medical practitioners and software vendors. The primary objective of medical ethics remains non-maleficence and patient autonomy.

In conclusion, clinical decision support algorithms must maintain transparent provenance records and human-in-the-loop oversight to uphold institutional trust.`,
  },
  {
    id: 'doc-climate-03',
    userId: 'usr-student-01',
    title: 'Comparative Benchmark of Climate Modeling Algorithms',
    filename: 'Climate_Simulation_Ensemble_Report.pdf',
    fileSizeBytes: 4120000,
    wordCount: 12500,
    mimeType: 'application/pdf',
    uploadedAt: '2026-10-24T18:00:00Z',
    tags: ['Climatology', 'High-Performance Computing'],
    collectionId: 'col-hpc-distributed',
    content: `Modern atmospheric modeling relies on high-resolution numerical differential equations discretized over global spherical geodesic grids. We present an empirical benchmark comparing finite-volume spectral dynamics against emerging physics-informed neural operators.`,
  },
];

const INITIAL_JOBS: AnalysisJob[] = [
  {
    id: 'job-bioinformatics-01',
    documentId: 'doc-bioinformatics-01',
    documentTitle: 'Neural Graph Attention Networks in Bioinformatics',
    userId: 'usr-student-01',
    analysisType: 'both',
    status: 'completed',
    progressPercent: 100,
    currentStepMessage: 'Analysis finalized. Dual reports generated.',
    createdAt: '2026-11-08T14:35:00Z',
    completedAt: '2026-11-08T14:36:20Z',
    plagiarismResult: {
      jobId: 'job-bioinformatics-01',
      similarityScore: 18,
      matchedWordCount: 1515,
      totalWordCount: 8420,
      identifiedSourcesCount: 3,
      coveragePercentage: 100,
      sources: [
        {
          id: 'src-ieee-2024',
          title: 'Graph Attention Mechanisms for High-Dimensional Biological Sequences',
          authors: 'Dr. Evelyn Zhang, Dr. Marcus Vance',
          publication: 'IEEE Transactions on Neural Networks & Learning Systems',
          year: 2024,
          url: 'https://doi.org/10.1109/TNNLS.2024.338291',
          category: 'journal',
          similarityPercentage: 11.4,
          matchedWordsCount: 960,
        },
        {
          id: 'src-springer-2022',
          title: 'Comparative Benchmark of Transformer Architectures on Unstructured Academic Corpora',
          authors: 'Elena Rostova, Jean-Paul Laurent',
          publication: 'Springer LNCS 13421',
          year: 2022,
          url: 'https://link.springer.com/chapter/10.1007/978-3-031-15934-2',
          category: 'conference',
          similarityPercentage: 4.8,
          matchedWordsCount: 405,
        },
        {
          id: 'src-univ-archive',
          title: 'Internal University Dissertations Archive — Faculty of Engineering',
          authors: 'Academic Consortium',
          publication: 'Institutional Cross-Check Repository',
          year: 2025,
          category: 'institutional_archive',
          similarityPercentage: 1.8,
          matchedWordsCount: 150,
        },
      ],
      matchedPassages: [
        {
          id: 'match-1',
          sourceId: 'src-ieee-2024',
          sourceTitle: 'Graph Attention Mechanisms for High-Dimensional Biological Sequences',
          documentText:
            'Graph Attention Mechanisms for High-Dimensional Biological Sequences have emerged as a cornerstone in computational biology. In this thesis, we evaluate graph neural networks applied to macromolecular structural prediction.',
          sourceText:
            'Graph Attention Mechanisms for High-Dimensional Biological Sequences have emerged as a cornerstone in computational biology for macromolecular structural prediction (Zhang & Vance, 2024).',
          offsetStart: 9,
          offsetEnd: 240,
          pageNumber: 1,
          matchType: 'identical',
          similarityScore: 89,
          explanation: 'Direct contiguous verbatim match of 24 words with published IEEE article.',
        },
        {
          id: 'match-2',
          sourceId: 'src-springer-2022',
          sourceTitle: 'Comparative Benchmark of Transformer Architectures on Unstructured Academic Corpora',
          documentText:
            'Comparative Benchmark of Transformer Architectures on Unstructured Academic Corpora reveals that multi-head attention stabilizes message passing across heterogeneous graph partitions.',
          sourceText:
            'Transformer Architectures on Unstructured Academic Corpora demonstrate that multi-head attention stabilizes message passing across heterogeneous partitions (Rostova & Laurent, 2022).',
          offsetStart: 620,
          offsetEnd: 790,
          pageNumber: 2,
          matchType: 'paraphrased',
          similarityScore: 74,
          explanation: 'Paraphrased formulation and shared structural terminology.',
        },
      ],
      excludedCitationsCount: 4,
      excludedBibliographyCount: 1,
    },
    aiDetectionResult: {
      jobId: 'job-bioinformatics-01',
      overallAIProbability: 26,
      analyzedWordCount: 8420,
      flaggedPassagesCount: 2,
      coveragePercentage: 100,
      burstinessScore: 72,
      perplexityEstimate: 68,
      modelVersion: 'v2.1.0-stylometric-statistical',
      evaluationDisclaimer:
        'AI detection is an exploratory, probabilistic indicator based on stylometric variance and word predictability. It does not provide deterministic proof of AI generation. Human academic review is strictly required.',
      flaggedPassages: [
        {
          id: 'ai-p1',
          text: 'Furthermore, it is crucial to note that prior approaches failed to capture topological constraints in protein-protein interaction networks.',
          offsetStart: 215,
          offsetEnd: 345,
          pageNumber: 1,
          aiProbability: 78,
          confidence: 'moderate',
          linguisticSignals: ['High syntactic predictability', 'Overused emphatic modifier'],
          explanation: 'Contains formulaic transition markers with low syntactic entropy.',
        },
        {
          id: 'ai-p2',
          text: 'The integration of structural priors plays a pivotal role in preventing overfitting on constrained biological samples. In conclusion, topological deep learning provides a robust methodology for future pharmaceutical drug discovery pipelines.',
          offsetStart: 890,
          offsetEnd: 1120,
          pageNumber: 3,
          aiProbability: 82,
          confidence: 'high',
          linguisticSignals: ['Standard boilerplate metaphor', 'Syntactic closure marker', 'Low length deviation'],
          explanation: 'Predictable boilerplate rhetoric and uniform sentence length.',
        },
      ],
    },
  },
  {
    id: 'job-ethics-02',
    documentId: 'doc-ethics-02',
    documentTitle: 'Ethics of Autonomous Systems in Modern Healthcare',
    userId: 'usr-student-01',
    analysisType: 'plagiarism',
    status: 'completed',
    progressPercent: 100,
    currentStepMessage: 'Similarity report ready.',
    createdAt: '2026-11-06T09:18:00Z',
    completedAt: '2026-11-06T09:19:10Z',
    plagiarismResult: {
      jobId: 'job-ethics-02',
      similarityScore: 9,
      matchedWordCount: 280,
      totalWordCount: 3150,
      identifiedSourcesCount: 1,
      coveragePercentage: 100,
      sources: [
        {
          id: 'src-oxford-2023',
          title: 'Autonomous Ethical Decision Frameworks in Modern Clinical Diagnostics',
          authors: 'Prof. Alistair Thornton',
          publication: 'Oxford Academic Press',
          year: 2023,
          category: 'thesis',
          similarityPercentage: 8.7,
          matchedWordsCount: 280,
        },
      ],
      matchedPassages: [
        {
          id: 'match-eth-1',
          sourceId: 'src-oxford-2023',
          sourceTitle: 'Autonomous Ethical Decision Frameworks in Modern Clinical Diagnostics',
          documentText:
            'Autonomous Ethical Decision Frameworks in Modern Clinical Diagnostics represent a significant paradigm shift in medical jurisprudence.',
          sourceText:
            'Autonomous Ethical Decision Frameworks in Modern Clinical Diagnostics: A Study in Medical Jurisprudence (Thornton, 2023).',
          offsetStart: 0,
          offsetEnd: 135,
          pageNumber: 1,
          matchType: 'identical',
          similarityScore: 92,
          explanation: 'Verbatim title and opening phrase alignment.',
        },
      ],
      excludedCitationsCount: 2,
      excludedBibliographyCount: 1,
    },
  },
];

const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-fasa',
    institutionId: 'inst-dschang-01',
    name: 'Faculté d’Agronomie et des Sciences Agricoles (FASA)',
    code: 'FASA-UDS',
    headName: 'Pr. Roger Tsafack',
    classesCount: 6,
    studentsCount: 380,
  },
  {
    id: 'dept-coltech',
    institutionId: 'inst-bamenda-02',
    name: 'College of Technology (ColTech)',
    code: 'COLTECH-UBA',
    headName: 'Dr. Emmanuel Tabi',
    classesCount: 8,
    studentsCount: 420,
  },
  {
    id: 'dept-sciences-uds',
    institutionId: 'inst-dschang-01',
    name: 'Faculté des Sciences (Mathématiques, Informatique & Biosphère)',
    code: 'FS-UDS',
    headName: 'Pr. Martin Kenfack',
    classesCount: 5,
    studentsCount: 290,
  },
  {
    id: 'dept-fsjp',
    institutionId: 'inst-dschang-01',
    name: 'Faculté des Sciences Juridiques et Politiques (FSJP)',
    code: 'FSJP-UDS',
    headName: 'Pr. Hélène Mbianda',
    classesCount: 4,
    studentsCount: 210,
  },
];

const INITIAL_CLASSES: AcademicClass[] = [
  {
    id: 'cls-bio-501',
    departmentId: 'dept-fasa',
    departmentName: 'Faculté d’Agronomie et des Sciences Agricoles (FASA)',
    name: 'Master Ingénieur Agronome : Biotechnologies Végétales & Génomique',
    code: 'FASA-ING-501',
    instructorName: 'Pr. Roger Tsafack',
    academicYear: '2026-2027',
    inviteCode: 'FASA-UDS-2026',
    studentsCount: 42,
    submissionsCount: 38,
  },
  {
    id: 'cls-cs-402',
    departmentId: 'dept-coltech',
    departmentName: 'College of Technology (ColTech)',
    name: 'Software Engineering & Distributed Systems Trust Architecture',
    code: 'COLTECH-SWE-402',
    instructorName: 'Dr. Emmanuel Tabi',
    academicYear: '2026-2027',
    inviteCode: 'COLTECH-UBA-26',
    studentsCount: 68,
    submissionsCount: 65,
  },
  {
    id: 'cls-law-301',
    departmentId: 'dept-fsjp',
    departmentName: 'Faculté des Sciences Juridiques et Politiques (FSJP)',
    name: 'Droit Numérique, Éthique de la Recherche & Propriété Intellectuelle CAMES',
    code: 'FSJP-DRT-301',
    instructorName: 'Pr. Hélène Mbianda',
    academicYear: '2026-2027',
    inviteCode: 'FSJP-UDS-2026',
    studentsCount: 55,
    submissionsCount: 51,
  },
];

const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    fullName: 'Amina Njoya',
    email: 'amina.njoya@univ-dschang.org',
    studentIdNumber: 'CM-UDS-2026-8901',
    departmentName: 'Faculté d’Agronomie et des Sciences Agricoles (FASA)',
    className: 'Master Ingénieur Agronome : Biotechnologies Végétales & Génomique',
    totalSubmissions: 4,
    averageSimilarity: 14.5,
    status: 'active',
  },
  {
    id: 'stu-2',
    fullName: 'Lucas Ndifor',
    email: 'lucas.ndifor@uniba-edu.cm',
    studentIdNumber: 'CM-UBA-2026-4122',
    departmentName: 'College of Technology (ColTech)',
    className: 'Software Engineering & Distributed Systems Trust Architecture',
    totalSubmissions: 3,
    averageSimilarity: 8.2,
    status: 'active',
  },
  {
    id: 'stu-3',
    fullName: 'Sophie Manga',
    email: 'sophie.manga@univ-dschang.org',
    studentIdNumber: 'CM-UDS-2026-7833',
    departmentName: 'Faculté des Sciences Juridiques et Politiques (FSJP)',
    className: 'Droit Numérique, Éthique de la Recherche & Propriété Intellectuelle CAMES',
    totalSubmissions: 5,
    averageSimilarity: 19.8,
    status: 'active',
  },
  {
    id: 'stu-4',
    fullName: 'Marc Fotso',
    email: 'marc.fotso@univ-dschang.org',
    studentIdNumber: 'CM-UDS-2026-4199',
    departmentName: 'Faculté d’Agronomie et des Sciences Agricoles (FASA)',
    className: 'Master Ingénieur Agronome : Biotechnologies Végétales & Génomique',
    totalSubmissions: 2,
    averageSimilarity: 34.2,
    status: 'active',
  },
];

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    classId: 'cls-bio-501',
    className: 'Master Ingénieur Agronome : Biotechnologies Végétales & Génomique',
    title: 'Mémoire de Fin d’Études — Méthodes & Modélisation Génomique',
    dueDate: '2026-11-25T23:59:00Z',
    acceptedFormats: ['PDF', 'DOCX'],
    maxWords: 15000,
    similarityThresholdWarning: 20,
    totalSubmissions: 38,
    status: 'open',
  },
  {
    id: 'asg-02',
    classId: 'cls-cs-402',
    className: 'Software Engineering & Distributed Systems Trust Architecture',
    title: 'Consensus Protocols & Fault Tolerance Research Paper',
    dueDate: '2026-12-05T23:59:00Z',
    acceptedFormats: ['PDF'],
    maxWords: 8000,
    similarityThresholdWarning: 15,
    totalSubmissions: 65,
    status: 'open',
  },
];

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-01',
    assignmentId: 'asg-01',
    assignmentTitle: 'Mémoire de Fin d’Études — Méthodes & Modélisation Génomique',
    studentId: 'stu-1',
    studentName: 'Amina Njoya',
    studentEmail: 'amina.njoya@univ-dschang.org',
    submittedAt: '2026-11-08T14:32:00Z',
    documentId: 'doc-bioinformatics-01',
    documentTitle: 'Neural Graph Attention Networks in Bioinformatics',
    similarityScore: 18,
    aiScore: 26,
    status: 'analyzed',
  },
  {
    id: 'sub-02',
    assignmentId: 'asg-01',
    assignmentTitle: 'Mémoire de Fin d’Études — Méthodes & Modélisation Génomique',
    studentId: 'stu-4',
    studentName: 'Marc Fotso',
    studentEmail: 'marc.fotso@univ-dschang.org',
    submittedAt: '2026-11-07T18:40:00Z',
    documentId: 'doc-ethics-02',
    documentTitle: 'Autonomous Decision Trees in Agricultural Production Systems',
    similarityScore: 34,
    aiScore: 68,
    status: 'flagged',
  },
];

export const INITIAL_ARTICLES: ScientificArticle[] = [
  {
    id: 'art-nat-01',
    title: 'Graph Attention Mechanisms for High-Dimensional Biological Sequences and Protein Folding',
    authors: 'Dr. Marc Albrand, Dr. Elena Rostova, Pr. David Benamou',
    correspondingAuthorEmail: 'm.albrand@polytechnique.edu',
    departmentId: 'dept-bio',
    departmentName: 'Computational Biology & Genomics',
    targetJournalOrConference: 'Nature Machine Intelligence',
    targetSubmissionDate: '2026-12-15',
    manuscriptType: 'journal_article',
    abstract: 'We introduce a topology-aware graph neural network model specifically tailored for multi-scale macromolecular conformation analysis. Across standard CASP15 benchmarks, our attention weights accurately reproduce binding affinity topologies with lower computational footprint than dense transformer baselines.',
    content: `Graph attention mechanisms on biological macromolecules enable structural prediction at atomic resolution without requiring quadratic self-attention matrices. By imposing localized equivariant neighborhood filters, we preserve rotational symmetry and bond geometric angles. Benchmarking across the PDB-REDO dataset demonstrates a 14.2% improvement in RMSD coordinates over AlphaFold-derived baseline heuristics. All experiments were conducted under controlled cross-validation folds ensuring no cross-contamination between training homologous folds.`,
    fileSizeBytes: 3420000,
    wordCount: 7850,
    sha256Hash: 'a4b82c3f81e94119d652981bc09312fe27d891b05c6d3e8e2fa0982bb71249fa',
    registeredAt: '2026-11-04T10:15:00Z',
    plagiarismScore: 3.4,
    aiProbabilityScore: 5.2,
    internalCampusOverlapScore: 1.8,
    status: 'certified_ready',
    doiReserved: '10.1038/s42256-pre-2026-9041',
    certificateId: 'CERT-PUB-2026-X892',
    reviewNotes: 'Audit d’antériorité validé par le Conseil Scientifique. Aucun chevauchement non crédité avec les thèses antérieures du laboratoire.',
  },
  {
    id: 'art-ieee-02',
    title: 'Quantized Consensus Protocols for Low-Latency Byzantine Fault Tolerance in Heterogeneous Clusters',
    authors: 'Prof. David Benamou, Alexia Laurent, Dr. Karim Belkacem',
    correspondingAuthorEmail: 'd.benamou@polytechnique.edu',
    departmentId: 'dept-cs',
    departmentName: 'Computer Science & Artificial Intelligence',
    targetJournalOrConference: 'IEEE Transactions on Information Theory',
    targetSubmissionDate: '2026-11-30',
    manuscriptType: 'conference_paper',
    abstract: 'Byzantine Fault Tolerant (BFT) consensus algorithms suffer from quadratic message complexity under wide-area networks. We propose a quantized multi-phase voting protocol operating over randomized gossip topologies, reducing network communication overhead by 68%.',
    content: `State machine replication across Byzantine failures has traditionally required O(N^2) leader-driven communication. We propose a quantized threshold signature scheme where consensus votes are aggregated into succinct logarithmic proofs. Under asynchronous network partitioning attacks with up to 33% malicious nodes, our protocol guarantees liveness and deterministic finality within 140ms on transatlantic testbeds.`,
    fileSizeBytes: 2150000,
    wordCount: 6420,
    sha256Hash: 'c72e90fa54029471ab631bce7839401dd92384a56c04e2874bc0561284a1e9bb',
    registeredAt: '2026-11-07T14:40:00Z',
    plagiarismScore: 6.8,
    aiProbabilityScore: 8.5,
    internalCampusOverlapScore: 3.1,
    status: 'certified_ready',
    doiReserved: '10.1109/TIT.2026.340912',
    certificateId: 'CERT-PUB-2026-B441',
    reviewNotes: 'Conformité IEEE vérifiée. Citations croisées conformes aux normes d intégrité académique.',
  },
  {
    id: 'art-law-03',
    title: 'Algorithmic Liability in Autonomous Surgical Triage: A Comparative EU-US Jurisprudential Analysis',
    authors: 'Prof. Claire Fontaine, Thomas Vernier',
    correspondingAuthorEmail: 'claire.fontaine@sorbonne-universite.fr',
    departmentId: 'dept-law',
    departmentName: 'Law, Technology & Digital Ethics',
    targetJournalOrConference: 'Harvard Journal of Law & Technology',
    targetSubmissionDate: '2026-12-05',
    manuscriptType: 'journal_article',
    abstract: 'The deployment of autonomous AI diagnostics and robotic surgery creates unprecedented liability vacuums between hospital trusts, software manufacturers, and supervising clinicians. This comparative study examines the EU AI Act High-Risk Medical classification versus US FDA Section 510(k) jurisprudence.',
    content: `Autonomous ethical decision frameworks in modern clinical diagnostics represent a significant paradigm shift in medical jurisprudence. When algorithmic models assist clinical triage, questions of moral agency and accountability arise. Machine learning models cannot hold fiduciary duty toward patients. Furthermore, autonomous diagnostic tools introduce liability ambiguity between medical practitioners and software vendors. Comparative analysis shows that strict product liability under civil law traditions offers higher patient protection than common law negligence doctrines.`,
    fileSizeBytes: 1890000,
    wordCount: 9100,
    sha256Hash: 'e39b1a7741bc294d8721c09854ef247a89c3104e578291f094da5521b4a3901c',
    registeredAt: '2026-11-09T08:30:00Z',
    plagiarismScore: 21.4,
    aiProbabilityScore: 16.2,
    internalCampusOverlapScore: 14.8,
    status: 'needs_revision',
    certificateId: 'CERT-PUB-2026-L712',
    reviewNotes: 'Alerte recoupement interne campus : 14.8% de similitude textuelle détectée avec le mémoire de Master 2024 (Sorbonne Droit Numérique). Reformulation requise du chapitre 3 avant soumission externe.',
  },
];

export const INITIAL_SUBJECT_BANKS: SubjectDataBank[] = [
  {
    id: 'bank-bio-gen',
    name: 'Génomique, Protéomique & Bio-Santé',
    subjectCode: 'BIO-GEN',
    description: 'Corpus de référence institutionnel : thèses de doctorat en séquençage macromoléculaire, revues de littérature en bio-informatique et mémoires de master en génomique fonctionnelle.',
    category: 'Sciences du Vivant',
    departmentId: 'dept-bio',
    departmentName: 'Computational Biology & Genomics',
    color: '#269B72',
    isActiveForPlagiarismCheck: true,
    documentsCount: 18,
    totalWords: 142850,
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-11-08T15:20:00Z',
  },
  {
    id: 'bank-cs-ai',
    name: 'Intelligence Artificielle & Systèmes Distribués',
    subjectCode: 'CS-AI',
    description: 'Banque d’archives des publications de laboratoires, thèses doctorales sur les réseaux de neurones graphiques, tolérance aux pannes byzantines et architectures d’agents distribués.',
    category: 'Informatique & HPC',
    departmentId: 'dept-cs',
    departmentName: 'Computer Science & Artificial Intelligence',
    color: '#3978D5',
    isActiveForPlagiarismCheck: true,
    documentsCount: 24,
    totalWords: 218900,
    createdAt: '2026-09-12T09:30:00Z',
    updatedAt: '2026-11-09T11:45:00Z',
  },
  {
    id: 'bank-law-tech',
    name: 'Droit Numérique, Propriété Intellectuelle & Bioéthique',
    subjectCode: 'LAW-ETHIC',
    description: 'Travaux de recherche universitaires, mémoires de droit comparé, régulation européenne de l’IA (EU AI Act) et études doctrinales sur la responsabilité des systèmes automatisés.',
    category: 'Droit & Éthique',
    departmentId: 'dept-law',
    departmentName: 'Law, Technology & Digital Ethics',
    color: '#8B68D8',
    isActiveForPlagiarismCheck: true,
    documentsCount: 15,
    totalWords: 126400,
    createdAt: '2026-09-15T14:00:00Z',
    updatedAt: '2026-11-07T16:10:00Z',
  },
  {
    id: 'bank-phys-quant',
    name: 'Physique Quantique & Matériaux Avancés',
    subjectCode: 'PHYS-QUANT',
    description: 'Dépôt des mémoires de recherche en condensats quantiques, supraconductivité à haute température et nanostructures semi-conductrices.',
    category: 'Physique Fondamentale',
    departmentId: 'dept-phys',
    departmentName: 'Applied Physics & Quantum Engineering',
    color: '#E07A5F',
    isActiveForPlagiarismCheck: true,
    documentsCount: 12,
    totalWords: 98400,
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-11-05T09:00:00Z',
  },
  {
    id: 'bank-econ-fin',
    name: 'Sciences Économiques & Finance Quantitative',
    subjectCode: 'ECON-FIN',
    description: 'Thèses et working papers en modélisation macroprudentielle, algorithmes de trading haute fréquence et économie comportementale des marchés émergents.',
    category: 'Sciences Économiques',
    color: '#E63946',
    isActiveForPlagiarismCheck: true,
    documentsCount: 14,
    totalWords: 112000,
    createdAt: '2026-10-10T11:00:00Z',
    updatedAt: '2026-11-04T17:30:00Z',
  },
];

export const INITIAL_BANK_DOCUMENTS: BankCorpusDocument[] = [
  {
    id: 'bdoc-bio-01',
    bankId: 'bank-bio-gen',
    subjectCode: 'BIO-GEN',
    title: 'Topological Constraints in Protein-Protein Interaction Networks (Thèse de Doctorat)',
    authors: 'Dr. Sarah K. Miller, Dir. Pr. Valérie Mercier',
    academicYear: '2025-2026',
    documentType: 'thesis',
    abstract: 'Étude computationnelle approfondie des réseaux d’interactions protéiques appliquée à la conformation 3D des macromolécules biologiques et la prédiction des sites de liaison allostériques.',
    content: `Graph Attention Mechanisms for High-Dimensional Biological Sequences have emerged as a cornerstone in computational biology. In this thesis, we evaluate graph neural networks applied to macromolecular structural prediction. Furthermore, it is crucial to note that prior approaches failed to capture topological constraints in protein-protein interaction networks. Zhang & Vance (2024) demonstrated that attention weights correlate with biochemical binding affinities. Direct contiguous sequence alignments show that deep architectures can predict enzymatic catalytic residues with over 92% sensitivity. Localized geometric embeddings conserve torsional angles and rotational equivariance across multimeric complexes.`,
    wordCount: 840,
    fileSizeBytes: 42000,
    uploadedAt: '2026-09-15T10:00:00Z',
    originalFileName: 'Miller_These_Doctorat_Topologie_Proteique_2025.pdf',
    sha256Fingerprint: 'f482a091b2c45e771d980a312bb4c87102e93bf409ac614e25a8128479e01124',
    tags: ['Génomique', 'Graph Neural Networks', 'Thèse Validée'],
  },
  {
    id: 'bdoc-bio-02',
    bankId: 'bank-bio-gen',
    subjectCode: 'BIO-GEN',
    title: 'Mémoire de Recherche : Algorithmes Évolutionnaires pour le Repliement Macromoléculaire',
    authors: 'Alexandre Renard, M2 Bio-Informatique',
    academicYear: '2024-2025',
    documentType: 'master_dissertation',
    abstract: 'Comparaison des métaheuristiques génétiques et des modèles d’attention pour la minimisation énergétique des conformations protéiques de novo.',
    content: `L’optimisation conformationnelle de chaînes polypeptidiques constitue un problème NP-difficile classique de la biologie computationnelle. Dans ce mémoire, nous démontrons comment les algorithmes génétiques couplés à des champs de force semi-empiriques permettent de contourner les minima locaux d’énergie libre de Gibbs. L’introduction de fonctions de score topologiques inspirées des méthodes de Monte-Carlo à chaîne de Markov améliore significativement la résolution des boucles flexibles.`,
    wordCount: 710,
    fileSizeBytes: 35000,
    uploadedAt: '2026-09-20T14:15:00Z',
    originalFileName: 'Renard_Memoire_M2_Algorithmes_Evolutionnaires.docx',
    sha256Fingerprint: 'b819e4210ac483120fb319a45612ecb80911fe39580a13dc880456209117ff0a',
    tags: ['Bioinformatique', 'Mémoire M2', 'Monte Carlo'],
  },
  {
    id: 'bdoc-cs-01',
    bankId: 'bank-cs-ai',
    subjectCode: 'CS-AI',
    title: 'Consensus Byzantin à Haute Échelle dans les Réseaux Non Fiables (Publication Laboratoire)',
    authors: 'Pr. David Benamou, Dr. Julien Caron',
    academicYear: '2025-2026',
    documentType: 'lab_publication',
    abstract: 'Analyse formelle des protocoles de consensus asynchrones sous contraintes de bande passante distribuée et topologies en réseau gossip.',
    content: `State machine replication across Byzantine failures has traditionally required quadratic leader-driven communication. In this laboratory research document, we formalize a quantized threshold signature scheme where consensus votes are aggregated into succinct logarithmic proofs. Under asynchronous network partitioning attacks with up to 33% malicious nodes, our protocol guarantees liveness and deterministic finality within 140ms on transatlantic testbeds. Byzantine fault tolerant state machine replication ensures total order broadcast across untrusted peer nodes.`,
    wordCount: 920,
    fileSizeBytes: 46000,
    uploadedAt: '2026-10-02T11:20:00Z',
    originalFileName: 'Benamou_LabReport_BFT_Consensus_2025.pdf',
    sha256Fingerprint: '7a123f4901ba3487c654312de890feab2134567809abcdef1234567890abcdef',
    tags: ['Systèmes Distribués', 'Consensus', 'Lab Publi'],
  },
  {
    id: 'bdoc-law-01',
    bankId: 'bank-law-tech',
    subjectCode: 'LAW-ETHIC',
    title: 'La Responsabilité Civile et Pénale des Systèmes d’IA Médicale Autonome (Thèse Juridique)',
    authors: 'Dr. Camille Laroche, Dir. Pr. Claire Fontaine',
    academicYear: '2024-2025',
    documentType: 'thesis',
    abstract: 'Étude comparative des régimes de responsabilité du fait des produits défectueux face aux diagnostics algorithmiques autonomes en milieu hospitalier.',
    content: `Autonomous Ethical Decision Frameworks in Modern Clinical Diagnostics represent a significant paradigm shift in medical jurisprudence. When algorithmic models assist clinical triage, questions of moral agency and accountability arise. According to Thornton (2023), machine learning models cannot hold fiduciary duty toward patients. Furthermore, it is crucial to note that autonomous diagnostic tools introduce liability ambiguity between medical practitioners and software vendors. L’application des principes de causalité adéquate et de faute de surveillance impose une redéfinition des obligations déontologiques des praticiens hospitaliers face aux recommandations automatisées.`,
    wordCount: 1040,
    fileSizeBytes: 52000,
    uploadedAt: '2026-09-28T09:40:00Z',
    originalFileName: 'Laroche_These_Responsabilite_IA_Medicale_2024.pdf',
    sha256Fingerprint: '4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d',
    tags: ['Droit Médical', 'IA Act', 'Thèse Sorbonne'],
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-11-09T18:30:12Z',
    actorEmail: 'admin.ops@scholarshield.cm',
    actorRole: 'super_admin',
    action: 'ENGINE_CALIBRATION_TEST',
    target: 'PlagiarismEngineAdapter v1.4.2',
    ipAddress: '192.168.1.104',
    status: 'success',
  },
  {
    id: 'log-02',
    timestamp: '2026-11-09T17:15:40Z',
    actorEmail: 'dean.academic.affairs@polytechnique.edu',
    actorRole: 'institution_admin',
    action: 'COHORT_SUBMISSION_BATCH_EXPORT',
    target: 'Department of Computer Science (62 documents)',
    ipAddress: '193.51.24.12',
    status: 'success',
  },
  {
    id: 'log-03',
    timestamp: '2026-11-09T15:22:01Z',
    actorEmail: 'dr.marcus.vance@cambridge.ac.uk',
    actorRole: 'faculty',
    action: 'ASSIGNMENT_CREATED',
    target: 'BIO-501 Master Thesis Draft',
    ipAddress: '131.111.8.45',
    status: 'success',
  },
  {
    id: 'log-04',
    timestamp: '2026-11-09T14:02:18Z',
    actorEmail: 'system.worker@cluster.internal',
    actorRole: 'system',
    action: 'SHINGLING_CORPUS_SYNC',
    target: '128,490,000 Academic Index Records',
    ipAddress: '10.0.4.18',
    status: 'success',
  },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlanConfig[] = [
  {
    id: 'plan-free',
    name: 'Free Academic Starter',
    priceMonthly: 0,
    priceYearly: 0,
    quotaWordsPerMonth: 5000,
    maxFileSizeMb: 8,
    features: [
      'Up to 3 document analyses / month',
      'Basic textual similarity overview',
      'Standard web reference corpus',
      'Watermarked web view report',
    ],
  },
  {
    id: 'plan-student',
    name: 'Student Pro',
    priceMonthly: 12,
    priceYearly: 108,
    quotaWordsPerMonth: 50000,
    maxFileSizeMb: 32,
    features: [
      'Individual academic thesis analysis',
      'Deep similarity detection (120M+ papers)',
      'AI content probability & burstiness analysis',
      'Official downloadable PDF integrity certificates',
      'Citation & bibliography exclusion filters',
    ],
    isPopular: true,
  },
  {
    id: 'plan-professional',
    name: 'Researcher / Faculty',
    priceMonthly: 39,
    priceYearly: 370,
    quotaWordsPerMonth: 250000,
    maxFileSizeMb: 64,
    features: [
      'Comprehensive research paper verification',
      'Priority queue processing',
      'Cross-lingual plagiarism analysis',
      'Document history & side-by-side match viewer',
      'LaTeX / PDF / DOCX source parsing',
      'Email & ticket priority support',
    ],
  },
  {
    id: 'plan-institution',
    name: 'University / Campus Enterprise',
    priceMonthly: 249,
    priceYearly: 2390,
    quotaWordsPerMonth: 5000000,
    maxFileSizeMb: 128,
    features: [
      'Unlimited departmental seats & students',
      'Campus-wide Single Sign-On (SAML / SSO)',
      'Internal institutional dissertation corpus sharing',
      'Centralized anti-plagiarism compliance dashboard',
      'LMS integration (Moodle, Canvas, Blackboard)',
      'Dedicated compliance officer & 99.9% uptime SLA',
    ],
  },
];

interface DataContextType {
  documents: AcademicDocument[];
  jobs: AnalysisJob[];
  collections: AcademicCollection[];
  departments: Department[];
  classes: AcademicClass[];
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  auditLogs: AuditLog[];
  plans: SubscriptionPlanConfig[];
  customSources: CustomReferenceSource[];
  thresholds: IntegrityThresholds;
  updateThresholds: (updates: Partial<IntegrityThresholds>) => void;
  addDocument: (doc: Omit<AcademicDocument, 'id' | 'uploadedAt'>) => AcademicDocument;
  deleteDocument: (id: string) => void;
  addCollection: (col: Omit<AcademicCollection, 'id' | 'createdAt' | 'updatedAt'>) => AcademicCollection;
  updateCollection: (id: string, updates: Partial<AcademicCollection>) => void;
  deleteCollection: (id: string) => void;
  assignDocumentToCollection: (documentId: string, collectionId?: string) => void;
  addCustomSource: (src: Omit<CustomReferenceSource, 'id' | 'addedAt'>) => CustomReferenceSource;
  deleteCustomSource: (id: string) => void;
  startAnalysisJob: (
    documentId: string,
    analysisType: AnalysisType,
    options?: {
      excludeCitations?: boolean;
      excludeBibliography?: boolean;
      institutionalCorpus?: boolean;
      customSources?: CustomReferenceSource[];
    }
  ) => Promise<AnalysisJob>;
  getJob: (jobId: string) => AnalysisJob | undefined;
  getDocument: (documentId: string) => AcademicDocument | undefined;
  addDepartment: (dept: Omit<Department, 'id' | 'classesCount' | 'studentsCount'>) => void;
  addClass: (cls: Omit<AcademicClass, 'id' | 'studentsCount' | 'submissionsCount'>) => void;
  addAssignment: (asg: Omit<Assignment, 'id' | 'totalSubmissions' | 'status'>) => void;
  deleteAssignment: (id: string) => void;
  addSubmission: (sub: Omit<Submission, 'id' | 'submittedAt'>) => Submission;
  updateSubmissionStatus: (id: string, status: Submission['status']) => void;
  addStudent: (student: Omit<Student, 'id' | 'totalSubmissions' | 'averageSimilarity'>) => void;
  deleteStudent: (id: string) => void;
  articles: ScientificArticle[];
  addArticle: (art: Omit<ScientificArticle, 'id' | 'registeredAt' | 'certificateId' | 'sha256Hash' | 'plagiarismScore' | 'aiProbabilityScore' | 'internalCampusOverlapScore' | 'status'> & Partial<Pick<ScientificArticle, 'status' | 'plagiarismScore' | 'aiProbabilityScore' | 'internalCampusOverlapScore' | 'reviewNotes' | 'doiReserved'>>) => ScientificArticle;
  updateArticleStatus: (id: string, status: ScientificArticle['status'], reviewNotes?: string) => void;
  deleteArticle: (id: string) => void;
  subjectBanks: SubjectDataBank[];
  bankDocuments: BankCorpusDocument[];
  addSubjectBank: (bank: Omit<SubjectDataBank, 'id' | 'documentsCount' | 'totalWords' | 'createdAt' | 'updatedAt'>) => SubjectDataBank;
  updateSubjectBank: (id: string, updates: Partial<SubjectDataBank>) => void;
  deleteSubjectBank: (id: string) => void;
  toggleBankActive: (bankId: string) => void;
  addBankDocument: (doc: Omit<BankCorpusDocument, 'id' | 'uploadedAt' | 'wordCount' | 'fileSizeBytes' | 'sha256Fingerprint'> & { content: string; wordCount?: number; fileSizeBytes?: number }) => BankCorpusDocument;
  batchUploadBankDocuments: (bankId: string, docs: Array<{ title: string; authors: string; academicYear?: string; documentType?: BankCorpusDocument['documentType']; content: string; originalFileName?: string; abstract?: string; tags?: string[] }>) => number;
  deleteBankDocument: (id: string) => void;
  resetAllDataToDefault: () => void;
  exportDataAsJson: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<AcademicDocument[]>(() => {
    try {
      const stored = localStorage.getItem('scholarshield_documents_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_DOCUMENTS;
  });

  const [jobs, setJobs] = useState<AnalysisJob[]>(() => {
    try {
      const stored = localStorage.getItem('scholarshield_jobs_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_JOBS;
  });

  const [collections, setCollections] = useState<AcademicCollection[]>(() => {
    try {
      const stored = localStorage.getItem('scholarshield_collections_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_COLLECTIONS;
  });

  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [classes, setClasses] = useState<AcademicClass[]>(INITIAL_CLASSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [articles, setArticles] = useState<ScientificArticle[]>(() => {
    try {
      const stored = localStorage.getItem('scholarshield_scientific_articles_v1') || localStorage.getItem('veritas_scientific_articles_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_ARTICLES;
  });
  const [subjectBanks, setSubjectBanks] = useState<SubjectDataBank[]>(() => {
    try {
      const stored = localStorage.getItem('scholarshield_subject_banks_v1') || localStorage.getItem('veritas_subject_banks_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_SUBJECT_BANKS;
  });
  const [bankDocuments, setBankDocuments] = useState<BankCorpusDocument[]>(() => {
    try {
      const stored = localStorage.getItem('scholarshield_bank_documents_v1') || localStorage.getItem('veritas_bank_documents_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_BANK_DOCUMENTS;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const stored = localStorage.getItem('scholarshield_audit_logs_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_AUDIT_LOGS;
  });
  const [plans] = useState<SubscriptionPlanConfig[]>(SUBSCRIPTION_PLANS);
  const [customSources, setCustomSources] = useState<CustomReferenceSource[]>(() => {
    try {
      const stored = localStorage.getItem('scholarshield_custom_sources_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_CUSTOM_SOURCES;
  });

  const [thresholds, setThresholds] = useState<IntegrityThresholds>(() => {
    try {
      const stored = localStorage.getItem('scholarshield_integrity_thresholds_v1') || localStorage.getItem('veritas_integrity_thresholds_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_THRESHOLDS;
  });

  // Reactive persistence across all data entities
  useEffect(() => {
    try {
      localStorage.setItem('scholarshield_documents_v2', JSON.stringify(documents));
    } catch {}
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem('scholarshield_jobs_v2', JSON.stringify(jobs));
    } catch {}
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem('scholarshield_collections_v2', JSON.stringify(collections));
    } catch {}
  }, [collections]);

  useEffect(() => {
    try {
      localStorage.setItem('scholarshield_custom_sources_v2', JSON.stringify(customSources));
    } catch {}
  }, [customSources]);

  useEffect(() => {
    try {
      localStorage.setItem('scholarshield_audit_logs_v2', JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  const resetAllDataToDefault = () => {
    setDocuments(SAMPLE_DOCUMENTS);
    setJobs(INITIAL_JOBS);
    setCollections(INITIAL_COLLECTIONS);
    setCustomSources(DEFAULT_CUSTOM_SOURCES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    try {
      localStorage.removeItem('scholarshield_documents_v2');
      localStorage.removeItem('scholarshield_jobs_v2');
      localStorage.removeItem('scholarshield_collections_v2');
      localStorage.removeItem('scholarshield_custom_sources_v2');
      localStorage.removeItem('scholarshield_audit_logs_v2');
    } catch {}
  };

  const exportDataAsJson = () => {
    const payload = {
      documents,
      jobs,
      collections,
      customSources,
      exportedAt: new Date().toISOString(),
      platform: 'ScholarShield Academic Integrity',
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ScholarShield_Academic_Data_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateThresholds = (updates: Partial<IntegrityThresholds>) => {
    setThresholds((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('scholarshield_integrity_thresholds_v1', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const addDocument = (docData: Omit<AcademicDocument, 'id' | 'uploadedAt'>): AcademicDocument => {
    const newDoc: AcademicDocument = {
      ...docData,
      id: `doc-${Date.now().toString(36)}`,
      uploadedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const addCollection = (colData: Omit<AcademicCollection, 'id' | 'createdAt' | 'updatedAt'>): AcademicCollection => {
    const newCol: AcademicCollection = {
      ...colData,
      id: `col-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCollections((prev) => [newCol, ...prev]);
    return newCol;
  };

  const updateCollection = (id: string, updates: Partial<AcademicCollection>) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c))
    );
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    setDocuments((prev) =>
      prev.map((d) => (d.collectionId === id ? { ...d, collectionId: undefined } : d))
    );
  };

  const assignDocumentToCollection = (documentId: string, collectionId?: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === documentId ? { ...d, collectionId } : d))
    );
  };

  const addCustomSource = (src: Omit<CustomReferenceSource, 'id' | 'addedAt'>): CustomReferenceSource => {
    const newSrc: CustomReferenceSource = {
      ...src,
      id: `csrc-${Date.now().toString(36)}`,
      addedAt: new Date().toISOString(),
    };
    setCustomSources((prev) => [newSrc, ...prev]);
    return newSrc;
  };

  const deleteCustomSource = (id: string) => {
    setCustomSources((prev) => prev.filter((s) => s.id !== id));
  };

  const getJob = (jobId: string) => jobs.find((j) => j.id === jobId);
  const getDocument = (documentId: string) => documents.find((d) => d.id === documentId);

  const startAnalysisJob = async (
    documentId: string,
    analysisType: AnalysisType,
    options?: {
      excludeCitations?: boolean;
      excludeBibliography?: boolean;
      institutionalCorpus?: boolean;
      customSources?: CustomReferenceSource[];
    }
  ): Promise<AnalysisJob> => {
    const doc = documents.find((d) => d.id === documentId);
    if (!doc) throw new Error('Document not found');

    const jobId = `job-${Date.now().toString(36)}`;
    const newJob: AnalysisJob = {
      id: jobId,
      documentId: doc.id,
      documentTitle: doc.title,
      userId: doc.userId,
      analysisType,
      status: 'queued',
      progressPercent: 5,
      currentStepMessage: options?.customSources && options.customSources.length > 0
        ? `Queued multi-source comparison against ${options.customSources.length} custom reference documents...`
        : 'Job queued in distributed processing scheduler...',
      createdAt: new Date().toISOString(),
      customSources: options?.customSources,
    };

    setJobs((prev) => [newJob, ...prev]);

    // Update document with last analysis job
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, lastAnalysisJobId: jobId } : d))
    );

    // Multi-step realistic execution
    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? { ...j, status: 'extracting', progressPercent: 25, currentStepMessage: 'Extracting text and token stream from document...' }
            : j
        )
      );
    }, 400);

    setTimeout(() => {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'preprocessing',
                progressPercent: 45,
                currentStepMessage: options?.customSources && options.customSources.length > 0
                  ? `Building N-gram hash index across ${options.customSources.length} custom reference sources...`
                  : 'Segmenting sentences and filtering excluded citation blocks...',
              }
            : j
        )
      );
    }, 900);

    setTimeout(async () => {
      let plagRes = undefined;
      let aiRes = undefined;

      if (analysisType === 'plagiarism' || analysisType === 'both') {
        if (options?.customSources && options.customSources.length > 0) {
          plagRes = await multiSourceEngine.analyze(doc.content, options.customSources, {
            excludeCitations: options?.excludeCitations,
            excludeBibliography: options?.excludeBibliography,
          });
          plagRes.isCustomCorpus = true;
        } else {
          plagRes = await plagiarismEngine.analyze(doc.content, {
            excludeCitations: options?.excludeCitations,
            excludeBibliography: options?.excludeBibliography,
          });
        }
      }

      if (analysisType === 'ai' || analysisType === 'both') {
        aiRes = await aiEngine.analyze(doc.content);
      }

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: 'completed',
                progressPercent: 100,
                currentStepMessage: 'Verification complete. Verifiable report generated.',
                completedAt: new Date().toISOString(),
                plagiarismResult: plagRes,
                aiDetectionResult: aiRes,
              }
            : j
        )
      );

      // Add to audit logs
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now().toString(36)}`,
          timestamp: new Date().toISOString(),
          actorEmail: 'claire.dubois@sorbonne-universite.fr',
          actorRole: 'student',
          action: options?.customSources && options.customSources.length > 0
            ? `CUSTOM_CORPUS_SIMILARITY_${analysisType.toUpperCase()}`
            : `ANALYSIS_${analysisType.toUpperCase()}`,
          target: doc.title,
          ipAddress: '82.64.120.44',
          status: 'success',
        },
        ...prev,
      ]);
    }, 1800);

    return newJob;
  };

  const addDepartment = (dept: Omit<Department, 'id' | 'classesCount' | 'studentsCount'>) => {
    const newDept: Department = {
      ...dept,
      id: `dept-${Date.now().toString(36)}`,
      classesCount: 0,
      studentsCount: 0,
    };
    setDepartments((prev) => [newDept, ...prev]);
  };

  const addClass = (cls: Omit<AcademicClass, 'id' | 'studentsCount' | 'submissionsCount'>) => {
    const newClass: AcademicClass = {
      ...cls,
      id: `cls-${Date.now().toString(36)}`,
      studentsCount: 0,
      submissionsCount: 0,
    };
    setClasses((prev) => [newClass, ...prev]);
  };

  const addAssignment = (asg: Omit<Assignment, 'id' | 'totalSubmissions' | 'status'>) => {
    const newAsg: Assignment = {
      ...asg,
      id: `asg-${Date.now().toString(36)}`,
      totalSubmissions: 0,
      status: 'open',
    };
    setAssignments((prev) => [newAsg, ...prev]);
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  const addSubmission = (sub: Omit<Submission, 'id' | 'submittedAt'>): Submission => {
    const newSub: Submission = {
      ...sub,
      id: `sub-${Date.now().toString(36)}`,
      submittedAt: new Date().toISOString(),
    };
    setSubmissions((prev) => [newSub, ...prev]);
    setAssignments((prev) =>
      prev.map((a) => (a.id === sub.assignmentId ? { ...a, totalSubmissions: a.totalSubmissions + 1 } : a))
    );
    return newSub;
  };

  const updateSubmissionStatus = (id: string, status: Submission['status']) => {
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const addStudent = (student: Omit<Student, 'id' | 'totalSubmissions' | 'averageSimilarity'>) => {
    const newStudent: Student = {
      ...student,
      id: `stu-${Date.now().toString(36)}`,
      totalSubmissions: 0,
      averageSimilarity: 0,
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const saveArticles = (next: ScientificArticle[]) => {
    setArticles(next);
    try {
      localStorage.setItem('scholarshield_scientific_articles_v1', JSON.stringify(next));
    } catch {}
  };

  const addArticle = (
    artData: Omit<ScientificArticle, 'id' | 'registeredAt' | 'certificateId' | 'sha256Hash' | 'plagiarismScore' | 'aiProbabilityScore' | 'internalCampusOverlapScore' | 'status'> &
      Partial<Pick<ScientificArticle, 'status' | 'plagiarismScore' | 'aiProbabilityScore' | 'internalCampusOverlapScore' | 'reviewNotes' | 'doiReserved'>>
  ): ScientificArticle => {
    let hashInt = 0;
    const str = `${artData.title}:${artData.authors}:${artData.content}:${Date.now()}`;
    for (let i = 0; i < str.length; i++) {
      hashInt = ((hashInt << 5) - hashInt) + str.charCodeAt(i);
      hashInt |= 0;
    }
    const hex = Math.abs(hashInt).toString(16).padStart(8, '0');
    const pseudoSha = `${hex}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`.slice(0, 64);

    const certId = `CERT-PUB-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const words = artData.content ? artData.content.split(/\s+/).filter(Boolean).length : 500;
    const computedPlagiarism = artData.plagiarismScore ?? Number((Math.random() * 7 + 1.2).toFixed(1));
    const computedAi = artData.aiProbabilityScore ?? Number((Math.random() * 9 + 1.8).toFixed(1));
    const computedOverlap = artData.internalCampusOverlapScore ?? Number((Math.random() * 3.5 + 0.5).toFixed(1));

    let defaultStatus: ScientificArticle['status'] = 'certified_ready';
    if (computedPlagiarism > 20 || computedOverlap > 10) {
      defaultStatus = 'needs_revision';
    } else if (computedPlagiarism > 35) {
      defaultStatus = 'flagged_breach';
    }

    const newArticle: ScientificArticle = {
      ...artData,
      id: `art-${Date.now().toString(36)}`,
      wordCount: artData.wordCount || words,
      fileSizeBytes: artData.fileSizeBytes || (words * 6),
      registeredAt: new Date().toISOString(),
      sha256Hash: pseudoSha,
      certificateId: certId,
      plagiarismScore: computedPlagiarism,
      aiProbabilityScore: computedAi,
      internalCampusOverlapScore: computedOverlap,
      status: artData.status || defaultStatus,
      reviewNotes: artData.reviewNotes || (defaultStatus === 'certified_ready'
        ? 'Certification d’antériorité accordée : Aucun conflit détecté dans les 120M+ revues indexées et les archives internes du campus.'
        : 'Vérification requise par l’équipe éditoriale ou le laboratoire avant soumission.'),
    };

    saveArticles([newArticle, ...articles]);
    return newArticle;
  };

  const updateArticleStatus = (id: string, status: ScientificArticle['status'], reviewNotes?: string) => {
    saveArticles(
      articles.map((a) => (a.id === id ? { ...a, status, reviewNotes: reviewNotes ?? a.reviewNotes } : a))
    );
  };

  const deleteArticle = (id: string) => {
    saveArticles(articles.filter((a) => a.id !== id));
  };

  const saveSubjectBanks = (next: SubjectDataBank[]) => {
    setSubjectBanks(next);
    try {
      localStorage.setItem('scholarshield_subject_banks_v1', JSON.stringify(next));
    } catch {}
  };

  const saveBankDocuments = (next: BankCorpusDocument[]) => {
    setBankDocuments(next);
    try {
      localStorage.setItem('scholarshield_bank_documents_v1', JSON.stringify(next));
    } catch {}
  };

  const addSubjectBank = (
    bankData: Omit<SubjectDataBank, 'id' | 'documentsCount' | 'totalWords' | 'createdAt' | 'updatedAt'>
  ): SubjectDataBank => {
    const newBank: SubjectDataBank = {
      ...bankData,
      id: `bank-${Date.now().toString(36)}`,
      documentsCount: 0,
      totalWords: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSubjectBanks([newBank, ...subjectBanks]);
    return newBank;
  };

  const updateSubjectBank = (id: string, updates: Partial<SubjectDataBank>) => {
    saveSubjectBanks(
      subjectBanks.map((b) => (b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b))
    );
  };

  const deleteSubjectBank = (id: string) => {
    saveSubjectBanks(subjectBanks.filter((b) => b.id !== id));
    saveBankDocuments(bankDocuments.filter((d) => d.bankId !== id));
  };

  const toggleBankActive = (bankId: string) => {
    saveSubjectBanks(
      subjectBanks.map((b) =>
        b.id === bankId
          ? {
              ...b,
              isActiveForPlagiarismCheck: !b.isActiveForPlagiarismCheck,
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );
  };

  const addBankDocument = (
    docData: Omit<BankCorpusDocument, 'id' | 'uploadedAt' | 'wordCount' | 'fileSizeBytes' | 'sha256Fingerprint'> & {
      content: string;
      wordCount?: number;
      fileSizeBytes?: number;
    }
  ): BankCorpusDocument => {
    const words = docData.wordCount ?? docData.content.split(/\s+/).filter(Boolean).length;
    const bytes = docData.fileSizeBytes ?? words * 6;

    let hashInt = 0;
    const str = `${docData.title}:${docData.authors}:${docData.content}`;
    for (let i = 0; i < str.length; i++) {
      hashInt = ((hashInt << 5) - hashInt) + str.charCodeAt(i);
      hashInt |= 0;
    }
    const hex = Math.abs(hashInt).toString(16).padStart(8, '0');
    const fingerprint = `${hex}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`.slice(0, 64);

    const newDoc: BankCorpusDocument = {
      ...docData,
      id: `bdoc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      wordCount: words,
      fileSizeBytes: bytes,
      uploadedAt: new Date().toISOString(),
      sha256Fingerprint: fingerprint,
    };

    const nextDocs = [newDoc, ...bankDocuments];
    saveBankDocuments(nextDocs);

    saveSubjectBanks(
      subjectBanks.map((b) =>
        b.id === docData.bankId
          ? {
              ...b,
              documentsCount: b.documentsCount + 1,
              totalWords: b.totalWords + words,
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );

    return newDoc;
  };

  const batchUploadBankDocuments = (
    bankId: string,
    docs: Array<{
      title: string;
      authors: string;
      academicYear?: string;
      documentType?: BankCorpusDocument['documentType'];
      content: string;
      originalFileName?: string;
      abstract?: string;
      tags?: string[];
    }>
  ): number => {
    const bank = subjectBanks.find((b) => b.id === bankId);
    const subjectCode = bank?.subjectCode || 'GEN-SUBJ';

    const newDocs: BankCorpusDocument[] = docs.map((d) => {
      const words = d.content.split(/\s+/).filter(Boolean).length;
      let hashInt = 0;
      const str = `${d.title}:${d.authors}:${d.content}:${Math.random()}`;
      for (let i = 0; i < str.length; i++) {
        hashInt = ((hashInt << 5) - hashInt) + str.charCodeAt(i);
        hashInt |= 0;
      }
      const hex = Math.abs(hashInt).toString(16).padStart(8, '0');
      const fingerprint = `${hex}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`.slice(0, 64);

      return {
        id: `bdoc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
        bankId,
        subjectCode,
        title: d.title,
        authors: d.authors || 'Auteur Non Spécifié',
        academicYear: d.academicYear || '2025-2026',
        documentType: d.documentType || 'thesis',
        content: d.content,
        abstract: d.abstract || d.content.slice(0, 200) + '...',
        wordCount: words,
        fileSizeBytes: words * 6,
        uploadedAt: new Date().toISOString(),
        originalFileName: d.originalFileName,
        sha256Fingerprint: fingerprint,
        tags: d.tags || [subjectCode],
      };
    });

    const nextDocs = [...newDocs, ...bankDocuments];
    saveBankDocuments(nextDocs);

    const addedWords = newDocs.reduce((acc, cur) => acc + cur.wordCount, 0);
    saveSubjectBanks(
      subjectBanks.map((b) =>
        b.id === bankId
          ? {
              ...b,
              documentsCount: b.documentsCount + newDocs.length,
              totalWords: b.totalWords + addedWords,
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );

    return newDocs.length;
  };

  const deleteBankDocument = (id: string) => {
    const docToDelete = bankDocuments.find((d) => d.id === id);
    if (!docToDelete) return;

    saveBankDocuments(bankDocuments.filter((d) => d.id !== id));
    saveSubjectBanks(
      subjectBanks.map((b) =>
        b.id === docToDelete.bankId
          ? {
              ...b,
              documentsCount: Math.max(0, b.documentsCount - 1),
              totalWords: Math.max(0, b.totalWords - docToDelete.wordCount),
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );
  };

  return (
    <DataContext.Provider
      value={{
        documents,
        jobs,
        collections,
        departments,
        classes,
        students,
        assignments,
        submissions,
        articles,
        subjectBanks,
        bankDocuments,
        auditLogs,
        plans,
        customSources,
        addDocument,
        deleteDocument,
        addCollection,
        updateCollection,
        deleteCollection,
        assignDocumentToCollection,
        addCustomSource,
        deleteCustomSource,
        startAnalysisJob,
        getJob,
        getDocument,
        thresholds,
        updateThresholds,
        addDepartment,
        addClass,
        addAssignment,
        deleteAssignment,
        addSubmission,
        updateSubmissionStatus,
        addStudent,
        deleteStudent,
        addArticle,
        updateArticleStatus,
        deleteArticle,
        addSubjectBank,
        updateSubjectBank,
        deleteSubjectBank,
        toggleBankActive,
        addBankDocument,
        batchUploadBankDocuments,
        deleteBankDocument,
        resetAllDataToDefault,
        exportDataAsJson,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
