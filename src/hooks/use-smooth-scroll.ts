import { createContext, useContext, useEffect, useState, type RefObject } from "react";
import Lenis from "lenis";

export const LenisContext = createContext<Lenis | null>(null);

/** The Lenis instance driving the content pane, once it exists. */
export const useLenis = () => useContext(LenisContext);

/** Smooths wheel scrolling inside one scroll container. Touch keeps the platform's own
 *  momentum, and Lenis drops the smoothing by itself under reduced motion. */
export const useSmoothScroll = (wrapper: RefObject<HTMLElement>, content: RefObject<HTMLElement>) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (!wrapper.current || !content.current) return;
    const instance = new Lenis({
      wrapper: wrapper.current,
      content: content.current,
      autoRaf: true,
      lerp: 0.09,
      // Lists with their own scrollbar (the playlist) still scroll on their own.
      allowNestedScroll: true,
    });
    setLenis(instance);
    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, [wrapper, content]);

  return lenis;
};
