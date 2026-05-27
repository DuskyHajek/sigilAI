import React from 'react';
import { Terminal, ShieldAlert, FileText } from 'lucide-react';

const WeeklyBrief = ({ weeklyBriefText, isMock }) => {
  return (
    <div className="glass-panel border-gold-glow p-6 rounded-2xl flex flex-col gap-4">
      {/* Terminal Window Header Decoration */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
        <div className="flex items-center gap-2">
          {/* Decorative Terminal Dots */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-xs font-mono text-slate-500 ml-2">SUPERNOVA_ANALYST_BRIEF.sh</span>
        </div>
        
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
          <span>SOURCE: {isMock ? 'SIMULATION' : 'CLAUDE-SONNET-4'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </div>
      </div>

      {/* Main Brief Area */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Decorative Badge Icon */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-sigil-gold shrink-0 hidden sm:block">
          <Terminal size={32} />
        </div>

        {/* Content Paragraph */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileText size={14} className="text-sigil-gold" />
              Executive Intelligence Synthesizer
            </h3>
          </div>
          
          <p className="text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap border-l-2 border-sigil-gold/40 pl-4 py-1">
            {weeklyBriefText || "Syncing with intelligence networks..."}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-900/60 pt-3">
        <span>© {new Date().getFullYear()} SIGIL COGNITIVE SYSTEMS v0.1</span>
        <span>CLASSIFIED // FOR FUND PARTNER USE ONLY</span>
      </div>
    </div>
  );
};

export default WeeklyBrief;
