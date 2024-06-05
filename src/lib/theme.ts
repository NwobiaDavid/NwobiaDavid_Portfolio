/**
 * Checks if the user's system has a dark color scheme.
 * @returns {boolean} True if the system has a dark color scheme, false otherwise.
 */
export const isDarkSystem = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;