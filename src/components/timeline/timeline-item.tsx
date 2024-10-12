import { cn } from "@/lib/utils";

interface LinkProps {
  href: string;
  text: string;
}

export interface TimelineItemProps {
  date: string;
  title: string;
  description: string;
  isCurrent?: boolean;
  link?: LinkProps;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ date, title, description, link, isCurrent = false }) => {
  return (
    <li className="mb-10 ms-4">
      <div className={cn(isCurrent ? "bg-primary/80 border-none" : "bg-gray-200 dark:border-gray-900 dark:bg-gray-700", "absolute w-3 h-3  rounded-full mt-1.5 -start-1.5 border border-white ")}></div>
      <div className={cn(isCurrent ? "bg-primary/80 border-none animate-ping" : "bg-gray-200 dark:border-gray-900 dark:bg-gray-700", "absolute w-3 h-3  rounded-full mt-1.5 -start-1.5 border border-white")}></div>
      <time className="mb-1 text-sm font-normal leading-none text-gray-400 p_style  dark:text-gray-500">{date}</time>
      <h3 className="text-lg font-semibold text-gray-900 p_style  dark:text-white">{title}</h3>
      <p className="mb-4 text-base font-normal text-gray-500  dark:text-gray-400">{description}</p>
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