import { type ISourceOptions } from "@tsparticles/engine";

// A quiet field of drifting squares behind the hero. Few, slow and faint enough to
// read as texture, not as something competing with the headline. Under reduced
// motion the field is still: no drift, no twinkle, no cursor reactions.
const makeParticles = (color: string, reduceMotion: boolean): ISourceOptions => ({
  fpsLimit: 60,
  detectRetina: true,
  pauseOnOutsideViewport: true,
  particles: {
    number: {
      value: 26,
      density: {
        enable: true,
      },
    },
    color: {
      value: color,
    },
    shape: {
      type: "square",
    },
    opacity: {
      value: {
        min: 0.15,
        max: 0.6,
      },
      animation: {
        enable: !reduceMotion,
        speed: 0.4,
        sync: false,
      },
    },
    size: {
      value: {
        min: 2,
        max: 4,
      },
    },
    move: {
      enable: !reduceMotion,
      speed: {
        min: 0.05,
        max: 0.35,
      },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: !reduceMotion,
        mode: "bubble",
      },
      onClick: {
        enable: !reduceMotion,
        mode: "repulse",
      },
    },
    modes: {
      bubble: {
        distance: 160,
        size: 0,
        duration: 2,
        opacity: 0,
      },
      repulse: {
        distance: 220,
        duration: 0.6,
      },
    },
  },
  style: {
    position: "absolute",
    top: "0",
    bottom: "0",
    left: "0",
    right: "0",
  },
  background: {
    color: "transparent",
  },
});

export const particleOptionsFor = (theme: "light" | "dark" | "fun", reduceMotion: boolean) =>
  makeParticles(theme === "light" ? "#9a9577" : theme === "fun" ? "#d1d1d6" : "#e8e2d9", reduceMotion);
