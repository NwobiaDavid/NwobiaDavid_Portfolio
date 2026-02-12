import { FlowAppButton } from "@/components/content/flow-app-button";
import { Timeline } from "@/components/timeline/timeline";
import { TimelineItemProps } from "@/components/timeline/timeline-item";
import { Folder, Home, PackageOpen } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";




const timelineItems: TimelineItemProps[] = [
    {
        date: "2021 - 2023",
        title: "Byte&Crunch - Full-stack Developer | Contract",
        description:
            "Led the development of Byte&Crunch's e-commerce platform using the MERN stack (MongoDB, Express, React, Node.js). Delivered a high-performing, scalable, and secure online store with an optimized user interface, resulting in improved customer satisfaction and operational efficiency. Integrated payment gateways, implemented user authentication, and enhanced website performance through front-end optimization.",
    },
    {
        date: "2022 - 2024",
        title: "Freelance Web Developer",
        description:
            "Developed custom websites and web applications for a diverse portfolio of clients, including individuals and agencies. Leveraged expertise in full-stack development, responsive design, and content management systems (CMS) to deliver tailored solutions that meet business objectives. Focused on delivering clean code, improved SEO, and cross-browser compatibility. Managed all aspects of project lifecycle from client communication to final deployment.",
    },
    {
        date: "2023 - 2024",
        title: "Transcend Agency - Front-end Developer | Contract",
        description:
            "Collaborated with cross-functional teams to build dynamic, user-centric websites for global brands, focusing on UI/UX design improvements and front-end performance optimization. Utilized modern front-end technologies (React, HTML5, CSS3, JavaScript) to enhance user engagement and improve page load speed, contributing to increased site traffic and customer retention.",
    },
    {
        date: "April 2024 - July 2024",
        title: "Pally - Front-end Developer | Contract",
        description:
            "Designed and developed the front-end of Pally’s web app, from initial wireframes to final deployment. Played a key role in ensuring a seamless and intuitive user experience while aligning with company goals and user requirements. Employed modern JavaScript frameworks (Next JS, Redux, PWA) to optimize performance and scalability.",
    },
    {
        date: "March 2024 - Sept 2024",
        title: "Oceanz Robotics - Robotics engineer | Internship",
        description:
            "Developed innovative robotics solutions and designed custom business applications to improve operational efficiency for clients in various industries. Utilized a blend of software development, IoT integration, and robotics engineering to deliver high-impact technological solutions. Focused on automation, prototyping, and optimizing client workflows through agile methodologies.",
    },
    {
        date: "Sept 2024 - July 2025",
        title: "Google Developer Student Club - Covenant University, Nigeria | Co-lead",
        description:
            "Co-led the Google Developer Student Club Frontend track, organizing workshops, hackathons, and coding bootcamps to promote hands-on learning in software development and cloud computing. Mentored over 100 students in areas such as web development, mobile app creation, and Google Cloud technologies, fostering a collaborative learning environment and enhancing participants' technical skills.",
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
