import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';

export function MidasBrand() {
  const [, setLocation] = useLocation();
  return (
    <button
      type="button"
      onClick={() => setLocation('/')}
      className="group inline-flex items-center gap-2.5"
      aria-label="Return to MIDAS home"
    >
      <span className="relative grid size-8 place-items-center rounded-[10px] bg-[#17304a]">
        <span className="absolute size-3 rounded-full bg-[#a7e9e4]" />
        <span className="absolute h-5 w-px rotate-45 bg-[#a7e9e4]/70" />
        <span className="absolute h-5 w-px -rotate-45 bg-[#a7e9e4]/70" />
      </span>
      <span className="font-semibold tracking-[-0.04em] text-[#17304a]">MIDAS</span>
    </button>
  );
}

export function ResearchHeader({
  workspace = false,
}: {
  workspace?: boolean;
}) {
  const [, setLocation] = useLocation();
  return (
    <header className="border-b border-[#dce7e9] bg-[#fbfdfd]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <MidasBrand />
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#168e98] sm:flex">
            <Sparkles size={12} />
            {workspace ? 'Prototype workspace' : 'Research companion'}
          </span>
          <button
            type="button"
            onClick={() => setLocation(workspace ? '/research' : '/')}
            className="inline-flex items-center gap-2 rounded-full border border-[#cfdfe2] px-3.5 py-2 text-xs font-semibold text-[#526679] transition hover:border-[#8fb7bd] hover:text-[#17304a]"
          >
            {workspace ? 'New idea' : 'Back to home'}
            {workspace ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
          </button>
        </div>
      </div>
    </header>
  );
}