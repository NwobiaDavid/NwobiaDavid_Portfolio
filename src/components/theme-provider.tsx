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
  setTheme: (theme: Theme) => void
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
    setTheme: (next: Theme) => {
      localStorage.setItem(storageKey, next)

      const commit = () => {
        flushSync(() => setThemeState(next))
        applyTheme(resolve(next))
      }

      // Crossfade the whole page between themes instead of an abrupt brightness jump.
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (!reduceMotion && typeof document.startViewTransition === "function") {
        document.startViewTransition(commit)
      } else {
        commit()
      }
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
