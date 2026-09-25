import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

// The world is drawn in logical pixels and scaled to the sidebar's width.
const W = 128;
const H = 96;
const T = 8; // tile size
const ROWS = 12;
const GROUND = 10; // top row of the ground

const GRAVITY = 900;
const JUMP = 262;
const RUN = 62;
const ACCEL = 520;
const COYOTE = 0.09; // seconds a jump still counts after running off a ledge
const BUFFER = 0.12; // seconds a jump press is remembered before landing

const BEST_KEY = "sidebar-platformer-best";

type Status = "idle" | "playing" | "paused" | "over";
type Action = "left" | "right" | "jump";

const keyActions: Record<string, Action> = {
  ArrowLeft: "left",
  a: "left",
  A: "left",
  ArrowRight: "right",
  d: "right",
  D: "right",
  ArrowUp: "jump",
  " ": "jump",
  w: "jump",
  W: "jump",
};

interface Body {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
}

interface Walker extends Body {
  squashedAt: number | null;
}

interface World {
  ground: (number | null)[];
  blocks: Set<number>;
  pipes: Set<number>;
  coins: { x: number; y: number; taken: boolean }[];
  walkers: Walker[];
  built: number;
}

interface Game {
  world: World;
  player: Body & { facing: 1 | -1; onGround: boolean; lastGround: number; jumpAt: number };
  cam: number;
  time: number;
  coins: number;
  stomps: number;
}

const key = (c: number, r: number) => c * 16 + r;

const solid = (w: World, c: number, r: number) => {
  if (r < 0 || r >= ROWS) return false;
  const g = w.ground[c];
  if (g != null && r >= g) return true;
  return w.blocks.has(key(c, r)) || w.pipes.has(key(c, r));
};

const rand = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));

const addWalker = (w: World, col: number, row = GROUND) =>
  w.walkers.push({ x: col * T, y: row * T - 6, w: 7, h: 6, vx: -18, vy: 0, squashedAt: null });

const addCoin = (w: World, col: number, row: number) => w.coins.push({ x: col * T + 1.5, y: row * T + 1.5, taken: false });

/** Lays down the next stretch of level. Later stretches have more pits and walkers. */
const addSegment = (w: World) => {
  const c = w.built;
  const flat = (from: number, n: number, row = GROUND) => {
    for (let i = 0; i < n; i++) w.ground[from + i] = row;
  };

  if (c === 0) {
    flat(0, 18);
    w.built = 18;
    return;
  }

  const hard = Math.min(1, c / 320);
  const roll = Math.random();

  if (roll < 0.2 + 0.1 * hard) {
    // Pit
    const n = Math.random() < 0.3 + 0.4 * hard ? 3 : 2;
    for (let i = 0; i < n; i++) w.ground[c + i] = null;
    addCoin(w, c + Math.floor(n / 2), GROUND - 4);
    flat(c + n, 3);
    w.built = c + n + 3;
  } else if (roll < 0.38) {
    // Pipe
    const h = rand(2, 3);
    flat(c, 6);
    for (let i = 1; i <= 2; i++) for (let r = GROUND - h; r < GROUND; r++) w.pipes.add(key(c + i, r));
    if (Math.random() < 0.3 + 0.5 * hard) addWalker(w, c + 5);
    w.built = c + 6;
  } else if (roll < 0.62) {
    // Floating blocks with coins on top
    const len = rand(3, 5);
    const row = rand(6, 7);
    flat(c, len + 3);
    for (let i = 0; i < len; i++) {
      w.blocks.add(key(c + 1 + i, row));
      addCoin(w, c + 1 + i, row - 1);
    }
    if (Math.random() < 0.4 + 0.4 * hard) addWalker(w, c + len + 1);
    w.built = c + len + 3;
  } else if (roll < 0.78) {
    // A low hill to hop up and over
    const n = rand(3, 5);
    flat(c, 1);
    flat(c + 1, n, GROUND - 1);
    flat(c + 1 + n, 2);
    addCoin(w, c + 1 + Math.floor(n / 2), GROUND - 3);
    w.built = c + n + 3;
  } else {
    // Open ground with walkers and a coin arc
    const n = rand(6, 9);
    flat(c, n);
    addWalker(w, c + rand(3, n - 1));
    if (Math.random() < hard) addWalker(w, c + n - 1);
    for (let i = 0; i < 3; i++) addCoin(w, c + 2 + i, GROUND - (i === 1 ? 4 : 3));
    w.built = c + n;
  }
};

