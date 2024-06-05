import { FlowAppButton } from "@/components/content/flow-app-button";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineItemProps } from "@/components/timeline/timeline-item";
import { Gamepad, GraduationCap, Home, Laugh, PackageOpen } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";

const timelineItems: TimelineItemProps[] = [
  {
    date: "2015 - 2020",
    title: "CSMT",
    description:
      "When I was little, I liked efficient things and was lazy about doing repetitive things. Maybe that makes it easier for me as a programmer now.",
  },
  {
    date: "Mar 2024 - Sep 2024",
    title: "Oceanz Robotics",
    description:
      "When I was in high school I liked subjects related to calculations, problem solving and logic, such as mathematics.",
  },
  {
    date: "2020 - now",
    title: "Covenant University",
    description:
      "Now that I'm studying at Widyatama University and taking a major in Informatics Engineering, I plan to take a database major, but do not close the possibility that I will take a major other than that.",
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
        leftRoute="/"
        rightTitle="Hobby"
        rightDescription="see what I like"
        rightIcon={<Laugh />}
        rightRoute="/hobby"
      />
    </div>
  );
}
