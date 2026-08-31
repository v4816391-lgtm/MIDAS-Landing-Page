export type ResearchQuestionData = {
  originalIdea: string;
  refinedQuestion: string;
  topic: string;
  subject: string;
  technology: string;
  researchTask: string;
  population: string;
  exposure: string;
  outcome: string;
  researchType: string;
  keyConcepts: string[];
  keywords: string[];
};

export type LiteratureItem = {
  id: string;
  title: string;
  authors: string;
  year: number;
  studyType: string;
  area: string;
  summary: string;
  relevance: string;
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
  relevanceScore: number;
};

export type BeginnerMistake = {
  title: string;
  detail: string;
};

export type ResearchResult = {
  question: ResearchQuestionData;
  literature: LiteratureItem[];
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
  beginnerMistakes: BeginnerMistake[];
};

export const sampleResearchIdea =
  'I want to study how sleep deprivation affects memory in medical students.';

export const sleepResearchContent: Omit<ResearchResult, 'question'> = {
  literature: [
    {
      id: 'lit-01',
      title: 'Sleep loss and memory consolidation in medical trainees',
      authors: 'Rao, M. · Chen, L. · Patel, S.',
      year: 2022,
      studyType: 'Cross-sectional',
      area: 'Cognitive performance',
      summary:
        'Explores the relationship between reported sleep duration and short-term memory scores during clinical training.',
      relevance:
        'Useful for seeing how sleep exposure and cognitive outcomes can be operationalized.',
    },
    {
      id: 'lit-02',
      title: 'The hidden cost of overnight clinical work',
      authors: 'Williams, A. · Okafor, N.',
      year: 2021,
      studyType: 'Cohort study',
      area: 'Medical education',
      summary:
        'Follows students across rotations to compare fatigue, schedule changes, and academic performance.',
      relevance:
        'Offers a model for repeated measurement and a longitudinal comparison group.',
    },
    {
      id: 'lit-03',
      title: 'Measuring working memory after acute sleep restriction',
      authors: 'Hassan, Y. · Mehta, P.',
      year: 2020,
      studyType: 'Experimental',
      area: 'Sleep science',
      summary:
        'Tests a controlled period of sleep restriction and evaluates performance on standardized memory tasks.',
      relevance:
        'A helpful reference when comparing observational and experimental approaches.',
    },
  ],
  searchStrategy: {
    keywords: [
      'sleep deprivation',
      'sleep restriction',
      'memory performance',
      'working memory',
      'medical students',
      'clinical trainees',
    ],
    booleanQuery:
      '("sleep deprivation" OR "sleep restriction") AND ("memory performance" OR "working memory") AND ("medical students" OR trainees)',
    databases: ['PubMed', 'Google Scholar', 'CINAHL', 'PsycINFO'],
  },
  methodologies: [
    {
      id: 'cross-sectional',
      name: 'Cross-sectional study',
      fit: 'A practical starting point for measuring sleep patterns and memory at one point in time.',
      advantages: ['Efficient to run', 'Good for estimating patterns', 'Lower cost'],
      limitations: ['Cannot establish temporal order', 'Sensitive to self-report bias'],
    },
    {
      id: 'cohort',
      name: 'Prospective cohort',
      fit: 'A strong fit if you can follow students across a rotation or academic term.',
      advantages: ['Shows change over time', 'Clarifies temporal sequence', 'Can study multiple outcomes'],
      limitations: ['Needs more time', 'Participant drop-off can affect results'],
    },
    {
      id: 'experimental',
      name: 'Experimental design',
      fit: 'Useful when a controlled, ethical sleep manipulation and objective memory task are feasible.',
      advantages: ['Stronger causal inference', 'Control over conditions', 'Clear comparison'],
      limitations: ['Ethically and practically complex', 'May feel less like real life'],
    },
  ],
  instruments: [
    {
      id: 'isi',
      name: 'Insomnia Severity Index (ISI)',
      measures: 'Perceived insomnia symptoms and sleep-related distress',
      population: 'Adults, including student populations',
      validationStatus: 'Established measure; verify current evidence',
      source: 'Original instrument publication / rights holder',
    },
    {
      id: 'psqi',
      name: 'Pittsburgh Sleep Quality Index (PSQI)',
      measures: 'Sleep quality and disturbances over the previous month',
      population: 'Adults and clinical research populations',
      validationStatus: 'Widely used; verify permissions and population fit',
      source: 'Original instrument publication / rights holder',
    },
    {
      id: 'digit-span',
      name: 'Digit Span task',
      measures: 'Attention and working-memory span',
      population: 'Students and adult participants',
      validationStatus: 'Task format varies; document the chosen version',
      source: 'Primary test manual or original source',
    },
  ],
  ethics: {
    considerations: [
      'Human participants: confirm whether your institution classifies the project as human-subjects research.',
      'Informed consent: explain the study, time commitment, foreseeable risks, and voluntary withdrawal.',
      'Privacy: collect the minimum identifiable information and plan secure storage and access.',
      'Institutional ethics review: determine whether review, exemption, or another local process is required.',
      'Sensitive information: sleep, health, academic performance, or work schedules may feel personal to participants.',
    ],
    disclaimer:
      'Educational planning guidance only. This is not ethics approval, legal advice, or a substitute for your institution’s review process.',
  },
  dataCollection: {
    participants: 'Medical students or clinical trainees who meet your defined eligibility criteria.',
    variables: [
      'Sleep duration or sleep-quality score',
      'Memory-task score',
      'Year of study / training stage',
      'Rotation or overnight-work exposure',
      'Potential confounders such as caffeine use and stress',
    ],
    methods: ['Online questionnaire', 'Brief validated memory task', 'Optional sleep diary', 'Structured demographic form'],
    inclusion: ['Currently enrolled in the defined medical program', 'Able to provide informed consent', 'Able to complete the study materials'],
    exclusion: ['Unable to complete the task in the study language', 'A condition that makes the task inappropriate, if relevant', 'Missing the minimum required responses'],
  },
  analysis: {
    variables: [
      { name: 'Sleep duration', type: 'Continuous', role: 'Primary exposure' },
      { name: 'Memory score', type: 'Continuous', role: 'Primary outcome' },
      { name: 'Year of study', type: 'Ordinal / categorical', role: 'Potential confounder' },
      { name: 'Overnight work', type: 'Binary / categorical', role: 'Potential effect modifier' },
    ],
    descriptive: ['Participant count and completion rate', 'Mean and standard deviation or median and range', 'Distribution of sleep and memory scores', 'Missing-data summary'],
    statistical: ['Correlation or regression for an observational design', 'Group comparison if exposure categories are defined', 'Adjusted model for relevant confounders'],
    note: 'Final analysis requires appropriate methodological and statistical guidance, including checking assumptions and choosing a prespecified analysis plan.',
  },
  journals: [
    {
      name: 'Medical Teacher',
      area: 'Health professions education',
      reason: 'A plausible fit when the study centers on students, training environments, and educational outcomes.',
      relevanceScore: 86,
    },
    {
      name: 'BMC Medical Education',
      area: 'Medical education research',
      reason: 'Relevant for empirical work on student wellbeing, learning, and the conditions around clinical training.',
      relevanceScore: 81,
    },
    {
      name: 'Sleep Health',
      area: 'Sleep and public health',
      reason: 'A possible home when sleep measurement and population-level implications are central.',
      relevanceScore: 74,
    },
  ],
  beginnerMistakes: [
    { title: 'Using an unvalidated questionnaire', detail: 'A convenient survey is not automatically a reliable measure. Check evidence, permissions, scoring, and population fit.' },
    { title: 'Missing ethics approval', detail: 'Do not recruit or collect identifiable data until you understand the review process that applies to your project.' },
    { title: 'Poor search strategy', detail: 'Use synonyms, Boolean logic, and more than one database so your first results do not define the whole field.' },
    { title: 'Inadequate sample size', detail: 'A small sample may not answer the question reliably. Seek a justified estimate before data collection.' },
    { title: 'Confusing correlation with causation', detail: 'An association between sleep and memory does not, by itself, prove that one caused the other.' },
    { title: 'Unclear inclusion or exclusion criteria', detail: 'Write eligibility rules before recruiting so the sample is understandable and consistent.' },
  ],
};