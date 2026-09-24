import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkProps {
  href: string;
  text: string;
}

export interface TimelineItemProps {
  date: string;
  title: string;
  /** Organisation behind the role. Rendered on its own line under the title. */
  company?: string;
  /** Pre-computed length of the role, e.g. "2 yrs 2 mos". */
  duration?: string;
  /** Where the work happened, e.g. "Remote" or "Lagos, NG". */
  location?: string;
  /** Prose summary. Used when `bullets` is not supplied. */
  description?: string;
  /** Scannable achievement lines, shown instead of `description` when present. */
  bullets?: string[];
  /** Tech used in the role, rendered as tags under the bullets. */
  stack?: string[];
  isCurrent?: boolean;
  link?: LinkProps;
}

// Rendered inside the Timeline's <li>; this component owns the contents only.
export const TimelineItem: React.FC<TimelineItemProps> = ({ date, title, company, duration, location, description, bullets, stack, link, isCurrent = false }) => {
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute -start-[5px] top-[0.4rem] h-[9px] w-[9px] rounded-full ring-4 ring-background",
          isCurrent ? "bg-primary" : "bg-muted-foreground/40"
        )}
      >
        {/* A live indicator for the role that is still running. Still under reduced motion. */}
        {isCurrent && (
          <span className="absolute inset-0 rounded-full bg-primary/70 motion-safe:animate-ping" />
        )}
      </span>

      <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground tabular-nums">
        <time>{date}</time>
        {duration && (
          <>
            <span aria-hidden className="text-muted-foreground/50">·</span>
            <span>{duration}</span>
          </>
        )}
        {isCurrent && (
          <span className="ms-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium leading-none text-primary">
            Current
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold tracking-[-0.01em] md:text-xl">{title}</h3>
      {company && (
        <p className="mt-0.5 text-[0.95rem] font-medium text-foreground/80">
          {company}
          {location && <span className="font-normal text-muted-foreground"> · {location}</span>}
        </p>
      )}

      {bullets && bullets.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {bullets.map((bullet, index) => (
            // Opted out of the blob cursor: the global config treats every `li` as
            // focusable, which swallowed each key point in a full-width rectangle.
            // These are body text, not targets.
            <li
              key={index}
              data-no-blobity
              className="flex gap-3 text-[0.95rem] leading-relaxed text-muted-foreground"
            >
              <span aria-hidden className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : (
        description && (
          <p className="mt-3 max-w-[68ch] text-[0.95rem] leading-relaxed text-muted-foreground">{description}</p>
        )
      )}

      {stack && stack.length > 0 && (
        <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-1.5">
          {stack.map((tech) => (
            <li
              key={tech}
              data-no-blobity
              className="rounded-md border bg-background/50 px-2 py-0.5 text-xs text-muted-foreground"
            >
              {tech}
            </li>
          ))}
        </ul>
      )}
      {link && (
        <a
          href={link.href}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
        >
          {link.text}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      )}
    </>
  );
};
