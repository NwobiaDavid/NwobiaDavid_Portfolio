import { useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { RotateCcw } from "lucide-react";

// The portrait as a physical card: a slab with an edge you can see as it turns. It
// leans toward the pointer, sways on its own when left alone, catches light across
// its face, and flips over to an ID-card back.

const TILT_X = 12; // degrees, pointer at the top or bottom edge
const TILT_Y = 14; // degrees, pointer at the left or right edge
const THICKNESS = 8; // px between the faces
const EDGE_LAYERS = 7;

const tilt = { stiffness: 150, damping: 18, mass: 0.6 };
// A flip has weight: it overshoots a touch and settles back.
const flipSpring = { stiffness: 80, damping: 13, mass: 1 };

export function HeroCard() {
  const frameRef = useRef<HTMLButtonElement>(null);
  const hovering = useRef(false);
  const [flipped, setFlipped] = useState(false);
  const reduced = useReducedMotion() ?? false;
  const inView = useInView(frameRef);

  // Lean, from the pointer or the idle sway; springs carry it between the two.
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, tilt);
  const sry = useSpring(ry, tilt);
  const flip = useSpring(0, flipSpring);

  // Once flipped, the back faces the reader, so the same lean turns the other way.
  const rotateY = useTransform([sry, flip], ([lean, f]: number[]) => f + lean * Math.cos((f * Math.PI) / 180));
  // The card lifts off the table as it turns over, and lands again.
  const lift = useTransform(flip, (f) => 1 + 0.08 * Math.abs(Math.sin((f * Math.PI) / 180)));

  // Light comes from above the screen: the glare slides opposite to the lean.
  const gx = useTransform(sry, (v) => 50 - v * 3.5);
  const gy = useTransform(srx, (v) => 50 + v * 3.5);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.42), rgb(255 255 255 / 0) 58%)`;

  // The shadow on the page falls away from the raised side.
  const shadowX = useTransform(sry, (v) => -v * 1.4);
  const shadowY = useTransform(srx, (v) => 22 + v * 1.2);
  const shadowScale = useTransform(lift, (s) => 1 / s);

  useAnimationFrame((t) => {
    if (hovering.current || reduced || !inView) return;
    rx.set(Math.sin(t / 2600) * 5);
    ry.set(Math.sin(t / 3400 + 1) * 8);
  });

  const point = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    hovering.current = true;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    rx.set(-ny * TILT_X);
    ry.set(nx * TILT_Y);
  };

  const toggle = () => {
    const next = !flipped;
    setFlipped(next);
    if (reduced) flip.jump(next ? 180 : 0);
    else flip.set(next ? 180 : 0);
  };

  return (
    <button
      ref={frameRef}
      type="button"
      onClick={toggle}
      onPointerMove={point}
      onPointerLeave={() => {
        hovering.current = false;
      }}
      aria-pressed={flipped}
      aria-label={flipped ? "Show photo" : "Flip card for details"}
      // Blobity reads its tooltip once per hover, so it stays the same on both sides.
      data-blobity-tooltip="Flip card"
      data-blobity-invert="false"
      className="hero-portrait relative block w-40 rounded-2xl sm:w-52 md:w-64 lg:w-72 [perspective:900px]"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 bottom-0 h-8 rounded-[50%] bg-foreground/25 blur-xl"
        style={{ x: shadowX, y: shadowY, scale: shadowScale }}
      />

      <motion.span
        data-no-buddy
        className="relative block aspect-square [transform-style:preserve-3d]"
        style={{ rotateX: srx, rotateY, scale: lift }}
      >
        {/* The edge: thin layers between the faces, seen only as the card turns. */}
        {Array.from({ length: EDGE_LAYERS }, (_, i) => (
          <span
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-2xl bg-foreground/80"
            style={{ transform: `translateZ(${-THICKNESS / 2 + ((i + 1) * THICKNESS) / (EDGE_LAYERS + 1)}px)` }}
          />
        ))}

        {/* Front */}
        <span
          className="absolute inset-0 overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10 [backface-visibility:hidden]"
          style={{ transform: `translateZ(${THICKNESS / 2}px)` }}
          aria-hidden={flipped}
        >
          <img
            src="/images/pfpmain-comp.jpg"
            alt="David Nwobia"
            width={576}
            height={576}
            decoding="async"
            draggable={false}
            className="h-full w-full object-cover"
          />
          <motion.span aria-hidden className="absolute inset-0 mix-blend-soft-light" style={{ background: glare }} />
        </span>

        {/* Floats off the face, so the depth shows whichever way it leans. */}
        <span
          aria-hidden
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/85 px-2.5 py-1 font-display text-[11px] font-semibold text-foreground shadow-lg ring-1 ring-foreground/10 backdrop-blur-sm [backface-visibility:hidden] md:bottom-4 md:right-4 md:text-xs"
          style={{ transform: `translateZ(${THICKNESS / 2 + 40}px)` }}
        >
          <RotateCcw className="h-3 w-3" />
          Flip
        </span>

        {/* Back */}
        <span
          className="hero-card-back absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl bg-primary p-[8%] text-left text-primary-foreground [backface-visibility:hidden] [container-type:inline-size]"
          style={{ transform: `rotateY(180deg) translateZ(${THICKNESS / 2}px)` }}
          aria-hidden={!flipped}
        >
          <span className="flex items-start justify-between">
            <span className="font-display text-[14cqw] font-extrabold leading-none tracking-[-0.04em]">DN</span>
            <span className="text-right text-[max(9px,4cqw)] uppercase leading-snug tracking-[0.1em] opacity-70">
              Software
              <br />
              Engineer
            </span>
          </span>
          <span>
            <span className="block font-display text-[9.5cqw] font-bold leading-[1.05] tracking-[-0.03em]">
              David
              <br />
              Nwobia
            </span>
            <span className="hero-card-facts mt-[5%] block border-t border-primary-foreground/20 pt-[5%] text-[4.4cqw] leading-relaxed opacity-80">
              Industrial Physics, Covenant University
              <br />
              Five years of building things that work
            </span>
          </span>
        </span>
      </motion.span>
    </button>
  );
}
