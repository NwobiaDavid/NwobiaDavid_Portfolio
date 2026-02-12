import { type ISourceOptions } from "@tsparticles/engine";

export const particleOptionsDark: ISourceOptions = {
  name: "NASA",
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
      },
    },
    color: {
      value: "#F5F5F5",
    },
    shape: {
      type: "square",
    },
    opacity: {
      value: {
        min: 0.1,
        max: 1,
      },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    size: {
      value: {
        min: 3,
        max: 6,
      },
    },
    move: {
      enable: true,
      speed: {
        min: 0.1,
        max: 1,
      },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "bubble",
      },
      onClick: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      grab: {
        distance: 400,
        links: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 250,
        size: 0,
        duration: 2,
        opacity: 0,
      },
      repulse: {
        distance: 400,
        duration: 0.4,
      },
      push: {
        quantity: 4,
      },
      remove: {
        quantity: 2,
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
};

export const particleOptionsLight: ISourceOptions = {
  name: "NASA",
  particles: {
    number: {
      value: 50,
      density: {
        enable: true,
      },
    },
    color: {
      value: "#D3D3D3",
    },
    shape: {
      type: "square",
    },
    opacity: {
      value: {
        min: 0.1,
        max: 1,
      },
      animation: {
        enable: true,
        speed: 1,
        sync: false,
      },
    },
    size: {
      value: {
        min: 3,
        max: 6,
      },
    },
    move: {
      enable: true,
      speed: {
        min: 0.1,
        max: 1,
      },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: "bubble",
      },
      onClick: {
        enable: true,
        mode: "repulse",
      },
    },
    modes: {
      grab: {
        distance: 400,
        links: {
          opacity: 1,
        },
      },
      bubble: {
        distance: 250,
        size: 0,
        duration: 2,
        opacity: 0,
      },
      repulse: {
        distance: 400,
        duration: 0.4,
      },
      push: {
        quantity: 4,
      },
      remove: {
        quantity: 2,
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
};
