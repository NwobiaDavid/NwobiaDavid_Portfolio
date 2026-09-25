import { useEffect, useRef, useState, type RefObject } from "react";
import { ArrowLeft, ArrowRight, ArrowUp, Menu } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumbs from "../breadcrumbs";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MainSidebar } from "../sidebar/main-sidebar";
import { useSheet } from "@/hooks/use-sheet";
import GithubLink from "../github-link";
import { cn } from "@/lib/utils";

interface TopbarContentProps {
  /** The scrolling pane this bar floats over. */
  scrollRoot: RefObject<HTMLElement>;
}

const iconButton = "h-9 w-9 text-muted-foreground hover:text-foreground";

export const TopbarContent = ({ scrollRoot }: TopbarContentProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isOpen, setOpen } = useSheet();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // The bar only draws an edge once content is actually passing underneath it.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { root: scrollRoot.current, threshold: 0 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [scrollRoot]);

  // "Up" goes to the parent page, like a file browser: /projects/6 -> /projects -> /.
  const parent = pathname.replace(/\/[^/]+\/?$/, "") || "/";
  const atRoot = pathname === "/";
  // React Router records the position in its own history stack.
  const canGoBack = ((window.history.state as { idx?: number } | null)?.idx ?? 0) > 0;

  return (
    <>
      <div ref={sentinelRef} aria-hidden className="h-px w-full shrink-0" />
      <header
        className={cn(
          "material liquid-glass sticky top-0 z-30 -mt-px flex shrink-0 items-center justify-between gap-3 px-3 py-2.5 md:px-5",
          "bg-background/75 backdrop-blur-xl backdrop-saturate-150",
          "border-b transition-[border-color] duration-200",
          scrolled ? "border-border" : "border-transparent"
        )}
      >
        <nav aria-label="History" className="flex min-w-0 items-center gap-1 md:gap-3">
          <Sheet open={isOpen} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className={cn(iconButton, "md:hidden")} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[18rem] p-0 sm:max-w-[18rem]">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <MainSidebar isMobile />
            </SheetContent>
          </Sheet>

          <div className="flex items-center">
            <Button
              size="icon"
              variant="ghost"
              className={iconButton}
              onClick={() => navigate(-1)}
              disabled={!canGoBack}
              aria-label="Go back"
            >
              <ArrowLeft className="h-[18px] w-[18px]" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={iconButton}
              onClick={() => navigate(1)}
              aria-label="Go forward"
            >
              <ArrowRight className="h-[18px] w-[18px]" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className={iconButton}
              onClick={() => navigate(parent)}
              disabled={atRoot}
              aria-label="Go up one level"
            >
              <ArrowUp className="h-[18px] w-[18px]" />
            </Button>
          </div>

          <Breadcrumbs />
        </nav>

        <GithubLink />
      </header>
    </>
  );
};
