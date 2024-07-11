import { FlowAppButton } from "@/components/content/flow-app-button";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineItemProps } from "@/components/timeline/timeline-item";
import { GraduationCap,  Laugh, PackageOpen } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";

const timelineItems: TimelineItemProps[] = [
  {
    date: "2015 - 2020",
    title: "CSMT",
    description:
      "In secondary school, I emphasized creativity while excelling in core science subjects. I joined the literary club to express myself in a supportive environment.",
  },
  {
    date: "Mar 2024 - Sep 2024",
    title: "Oceanz Robotics",
    description:
      "During my time at Ocean Robotics, I developed mini robots using Arduinos and programmed them to perform tasks with embedded C++.",
  },
  {
    date: "2020 - now",
    title: "Covenant University",
    description:
      "At university, I became an active member of the Hebron Startup Lab, a tech community on campus. I built various tech projects and demonstrated high achievement through dedication and the mercies of God",
  },
];

export default function Education() {
  useDocumentTitle("Nwobia David | Education");

  return (
    <div className="p-5 w-screen md:w-full overflow-y-auto">
      <h3 className="flex items-center gap-2 scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">
        <GraduationCap /> Education
      </h3>
      <Timeline
        items={timelineItems.map((item, index, array) => {
          return {
            ...item,
            isCurrent: index === array.length - 1,
          };
        })}
      />
      <FlowAppButton
        leftTitle="Experiences"
        leftDescription="timeline of my work experiences"
        leftIcon={<PackageOpen />}
        leftRoute="/experiences"
        rightTitle="Hobby"
        rightDescription="see what I like"
        rightIcon={<Laugh />}
        rightRoute="/hobby"
      />
    </div>
  );
}
