import {
  prototypeResearchContent,
  sampleResearchIdea,
  type ResearchQuestionData,
  type ResearchResult,
} from '@/data/researchData';

function cleanIdea(idea: string) {
  return idea.trim().replace(/\s+/g, ' ');
}

function extractQuestion(idea: string): ResearchQuestionData {
  const originalIdea = cleanIdea(idea) || sampleResearchIdea;
  const lowerIdea = originalIdea.toLowerCase();
  const isSleepMemoryExample =
    lowerIdea.includes('sleep') &&
    lowerIdea.includes('memory') &&
    (lowerIdea.includes('medical student') || lowerIdea.includes('medical trainee'));

  if (isSleepMemoryExample) {
    return {
      originalIdea,
      refinedQuestion:
        'Among medical students, how does sleep deprivation or reduced sleep duration relate to memory performance?',
      topic: 'Sleep and cognitive performance',
      population: 'Medical students',
      exposure: 'Sleep deprivation / reduced sleep duration',
      outcome: 'Memory performance',
      researchType: 'Observational health research',
      keyConcepts: ['sleep deprivation', 'memory', 'medical students', 'cognitive performance', 'clinical training'],
    };
  }

  const lowerWords = lowerIdea.split(/\s+/).filter(Boolean);
  const topic = lowerWords.slice(0, 6).join(' ').replace(/[.,!?]$/, '') || 'Your research topic';
  return {
    originalIdea,
    refinedQuestion: `In the population you define, how does the main factor in your idea relate to the outcome you want to understand?`,
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    population: 'Population to be defined',
    exposure: 'Primary exposure or intervention to be defined',
    outcome: 'Primary outcome to be defined',
    researchType: 'Exploratory research (prototype starting point)',
    keyConcepts: lowerWords.slice(0, 5).map((word) => word.replace(/[.,!?]$/, '')),
  };
}

/**
 * Prototype seam for a future AI or rules-based processing service.
 * Keep this function's return shape stable when replacing the implementation.
 */
export function processResearchIdea(idea: string): ResearchResult {
  return {
    question: extractQuestion(idea),
    ...prototypeResearchContent,
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