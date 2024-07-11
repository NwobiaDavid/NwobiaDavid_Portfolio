import { TimelineItem, TimelineItemProps } from "./timeline-item";
import { motion } from "framer-motion";

interface TimelineProps {
  items: TimelineItemProps[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700">
      {items.map((item, index) => (
        <motion.li
          key={index}
          className=" xl:w-[80%] md:w-[90%] w-full  "
          initial={{ opacity: 0, translateX: 50 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ duration: index !== 0 ? index * 0.4 : 0.3 }}
        >
          <TimelineItem {...item} />
        </motion.li>
      ))}
    </ol>
  );
};
