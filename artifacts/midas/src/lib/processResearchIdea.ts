import { researchProfiles } from '@/data/researchProfiles';
import { sampleResearchIdea, type ResearchQuestionData, type ResearchResult } from '@/data/researchData';

function cleanIdea(idea: string) {
  return idea.trim().replace(/\s+/g, ' ');
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function findProfile(idea: string) {
  const lowerIdea = idea.toLowerCase();
  let best: (typeof researchProfiles)[number] | undefined;
  let bestScore = 0;

  for (const profile of researchProfiles) {
    if (profile.matchAll && !profile.matchAll.every((term) => lowerIdea.includes(term))) {
      continue;
    }
    const score = profile.matches.reduce(
      (total, term) => total + (lowerIdea.includes(term) ? 1 : 0),
      0,
    );
    if (score > bestScore) {
      best = profile;
      bestScore = score;
    }
  }

  return best;
}

function stripPunctuation(value: string) {
  return value.replace(/^[("'“”]+|[.,!?;:)("'“”]+$/g, '').trim();
}

function inferTopic(idea: string) {
  const lowerIdea = idea.toLowerCase();
  const subject =
    lowerIdea.match(/(?:for|with|on|in)\s+([a-z][a-z'-]*(?:\s+[a-z][a-z'-]*){0,3})$/i)?.[1] ??
    idea.split(/\s+/).slice(0, 6).join(' ');
  return stripPunctuation(subject) || 'Your research topic';
}

function inferQuestion(idea: string): ResearchQuestionData {
  const lowerIdea = idea.toLowerCase();
  const words = unique(
    lowerIdea
      .split(/\s+/)
      .map(stripPunctuation)
      .filter((word) => word.length > 2 && !['the', 'and', 'for', 'how', 'does', 'effect', 'impact'].includes(word)),
  );
  const hasTreatment = /(treat|therapy|intervention|drug|vaccine)/.test(lowerIdea);
  const hasDetection = /(detect|diagnos|screen|classif)/.test(lowerIdea);
  const hasEffect = /(effect|impact|association|relationship|relate)/.test(lowerIdea);
  const topic = inferTopic(idea);
  const researchTask = hasDetection
    ? 'Detection / diagnosis'
    : hasTreatment
      ? 'Treatment or intervention evaluation'
      : hasEffect
        ? 'Exposure–outcome association'
        : 'Research question to be defined';
  const outcome = hasDetection
    ? 'Diagnostic/detection performance'
    : hasTreatment
      ? 'Treatment response and safety'
      : 'To be defined';

  return {
    originalIdea: idea,
    refinedQuestion: `In the population to be defined, how does the main factor in this idea relate to the outcome to be defined?`,
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    subject: topic.charAt(0).toUpperCase() + topic.slice(1),
    technology: hasTreatment || hasDetection ? 'Technology or intervention to be defined' : 'Exposure or measurement to be defined',
    researchTask,
    population: 'To be defined',
    exposure: 'Primary exposure or intervention to be defined',
    outcome,
    researchType: hasDetection
      ? 'Diagnostic research (prototype starting point)'
      : hasTreatment
        ? 'Interventional research (prototype starting point)'
        : 'Exploratory research (prototype starting point)',
    keyConcepts: words.slice(0, 6),
    keywords: words.slice(0, 8),
  };
}

function cloneContent(content: Omit<ResearchResult, 'question'>): Omit<ResearchResult, 'question'> {
  return {
    literature: content.literature.map((item) => ({ ...item })),
    searchStrategy: {
      ...content.searchStrategy,
      keywords: [...content.searchStrategy.keywords],
      databases: [...content.searchStrategy.databases],
    },
    methodologies: content.methodologies.map((method) => ({
      ...method,
      advantages: [...method.advantages],
      limitations: [...method.limitations],
    })),
    instruments: content.instruments.map((instrument) => ({ ...instrument })),
    ethics: {
      ...content.ethics,
      considerations: [...content.ethics.considerations],
    },
    dataCollection: {
      ...content.dataCollection,
      variables: [...content.dataCollection.variables],
      methods: [...content.dataCollection.methods],
      inclusion: [...content.dataCollection.inclusion],
      exclusion: [...content.dataCollection.exclusion],
    },
    analysis: {
      ...content.analysis,
      variables: content.analysis.variables.map((variable) => ({ ...variable })),
      descriptive: [...content.analysis.descriptive],
      statistical: [...content.analysis.statistical],
    },
    journals: content.journals.map((journal) => ({ ...journal })),
    beginnerMistakes: content.beginnerMistakes.map((mistake) => ({ ...mistake })),
  };
}

function buildGenericContent(question: ResearchQuestionData): Omit<ResearchResult, 'question'> {
  const keywords = unique(question.keywords.length ? question.keywords : question.keyConcepts);
  const topic = question.topic;
  return {
    literature: [
      {
        id: 'generic-lit-01',
        title: `Mock example: Framing research on ${topic}`,
        authors: 'Prototype author group',
        year: 2024,
        studyType: 'Scoping review',
        area: topic,
        summary: `A fictional starting point for mapping how ${topic.toLowerCase()} has been studied.`,
        relevance: 'Use it to identify definitions, populations, outcomes, and gaps before narrowing the protocol.',
      },
      {
        id: 'generic-lit-02',
        title: `Mock example: Measuring the main outcome in ${topic}`,
        authors: 'Prototype author group',
        year: 2023,
        studyType: 'Methods study',
        area: 'Measurement',
        summary: `A fictional methods example for deciding how the outcome in ${topic.toLowerCase()} could be observed.`,
        relevance: 'Compare measurement quality, burden, timing, and fit with the population you eventually define.',
      },
      {
        id: 'generic-lit-03',
        title: `Mock example: Choosing a design for ${topic}`,
        authors: 'Prototype author group',
        year: 2022,
        studyType: 'Protocol example',
        area: 'Research design',
        summary: `A fictional protocol example showing how a focused ${question.researchType.toLowerCase()} study might be scoped.`,
        relevance: 'Look for inclusion criteria, comparison groups, and analysis plans that match the question.',
      },
    ],
    searchStrategy: {
      keywords,
      booleanQuery: keywords.length > 1 ? keywords.map((keyword) => `"${keyword}"`).join(' AND ') : `"${topic}"`,
      databases: ['Google Scholar', 'Scopus', 'A field-specific database to identify'],
    },
    methodologies: [
      {
        id: 'generic-exploratory',
        name: 'Exploratory study',
        fit: `A useful first step while the population, ${question.exposure.toLowerCase()}, and outcome are still being defined.`,
        advantages: ['Helps clarify the problem', 'Can reveal useful variables', 'Flexible early structure'],
        limitations: ['May not test a precise hypothesis', 'Findings can be difficult to generalize', 'Needs a clear stopping point'],
      },
      {
        id: 'generic-observational',
        name: 'Observational study',
        fit: 'A possible route when the main goal is to describe patterns or associations without assigning an intervention.',
        advantages: ['Reflects real-world settings', 'Can be practical to run', 'Supports several candidate outcomes'],
        limitations: ['Confounding may remain', 'Temporal order can be unclear', 'Measurement quality drives the result'],
      },
      {
        id: 'generic-methods',
        name: 'Methods or feasibility study',
        fit: 'A sensible option when the first question is whether the proposed measure, workflow, or recruitment plan is workable.',
        advantages: ['Surfaces practical constraints', 'Can refine the protocol', 'Lower commitment than a full study'],
        limitations: ['Not designed for definitive effectiveness claims', 'Small samples may be unstable', 'Needs success criteria in advance'],
      },
    ],
    instruments: [
      {
        id: 'generic-measure',
        name: `Measure for ${question.outcome}`,
        measures: 'Outcome measure to be selected and validated for this question',
        population: question.population,
        validationStatus: 'To be defined; verify reliability, validity, permissions, and population fit',
        source: 'Original instrument publication or approved measurement protocol',
      },
      {
        id: 'generic-exposure',
        name: `Measure for ${question.exposure}`,
        measures: 'Exposure, intervention, or process measure to be operationalized',
        population: question.population,
        validationStatus: 'Prototype measure; define timing, thresholds, and missing-data rules',
        source: 'Protocol and source evidence to be identified',
      },
    ],
    ethics: {
      considerations: [
        'Informed consent: explain the purpose, time commitment, foreseeable risks, and voluntary withdrawal.',
        'Privacy: collect the minimum identifiable information and define secure storage and access.',
        'Population fit: make participation accessible and avoid excluding people without a clear reason.',
        'Measurement risk: consider whether the data collection could cause distress, stigma, or unintended disclosure.',
        'Institutional review: determine whether review, exemption, or another local process is required.',
      ],
      disclaimer:
        'Educational prototype guidance only. This is not ethics approval, legal advice, or a substitute for local supervision.',
    },
    dataCollection: {
      participants: 'To be defined before recruitment.',
      variables: [question.exposure, question.outcome, 'Relevant participant characteristics to be defined', 'Missingness and completion status'],
      methods: ['Structured questionnaire or interview', 'Defined measurement procedure', 'Secure data log', 'Protocol deviation log'],
      inclusion: ['Meets the population definition once written', 'Can provide informed consent where required', 'Can complete the study materials'],
      exclusion: ['Cannot complete the study safely', 'Missing the minimum required data', 'Does not meet the prespecified eligibility criteria'],
    },
    analysis: {
      variables: [
        { name: question.exposure, type: 'To be defined', role: 'Primary exposure or intervention' },
        { name: question.outcome, type: 'To be defined', role: 'Primary outcome' },
        { name: 'Population characteristics', type: 'Categorical / continuous', role: 'Potential confounders or descriptors' },
      ],
      descriptive: ['Participant count and completion rate', 'Distribution of primary measures', 'Missing-data summary', 'Protocol deviations'],
      statistical: ['Descriptive summaries matched to the measurement scale', 'Association or group comparison after the design is finalized', 'Sensitivity analysis for key assumptions'],
      note:
        'The analysis must follow the final design and measurement choices. Seek appropriate methodological or statistical guidance before making claims.',
    },
    journals: [
      {
        name: 'Field-specific journal to identify',
        area: topic,
        reason: 'Search the literature for journals that publish the population, method, and outcome combination you eventually define.',
        relevanceScore: 62,
      },
      {
        name: 'Interdisciplinary methods journal',
        area: 'Research design and measurement',
        reason: 'A possible prototype direction if the contribution is primarily methodological or feasibility-focused.',
        relevanceScore: 54,
      },
    ],
    beginnerMistakes: [
      { title: 'Starting before defining the outcome', detail: 'A broad topic becomes workable only when the main outcome can be measured and explained.' },
      { title: 'Inventing a population', detail: 'Write eligibility criteria before assuming who the research represents.' },
      { title: 'Choosing an instrument by convenience', detail: 'Check validity, permissions, scoring, burden, and fit instead of picking the first questionnaire you find.' },
      { title: 'Changing the question after seeing results', detail: 'Record important decisions before analysis so the interpretation remains honest.' },
      { title: 'Treating mock guidance as evidence', detail: 'These prototype examples are planning prompts, not real or live literature.' },
    ],
  };
}

/**
 * Prototype seam for a future AI or rules-based processing service.
 * Keep this function's return shape stable when replacing the implementation.
 */
export function processResearchIdea(idea: string): ResearchResult {
  const originalIdea = cleanIdea(idea) || sampleResearchIdea;
  const profile = findProfile(originalIdea);
  const inferredQuestion = profile
    ? { ...profile.question, originalIdea }
    : inferQuestion(originalIdea);
  const question: ResearchQuestionData = {
    ...inferredQuestion,
    keyConcepts: unique(inferredQuestion.keyConcepts),
    keywords: unique(inferredQuestion.keywords),
  };

  return {
    question,
    ...cloneContent(profile?.content ?? buildGenericContent(question)),
  };
}

export function loadSavedResearchResult(): ResearchResult | null {
  if (typeof window === 'undefined') return null;
  const saved = window.sessionStorage.getItem('midas-research-result');
  if (!saved) return null;
  try {
    return JSON.parse(saved) as ResearchResult;
  } catch {
    window.sessionStorage.removeItem('midas-research-result');
    return null;
  }
}

export function saveResearchIdea(idea: string) {
  if (typeof window !== 'undefined') {
    window.sessionStorage.setItem('midas-research-idea', cleanIdea(idea));
  }
}

export function loadSavedResearchIdea() {
  if (typeof window === 'undefined') return sampleResearchIdea;
  return window.sessionStorage.getItem('midas-research-idea') || sampleResearchIdea;
}