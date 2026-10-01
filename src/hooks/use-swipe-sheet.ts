import { useEffect } from "react";
import { useSheet } from "./use-sheet";

// How far a finger has to travel sideways before it counts as a swipe.
const MIN_DISTANCE = 60;

/** Opens the mobile menu on a swipe towards the right, and closes it on one towards the left. */
export function useSwipeSheet() {
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)");
    let start: { x: number; y: number } | null = null;

    const onStart = (e: TouchEvent) => {
      if (!mobile.matches || e.touches.length !== 1) return (start = null);
      // Leave horizontally scrolling things (carousels, code blocks) alone.
      const target = e.target as HTMLElement | null;
      if (target?.closest("[data-no-swipe], canvas, pre, input, textarea")) return (start = null);
      start = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onEnd = (e: TouchEvent) => {
      if (!start) return;
      const dx = e.changedTouches[0].clientX - start.x;
      const dy = e.changedTouches[0].clientY - start.y;
      start = null;
      // Mostly sideways, so scrolling the page never opens the menu.
      if (Math.abs(dx) < MIN_DISTANCE || Math.abs(dx) < Math.abs(dy) * 2) return;
      const { isOpen, setOpen } = useSheet.getState();
      if (dx > 0 && !isOpen) setOpen(true);
      else if (dx < 0 && isOpen) setOpen(false);
    };

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, []);
}
