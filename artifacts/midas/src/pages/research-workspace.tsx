import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Info,
  Lightbulb,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { ResearchHeader } from '@/components/research/ResearchChrome';
import { InteractiveRoadmap } from '@/components/research/Roadmap';
import {
  roadmapSteps,
  workspaceNavigation,
  type RoadmapSection,
  type RoadmapStep,
} from '@/data/roadmap';
import type { ResearchResult } from '@/data/researchData';

type WorkspaceProps = {
  result: ResearchResult;
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#168e98]">
      <span className="h-px w-7 bg-[#168e98]" />
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5 border-b border-[#dce7e9] pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <SectionLabel>{eyebrow}</SectionLabel>
        <h2 className="font-serif text-4xl leading-[0.95] tracking-[-0.04em] text-[#17304a] sm:text-5xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#687b87]">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function PrototypeTag({ children = 'Prototype data' }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#bfe5e3] bg-[#effafa] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.13em] text-[#168e98]">
      <span className="size-1.5 rounded-full bg-[#20aeb0]" />
      {children}
    </span>
  );
}

function Field({
  label,
  value,
  wide = false,
}: {
  label: string;
  value: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8aa0a7]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[#40586a]">{value}</p>
    </div>
  );
}

function BulletList({
  items,
  icon = CheckCircle2,
  tone = 'teal',
}: {
  items: string[];
  icon?: typeof CheckCircle2;
  tone?: 'teal' | 'amber';
}) {
  const Icon = icon;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-[#607987]">
          <Icon
            size={15}
            className={`mt-1 shrink-0 ${tone === 'amber' ? 'text-[#bb8643]' : 'text-[#168e98]'}`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function QuestionSection({ result }: WorkspaceProps) {
  const { question } = result;
  return (
    <section id="section-question" className="space-y-6" data-testid="workspace-section-question">
      <SectionHeading
        eyebrow="01 · Research Question"
        title="Give the idea a useful shape."
        description="This is the working version MIDAS created from your first thought. Keep editing it as you learn."
      >
        <PrototypeTag />
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <article className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7">
          <div className="flex items-center gap-2 text-[#168e98]">
            <Lightbulb size={17} />
            <p className="text-xs font-semibold uppercase tracking-[0.12em]">Original idea</p>
          </div>
          <blockquote className="mt-5 border-l-2 border-[#8fe6e2] pl-4 text-base leading-7 text-[#526679]">
            “{question.originalIdea}”
          </blockquote>
          <p className="mt-6 text-xs leading-5 text-[#8a9ba3]">
            Ideas can stay rough here. This is a starting point, not a final protocol.
          </p>
        </article>
        <article className="rounded-2xl border border-[#a9d7d7] bg-[#eaf7f7] p-5 sm:p-7">
          <PrototypeTag>Possible refined question</PrototypeTag>
          <p className="mt-5 font-serif text-2xl leading-tight tracking-[-0.025em] text-[#17304a] sm:text-3xl">
            {question.refinedQuestion}
          </p>
          <div className="mt-6 flex items-center gap-2 text-xs text-[#5f7d83]">
            <Sparkles size={14} className="text-[#168e98]" />
            Refine this with your supervisor or research team later.
          </div>
        </article>
      </div>
      <div className="grid gap-5 rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:grid-cols-2 sm:p-7 lg:grid-cols-3">
        <Field label="Topic" value={question.topic} />
        <Field label="Disease / subject" value={question.subject} />
        <Field label="Technology" value={question.technology} />
        <Field label="Research task" value={question.researchTask} />
        <Field label="Population" value={question.population} />
        <Field label="Exposure / intervention" value={question.exposure} />
        <Field label="Outcome" value={question.outcome} />
        <Field label="Research type" value={question.researchType} />
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8aa0a7]">Key concepts</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {question.keyConcepts.map((concept) => (
              <span key={concept} className="rounded-full bg-[#f0f6f6] px-2.5 py-1 text-xs text-[#4c6874]">
                {concept}
              </span>
            ))}
          </div>
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#8aa0a7]">Search keywords</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {question.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-[#eef0fb] px-2.5 py-1 text-xs text-[#596286]">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanningSection({ result }: WorkspaceProps) {
  const { question } = result;
  const plan = [
    ['Define the population', question.population],
    ['Name the main exposure', question.exposure],
    ['Choose a measurable outcome', question.outcome],
    ['Decide what “good evidence” means', 'Write a small set of inclusion, exclusion, and quality criteria.'],
  ];
  return (
    <section id="section-planning" className="space-y-6" data-testid="workspace-section-planning">
      <SectionHeading
        eyebrow="02 · Planning"
        title="Make the boundaries visible."
        description="A focused project is easier to search, design, explain, and finish. Use these planning prompts before going deeper."
      >
        <PrototypeTag />
      </SectionHeading>
      <div className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7">
        <div className="grid gap-5 md:grid-cols-2">
          {plan.map(([title, detail], index) => (
            <div key={title} className="flex gap-3 border-b border-[#edf2f3] pb-5 last:border-0 md:nth-[3]:border-0 md:nth-[4]:border-0 md:pb-0">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#e7f7f8] font-mono text-[10px] text-[#168e98]">
                0{index + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-[#17304a]">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-[#6b7f88]">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-[#eadbbd] bg-[#fffaf0] p-5 text-sm leading-6 text-[#705c3d]">
        <Target size={17} className="mt-0.5 shrink-0 text-[#bb8643]" />
        <p>
          <strong className="font-semibold text-[#5f4d31]">Planning note:</strong> Keep the first version narrow enough that you can explain the population, exposure, and outcome in one breath.
        </p>
      </div>
    </section>
  );
}

function LiteratureSection({ result }: WorkspaceProps) {
  const { searchStrategy } = result;
  return (
    <section id="section-literature" className="space-y-6" data-testid="workspace-section-literature">
      <SectionHeading
        eyebrow="03 · Literature Review"
        title="See the conversation around it."
        description="Start with a repeatable search strategy, then read papers for methods and gaps—not just conclusions."
      >
        <PrototypeTag>Prototype / Mock Literature Data</PrototypeTag>
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <article className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7">
          <div className="flex items-center gap-2 text-[#168e98]">
            <Search size={17} />
            <h3 className="font-semibold text-[#17304a]">Literature Search Strategy</h3>
          </div>
          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#8aa0a7]">Keywords</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {searchStrategy.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-[#f0f6f6] px-2.5 py-1 text-xs text-[#4c6874]">
                {keyword}
              </span>
            ))}
          </div>
          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#8aa0a7]">Boolean example</p>
          <code className="mt-2 block rounded-xl bg-[#17304a] p-3 text-xs leading-5 text-[#bcebe7]">
            {searchStrategy.booleanQuery}
          </code>
          <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#8aa0a7]">Suggested databases</p>
          <p className="mt-2 text-sm leading-6 text-[#607987]">{searchStrategy.databases.join(' · ')}</p>
        </article>
        <div className="space-y-4">
          {result.literature.map((paper) => (
            <article key={paper.id} className="rounded-2xl border border-[#d7e5e8] bg-white p-5 transition hover:border-[#a9cfd1] sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#eef0fb] px-2.5 py-1 text-[10px] font-semibold text-[#596286]">{paper.studyType}</span>
                <span className="font-mono text-[10px] text-[#8aa0a7]">{paper.area} · {paper.year}</span>
              </div>
              <h3 className="mt-3 text-base font-semibold leading-6 text-[#17304a]">{paper.title}</h3>
              <p className="mt-1 text-xs text-[#7b8d95]">{paper.authors}</p>
              <p className="mt-4 text-sm leading-6 text-[#607987]">{paper.summary}</p>
              <div className="mt-4 flex items-start gap-2 border-t border-[#edf2f3] pt-4 text-xs leading-5 text-[#5e777f]">
                <BookOpen size={14} className="mt-0.5 shrink-0 text-[#168e98]" />
                <span><strong className="font-semibold text-[#17304a]">Why it may help:</strong> {paper.relevance}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MethodologySection({ result }: WorkspaceProps) {
  return (
    <section id="section-methodology" className="space-y-6" data-testid="workspace-section-methodology">
      <SectionHeading
        eyebrow="04 · Methodology"
        title="Compare the ways to learn."
        description="These are prototype recommendations to help you ask better design questions. They are not a substitute for methodological supervision."
      >
        <PrototypeTag>Prototype recommendations</PrototypeTag>
      </SectionHeading>
      <div className="grid gap-4">
        {result.methodologies.map((method, index) => (
          <article key={method.id} className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#17304a] font-mono text-xs text-[#8fe6e2]">0{index + 1}</span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-[#17304a]">{method.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#607987]">{method.fit}</p>
              </div>
              <span className="rounded-full bg-[#f4f8f8] px-3 py-1.5 text-xs text-[#5d747d]">Possible fit</span>
            </div>
            <div className="mt-6 grid gap-5 border-t border-[#edf2f3] pt-5 md:grid-cols-2">
              <div>
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#168e98]"><CheckCircle2 size={15} /> Advantages</p>
                <BulletList items={method.advantages} />
              </div>
              <div>
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#bb8643]"><AlertTriangle size={15} /> Limitations</p>
                <BulletList items={method.limitations} icon={AlertTriangle} tone="amber" />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InstrumentsSection({ result }: WorkspaceProps) {
  return (
    <section id="section-instruments" className="space-y-6" data-testid="workspace-section-instruments">
      <SectionHeading
        eyebrow="05 · Instruments"
        title="Choose measures with care."
        description="A named questionnaire or task is only the beginning. Check the evidence, version, permissions, and fit for your population."
      >
        <PrototypeTag>Mock instruments</PrototypeTag>
      </SectionHeading>
      <div className="flex items-start gap-3 rounded-2xl border border-[#eadbbd] bg-[#fffaf0] p-5 text-sm leading-6 text-[#705c3d]">
        <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#bb8643]" />
        <p><strong className="font-semibold text-[#5f4d31]">Verify before use:</strong> validation, licensing, suitability for your population, scoring instructions, and the original source.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {result.instruments.map((instrument) => (
          <article key={instrument.id} className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#f7f1e5] text-[#896632]"><ClipboardList size={18} /></div>
              <span className="text-right font-mono text-[9px] uppercase tracking-[0.13em] text-[#8aa0a7]">{instrument.validationStatus}</span>
            </div>
            <h3 className="mt-5 text-lg font-semibold text-[#17304a]">{instrument.name}</h3>
            <Field label="Measures" value={instrument.measures} wide />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Population" value={instrument.population} />
              <Field label="Source to verify" value={instrument.source} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EthicsSection({ result }: WorkspaceProps) {
  return (
    <section id="section-ethics" className="space-y-6" data-testid="workspace-section-ethics">
      <SectionHeading
        eyebrow="06 · Ethics"
        title="Build responsibility into the plan."
        description="Ethics is part of the design, not a formality at the end. Use these prompts to identify what needs local review."
      >
        <PrototypeTag>Planning prompts</PrototypeTag>
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-2 text-[#168e98]">
            <ShieldCheck size={18} />
            <h3 className="font-semibold text-[#17304a]">Potential considerations</h3>
          </div>
          <BulletList items={result.ethics.considerations} icon={ShieldCheck} />
        </article>
        <aside className="rounded-2xl border border-[#eadbbd] bg-[#fffaf0] p-5 sm:p-7">
          <Info size={18} className="text-[#bb8643]" />
          <p className="mt-4 text-sm leading-7 text-[#705c3d]">{result.ethics.disclaimer}</p>
        </aside>
      </div>
    </section>
  );
}

function DataCollectionSection({ result }: WorkspaceProps) {
  return (
    <section id="section-data-collection" className="space-y-6" data-testid="workspace-section-data-collection">
      <SectionHeading
        eyebrow="07 · Data Collection"
        title="Turn the plan into fieldwork."
        description="Make it concrete: who participates, what you collect, how it happens, and where the boundaries are."
      >
        <PrototypeTag>Prototype plan</PrototypeTag>
      </SectionHeading>
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7">
          <div className="flex items-center gap-2 text-[#168e98]"><Users size={18} /><h3 className="font-semibold text-[#17304a]">Potential participants</h3></div>
          <p className="mt-4 text-sm leading-6 text-[#607987]">{result.dataCollection.participants}</p>
          <div className="mt-7 border-t border-[#edf2f3] pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[0.15em] text-[#8aa0a7]">Collection methods</p>
            <BulletList items={result.dataCollection.methods} />
          </div>
        </article>
        <article className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7">
          <div className="flex items-center gap-2 text-[#168e98]"><ClipboardList size={18} /><h3 className="font-semibold text-[#17304a]">Variables to consider</h3></div>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.dataCollection.variables.map((variable) => (
              <span key={variable} className="rounded-xl border border-[#dce8e9] bg-[#f7fbfb] px-3 py-2 text-xs leading-5 text-[#526b77]">{variable}</span>
            ))}
          </div>
        </article>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7"><h3 className="text-sm font-semibold text-[#17304a]">Inclusion considerations</h3><div className="mt-4"><BulletList items={result.dataCollection.inclusion} /></div></article>
        <article className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7"><h3 className="text-sm font-semibold text-[#17304a]">Exclusion considerations</h3><div className="mt-4"><BulletList items={result.dataCollection.exclusion} icon={AlertTriangle} tone="amber" /></div></article>
      </div>
    </section>
  );
}

function AnalysisSection({ result }: WorkspaceProps) {
  return (
    <section id="section-analysis" className="space-y-6" data-testid="workspace-section-analysis">
      <SectionHeading
        eyebrow="08 · Data Analysis"
        title="Name what the evidence can say."
        description="Start by understanding the variables, then choose analysis that fits the design and the data you actually collect."
      >
        <PrototypeTag>Prototype plan</PrototypeTag>
      </SectionHeading>
      <article className="overflow-hidden rounded-2xl border border-[#d7e5e8] bg-white">
        <div className="flex items-center gap-2 border-b border-[#edf2f3] px-5 py-5 text-[#168e98] sm:px-7"><BarChart3 size={18} /><h3 className="font-semibold text-[#17304a]">Variable map</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-[#f7fbfb] font-mono text-[9px] uppercase tracking-[0.13em] text-[#8aa0a7]"><tr><th className="px-5 py-3 font-medium sm:px-7">Variable</th><th className="px-5 py-3 font-medium">Type</th><th className="px-5 py-3 font-medium">Role</th></tr></thead>
            <tbody className="divide-y divide-[#edf2f3] text-[#607987]">{result.analysis.variables.map((variable) => <tr key={variable.name}><td className="px-5 py-4 font-semibold text-[#40586a] sm:px-7">{variable.name}</td><td className="px-5 py-4">{variable.type}</td><td className="px-5 py-4">{variable.role}</td></tr>)}</tbody>
          </table>
        </div>
      </article>
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7"><h3 className="text-sm font-semibold text-[#17304a]">Possible descriptive analysis</h3><div className="mt-4"><BulletList items={result.analysis.descriptive} /></div></article>
        <article className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7"><h3 className="text-sm font-semibold text-[#17304a]">Potential statistical approaches</h3><div className="mt-4"><BulletList items={result.analysis.statistical} /></div></article>
      </div>
      <div className="flex items-start gap-3 rounded-2xl border border-[#eadbbd] bg-[#fffaf0] p-5 text-sm leading-6 text-[#705c3d]"><Info size={17} className="mt-0.5 shrink-0 text-[#bb8643]" /><p>{result.analysis.note}</p></div>
    </section>
  );
}

function PublicationSection({ result }: WorkspaceProps) {
  return (
    <section id="section-publication" className="space-y-6" data-testid="workspace-section-publication">
      <SectionHeading
        eyebrow="09–11 · Publication"
        title="Carry the work to the audience."
        description="Writing and journal selection become easier when the question, evidence, and contribution are clear."
      >
        <PrototypeTag>Prototype Journal Suggestions</PrototypeTag>
      </SectionHeading>
      <div className="grid gap-4">
        {result.journals.map((journal) => (
          <article key={journal.name} className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e7f7f8] text-[#168e98]"><FileText size={18} /></div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-semibold text-[#17304a]">{journal.name}</h3>
                <p className="mt-1 text-xs text-[#7b8d95]">{journal.area}</p>
              </div>
              <div className="w-full sm:w-40">
                <div className="flex justify-between font-mono text-[9px] uppercase tracking-[0.12em] text-[#8aa0a7]"><span>Prototype fit</span><span>{journal.relevanceScore}%</span></div>
                <div className="mt-2 h-1.5 rounded-full bg-[#e8f0f1]"><div className="h-full rounded-full bg-[#20aeb0]" style={{ width: `${journal.relevanceScore}%` }} /></div>
              </div>
            </div>
            <p className="mt-4 border-t border-[#edf2f3] pt-4 text-sm leading-6 text-[#607987]">{journal.reason}</p>
          </article>
        ))}
      </div>
      <div className="rounded-2xl border border-[#d7e5e8] bg-white p-5 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#f8eded] text-[#a26161]"><AlertTriangle size={18} /></div>
          <div><h3 className="text-lg font-semibold text-[#17304a]">Common beginner mistakes</h3><p className="mt-1 text-sm leading-6 text-[#6b7f88]">Keep these visible while the project is still taking shape.</p></div>
        </div>
        <div className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {result.beginnerMistakes.map((mistake, index) => <div key={mistake.title} className="flex items-start gap-3 border-t border-[#edf2f3] pt-4"><span className="font-mono text-[10px] text-[#168e98]">0{index + 1}</span><div><h4 className="text-sm font-semibold text-[#40586a]">{mistake.title}</h4><p className="mt-1 text-sm leading-6 text-[#71818a]">{mistake.detail}</p></div></div>)}
        </div>
      </div>
    </section>
  );
}

function renderSection(section: RoadmapSection, result: ResearchResult) {
  switch (section) {
    case 'question':
      return <QuestionSection result={result} />;
    case 'planning':
      return <PlanningSection result={result} />;
    case 'literature':
      return <LiteratureSection result={result} />;
    case 'methodology':
      return <MethodologySection result={result} />;
    case 'instruments':
      return <InstrumentsSection result={result} />;
    case 'ethics':
      return <EthicsSection result={result} />;
    case 'data-collection':
      return <DataCollectionSection result={result} />;
    case 'analysis':
      return <AnalysisSection result={result} />;
    case 'publication':
      return <PublicationSection result={result} />;
    default:
      return <QuestionSection result={result} />;
  }
}

export default function ResearchWorkspace({ result }: WorkspaceProps) {
  const [, setLocation] = useLocation();
  const [activeStepId, setActiveStepId] = useState('research-question');
  const activeStep = roadmapSteps.find((step) => step.id === activeStepId) ?? roadmapSteps[0];

  const selectStep = (step: RoadmapStep) => {
    setActiveStepId(step.id);
    window.setTimeout(() => {
      document.getElementById('workspace-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const selectNavigation = (section: RoadmapSection) => {
    const navigationItem = workspaceNavigation.find((item) => item.section === section);
    if (navigationItem) {
      const step = roadmapSteps.find((candidate) => candidate.id === navigationItem.stepId);
      if (step) selectStep(step);
    }
  };

  return (
    <div className="midas-noise min-h-[100dvh] bg-[#f7fbfb] text-[#17304a]">
      <ResearchHeader workspace />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-8 sm:px-8 lg:px-12 lg:pt-12">
        <div className="mb-8 flex flex-col gap-5 border-b border-[#dce7e9] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[#168e98]">
              <span className="size-1.5 rounded-full bg-[#20aeb0]" />
              Your Research Map
            </p>
            <h1 className="font-serif text-5xl leading-[0.9] tracking-[-0.045em] text-[#17304a] sm:text-7xl">Your Research Workspace</h1>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-[#687b87] sm:text-base">
              One place for the question, the evidence, the choices, and the next step.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#71838b]">
            <span className="grid size-7 place-items-center rounded-full bg-[#8fe6e2] text-[#17304a]"><CheckCircle2 size={15} /></span>
            Map generated locally
          </div>
        </div>

        <div className="mb-8 rounded-2xl border border-[#cfe2e3] bg-[#eef8f8] p-4 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
          <div className="flex items-start gap-3">
            <Sparkles size={17} className="mt-1 shrink-0 text-[#168e98]" />
            <div><p className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#168e98]">Working idea</p><p className="mt-1 text-sm leading-6 text-[#405f69]">{result.question.originalIdea}</p></div>
          </div>
          <button type="button" onClick={() => setLocation('/research')} className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#17304a] transition hover:text-[#168e98] sm:mt-0">Edit idea <ArrowRight size={14} /></button>
        </div>

        <section className="rounded-2xl border border-[#d7e5e8] bg-[#fbfdfd] p-4 shadow-[0_24px_70px_-55px_rgba(23,48,74,0.55)] sm:p-6 lg:p-8" data-testid="workspace-roadmap-panel">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div><SectionLabel>Interactive Research Roadmap</SectionLabel><h2 className="text-lg font-semibold text-[#17304a]">Move through the work in order—or jump where you need to.</h2></div>
            <span className="flex items-center gap-2 text-xs text-[#71838b]"><span className="size-2 rounded-full bg-[#8fe6e2]" /> Current step is highlighted</span>
          </div>
          <InteractiveRoadmap activeStepId={activeStep.id} onSelect={selectStep} />
        </section>

        <div className="mt-9 grid gap-8 lg:grid-cols-[220px_1fr] lg:items-start lg:gap-12">
          <aside className="lg:sticky lg:top-6">
            <div className="hidden rounded-2xl border border-[#d7e5e8] bg-white p-3 lg:block">
              <p className="px-3 pb-3 font-mono text-[9px] uppercase tracking-[0.16em] text-[#8aa0a7]">Your workspace</p>
              <nav className="space-y-1" aria-label="Research workspace sections">
                {workspaceNavigation.map((item) => {
                  const isActive = activeStep.section === item.section;
                  return (
                    <button type="button" key={item.section} onClick={() => selectNavigation(item.section)} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition ${isActive ? 'bg-[#eaf7f7] text-[#17304a]' : 'text-[#71838b] hover:bg-[#f5fafa] hover:text-[#17304a]'}`} aria-current={isActive ? 'page' : undefined}>
                      <span>{item.label}</span><ChevronRight size={14} className={isActive ? 'text-[#168e98]' : 'text-[#a8b8bd]'} />
                    </button>
                  );
                })}
              </nav>
            </div>
            <label className="sr-only" htmlFor="workspace-section-select">Choose workspace section</label>
            <select id="workspace-section-select" value={activeStep.section} onChange={(event) => selectNavigation(event.target.value as RoadmapSection)} className="w-full rounded-xl border border-[#cfdfe2] bg-white px-4 py-3 text-sm font-semibold text-[#17304a] outline-none focus:border-[#168e98] lg:hidden">
              {workspaceNavigation.map((item) => <option key={item.section} value={item.section}>{item.label}</option>)}
            </select>
          </aside>

          <div id="workspace-section" className="min-w-0 scroll-mt-6">
            <div className="mb-5 flex items-center gap-2 text-xs text-[#71838b]"><span className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#168e98]">Now viewing</span><ChevronRight size={13} /><span className="font-semibold text-[#40586a]">{activeStep.label}</span></div>
            {renderSection(activeStep.section, result)}
          </div>
        </div>
      </main>
      <footer className="border-t border-[#dce7e9] bg-[#10273d] px-5 py-8 text-[#8fa5b0] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p><span className="font-semibold text-white">MIDAS</span> · Research workspace prototype</p>
          <p>Mock data only · Verify sources before making research decisions</p>
        </div>
      </footer>
    </div>
  );
}