const newGame = (): Game => {
  const world: World = { ground: [], blocks: new Set(), pipes: new Set(), coins: [], walkers: [], built: 0 };
  while (world.built < 40) addSegment(world);
  return {
    world,
    player: {
      x: 20,
      y: GROUND * T - 8,
      w: 6,
      h: 8,
      vx: 0,
      vy: 0,
      facing: 1,
      onGround: true,
      lastGround: 0,
      jumpAt: -1,
    },
    cam: 0,
    time: 0,
    coins: 0,
    stomps: 0,
  };
};

/** Moves a body along one axis at a time and stops it against solid tiles. */
const move = (w: World, b: Body, dx: number, dy: number) => {
  let hitX = false;
  let landed = false;
  let bumped = false;

  if (dx) {
    b.x += dx;
    const r0 = Math.floor(b.y / T);
    const r1 = Math.floor((b.y + b.h - 0.01) / T);
    const c = dx > 0 ? Math.floor((b.x + b.w - 0.01) / T) : Math.floor(b.x / T);
    for (let r = r0; r <= r1; r++) {
      if (!solid(w, c, r)) continue;
      b.x = dx > 0 ? c * T - b.w : (c + 1) * T;
      b.vx = 0;
      hitX = true;
      break;
    }
  }

  if (dy) {
    b.y += dy;
    const c0 = Math.floor(b.x / T);
    const c1 = Math.floor((b.x + b.w - 0.01) / T);
    const r = dy > 0 ? Math.floor((b.y + b.h - 0.01) / T) : Math.floor(b.y / T);
    for (let c = c0; c <= c1; c++) {
      if (!solid(w, c, r)) continue;
      if (dy > 0) {
        b.y = r * T - b.h;
        landed = true;
      } else {
        b.y = (r + 1) * T;
        bumped = true;
      }
      b.vy = 0;
      break;
    }
  }

  return { hitX, landed, bumped };
};

const overlaps = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

const scoreOf = (g: Game) => Math.floor(g.player.x / T) + g.coins * 5 + g.stomps * 10;

const readBest = () => {
  try {
    const v = Number(localStorage.getItem(BEST_KEY));
    return Number.isFinite(v) && v > 0 ? v : 0;
  } catch {
    return 0;
  }
};

