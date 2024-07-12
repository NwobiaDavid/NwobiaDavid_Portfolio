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
    <div className="py-5 px-20 ">
      <div className="flex justify-between items-center ">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <div className="flex gap-2">
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
      <div className=" mt-5 mb-5 " >
        <p className="text-lg">{project.description}</p>
      </div>


      <div>

        {/* <div className="flex gap-2 w-[30%] py-5 bg-gray-300 rounded-lg px-2 flex-col "> */}
          {/* <div className="" >
            <h3 className="text-lg font-semibold capitalize  " >tech stack</h3>
            <p className=" text-sm " >a list of the tech i used for this project</p>
          </div> */}
          <div className="flex justify-center " >
            {project.stack.map((item, index)=>(
              <div key={index} className=" px-3 text-sm py-1 bg-black text-white duration-200 rounded-full border  " >
                {item}
              </div>
            ))}
          </div>
        </div>

      {/* </div> */}


      <div className=" mt-5 flex justify-center items-center h-[400px] " >
      <div className="w-[60%] border overflow-hidden rounded-lg h-full ">
        <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/B9gQ_jQBd6I"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
      </div>
      </div>
      
    </div>
  );
};

export default ProjectDetail;
