import { NavLink } from "react-router-dom";
import { BookOpen, Layers, LayoutDashboard } from "lucide-react";

const SECTIONS = [
  {
    to: "/",
    end: true,
    label: "Dashboard",
    shortLabel: "Dashboard",
    Icon: LayoutDashboard,
    title: "Live briefing, watchlist, and thesis radar",
  },
  {
    to: "/value-chain",
    label: "Value Chain",
    shortLabel: "Stack",
    Icon: Layers,
    title: "22-tier AI infrastructure stack — phases, bottlenecks & holdings",
  },
  {
    to: "/mastery-guide",
    label: "Learning Hub",
    shortLabel: "Learn",
    Icon: BookOpen,
    title: "Reference curriculum, quizzes, flashcards & scenarios",
  },
];

export default function AppMainNav() {
  return (
    <nav className="app-main-nav" aria-label="Main sections">
      <div className="app-main-nav__track" role="tablist">
        {SECTIONS.map(({ to, end, label, shortLabel, Icon, title }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={title}
            role="tab"
            className={({ isActive }) =>
              `app-main-nav__tab${isActive ? " app-main-nav__tab--active" : ""}`
            }
          >
            <Icon size={16} className="shrink-0" aria-hidden="true" />
            <span className="hidden min-[420px]:inline">{label}</span>
            <span className="min-[420px]:hidden">{shortLabel}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
