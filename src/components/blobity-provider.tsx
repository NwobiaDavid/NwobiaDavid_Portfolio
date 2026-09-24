import { ReactNode, useEffect } from "react";
import Blobity from "blobity";
import { blobityConfig } from "@/constants/cursor";

// The blob cursor only makes sense with a precise pointer that can hover. On touch
// screens it has nothing to follow, and under reduced motion its constant easing
// is exactly the kind of movement the visitor asked to avoid.
const cursorQuery = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const BlobProviders = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const media = window.matchMedia(cursorQuery);
    let instance: Blobity | null = null;

    const sync = () => {
      if (media.matches && !instance) {
        instance = new Blobity(blobityConfig);
        // Exposed for debugging and playing around in the console.
        (window as unknown as { blobity?: Blobity }).blobity = instance;
      } else if (!media.matches && instance) {
        instance.destroy();
        instance = null;
      }
    };

    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      instance?.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default BlobProviders;
