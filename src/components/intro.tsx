import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

// A type specimen of the name: guide lines draw in, the word steps through Syne's
// weights while the role types out, then the sheet tears along a line through the
// letters and the two halves part to show the site.

const NAME = "David";
const ROLE = "Software engineer";
const FONT = '"Syne Variable"';
const GUIDES = ["Cap height", "x-height", "Baseline", "Descender"];
const WEIGHTS = [
  { weight: 400, label: "Regular 400" },
  { weight: 500, label: "Medium 500" },
  { weight: 600, label: "Semibold 600" },
  { weight: 700, label: "Bold 700" },
  { weight: 800, label: "Extrabold 800" },
  { weight: 700, label: "Bold 700" },
];

// The beats, in ms from when the fonts are ready.
const WEIGHT_AT = 450;
const WEIGHT_STEP = 240;
const TYPE_FROM = 1000;
const TYPE_TO = 2000;
const SPLIT_AT = 2500;
const SPLIT_FOR = 1200; // matches .intro-half in index.css

const SEEN_KEY = "intro-seen";

/** Plays on a fresh visit to the home page, once per session, and never under reduced motion. */
const shouldPlay = () => {
  if (window.location.pathname !== "/") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(SEEN_KEY) === null;
  } catch {
    return true;
  }
};

interface Layout {
  size: number;
  guides: number[];
  split: number;
  height: number;
  /** The word spans the screen, leaving no margin for labels beside it. */
  narrow: boolean;
}

const Specimen = ({ weight, label, typed, layout, measureRef }: {
  weight: number;
  label: string;
  typed: string;
  layout: Layout | null;
  measureRef?: React.Ref<HTMLSpanElement>;
}) => (
  // Nothing shows, or starts animating, until the guides have been measured.
  <div
    className="intro-spec"
    data-ready={layout && layout.guides.length > 0 ? "" : undefined}
    style={layout ? { height: layout.height } : undefined}
  >
    {GUIDES.map((name, i) => {
      // A label needs room above its line, and on a narrow screen the inner two
      // would sit on the letters.
      const inner = i === 1 || i === 2;
      const roomy = !layout || ((i === 0 || layout.guides[i] - layout.guides[i - 1] >= 18) && !(inner && layout.narrow));
      return (
        <div key={name} className="intro-guide" style={{ top: layout?.guides[i], "--i": i } as React.CSSProperties}>
          {roomy && <span>{name}</span>}
        </div>
      );
    })}
    <div className="intro-word" style={{ fontWeight: weight, fontSize: layout?.size }}>
      {NAME}
      <span ref={measureRef} className="intro-baseline" />
    </div>
    <div className="intro-meta top-6 md:top-10">
      <span>Syne</span>
      <span>{label}</span>
    </div>
    <div className="intro-meta bottom-6 md:bottom-10">
      <span>
        {typed}
        <span className="intro-caret" />
      </span>
      <span>Aa Bb Cc 0123</span>
    </div>
  </div>
);

export function Intro() {
  const [playing, setPlaying] = useState(shouldPlay);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState("");
  const [layout, setLayout] = useState<Layout | null>(null);
  const [split, setSplit] = useState(false);
  const baselineRef = useRef<HTMLSpanElement>(null);
  const skipRef = useRef<() => void>(() => {});

  // Hold the page's own entrance until the sheet parts, so the hero rises as it opens.
  useLayoutEffect(() => {
    if (!playing) return;
    const root = document.documentElement;
    root.dataset.intro = "";
    return () => {
      delete root.dataset.intro;
    };
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    let alive = true;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const clear = () => timers.splice(0).forEach((t) => window.clearTimeout(t));

    const finish = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* private mode: it just plays again next time */
      }
      setPlaying(false);
    };
    const part = () => {
      clear();
      setStep(WEIGHTS.length - 1);
      setTyped(ROLE);
      setSplit(true);
      // The split eases in slowly, so the hero waits until the gap is opening to rise.
      at(SPLIT_FOR * 0.3, () => delete document.documentElement.dataset.intro);
      at(SPLIT_FOR, finish);
    };

    // Size the word to the screen and find where its guide lines fall.
    const measure = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // The boldest weight is the widest; it must still fit with room either side.
      // Measured in the DOM: canvas ignores the variable font's weight axis.
      const probe = document.createElement("span");
      probe.className = "intro-word";
      probe.style.cssText = "position:fixed;visibility:hidden;font-size:100px;font-weight:800;left:0;right:auto;transform:none";
      probe.textContent = NAME;
      document.body.appendChild(probe);
      const widest = probe.getBoundingClientRect().width;
      probe.remove();
      const size = Math.min((w * 0.86 * 100) / widest, h * 0.46, w * 0.26);
      const ctx = document.createElement("canvas").getContext("2d")!;
      ctx.font = `400 ${size}px ${FONT}`;
      // The baseline sits where the centred word lands, so apply the size first.
      const base = { size, split: Math.round(h * 0.49), height: h, narrow: w < 768 };
      flushSync(() => setLayout({ ...base, guides: [] }));
      if (!baselineRef.current) return;
      const baseline = baselineRef.current.getBoundingClientRect().top;
      const guides = [
        baseline - ctx.measureText("H").actualBoundingBoxAscent,
        baseline - ctx.measureText("x").actualBoundingBoxAscent,
        baseline,
        baseline + ctx.measureText("y").actualBoundingBoxDescent,
      ];
      setLayout({ ...base, guides });
      run();
    };

    const run = () => {
      WEIGHTS.forEach((_, i) => at(WEIGHT_AT + i * WEIGHT_STEP, () => setStep(i)));
      for (let n = 1; n <= ROLE.length; n++) {
        at(TYPE_FROM + ((TYPE_TO - TYPE_FROM) * n) / ROLE.length, () => setTyped(ROLE.slice(0, n)));
      }
      at(SPLIT_AT, part);
    };

    // A click or key press skips straight to the parting.
    let started = false;
    skipRef.current = () => {
      if (started) part();
    };

    const fonts = Promise.all([400, 800].map((wt) => document.fonts.load(`${wt} 100px ${FONT}`))).catch(() => undefined);
    // A slow font shouldn't hold the site hostage.
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 1500));
    Promise.race([fonts, timeout]).then(() => {
      if (!alive) return;
      started = true;
      measure();
    });

    return () => {
      alive = false;
      clear();
    };
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const skip = (e: Event) => {
      // Captured ahead of the section stack, so the key doesn't also scroll the page.
      e.preventDefault();
      skipRef.current();
    };
    window.addEventListener("pointerdown", skip, true);
    window.addEventListener("keydown", skip, true);
    return () => {
      window.removeEventListener("pointerdown", skip, true);
      window.removeEventListener("keydown", skip, true);
    };
  }, [playing]);

  if (!playing) return null;

  const { weight, label } = WEIGHTS[step];
  const spec = { weight, label, typed, layout };

  return (
    <div
      className="intro"
      data-split={split ? "" : undefined}
      style={layout ? ({ "--split": `${layout.split}px` } as React.CSSProperties) : undefined}
      aria-hidden
    >
      <div className="intro-half intro-half-top">
        <Specimen {...spec} measureRef={baselineRef} />
      </div>
      <div className="intro-half intro-half-bottom">
        <Specimen {...spec} />
      </div>
    </div>
  );
}
