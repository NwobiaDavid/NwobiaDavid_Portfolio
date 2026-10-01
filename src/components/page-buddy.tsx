import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// Clawd, Claude's pixel mascot, living in the content pane. The top edges of the
// page's headings, cards, images and buttons are its platforms: it runs along
// them and leaps between them, keeps up as the reader scrolls, and drops into
// each new page from behind the top bar. With a mouse it is curious about the
// cursor, runs from it up close, and gets knocked flying by a fast swipe. When it
// settles somewhere it finds something to do: reading, coding, a coffee, music.

// The sprite is a GW x GH grid of cells, each S css pixels square. Clawd itself is
// drawn in an 18 x 16 frame at (FX, FY); the margin around it holds props and effects.
const S = 3;
const GW = 30;
const GH = 24;
const FX = 6;
const FY = 8;
const BOX_W = GW * S;
const BOX_H = GH * S;
const HALF = 18; // half the body's width: how far it can stand from an edge
const BODY = 30; // feet to the top of the head
const CENTER = 15; // feet to the middle of the body

const STEP = 1 / 120;
const GRAVITY = 2400;
const RUN = 170;
const ACCEL = 1100;
const MAX_FALL = 1800;
const FLEE = 110; // the cursor is too close inside this radius
const SWIPE = 900; // cursor speed that knocks it over

const PLATFORMS = [
  "h1",
  "h2",
  "h3",
  "h4",
  "p",
  "li",
  "a",
  "img",
  "video",
  "button",
  "[role=tab]",
  ".rounded-md",
  ".rounded-lg",
  ".rounded-xl",
  ".rounded-2xl",
  ".rounded-3xl",
  ".rounded-full",
  "[data-platform]",
].join(",");

/** The top edge of something to stand on, in the scroll pane's content coordinates.
 *  The "floor" is the bottom edge of the screen, so there is always somewhere to stand. */
interface Platform {
  el: Element | "floor";
  x1: number;
  x2: number;
  y: number;
}

type Activity = "read" | "code" | "coffee" | "music" | "think" | "wave";

const DURATION: Record<Activity, [number, number]> = {
  read: [6, 10],
  code: [6, 11],
  coffee: [5, 8],
  music: [6, 10],
  think: [4.6, 5.4],
  wave: [1.6, 2.2],
};

/** Some pages make some pastimes likelier: coding among the projects, reading the certificates. */
const pastimes = (path: string): Activity[] => {
  const all: Activity[] = ["read", "code", "coffee", "music", "think"];
  const bias: Activity[] =
    path.startsWith("/projects") || path.startsWith("/skills")
      ? ["code", "code", "code"]
      : path.startsWith("/education") || path.startsWith("/certifications")
        ? ["read", "read", "read"]
        : path.startsWith("/hobby")
          ? ["music", "music", "music"]
          : path.startsWith("/experiences")
            ? ["code", "coffee", "coffee"]
            : [];
  return [...all, ...bias];
};

interface Buddy {
  x: number; // centre of the feet
  y: number; // bottom of the feet
  vx: number;
  vy: number;
  ground: Platform | null;
  leftFrom: Platform["el"] | null;
  aim: Platform["el"] | null; // when set, the only platform it may land on
  goal: { x: number; leap?: Platform["el"]; tx?: number } | null;
  pace: number;
  facing: 1 | -1;
  lookX: number;
  lookY: number;
  asleep: boolean;
  near: boolean;
  nextThink: number;
  lastActive: number;
  nextBlink: number;
  landedAt: number;
  jumpedAt: number;
  spinAt: number;
  spinDir: 1 | -1;
  startledAt: number;
  hitAt: number;
  activity: Activity | null;
  activityAt: number;
  activityUntil: number;
  wavedAt: number;
}

