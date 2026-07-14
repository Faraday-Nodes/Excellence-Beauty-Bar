"use client";

/* ═══════════════════════════════════════════════════════════════
   PagePeel : drag-to-peel page curl card
   React 19 + TypeScript + Tailwind + Framer Motion + Lucide

   - Pulsing dog-ear hint on the top-right corner
   - Click-and-drag the corner to peel in real time (useMotionValue)
   - True 3D perspective (1000px), rotation about the diagonal axis
   - Dynamic studio-lighting sweep + crease shadow on the front face
   - Cast shadow that follows the peeling edge
   - Release past 50%: springs fully open to the backside view
     Release before 50%: spring (stiffness 300, damping 30) snap-back
   ═══════════════════════════════════════════════════════════════ */

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  animate,
  useReducedMotion,
} from "framer-motion";
import { RotateCcw, Sparkles, Heart, CalendarCheck, Clock } from "lucide-react";

export interface PagePeelProps {
  /** Content shown on the page while it lies flat */
  front: React.ReactNode;
  /** Content revealed underneath once the page is peeled away */
  back: React.ReactNode;
  /** Size the card here, e.g. "h-[520px] w-[380px]" */
  className?: string;
  onFlipChange?: (flipped: boolean) => void;
}

const SNAP = { type: "spring", stiffness: 300, damping: 30 } as const;

