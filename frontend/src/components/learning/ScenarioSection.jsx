import { Lightbulb } from "lucide-react";
import { SCENARIOS } from "../../data/academyData";
import ThemeBadge from "./ThemeBadge";
import { TipBox } from "./LearningUI";

export default function ScenarioSection() {
  return (
    <div>
      <TipBox icon={Lightbulb}>
        Read each case, form your own view using the mental models from Reference, then
        reveal the analysis. There is no timer — the goal is applied thinking, not speed.
      </TipBox>

      <div className="space-y-4">
        {SCENARIOS.map((s, i) => (
          <div
            key={s.title}
            className="glass-panel rounded-xl p-5 border border-slate-800/60 hover:border-slate-700/60 transition-colors"
          >
            <div className="flex items-start gap-3 mb-3">
              <span className="shrink-0 w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-xs font-mono font-bold text-sigil-gold">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white mb-2">{s.title}</p>
                <div className="rounded-lg bg-slate-900/50 border border-slate-800/50 px-3 py-2.5 mb-3">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1">
                    Context
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.ctx}</p>
                </div>
                <p className="text-xs font-semibold text-slate-300 mb-2">{s.q}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.themes.map((slug) => (
                    <ThemeBadge key={slug} slug={slug} />
                  ))}
                </div>
              </div>
            </div>
            <details className="group mt-2">
              <summary className="text-xs font-mono text-slate-500 cursor-pointer hover:text-sigil-gold transition-colors list-none inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-sigil-gold/20">
                <Lightbulb size={12} />
                <span className="group-open:hidden">Reveal analysis</span>
                <span className="hidden group-open:inline">Hide analysis</span>
              </summary>
              <div className="mt-3 p-4 rounded-lg bg-sigil-gold/[0.04] border border-sigil-gold/15 text-xs text-slate-400 leading-relaxed">
                {s.analysis}
              </div>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
