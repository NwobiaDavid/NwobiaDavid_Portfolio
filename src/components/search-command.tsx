import {
  Folder,
  Wrench,
  Home,
  Gamepad,
  ShieldCheckIcon,
  PackageOpen,
} from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useSheet } from "@/hooks/use-sheet";

interface SearchCommandProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SearchCommand = ({ setOpen }: SearchCommandProps) => {
  const navigate = useNavigate();
  const { close } = useSheet();

  const handleClick = (to: string) => {
    setOpen(false);
    close();
    navigate(to);
  };

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem value="experiences" onSelect={(value) => handleClick(value)}>
            <PackageOpen className="mr-2 h-4 w-4" />
            <span>experiences</span>
          </CommandItem>
          <CommandItem value="projects" onSelect={(value) => handleClick(value)}>
            <Folder className="mr-2 h-4 w-4" />
            <span>projects</span>
          </CommandItem>
          <CommandItem value="skills" onSelect={(value) => handleClick(value)}>
            <Wrench className="mr-2 h-4 w-4" />
            <span>skills</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Other">
          <CommandItem value="/" onSelect={(value) => handleClick(value)}>
            <Home className="mr-2 h-4 w-4" />
            <span>home</span>
          </CommandItem>
          <CommandItem value="hobby" onSelect={(value) => handleClick(value)}>
            <Gamepad className="mr-2 h-4 w-4" />
            <span>hobby</span>
          </CommandItem>
          <CommandItem value="certifications" onSelect={(value) => handleClick(value)}>
            <ShieldCheckIcon className="mr-2 h-4 w-4" />
            <span>certifications</span>
          </CommandItem>
          {/* <CommandItem
            onSelect={() => {
              setOpen(false);
              close();
            }}
          >
            <Globe className="mr-2 h-4 w-4" />
            <span>network</span>
          </CommandItem> */}
        </CommandGroup>
      </CommandList>
    </Command>
  );
};