export function PagePeel({
  front,
  back,
  className = "",
  onFlipChange,
}: PagePeelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1, h: 1 });
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion();

  const W = dims.w;
  const H = dims.h;
  const diag = Math.hypot(W, H);

  /* peel progress: 0 flat → 1 fully peeled away */
  const p = useMotionValue(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const measure = () => setDims({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* The page rotates about the axis perpendicular to the corner diagonal,
     anchored at the bottom-left, so the top-right corner lifts first, then
     the whole page drifts off toward the bottom-left as it comes free. */
  const sheetTransform = useTransform(p, (v) => {
    const deg = v * 165;
    const drift = Math.pow(Math.max(0, v - 0.3) / 0.7, 1.5);
    const tx = -drift * W * 0.55;
    const ty = drift * H * 0.12;
    return `translate3d(${tx}px, ${ty}px, 0) rotate3d(${H / diag}, ${W / diag}, 0, ${-deg}deg)`;
  });
  const sheetOpacity = useTransform(p, [0, 0.85, 1], [1, 1, 0]);
  const sheetEvents = useTransform(p, (v) =>
    v < 0.05 ? ("auto" as const) : ("none" as const),
  );

  /* studio lighting: a highlight that sweeps across the front as it lifts */
  const glow = useTransform(p, (v) =>
    Math.sin(Math.PI * Math.min(v * 1.4, 1)) * 0.65,
  );
  const spread = useTransform(p, (v) => 18 + v * 60);
  const lighting = useMotionTemplate`linear-gradient(225deg, rgba(255,255,255,${glow}) 0%, rgba(255,255,255,0) ${spread}%)`;

  /* crease shadow across the front, just behind the fold */
  const crease = useTransform(p, (v) =>
    Math.sin(Math.PI * Math.min(v * 1.2, 1)) * 0.35,
  );
  const creaseBg = useMotionTemplate`linear-gradient(45deg, transparent 52%, rgba(58,34,17,${crease}) 76%, transparent 92%)`;

  /* shadow the lifting page casts on the content underneath */
  const castShadow = useTransform(p, (v) =>
    Math.sin(Math.PI * Math.min(v * 1.15, 1)) * 0.45,
  );

  const hintOpacity = useTransform(p, [0, 0.06], [1, 0]);
  const resetOpacity = useTransform(p, [0.85, 1], [0, 1]);

  const settle = useCallback(
    (target: 0 | 1) => {
      animate(p, target, SNAP);
      setFlipped(target === 1);
      onFlipChange?.(target === 1);
    },
    [p, onFlipChange],
  );

  /* Drag handling with WINDOW-level move/up listeners. The hotspot is tiny,
     so the pointer leaves it on the very first frame of a drag; listening on
     the window means the gesture keeps tracking wherever the pointer goes,
     with no dependency on pointer capture (which is unreliable across
     browsers). Framer Motion still drives every motion value and the spring. */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    /* stop native text-selection / image-drag from hijacking the gesture */
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;
    const p0 = p.get();
    let moved = false;

    /* Kill text-selection for the whole drag. Without this the browser
       starts selecting the navbar / page text as the pointer moves, which
       fires a pointercancel that aborts the peel and snaps it back. Zeroing
       user-select on the document keeps the gesture clean. */
    const rootEl = document.documentElement;
    const prevUserSelect = rootEl.style.userSelect;
    rootEl.style.userSelect = "none";
    rootEl.style.setProperty("-webkit-user-select", "none");
    const blockSelect = (ev: Event) => ev.preventDefault();
    document.addEventListener("selectstart", blockSelect);
    /* clear any selection that may have already begun on press */
    window.getSelection?.()?.removeAllRanges();

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      if (Math.hypot(dx, dy) > 6) moved = true;
      /* project the drag vector onto the peel direction (toward bottom-left) */
      const proj = (-dx * W + dy * H) / diag;
      p.set(Math.min(1, Math.max(0, p0 + proj / (diag * 0.8))));
    };
    const end = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      document.removeEventListener("selectstart", blockSelect);
      rootEl.style.userSelect = prevUserSelect;
      rootEl.style.removeProperty("-webkit-user-select");
      /* a simple tap (no drag) opens the page */
      settle(!moved || p.get() > 0.5 ? 1 : 0);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };

  const axis = `${H / diag}, ${W / diag}, 0`;

  return (
    <div
      ref={rootRef}
      className={`relative select-none ${className}`}
      style={{ perspective: 1000 }}
    >
      {/* ── backside view, revealed underneath ── */}
      <div className="absolute inset-0 overflow-hidden rounded-[24px]">
        {back}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: castShadow,
            background:
              "radial-gradient(90% 90% at 80% 10%, rgba(28,10,20,.55), rgba(28,10,20,.12) 55%, transparent 78%)",
          }}
        />
      </div>

      {/* ── the page being peeled ── */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: "0% 100%",
          transform: sheetTransform,
          opacity: sheetOpacity,
          pointerEvents: sheetEvents,
        }}
      >
        {/* front face */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[24px]"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: lighting }}
          />
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: creaseBg }}
          />
        </div>
        {/* underside of the page */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[24px]"
          style={{
            backfaceVisibility: "hidden",
            transform: `rotate3d(${axis}, 180deg)`,
            background:
              "linear-gradient(115deg, #fbeae2 0%, #f3d3c8 45%, #eec4b8 75%, #f7ddd3 100%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 30% 30%, rgba(255,255,255,.55), transparent 70%)",
            }}
          />
        </div>
      </motion.div>

      {/* ── pulsing dog-ear hint + drag hotspot ── */}
      {!flipped && (
        <motion.div
          className="absolute right-0 top-0 z-10 h-24 w-24 cursor-grab active:cursor-grabbing"
          style={{ opacity: hintOpacity, touchAction: "none" }}
          onPointerDown={onPointerDown}
          onDragStart={(e) => e.preventDefault()}
          draggable={false}
          aria-label="Open the card"
          role="button"
        >
          <motion.div
            className="absolute right-0 top-0 h-14 w-14"
            style={{ transformOrigin: "100% 0%" }}
            animate={reduced ? {} : { scale: [1, 1.09, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* soft shadow under the flap */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                background: "rgba(58,34,17,.28)",
                filter: "blur(4px)",
                transform: "translate(-2px, 3px)",
              }}
            />
            {/* the folded flap (underside showing) */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(0 0, 100% 100%, 0 100%)",
                background:
                  "linear-gradient(315deg, #eec4b8 0%, #f6dcd2 55%, #fdf1ec 100%)",
              }}
            />
            {/* fold crease highlight */}
            <div
              className="absolute inset-0"
              style={{
                clipPath:
                  "polygon(0 0, 14% 0, 100% 86%, 100% 100%, 0 100%, 0 0)",
                background:
                  "linear-gradient(315deg, transparent 46%, rgba(255,255,255,.9) 50%, transparent 54%)",
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* ── flip-back control, appears once fully peeled ── */}
      <motion.button
        type="button"
        onClick={() => settle(0)}
        className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-black/25 px-3.5 py-2 text-xs font-medium text-[#fdf3ee] backdrop-blur-sm transition-colors hover:bg-black/40"
        style={{
          opacity: resetOpacity,
          pointerEvents: flipped ? "auto" : "none",
        }}
      >
        <RotateCcw size={13} strokeWidth={2.2} aria-hidden />
        Flip back
      </motion.button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Demo : premium feature card for Excellence Beauty Bar
   Works out of the box; drop <PagePeelDemo /> anywhere.
   ═══════════════════════════════════════════════════════════════ */

export function PagePeelDemo() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-8 py-16">
      <div className="text-center">
        <p className="font-display text-sm font-semibold tracking-[0.25em] text-[#a3785a]">
          FEATURED
        </p>
        <h2 className="font-display mt-1 text-3xl font-bold text-[#5a3b26]">
          The client favorite.
        </h2>
        <p className="mt-1 text-sm text-[#a3785a]">
          Give the corner a pull to see what&apos;s included.
        </p>
      </div>

      <PagePeel
        className="h-[520px] w-[360px] sm:w-[400px]"
        front={
          <div className="flex h-full w-full flex-col bg-gradient-to-b from-[#fdf3ee] to-[#f7dcd4] p-8 shadow-[0_20px_50px_rgba(122,74,34,0.18)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2a7b8]/40">
              <Sparkles className="h-6 w-6 text-[#8a5a2b]" strokeWidth={1.6} />
            </div>
            <p className="mt-8 text-xs font-semibold tracking-[0.3em] text-[#a3785a]">
              CLIENT FAVORITE
            </p>
            <h3 className="mt-2 text-3xl font-bold leading-tight text-[#5a3b26]">
              The Strawberry Package
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#8a6a52]">
              A strawberry inspired luxury vajacial. Two-step cleanse,
              nourishing serums, a strawberry cream mask and a hydro jelly
              finish.
            </p>
            <div className="mt-auto">
              <p className="text-4xl font-bold text-[#8a5a2b]">
                $120
                <span className="ml-2 align-middle text-sm font-normal text-[#a3785a]">
                  · 90 min
                </span>
              </p>
              <p className="mt-4 text-xs text-[#b08d74]">
                There&apos;s more inside ↗
              </p>
            </div>
          </div>
        }
        back={
          <div className="flex h-full w-full flex-col bg-gradient-to-br from-[#8a3055] via-[#6b2543] to-[#48192f] p-8 text-[#fdf3ee]">
            <p className="text-xs font-semibold tracking-[0.3em] text-[#d8a75b]">
              WHAT&apos;S INCLUDED
            </p>
            <ul className="mt-6 space-y-4 text-sm">
              {[
                { icon: Heart, text: "Two-step cleanse and exfoliation" },
                { icon: Sparkles, text: "Nourishing serums, warmed and pressed" },
                { icon: Heart, text: "Strawberry cream smoothie mask" },
                { icon: Sparkles, text: "Customized hydro jelly finish" },
                { icon: Clock, text: "90 unhurried minutes, private suite" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <item.icon
                    className="mt-0.5 h-4 w-4 flex-none text-[#d8a75b]"
                    strokeWidth={1.8}
                    aria-hidden
                  />
                  <span className="text-[#fdf3ee]/85">{item.text}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://excellencebeautybarnj.as.me/schedule/9671e509"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-2 rounded-full bg-[#d8a75b] px-6 py-3 text-sm font-medium text-[#3a2211] transition-colors hover:bg-[#e9c286]"
            >
              <CalendarCheck size={15} strokeWidth={2} aria-hidden />
              Book this package
            </a>
          </div>
        }
      />
    </div>
  );
}
