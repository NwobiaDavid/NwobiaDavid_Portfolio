import { FlowAppButton } from "@/components/content/flow-app-button";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineItemProps } from "@/components/timeline/timeline-item";
import { Folder, Home } from "lucide-react";
import { PageHeader, PageShell } from "@/components/page-header";
import { useDocumentTitle } from "usehooks-ts";

// Listed most-recent first, and stored that way so the file reads in the same
// order it renders. One date format throughout (Mon YYYY), and every span
// carries a duration. Mirrors the current CV.
const timelineItems: TimelineItemProps[] = [
    {
        date: "Apr 2026 - Present",
        duration: "6 mos",
        title: "Software Engineer",
        company: "Serlzo",
        location: "UK (Remote)",
        isCurrent: true,
        bullets: [
            "Engineer on Serlzo v2, an all-in-one SaaS platform for creators, in a 4-person Agile Scrum team; shipped 7 of 8 assigned modules in my first quarter.",
            "Built the CRM and courses modules across the creator dashboard, admin app and public site.",
            "Owned the frontend of the workflow automation module, a trigger-and-action builder connecting features across the platform.",
            "Built the admin dashboard, making routine operations self-serve with no direct database access.",
            "Building the AI page builder: a visual editor and funnel canvas driven by Sio, Serlzo's AI agent.",
            "Built the landing page from scratch and led its performance optimisation and technical SEO.",
            "Took the mobile app to a release-ready Android build; built the community discovery and referral interfaces.",
        ],
        stack: ["TypeScript", "React", "Next.js", "React Native", "Node.js"],
    },
    {
        date: "Sept 2024 - July 2025",
        duration: "11 mos",
        title: "Frontend Co-Lead",
        company: "Google Developer Student Club, Covenant University",
        bullets: [
            "Led the frontend track for 80+ students.",
            "Ran 12+ workshops and technical sessions on modern web development.",
            "Mentored 25+ students.",
        ],
        stack: ["React", "Next.js", "Mentoring"],
    },
    {
        date: "Mar 2024 - Sept 2024",
        duration: "7 mos",
        title: "Robotics Engineer Intern",
        company: "Oceanz Robotics",
        bullets: [
            "Designed IoT automation for 5+ client projects in embedded C++ on Arduino, improving operational efficiency by 40%.",
            "Built React and Node.js dashboards for real-time system monitoring, cutting development cycles by 25%.",
        ],
        stack: ["Embedded C++", "Arduino", "IoT", "React", "Node.js"],
    },
    {
        date: "2021 - 2024",
        duration: "3 yrs",
        title: "Freelance Software Engineer",
        company: "Self-employed",
        bullets: [
            "Delivered React, Next.js, Node.js and TypeScript apps for startups and 3 global brands, including a MERN e-commerce platform and a people matching app with a 12+ endpoint REST API.",
            "Built JWT/NextAuth authentication and Flutterwave payments, reaching 92% onboarding completion and a 99.2% payment success rate.",
            "Set up CI/CD that cut deploy time from 45 to 8 minutes and page load times by 60%.",
            "Built a Telegram bot that reduced delivery delays by 35%.",
        ],
        stack: ["React", "Next.js", "Node.js", "TypeScript", "MongoDB"],
    },
];

export default function Experiences() {
    useDocumentTitle("David Nwobia | Experiences");

    return (
        <PageShell>
            <PageHeader
                title="Experiences"
                description="Five years of building for the web, mobile and AI: freelance work, robotics, community and now SaaS at Serlzo."
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
