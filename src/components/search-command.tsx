import {
  Folder,
  Wrench,
  Home,
  Gamepad,
  ShieldCheckIcon,
  PackageOpen,
  GraduationCap,
  FileText,
  ArrowRight,
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
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface SearchCommandProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const menuItems = {
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

export const SearchCommand = ({ setOpen }: SearchCommandProps) => {
  const navigate = useNavigate();
  const { close } = useSheet();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleClick = (to: string) => {
    setOpen(false);
    close();
    navigate(to);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.03,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Command className="rounded-lg border shadow-md">
        <CommandInput 
          placeholder="Search pages..." 
          className="h-12 text-base"
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-6 text-center text-sm text-muted-foreground"
            >
              No results found.
            </motion.div>
          </CommandEmpty>

          <CommandGroup heading="Main">
            <AnimatePresence mode="wait">
              {menuItems.main.map((item, index) => (
                <motion.div
                  key={item.value}
                  variants={itemVariants}
                  custom={index}
                  onMouseEnter={() => setHoveredItem(item.value)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <CommandItem
                    value={item.value}
                    onSelect={() => handleClick(item.value)}
                    className="relative group cursor-pointer py-3 px-3 aria-selected:bg-accent"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted group-hover:bg-accent-foreground/10 transition-colors">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{
                          opacity: hoveredItem === item.value ? 1 : 0,
                          x: hoveredItem === item.value ? 0 : -5,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </CommandItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </CommandGroup>

          <CommandSeparator className="my-2" />

          <CommandGroup heading="More">
            <AnimatePresence mode="wait">
              {menuItems.secondary.map((item, index) => (
                <motion.div
                  key={item.value}
                  variants={itemVariants}
                  custom={index + menuItems.main.length}
                  onMouseEnter={() => setHoveredItem(item.value)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <CommandItem
                    value={item.value}
                    onSelect={() => handleClick(item.value)}
                    className="relative group cursor-pointer py-3 px-3 aria-selected:bg-accent"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted group-hover:bg-accent-foreground/10 transition-colors">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {item.description}
                          </span>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{
                          opacity: hoveredItem === item.value ? 1 : 0,
                          x: hoveredItem === item.value ? 0 : -5,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </CommandItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </CommandGroup>

          <CommandSeparator className="my-2" />

          <CommandGroup heading="Quick Actions">
            <motion.div
              variants={itemVariants}
              custom={menuItems.main.length + menuItems.secondary.length}
              onMouseEnter={() => setHoveredItem("resume")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <CommandItem
                value="resume"
                onSelect={() => {
                  setOpen(false);
                  window.open("/files/my-resume-2025.pdf", "_blank");
                }}
                className="relative group cursor-pointer py-3 px-3 aria-selected:bg-accent"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted group-hover:bg-accent-foreground/10 transition-colors">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">Resume</span>
                      <span className="text-xs text-muted-foreground">
                        Download or view PDF
                      </span>
                    </div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{
                      opacity: hoveredItem === "resume" ? 1 : 0,
                      x: hoveredItem === "resume" ? 0 : -5,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                </div>
              </CommandItem>
            </motion.div>
          </CommandGroup>
        </CommandList>
      </Command>
    </motion.div>
  );
};