const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function SidebarPlatformer() {
  const { resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const game = useRef<Game>(newGame());
  const input = useRef({ left: false, right: false, jump: false });
  const colors = useRef<Record<string, string>>({});
  const statusRef = useRef<Status>("idle");

  const [status, setStatusState] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [best, setBest] = useState(readBest);

  const setStatus = (s: Status) => {
    statusRef.current = s;
    setStatusState(s);
  };

  // Everything is drawn in the site's own colours, so the game follows the theme.
  useEffect(() => {
    const fg = token("--foreground");
    colors.current = {
      ground: `hsl(${fg} / 0.14)`,
      groundTop: `hsl(${fg} / 0.32)`,
      block: `hsl(${fg} / 0.22)`,
      blockEdge: `hsl(${fg} / 0.4)`,
      pipe: `hsl(${token("--primary")} / 0.35)`,
      pipeEdge: `hsl(${token("--primary")} / 0.7)`,
      player: `hsl(${token("--primary")})`,
      eye: `hsl(${token("--primary-foreground")})`,
      walker: `hsl(${token("--destructive")})`,
      walkerEye: `hsl(${token("--background")})`,
      coin: "#f5b301",
    };
  }, [resolvedTheme]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const g = game.current;
    const w = g.world;
    const k = colors.current;
    const scale = canvas.width / W;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Snap the camera to whole screen pixels so tiles never shimmer.
    const cam = Math.round(g.cam * scale) / scale;
    ctx.setTransform(scale, 0, 0, scale, -cam * scale, 0);

    const c0 = Math.floor(cam / T) - 1;
    const c1 = c0 + W / T + 2;
    for (let c = c0; c <= c1; c++) {
      const top = w.ground[c];
      if (top != null) {
        ctx.fillStyle = k.ground;
        ctx.fillRect(c * T, top * T, T, H - top * T);
        ctx.fillStyle = k.groundTop;
        ctx.fillRect(c * T, top * T, T, 1);
      }
      for (let r = 0; r < ROWS; r++) {
        if (w.blocks.has(key(c, r))) {
          ctx.fillStyle = k.block;
          ctx.fillRect(c * T, r * T, T, T);
          ctx.fillStyle = k.blockEdge;
          ctx.fillRect(c * T, r * T, T, 1);
          ctx.fillRect(c * T, r * T, 1, T);
        }
        if (w.pipes.has(key(c, r))) {
          const lip = !w.pipes.has(key(c, r - 1));
          ctx.fillStyle = k.pipe;
          ctx.fillRect(c * T, r * T, T, T);
          ctx.fillStyle = k.pipeEdge;
          if (lip) ctx.fillRect(c * T - (w.pipes.has(key(c - 1, r)) ? 0 : 1), r * T, T + 1, 2);
          if (!w.pipes.has(key(c - 1, r))) ctx.fillRect(c * T, r * T, 1, T);
        }
      }
    }

    // Coins bob on a shared clock so a row of them moves together.
    const bob = Math.round(Math.sin(g.time * 5) * 0.8);
    ctx.fillStyle = k.coin;
    for (const coin of w.coins) {
      if (coin.taken || coin.x < cam - T || coin.x > cam + W) continue;
      ctx.fillRect(coin.x + 1, coin.y + bob, 3, 5);
      ctx.fillRect(coin.x, coin.y + 1 + bob, 5, 3);
    }

    for (const e of w.walkers) {
      if (e.x < cam - T || e.x > cam + W) continue;
      ctx.fillStyle = k.walker;
      if (e.squashedAt !== null) {
        ctx.fillRect(e.x, e.y + e.h - 2, e.w, 2);
        continue;
      }
      ctx.fillRect(e.x + 1, e.y, e.w - 2, 1);
      ctx.fillRect(e.x, e.y + 1, e.w, e.h - 2);
      const step = Math.floor(g.time * 8) % 2;
      ctx.fillRect(e.x + (step ? 0 : 1), e.y + e.h - 1, 2, 1);
      ctx.fillRect(e.x + e.w - (step ? 3 : 2), e.y + e.h - 1, 2, 1);
      ctx.fillStyle = k.walkerEye;
      ctx.fillRect(e.x + 1, e.y + 2, 1, 2);
      ctx.fillRect(e.x + e.w - 2, e.y + 2, 1, 2);
    }

    const p = g.player;
    const px = Math.round(p.x);
    const py = Math.round(p.y);
    ctx.fillStyle = k.player;
    ctx.fillRect(px + 1, py, p.w - 2, 1);
    ctx.fillRect(px, py + 1, p.w, p.h - 3);
    // Legs scissor while running, tuck while airborne.
    const running = p.onGround && Math.abs(p.vx) > 5;
    const stride = running ? Math.floor(g.time * 12) % 2 : 0;
    if (!p.onGround) {
      ctx.fillRect(px + 1, py + p.h - 2, p.w - 2, 1);
    } else {
      ctx.fillRect(px + (stride ? 0 : 1), py + p.h - 2, 2, 2);
      ctx.fillRect(px + p.w - (stride ? 3 : 2), py + p.h - 2, 2, 2);
    }
    ctx.fillStyle = k.eye;
    ctx.fillRect(p.facing > 0 ? px + 3 : px + 1, py + 2, 2, 2);
  }, []);

  const endGame = useCallback(() => {
    setStatus("over");
    const final = scoreOf(game.current);
    setScore(final);
    setBest((prev) => {
      if (final <= prev) return prev;
      try {
        localStorage.setItem(BEST_KEY, String(final));
      } catch {
        /* Best score is a nicety; the game works without it. */
      }
      return final;
    });
  }, []);

  const step = useCallback(
    (dt: number) => {
      const g = game.current;
      const w = g.world;
      const p = g.player;
      const i = input.current;
      g.time += dt;

      const dir = (i.right ? 1 : 0) - (i.left ? 1 : 0);
      if (dir) p.facing = dir as 1 | -1;
      const target = dir * RUN;
      const rate = dir ? ACCEL : ACCEL * 1.4;
      p.vx = p.vx < target ? Math.min(target, p.vx + rate * dt) : Math.max(target, p.vx - rate * dt);

      if (g.time - p.jumpAt < BUFFER && g.time - p.lastGround < COYOTE) {
        p.vy = -JUMP;
        p.jumpAt = -1;
        p.lastGround = -1;
      }

      // Letting go of jump early cuts the arc short, so taps hop and holds soar.
      const rising = p.vy < 0;
      p.vy = Math.min(p.vy + GRAVITY * (rising && !i.jump ? 2.6 : 1) * dt, 320);

      move(w, p, p.vx * dt, 0);
      const { landed } = move(w, p, 0, p.vy * dt);
      p.onGround = landed;
      if (landed) p.lastGround = g.time;

      if (p.x < g.cam) {
        p.x = g.cam;
        p.vx = Math.max(0, p.vx);
      }
      g.cam = Math.max(g.cam, p.x - 44);
      while (w.built * T < g.cam + W + T * 24) addSegment(w);

      if (p.y > H + 8) return endGame();

      for (const coin of w.coins) {
        if (!coin.taken && overlaps(p, { x: coin.x, y: coin.y, w: 5, h: 5 })) {
          coin.taken = true;
          g.coins++;
        }
      }

      for (const e of w.walkers) {
        if (e.squashedAt !== null || e.x > g.cam + W + T * 2) continue;
        e.vy = Math.min(e.vy + GRAVITY * dt, 320);
        const heading = e.vx;
        if (move(w, e, heading * dt, 0).hitX) e.vx = -heading;
        move(w, e, 0, e.vy * dt);
        if (!overlaps(p, e)) continue;
        if (p.vy > 0 && p.y + p.h - e.y < 5) {
          e.squashedAt = g.time;
          p.vy = -JUMP * 0.62;
          g.stomps++;
        } else {
          return endGame();
        }
      }

      // Forget whatever has scrolled off behind the camera.
      w.walkers = w.walkers.filter(
        (e) => e.x > g.cam - T * 2 && e.y < H + 8 && (e.squashedAt === null || g.time - e.squashedAt < 0.4)
      );
      w.coins = w.coins.filter((coin) => coin.x > g.cam - T * 2);

      setScore(scoreOf(g));
      setCoins(g.coins);
    },
    [endGame]
  );

  // Fixed-step simulation on the display clock: steady physics at any refresh rate.
  useEffect(() => {
    if (status !== "playing") return;
    let raf = 0;
    let last = performance.now();
    let acc = 0;
    const tick = (now: number) => {
      acc += Math.min((now - last) / 1000, 0.1);
      last = now;
      while (acc >= 1 / 120 && statusRef.current === "playing") {
        step(1 / 120);
        acc -= 1 / 120;
      }
      draw();
      if (statusRef.current === "playing") raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, step, draw]);

  // Keep the backing store at device resolution so the pixel art stays crisp.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientWidth * dpr * (H / W));
      draw();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [draw]);

  useEffect(draw, [resolvedTheme, draw]);

  const start = () => {
    frameRef.current?.focus();
    if (statusRef.current === "over" || statusRef.current === "idle") {
      game.current = newGame();
      setScore(0);
      setCoins(0);
    }
    if (statusRef.current !== "playing") setStatus("playing");
  };

  const pause = () => {
    input.current = { left: false, right: false, jump: false };
    if (statusRef.current === "playing") setStatus("paused");
  };

  // Keys and touch buttons both land here, so they behave identically.
  const press = (action: Action, down: boolean) => {
    const i = input.current;
    if (action === "jump" && down && !i.jump) game.current.player.jumpAt = game.current.time;
    i[action] = down;
    if (down && statusRef.current !== "playing") start();
  };

  const setKey = (e: React.KeyboardEvent, down: boolean) => {
    if (e.key === "Enter") {
      if (down && statusRef.current !== "playing") start();
      return;
    }
    const action = keyActions[e.key];
    if (!action) return;
    // Only while the game has focus do these keys belong to it rather than the page.
    e.preventDefault();
    press(action, down);
  };

  // Hidden tab, closed menu: the run waits rather than playing on unseen.
  useEffect(() => {
    const onHide = () => {
      if (!document.hidden || statusRef.current !== "playing") return;
      input.current = { left: false, right: false, jump: false };
      statusRef.current = "paused";
      setStatusState("paused");
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  // Touch screens get on-screen buttons; mouse and keyboard users never see them.
  const [touch, setTouch] = useState(() => window.matchMedia("(pointer: coarse)").matches);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const onChange = () => setTouch(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const verb = touch ? "Tap" : "Click";
  const overlay =
    status === "idle"
      ? `${verb} to play`
      : status === "paused"
        ? `Paused · ${verb.toLowerCase()} to resume`
        : status === "over"
          ? `Score ${score} · ${verb.toLowerCase()} to retry`
          : null;

  // A held button keeps acting until the finger lifts or slides off it.
  const holdable = (action: Action) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      press(action, true);
    },
    onPointerUp: () => press(action, false),
    onPointerLeave: () => press(action, false),
    onPointerCancel: () => press(action, false),
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
  });

  const pad =
    "flex h-12 select-none items-center justify-center rounded-xl bg-muted text-foreground shadow-[inset_0_1px_0_hsl(var(--foreground)/0.06)] transition-transform duration-100 ease-out [-webkit-touch-callout:none] [touch-action:none] active:scale-95";

  return (
    <section
      ref={sectionRef}
      aria-label="Runner game"
      className="px-1"
      data-no-blobity
      onBlur={(e) => {
        // Moving between the game and its own buttons is not leaving the game.
        if (!sectionRef.current?.contains(e.relatedTarget as Node | null)) pause();
      }}
    >
      <div className="mb-2 flex items-center justify-between px-1.5 text-xs text-muted-foreground tabular-nums">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="h-2 w-2 rounded-[2px] bg-[#f5b301]" />
          {coins}
        </span>
        <span>{String(score).padStart(4, "0")}</span>
        <span>Best {best}</span>
      </div>

      <div
        ref={frameRef}
        tabIndex={0}
        role="application"
        aria-label="Runner game. Arrow keys or A and D to move, Space to jump."
        onClick={start}
        onKeyDown={(e) => setKey(e, true)}
        onKeyUp={(e) => setKey(e, false)}
        className="relative cursor-pointer overflow-hidden rounded-lg border bg-muted/30 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <canvas ref={canvasRef} className="block aspect-[4/3] w-full" />
        {overlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/40 text-xs font-medium text-foreground backdrop-blur-[1px]">
            {overlay}
          </div>
        )}
      </div>

      {touch ? (
        <div className="mt-2 grid grid-cols-[1fr_1fr_1.4fr] gap-2">
          <button type="button" tabIndex={-1} aria-label="Run left" className={pad} {...holdable("left")}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" tabIndex={-1} aria-label="Run right" className={pad} {...holdable("right")}>
            <ChevronRight className="h-5 w-5" />
          </button>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Jump"
            className={cn(pad, "bg-primary font-display text-sm font-semibold text-primary-foreground")}
            {...holdable("jump")}
          >
            Jump
          </button>
        </div>
      ) : (
        <p className="mt-2 px-1.5 text-center text-xs text-muted-foreground">← → to run · Space to jump</p>
      )}
    </section>
  );
}
