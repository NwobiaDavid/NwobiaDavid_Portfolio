import { Link, useLocation } from "react-router-dom";
import { LayoutGroup, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSheet } from "@/hooks/use-sheet";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Folder,
  Home,
  Search,
  Wrench,
  GraduationCap,
  ShieldCheck,
  Contact,
  PackageOpen,
  type LucideIcon,
} from "lucide-react";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SearchCommand } from "../search-command";
import { useEffect, useState } from "react";
import IconGithub from "../svg/github-svg";
import IconLinkedin from "../svg/linkedin-svg";
import IconGmail from "../svg/gmail-svg";
import { useDrawer } from "@/hooks/use-drawer";
import { ResumeViewer } from "../resume-viewer";
import { SidebarPlatformer } from "./sidebar-platformer";

interface MainSidebarProps {
  isMobile?: boolean;
}

interface NavEntry {
  to: string;
  label: string;
  icon: LucideIcon;
}

// Grouped by proximity rather than divider lines: the work first, the record second.
const navGroups: NavEntry[][] = [
  [
    { to: "/", label: "Home", icon: Home },
    { to: "/experiences", label: "Experiences", icon: PackageOpen },
    { to: "/projects", label: "Projects", icon: Folder },
  ],
  [
    { to: "/education", label: "Education", icon: GraduationCap },
    { to: "/skills", label: "Skills", icon: Wrench },
    { to: "/certifications", label: "Certifications", icon: ShieldCheck },
  ],
];

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

// Shared by nav links and the action rows below them so every row lines up.
const sidebarRow =
  "relative flex h-9 w-full items-center gap-3 rounded-lg px-2.5 font-display text-[0.9rem] font-medium transition-[color,transform] duration-150 ease-out active:scale-[0.98]";

const isActive = (pathname: string, to: string) =>
  to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`);

export const MainSidebar = ({ isMobile = false }: MainSidebarProps) => {
  const { pathname } = useLocation();
  const { close } = useSheet();
  const drawer = useDrawer();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // The mobile copy lives inside the sheet; only the desktop copy owns the shortcut.
    if (isMobile) return;
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isMobile]);

  return (
    <aside
      data-floating={!isMobile || undefined}
      className={cn(
        !isMobile ? "liquid-glass hidden w-64 shrink-0 border-r md:flex lg:w-72" : "flex w-full",
        "h-full flex-col overflow-y-auto bg-sidebar px-3 py-4"
      )}
    >
      <div className="flex items-center justify-between gap-2 px-2.5 pb-4 pr-1">
        <Link
          to="/"
          onClick={close}
          className="truncate font-display text-lg font-semibold tracking-[-0.01em] lg:text-xl"
        >
          David Nwobia
        </Link>
        {/* In the sheet the top-right corner belongs to the sheet's own close button. */}
        {!isMobile && <ModeToggle />}
      </div>

      <Dialog onOpenChange={setOpen} open={open}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="group mb-5 flex h-9 w-full items-center gap-2.5 rounded-lg border bg-background/60 px-2.5 text-sm text-muted-foreground transition-[color,border-color,transform] duration-150 ease-out hover:border-foreground/20 hover:text-foreground active:scale-[0.98]"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Search</span>
            {!isMobile && (
              <kbd className="rounded border bg-muted/60 px-1.5 py-0.5 font-sans text-[11px] font-medium leading-none text-muted-foreground">
                {isMac ? "⌘K" : "Ctrl K"}
              </kbd>
            )}
          </button>
        </DialogTrigger>
        <DialogContent instant hideClose className="w-[calc(100%-2rem)] max-w-xl gap-0 overflow-hidden rounded-xl border p-0">
          <DialogTitle className="sr-only">Search pages</DialogTitle>
          <SearchCommand setOpen={setOpen} />
        </DialogContent>
      </Dialog>

      {/* One shared highlight glides between links. Each copy of the sidebar gets its
          own group so the desktop and mobile highlights never fly to each other. */}
      <LayoutGroup id={isMobile ? "sidebar-mobile" : "sidebar-desktop"}>
        <nav aria-label="Main" className="flex flex-col gap-5">
          {navGroups.map((group, i) => (
            <ul key={i} className="flex flex-col gap-0.5">
              {group.map(({ to, label, icon: Icon }) => {
                const active = isActive(pathname, to);
                return (
                  <li key={to} data-no-blobity>
                    <Link
                      to={to}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        sidebarRow,
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          aria-hidden
                          className="absolute inset-0 rounded-lg bg-muted shadow-[inset_0_0_0_1px_hsl(var(--foreground)/0.04)]"
                          transition={{ type: "spring", bounce: 0, duration: 0.35 }}
                        />
                      )}
                      <Icon className="relative h-[18px] w-[18px]" strokeWidth={1.75} />
                      <span className="relative">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ))}

          <ul className="flex flex-col gap-0.5">
            <li data-no-blobity>
              <Drawer open={drawer.isOpen} onOpenChange={drawer.setOpen}>
                <DrawerTrigger asChild>
                  <button
                    type="button"
                    className={cn(sidebarRow, "text-muted-foreground hover:bg-muted/60 hover:text-foreground")}
                  >
                    <Contact className="h-[18px] w-[18px]" strokeWidth={1.75} />
                    Contacts
                  </button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-xl">
                    <DrawerHeader className="text-center sm:text-center">
                      <DrawerTitle className="text-2xl md:text-3xl">Get in touch</DrawerTitle>
                      <DrawerDescription className="mx-auto max-w-[52ch] text-base leading-relaxed">
                        Feel free to reach out to me for any freelancing request, collaboration, project
                        inquiries, or just to say hello! I'm always open to new opportunities and
                        discussions. Use the contact options below to connect with me directly. I am
                        looking forward to hearing from you!
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-2 px-4 py-2 sm:grid-cols-3">
                      <Button asChild variant="outline" size="lg" className="gap-2 px-4">
                        <a href="https://github.com/NwobiaDavid" target="_blank" rel="noopener noreferrer">
                          <IconGithub className="h-5 w-5" /> GitHub
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="gap-2 px-4">
                        <a href="https://www.linkedin.com/in/david-nwobia/" target="_blank" rel="noopener noreferrer">
                          <IconLinkedin className="h-5 w-5" /> LinkedIn
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="lg" className="gap-2 px-4">
                        <a href="mailto:dnwobia@gmail.com">
                          <IconGmail className="h-5 w-5" /> Email
                        </a>
                      </Button>
                    </div>
                    <DrawerFooter>
                      <DrawerClose asChild>
                        <Button variant="ghost" className="w-full text-muted-foreground">
                          Close
                        </Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </li>
            <li data-no-blobity>
              <ResumeViewer
                onClose={close}
                buttonVariant="ghost"
                buttonClassName={cn(sidebarRow, "justify-start text-muted-foreground hover:bg-muted/60 hover:text-foreground [&_svg]:h-[18px] [&_svg]:w-[18px] [&_svg]:stroke-[1.75]")}
                showIcon={true}
              />
            </li>
          </ul>
        </nav>
      </LayoutGroup>

      {/* On desktop it only shows when the window is tall enough that it never makes the
          sidebar scroll. In the mobile menu, which already scrolls, it always shows. */}
      <div className={cn("mt-auto pt-6", !isMobile && "hidden [@media(min-height:760px)]:block")}>
        <SidebarPlatformer />
      </div>

      {isMobile && (
        <div className="mt-4 flex items-center justify-between border-t px-2.5 pt-3 text-sm text-muted-foreground">
          Theme
          <ModeToggle />
        </div>
      )}
    </aside>
  );
};
