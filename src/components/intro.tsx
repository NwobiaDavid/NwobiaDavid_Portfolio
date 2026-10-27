import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { sections } from "@/constants/sections";

// The site boots like a dev server: a command types out in the corner, the build
// logs report in, and the name decodes out of noise. Once it is "ready" the screen
// tears along a line through the name and the two halves part to show the site.

const NAME = "David Nwobia";
const ROLE = "Software Engineer";
const COMMAND = "npm run dev";
const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+=<>/\\{}[]";
const FONT = '"Syne Variable"';

// The beats, in ms from when the font is ready.
const TYPE_FROM = 150;
const TYPE_TO = 650;
const LOG_AT = [800, 1000, 1200];
const DECODE_FROM = 700;
const DECODE_TO = 1900;
const DECODE_TICK = 45;
const SPLIT_AT = 2600;
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

const noise = () => NOISE[Math.floor(Math.random() * NOISE.length)];

/** Each letter resolves in turn, left to right; the rest keep flickering. */
const decodeAt = (progress: number) =>
  [...NAME].map((ch, i) => (ch === " " || progress * NAME.length > i ? null : noise()));

interface Screen {
  size: number;
  height: number;
  typed: string;
  logs: string[];
  /** Per letter: the noise glyph standing in for it, or null once it has resolved. */
  glyphs: (string | null)[];
  role: boolean;
  /** On a narrow screen the name takes two lines, and the tear runs between them. */
  stacked: boolean;
}

const Terminal = ({ size, height, typed, logs, glyphs, role, stacked }: Screen) => (
  <div className="intro-spec" style={{ height }}>
    <div className="intro-meta top-6 md:top-10">
      <span>~/david-nwobia</span>
      <span>
        git:(<span className="text-foreground">main</span>)
      </span>
    </div>

    <div className="intro-name" style={{ fontSize: size }}>
      {[...NAME].map((ch, i) =>
        ch === " " && stacked ? (
          <br key={i} />
        ) : (
          // The real letter holds its own width, so the noise never shifts the word.
          <span key={i} className="intro-cell">
            <span className={glyphs[i] ? "invisible" : undefined}>{ch === " " ? " " : ch}</span>
            {glyphs[i] && <span className="intro-noise">{glyphs[i]}</span>}
          </span>
        )
      )}
      <span className="intro-role" data-on={role ? "" : undefined}>
        {ROLE}
      </span>
    </div>

    <div className="intro-meta intro-term bottom-6 md:bottom-10">
      <div className="flex flex-col gap-1">
        <span>
          <span className="text-muted-foreground">$ </span>
          <span className="text-foreground">{typed}</span>
          {logs.length === 0 && <span className="intro-caret" />}
        </span>
        {logs.map((line) => (
          <span key={line} className="intro-log">
            {line}
          </span>
        ))}
      </div>
      <span className="hidden self-end sm:inline">Click or press any key to skip</span>
    </div>
  </div>
);

export function Intro() {
  const [playing, setPlaying] = useState(shouldPlay);
  const [screen, setScreen] = useState<Screen | null>(null);
  const [split, setSplit] = useState(false);
  const skipRef = useRef<() => void>(() => {});

  // Hold the page's own entrance until the screen parts, so the hero rises as it opens.
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
    let ticker = 0;
    const clear = () => {
      timers.splice(0).forEach((t) => window.clearTimeout(t));
      window.clearInterval(ticker);
    };
    const update = (patch: Partial<Screen>) => setScreen((s) => (s ? { ...s, ...patch } : s));

    // Real numbers, not set dressing: the sections on this page, how fast the server
    // answered, and where it is being served from. Time to first byte measures the
    // hosting, not the visitor's connection, so a slow phone network doesn't show here.
    const [nav] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const ttfb = nav ? Math.max(1, Math.round(nav.responseStart)) : null;
    const logs = () => [
      `› compiling ${sections.length} sections`,
      ttfb ? `✓ first byte in ${ttfb} ms` : "✓ compiled",
      `➜ live at ${window.location.host}`,
    ];

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
      update({ typed: COMMAND, logs: logs(), glyphs: decodeAt(1), role: true });
      setSplit(true);
      // The split eases in slowly, so the hero waits until the gap is opening to rise.
      at(SPLIT_FOR * 0.3, () => delete document.documentElement.dataset.intro);
      at(SPLIT_FOR, finish);
    };

    const run = () => {
      for (let n = 1; n <= COMMAND.length; n++) {
        at(TYPE_FROM + ((TYPE_TO - TYPE_FROM) * n) / COMMAND.length, () => update({ typed: COMMAND.slice(0, n) }));
      }
      LOG_AT.forEach((ms, i) => at(ms, () => update({ logs: logs().slice(0, i + 1) })));
      at(DECODE_FROM, () => {
        const start = performance.now();
        ticker = window.setInterval(() => {
          const progress = Math.min(1, (performance.now() - start) / (DECODE_TO - DECODE_FROM));
          update({ glyphs: decodeAt(progress) });
          if (progress === 1) window.clearInterval(ticker);
        }, DECODE_TICK);
      });
      at(DECODE_TO - 100, () => update({ role: true }));
      at(SPLIT_AT, part);
    };

    // A click or key press skips straight to the parting.
    let started = false;
    skipRef.current = () => {
      if (started) part();
    };

    // The name is set as wide as the screen allows, in the font it will be shown in.
    const start = () => {
      if (!alive) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const probe = document.createElement("span");
      probe.className = "intro-name";
      probe.style.cssText = "position:fixed;visibility:hidden;font-size:100px;left:0;right:auto;transform:none";
      const stacked = w < 640;
      // Stacked, the longest word sets the size.
      probe.textContent = stacked ? NAME.split(" ").reduce((a, b) => (b.length > a.length ? b : a)) : NAME;
      document.body.appendChild(probe);
      const width = probe.getBoundingClientRect().width;
      probe.remove();
      const size = Math.min((w * 0.84 * 100) / width, h * (stacked ? 0.13 : 0.2));
      setScreen({ size, height: h, typed: "", logs: [], glyphs: decodeAt(0), role: false, stacked });
      started = true;
      run();
    };

    const font = document.fonts.load(`700 100px ${FONT}`).catch(() => undefined);
    // A slow font shouldn't hold the site hostage.
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 1500));
    Promise.race([font, timeout]).then(start);

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

  return (
    <div
      className="intro"
      data-split={split ? "" : undefined}
      style={screen ? ({ "--split": `${Math.round(screen.height * 0.49)}px` } as React.CSSProperties) : undefined}
      aria-hidden
    >
      <div className="intro-half intro-half-top">{screen && <Terminal {...screen} />}</div>
      <div className="intro-half intro-half-bottom">{screen && <Terminal {...screen} />}</div>
    </div>
  );
}
