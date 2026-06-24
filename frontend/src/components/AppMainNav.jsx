import { NavLink } from "react-router-dom";
import { BookOpen, Layers, LayoutDashboard } from "lucide-react";

const SECTIONS = [
  {
    to: "/",
    end: true,
    label: "Dashboard",
    shortLabel: "Dashboard",
    hint: "Briefing & watchlist",
    Icon: LayoutDashboard,
    title: "Live briefing, watchlist, and thesis radar",
  },
  {
    to: "/value-chain",
    label: "Value Chain",
    shortLabel: "Stack",
    hint: "22-tier stack map",
    Icon: Layers,
    title: "22-tier AI infrastructure stack — phases, bottlenecks & holdings",
  },
  {
    to: "/mastery-guide",
    label: "Learning Hub",
    shortLabel: "Learn",
    hint: "Curriculum & practice",
    Icon: BookOpen,
    title: "Reference curriculum, quizzes, flashcards & scenarios",
  },
];

export default function AppMainNav() {
  return (
    <nav className="app-main-nav" aria-label="Main sections">
      {SECTIONS.map(({ to, end, label, shortLabel, hint, Icon, title }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          title={title}
          className={({ isActive }) =>
            `app-main-nav__dest${isActive ? " app-main-nav__dest--active" : ""}`
          }
        >
          <span className="app-main-nav__icon-wrap" aria-hidden="true">
            <Icon size={17} strokeWidth={2.25} />
          </span>
          <span className="app-main-nav__copy">
            <span className="app-main-nav__title app-main-nav__title--full">
              {label}
            </span>
            <span className="app-main-nav__title app-main-nav__title--short">
              {shortLabel}
            </span>
            <span className="app-main-nav__hint">{hint}</span>
          </span>
        </NavLink>
      ))}
    </nav>
  );
}
