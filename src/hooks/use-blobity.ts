import { useEffect } from "react";

// Lightweight hook to initialise Blobity once on the client.
// Blobity itself should be installed separately: `npm install blobity --legacy-peer-deps`.

export const useBlobityCursor = () => {
  useEffect(() => {
    // Guard against SSR / non-browser environments
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    let blobityInstance: any | null = null;

    const init = async () => {
      try {
        // Dynamically import so the app still builds if Blobity isn't installed yet.
        const mod = await import("blobity");
        const Blobity = (mod as any).default ?? (mod as any);

        blobityInstance = new Blobity({
          // General feel
          size: 40,
          radius: 20,
          opacity: 0.2,
          dotSize: 4,
          magnetic: true,

          // Colors – keep in sync with your accent color
          color: "#22c55e", // Tailwind green-500
          dotColor: "#22c55e",

          // Only react strongly to elements you explicitly mark
          focusableElements: "[data-blobity], button, a",
        });
      } catch (error) {
        // If Blobity isn't installed or fails to load, fail silently.
        console.error("Blobity failed to initialise", error);
      }
    };

    void init();

    return () => {
      if (blobityInstance && typeof blobityInstance.destroy === "function") {
        blobityInstance.destroy();
      }
      blobityInstance = null;
    };
  }, []);
};

