import {
  Folder,
  Wrench,
  Home,
  Gamepad,
  ShieldCheckIcon,
  PackageOpen,
  GraduationCap,
  FileText,
  CornerDownLeft,
  type LucideIcon,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useSheet } from "@/hooks/use-sheet";

interface SearchCommandProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PaletteItem {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const menuItems: Record<"main" | "secondary", PaletteItem[]> = {
  main: [
    { value: "/", label: "Home", icon: Home, description: "Return to homepage" },
    { value: "experiences", label: "Experiences", icon: PackageOpen, description: "Professional journey" },
    { value: "projects", label: "Projects", icon: Folder, description: "Work & side projects" },
  ],
  secondary: [
    { value: "education", label: "Education", icon: GraduationCap, description: "Academic background" },
    { value: "skills", label: "Skills", icon: Wrench, description: "Technical expertise" },
    { value: "certifications", label: "Certifications", icon: ShieldCheckIcon, description: "Professional credentials" },
    { value: "hobby", label: "Hobby", icon: Gamepad, description: "Personal interests" },
  ],
};

// The palette is summoned from the keyboard and used in bursts, so nothing in it
// animates. The row highlight follows the selection, which the keyboard drives too.
const itemClass =
  "group relative cursor-pointer gap-3 rounded-lg px-2.5 py-2";

const Row = ({ label, description, icon: Icon }: Omit<PaletteItem, "value">) => (
  <>
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground group-aria-selected:text-foreground">
      <Icon className="!h-4 !w-4" strokeWidth={1.75} />
    </span>
    <span className="flex min-w-0 flex-1 flex-col">
      <span className="font-medium">{label}</span>
      <span className="truncate text-xs text-muted-foreground">{description}</span>
    </span>
    <CornerDownLeft
      aria-hidden
      className="!h-3.5 !w-3.5 text-muted-foreground opacity-0 group-aria-selected:opacity-100"
    />
  </>
);

export const SearchCommand = ({ setOpen }: SearchCommandProps) => {
  const navigate = useNavigate();
  const { close } = useSheet();

  const handleClick = (to: string) => {
    setOpen(false);
    close();
    navigate(to);
  };

  return (
    <Command className="rounded-xl [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground">
      <CommandInput placeholder="Search pages..." className="h-12 text-base" />
      <CommandList className="max-h-[min(420px,60vh)] p-1.5">
        <CommandEmpty className="py-10 text-center text-sm text-muted-foreground">
          No pages match that search.
        </CommandEmpty>

        <CommandGroup heading="Main">
          {menuItems.main.map(({ value, ...item }) => (
            <CommandItem key={value} value={item.label} onSelect={() => handleClick(value)} className={itemClass}>
              <Row {...item} />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="More">
          {menuItems.secondary.map(({ value, ...item }) => (
            <CommandItem key={value} value={item.label} onSelect={() => handleClick(value)} className={itemClass}>
              <Row {...item} />
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Quick actions">
          <CommandItem
            value="Resume"
            onSelect={() => {
              setOpen(false);
              window.open("/files/David_Nwobia_Resume_main.pdf", "_blank");
            }}
            className={itemClass}
          >
            <Row label="Resume" icon={FileText} description="Download or view PDF" />
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
