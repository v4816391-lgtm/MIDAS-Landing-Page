import { sampleResearchIdea, type ResearchResult } from '@/data/researchData';

export type ResearchProcessingIssue = {
  needsNarrowing?: boolean;
  message: string;
  suggestions?: string[];
};

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
    window.sessionStorage.setItem('midas-research-idea', idea.trim().replace(/\s+/g, ' '));
  }
}

export function loadSavedResearchIdea() {
  if (typeof window === 'undefined') return sampleResearchIdea;
  return window.sessionStorage.getItem('midas-research-idea') || sampleResearchIdea;
}

export async function fetchResearchResult(idea: string): Promise<ResearchResult> {
  const response = await fetch('/api/research', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  });
  const payload = (await response.json()) as ResearchResult & ResearchProcessingIssue;

  if (!response.ok) {
    throw new Error(payload.message || 'The scholarly search could not be completed.');
  }
  if ('needsNarrowing' in payload && payload.needsNarrowing) {
    const suggestions = payload.suggestions?.length ? ` ${payload.suggestions.join(' · ')}` : '';
    throw new Error(`${payload.message}${suggestions}`);
  }
  return payload;
}