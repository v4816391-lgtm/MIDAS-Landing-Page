import { Check } from 'lucide-react';
import { roadmapSteps, type RoadmapStep } from '@/data/roadmap';
import type { RoadmapItem } from '@/data/researchData';

type RoadmapProps = {
  activeStepId: string;
  onSelect: (step: RoadmapStep) => void;
  roadmap?: RoadmapItem[];
};

export function InteractiveRoadmap({
  activeStepId,
  onSelect,
  roadmap,
}: RoadmapProps) {
  const activeIndex = Math.max(
    0,
    roadmapSteps.findIndex((step) => step.id === activeStepId),
  );
  const activeGuidance = roadmap?.find((item) => item.stepId === activeStepId);

  return (
    <div className="relative" data-testid="interactive-research-roadmap">
      <div className="absolute bottom-5 left-5 top-5 w-px bg-[#c6dde0] lg:bottom-auto lg:left-5 lg:right-5 lg:top-5 lg:h-px lg:w-auto" />
      <div className="relative grid gap-1.5 lg:grid-cols-11 lg:gap-0">
        {roadmapSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === activeStepId;
          const isComplete = index < activeIndex;
          return (
            <button
              type="button"
              key={step.id}
              onClick={() => onSelect(step)}
              className={`group relative flex items-center gap-4 rounded-xl px-2 py-2.5 text-left transition hover:bg-[#f5fbfb] lg:block lg:rounded-none lg:px-1 lg:py-0 lg:text-center ${
                isActive ? 'bg-[#f0f8f8] lg:bg-transparent' : ''
              }`}
              aria-current={isActive ? 'step' : undefined}
              data-testid={`roadmap-step-${step.number}`}
            >
              <span
                className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-4 border-[#fbfdfd] transition lg:mx-auto ${
                  isActive
                    ? 'bg-[#17304a] text-[#8fe6e2] shadow-lg shadow-[#17304a]/15'
                    : isComplete
                      ? 'bg-[#8fe6e2] text-[#17304a]'
                      : 'bg-[#dbe8eb] text-[#607987] group-hover:bg-[#b8d8dc]'
                }`}
              >
                {isComplete ? (
                  <Check size={15} strokeWidth={2.2} />
                ) : (
                  <Icon size={15} strokeWidth={1.8} />
                )}
              </span>
              <span
                className={`block text-xs font-semibold lg:mt-3 lg:min-h-8 ${
                  isActive ? 'text-[#17304a]' : 'text-[#607987]'
                }`}
              >
                {step.label}
              </span>
              <span className="font-mono text-[9px] text-[#9aacb5] lg:mt-1 lg:block">
                {step.number}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-7 flex items-center justify-between rounded-xl border border-[#d7e5e8] bg-white px-4 py-3 text-xs text-[#607987]">
        <span>
          Current step:{' '}
          <strong className="text-[#17304a]">
            {roadmapSteps[activeIndex]?.label}
          </strong>
          {activeGuidance && (
            <span className="mt-1 block max-w-2xl text-[11px] leading-5 text-[#71818b]">
              {activeGuidance.focus}
            </span>
          )}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#168e98]">
          {String(activeIndex + 1).padStart(2, '0')} / 11
        </span>
      </div>
    </div>
  );
}