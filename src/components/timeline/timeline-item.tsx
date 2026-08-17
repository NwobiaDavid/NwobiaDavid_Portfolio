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

export const TimelineItem: React.FC<TimelineItemProps> = ({ date, title, company, duration, location, description, bullets, stack, link, isCurrent = false }) => {
  return (
    <li data-no-blobity className="mb-10 ms-4">
      <div className={cn(isCurrent ? "bg-primary/80 border-none" : "bg-gray-200 dark:border-gray-900 dark:bg-gray-700", "absolute w-3 h-3  rounded-full mt-1.5 -start-1.5 border border-white ")}></div>
      <div className={cn(isCurrent ? "bg-primary/80 border-none animate-ping" : "bg-gray-200 dark:border-gray-900 dark:bg-gray-700", "absolute w-3 h-3  rounded-full mt-1.5 -start-1.5 border border-white")}></div>
      <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        <time className="text-sm font-normal leading-none text-gray-400 p_style  dark:text-gray-500">{date}</time>
        {duration && (
          <>
            <span aria-hidden className="leading-none text-gray-300 dark:text-gray-600">·</span>
            <span className="text-sm font-normal leading-none text-gray-400 p_style dark:text-gray-500">{duration}</span>
          </>
        )}
        {isCurrent && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium leading-none text-primary">Current</span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 p_style  dark:text-white">{title}</h3>
      {company && (
        <p className="mt-0.5 text-sm font-medium p_style text-gray-600 dark:text-gray-300">
          {company}
          {location && <span className="font-normal text-gray-400 dark:text-gray-500"> · {location}</span>}
        </p>
      )}

      {bullets && bullets.length > 0 ? (
        <ul className="mb-3 mt-2 space-y-1.5">
          {bullets.map((bullet, index) => (
            <li
              key={index}
              className="flex gap-2 text-base body_style font-normal text-gray-500 dark:text-gray-400"
            >
              <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-gray-400 dark:bg-gray-600" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mb-4 text-base body_style font-normal text-gray-500  dark:text-gray-400">{description}</p>
      )}

      {stack && stack.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {stack.map((tech, index) => (
            <span
              key={index}
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs p_style text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      {link && (
        <a
          href={link.href}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
        >
          {link.text}{' '}
          <svg
            className="w-3 h-3 ms-2 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </a>
      )}
    </li>
  );
};