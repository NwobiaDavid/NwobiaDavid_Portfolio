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
import { Badge } from "@/components/ui/badge";
import { Projectss, Category } from "@/constants/data/projects";

export default function Projects() {
  useDocumentTitle("Nwobia David | Projects");
  const [category, setCategory] = useState<string>("ALL");

  const selectedCategory: Category =
    Category[category as keyof typeof Category] || Category.FRONTEND;

  // Filter projects based on the selected category
  const filteredProjects =
    category === "ALL"
      ? Projectss
      : Projectss.filter((value) => value.category === selectedCategory);

  return (
    <div className="p-2 md:p-5 w-screen md:w-full h-full overflow-auto">
      <div className="h-[14%] md:mb-2">
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
      <div className="overflow-y-auto pb-7 px-2 gap-5 pt-2 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 h-[73.5%]">
        <AnimatePresence>
          {filteredProjects.map((value) => (
            <Link key={value.title} to={value.id}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="flex md:px-2 px-1 py-2 flex-col rounded-lg border w-[100%] lg:w-[100%] xl:w-[450px] h-[400px] lg:items-center gap-4 shadow-lg"
              >
                <img
                  src={value.imgUrl}
                  alt={value.title}
                  className="object-contain h-[30%] rounded-md w-full "
                />
                <Separator />
                <div className="flex h-[70%] flex-col py-2 px-6 gap-4">
                  <div className="h-[80%]">
                    <p className="text-lg mb-1 font-semibold">{value.title}</p>
                    <p className="text-sm line-clamp-3 lg:line-clamp-4">
                      {value.description}
                    </p>
                    <div className="py-2 flex gap-2">
                      {value.stack.map((item, index) => (
                        <Badge key={index}>{item}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex h-[20%] items-center gap-2">
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
            </Link>
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
