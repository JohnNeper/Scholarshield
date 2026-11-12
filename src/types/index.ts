export type Role = 'student' | 'faculty' | 'institution_admin' | 'super_admin';

export type Language = 'en' | 'fr';

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  password?: string;
  institutionId?: string;
  institutionName?: string;
  academicField?: string;
  country?: string;
  avatarUrl?: string;
  preferredLanguage: Language;
  creditsRemaining: number;
  creditsTotal: number;
  plan: 'free' | 'student' | 'professional' | 'institution';
  createdAt: string;
}

export type AnalysisType = 'plagiarism' | 'ai' | 'both';

export type JobStatus =
  | 'queued'
  | 'extracting'
  | 'preprocessing'
  | 'similarity_analysis'
  | 'ai_analysis'
  | 'report_generation'
  | 'completed'
  | 'failed';

export interface SourceReference {
  id: string;
  title: string;
  authors: string;
  publication: string;
  year: number;
  url?: string;
  category: 'journal' | 'thesis' | 'conference' | 'institutional_archive' | 'web';
  similarityPercentage: number;
  matchedWordsCount: number;
}

export interface MatchedPassage {
  id: string;
  sourceId: string;
  sourceTitle: string;
  documentText: string;
  sourceText: string;
  offsetStart: number;
  offsetEnd: number;
  pageNumber: number;
  matchType: 'identical' | 'paraphrased' | 'citation_excluded';
  similarityScore: number; // 0 - 100
  explanation: string;
}

export interface CustomReferenceSource {
  id: string;
  title: string;
  content: string;
  filename?: string;
  fileSizeBytes?: number;
  wordCount: number;
  addedAt: string;
  authors?: string;
  category?: 'thesis' | 'journal' | 'conference' | 'institutional_archive' | 'web';
}

export interface PlagiarismResult {
  jobId: string;
  similarityScore: number; // 0 - 100
  matchedWordCount: number;
  totalWordCount: number;
  identifiedSourcesCount: number;
  coveragePercentage: number;
  sources: SourceReference[];
  matchedPassages: MatchedPassage[];
  excludedCitationsCount: number;
  excludedBibliographyCount: number;
  isCustomCorpus?: boolean;
}

export interface FlaggedAIPassage {
  id: string;
  text: string;
  offsetStart: number;
  offsetEnd: number;
  pageNumber: number;
  aiProbability: number; // 0 - 100
  confidence: 'low' | 'moderate' | 'high';
  linguisticSignals: string[];
  explanation: string;
}

export interface AIDetectionResult {
  jobId: string;
  overallAIProbability: number; // 0 - 100
  analyzedWordCount: number;
  flaggedPassagesCount: number;
  coveragePercentage: number;
  burstinessScore: number; // measure of sentence variation
  perplexityEstimate: number; // measure of word predictability
  flaggedPassages: FlaggedAIPassage[];
  modelVersion: string;
  evaluationDisclaimer: string;
}

export interface AcademicDocument {
  id: string;
  userId: string;
  title: string;
  filename: string;
  fileSizeBytes: number;
  wordCount: number;
  mimeType: string;
  uploadedAt: string;
  content: string; // full text for client heuristic analysis
  collectionId?: string;
  tags: string[];
  lastAnalysisJobId?: string;
}

export interface AcademicCollection {
  id: string;
  userId: string;
  title: string;
  description: string;
  category?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AnalysisJob {
  id: string;
  documentId: string;
  documentTitle: string;
  userId: string;
  analysisType: AnalysisType;
  status: JobStatus;
  progressPercent: number;
  currentStepMessage: string;
  createdAt: string;
  completedAt?: string;
  plagiarismResult?: PlagiarismResult;
  aiDetectionResult?: AIDetectionResult;
  customSources?: CustomReferenceSource[];
  error?: string;
}

export interface Department {
  id: string;
  institutionId: string;
  name: string;
  code: string;
  headName: string;
  classesCount: number;
  studentsCount: number;
}

export interface AcademicClass {
  id: string;
  departmentId: string;
  departmentName: string;
  name: string;
  code: string;
  instructorName: string;
  academicYear: string;
  inviteCode: string;
  studentsCount: number;
  submissionsCount: number;
}

export interface Student {
  id: string;
  fullName: string;
  email: string;
  studentIdNumber: string;
  departmentName: string;
  className: string;
  totalSubmissions: number;
  averageSimilarity: number;
  status: 'active' | 'suspended';
}

export interface Assignment {
  id: string;
  classId: string;
  className: string;
  title: string;
  dueDate: string;
  acceptedFormats: string[];
  maxWords: number;
  similarityThresholdWarning: number;
  totalSubmissions: number;
  status: 'open' | 'closed';
}

export interface Submission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  submittedAt: string;
  documentId: string;
  documentTitle: string;
  similarityScore: number;
  aiScore: number;
  status: 'pending' | 'analyzed' | 'flagged' | 'cleared';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: string;
  action: string;
  target: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}

export interface SubscriptionPlanConfig {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  quotaWordsPerMonth: number;
  maxFileSizeMb: number;
  features: string[];
  isPopular?: boolean;
}

export interface IntegrityThresholds {
  similarityWarningThreshold: number; // e.g. 15 (%)
  similarityCriticalThreshold: number; // e.g. 30 (%)
  aiWarningThreshold: number; // e.g. 20 (%)
  aiCriticalThreshold: number; // e.g. 40 (%)
  minMatchingWords: number; // e.g. 8 words
  autoFlagSubmissions: boolean;
  requireHumanReviewOnBreach: boolean;
  excludeQuotedByDefault: boolean;
  excludeBibliographyByDefault: boolean;
}

export interface ScientificArticle {
  id: string;
  title: string;
  authors: string;
  correspondingAuthorEmail: string;
  departmentId: string;
  departmentName: string;
  targetJournalOrConference: string;
  targetSubmissionDate: string;
  manuscriptType: 'preprint' | 'journal_article' | 'conference_paper' | 'dissertation' | 'patent_claim';
  abstract: string;
  content: string;
  fileSizeBytes: number;
  wordCount: number;
  sha256Hash: string; // cryptographic proof of priority / anteriority
  registeredAt: string;
  plagiarismScore: number; // 0 - 100%
  aiProbabilityScore: number; // 0 - 100%
  internalCampusOverlapScore: number; // overlap with university research archive
  status: 'certified_ready' | 'needs_revision' | 'in_analysis' | 'flagged_breach';
  doiReserved?: string;
  certificateId: string;
  reviewNotes?: string;
}

export interface SubjectDataBank {
  id: string;
  name: string; // e.g. "Génomique & Bioinformatique"
  subjectCode: string; // e.g. "BIO-GEN"
  description: string;
  category: string; // e.g. "Sciences du Vivant", "Informatique", "Droit"
  departmentId?: string;
  departmentName?: string;
  color: string;
  isActiveForPlagiarismCheck: boolean;
  documentsCount: number;
  totalWords: number;
  createdAt: string;
  updatedAt: string;
}

export interface BankCorpusDocument {
  id: string;
  bankId: string; // references SubjectDataBank.id
  subjectCode: string;
  title: string;
  authors: string;
  academicYear: string;
  documentType: 'thesis' | 'master_dissertation' | 'lab_publication' | 'course_syllabus' | 'conference_paper';
  content: string;
  abstract?: string;
  wordCount: number;
  fileSizeBytes: number;
  uploadedAt: string;
  originalFileName?: string;
  sha256Fingerprint: string;
  tags?: string[];
}


