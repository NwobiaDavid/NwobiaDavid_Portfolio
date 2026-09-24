import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  /** Trailing detail shown after the title, e.g. a count. */
  meta?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({ title, description, meta, className }: PageHeaderProps) => (
  <header className={cn("mb-8 md:mb-10", className)}>
    <h1 className="flex items-baseline gap-3 text-3xl font-semibold tracking-[-0.02em] md:text-4xl">
      {title}
      {meta && (
        <span className="font-sans text-base font-normal tracking-normal text-muted-foreground tabular-nums">
          {meta}
        </span>
      )}
    </h1>
    {description && (
      <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-muted-foreground">{description}</p>
    )}
  </header>
);

/** Consistent page gutters. Pages never scroll themselves; the content pane does. */
export const PageShell = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <div className={cn("w-full px-4 pb-10 pt-6 md:px-8 md:pt-8 xl:px-12", className)}>{children}</div>
);
