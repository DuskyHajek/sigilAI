const WhatIsThis = () => {
  return (
    <section className="glass-panel p-4 md:p-5 rounded-2xl border border-slate-800">
      <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 mb-1.5">
        What is this?
      </h2>
      <p className="text-sm text-slate-200 leading-relaxed font-sans">
        This dashboard monitors 7 investment themes from the Sigil Supernova
        thesis. It classifies live news with Claude AI, tracks 20 curated
        stocks, and generates a weekly analyst brief, filtered through one
        specific investment framework.
      </p>
      <p className="mt-2 text-xs text-slate-500 font-mono leading-relaxed">
        Data sources: NewsAPI (news) · Yahoo Finance (prices) · Anthropic
        Claude (intelligence)
      </p>
    </section>
  );
};

export default WhatIsThis;

