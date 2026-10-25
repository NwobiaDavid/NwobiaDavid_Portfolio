import { useEffect, useLayoutEffect, useMemo, useRef, type ComponentType } from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import type { VirtualScrollData } from "lenis";
import { sections, sectionIndex, type SectionPath } from "@/constants/sections";
import { useLenis } from "@/hooks/use-smooth-scroll";
import Home from "@/pages/home";
import Experiences from "@/pages/experiences";
import Projects from "@/pages/projects";
import Education from "@/pages/education";
import Skills from "@/pages/skills";
import Certifications from "@/pages/certifications";
import Publications from "@/pages/publications";

const pages: Record<SectionPath, ComponentType> = {
  "/": Home,
  "/experiences": Experiences,
  "/projects": Projects,
  "/education": Education,
  "/skills": Skills,
  "/certifications": Certifications,
  "/publications": Publications,
};

/** A resting place for the scroll: a section's top, or the bottom of one taller than the screen. */
interface Point {
  y: number;
  index: number;
  end: boolean;
}

// Kept when a case study replaces the stack, so going back lands where the reader left off.
let saved: { path: string; y: number } | null = null;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** How far down the scroll pane's content an element starts. */
const offsetWithin = (el: HTMLElement, root: HTMLElement) => {
  let y = 0;
  for (let node: Element | null = el; node && node !== root; node = (node as HTMLElement).offsetParent) {
    y += (node as HTMLElement).offsetTop;
  }
  return y;
};

// A snap leaves at full pull and decelerates hard into place, like a magnet catching:
// an exponential curve covers most of the distance in the first tenth of the time.
const magnet = (t: number) => (1 - 2 ** (-9 * t)) / (1 - 2 ** -9);

// The site's --ease-in-out, for longer trips started from the sidebar or a link.
const travel = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

/** The top-level pages stacked into one scroll. Each keeps its URL: the address follows
 *  whichever section is on screen, and visiting a section's URL glides to it. Each wheel
 *  gesture, key press or swipe jumps a whole section; only a section taller than the
 *  screen scrolls within itself, and it stops dead at its edges before the next jump. */
