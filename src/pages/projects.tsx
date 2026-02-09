import { Button } from "@/components/ui/button";
import { Gamepad, Github, LayoutTemplate, Star, Wrench } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Projectss, Category } from "@/constants/data/projects";

export default function Projects() {
  useDocumentTitle("David Nwobia | Projects");
  const [category, setCategory] = useState<string>("ALL");

  // const selectedCategory: Category =
  //   Category[category as keyof typeof Category] || Category.FRONTEND;

  // Filter projects based on the selected category
  const filteredProjects = (() => {
    if (category === "ALL") {
      return Projectss;
    }

    const selectedCategory: Category = Category[category as keyof typeof Category];
    if (selectedCategory === undefined) {
      return Projectss;
    }

    return Projectss.filter((value) => value.categories.includes(selectedCategory));
  })();

  function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  return (
    <div className="p-2 md:p-5 w-screen md:w-full h-full overflow-auto">
      <div className="h-[14%] md:mb-2">
        <div className="flex justify-between p_style">
          <h3 className="scroll-m-20 p_style text-2xl font-semibold tracking-tight">
            Projects
          </h3>
          <Select
            defaultValue={category}
            onValueChange={(value) => setCategory(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent className=" p_style " >
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="FEATURED"><div className="flex items-center gap-2"> <Star size={20} className="text-yellow-500 " /> Featured</div></SelectItem>
              <SelectItem value="FRONTEND">Frontend</SelectItem>
              <SelectItem value="BACKEND">Backend</SelectItem>
              <SelectItem value="FULLSTACK">Full Stack</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <h4 className="scroll-m-20 p_style text-lg text-muted-foreground font-semibold tracking-tight mt-6">
          {category} ({filteredProjects.length})
        </h4>
      </div>
      <Separator />
      <div className="overflow-y-auto pb-7 px-2 gap-5 pt-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 h-[73.5%] xl:h-[69%] 2xl:h-[72%] ">
        <AnimatePresence>
          {filteredProjects.map((value) => (
            <div key={value.title} >
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="flex md:px-2 px-1 dark:bg-[#0F172A] py-2 flex-col rounded-lg border w-[100%] lg:w-[100%] xl:w-[100%] h-[450px] lg:h-[480px] lg:items-center gap-4 shadow-lg"
              >
                <Link to={value.id} className="w-full object-contain border  rounded-lg overflow-hidden h-[45%] " >
                  <motion.img
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    src={value.imgUrl}
                    alt={value.title}
                    className=" h-full  w-full "
                  />
                </Link>
                <Separator />
                <div className="flex h-[55%] flex-col py-2 px-3 lg:px-6 gap-4">
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
                  <div className="flex h-[20%] p_style items-center gap-2">
                    {value.githubUrl && (
                      <Link to={value.githubUrl} target="_blank" >
                        <Button variant="outline">
                          <Github className="h-4 w-4 mr-2" />
                          Github
                        </Button>
                      </Link>
                    )}
                    {value.liveDemo && (
                      <Link to={value.liveDemo} target="_blank" >
                        <Button variant="outline">
                          <LayoutTemplate className="h-4 w-4 mr-2" />
                          Live Demo
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>
      <div className="md:fixed bottom-[15px]">
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
    </div>
  );
}