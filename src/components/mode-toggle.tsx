import { Check, Moon, Sun, PartyPopper } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const options = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "fun", label: "Fun" },
  { value: "system", label: "System" },
] as const

// The icons swap in place: the outgoing one shrinks, blurs and fades while the
// incoming one settles. Never from scale(0): nothing appears from nothing.
const iconState = (visible: boolean) =>
  cn(
    "absolute h-[1.15rem] w-[1.15rem] transition-[opacity,transform,filter] duration-300 ease-out",
    visible ? "opacity-100 rotate-0 scale-100 blur-0" : "opacity-0 -rotate-45 scale-50 blur-[2px]"
  )

export function ModeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
          <Sun className={iconState(resolvedTheme === "light")} />
          <Moon className={iconState(resolvedTheme === "dark")} />
          <PartyPopper className={iconState(resolvedTheme === "fun")} />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[9rem]">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className="justify-between"
          >
            {option.label}
            {theme === option.value && <Check className="h-3.5 w-3.5 text-muted-foreground" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
