import { createContext, useContext, useEffect, useState } from "react"
import { flushSync } from "react-dom"

type Theme = "dark" | "light" | "system" | "fun";
type ResolvedTheme = Exclude<Theme, "system">;

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  /** What is actually on screen once "system" has been resolved. */
  resolvedTheme: ResolvedTheme
  /** `origin` is the viewport point the transition spreads from. */
  setTheme: (theme: Theme, origin?: { x: number; y: number }) => void
}

const darkQuery = "(prefers-color-scheme: dark)"

const systemTheme = (): ResolvedTheme =>
  window.matchMedia(darkQuery).matches ? "dark" : "light"

const resolve = (theme: Theme): ResolvedTheme =>
  theme === "system" ? systemTheme() : theme

const applyTheme = (theme: ResolvedTheme) => {
  const root = window.document.documentElement
  root.classList.remove("light", "dark", "fun")
  root.classList.add(theme)
}

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => resolve(theme))

  useEffect(() => {
    const next = resolve(theme)
    setResolvedTheme(next)
    applyTheme(next)

    if (theme !== "system") return

    // Follow the OS when it flips between light and dark while the page is open.
    const media = window.matchMedia(darkQuery)
    const onChange = () => {
      const current = systemTheme()
      setResolvedTheme(current)
      applyTheme(current)
    }
    media.addEventListener("change", onChange)
    return () => media.removeEventListener("change", onChange)
  }, [theme])

  const value = {
    theme,
    resolvedTheme,
    setTheme: (next: Theme, origin?: { x: number; y: number }) => {
      localStorage.setItem(storageKey, next)

      const commit = () => {
        flushSync(() => setThemeState(next))
        applyTheme(resolve(next))
      }

      // Phones skip the circular reveal: snapshotting a page full of frosted glass
      // stalls their GPU for long enough that the switch looks frozen.
      const skipReveal = window.matchMedia(
        "(prefers-reduced-motion: reduce), (pointer: coarse)"
      ).matches
      if (skipReveal || typeof document.startViewTransition !== "function") {
        commit()
        return
      }

      // The new theme spreads out as a circle from where it was picked
      // (the toggle), growing until it covers the farthest corner.
      const x = origin?.x ?? window.innerWidth / 2
      const y = origin?.y ?? window.innerHeight / 2
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )

      const transition = document.startViewTransition(commit)
      transition.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 650,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        )
      })
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