export default function SectionStack() {
  const { pathname, key } = useLocation();
  const navigate = useNavigate();
  // React Router hands out a new navigate for each route, and every section is its own
  // route; a ref keeps the scroll controller from restarting mid-gesture.
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;
  const navigationType = useNavigationType();
  const lenis = useLenis();
  const reduced = useReducedMotion() ?? false;
  const stackRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLElement[]>([]);
  const current = Math.max(0, sectionIndex(pathname));

  // The path the URL holds, updated the moment the scroll rewrites it.
  const urlPath = useRef(pathname);
  urlPath.current = pathname;
  // The last path the scroll wrote, so the URL effect knows not to glide to it.
  const spied = useRef<string | null>(null);
  const glideRef = useRef<((index: number) => void) | null>(null);
  const firstRun = useRef(true);

  // Every page renders once; a URL change re-renders the stack, not its pages.
  const content = useMemo(
    () =>
      sections.map(({ path }, i) => {
        const Page = pages[path];
        return (
          <section
            key={path}
            ref={(el) => {
              if (el) sectionRefs.current[i] = el;
            }}
            className="snap-section flex min-h-[var(--section-h)] flex-col"
          >
            <Page />
          </section>
        );
      }),
    []
  );

  // Before the first paint: size the sections to the screen and open on the URL's section,
  // or where the reader was when they went back from a case study.
  useLayoutEffect(() => {
    const stack = stackRef.current;
    const root = stack?.closest<HTMLElement>("[data-scroll-root]");
    if (!stack || !root) return;
    const els = sectionRefs.current;

    const fit = () => stack.style.setProperty("--section-h", `${root.clientHeight - offsetWithin(stack, root)}px`);
    fit();
    const resize = new ResizeObserver(fit);
    resize.observe(root);

    const start = sectionIndex(urlPath.current);
    const restore = navigationType === "POP" && saved?.path === urlPath.current ? saved.y : els[start]?.offsetTop ?? 0;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(restore, { immediate: true, force: true });
    } else {
      root.scrollTop = restore;
    }
    if (els[start]) els[start].dataset.seen = "";

    // Each section's entrance plays when the reader first reaches it, not offscreen on load.
    const seen = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ isIntersecting, target }) => {
          if (isIntersecting) (target as HTMLElement).dataset.seen = "";
        });
      },
      { root, rootMargin: "0px 0px -25% 0px" }
    );
    els.forEach((el) => seen.observe(el));

    let y = root.scrollTop;
    const track = () => {
      y = root.scrollTop;
    };
    root.addEventListener("scroll", track, { passive: true });

    return () => {
      resize.disconnect();
      seen.disconnect();
      root.removeEventListener("scroll", track);
      saved = { path: urlPath.current, y };
    };
    // Runs once: later URL changes glide instead of jumping.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    document.title = sections[current].title;
  }, [current]);

  useEffect(() => {
    const stack = stackRef.current;
    // Under reduced motion Lenis jumps instead of animating, so leave scrolling free.
    if (!lenis || !stack || reduced) return;
    const root = lenis.rootElement;
    const els = sectionRefs.current;

    const view = () => root.clientHeight - offsetWithin(stack, root); // the screen below the top bar
    // Each section's resting edges. A section taller than the screen has two, and reads
    // freely between them; any other section has one.
    const ranges = () => {
      const screen = view();
      const limit = lenis.limit;
      return els.map((el) => {
        const start = Math.min(el.offsetTop, limit);
        const extra = el.offsetHeight - screen;
        return { start, end: extra > 8 ? Math.min(el.offsetTop + extra, limit) : start };
      });
    };
    const sectionAt = (list: ReturnType<typeof ranges>, y: number) => {
      let index = 0;
      list.forEach((r, i) => {
        if (r.start <= y + 1) index = i;
      });
      return index;
    };

    let glide: number | null = null; // the section an animated scroll is headed for
    let rest: Point | null = null;
    {
      const list = ranges();
      const index = list.findIndex((r) => Math.abs(r.start - lenis.scroll) < 1);
      if (index >= 0) rest = { y: list[index].start, index, end: false };
    }
    // After a jump, or after running into a section's edge, the rest of that flick is spent.
    // Only a new gesture moves on.
    let armed = true;
    let lastWheel = 0;
    let lastAbs = 0;
    let lastSign = 0;
    let held = false;
    let focusedAt = 0;
    let dir = 0;
    let lastY = lenis.scroll;
    let timer = 0;
    const touch = { active: false, moved: false, axis: "" as "" | "x" | "y", from: 0, atStart: false, atEnd: false, v: 0, t: 0 };

    // The URL follows whichever section holds the middle of the screen.
    const spy = () => {
      const probe = lenis.scroll + view() / 2;
      let index = 0;
      els.forEach((el, i) => {
        if (el.offsetTop <= probe) index = i;
      });
      const { path } = sections[index];
      if (path === urlPath.current) return;
      urlPath.current = path;
      spied.current = path;
      // Replace, not push: scrolling is reading, and Back should undo navigation.
      navigateRef.current(path, { replace: true });
    };

    const glideTo = (point: Point, duration: number, easing: (t: number) => number) => {
      armed = false;
      if (Math.abs(point.y - lenis.scroll) < 1) {
        rest = point;
        return;
      }
      glide = point.index;
      rest = null;
      // Locked: nothing the reader does mid-flight can leave the page between sections.
      lenis.scrollTo(point.y, {
        duration,
        easing,
        lock: true,
        force: true,
        onComplete: () => {
          glide = null;
          rest = point;
          spy();
        },
      });
    };

    const snapTo = (index: number, end: boolean) => {
      const r = ranges()[index];
      const y = end ? r.end : r.start;
      const dist = Math.min(1, Math.abs(y - lenis.scroll) / view());
      glideTo({ y, index, end }, 0.4 + 0.2 * dist, magnet);
    };

    /** One push of the wheel or a key: scroll within a tall section, otherwise jump. */
    const step = (dy: number) => {
      const list = ranges();
      const y = lenis.targetScroll;
      const i = sectionAt(list, y);
      const { start, end } = list[i];
      if (end > start && (dy > 0 ? y < end - 1 : y > start + 1)) {
        const to = clamp(y + dy, start, end);
        lenis.scrollTo(to, { programmatic: false, lerp: lenis.options.lerp });
        // Ran into the edge: stop dead there instead of spilling into the next section.
        if (to === start || to === end) armed = false;
        return;
      }
      if (dy > 0) {
        if (i + 1 < list.length) snapTo(i + 1, false);
      } else if (y > start + 1) snapTo(i, false);
      else if (i > 0) snapTo(i - 1, true);
    };

    // Nested scroll areas keep the wheel while they can still move.
    const nested = (event: Event, dy: number) => {
      for (const node of event.composedPath()) {
        if (node === root) return false;
        if (!(node instanceof HTMLElement)) continue;
        if (node.hasAttribute("data-lenis-prevent")) return true;
        const { overflowY } = getComputedStyle(node);
        if ((overflowY === "auto" || overflowY === "scroll") && node.scrollHeight - node.clientHeight > 1) {
          if (dy > 0 ? node.scrollTop + node.clientHeight < node.scrollHeight - 1 : node.scrollTop > 0) return true;
        }
      }
      return false;
    };

    /** A finger lifted: jump on if it pulled far or fast enough, otherwise snap back. */
    const release = () => {
      const list = ranges();
      const i = touch.from;
      const { start, end } = list[i];
      const y = lenis.scroll;
      const v = performance.now() - touch.t > 80 ? 0 : touch.v; // a finger that rested first has no flick
      // From the edge a short pull or a flick jumps. A drag that ran into the edge from
      // inside a tall section stops there, unless it pulled well past it.
      const far = view() * 0.2;
      if (y > end + 0.5) {
        const onward = touch.atEnd ? y - end > 28 || v > 0.25 : y - end > far;
        if (onward && i + 1 < list.length) snapTo(i + 1, false);
        else snapTo(i, true);
      } else if (y < start - 0.5) {
        const onward = touch.atStart ? start - y > 28 || v < -0.25 : start - y > far;
        if (onward && i > 0) snapTo(i - 1, true);
        else snapTo(i, false);
      } else if (end > start) {
        // Inside a tall section: coast, stopping at its edges.
        lenis.scrollTo(clamp(y + v * 280, start, end), { programmatic: false, lerp: 0.075 });
      }
    };

    const gesture = ({ deltaX, deltaY, event }: VirtualScrollData) => {
      const now = performance.now();

      if (event.type === "wheel") {
        if (event.ctrlKey) return true; // pinch zoom
        if (nested(event, deltaY)) return false; // the browser scrolls it
        if (event.cancelable) event.preventDefault();
        // A trackpad's inertia keeps sending ever smaller deltas. A new gesture reverses,
        // speeds up, or follows a pause. Timed by when the input happened, not when it
        // reached us, so a busy frame cannot pass a tail off as a new gesture.
        const abs = Math.abs(deltaY);
        const sign = Math.sign(deltaY);
        const gap = event.timeStamp - lastWheel;
        const fresh = sign !== lastSign || abs > lastAbs * 1.5 + 4 || (gap > 300 && abs > lastAbs) || gap > 600;
        lastWheel = event.timeStamp;
        lastAbs = abs;
        lastSign = sign;
        if (glide !== null || !deltaY) return false;
        if (!armed && !fresh) return false;
        armed = true;
        step(deltaY);
        return false;
      }

      // Touch: the page follows the finger, then lands on an edge when it lets go.
      if (event.type === "touchstart") {
        const list = ranges();
        const y = lenis.targetScroll;
        const from = sectionAt(list, y);
        Object.assign(touch, {
          active: true,
          moved: false,
          axis: "",
          from,
          atStart: Math.abs(y - list[from].start) <= 1,
          atEnd: Math.abs(y - list[from].end) <= 1,
          v: 0,
          t: now,
        });
        return false;
      }
      if (event.type === "touchmove") {
        if (!touch.axis) touch.axis = Math.abs(deltaX) > Math.abs(deltaY) ? "x" : "y";
        // Sideways swipes belong to carousels and the menu.
        if (touch.axis === "x") return false;
        if (nested(event, deltaY)) return false;
        if (event.cancelable) event.preventDefault();
        if (glide !== null) return false;
        const { start, end } = ranges()[touch.from];
        const y = lenis.targetScroll;
        // Dragging past the section's edge meets resistance, so it takes intent to leave.
        const outside = (deltaY > 0 && y + deltaY > end) || (deltaY < 0 && y + deltaY < start);
        lenis.scrollTo(y + (outside ? deltaY * 0.45 : deltaY), { immediate: true, force: true });
        const dt = now - touch.t;
        if (dt > 0) touch.v = touch.v * 0.3 + (deltaY / dt) * 0.7;
        touch.t = now;
        touch.moved = true;
        return false;
      }
      if (event.type === "touchend") {
        const wasDrag = touch.active && touch.moved && touch.axis === "y";
        touch.active = false;
        if (wasDrag && glide === null) release();
        return false;
      }
      return true;
    };
    lenis.options.virtualScroll = gesture;

    // Keys step like the wheel does.
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement;
      if (target.closest("input, textarea, select, [contenteditable], [role=tablist], [role=slider], [role=menu], [role=listbox]")) return;
      if (document.querySelector("[role=dialog], [role=alertdialog]")) return;
      if (e.key === " " && target.closest("button, a, [role=button]")) return;
      const page = view() * 0.85;
      const keys: Record<string, number> = {
        ArrowDown: 100,
        ArrowUp: -100,
        PageDown: page,
        PageUp: -page,
        " ": e.shiftKey ? -page : page,
      };
      if (e.key !== "Home" && e.key !== "End" && !(e.key in keys)) return;
      e.preventDefault();
      if (glide !== null) return;
      if (e.key === "Home") snapTo(0, false);
      else if (e.key === "End") snapTo(els.length - 1, true);
      else step(keys[e.key]);
    };
    window.addEventListener("keydown", onKey);

    // Anything else that scrolls natively (the scrollbar, a focused control, find in
    // page) is pulled onto the nearest edge once it stops.
    const settle = () => {
      if (held || touch.active || glide !== null) return;
      // Tabbing scrolled a control into view; snapping could carry it back off screen.
      if (performance.now() - focusedAt < 600) return;
      const list = ranges();
      const y = lenis.scroll;
      const i = sectionAt(list, y);
      const { end } = list[i];
      if (y <= end + 0.5) return; // on an edge, or reading inside a tall section
      if (i + 1 >= list.length) return;
      const onward = dir > 0 ? y - end > 24 : list[i + 1].start - y < 24;
      snapTo(onward ? i + 1 : i, !onward);
    };
    const schedule = (ms: number) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, ms);
    };

    const offScroll = lenis.on("scroll", () => {
      const y = lenis.scroll;
      if (y !== lastY && glide === null) dir = Math.sign(y - lastY);
      lastY = y;
      if (glide !== null) return;
      spy();
      if (lenis.isScrolling === "native") schedule(150);
      if (rest && Math.abs(rest.y - y) > 1) rest = null;
    });

    // Lenis does not report a cancelled touch.
    const touchCancel = () => {
      const wasDrag = touch.active && touch.moved && touch.axis === "y";
      touch.active = false;
      if (wasDrag && glide === null) release();
    };
    const focusIn = () => {
      focusedAt = performance.now();
    };
    // Dragging the scrollbar: wait for the release.
    const pointerDown = (e: PointerEvent) => {
      if (e.target === root) held = true;
    };
    const pointerUp = () => {
      if (!held) return;
      held = false;
      schedule(150);
    };
    root.addEventListener("touchcancel", touchCancel, { passive: true });
    root.addEventListener("focusin", focusIn);
    root.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointerup", pointerUp);
    window.addEventListener("pointercancel", pointerUp);

    // Content that grows (images loading) or a resized window should not leave the
    // reader stranded between sections while they are resting on one.
    const realign = new ResizeObserver(() => {
      if (!rest || glide !== null) return;
      const r = ranges()[rest.index];
      const y = rest.end ? r.end : r.start;
      if (Math.abs(y - lenis.scroll) <= 1) return;
      lenis.resize();
      lenis.scrollTo(y, { immediate: true, force: true });
      rest = { ...rest, y };
    });
    realign.observe(stack);
    realign.observe(root);

    glideRef.current = (index) => {
      const y = ranges()[index].start;
      const dist = Math.abs(y - lenis.scroll) / view();
      glideTo({ y, index, end: false }, clamp(0.5 + 0.3 * Math.sqrt(dist), 0.5, 1.1), travel);
    };

    return () => {
      window.clearTimeout(timer);
      lenis.options.virtualScroll = undefined;
      offScroll();
      window.removeEventListener("keydown", onKey);
      root.removeEventListener("touchcancel", touchCancel);
      root.removeEventListener("focusin", focusIn);
      root.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
      window.removeEventListener("pointercancel", pointerUp);
      realign.disconnect();
      glideRef.current = null;
    };
  }, [lenis, reduced]);

  // A link, the sidebar or Back/Forward named a section: glide there. Keyed on the
  // navigation, not just the path, so clicking the section you are in returns to its top.
  useEffect(() => {
    const fromScroll = spied.current === pathname;
    spied.current = null;
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (fromScroll) return;
    const index = sectionIndex(pathname);
    if (index >= 0) glideRef.current?.(index);
  }, [pathname, key]);

  return (
    <div ref={stackRef} className="relative flex flex-col">
      {content}
    </div>
  );
}
