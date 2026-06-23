import { useEffect, useState } from "react";

export const DASHBOARD_SECTIONS = [
  { id: "zone-today", label: "Brief" },
  { id: "zone-stress-test", label: "Scenarios" },
  { id: "zone-radar", label: "Themes" },
  { id: "zone-watchlist", label: "Watchlist" },
  { id: "zone-next-steps", label: "Tasks" },
];

const SectionNavButtons = ({ activeId, onSelect, compact = false }) => (
  <>
    {DASHBOARD_SECTIONS.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        onClick={() => onSelect(id)}
        className={`${compact ? "px-2.5 py-1 shrink-0" : "px-3 py-1"} rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap ${
          activeId === id
            ? "bg-sigil-gold text-black"
            : "text-white/60 hover:text-white hover:bg-white/5"
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