interface Cursor {
  x: number;
  y: number;
  vx: number;
  speed: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const between = (min: number, max: number) => min + Math.random() * (max - min);
const approach = (v: number, target: number, by: number) =>
  v < target ? Math.min(target, v + by) : Math.max(target, v - by);

const minBy = <T,>(items: T[], score: (item: T) => number) =>
  items.reduce((best, item) => (score(item) < score(best) ? item : best));

/** Distance from point p to the segment a-b: did a fast cursor pass through it? */
const segmentDistance = (px: number, py: number, ax: number, ay: number, bx: number, by: number) => {
  const dx = bx - ax;
  const dy = by - ay;
  const len = dx * dx + dy * dy;
  const t = len ? clamp(((px - ax) * dx + (py - ay) * dy) / len, 0, 1) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

const newBuddy = (): Buddy => ({
  x: 0,
  y: 0,
  vx: 0,
  vy: 0,
  ground: null,
  leftFrom: null,
  aim: null,
  goal: null,
  pace: 1,
  facing: 1,
  lookX: 1,
  lookY: 0,
  asleep: false,
  near: false,
  nextThink: 0,
  lastActive: 0,
  nextBlink: 0,
  landedAt: -9,
  jumpedAt: -9,
  spinAt: -9,
  spinDir: 1,
  startledAt: -9,
  hitAt: -9,
  activity: null,
  activityAt: -9,
  activityUntil: -9,
  wavedAt: -99,
});

const begin = (b: Buddy, activity: Activity, now: number) => {
  const [min, max] = DURATION[activity];
  b.activity = activity;
  b.activityAt = now;
  b.activityUntil = now + between(min, max);
  b.goal = null;
  b.lastActive = now;
  b.nextThink = b.activityUntil;
  if (activity === "wave") b.wavedAt = now;
};

/** Leaves the ground with the given velocity. */
const hop = (b: Buddy, now: number, vx: number, vy: number, spin = false) => {
  b.leftFrom = b.ground?.el ?? null;
  b.aim = null;
  b.ground = null;
  b.goal = null;
  b.asleep = false;
  b.activity = null;
  b.vx = vx;
  b.vy = vy;
  b.jumpedAt = now;
  if (vx) b.facing = vx > 0 ? 1 : -1;
  if (spin) {
    b.spinAt = now;
    b.spinDir = b.facing;
  }
};

/** Jumps on an arc that comes down onto platform p at tx. */
const leap = (b: Buddy, p: Platform, tx: number, now: number) => {
  const dx = tx - b.x;
  const dy = p.y - b.y;
  const reach = Math.hypot(dx, dy);
  let t = clamp(0.36 + reach / 1600, 0.36, 0.95);
  // Going up, the arc has to peak above the platform and land falling onto it.
  if (dy < 0) t = Math.max(t, Math.sqrt((-2 * dy) / GRAVITY) + 0.14);
  let vy = (dy - 0.5 * GRAVITY * t * t) / t;
  // Going down, still hop first rather than just stepping off.
  if (vy > -320) {
    vy = -320;
    t = (-vy + Math.sqrt(vy * vy + 2 * GRAVITY * dy)) / GRAVITY;
  }
  hop(b, now, dx / t, vy, reach > 380 || Math.random() < 0.12);
};

/** Finds everything worth standing on in the current page. */
const collectPlatforms = (root: HTMLElement): Platform[] => {
  const box = root.getBoundingClientRect();
  const ox = root.scrollLeft - box.left;
  const oy = root.scrollTop - box.top;
  const width = root.clientWidth;
  const main = root.querySelector("main");
  const bottom = main ? main.getBoundingClientRect().bottom + oy : root.scrollHeight;
  const list: Platform[] = [{ el: "floor", x1: HALF, x2: width - HALF, y: root.scrollTop + root.clientHeight }];
  if (!main) return list;

  const range = document.createRange();
  for (const el of main.querySelectorAll(PLATFORMS)) {
    if (list.length > 300) break;
    if (el.closest("[data-no-buddy]")) continue;
    let { left, right, top } = el.getBoundingClientRect();
    const { height } = el.getBoundingClientRect();
    if (right - left < 36 || height < 14) continue;

    // A block of text is as wide as its column; stand on its first line of words instead.
    if (/^(H[1-4]|P|LI)$/.test(el.tagName)) {
      range.selectNodeContents(el);
      const lines = Array.from(range.getClientRects()).filter((r) => r.width > 0);
      if (lines.length) {
        top = Math.min(...lines.map((r) => r.top));
        const first = lines.filter((r) => r.top - top < 4);
        left = Math.min(...first.map((r) => r.left));
        right = Math.max(...first.map((r) => r.right));
      }
    }

    const y = top + oy;
    const x1 = Math.max(left + ox + 4, HALF);
    const x2 = Math.min(right + ox - 4, width - HALF);
    if (x2 - x1 < 24 || y < 0 || y > bottom - 2) continue;
    list.push({ el, x1, x2, y });
  }
  return list;
};

const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

const readColors = () => ({
  body: "#d97757",
  eye: "#1f1e1d",
  glyph: `hsl(${token("--foreground")})`,
});

const CODE_COLORS = ["#7aa2f7", "#9ece6a", "#e0af68", "#bb9af7"];

/** Draws one frame of Clawd in grid cells, feet on the bottom row of its frame. The
 *  proportions follow the block-character Clawd from the Claude Code welcome screen. */
const paint = (ctx: CanvasRenderingContext2D, b: Buddy, now: number, k: ReturnType<typeof readColors>) => {
  ctx.setTransform(ctx.canvas.width / GW, 0, 0, ctx.canvas.height / GH, 0, 0);
  ctx.clearRect(0, 0, GW, GH);
  ctx.translate(FX, FY);
  ctx.globalAlpha = 1;
  const cell = (c: number, r: number, w = 1, h = 1) => ctx.fillRect(c, r, w, h);
  const fill = (color: string) => (ctx.fillStyle = color);

  const act = b.ground ? b.activity : null;
  const t = now - b.activityAt;
  const air = !b.ground;
  const running = !air && Math.abs(b.vx) > 20;
  const stride = running ? Math.floor(now * 11) % 2 : 0;
  const beat = Math.floor(now * 4) % 2;
  const sitting = b.asleep || act === "code";
  const oy = sitting ? 2 : act === "music" ? beat : stride;

  // What the eyes are doing: following the cursor by default, busy otherwise.
  let ex = b.lookX > 0.35 ? 1 : b.lookX < -0.35 ? -1 : 0;
  let ey = b.lookY > 0.5 ? 1 : b.lookY < -0.5 ? -1 : 0;
  let closed = b.asleep || (now > b.nextBlink && now < b.nextBlink + 0.12);
  const flipping = act === "read" && t % 3 > 2.7;
  const sipping = act === "coffee" && t % 3.5 > 2.6;
  const idea = act === "think" && t > 3.2;
  if (act === "read") [ex, ey] = [flipping ? 1 : [-1, 0, 1][Math.floor(t * 2) % 3], 1];
  if (act === "code") [ex, ey] = [0, 0];
  if (act === "coffee") [ex, ey, closed] = [sipping ? 0 : 1, 0, sipping || closed];
  if (act === "music") closed = true;
  if (act === "think") [ex, ey] = idea ? [0, -1] : [1, -1];

  fill(k.body);
  cell(3, 6 + oy, 12, 8);

  // Arms: busy with whatever it is doing, otherwise flung up in the air,
  // swinging on the run, or at its sides. Reading and coding draw theirs over the props.
  if (act === "coffee") {
    cell(1, 10, 2, 2);
    cell(sipping ? 14 : 15, sipping ? 9 : 10, 2, 2);
  } else if (act === "think") {
    cell(1, 10, 2, 2);
    cell(idea ? 15 : 14, idea ? 6 : 10, 2, 2);
  } else if (act === "wave") {
    cell(1, 10, 2, 2);
    if (Math.floor(now * 7) % 2) cell(15, 5, 2, 3);
    else cell(16, 4, 2, 3);
  } else if (act === "read" || act === "code") {
    // Drawn with the props.
  } else if (air) {
    const flail = b.vy < 0 ? 0 : Math.floor(now * 14) % 2;
    cell(1, 8 + flail, 2, 2);
    cell(15, 9 - flail, 2, 2);
  } else if (running) {
    cell(1, 9 + stride + oy, 2, 2);
    cell(15, 10 - stride + oy, 2, 2);
  } else {
    cell(1, 10 + oy, 2, 2);
    cell(15, 10 + oy, 2, 2);
  }

  // Four little legs: alternating pairs on the run, tapping to music, tucked in the air.
  if (!sitting) {
    [4, 6, 11, 13].forEach((c, i) => {
      const lifted = air || (running && i % 2 === stride) || (act === "music" && i === 3 && beat === 1);
      cell(c, 14, 1, lifted ? 1 : 2);
    });
  }

  fill(k.eye);
  if (closed) {
    cell(5 + ex, 9 + oy);
    cell(12 + ex, 9 + oy);
  } else {
    cell(5 + ex, 8 + ey + oy, 1, 2);
    cell(12 + ex, 8 + ey + oy, 1, 2);
  }

  // Props, in front of the body.
  if (act === "read") {
    fill("#fbfaf7");
    cell(3, 10, 12, 6);
    fill("#d5cdbf");
    cell(3, 10, 12, 1);
    fill("#b8b0a2");
    cell(5, 12, 8, 1);
    cell(5, 14, 6, 1);
    if (flipping) {
      // A page lifting as it turns.
      fill("#fbfaf7");
      cell(9, 8, 5, 4);
      fill("#d5cdbf");
      cell(9, 8, 5, 1);
    }
    fill(k.body);
    cell(2, 12, 2, 2);
    cell(14, 12, 2, 2);
  }

  if (act === "code") {
    const tap = Math.floor(now * 10) % 2;
    fill("#c4c8ce");
    cell(4, 11, 10, 4);
    fill("#e3e6ea");
    cell(4, 11, 10, 1);
    fill("#d97757");
    cell(8, 13, 2, 1);
    fill("#9097a1");
    cell(2, 15, 14, 1);
    fill(k.body);
    cell(2, 12 + tap, 2, 2);
    cell(14, 13 - tap, 2, 2);

    // Lines of code drift up out of the laptop and fade.
    for (let i = 0; i < 3; i++) {
      const phase = (t * 0.7 + i / 3) % 1;
      const cycle = Math.floor(t * 0.7 + i / 3);
      ctx.globalAlpha = 1 - phase;
      fill(CODE_COLORS[(cycle + i) % CODE_COLORS.length]);
      cell(6 + ((cycle + i) % 3), Math.round(7 - phase * 12), 3 + ((cycle * 7 + i * 3) % 4), 1);
    }
    ctx.globalAlpha = 1;
    // Every so often it all compiles.
    if (t % 6 > 5.2) {
      fill("#9ece6a");
      cell(15, 2);
      cell(16, 3);
      cell(17, 2);
      cell(18, 1);
    }
  }

  if (act === "coffee") {
    const [mx, my] = sipping ? [11, 9] : [16, 8];
    fill("#f2f0ec");
    cell(mx, my, 3, 4);
    cell(mx + 3, my + 1, 1, 2);
    fill("#6b4226");
    cell(mx, my, 3, 1);
    if (!sipping) {
      // Steam curling up from the cup.
      const curl = Math.floor(now * 3) % 2;
      ctx.globalAlpha = 0.55;
      fill(k.glyph);
      cell(mx + curl, my - 2);
      cell(mx + 1 - curl, my - 4);
      cell(mx + curl + 1, my - 6);
      ctx.globalAlpha = 1;
    }
  }

  if (act === "music") {
    fill("#5b5f66");
    cell(4, 4 + oy, 10, 1);
    cell(3, 5 + oy);
    cell(14, 5 + oy);
    cell(2, 6 + oy, 2, 4);
    cell(14, 6 + oy, 2, 4);
    fill("#d97757");
    cell(2, 7 + oy, 1, 2);
    cell(15, 7 + oy, 1, 2);

    // Notes rising off the headphones.
    fill(k.glyph);
    for (let i = 0; i < 2; i++) {
      const phase = (t * 0.6 + i / 2) % 1;
      const c = i ? -3 : 18;
      const r = Math.round(5 - phase * 10);
      ctx.globalAlpha = 1 - phase;
      cell(c + 1, r, 1, 3);
      cell(c, r + 2);
      cell(c + 2, r);
    }
    ctx.globalAlpha = 1;
  }

  if (act === "think") {
    // Bubbles lead up to a cloud that fills with dots, then an idea.
    fill(k.glyph);
    ctx.globalAlpha = 0.6;
    cell(15, 4);
    cell(16, 1, 2, 2);
    ctx.globalAlpha = 1;
    fill("#fbfaf7");
    cell(15, -6, 8, 6);
    fill(k.glyph);
    ctx.globalAlpha = 0.6;
    cell(16, -6, 6, 1);
    cell(16, -1, 6, 1);
    cell(15, -5, 1, 4);
    cell(22, -5, 1, 4);
    ctx.globalAlpha = 1;
    if (idea) {
      fill("#f5c542");
      cell(18, -5, 2, 2);
      cell(17, -4, 4, 1);
      fill("#9097a1");
      cell(18, -3, 2, 1);
    } else {
      fill("#6b6b6b");
      for (let i = 0; i < Math.floor(t * 1.2) % 4; i++) cell(16 + i * 2, -3);
    }
  }

  fill(k.glyph);
  if (now - b.startledAt < 0.7) {
    cell(16, 0, 1, 3);
    cell(16, 4);
  }
  if (b.asleep) {
    const r = 2 - (Math.floor(now * 1.5) % 3);
    cell(14, r, 3, 1);
    cell(15, r + 1);
    cell(14, r + 2, 3, 1);
  }
};

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(media.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);
  return reduced;
};

interface PageBuddyProps {
  scrollRoot: React.RefObject<HTMLDivElement>;
}

export function PageBuddy({ scrollRoot }: PageBuddyProps) {
  const { pathname } = useLocation();
  const reduced = useReducedMotion();
  const spriteRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buddy = useRef<Buddy>(newBuddy());
  const platforms = useRef<Platform[]>([]);
  const path = useRef(pathname);
  path.current = pathname;

  // Every new page, it drops in from behind the top bar wherever it last stood.
  useEffect(() => {
    const root = scrollRoot.current;
    if (!root) return;
    const b = buddy.current;
    const now = performance.now() / 1000;
    platforms.current = platforms.current.slice(0, 1);
    if (!b.x) b.x = root.clientWidth * 0.7;
    b.x = clamp(b.x, HALF, root.clientWidth - HALF);
    b.y = 0;
    hop(b, now, 0, 0);
    b.nextThink = now + 1;
    b.lastActive = now;
  }, [pathname, scrollRoot]);

  useEffect(() => {
    const root = scrollRoot.current;
    const sprite = spriteRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (reduced || !root || !sprite || !canvas || !ctx) return;

    let colors = readColors();
    let box = root.getBoundingClientRect();
    const pointer = { cx: 0, cy: 0, vx: 0, vy: 0, t: 0, active: false };

    // Rebuilt often, because pages animate in, images load and layouts shift.
    const refresh = () => {
      box = root.getBoundingClientRect();
      const list = collectPlatforms(root);
      platforms.current = list;
      const b = buddy.current;
      if (!b.ground) return;
      const same = list.find((p) => p.el === b.ground?.el);
      if (same) {
        b.ground = same;
        b.y = same.y;
      } else {
        // Whatever it stood on is gone.
        b.leftFrom = b.ground.el;
        b.ground = null;
        b.vy = 0;
      }
    };

    const sizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(BOX_W * dpr);
      canvas.height = Math.round(BOX_H * dpr);
    };

    const view = () => {
      const bar = root.querySelector("header")?.offsetHeight ?? 56;
      return { top: root.scrollTop + bar, bottom: root.scrollTop + root.clientHeight };
    };

    const readCursor = (now: number): Cursor | null => {
      if (!pointer.active) return null;
      if (pointer.cx < box.left || pointer.cx > box.right || pointer.cy < box.top || pointer.cy > box.bottom) return null;
      const moving = now - pointer.t < 0.07;
      return {
        x: pointer.cx - box.left + root.scrollLeft,
        y: pointer.cy - box.top + root.scrollTop,
        vx: moving ? pointer.vx : 0,
        speed: moving ? Math.hypot(pointer.vx, pointer.vy) : 0,
      };
    };

    const find = (el: Platform["el"]) => platforms.current.find((p) => p.el === el);

    /** Decides what to do next while standing still or strolling. */
    const think = (now: number, cursor: Cursor | null) => {
      const b = buddy.current;
      const g = b.ground;
      if (!g) return;
      const { top, bottom } = view();
      const visible = (p: Platform) => p.y > top + BODY + 8 && p.y <= bottom + 1;
      const options = platforms.current.filter((p) => p.el !== g.el && visible(p));

      // Scrolled out of sight: catch up with the reader.
      if (!visible(g)) {
        b.nextThink = now + 0.6;
        if (!options.length) return;
        const best = minBy(options, (p) => Math.abs(p.y - b.y) + Math.abs(clamp(b.x, p.x1, p.x2) - b.x));
        const tx = clamp(b.x, best.x1 + 8, best.x2 - 8);
        if (Math.abs(best.y - b.y) > root.clientHeight * 1.3) {
          // Too far to jump: fall in from the top of the screen instead.
          b.x = tx;
          b.y = root.scrollTop;
          hop(b, now, 0, 0);
          b.aim = best.el;
        } else {
          leap(b, best, tx, now);
          b.aim = best.el;
        }
        return;
      }

      if (b.asleep) {
        b.nextThink = now + 1;
        return;
      }
      if (b.activity) {
        // Finished whatever it was doing.
        b.activity = null;
        b.lastActive = now;
        b.nextThink = now + between(0.5, 1.5);
        return;
      }
      if (now - b.lastActive > 16) {
        b.asleep = true;
        b.goal = null;
        return;
      }

      // A cursor hovering at a polite distance gets a wave now and then.
      if (cursor && now - b.wavedAt > 12 && Math.random() < 0.4) {
        const d = Math.hypot(cursor.x - b.x, cursor.y - (b.y - CENTER));
        if (d > FLEE + 40 && d < 450) {
          begin(b, "wave", now);
          return;
        }
      }

      const roll = Math.random();
      if (roll < 0.22) {
        b.goal = null;
        b.nextThink = now + between(1, 3);
        return;
      }
      if (roll < 0.5) {
        const choices = pastimes(path.current);
        begin(b, choices[Math.floor(Math.random() * choices.length)], now);
        return;
      }

      b.lastActive = now;
      const reachable = options.filter(
        (p) => Math.abs(p.y - b.y) < 420 && Math.abs(clamp(b.x, p.x1, p.x2) - b.x) < 650
      );
      if (roll < 0.72 || !reachable.length) {
        b.goal = { x: between(g.x1, g.x2) };
        b.pace = between(0.55, 1);
        b.nextThink = now + between(1.5, 3.5);
        return;
      }

      // Curious: often heads for somewhere near the cursor, though not too near.
      let pick: Platform;
      let tx: number;
      if (cursor && Math.random() < 0.6) {
        const spot = (p: Platform) => clamp(cursor.x, p.x1 + 6, p.x2 - 6);
        pick = minBy(reachable, (p) => Math.abs(Math.hypot(spot(p) - cursor.x, p.y - CENTER - cursor.y) - 180));
        tx = spot(pick);
      } else {
        pick = reachable[Math.floor(Math.random() * reachable.length)];
        tx = between(pick.x1 + 6, pick.x2 - 6);
      }
      b.goal = { x: clamp(tx, g.x1 + 4, g.x2 - 4), leap: pick.el, tx };
      b.pace = 1;
      b.nextThink = now + between(2, 4);
    };

    /** Runs away from a cursor that comes too close, jumping clear at the edge. */
    const flee = (now: number, cursor: Cursor) => {
      const b = buddy.current;
      const g = b.ground;
      if (!g) return;
      const dir = b.x >= cursor.x ? 1 : -1;
      const room = dir > 0 ? g.x2 - b.x : b.x - g.x1;
      if (room > 36) {
        b.goal = { x: b.x + dir * Math.min(room, 150) };
        b.pace = 1.7;
        return;
      }
      if (now - b.jumpedAt < 0.7) return;

      const { top, bottom } = view();
      const escapes = platforms.current
        .filter((p) => p.el !== g.el && p.y > top + BODY && p.y <= bottom + 1 && Math.abs(p.y - b.y) < 360)
        .map((p) => {
          const tx = clamp(b.x + dir * 80, p.x1 + 6, p.x2 - 6);
          return { p, tx, away: Math.hypot(tx - cursor.x, p.y - CENTER - cursor.y) };
        })
        .filter((e) => Math.abs(e.tx - b.x) < 520 && e.away > FLEE + 40);
      if (escapes.length) {
        const best = minBy(escapes, (e) => -e.away);
        leap(b, best.p, best.tx, now);
      } else {
        // Cornered: vault right over the cursor.
        hop(b, now, -dir * 300, -760, true);
      }
    };

    const react = (now: number, cursor: Cursor | null, prev: Cursor | null) => {
      const b = buddy.current;
      if (!cursor) {
        b.near = false;
        return;
      }
      const bx = b.x;
      const by = b.y - CENTER;
      const d = Math.hypot(bx - cursor.x, by - cursor.y);
      const swept = prev ? segmentDistance(bx, by, prev.x, prev.y, cursor.x, cursor.y) : d;

      if (swept < 30 && cursor.speed > SWIPE && now - b.hitAt > 0.5) {
        b.hitAt = now;
        b.startledAt = now;
        b.lastActive = now;
        hop(b, now, clamp(cursor.vx * 0.6, -900, 900), -clamp(300 + cursor.speed * 0.25, 450, 1000), true);
        return;
      }

      if (d < FLEE) {
        // Too close: whatever it was doing, it drops it.
        if (!b.near && (now - b.startledAt > 2 || b.activity)) b.startledAt = now;
        b.near = true;
        b.activity = null;
        b.lastActive = now;
        if (b.asleep) hop(b, now, 0, -560);
        else flee(now, cursor);
      } else if (d > FLEE + 30) {
        b.near = false;
      }
    };

    const step = (dt: number, now: number) => {
      const b = buddy.current;
      const g = b.ground;
      const list = platforms.current;
      const floorY = root.scrollTop + root.clientHeight;
      if (list[0]) list[0].y = floorY;

      if (g) {
        let target = 0;
        if (b.goal) {
          const gx = clamp(b.goal.x, g.x1, g.x2);
          const diff = gx - b.x;
          if (Math.abs(diff) < 4) {
            const goal = b.goal;
            b.goal = null;
            const to = goal.leap !== undefined ? find(goal.leap) : undefined;
            if (to && goal.tx !== undefined) {
              leap(b, to, goal.tx, now);
              return;
            }
          } else {
            // Ease into the stopping point rather than sliding past it.
            target = Math.sign(diff) * Math.min(RUN * b.pace, Math.sqrt(2 * ACCEL * Math.abs(diff)));
          }
        }
        b.vx = approach(b.vx, target, (target ? ACCEL : ACCEL * 1.5) * dt);
        b.x += b.vx * dt;
        b.y = g.y;
        if (Math.abs(b.vx) > 5) b.facing = b.vx > 0 ? 1 : -1;
        if (b.x < g.x1 - 2 || b.x > g.x2 + 2) {
          b.leftFrom = g.el;
          b.ground = null;
          b.vy = 0;
        }
        return;
      }

      const prevY = b.y;
      b.vy = Math.min(b.vy + GRAVITY * dt, MAX_FALL);
      b.x += b.vx * dt;
      b.y += b.vy * dt;

      const width = root.clientWidth;
      if (b.x < HALF) {
        b.x = HALF;
        b.vx = Math.abs(b.vx) * 0.4;
      } else if (b.x > width - HALF) {
        b.x = width - HALF;
        b.vx = -Math.abs(b.vx) * 0.4;
      }

      // Platforms are one-way: passed through going up, landed on coming down.
      let landing: Platform | null = null;
      if (b.vy > 0) {
        for (const p of list) {
          if (p.el === "floor" || (b.aim && p.el !== b.aim)) continue;
          if (b.x < p.x1 || b.x > p.x2 || prevY > p.y + 0.5 || b.y < p.y) continue;
          if (p.el === b.leftFrom && now - b.jumpedAt < 0.2) continue;
          if (!landing || p.y < landing.y) landing = p;
        }
      }
      if (!landing && list[0] && b.y >= floorY) landing = list[0];
      if (!landing) return;

      b.ground = landing;
      b.aim = null;
      b.y = landing.y;
      b.vy = 0;
      b.vx *= 0.3;
      b.landedAt = now;
      b.spinAt = -9;
      b.goal = null;
      b.nextThink = Math.max(b.nextThink, now + between(0.3, 1.2));
    };

    const render = (now: number, cursor: Cursor | null) => {
      const b = buddy.current;
      if (now > b.nextBlink + 0.12) b.nextBlink = now + between(2.5, 5);

      if (cursor) {
        const dx = cursor.x - b.x;
        const dy = cursor.y - (b.y - BODY + 9);
        const len = Math.hypot(dx, dy) || 1;
        b.lookX = dx / len;
        b.lookY = dy / len;
        if (b.ground && Math.abs(b.vx) < 10) b.facing = dx >= 0 ? 1 : -1;
      } else {
        b.lookX = b.facing;
        b.lookY = !b.ground && b.vy > 0 ? 1 : 0;
      }

      // Squash on landing, stretch on take-off, a flip on the big jumps.
      let sx = 1;
      let sy = 1;
      const landing = (now - b.landedAt) / 0.16;
      const launch = (now - b.jumpedAt) / 0.18;
      if (b.ground && landing < 1) {
        sy = 1 - 0.22 * (1 - landing);
        sx = 1 + 0.18 * (1 - landing);
      } else if (!b.ground && launch < 1) {
        sy = 1 + 0.15 * (1 - launch);
        sx = 1 - 0.1 * (1 - launch);
      }
      const spin = (now - b.spinAt) / 0.55;
      const rot = spin < 1 ? b.spinDir * 360 * (1 - (1 - spin) ** 3) : 0;

      sprite.style.transform =
        `translate3d(${b.x - BOX_W / 2}px, ${b.y - BOX_H}px, 0) ` +
        `translateY(${-CENTER}px) rotate(${rot}deg) translateY(${CENTER}px) scale(${sx}, ${sy})`;
      paint(ctx, b, now, colors);
    };

    let raf = 0;
    let last = performance.now();
    let acc = 0;
    let prev: Cursor | null = null;
    const frame = (ms: number) => {
      const now = ms / 1000;
      acc += Math.min((ms - last) / 1000, 0.1);
      last = ms;

      const cursor = readCursor(now);
      react(now, cursor, prev);
      prev = cursor;

      // It thinks when idle, or straight away once scrolled out of sight.
      const b = buddy.current;
      if (b.ground) {
        const { top, bottom } = view();
        const hidden = b.ground.y < top + BODY + 8 || b.ground.y > bottom + 1;
        if (hidden ? now - b.landedAt > 0.25 : now >= b.nextThink && !b.goal) think(now, cursor);
      }

      while (acc >= STEP) {
        step(STEP, now);
        acc -= STEP;
      }
      render(now, cursor);
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const t = performance.now() / 1000;
      const dt = t - pointer.t;
      if (pointer.active && dt > 0 && dt < 0.1) {
        pointer.vx = pointer.vx * 0.4 + ((e.clientX - pointer.cx) / dt) * 0.6;
        pointer.vy = pointer.vy * 0.4 + ((e.clientY - pointer.cy) / dt) * 0.6;
      } else {
        pointer.vx = 0;
        pointer.vy = 0;
      }
      pointer.cx = e.clientX;
      pointer.cy = e.clientY;
      pointer.t = t;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    // A click or tap on it makes it jump. It never swallows the click itself.
    const onDown = (e: PointerEvent) => {
      const b = buddy.current;
      const x = e.clientX - box.left + root.scrollLeft;
      const y = e.clientY - box.top + root.scrollTop;
      if (Math.abs(x - b.x) > HALF + 6 || y < b.y - BODY - 6 || y > b.y + 4) return;
      const now = performance.now() / 1000;
      b.startledAt = now;
      b.lastActive = now;
      hop(b, now, between(-120, 120), -780, true);
    };

    const onTheme = new MutationObserver(() => {
      colors = readColors();
    });
    onTheme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resize = new ResizeObserver(refresh);
    resize.observe(root);
    const timer = window.setInterval(refresh, 250);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);

    sizeCanvas();
    refresh();
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(timer);
      resize.disconnect();
      onTheme.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced, scrollRoot]);

  if (reduced) return null;

  return (
    <div
      ref={spriteRef}
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-20 print:hidden"
      style={{ width: BOX_W, height: BOX_H, transform: "translate3d(-200px, -200px, 0)", transformOrigin: "50% 100%" }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
