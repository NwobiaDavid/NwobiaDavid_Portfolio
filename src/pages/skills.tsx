import IconExpress from "@/components/svg/express-svg";
import IconFirebase from "@/components/svg/firebase-svg";
import IconGit from "@/components/svg/git-svg";
import IconBrandJavascript from "@/components/svg/javascript-svg";
import IconMongodb from "@/components/svg/mongodb-svg";
import IconMysql from "@/components/svg/mysql-svg";
import IconNextjs from "@/components/svg/nextjs-svg";
import IconPython from "@/components/svg/python-svg";
import IconReact from "@/components/svg/react-svg";
import IconSupabase from "@/components/svg/supabase-svg";
import IconTailwind from "@/components/svg/tailwind-svg";
import IconTypescript from "@/components/svg/typescript-svg";
import { useDocumentTitle } from "usehooks-ts";
import { motion } from "framer-motion";
import { FlowAppButton } from "@/components/content/flow-app-button";
import { Folder, ShieldCheckIcon } from "lucide-react";
import IconCplusjs from "@/components/svg/cplusplus-svg";
import IconNpm from "@/components/svg/npm-svg";

export default function Skills() {
  useDocumentTitle("David Nwobia | Skills");

  enum Categoty {
    LANGUAGE,
    FRONTEND,
    BACKEND,
    FULLSTACK,
    OTHER,
  }

  interface Skill {
    title: string;
    icon: JSX.Element;
    category: Categoty;
  }

  const Skills: Skill[] = [
    {
      title: "Javascript",
      icon: <IconBrandJavascript className="h-14 w-14" />,
      category: Categoty.LANGUAGE,
    },
    {
      title: "Typescript",
      icon: <IconTypescript className="h-10 w-10" />,
      category: Categoty.LANGUAGE,
    }, {
      title: "C++",
      icon: <IconCplusjs className="h-10 w-10" />,
      category: Categoty.LANGUAGE,
    },
    {
      title: "Npm",
      icon: <IconNpm className="h-10 w-10" />,
      category: Categoty.OTHER,
    },
    {
      title: "Python",
      icon: <IconPython className="h-10 w-10" />,
      category: Categoty.LANGUAGE,
    },
    {
      title: "React",
      icon: <IconReact className="h-10 w-10" />,
      category: Categoty.FRONTEND,
    },
    {
      title: "Express",
      icon: <IconExpress className="h-10 w-10" />,
      category: Categoty.BACKEND,
    },
    {
      title: "Git",
      icon: <IconGit className="h-10 w-10" />,
      category: Categoty.OTHER,
    },
    {
      title: "NextJS",
      icon: <IconNextjs className="h-10 w-10" />,
      category: Categoty.FULLSTACK,
    },
    {
      title: "Tailwind",
      icon: <IconTailwind className="h-10 w-10" />,
      category: Categoty.FRONTEND,
    },
    {
      title: "MySQL",
      icon: <IconMysql className="h-10 w-10" />,
      category: Categoty.BACKEND,
    },
    {
      title: "MongoDB",
      icon: <IconMongodb className="h-10 w-10" />,
      category: Categoty.BACKEND,
    },
    {
      title: "Firebase",
      icon: <IconFirebase className="h-10 w-10" />,
      category: Categoty.BACKEND,
    },
    {
      title: "Supabase",
      icon: <IconSupabase className="h-10 w-10" />,
      category: Categoty.BACKEND,
    },
  ];

  const skillsLanguage = Skills.filter(
    (value) => value.category === Categoty.LANGUAGE
  );
  const skillsFrontend = Skills.filter(
    (value) => value.category === Categoty.FRONTEND
  );
  const skillsBackend = Skills.filter(
    (value) => value.category === Categoty.BACKEND
  );
  const skillsFullstack = Skills.filter(
    (value) => value.category === Categoty.FULLSTACK
  );
  const skillsOther = Skills.filter(
    (value) => value.category === Categoty.OTHER
  );

  return (
    <div className="p-5 h-screen overflow-auto w-screen md:w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="flex flex-col gap-6"
      >
        <div>
          <h4 className="scroll-m-20 p_style text-xl font-semibold tracking-tight mb-2">
            Programming Language
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skillsLanguage.map((value, index) => (
              <div key={index} className="p-5 rounded-md shadow-lg bg-secondary flex justify-center items-center flex-col gap-2">
                {value.icon}
                <p>{value.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="scroll-m-20 p_style text-xl font-semibold tracking-tight mb-2">
            Front-End Frameworks
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skillsFrontend.map((value, index) => (
              <div key={index} className="p-5 rounded-md shadow-lg bg-secondary flex justify-center items-center flex-col gap-2">
                {value.icon}
                <p>{value.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="scroll-m-20 p_style text-xl font-semibold tracking-tight mb-2">
            Back-End Frameworks
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skillsBackend.map((value, index) => (
              <div key={index} className="p-5 rounded-md shadow-lg bg-secondary flex justify-center items-center flex-col gap-2">
                {value.icon}
                <p>{value.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="scroll-m-20 p_style text-xl font-semibold tracking-tight mb-2">
            Full Stack Frameworks
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skillsFullstack.map((value, index) => (
              <div key={index} className="p-5 rounded-md shadow-lg bg-secondary flex justify-center items-center flex-col gap-2">
                {value.icon}
                <p>{value.title}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="scroll-m-20 p_style text-xl font-semibold tracking-tight mb-2">
            Others
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skillsOther.map((value) => (
              <div className="p-5 rounded-md shadow-lg bg-secondary flex justify-center items-center flex-col gap-2">
                {value.icon}
                <p>{value.title}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <FlowAppButton
        containerClassName="pt-5"
        leftTitle="Projects"
        leftDescription="see what I'm working on"
        leftIcon={<Folder />}
        leftRoute="/projects"
        rightTitle="Certifications"
        rightDescription="see institutions backing up my skills"
        rightIcon={<ShieldCheckIcon />}
        rightRoute="/certifications"
      />
    </div>
  );
}
