import { TimelineItem, TimelineItemProps } from "./timeline-item";

interface TimelineProps {
  items: TimelineItemProps[];
}

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  return (
    // A list that appears as a list: one short, capped stagger, driven by CSS so it
    // stays smooth while the route is still rendering.
    <ol className="stagger relative max-w-3xl border-s">
      {items.map((item, index) => (
        <li
          key={`${item.title}-${item.date}`}
          data-no-blobity
          className="relative pb-10 ps-6 last:pb-2 md:ps-8"
          style={{ "--i": index } as React.CSSProperties}
        >
          <TimelineItem {...item} />
        </li>
      ))}
    </ol>
  );
};
