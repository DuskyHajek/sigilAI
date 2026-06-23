import { useEffect, useState } from "react";

export const DASHBOARD_SECTIONS = [
  { id: "zone-today", label: "Today" },
  { id: "zone-stress-test", label: "Stress test" },
  { id: "zone-radar", label: "Radar" },
  { id: "zone-watchlist", label: "Watchlist" },
  { id: "zone-next-steps", label: "Queue" },
];

const SectionNavButtons = ({ activeId, onSelect, compact = false }) => (
  <>
    {DASHBOARD_SECTIONS.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        onClick={() => onSelect(id)}
        className={`${compact ? "px-2.5 py-1 shrink-0" : "px-2 py-1"} rounded-md text-[11px] font-mono transition-colors whitespace-nowrap ${
          activeId === id
            ? "text-sigil-gold bg-sigil-gold/10"
            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
        }`}
      >
        {label}
      </button>
    ))}
  </>
);

const DashboardSectionNav = ({ variant = "desktop" }) => {
  const [activeId, setActiveId] = useState(DASHBOARD_SECTIONS[0].id);

  useEffect(() => {
    const elements = DASHBOARD_SECTIONS.map(({ id }) =>
      document.getElementById(id)
    ).filter(Boolean);

    if (elements.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.15, 0.35, 0.55],
      }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  };

  if (variant === "mobile") {
    return (
      <nav
        className="dashboard-section-nav-mobile lg:hidden flex items-center gap-1 overflow-x-auto pb-0.5 -mx-1 px-1"
        aria-label="Dashboard sections"
      >
        <SectionNavButtons
          activeId={activeId}
          onSelect={scrollTo}
          compact
        />
      </nav>
    );
  }

  return (
    <nav
      className="dashboard-section-nav hidden lg:flex items-center gap-0.5"
      aria-label="Dashboard sections"
    >
      <SectionNavButtons activeId={activeId} onSelect={scrollTo} />
    </nav>
  );
};

export default DashboardSectionNav;
