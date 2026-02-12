import { FlowAppButton } from "@/components/content/flow-app-button";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineItemProps } from "@/components/timeline/timeline-item";
import { Folder, GraduationCap, ShieldCheck } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";

const timelineItems: TimelineItemProps[] = [
  {
    date: "2015 - 2020",
    title: "CSMT Secondary School",
    description:
      "Excelled in core science subjects while fostering creativity and critical thinking. As an active member of the literary club, developed strong communication and analytical skills, contributing to a supportive and intellectually stimulating environment. Gained a foundation in STEM and cultivated leadership through extracurricular activities.",
  },
  {
    date: "Sept 2021 - Oct 2025",
    title: "Covenant University - B.Sc. Physics | Community Leader",
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
          items={[...timelineItems].reverse().map((item, index) => {
            return {
              ...item,
              // Mark the latest (now first) education entry as current
              isCurrent: index === 0,
            };
          })}
        />
      </div>
      <FlowAppButton
        leftTitle="Projects"
        leftDescription="see what I've worked on"
        leftIcon={<Folder />}
        leftRoute="/projects"
        rightTitle="Certifications"
        rightDescription="see institutions backing up my skills"
        rightIcon={<ShieldCheck />}
        rightRoute="/certifications"
      />
    </div>
  );
}
