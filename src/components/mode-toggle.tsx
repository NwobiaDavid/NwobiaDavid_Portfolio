import { Moon, Sun, PartyPopper } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  // Determine the resolved theme (what's actually displayed)
  const getResolvedTheme = () => {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return theme
  }

  const resolvedTheme = getResolvedTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* Show Sun when resolved theme is light */}
          <Sun
            className={`h-[1.2rem] w-[1.2rem] transition-all ${
              resolvedTheme === "light"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0"
            }`}
          />
          {/* Show Moon when resolved theme is dark */}
          <Moon
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              resolvedTheme === "dark"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0"
            }`}
          />
          {/* Show PartyPopper when theme is fun */}
          <PartyPopper
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              resolvedTheme === "fun"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0"
            }`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("fun")}>
          Fun
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}