import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

// Words in running text that carry a small picture of the work they name. With a
// mouse, hovering one floats a card of the work beside the pointer; the card trails
// the pointer and leans into its sideways speed. On touch, the first tap shows the
// card under the word and the second follows the link.

export interface PreviewItem {
  id: string;
  image: string;
  caption: string;
  to: string;
}

interface PreviewState {
  items: PreviewItem[];
  active: string | null;
  open: (id: string, anchor?: HTMLElement) => void;
  close: () => void;
}

const PreviewContext = createContext<PreviewState | null>(null);

const OFFSET = 24; // card distance from the pointer
const GAP = 12; // card distance from a word it is anchored to
const MARGIN = 16; // closest the card comes to the window edge

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function PreviewRegion({ items, className, children }: {
  items: PreviewItem[];
  className?: string;
  children: React.ReactNode;
}) {
  const regionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [origin, setOrigin] = useState("0 0");
  const reduced = useReducedMotion() ?? false;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useMotionValue(0);
  // Critically damped: the card glides after the pointer and lands without wobble.
  const sx = useSpring(x, { stiffness: 170, damping: 26 });
  const sy = useSpring(y, { stiffness: 170, damping: 26 });
  // The lean is allowed a little overshoot, so it swings back as the pointer stops.
  const sr = useSpring(rotate, { stiffness: 200, damping: 18 });

  const place = (px: number, py: number, instant: boolean) => {
    x.set(px);
    y.set(py);
    if (instant || reduced) {
      x.jump(px);
      y.jump(py);
      sx.jump(px);
      sy.jump(py);
    }
  };

  /** Centres the card under the word, or over it when there is no room below. */
  const anchorTo = (word: HTMLElement) => {
    const region = regionRef.current;
    const card = cardRef.current;
    if (!region || !card) return;
    const r = region.getBoundingClientRect();
    const w = word.getBoundingClientRect();
    const below = w.bottom + GAP + card.offsetHeight <= window.innerHeight - MARGIN;
    const top = below ? w.bottom + GAP : w.top - GAP - card.offsetHeight;
    const left = clamp(w.left + w.width / 2 - card.offsetWidth / 2, MARGIN, window.innerWidth - MARGIN - card.offsetWidth);
    rotate.jump(0);
    sr.jump(0);
    setOrigin(below ? "50% 0" : "50% 100%");
    place(left - r.left, top - r.top, true);
  };

  useEffect(() => {
    const region = regionRef.current;
    const card = cardRef.current;
    if (!region || !card) return;
    let lastX = 0;
    let still = 0;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = region.getBoundingClientRect();
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      // Flip to the other side of the pointer rather than run off the window.
      const left = e.clientX + OFFSET + w > window.innerWidth - MARGIN;
      const up = e.clientY + OFFSET + h > window.innerHeight - MARGIN;
      setOrigin(`${left ? "100%" : "0"} ${up ? "100%" : "0"}`);
      place(
        (left ? e.clientX - OFFSET - w : e.clientX + OFFSET) - r.left,
        (up ? e.clientY - OFFSET - h : e.clientY + OFFSET) - r.top,
        false
      );
      if (!reduced) {
        rotate.set(clamp((e.clientX - lastX) * 0.5, -8, 8));
        // Once the pointer rests, the card settles upright.
        window.clearTimeout(still);
        still = window.setTimeout(() => rotate.set(0), 90);
      }
      lastX = e.clientX;
    };
    region.addEventListener("pointermove", move);
    return () => {
      region.removeEventListener("pointermove", move);
      window.clearTimeout(still);
    };
    // The motion values are stable; `place` only closes over them and `reduced`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  // The first time the words come into view, each lights up once in turn, so it is
  // clear there is something to hover.
  useEffect(() => {
    const region = regionRef.current;
    if (!region || reduced) return;
    const timers: number[] = [];
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        region.querySelectorAll<HTMLElement>(".pw-word").forEach((word, i) => {
          timers.push(
            window.setTimeout(() => {
              word.classList.add("is-hinting");
              timers.push(window.setTimeout(() => word.classList.remove("is-hinting"), 550));
            }, 400 + i * 220)
          );
        });
      },
      { threshold: 0.6 }
    );
    seen.observe(region);
    return () => {
      seen.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [reduced]);

  // A tap anywhere else, or Escape, puts the card away.
  useEffect(() => {
    if (!active) return;
    const outside = (e: PointerEvent) => {
      if (!(e.target as Element).closest?.(".pw-word")) setActive(null);
    };
    const escape = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [active]);

  const current = items.find((item) => item.id === active);
  const state: PreviewState = {
    items,
    active,
    open: (id, anchor) => {
      if (anchor) anchorTo(anchor);
      setActive(id);
    },
    close: () => setActive(null),
  };

  return (
    <PreviewContext.Provider value={state}>
      <div ref={regionRef} className={cn("relative", className)}>
        {children}
        <motion.div
          ref={cardRef}
          className={cn("pw-card", current && "is-on")}
          style={{ x: sx, y: sy, rotate: reduced ? 0 : sr }}
          aria-hidden
        >
          {/* Grows out of the corner nearest the pointer. */}
          <div className="pw-card-inner" style={{ "--card-origin": origin } as React.CSSProperties}>
            {items.map((item) => (
              <img
                key={item.id}
                src={item.image}
                alt=""
                decoding="async"
                className={cn("pw-card-art", item.id === active && "is-current")}
              />
            ))}
            <span className="pw-card-caption">{current?.caption}</span>
          </div>
        </motion.div>
      </div>
    </PreviewContext.Provider>
  );
}

export function PreviewWord({ id, children }: { id: string; children: React.ReactNode }) {
  const preview = useContext(PreviewContext);
  const touched = useRef(false);
  if (!preview) throw new Error("PreviewWord must be inside a PreviewRegion");
  const index = preview.items.findIndex((item) => item.id === id);
  const item = preview.items[index];
  const active = preview.active === id;

  return (
    <Link
      to={item.to}
      data-no-blobity
      className={cn("pw-word", active && "is-active")}
      onPointerDown={(e) => {
        touched.current = e.pointerType !== "mouse";
      }}
      onPointerEnter={(e) => e.pointerType === "mouse" && preview.open(id)}
      onPointerLeave={(e) => e.pointerType === "mouse" && preview.close()}
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && preview.open(id, e.currentTarget)}
      onBlur={preview.close}
      onClick={(e) => {
        // A first tap only shows the work; the second goes to it.
        if (touched.current && !active) {
          e.preventDefault();
          preview.open(id, e.currentTarget);
        }
      }}
    >
      {children}
      <span
        className="pw-thumb"
        style={{ backgroundImage: `url("${item.image}")`, "--jiggle-delay": `${1 + index * 0.6}s` } as React.CSSProperties}
        aria-hidden
      />
    </Link>
  );
}
