import { FlowAppButton } from "@/components/content/flow-app-button";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineItemProps } from "@/components/timeline/timeline-item";
import { Folder, Home, PackageOpen } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";




const timelineItems: TimelineItemProps[] = [
    {
        date: "2021 - 2023",
        title: "Byte&Crunch — Full-Stack Developer",
        description:
            "Led the end-to-end development of an e-commerce platform using the MERN stack (MongoDB, Express, React, Node.js). Built a scalable and secure system with integrated payments and authentication. Improved performance through front-end optimization and delivered a clean, conversion-focused user experience."
    },
    {
        date: "2023 - 2024",
        title: "Transcend Agency — Frontend Developer | Contract",
        description:
            "Built high-performance, user-centric websites for global brands using React and Next.JS. Worked closely with designers and backend teams to refine UI/UX and improve load speed, contributing to stronger engagement and retention."
    },
    {
        date: "April 2024 - July 2024",
        title: "Pally — Full-Stack Developer",
        description:
            "Led the development of Pally’s web application from wireframes to production. Built and integrated both frontend and backend systems using Next.js, Node.js and MongoDB, implemented state management and API architecture, and ensured performance, scalability, and seamless user experience across devices."
    },
    {
        date: "March 2024 - Sept 2024",
        title: "Oceanz Robotics — Robotics Engineer Intern",
        description:
              "Designed and prototyped robotics and IoT-based solutions to improve client operations. Programmed Arduino-based systems using Embedded C++, integrating sensors and actuators for real-world automation tasks. Built supporting software tools and optimized workflows through rapid prototyping and iterative testing."
    },
    {
        date: "Sept 2024 - July 2025",
        title: "Google Developer Student Club — Covenant University | Frontend Co-Lead",
        description:
            "Co-led the Frontend track, organizing workshops and technical sessions for over 50 students. Mentored students in modern web development and cloud fundamentals, helping build a stronger developer community on campus."
    },

];

export default function Experiences() {
    useDocumentTitle("David Nwobia | Experiences");

    return (
        <div className="p-5 w-screen md:w-full overflow-y-auto">
            <h3 className="flex items-center gap-2 scroll-m-20 mb-2 text-2xl font-semibold tracking-tight">
                <PackageOpen /> Experiences
            </h3>
            <div className="xl:px-3   ">

                <Timeline
                    items={[...timelineItems].reverse().map((item, index) => {
                        return {
                            ...item,
                            // Mark the latest (now first) experience as current
                            isCurrent: index === 0,
                        };
                    })}
                />
            </div>
            <FlowAppButton
                leftTitle="Home"
                leftDescription="see the home page"
                leftIcon={<Home />}
                leftRoute="/"
                rightTitle="Projects"
                rightDescription="see what i've worked on"
                rightIcon={<Folder />}
                rightRoute="/projects"
            />
        </div>
    );
}
