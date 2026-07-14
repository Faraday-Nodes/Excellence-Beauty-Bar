"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  type MotionValue,
} from "framer-motion";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* Interval-driven tween for a MotionValue. Deliberately not rAF-based so the
   transition sequence always completes, even in throttled or hidden tabs
   (visual flushing still happens on the browser's own frame loop). */
function tween(
  mv: MotionValue<number>,
  to: number,
  duration: number,
  ease: (t: number) => number,
) {
  return new Promise<void>((resolve) => {
    const from = mv.get();
    const t0 = performance.now();
    const id = setInterval(() => {
      const raw = Math.min((performance.now() - t0) / duration, 1);
      mv.set(from + (to - from) * ease(raw));
      if (raw >= 1) {
        clearInterval(id);
        resolve();
      }
    }, 16);
  });
}

const easeInOut = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
/* slow start, then accelerating hard, like ripping a page off a pad */
const ripEase = (t: number) => t * t * (1.2 + 0.8 * t) * (1 / 2);

const FALLBACK_BG =
  "linear-gradient(135deg, #fdf3ee 0%, #f8dcd3 45%, #f2c8be 100%)";

/* On GitHub Pages the app lives under /<repo-name>/, so a Next <Link> renders
   its href WITH that base path (and possibly a trailing slash). Strip both
   back to the app-internal path so route matching below still works. */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
function toAppPath(href: string | null): string | null {
  if (!href) return href;
  let h = href;
  if (BASE_PATH && (h === BASE_PATH || h.startsWith(BASE_PATH + "/"))) {
    h = h.slice(BASE_PATH.length) || "/";
  }
  const hashIdx = h.indexOf("#");
  const hash = hashIdx >= 0 ? h.slice(hashIdx) : "";
  let pathPart = hashIdx >= 0 ? h.slice(0, hashIdx) : h;
  if (pathPart.length > 1) pathPart = pathPart.replace(/\/$/, "");
  return (pathPart || "/") + hash;
}

interface CachedSnapshot {
  canvas: HTMLCanvasElement;
  scrollY: number;
  width: number;
  ts: number;
}

/* ─────────────────────────────────────────────────────────────
   One vertical slice of the page. The page "curls" by wrapping
   each strip around a virtual cylinder of radius R whose contact
   line F sweeps from the right edge of the screen to the left:

     d = x - F   (how far past the roller this strip is)
     d ≤ 0        flat on the page, untouched
     0 < d < πR   on the roller: rotates up and over (0° → 180°)
     d ≥ πR       peeled tail: lies flat 2R above, mirrored,
                  trailing back and gliding off to the left
   ───────────────────────────────────────────────────────────── */
function CurlStrip({
  i,
  n,
  W,
  H,
  R,
  sweep,
  p,
  bg,
  dir,
}: {
  i: number;
  n: number;
  W: number;
  H: number;
  R: number;
  sweep: number;
  p: MotionValue<number>;
  bg: string;
  /** 1: roller sweeps right→left (tail exits left).
      -1: mirrored, sweeps left→right (tail exits right). */
  dir: 1 | -1;
}) {
  const w = W / n;
  const x = i * w;
  /* mirrored strip coordinate: the same forward math computed in a flipped
     frame, then translations and rotations are negated back */
  const xm = dir === 1 ? x : W - x - w;

  const transform = useTransform(p, (v) => {
    const F = W + R * 0.4 - Math.max(0, v) * sweep;
    const d = xm - F;
    if (d <= 0) return "translate3d(0px, 0px, 0px)";
    if (d < Math.PI * R) {
      const th = d / R;
      const tx = (F + R * Math.sin(th) - xm) * dir;
      const tz = R * (1 - Math.cos(th));
      return `translate3d(${tx}px, 0px, ${tz}px) rotateY(${(dir * -th * 180) / Math.PI}deg)`;
    }
    const tx = (F - (d - Math.PI * R) - xm) * dir;
    return `translate3d(${tx}px, 0px, ${2 * R}px) rotateY(${dir * -180}deg)`;
  });

  /* cylindrical shading: darkest where the paper faces away */
  const shade = useTransform(p, (v) => {
    const F = W + R * 0.4 - Math.max(0, v) * sweep;
    const d = xm - F;
    if (d <= 0) return 0;
    const th = Math.min(d / R, Math.PI);
    return Math.sin(Math.min(th, Math.PI / 1.15)) * 0.26;
  });

  return (
    <motion.div
      className="absolute top-0 h-full"
      style={{
        left: x,
        width: w + 1.5,
        transform,
        transformStyle: "preserve-3d",
        transformOrigin: "0% 50%",
        willChange: "transform",
      }}
    >
      {/* front: this strip's slice of the page snapshot */}
      <div
        className="absolute inset-0"
        style={{
          backfaceVisibility: "hidden",
          backgroundImage: bg,
          backgroundSize: `${W}px ${H}px`,
          backgroundPosition: `${-x}px 0px`,
        }}
      >
        <motion.div
          className="absolute inset-0 bg-[#3a2211]"
          style={{ opacity: shade }}
        />
      </div>
      {/* back: the paper underside */}
      <div
        className="absolute inset-0"
        style={{
          backfaceVisibility: "hidden",
          transform: `rotateY(${dir * 180}deg)`,
          background:
            "linear-gradient(180deg, #fbeae2 0%, #f3d3c8 50%, #f7ddd3 100%)",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-[#3a2211]"
          style={{ opacity: shade }}
        />
      </div>
    </motion.div>
  );
}

export function WaxTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const [active, setActive] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const [bg, setBg] = useState<string>(FALLBACK_BG);
  const playingRef = useRef(false);
  const capturingRef = useRef(false);
  const cacheRef = useRef<CachedSnapshot | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const html2canvasRef = useRef<
    typeof import("html2canvas-pro").default | null
  >(null);

  const [dims, setDims] = useState({ w: 1200, h: 800 });
  const W = dims.w;
  const H = dims.h;
  const R = Math.min(W, H) * 0.22;
  /* how far the roller travels over the full animation: starts just off the
     right edge, ends far enough left that every strip's tail is off-screen */
  const sweep = W * 1.35 + R * 0.4 + Math.PI * R;
  const n = W < 640 ? 20 : 32;

  /* curl progress 0 → 1 */
  const p = useMotionValue(0);

  /* shadow the roller casts on the page beneath, tracking the curl front */
  const castShadow = useTransform(p, (v) => {
    const Fm = W + R * 0.4 - Math.max(0, v) * sweep;
    const F = dir === 1 ? Fm : W - Fm;
    const s = Math.sin(Math.PI * Math.min(Math.max(0, v) * 1.1, 1)) * 0.38;
    const a = F - dir * 180;
    const b = F + dir * 6;
    const c = F + dir * 140;
    const [lo, mid, hi] = dir === 1 ? [a, b, c] : [c, b, a];
    return `linear-gradient(90deg, rgba(58,34,17,0) ${lo}px, rgba(58,34,17,${s}) ${mid}px, rgba(58,34,17,0) ${hi}px)`;
  });

  useEffect(() => {
    const measure = () =>
      setDims({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    /* preload the snapshot library so the first curl is not delayed */
    import("html2canvas-pro")
      .then((m) => (html2canvasRef.current = m.default))
      .catch(() => {});
    return () => window.removeEventListener("resize", measure);
  }, []);

  const captureViewport =
    useCallback(async (): Promise<HTMLCanvasElement | null> => {
      const h2c = html2canvasRef.current;
      if (!h2c) return null;
      try {
        const canvas = await h2c(document.body, {
          x: window.scrollX,
          y: window.scrollY,
          width: window.innerWidth,
          height: window.innerHeight,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          scale: 1,
          useCORS: true,
          backgroundColor: "#fdf3ee",
          ignoreElements: (el: Element) =>
            el.classList?.contains("wax-overlay-root"),
          /* html2canvas cannot rasterize background-clip:text; swap those to
             solid brand gold in the clone so the snapshot stays faithful */
          onclone: (doc: Document) => {
            doc
              .querySelectorAll<HTMLElement>(
                '[class*="bg-clip-text"], .text-transparent',
              )
              .forEach((el) => {
                el.style.backgroundImage = "none";
                el.style.color = "#b07c3f";
              });
          },
        });
        return canvas as HTMLCanvasElement;
      } catch {
        return null;
      }
    }, []);

  const cacheIsFresh = useCallback(() => {
    const c = cacheRef.current;
    return (
      !!c &&
      performance.now() - c.ts < 8000 &&
      Math.abs(c.scrollY - window.scrollY) < 3 &&
      c.width === window.innerWidth
    );
  }, []);

  /* Which curl (if any) a link triggers from the current page:
     forward (dir 1): any page → /services
     reverse (dir -1): /services → home (including /#section links) */
  const curlFor = useCallback((href: string | null): 1 | -1 | null => {
    if (!href) return null;
    const path = pathnameRef.current;
    if (href === "/services" && path !== "/services") return 1;
    if ((href === "/" || href.startsWith("/#")) && path === "/services")
      return -1;
    return null;
  }, []);

  useEffect(() => {
    /* pre-capture when the user hovers or touches a link that will curl */
    const preCapture = async (e: Event) => {
      const target = e.target as HTMLElement;
      const link = target.closest?.("a");
      if (!link || curlFor(toAppPath(link.getAttribute("href"))) === null)
        return;
      if (playingRef.current || capturingRef.current || cacheIsFresh()) return;
      capturingRef.current = true;
      const canvas = await Promise.race([
        captureViewport(),
        sleep(1500).then(() => null),
      ]);
      if (canvas) {
        cacheRef.current = {
          canvas,
          scrollY: window.scrollY,
          width: window.innerWidth,
          ts: performance.now(),
        };
      }
      capturingRef.current = false;
    };
    document.addEventListener("pointerover", preCapture, true);
    document.addEventListener("touchstart", preCapture, {
      capture: true,
      passive: true,
    });
    return () => {
      document.removeEventListener("pointerover", preCapture, true);
      document.removeEventListener("touchstart", preCapture, true);
    };
  }, [captureViewport, cacheIsFresh, curlFor]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const link = (e.target as HTMLElement).closest?.("a");
      if (!link) return;
      const href = toAppPath(link.getAttribute("href"));

      /* clicking Services while already there: just scroll up */
      if (href === "/services" && pathnameRef.current === "/services") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      const curlDir = curlFor(href);
      if (curlDir === null || !href) return;
      e.preventDefault();
      if (playingRef.current) return;

      const dest = curlDir === 1 ? "/services" : href;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) {
        router.push(dest);
        return;
      }

      playingRef.current = true;
      (async () => {
        try {
          /* 1. Snapshot: instant when the hover pre-capture already ran */
          p.set(0);
          let canvas: HTMLCanvasElement | null;
          if (cacheIsFresh()) {
            canvas = cacheRef.current!.canvas;
          } else {
            canvas = await Promise.race([
              captureViewport(),
              sleep(1200).then(() => null),
            ]);
          }
          cacheRef.current = null;

          /* strips paint the snapshot via background-image, so encode the
             canvas once as a blob URL (decoded a single time, shared) */
          if (canvas) {
            const url = await new Promise<string | null>((res) => {
              try {
                canvas!.toBlob(
                  (b) => res(b ? URL.createObjectURL(b) : null),
                  "image/png",
                );
              } catch {
                res(null);
              }
            });
            blobUrlRef.current = url;
            setBg(url ? `url("${url}")` : FALLBACK_BG);
          } else {
            setBg(FALLBACK_BG);
          }

          /* 2. Mount the strips (pixel-identical cover), swap the route */
          setDir(curlDir);
          setActive(true);
          await sleep(50);
          router.push(dest);
          await sleep(220);

          /* 3. The leading edge starts to curl, slowly */
          await tween(p, 0.13, 480, easeInOut);
          await sleep(100);

          /* 4. RIP: the roller sweeps across and the page rolls off */
          await tween(p, 1, 900, ripEase);
        } finally {
          setActive(false);
          p.set(0);
          playingRef.current = false;
          if (blobUrlRef.current) {
            URL.revokeObjectURL(blobUrlRef.current);
            blobUrlRef.current = null;
          }
        }
      })();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, p, captureViewport, cacheIsFresh, curlFor]);

  return (
    <>
      {children}
      <AnimatePresence>
        {active && (
          <div
            className="wax-overlay-root fixed inset-0 z-[200] overflow-hidden"
            style={{ perspective: 2000, perspectiveOrigin: "50% 50%" }}
            aria-hidden
          >
            {/* rolling shadow cast on the page beneath */}
            <motion.div
              className="absolute inset-0"
              style={{ backgroundImage: castShadow }}
            />
            {/* the page, sliced into strips that wrap around the roller */}
            {Array.from({ length: n }, (_, i) => (
              <CurlStrip
                key={i}
                i={i}
                n={n}
                W={W}
                H={H}
                R={R}
                sweep={sweep}
                p={p}
                bg={bg}
                dir={dir}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
