import { FlowAppButton } from "@/components/content/flow-app-button";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineItemProps } from "@/components/timeline/timeline-item";
import { Folder, Home } from "lucide-react";
import { PageHeader, PageShell } from "@/components/page-header";
import { useDocumentTitle } from "usehooks-ts";

// Listed most-recent first, and stored that way so the file reads in the same
// order it renders. One date format throughout (Mon YYYY), every span carries a
// duration, and the spans run back to back: no gaps and no two full-time roles
// competing for the same months.
const timelineItems: TimelineItemProps[] = [
    {
        date: "Aug 2024 - Present",
        duration: "2 yrs",
        title: "Full-Stack Developer",
        company: "Pally",
        isCurrent: true,
        bullets: [
            "Led Pally's web application from wireframes to production as the sole full-stack developer.",
            "Designed the API architecture and state management layer that now serves 100+ active users.",
            "Built real-time order tracking and secure authentication with NextAuth.",
            "Delivered a responsive experience that holds up across mobile and desktop.",
        ],
        stack: ["Next.js", "Node.js", "MongoDB", "NextAuth"],
    },
    {
        date: "Sept 2024 - July 2025",
        duration: "11 mos",
        title: "Frontend Co-Lead",
        company: "Google Developer Student Club, Covenant University",
        bullets: [
            "Co-led the Frontend track, running workshops and technical sessions for 50+ students.",
            "Mentored peers in modern web development and cloud fundamentals.",
            "Grew a stronger, more active developer community on campus.",
        ],
        stack: ["React", "Next.js", "Google Cloud", "Mentoring"],
    },
    {
        date: "Mar 2024 - July 2024",
        duration: "5 mos",
        title: "Robotics Engineer Intern",
        company: "Oceanz Robotics",
        bullets: [
            "Designed and prototyped robotics and IoT solutions to improve client operations.",
            "Programmed Arduino-based systems in Embedded C++, integrating sensors and actuators for real-world automation.",
            "Built internal software tools and tightened workflows through rapid prototyping and iterative testing.",
        ],
        stack: ["Embedded C++", "Arduino", "IoT", "Python"],
    },
    {
        date: "Feb 2023 - Feb 2024",
        duration: "1 yr 1 mo",
        title: "Frontend Developer · Contract",
        company: "Transcend Agency",
        bullets: [
            "Built high-performance marketing and product sites for global brands on React and Next.js.",
            "Partnered directly with designers and backend engineers to refine UI/UX ahead of each release.",
            "Improved load speed across client sites, contributing to stronger engagement and retention.",
        ],
        stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
        date: "Jan 2021 - Jan 2023",
        duration: "2 yrs 1 mo",
        title: "Full-Stack Developer",
        company: "Byte&Crunch",
        bullets: [
            "Owned an e-commerce platform end to end on the MERN stack, from data modelling through to the storefront UI.",
            "Shipped secure checkout with integrated payments and authentication, handling 100+ product listings.",
            "Cut page load times through front-end optimisation, improving the conversion-focused browsing experience.",
            "Automated menu management with a Telegram bot that let admins bulk-update the catalogue from a CSV upload.",
        ],
        stack: ["React", "Node.js", "Express", "MongoDB", "React Query"],
    },
];

export default function Experiences() {
    useDocumentTitle("David Nwobia | Experiences");

    return (
        <PageShell>
            <PageHeader
                title="Experiences"
                description="Five years of building for the web: e-commerce, agency work, robotics and community, in that order."
            />
            <Timeline items={timelineItems} />
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
        </PageShell>
    );
}
