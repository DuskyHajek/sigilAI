import { THEME_BADGE_CLASSES, THEME_LABELS } from "../../data/academyData";

export default function ThemeBadge({ slug }) {
  const label = THEME_LABELS[slug] ?? slug;
  const classes = THEME_BADGE_CLASSES[slug] ?? THEME_BADGE_CLASSES.overview;

  return (
    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${classes}`}>
      {label}
    </span>
  );
}
