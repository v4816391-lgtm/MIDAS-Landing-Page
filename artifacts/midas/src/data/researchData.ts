export type ResearchQuestionData = {
  originalIdea: string;
  researchQuestion?: string;
  refinedQuestion: string;
  domain?: string;
  subdomain?: string;
  topic: string;
  subject: string;
  researchObjective?: string;
  technology: string;
  dataType?: string;
  researchTask: string;
  population: string;
  exposure: string;
  outcome: string;
  researchType: string;
  keyConcepts: string[];
  keywords: string[];
  clarifications?: string[];
};

export type LiteratureItem = {
  id: string;
  title: string;
  authors: string;
  year: number | null;
  studyType: string;
  area: string;
  summary: string;
  relevance: string;
  source?: string;
  sourceUrl?: string;
  doi?: string;
  identifier?: string;
  journalUrl?: string;
  relevanceTier?: 'Directly relevant' | 'Highly relevant' | 'Methodologically relevant' | 'Background';
  relevanceScore?: number;
  relevanceReason?: string;
};

export type MethodologyOption = {
  id: string;
  name: string;
  fit: string;
  advantages: string[];
  limitations: string[];
};

export type InstrumentItem = {
  id: string;
  name: string;
  measures: string;
  population: string;
  validationStatus: string;
  source: string;
};

export type EthicsPlan = {
  considerations: string[];
  disclaimer: string;
};

export type DataCollectionPlan = {
  participants: string;
  variables: string[];
  methods: string[];
  inclusion: string[];
  exclusion: string[];
};

export type AnalysisPlan = {
  variables: { name: string; type: string; role: string }[];
  descriptive: string[];
  statistical: string[];
  note: string;
};

export type JournalRecommendation = {
  name: string;
  area: string;
  reason: string;
  source: string;
  evidence: string;
  originalJournalLink: string;
  relevanceScore: number | null;
};

export type BeginnerMistake = {
  title: string;
  detail: string;
};

export type RoadmapItem = {
  stepId: string;
  title: string;
  focus: string;
  actions: string[];
  evidenceAnchor: string;
};

export type ResearchResult = {
  question: ResearchQuestionData;
  domain?: string;
  sourcePlan?: {
    providers: string[];
    query: string;
    retrievedAt: string;
    note: string;
  };
  literature: LiteratureItem[];
  evidence?: {
    sourceCount: number;
    summary: string;
    gaps: string[];
    caveat: string;
  };
  searchStrategy: {
    keywords: string[];
    booleanQuery: string;
    databases: string[];
  };
  methodologies: MethodologyOption[];
  instruments: InstrumentItem[];
  ethics: EthicsPlan;
  dataCollection: DataCollectionPlan;
  analysis: AnalysisPlan;
  journals: JournalRecommendation[];
  journalSelectionNote?: string;
  beginnerMistakes: BeginnerMistake[];
  roadmap?: RoadmapItem[];
};

export const sampleResearchIdea =
  'I want to study how sleep deprivation affects memory in medical students.';