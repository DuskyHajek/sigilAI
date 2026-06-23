export default function EssentialBadge({ className = "" }) {
  return (
    <span
      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/25 whitespace-nowrap ${className}`}
      title="Core concept for the Sigil Supernova analyst role"
    >
      ⚡ Essential
    </span>
  );
}
