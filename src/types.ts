export type CaseStatus = 'open' | 'active' | 'closed';
export type CasePriority = 'low' | 'medium' | 'high' | 'critical';

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  location: string;
  incidentDate: string;
  createdAt: string;
  leadInvestigator: string;
  witnesses: string[];
  tags: string[];
}

export type StatementStatus = 'draft' | 'recorded' | 'analyzed';
export type ReliabilityLevel = 'high' | 'medium' | 'low';

export interface Witness {
  id: string;
  caseId: string;
  name: string;
  age: number;
  occupation: string;
  relationship: string;
  contactInfo: string;
  interviewDate: string;
  interviewLocation: string;
}

export interface StatementDetail {
  time: string;
  observation: string;
  confidence: number;
}

export interface WitnessStatement {
  id: string;
  caseId: string;
  witnessId: string;
  witnessName: string;
  rawStatement: string;
  keyDetails: string[];
  timelineEvents: StatementDetail[];
  status: StatementStatus;
  emotionalState: string;
  distanceFromScene: string;
  lightingConditions: string;
  recordedAt: string;
  reliabilityScore: number;
  reliabilityLevel: ReliabilityLevel;
  tags: string[];
}

export type QuestionStatus = 'pending' | 'answered' | 'skipped';

export interface FollowUpQuestion {
  id: string;
  caseId: string;
  witnessId: string;
  witnessName: string;
  question: string;
  rationale: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: QuestionStatus;
  generatedAt: string;
  answer?: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  witnessId: string;
  witnessName: string;
  timestamp: string;
  event: string;
  detail: string;
  confidence: number;
  corroborated: boolean;
  category: string;
}

export interface ComparisonPoint {
  topic: string;
  witness1Id: string;
  witness1Statement: string;
  witness2Id: string;
  witness2Statement: string;
  alignment: 'match' | 'partial' | 'conflict';
  note: string;
}

export interface Contradiction {
  id: string;
  caseId: string;
  topic: string;
  witness1Id: string;
  witness1Name: string;
  witness1Claim: string;
  witness2Id: string;
  witness2Name: string;
  witness2Claim: string;
  severity: 'minor' | 'moderate' | 'major';
  explanation: string;
  recommendation: string;
  status: 'unresolved' | 'reviewed' | 'resolved';
  detectedAt: string;
}

export interface Insight {
  id: string;
  caseId: string;
  title: string;
  description: string;
  category: string;
  significance: 'high' | 'medium' | 'low';
  relatedWitnesses: string[];
  evidenceStrength: number;
  generatedAt: string;
}

export interface ReliabilityFactor {
  name: string;
  score: number;
  weight: number;
  note: string;
}

export interface ReliabilityAnalysis {
  witnessId: string;
  witnessName: string;
  overallScore: number;
  level: ReliabilityLevel;
  factors: ReliabilityFactor[];
  strengths: string[];
  concerns: string[];
}

export interface CaseReport {
  caseId: string;
  generatedAt: string;
  summary: string;
  witnessCount: number;
  totalStatements: number;
  contradictionsFound: number;
  insightsCount: number;
  averageReliability: number;
  keyFindings: string[];
  recommendations: string[];
  aiDisclaimer: string;
}

export type ViewId =
  | 'dashboard'
  | 'cases'
  | 'statements'
  | 'followup'
  | 'timeline'
  | 'comparison'
  | 'contradictions'
  | 'insights'
  | 'confidence'
  | 'reports'
  | 'future'
  | 'statement-collection'
  | 'ai-followup-analysis'
  | 'witness-summary';

// ===== Member 1: Witness Statement Collection =====

export type InputMethod = 'text' | 'voice' | 'audio-upload';
export type CollectedStatementStatus = 'draft' | 'saved' | 'analyzed';

export interface ExtractedEntity {
  category: ExtractedCategory;
  value: string;
  confidence: number;
}

export type ExtractedCategory =
  | 'time'
  | 'location'
  | 'people'
  | 'clothing'
  | 'vehicles'
  | 'actions'
  | 'direction'
  | 'objects'
  | 'observations';

export interface GeneratedQuestion {
  id: string;
  question: string;
  rationale: string;
  category: string;
  status: QuestionStatus;
  answer?: string;
}

export interface MissingInfoItem {
  category: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface CollectedStatement {
  id: string;
  caseId: string;
  caseTitle: string;
  witnessLabel: string;
  witnessSlot: number;
  isAnonymous: boolean;
  statement: string;
  inputMethod: InputMethod;
  audioFileName?: string;
  status: CollectedStatementStatus;
  savedAt: string;
  analyzedAt?: string;
  extractedEntities: ExtractedEntity[];
  generatedQuestions: GeneratedQuestion[];
  missingInfo: MissingInfoItem[];
  updatedSummary?: string;
}

// ===== Member 2: Investigation Analysis =====

export type ComparisonClassification = 'common' | 'difference' | 'contradiction';

export interface ComparisonRow {
  topic: string;
  values: Record<string, string>;
  classification: ComparisonClassification;
  note: string;
}

export interface CommonFact {
  id: string;
  caseId: string;
  category: string;
  description: string;
  witnesses: string[];
  status: 'consistent';
}

export interface DifferenceItem {
  id: string;
  caseId: string;
  category: string;
  witnessClaims: { witnessName: string; claim: string }[];
  severity: 'low' | 'medium';
  status: 'requires_verification';
  note: string;
}

export interface InvestigationSummary {
  caseId: string;
  summary: string;
  keyAgreements: string[];
  keyContradictions: string[];
  missingInformation: string[];
  recommendedVerification: string[];
  generatedAt: string;
}
