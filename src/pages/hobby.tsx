import { MusicHobbyContent } from "@/components/content/music-hobby-content";
import { BookHobbyContent } from "@/components/content/books-hobby-content";
import { bookCount } from "@/constants/data/books";
import { BookOpen, Folder, GraduationCap, Headphones } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";
import { useState } from "react";
import { motion } from "framer-motion";
import { FlowAppButton } from "@/components/content/flow-app-button";
import { PageHeader, PageShell } from "@/components/page-header";
import { videoUrls } from "@/constants/data/video";
import { cn } from "@/lib/utils";

type Tab = "reading" | "listening";

const tabs = [
  { value: "reading", label: "Reading", icon: BookOpen, count: bookCount },
  { value: "listening", label: "Listening", icon: Headphones, count: videoUrls.length },
] as const;

export default function Hobby() {
  useDocumentTitle("David Nwobia | Hobby");
  const [tab, setTab] = useState<Tab>("reading");

  return (
    <PageShell>
      <PageHeader
        title="Hobbies"
        description="Away from the editor I'm usually halfway through a book or have something on repeat. Here's the shelf and the playlist."
      />

      <div
        role="tablist"
        aria-label="Hobbies"
        className="mb-10 inline-flex rounded-full bg-muted p-1"
      >
        {tabs.map(({ value, label, icon: Icon, count }) => {
          const active = tab === value;
          return (
            <button
              key={value}
              type="button"
              role="tab"
              id={`tab-${value}`}
              aria-selected={active}
              aria-controls={`panel-${value}`}
              onClick={() => setTab(value)}
              data-no-blobity
              className={cn(
                "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <motion.span
                  layoutId="hobby-tab"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                  className="absolute inset-0 rounded-full bg-primary"
                />
              )}
              <Icon className="relative h-4 w-4" />
              <span className="relative">{label}</span>
              <span className="relative tabular-nums opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "reading" ? <BookHobbyContent /> : <MusicHobbyContent />}
      </div>

      <FlowAppButton
        leftTitle="Education"
        leftDescription="see my education arc"
        leftIcon={<GraduationCap />}
        leftRoute="/education"
        rightTitle="Projects"
        rightDescription="see what I'm working on"
        rightIcon={<Folder />}
        rightRoute="/projects"
      />
    </PageShell>
  );
}
