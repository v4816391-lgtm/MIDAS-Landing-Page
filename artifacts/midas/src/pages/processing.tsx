import { Check, CircleDashed, LoaderCircle, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ResearchHeader } from '@/components/research/ResearchChrome';
import { loadSavedResearchIdea, processResearchIdea, saveResearchIdea } from '@/lib/processResearchIdea';
import type { ResearchResult } from '@/data/researchData';

type ProcessingPageProps = {
  onComplete: (result: ResearchResult) => void;
};

const processingSteps = [
  'Reading the shape of your idea',
  'Pulling out the research building blocks',
  'Preparing your first research map',
];

export default function ProcessingPage({ onComplete }: ProcessingPageProps) {
  const [, setLocation] = useLocation();
  const [activeStep, setActiveStep] = useState(0);
  const idea = loadSavedResearchIdea();

  useEffect(() => {
    saveResearchIdea(idea);
    const stepTimer = window.setInterval(() => {
      setActiveStep((current) => Math.min(current + 1, processingSteps.length - 1));
    }, 560);
    const completeTimer = window.setTimeout(() => {
      const result = processResearchIdea(idea);
      window.sessionStorage.setItem('midas-research-result', JSON.stringify(result));
      onComplete(result);
      setLocation('/workspace');
    }, 2050);

    return () => {
      window.clearInterval(stepTimer);
      window.clearTimeout(completeTimer);
    };
  }, [idea, onComplete, setLocation]);

  return (
    <div className="midas-noise min-h-[100dvh] bg-[#f7fbfb] text-[#17304a]">
      <ResearchHeader />
      <main className="relative grid min-h-[calc(100dvh-73px)] place-items-center overflow-hidden px-5 py-16 sm:px-8">
        <div className="midas-grid absolute inset-0 opacity-45" />
        <div className="orbit absolute size-[32rem] rounded-full border border-dashed border-[#c0dfe0] sm:size-[42rem]" />
        <div className="relative w-full max-w-2xl">
          <div className="text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#17304a] text-[#8fe6e2] shadow-xl shadow-[#17304a]/15">
              <Sparkles size={24} />
            </span>
            <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.2em] text-[#168e98]">
              Research idea · processing
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-none tracking-[-0.04em] text-[#17304a] sm:text-7xl">
              Giving your idea a first shape.
            </h1>
            <p className="mx-auto mt-6 max-w-lg text-base leading-7 text-[#607180]">
              MIDAS is organizing the information needed for your research
              journey. This prototype uses local processing only.
            </p>
          </div>
          <div className="mt-12 rounded-2xl border border-[#d7e5e8] bg-white p-5 shadow-[0_24px_65px_-45px_rgba(23,48,74,0.4)] sm:p-7">
            <div className="flex items-start gap-3 border-b border-[#e7eff0] pb-5">
              <span className="mt-1 size-2 shrink-0 rounded-full bg-[#20aeb0]" />
              <p className="text-sm leading-6 text-[#526679]">{idea}</p>
            </div>
            <div className="mt-6 space-y-4">
              {processingSteps.map((step, index) => {
                const complete = index < activeStep;
                const active = index === activeStep;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <span
                      className={`grid size-7 shrink-0 place-items-center rounded-full ${
                        complete
                          ? 'bg-[#8fe6e2] text-[#17304a]'
                          : active
                            ? 'bg-[#17304a] text-[#8fe6e2]'
                            : 'bg-[#eef3f4] text-[#a5b4ba]'
                      }`}
                    >
                      {complete ? (
                        <Check size={14} strokeWidth={2.4} />
                      ) : active ? (
                        <LoaderCircle size={14} className="animate-spin" />
                      ) : (
                        <CircleDashed size={14} />
                      )}
                    </span>
                    <span
                      className={`text-sm ${
                        active || complete
                          ? 'font-semibold text-[#17304a]'
                          : 'text-[#91a0a8]'
                      }`}
                    >
                      {step}
                    </span>
                    {active && (
                      <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.16em] text-[#168e98]">
                        working
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-[#e8f0f1]">
              <div
                className="h-full rounded-full bg-[#20aeb0] transition-all duration-500"
                style={{ width: `${Math.min(92, 28 + activeStep * 30)}%` }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}