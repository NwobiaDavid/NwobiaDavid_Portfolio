import { Moon, Sun, PartyPopper, EarthIcon, Heater } from "lucide-react"

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* Show Sun when theme is light */}
          <Sun
            className={`h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "light"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0"
            }`}
          />
          {/* Show Moon when theme is dark */}
          <Moon
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "dark"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0"
            }`}
          />
          {/* Show PartyPopper when theme is fun */}
          <PartyPopper
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "fun"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0"
            }`}
          />
           {/* Show PartyPopper when theme is fun */}
           <Heater
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "warm"
                ? "rotate-0 scale-100"
                : "rotate-90 scale-0"
            }`}
          />
           {/* Show PartyPopper when theme is earth */}
           <EarthIcon
            className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
              theme === "earth"
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
         <DropdownMenuItem onClick={() => setTheme("warm")}>
          Warm
        </DropdownMenuItem>
         <DropdownMenuItem onClick={() => setTheme("earth")}>
          Earth
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
