import { FlowAppButton } from "@/components/content/flow-app-button";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineItemProps } from "@/components/timeline/timeline-item";
import { GraduationCap, Home, PackageOpen } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";

const timelineItems: TimelineItemProps[] = [
    {
        date: "2021 - 2023",
        title: "Byte&Crunch - Full-stack developer",
        description:
            "As a contract full stack developer, I developed their online web store using the MERN stack, ensuring a robust and user-friendly platform.",
    },
    {
        date: "2022 - 2024",
        title: "Freelancer",
        description:
            "I built professional websites for individuals and agencies, delivering custom solutions that catered to diverse client needs.",
    },
    {
        date: "2023 - 2024",
        title: "Transcend Agency - Front-end Developer | Contract",
        description:
            "As a frontend developer, I collaborated with a team to create dynamic websites for businesses worldwide, enhancing user experience and engagement.",
    },
    {
        date: "2024 - 2024",
        title: "Pallly - Front-end Developer | Contract",
        description:
            "I helped design and build Pally's app, contributing from conceptual design to final implementation to meet user needs and company goals.",
    },
    {
        date: "2024 - now",
        title: "Oceanz Robotics",
        description:
            "I developed small robotics for clients and designed business applications, enhancing operational efficiency through innovative technological solutions.",
    },
];

export default function Experiences() {
    useDocumentTitle("Nwobia David | Experiences");

    return (
        <div className="p-5 w-screen md:w-full overflow-y-auto">
            <h3 className="flex items-center gap-2 scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">
                <PackageOpen /> Experiences
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
                leftTitle="Home"
                leftDescription="see the home page"
                leftIcon={<Home />}
                leftRoute="/"
                rightTitle="Education"
                rightDescription="history of my academics timeline"
                rightIcon={<GraduationCap />}
                rightRoute="/education"
            />
        </div>
    );
}
