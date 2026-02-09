import { FlowAppButton } from "@/components/content/flow-app-button";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineItemProps } from "@/components/timeline/timeline-item";
import { GraduationCap, Laugh, PackageOpen } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";

const timelineItems: TimelineItemProps[] = [
  {
    date: "2015 - 2020",
    title: "CSMT Secondary School",
    description:
      "Excelled in core science subjects while fostering creativity and critical thinking. As an active member of the literary club, developed strong communication and analytical skills, contributing to a supportive and intellectually stimulating environment. Gained a foundation in STEM and cultivated leadership through extracurricular activities.",
  },
  {
    date: "Mar 2024 - Sep 2024",
    title: "Oceanz Robotics - Robotics Engineer Intern",
    description:
      "Designed and developed mini robots using Arduino platforms, employing embedded C++ for task automation and functionality. Collaborated with a multidisciplinary team to prototype and test robotics systems, enhancing automation and efficiency in client operations. Gained hands-on experience in hardware-software integration, sensor interfacing, and troubleshooting for real-world applications.",
  },
  {
    date: "2020 - Present",
    title: "Covenant University - B.Sc. Physics | Tech Community Leader",
    description:
      "Active participant in the Hebron Startup Lab, where I spearheaded various tech projects and built innovative solutions, demonstrating leadership and teamwork. Co-lead of the Frontend Track for the Google Developer Student Club (Covenant University), mentoring peers in modern web technologies and fostering community growth. Additionally, served as the Financial Secretary for the National Association of Physics Students (NAPS), managing budgets and financial records with precision and accountability.",
  },
];

export default function Education() {
  useDocumentTitle("David Nwobia | Education");

  return (
    <div className="p-5 w-screen md:w-full overflow-y-auto">
      <h3 className="flex items-center gap-2 scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">
        <GraduationCap /> Education
      </h3>
      <div className=" xl:px-3">

        <Timeline
          items={timelineItems.map((item, index, array) => {
            return {
              ...item,
              isCurrent: index === array.length - 1,
            };
          })}
        />
      </div>
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
