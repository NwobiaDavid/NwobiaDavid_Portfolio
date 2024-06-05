import { Button } from "@/components/ui/button";
import { Gamepad, Github, LayoutTemplate, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "usehooks-ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { FlowAppButton } from "@/components/content/flow-app-button";

export default function Projects() {
  useDocumentTitle("Rizky Fauzi Ilmi - Projects");
  const [category, setCategory] = useState<string>("ALL");

  enum Category {
    FRONTEND,
    BACKEND,
    FULLSTACK,
  }

  interface Project {
    title: string;
    imgUrl: string;
    description: string;
    githubUrl: string;
    liveDemo?: string;
    category: Category;
  }

  const Projects: Project[] = [
    {
      title:
        "Free Fall Motion and Projectile Motion Simulation with HTML5 Canvas and JavaScript",
      description:
        "This interactive simulation employs HTML5 Canvas and JavaScript to visualize free fall motion. With customizable parameters, real-time animation provides a direct understanding of physics principles. Designed for education and exploration, the simulation is responsive, informative, and accessible across platforms.",
      imgUrl:
        "https://raw.githubusercontent.com/RizkyFauziIlmi/project-simulasi-gerak/master/public/Screenshot%20from%202023-05-21%2017-46-16.png",
      githubUrl: "https://github.com/RizkyFauziIlmi/project-simulasi-gerak",
      category: Category.FRONTEND,
    },
    {
      title: "TaskEase",
      description:
        "TaskEase is a comprehensive Todo application developed as a final project for the third semester, utilizing the MERN (MongoDB, Express.js, React, Node.js) stack. This application serves as a practical and efficient solution for managing tasks and to-dos, incorporating a seamless blend of front-end and back-end technologies.",
      imgUrl:
        "https://raw.githubusercontent.com/RizkyFauziIlmi/TaskEase/main/client/src/assets/Screenshot%202024-01-04%20at%2006-23-54%20TaskEase%20-%20Todo.png",
      githubUrl: "https://github.com/RizkyFauziIlmi/TaskEase",
      category: Category.FULLSTACK,
    },
    {
      title: "Portofolio",
      description:
        "dynamic and visually appealing web application developed using the React library. This portfolio is designed to showcase my skills, projects, and achievements with an elegant touch of shadows and interactive elements, providing a memorable user experience.",
      imgUrl:
        "https://raw.githubusercontent.com/RizkyFauziIlmi/portofolio/master/public/Screenshot%202024-01-04%20at%2006-27-22%20Rizky%20Fauzi%20Ilmi%20-%20Home.png",
      githubUrl: "https://github.com/RizkyFauziIlmi/project-simulasi-gerak",
      liveDemo: "https://rizkyfauziilmi.vercel.app/",
      category: Category.FRONTEND,
    },
  ];

  const selectedCategory: Category =
    Category[category as keyof typeof Category] || Category.FRONTEND;

  // Filter projects based on the selected category
  const filteredProjects =
    category === "ALL"
      ? Projects
      : Projects.filter((value) => value.category === selectedCategory);

  return (
    <div className="p-5 w-screen md:w-full h-full overflow-auto">
      <div className="h-1/6 md:mb-2">
        <div className="flex justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Projects
          </h3>
          <Select
            defaultValue={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="FRONTEND">Frontend</SelectItem>
              <SelectItem value="BACKEND">Backend</SelectItem>
              <SelectItem value="FULLSTACK">Full Stack</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <h4 className="scroll-m-20 text-lg text-muted-foreground font-semibold tracking-tight mt-6">
          {category} ({filteredProjects.length})
        </h4>
      </div>
      <Separator />
      <div className="overflow-y-auto h-4/6">
        <AnimatePresence>
          {filteredProjects.map((value) => (
            <motion.div
              key={value.title}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="p-6 flex flex-col lg:flex-row lg:items-center gap-4 shadow-lg"
            >
              <img
                src={value.imgUrl}
                alt={value.title}
                className="object-contain rounded-md w-80"
              />
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-md font-semibold">{value.title}</p>
                  <p className="text-sm line-clamp-3 lg:line-clamp-4">
                    {value.description}
                  </p>
                </div>
                <div className="flex gap-2">
                  {value.githubUrl && (
                    <Link to={value.githubUrl} replace target="_blank">
                      <Button variant="outline">
                        <Github className="h-4 w-4 mr-2" />
                        Github
                      </Button>
                    </Link>
                  )}
                  {value.liveDemo && (
                    <Link to={value.liveDemo} replace target="_blank">
                      <Button variant="outline">
                        <LayoutTemplate className="h-4 w-4 mr-2" />
                        Live Demo
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <FlowAppButton
        containerClassName="p-5"
        leftTitle="Hobby"
        leftDescription="see at the games and music that I like"
        leftIcon={<Gamepad />}
        leftRoute="/hobby"
        rightTitle="Skills"
        rightDescription="see what my skills are"
        rightIcon={<Wrench />}
        rightRoute="/skills"
      />
    </div>
  );
}
