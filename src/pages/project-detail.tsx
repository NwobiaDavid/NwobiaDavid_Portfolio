// src/pages/project-detail.tsx

import React from "react";
import { useParams } from "react-router-dom";
import { Projectss } from "@/constants/data/projects";
import { Button } from "@/components/ui/button";
import { Github, LayoutTemplate } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";

const ProjectDetail: React.FC = () => {
  useDocumentTitle("Nwobia David | Projects");

  const { id } = useParams<{ id: string }>();
  const project = Projectss.find((proj) => proj.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="py-5 px-3 xl:px-20 ">

      <div className="flex justify-between lg:flex-row flex-col items-center ">
        <h1 className="text-5xl mb-3 lg:mb-0 font-bold">{project.title}</h1>
        <div className="flex gap-2 z-10 ">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                <Github className="h-4 w-4 mr-2" />
                Github
              </Button>
            </a>
          )}
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">
                <LayoutTemplate className="h-4 w-4 mr-2" />
                Live Demo
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className=" mt-6 mb-5 " >
        <p className=" p_style font-bold capitalize " >description</p>
        <p className="text-lg body_style capitalize text-center lg:text-left ">{project.description}</p>
      </div>


      <div>
        <div className="flex justify-center " >
          <div className="flex flex-col justify-center items-center p-3 rounded-lg bg-slate-00">
            <h3 className="font-bold capitalize " >tech stack</h3>
            <div className=" flex mt-2" >
              {project.stack.map((item, index) => (
                <div key={index} className=" p_style px-3 text-sm py-1 bg-black text-white duration-200 rounded-full border  " >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      <div className=" mt-5 relative z-10 flex flex-col justify-center items-center h-[200px] lg:h-[400px] " >
        <div className=" w-[90%] lg:w-[60%] border-2 overflow-hidden rounded-lg h-full ">
          <iframe
            width="100%"
            height="100%"
            src={project.video}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div>
          <p className=" mt-4 font-bold opacity-40 " > {project.title} demo video </p>
        </div>
      </div>

    </div>
    // <iframe width="1250" height="703" src="https://www.youtube.com/embed/KjsFCFAY1TE" title="bnc shopping telegram bot" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  );
};

export default ProjectDetail;
