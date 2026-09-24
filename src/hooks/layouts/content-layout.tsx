import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { TopbarContent } from "@/components/topbar/topbar-content";

interface ContentLayoutProps {
  children: React.ReactNode;
}

// The content pane is the one scroll container in the app. Pages never scroll
// themselves, so there is never a scrollbar inside a scrollbar.
export const ContentLayout = ({ children }: ContentLayoutProps) => {
  const { pathname } = useLocation();
  const scrollRef = useRef<HTMLDivElement>(null);

  // A new page starts at its top, not wherever the previous page was left.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div
      ref={scrollRef}
      className="relative flex min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden"
    >
      <TopbarContent scrollRoot={scrollRef} />
      {/* Keyed on the route so each page plays one short entrance. There is no exit
          animation: navigation should never wait on the page it is leaving. */}
      <main key={pathname} className="page-enter flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
};
