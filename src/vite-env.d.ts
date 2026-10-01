/// <reference types="vite/client" />

// View Transitions API. Not in this TypeScript version's DOM lib yet.
interface ViewTransition {
  ready: Promise<void>;
  finished: Promise<void>;
}

interface Document {
  startViewTransition?: (update: () => void) => ViewTransition;
}
