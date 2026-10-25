import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { TopbarContent } from "@/components/topbar/topbar-content";
import { PageBuddy } from "@/components/page-buddy";
import { pageKeyFor } from "@/constants/sections";
import { LenisContext, useSmoothScroll } from "@/hooks/use-smooth-scroll";

interface ContentLayoutProps {
  children: React.ReactNode;
}

// The content pane is the one scroll container in the app. Pages never scroll
// themselves, so there is never a scrollbar inside a scrollbar.
export const ContentLayout = ({ children }: ContentLayoutProps) => {
  const { pathname } = useLocation();
  // The top-level sections share one page, so moving between them is not a new page.
  const page = pageKeyFor(pathname);
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lenis = useSmoothScroll(scrollRef, contentRef);

  // A new page starts at its top, not wherever the previous page was left. The section
  // stack places itself.
  useEffect(() => {
    if (page === "sections") return;
    if (lenis) {
      lenis.resize();
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      scrollRef.current?.scrollTo({ top: 0 });
    }
  }, [page, lenis]);

  return (
    <div
      ref={scrollRef}
      data-scroll-root
      className="relative flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
    >
      <LenisContext.Provider value={lenis}>
        <div ref={contentRef} className="flex shrink-0 grow flex-col">
          <TopbarContent scrollRoot={scrollRef} />
          {/* Keyed on the page so each one plays one short entrance. There is no exit
              animation: navigation should never wait on the page it is leaving. */}
          <main key={page} className="page-enter flex flex-1 flex-col">
            {children}
          </main>
        </div>
      </LenisContext.Provider>
      {/* Outside the keyed page so the character carries over from page to page. */}
      <PageBuddy scrollRoot={scrollRef} />
    </div>
  );
};
