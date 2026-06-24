import { useCallback, useEffect, useState } from "react";
import { Maximize2, X } from "lucide-react";

const INFOGRAPHIC_SRC = "/images/ai-infra-value-chain.jpg";
const INFOGRAPHIC_ALT =
  "AI Infrastructure Value Chain — 7 phases from pre-silicon industrial infrastructure through compute execution, spanning 22 tiers from raw minerals to RAG infrastructure";

export default function ValueChainInfographic() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const openLightbox = useCallback(() => setLightboxOpen(true), []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  useEffect(() => {
    if (!lightboxOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeLightbox();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxOpen, closeLightbox]);

  return (
    <>
      <section
        className="vc-infographic mb-4 sm:mb-6"
        aria-label="Value chain overview diagram"
      >
        <p className="text-[10px] font-mono text-sigil-gold uppercase tracking-widest mb-2">
          Full stack at a glance
        </p>
        <div className="vc-infographic__frame">
          <div className="vc-infographic__scroll-wrap">
            <div className="vc-infographic__scroll">
              <button
                type="button"
                onClick={openLightbox}
                className="vc-infographic__trigger"
                aria-label="Enlarge value chain diagram"
              >
                <img
                  src={INFOGRAPHIC_SRC}
                  alt={INFOGRAPHIC_ALT}
                  className="vc-infographic__img"
                  width={2400}
                  height={900}
                  loading="eager"
                  decoding="async"
                />
              </button>
            </div>
          </div>
          <p className="text-[10px] font-mono text-slate-600 mt-2 flex items-center gap-1 lg:hidden px-1">
            <Maximize2 size={10} aria-hidden="true" />
            Tap to enlarge · scroll for detail
          </p>
          <button
            type="button"
            onClick={openLightbox}
            className="vc-infographic__expand"
            aria-label="Enlarge diagram"
          >
            <Maximize2 size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Enlarge</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed mt-2.5 px-0.5">
          Seven phases · 22 tiers — from Spruce Pine quartz to token
          monetisation. Scroll the interactive sections below for detail on each
          tier.
        </p>
      </section>

      {lightboxOpen && (
        <div
          className="vc-infographic-lightbox"
          onClick={closeLightbox}
          role="presentation"
        >
          <div
            className="vc-infographic-lightbox__panel"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged value chain diagram"
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="vc-infographic-lightbox__close"
              aria-label="Close enlarged diagram"
            >
              <X size={20} />
            </button>
            <div className="vc-infographic-lightbox__scroll">
              <img
                src={INFOGRAPHIC_SRC}
                alt={INFOGRAPHIC_ALT}
                className="vc-infographic-lightbox__img"
                width={2400}
                height={900}
                decoding="async"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
