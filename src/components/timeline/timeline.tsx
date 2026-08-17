import { TimelineItem, TimelineItemProps } from "./timeline-item";
import { motion } from "framer-motion";

interface TimelineProps {
  items: TimelineItemProps[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <ol className="relative border-s  border-gray-200 dark:border-gray-700">
      {items.map((item, index) => (
        <motion.li
          key={index}
          data-no-blobity
          className=" xl:w-[80%] md:w-[90%] w-full  "
          initial={{ opacity: 0, translateY: 12 }}
          animate={{ opacity: 1, translateY: 0 }}
          // Uniform duration with a small, capped stagger — a per-index duration
          // makes lower entries crawl in and the whole column feel unsteady.
          transition={{ duration: 0.35, delay: Math.min(index * 0.07, 0.35), ease: "easeOut" }}
        >
          <TimelineItem {...item} />
        </motion.li>
      ))}
    </ol>
  );
};
