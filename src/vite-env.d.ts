/// <reference types="vite/client" />

// View Transitions API. Not in this TypeScript version's DOM lib yet.
interface Document {
  startViewTransition?: (update: () => void) => unknown;
}
