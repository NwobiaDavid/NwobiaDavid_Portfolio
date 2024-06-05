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
            "When I was in high school I liked subjects related to calculations, problem solving and logic, such as mathematics.",
    },
    {
        date: "2022 - 2024",
        title: "Freelancer",
        description:
            "At this time I was new to the world of programming and started learning using the self-taught method",
    },
    {
        date: "2023 - 2024",
        title: "Transcend Agency - Front-end Developer | Contract",
        description:
            "When I was little, I liked efficient things and was lazy about doing repetitive things. Maybe that makes it easier for me as a programmer now.",
    },
    {
        date: "2024 - 2024",
        title: "Pallly - Front-end Developer | Contract",
        description:
            "At this time I was new to the world of programming and started learning using the self-taught method",
    },
    {
        date: "2024 - now",
        title: "Oceanz Robotics",
        description:
            "Now that I'm studying at Widyatama University and taking a major in Informatics Engineering, I plan to take a database major, but do not close the possibility that I will take a major other than that.",
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
                rightRoute="/hobby"
            />
        </div>
    );
}
