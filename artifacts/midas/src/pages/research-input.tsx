import { ArrowRight, BookOpen, Check, Lightbulb, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { ResearchHeader } from '@/components/research/ResearchChrome';
import { sampleResearchIdea } from '@/data/researchData';
import { saveResearchIdea } from '@/lib/processResearchIdea';

export default function ResearchInputPage() {
  const [, setLocation] = useLocation();
  const [idea, setIdea] = useState('');

  const submitIdea = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!idea.trim()) return;
    saveResearchIdea(idea);
    setLocation('/processing');
  };

  return (
    <div className="midas-noise min-h-[100dvh] bg-[#f7fbfb] text-[#17304a]">
      <ResearchHeader />
      <main className="relative overflow-hidden">
        <div className="midas-grid absolute inset-0 opacity-45" />
        <div className="absolute -right-48 top-20 size-[34rem] rounded-full border border-[#c5e0e1] sm:size-[44rem]" />
        <div className="absolute -right-20 top-44 size-[26rem] rounded-full border border-dashed border-[#c5e0e1] sm:size-[34rem]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-20 lg:px-12 lg:pb-28 lg:pt-28">
          <div className="max-w-2xl">
            <p className="mb-5 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#168e98]">
              <span className="h-px w-7 bg-[#168e98]" />
              Research idea · step 01
            </p>
            <h1 className="max-w-xl font-serif text-[clamp(3.5rem,8vw,6.8rem)] leading-[0.88] tracking-[-0.045em] text-[#17304a]">
              Start with the question.
            </h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-[#607180] sm:text-lg sm:leading-8">
              Bring the first version of your idea. MIDAS will organize the
              pieces into a research map you can actually move through.
            </p>

            <form onSubmit={submitIdea} className="mt-9 max-w-2xl">
              <label
                htmlFor="research-idea-v2"
                className="mb-2 block text-sm font-semibold text-[#17304a]"
              >
                What are you researching?
              </label>
              <div className="rounded-2xl border border-[#cbdde0] bg-white p-2 shadow-[0_24px_65px_-42px_rgba(23,48,74,0.5)] transition focus-within:border-[#168e98] focus-within:ring-4 focus-within:ring-[#8fe6e2]/30">
                <textarea
                  id="research-idea-v2"
                  value={idea}
                  onChange={(event) => setIdea(event.target.value)}
                  placeholder={sampleResearchIdea}
                  className="min-h-36 w-full resize-none border-0 bg-transparent px-3 py-3 text-base leading-7 text-[#17304a] outline-none placeholder:text-[#a2b1b8] sm:min-h-40 sm:px-4"
                  data-testid="input-research-idea-v2"
                />
                <div className="flex flex-col gap-3 border-t border-[#e7eff0] px-2 pt-3 sm:flex-row sm:items-center sm:justify-between sm:px-3">
                  <span className="flex items-center gap-2 text-[11px] text-[#80919a]">
                    <Sparkles size={13} className="text-[#168e98]" />
                    Prototype processing · no account needed
                  </span>
                  <button
                    type="submit"
                    disabled={!idea.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#17304a] px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#244968] disabled:cursor-not-allowed disabled:opacity-40"
                    data-testid="button-generate-roadmap"
                  >
                    Generate Research Roadmap <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </form>

            <button
              type="button"
              onClick={() => setIdea(sampleResearchIdea)}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#168e98] transition hover:text-[#17304a]"
            >
              <Lightbulb size={14} />
              Use an example idea
            </button>
          </div>

          <aside className="relative mx-auto w-full max-w-sm lg:mt-8">
            <div className="rounded-[2rem] border border-[#cfe2e3] bg-[#eef8f8]/90 p-5 shadow-[0_30px_80px_-45px_rgba(23,48,74,0.35)] sm:p-7">
              <div className="flex items-center justify-between border-b border-[#d8e9e9] pb-5">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#168e98]">
                    What happens next
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-[#17304a]">
                    One place for the journey
                  </h2>
                </div>
                <span className="grid size-9 place-items-center rounded-xl bg-[#17304a] text-[#8fe6e2]">
                  <BookOpen size={17} />
                </span>
              </div>
              <div className="mt-6 space-y-5">
                {[
                  'Your idea is broken into research building blocks.',
                  'A route is suggested in plain language.',
                  'The workspace keeps each decision close at hand.',
                ].map((label, index) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-[#8fe6e2] text-[#17304a]">
                      <Check size={13} strokeWidth={2.4} />
                    </span>
                    <p className="text-sm leading-6 text-[#607987]">{label}</p>
                    <span className="ml-auto font-mono text-[9px] text-[#99aeb4]">
                      0{index + 1}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-7 rounded-xl bg-white/80 px-4 py-3 text-xs leading-5 text-[#607987]">
                Your idea can be rough. The first useful version is allowed to
                change.
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}