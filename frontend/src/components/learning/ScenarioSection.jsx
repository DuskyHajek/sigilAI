import { SCENARIOS } from "../../data/academyData";
import ThemeBadge from "./ThemeBadge";

export default function ScenarioSection() {
  return (
    <div className="space-y-4">
      {SCENARIOS.map((s) => (
        <div key={s.title} className="glass-panel rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-2">{s.title}</p>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">{s.ctx}</p>
          <p className="text-xs font-semibold text-slate-300 mb-3">{s.q}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {s.themes.map((slug) => (
              <ThemeBadge key={slug} slug={slug} />
            ))}
          </div>
          <details className="group">
            <summary className="text-xs font-mono text-slate-500 cursor-pointer hover:text-sigil-gold transition-colors list-none flex items-center gap-1">
              <span className="group-open:hidden">Reveal analysis →</span>
              <span className="hidden group-open:inline">Hide analysis</span>
            </summary>
            <div className="mt-3 p-4 rounded-lg bg-slate-900/50 border border-slate-800/60 text-xs text-slate-400 leading-relaxed">
              {s.analysis}
            </div>
          </details>
        </div>
      ))}
    </div>
  );
}
