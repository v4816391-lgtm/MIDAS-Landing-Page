import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardList,
  FileText,
  FlaskConical,
  Lightbulb,
  Menu,
  PenLine,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import ResearchInputPage from '@/pages/research-input';
import ProcessingPage from '@/pages/processing';
import ResearchWorkspace from '@/pages/research-workspace';
import NotFound from '@/pages/not-found';
import { loadSavedResearchResult, processResearchIdea } from '@/lib/processResearchIdea';
import { sampleResearchIdea } from '@/data/researchData';
import type { ResearchResult } from '@/data/researchData';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Stage = {
  name: string;
  number: string;
  description: string;
  note: string;
  icon: typeof Lightbulb;
};

const stages: Stage[] = [
  { name: 'Research Idea', number: '01', description: 'Name the question beneath your curiosity.', note: 'Start with what you want to understand, not what you think you should prove.', icon: Lightbulb },
  { name: 'Planning', number: '02', description: 'Shape a question you can actually answer.', note: 'A small, precise question is a strong beginning.', icon: ClipboardList },
  { name: 'Literature Review', number: '03', description: 'Find the conversation your idea belongs to.', note: 'See the patterns, gaps, and language that already exist.', icon: BookOpen },
  { name: 'Methodology', number: '04', description: 'Choose a way to learn that fits the question.', note: 'Compare approaches without getting lost in jargon.', icon: FlaskConical },
  { name: 'Ethics', number: '05', description: 'Build care and responsibility into the study.', note: 'Spot the decisions that keep people and data protected.', icon: ShieldCheck },
  { name: 'Data Collection', number: '06', description: 'Gather evidence with a clear, repeatable plan.', note: 'Turn an abstract idea into thoughtful fieldwork.', icon: ClipboardList },
  { name: 'Analysis', number: '07', description: 'Make sense of what the evidence is telling you.', note: 'Move from raw observations to defensible insight.', icon: BarChart3 },
  { name: 'Writing', number: '08', description: 'Give your work a structure others can follow.', note: 'Make the thinking visible, one section at a time.', icon: PenLine },
  { name: 'Publication', number: '09', description: 'Share the work with the right audience.', note: 'Finish with a path to a journal, poster, or next question.', icon: FileText },
];

const features = [
  { index: '01', title: 'Research Roadmap', description: 'A calm, visual route from a spark of curiosity to a study you can stand behind.', icon: ArrowRight, tint: 'bg-[#e7f7f8]' },
  { index: '02', title: 'Methodology Guidance', description: 'Understand the trade-offs between qualitative, quantitative, and mixed methods.', icon: FlaskConical, tint: 'bg-[#eef0fb]' },
  { index: '03', title: 'Questionnaire Discovery', description: 'Find established measures and learn what makes a questionnaire fit your question.', icon: ClipboardList, tint: 'bg-[#f7f1e5]' },
  { index: '04', title: 'Beginner Mistakes', description: 'Quiet guardrails for the easy-to-miss choices that can slow a first study down.', icon: AlertTriangle, tint: 'bg-[#f8eded]' },
  { index: '05', title: 'Journal Suggestions', description: 'A thoughtful starting point for understanding where research like yours is shared.', icon: BookOpen, tint: 'bg-[#eaf3ee]' },
];

function useRevealOnScroll() {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.12 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="#top" className="group inline-flex items-center gap-2.5" data-testid="link-logo">
      <span className={`relative grid size-8 place-items-center rounded-[10px] ${light ? 'bg-[#8fe6e2]' : 'bg-[#17304a]'}`}>
        <span className={`absolute size-3 rounded-full ${light ? 'bg-[#17304a]' : 'bg-[#a7e9e4]'}`} />
        <span className={`absolute h-5 w-px rotate-45 ${light ? 'bg-[#17304a]/70' : 'bg-[#a7e9e4]/70'}`} />
        <span className={`absolute h-5 w-px -rotate-45 ${light ? 'bg-[#17304a]/70' : 'bg-[#a7e9e4]/70'}`} />
      </span>
      <span className={`font-semibold tracking-[-0.04em] ${light ? 'text-white' : 'text-[#17304a]'}`}>MIDAS</span>
    </a>
  );
}

function SectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`mb-5 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] ${light ? 'text-[#8fe6e2]' : 'text-[#168e98]'}`} data-testid="text-section-label">
      <span className={`h-px w-7 ${light ? 'bg-[#8fe6e2]' : 'bg-[#168e98]'}`} />
      {children}
    </p>
  );
}

function StartModal({ onClose }: { onClose: () => void }) {
  const [idea, setIdea] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-[#10243a]/55 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title" data-testid="dialog-start-researching">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#dce5ea] bg-[#fbfcfd] shadow-2xl shadow-[#10243a]/20">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-[#647587] transition hover:bg-[#e8f0f3] hover:text-[#17304a]" aria-label="Close research starter" data-testid="button-close-modal">
          <X size={18} />
        </button>
        <div className="border-b border-[#e1e9ed] bg-[#eef8f8] px-7 pb-7 pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#168e98]">Stage 1 / idea mapping</p>
          <h2 id="modal-title" className="mt-3 font-serif text-4xl leading-none text-[#17304a]">Let&apos;s give it a first shape.</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[#526679]">This is a mock preview of the MIDAS starting point. No account, no commitment — just a clearer next step.</p>
        </div>
        {!submitted ? (
          <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="space-y-5 p-7">
            <label htmlFor="research-idea" className="block text-sm font-semibold text-[#17304a]">What are you curious about?</label>
            <textarea id="research-idea" value={idea} onChange={(event) => setIdea(event.target.value)} placeholder="For example: How does shift work affect sleep quality in resident doctors?" className="min-h-32 w-full resize-none rounded-xl border border-[#cfdae1] bg-white p-4 text-sm leading-6 text-[#17304a] outline-none transition placeholder:text-[#96a5b1] focus:border-[#168e98] focus:ring-4 focus:ring-[#8fe6e2]/30" data-testid="input-research-idea" />
            <button type="submit" disabled={!idea.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#17304a] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#244968] disabled:cursor-not-allowed disabled:opacity-40" data-testid="button-map-idea">
              Map my idea <ArrowRight size={16} />
            </button>
            <p className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#8a9aa6]">Mock data · Stage 1 preview</p>
          </form>
        ) : (
          <div className="p-7">
            <div className="flex items-start gap-3 rounded-xl border border-[#bfe5e3] bg-[#effafa] p-4">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#8fe6e2] text-[#17304a]"><Check size={15} /></span>
              <div>
                <p className="text-sm font-semibold text-[#17304a]">A promising place to begin.</p>
                <p className="mt-1 text-sm leading-6 text-[#526679]">Your idea is ready for a first pass through Planning and Literature Review.</p>
              </div>
            </div>
            <blockquote className="mt-5 border-l-2 border-[#8fe6e2] pl-4 text-sm italic leading-6 text-[#526679]">&ldquo;{idea}&rdquo;</blockquote>
            <button onClick={onClose} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17304a] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#244968]" data-testid="button-return-to-page">
              Continue exploring <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RoadmapVisual() {
  const [activeStage, setActiveStage] = useState(0);
  const active = stages[activeStage];

  return (
    <div className="relative mt-14" data-testid="roadmap-visual">
      <div className="absolute left-5 right-5 top-5 hidden h-px bg-[#b7d2d8] md:block" />
      <div className="grid gap-3 md:grid-cols-9 md:gap-0">
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const isActive = index === activeStage;
          return (
            <button key={stage.name} onClick={() => setActiveStage(index)} className="group relative flex items-center gap-4 rounded-xl p-2 text-left transition hover:bg-white md:block md:rounded-none md:p-0 md:text-center" data-testid={`button-roadmap-stage-${index + 1}`}>
              <span className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-4 border-[#f7fbfb] transition duration-300 md:mx-auto ${isActive ? 'bg-[#17304a] text-[#8fe6e2] shadow-lg shadow-[#17304a]/15' : index < activeStage ? 'bg-[#8fe6e2] text-[#17304a]' : 'bg-[#dbe8eb] text-[#607987] group-hover:bg-[#b8d8dc]'}`}>
                <Icon size={15} strokeWidth={1.8} />
              </span>
              <span className={`mt-2 block text-xs font-semibold md:mt-3 ${isActive ? 'text-[#17304a]' : 'text-[#607987]'}`}>{stage.name}</span>
              <span className="mt-1 hidden font-mono text-[9px] text-[#9aacb5] md:block">{stage.number}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-9 grid items-center gap-5 rounded-2xl border border-[#d7e5e8] bg-white p-5 shadow-[0_18px_50px_-35px_rgba(23,48,74,0.45)] sm:grid-cols-[auto_1fr_auto] sm:p-6" data-testid="text-active-roadmap-stage">
        <span className="grid size-12 place-items-center rounded-xl bg-[#e7f7f8] text-[#168e98]"><active.icon size={20} strokeWidth={1.7} /></span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#168e98]">You are looking at · {active.number}</p>
          <p className="mt-1 text-base font-semibold text-[#17304a]">{active.description}</p>
          <p className="mt-1 text-sm leading-6 text-[#71818c]">{active.note}</p>
        </div>
        <div className="flex gap-2 sm:justify-self-end">
          <button onClick={() => setActiveStage(Math.max(0, activeStage - 1))} disabled={activeStage === 0} className="rounded-lg border border-[#d5e1e5] px-3 py-2 text-xs font-semibold text-[#526679] transition hover:border-[#8fb7bd] disabled:cursor-not-allowed disabled:opacity-30" data-testid="button-roadmap-previous">Previous</button>
          <button onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))} disabled={activeStage === stages.length - 1} className="rounded-lg bg-[#17304a] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#244968] disabled:cursor-not-allowed disabled:opacity-30" data-testid="button-roadmap-next">Next</button>
        </div>
      </div>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  useRevealOnScroll();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const openResearch = () => { setLocation('/research'); setMenuOpen(false); };
  const navItems = [
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Vision', href: '#vision' },
  ];

  return (
    <div className="midas-noise min-h-[100dvh] bg-[#f7fbfb] text-[#17304a]">
      <header id="top" className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Logo />
          <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
            {navItems.map((item) => <a key={item.href} href={item.href} className="text-sm text-[#607180] transition hover:text-[#17304a]" data-testid={`link-nav-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</a>)}
            <button onClick={openResearch} className="group flex items-center gap-2 rounded-full bg-[#17304a] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#244968]" data-testid="button-nav-start">
              Start Researching <ArrowUpRight size={15} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </nav>
          <button onClick={() => setMenuOpen((open) => !open)} className="rounded-lg p-2 text-[#17304a] md:hidden" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} data-testid="button-mobile-menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="absolute inset-x-4 top-16 rounded-2xl border border-[#d9e6e9] bg-[#fbfdfd] p-3 shadow-xl shadow-[#17304a]/10 md:hidden">
            {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-medium text-[#526679] hover:bg-[#eef8f8] hover:text-[#17304a]" data-testid={`link-mobile-${item.label.toLowerCase().replaceAll(' ', '-')}`}>{item.label}</a>)}
            <button onClick={openResearch} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#17304a] px-4 py-3 text-sm font-semibold text-white" data-testid="button-mobile-start">Start Researching <ArrowUpRight size={15} /></button>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#f2f8f8]">
          <div className="midas-grid absolute inset-0 opacity-70" />
          <div className="absolute -right-28 top-24 size-96 rounded-full border border-[#bcdedf]/60 sm:size-[34rem]" />
          <div className="absolute -right-12 top-40 size-64 rounded-full border border-[#bcdedf]/50 sm:size-[25rem]" />
          <div className="mx-auto grid min-h-[760px] max-w-7xl items-center gap-14 px-5 pb-20 pt-36 sm:px-8 lg:grid-cols-[1.03fr_0.97fr] lg:gap-8 lg:px-12 lg:pb-24 lg:pt-44">
            <div className="relative z-10 max-w-2xl">
              <div className="reveal inline-flex items-center gap-2 rounded-full border border-[#cce3e5] bg-[#f8fdfd]/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#168e98]" data-testid="status-stage-one">
                <span className="pulse-dot size-1.5 rounded-full bg-[#20aeb0]" /> Stage 1 · the landing experience
              </div>
              <h1 className="reveal reveal-delay-1 mt-7 max-w-[700px] font-serif text-[clamp(3.6rem,8vw,7.5rem)] leading-[0.88] tracking-[-0.045em] text-[#17304a]" data-testid="text-hero-title">
                Your research idea <em className="text-[#16999f]">deserves</em> a roadmap.
              </h1>
              <p className="reveal reveal-delay-2 mt-8 max-w-lg text-base leading-7 text-[#607180] sm:text-lg sm:leading-8" data-testid="text-hero-description">
                MIDAS is a calm, structured guide for the first stretch of research — from the question that keeps tapping at you to a next step you can trust.
              </p>
              <div className="reveal reveal-delay-3 mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <button onClick={openResearch} className="group inline-flex items-center gap-3 rounded-full bg-[#17304a] px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#17304a]/10 transition hover:-translate-y-1 hover:bg-[#244968]" data-testid="button-explore-idea">
                  Explore your research idea <ArrowRight size={16} className="transition group-hover:translate-x-1" />
                </button>
                <a href="#roadmap" className="inline-flex items-center gap-2 px-2 py-3 text-sm font-semibold text-[#526679] transition hover:text-[#168e98]" data-testid="link-see-roadmap">
                  See the roadmap <ChevronRight size={15} />
                </a>
              </div>
              <div className="reveal reveal-delay-3 mt-14 flex items-center gap-3 text-xs text-[#81919b]">
                <span className="flex -space-x-2">
                  {['AM', 'RO', 'SK'].map((initials, index) => <span key={initials} className={`grid size-7 place-items-center rounded-full border-2 border-[#f2f8f8] text-[9px] font-semibold ${index === 0 ? 'bg-[#d8eee8] text-[#2e665b]' : index === 1 ? 'bg-[#e4e4f3] text-[#4e587d]' : 'bg-[#f3e3c9] text-[#795a2d]'}`} data-testid={`avatar-guide-${index + 1}`}>{initials}</span>)}
                </span>
                <span>Made for the first-time researcher</span>
              </div>
            </div>
            <div className="relative z-10 mx-auto w-full max-w-[500px] lg:ml-auto">
              <div className="reveal relative aspect-square">
                <div className="absolute inset-[13%] rounded-full border border-[#a9d6d8] bg-[#eaf7f7]/65" />
                <div className="orbit absolute inset-[4%] rounded-full border border-dashed border-[#a9d6d8]/80" />
                <div className="absolute inset-[25%] rounded-[2rem] border border-[#d1e5e6] bg-[#fbfefe]/90 p-5 shadow-[0_25px_70px_-35px_rgba(23,48,74,0.5)] sm:p-7">
                  <div className="flex items-center justify-between border-b border-[#e1edef] pb-4">
                    <div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#168e98]">Your route</p><p className="mt-1 text-sm font-semibold text-[#17304a]">Sleep &amp; residency</p></div>
                    <span className="grid size-7 place-items-center rounded-lg bg-[#e7f7f8] text-[#168e98]"><Sparkles size={14} /></span>
                  </div>
                  <div className="relative mt-5 space-y-4">
                    <div className="absolute bottom-4 left-[9px] top-4 w-px bg-[#b5dfe0]" />
                    {['Frame the question', 'Map the literature', 'Choose an approach'].map((label, index) => <div className="relative flex items-center gap-3" key={label}><span className={`z-10 grid size-[19px] place-items-center rounded-full border-4 border-[#fbfefe] ${index === 0 ? 'bg-[#17304a]' : 'bg-[#8fe6e2]'}`}>{index === 0 && <span className="size-1.5 rounded-full bg-[#8fe6e2]" />}</span><span className={`text-xs ${index === 0 ? 'font-semibold text-[#17304a]' : 'text-[#72848d]'}`}>{label}</span>{index === 0 && <span className="ml-auto font-mono text-[9px] text-[#168e98]">now</span>}</div>)}
                  </div>
                  <div className="mt-6 rounded-xl bg-[#f0f7f7] px-3 py-2.5 text-[11px] leading-5 text-[#59727b]"><span className="font-semibold text-[#17304a]">A good next step:</span> refine your population before searching.</div>
                </div>
                <span className="absolute left-[8%] top-[26%] grid size-11 place-items-center rounded-2xl bg-[#f7e8ca] text-[#7d5d2d] shadow-lg shadow-[#aa7e3b]/10 sm:size-14"><Lightbulb size={21} strokeWidth={1.6} /></span>
                <span className="absolute bottom-[17%] right-[6%] grid size-11 place-items-center rounded-2xl bg-[#e3e5f4] text-[#576084] shadow-lg shadow-[#575e94]/10 sm:size-14"><BookOpen size={21} strokeWidth={1.6} /></span>
                <span className="absolute right-[3%] top-[13%] size-2 rounded-full bg-[#20aeb0]" />
                <span className="absolute bottom-[8%] left-[20%] size-2 rounded-full bg-[#cf9465]" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-[#8aa0a7] lg:flex"><span className="h-8 w-px bg-[#b5d5d6]" />Scroll to find your next step</div>
        </section>

        <section id="roadmap" className="bg-[#f7fbfb] px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-roadmap">
          <div className="mx-auto max-w-7xl">
            <div className="reveal grid gap-8 md:grid-cols-[0.9fr_1.1fr] md:items-end">
              <div><SectionLabel>From uncertainty to underway</SectionLabel><h2 className="max-w-xl font-serif text-5xl leading-[0.95] tracking-[-0.035em] text-[#17304a] sm:text-6xl" data-testid="text-roadmap-title">A map for the part no one teaches you.</h2></div>
              <p className="max-w-md text-base leading-7 text-[#687b87] md:justify-self-end">Research is rarely a straight line. MIDAS gives you enough structure to move through the turns without taking the curiosity out of it.</p>
            </div>
            <RoadmapVisual />
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#17304a] px-5 py-24 text-white sm:px-8 sm:py-32 lg:px-12" data-testid="section-problem">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_60%_35%,rgba(143,230,226,0.16),transparent_47%)]" />
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.86fr_1.14fr] lg:gap-24">
            <div className="reveal relative">
              <SectionLabel light>The first-researcher gap</SectionLabel>
              <h2 className="max-w-lg font-serif text-5xl leading-[0.94] tracking-[-0.035em] sm:text-6xl" data-testid="text-problem-title">The blank page is not a methodology.</h2>
              <p className="mt-7 max-w-md text-base leading-7 text-[#b6c8d0]">A promising question can feel surprisingly lonely. You know it matters — you just do not know what to do on Tuesday morning.</p>
            </div>
            <div className="relative grid gap-0 divide-y divide-[#38536a] border-y border-[#38536a]">
              {[
                ['01', 'Too many doors', 'Databases, methods, measures, journals — the options arrive before the orientation does.'],
                ['02', 'Unspoken rules', 'The early decisions that experienced researchers make instinctively are rarely written down.'],
                ['03', 'Momentum lost', 'Without a next step that feels possible, a good idea can stay an idea for a very long time.'],
              ].map(([number, title, description]) => <div className="reveal reveal-delay-1 grid gap-4 py-6 sm:grid-cols-[48px_170px_1fr] sm:items-start" key={number}><span className="font-mono text-[10px] text-[#8fe6e2]">{number}</span><h3 className="text-base font-semibold text-white">{title}</h3><p className="text-sm leading-6 text-[#a9bbc5]">{description}</p></div>)}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#edf7f7] px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-how-it-works">
          <div className="mx-auto max-w-7xl">
            <div className="reveal mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><SectionLabel>How it works</SectionLabel><h2 className="font-serif text-5xl leading-none tracking-[-0.035em] text-[#17304a] sm:text-6xl">Three steps. Less second-guessing.</h2></div><p className="max-w-xs text-sm leading-6 text-[#637985]">A guided beginning that still leaves room for your own point of view.</p></div>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                { number: '01', title: 'Enter your idea', description: 'Start with a question, a hunch, or even a half-formed sentence. MIDAS meets you there.', Icon: Lightbulb },
                { number: '02', title: 'Understand the route', description: 'See the decisions ahead, in plain language, with context for why each one matters.', Icon: BookOpen },
                { number: '03', title: 'Move forward', description: 'Leave each session with one concrete next step — and a better question than you arrived with.', Icon: ArrowRight },
              ].map(({ number, title, description, Icon }, index) => <article className={`reveal reveal-delay-${index + 1} relative overflow-hidden rounded-2xl border border-[#d5e5e6] bg-[#f9fdfd] p-6 sm:p-8`} key={number}><span className="font-mono text-[10px] tracking-[0.16em] text-[#168e98]">{number}</span><div className="mt-12 grid size-11 place-items-center rounded-xl bg-[#17304a] text-[#8fe6e2]"><Icon size={20} strokeWidth={1.7} /></div><h3 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-[#17304a]">{title}</h3><p className="mt-3 text-sm leading-6 text-[#6c7f88]">{description}</p><span className="absolute -bottom-8 -right-5 font-serif text-[11rem] leading-none text-[#e7f2f2]">{number}</span></article>)}
            </div>
          </div>
        </section>

        <section id="features" className="bg-[#f7fbfb] px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-features">
          <div className="mx-auto max-w-7xl">
            <div className="reveal max-w-2xl"><SectionLabel>What MIDAS holds</SectionLabel><h2 className="font-serif text-5xl leading-[0.95] tracking-[-0.035em] text-[#17304a] sm:text-6xl" data-testid="text-features-title">Enough guidance to make the next move feel yours.</h2></div>
            <div className="mt-16 grid gap-4 md:grid-cols-12">
              {features.map((feature, index) => { const Icon = feature.icon; return <article className={`reveal reveal-delay-${(index % 3) + 1} group relative overflow-hidden rounded-2xl border border-[#dce7e9] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#b9d5d8] hover:shadow-[0_22px_45px_-30px_rgba(23,48,74,0.4)] ${index === 0 ? 'md:col-span-7 md:min-h-72' : index === 1 ? 'md:col-span-5 md:min-h-72' : 'md:col-span-4 md:min-h-64'}`} key={feature.title}><div className={`grid size-11 place-items-center rounded-xl ${feature.tint} text-[#17304a] transition group-hover:scale-105`}><Icon size={19} strokeWidth={1.7} /></div><span className="absolute right-6 top-7 font-mono text-[10px] text-[#9dafb6]">{feature.index}</span><h3 className="mt-14 text-xl font-semibold tracking-[-0.025em] text-[#17304a]">{feature.title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[#6b7c86]">{feature.description}</p><ArrowUpRight size={17} className="absolute bottom-6 right-6 text-[#adc4c9] transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#168e98]" /></article>; })}
            </div>
          </div>
        </section>

        <section id="vision" className="relative overflow-hidden bg-[#e5f3f2] px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-vision">
          <div className="absolute -bottom-40 -left-40 size-[32rem] rounded-full border border-[#b8dddc] sm:size-[42rem]" />
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.86fr] lg:items-center lg:gap-24">
            <div className="reveal relative z-10"><SectionLabel>Future vision</SectionLabel><h2 className="max-w-3xl font-serif text-5xl leading-[0.92] tracking-[-0.04em] text-[#17304a] sm:text-7xl" data-testid="text-vision-title">A better first step changes the whole journey.</h2><p className="mt-8 max-w-lg text-base leading-7 text-[#5e747c]">MIDAS begins with navigation. Over time, it becomes a dependable research companion: helping more people ask better questions, make more informed decisions, and find their place in the work.</p><button onClick={openResearch} className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#17304a] transition hover:text-[#168e98]" data-testid="button-vision-start">Begin with an idea <ArrowRight size={16} className="transition group-hover:translate-x-1" /></button></div>
            <div className="reveal reveal-delay-2 relative mx-auto w-full max-w-sm"><div className="relative aspect-square rounded-full border border-[#a8cfce] bg-[#effafa]/60 p-8"><div className="absolute inset-8 rounded-full border border-dashed border-[#a8cfce]" /><div className="absolute inset-16 rounded-full border border-[#a8cfce]/70" /><div className="absolute inset-0 grid place-items-center"><div className="grid size-28 place-items-center rounded-[2rem] bg-[#17304a] text-center shadow-2xl shadow-[#17304a]/20"><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8fe6e2]">the work<br />ahead</span></div></div><span className="absolute left-[13%] top-[22%] grid size-12 place-items-center rounded-2xl bg-[#f7e8ca] text-[#7d5d2d]"><Lightbulb size={20} /></span><span className="absolute bottom-[15%] right-[8%] grid size-12 place-items-center rounded-2xl bg-[#e3e5f4] text-[#576084]"><BookOpen size={20} /></span><span className="absolute right-[15%] top-[9%] size-2 rounded-full bg-[#168e98]" /></div></div>
          </div>
        </section>

        <section className="bg-[#17304a] px-5 py-24 sm:px-8 sm:py-32 lg:px-12" data-testid="section-final-cta">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-10 md:flex-row md:items-end">
            <div className="reveal"><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8fe6e2]">Your next step is allowed to be small.</p><h2 className="mt-5 max-w-2xl font-serif text-6xl leading-[0.9] tracking-[-0.045em] text-white sm:text-8xl" data-testid="text-final-cta-title">Start with the question.</h2></div>
            <button onClick={openResearch} className="reveal reveal-delay-2 group flex shrink-0 items-center gap-3 rounded-full bg-[#8fe6e2] px-5 py-3.5 text-sm font-semibold text-[#17304a] transition hover:-translate-y-1 hover:bg-[#b7efeb]" data-testid="button-final-start">Explore your idea <ArrowUpRight size={16} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></button>
          </div>
        </section>
      </main>

      <footer className="bg-[#10273d] px-5 py-12 text-[#c0ced4] sm:px-8 lg:px-12" data-testid="footer">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-10 border-b border-[#2d4659] pb-10 md:flex-row">
            <div><Logo light /><p className="mt-5 max-w-xs text-sm leading-6 text-[#8fa5b0]">A research navigation platform for people at the beginning of the journey.</p></div>
             <div className="grid grid-cols-2 gap-x-14 gap-y-8 sm:grid-cols-3"><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8fe6e2]">Explore</p><div className="mt-4 space-y-3 text-sm"><a href="#roadmap" className="block transition hover:text-white" data-testid="link-footer-roadmap">Roadmap</a><a href="#how-it-works" className="block transition hover:text-white" data-testid="link-footer-how-it-works">How it works</a><a href="#features" className="block transition hover:text-white" data-testid="link-footer-features">Features</a></div></div><div><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8fe6e2]">About</p><div className="mt-4 space-y-3 text-sm"><a href="#vision" className="block transition hover:text-white" data-testid="link-footer-vision">Vision</a><button onClick={openResearch} className="block text-left transition hover:text-white" data-testid="button-footer-start">Start researching</button></div></div><div className="col-span-2 sm:col-span-1"><p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#8fe6e2]">Stage</p><p className="mt-4 text-sm leading-6 text-[#8fa5b0]">Research workspace<br />Prototype data only</p></div></div>
          </div>
          <div className="flex flex-col justify-between gap-3 pt-6 text-[11px] text-[#718994] sm:flex-row"><span data-testid="text-footer-copyright">© 2025 MIDAS. A clearer beginning for research.</span><span>Medical / Research Intelligence and Discovery Assistant System</span></div>
        </div>
      </footer>

    </div>
  );
}

function Router({
  researchResult,
  onProcessingComplete,
}: {
  researchResult: ResearchResult | null;
  onProcessingComplete: (result: ResearchResult) => void;
}) {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/research" component={ResearchInputPage} />
        <Route path="/processing">
          <ProcessingPage onComplete={onProcessingComplete} />
        </Route>
        <Route path="/workspace">
          <ResearchWorkspace result={researchResult ?? processResearchIdea(sampleResearchIdea)} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(() => loadSavedResearchResult());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router researchResult={researchResult} onProcessingComplete={setResearchResult} />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;