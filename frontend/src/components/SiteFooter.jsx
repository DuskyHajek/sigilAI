import { NavLink } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Dashboard", to: "/", internal: true },
      { label: "Learning Hub", to: "/mastery-guide", internal: true },
    ],
  },
  {
    heading: "Sigil Fund",
    links: [
      { label: "sigil.fund", href: "https://sigil.fund", external: true },
      { label: "Insights", href: "https://sigil.fund/insights", external: true },
    ],
  },
];

const FooterLink = ({ link }) => {
  if (link.internal) {
    return (
      <NavLink
        to={link.to}
        className="text-sm text-[#a0a0a0] hover:text-sigil-gold transition-colors"
      >
        {link.label}
      </NavLink>
    );
  }

  if (link.disabled) return null;

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-[#a0a0a0] hover:text-sigil-gold transition-colors"
    >
      {link.label}
      {link.external && <ExternalLink size={12} className="opacity-60" />}
    </a>
  );
};

const SiteFooter = () => (
  <footer className="relative mt-12 pt-12 pb-8 border-t border-white/6 overflow-hidden">
    <p
      className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[clamp(3rem,14vw,9rem)] font-bold text-white/[0.025] whitespace-nowrap pointer-events-none select-none tracking-tight lowercase"
      aria-hidden="true"
    >
      sigil fund
    </p>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 mb-10">
        {FOOTER_LINKS.map((col) => (
          <div key={col.heading}>
            <p className="text-[10px] font-mono uppercase tracking-widest text-sigil-gold mb-3">
              {col.heading}
            </p>
            <ul className="space-y-2">
              {col.links.map((link) => (
                  <li key={link.label}>
                    <FooterLink link={link} />
                  </li>
                ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 sm:col-span-1">
          <p className="text-[10px] font-mono uppercase tracking-widest text-sigil-gold mb-3">
            About
          </p>
          <p className="text-sm text-[#a0a0a0] leading-relaxed">
            Supernova thesis intelligence demo — monitors seven investment themes
            across news, prices, and watchlist companies.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-6 border-t border-white/6">
        <p className="text-[11px] text-[#a0a0a0] leading-relaxed max-w-xl">
          Not investment advice. For internal education and demo purposes only.
        </p>
        <p className="text-[11px] text-[#a0a0a0] shrink-0">
          © {new Date().getFullYear()} Sigil Fund
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
