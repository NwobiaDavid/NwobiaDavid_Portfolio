// import { Button } from "@/components/ui/button";
import { Gamepad, GraduationCap, LayoutTemplate, PackageOpen, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "usehooks-ts";
import { Separator } from "@/components/ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { FlowAppButton } from "@/components/content/flow-app-button";
import { Badge } from "@/components/ui/badge";
import { MainProjects } from "@/constants/data/projects";

export default function Projects() {
  useDocumentTitle("David Nwobia | Projects");

  // Pick 4 best projects across Frontend, Full Stack and Backend (data-related) categories
  // const bestProjects = Projectss.filter((value) =>
  //   value.categories.includes(Category.FRONTEND) ||
  //   value.categories.includes(Category.FULLSTACK) ||
  //   value.categories.includes(Category.BACKEND)
  // ).slice(0, 4);


  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, when: "beforeChildren" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="p-2 md:p-5 w-screen md:w-full h-full overflow-auto">
      <div className=" md:mb-2">
        <div className="flex justify-between p_style">
          <h3 className="scroll-m-20 p_style text-2xl font-semibold tracking-tight">
            Projects
          </h3>
        </div>
        <h4 className="scroll-m-20 p_style text-lg text-muted-foreground font-semibold tracking-tight mt-6">
          Featured Projects ({MainProjects.length})
        </h4>
      </div>
      <Separator />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-y-auto pb-7 px-2 gap-5 pt-5 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 h-[73.5%] xl:h-[69%] 2xl:h-[72%] "
      >
        <AnimatePresence>
          {MainProjects.map((value) => (
            <motion.div
              key={value.title}
              variants={cardVariants}
            >
              <motion.div
                className="flex md:px-4 px-1 dark:bg-[#0F172A] py-4 flex-col rounded-lg border w-[100%] lg:w-[100%] xl:w-[100%] h-[450px] lg:h-[480px] lg:items-center gap-4 shadow-lg"
              >
                <Link to={value.id} className="w-full object-contain border  rounded-lg overflow-hidden h-[45%] " >
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={value.imgUrl}
                    alt={value.title}
                    className=" h-full  w-full "
                  />
                </Link>
                <Separator />
                <div className="flex h-[55%] flex-col py-2 px-3 lg:px-0 gap-4">
                  <div className="h-[80%]">
                    <p className="text-lg mb-1 font-semibold p_style ">{value.title}</p>
                    <p className="text-sm body_style line-clamp-3 lg:line-clamp-4">
                      {truncateText(value.description, 100)}
                    </p>

                    <div className="py-2 flex-wrap p_style flex gap-2">
                      {value.stack.map((item, index) => (
                        <Badge key={index}>{item}</Badge>
                      ))}
                    </div>

                  </div>
                  <div className="flex h-[20%] w-full p_style items-center gap-2">
                    {value.githubUrl && (
                      <Link to={value.githubUrl} className="w-1/2" target="_blank" >
                        <div className="w-full p-3 group rounded-lg flex items-center justify-center border duration-200 dark:bg-background bg-secondary hover:bg-accent dark:hover:bg-secondary active:scale-95 " >
                          {/* <Github className="h-4 w-4 mr-2" /> */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                            className="w-4 h-4 mr-2 md:w-5 md:h-5 fill-current"
                          >
                            <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5c0 5.29 3.438 9.773 8.205 11.366.6.111.82-.261.82-.58 0-.287-.011-1.244-.017-2.257-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.833 2.807 1.304 3.492.997.108-.776.418-1.305.762-1.605-2.665-.303-5.466-1.333-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 3.004-.404c1.019.005 2.047.138 3.004.404 2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.805 5.625-5.476 5.922.43.37.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.697.825.579C20.565 22.27 24 17.788 24 12.5 24 5.87 18.627 0.5 12 0.5z" />
                          </svg>

                          Github
                        </div>
                      </Link>
                    )}
                    {value.liveDemo && (
                      <Link className="w-1/2" to={value.liveDemo} target="_blank" >
                        <div className="w-full p-3 group rounded-lg flex items-center justify-center border duration-200 dark:bg-background bg-secondary hover:bg-accent dark:hover:bg-secondary  active:scale-95 ">
                          <LayoutTemplate className="h-4 w-4 mr-2" />
                          Live Demo
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <div className="md:fixed bottom-[15px]">
        <FlowAppButton
          containerClassName="p-5"
          leftTitle="Experiences"
          leftDescription="timeline of my work experiences"
          leftIcon={<PackageOpen />}
          leftRoute="/experiences"
          rightTitle="Education"
          rightDescription="history of my academics timeline"
          rightIcon={<GraduationCap />}
          rightRoute="/education"
        />
      </div>
    </div>
  );
}