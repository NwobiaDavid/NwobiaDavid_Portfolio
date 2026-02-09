// src/pages/project-detail.tsx

import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Projectss } from "@/constants/data/projects";
import { Button } from "@/components/ui/button";
import { Github, LayoutTemplate } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";
import { Dot } from 'lucide-react';
import { FlowAppButton } from "@/components/content/flow-app-button";

const ProjectDetail: React.FC = () => {
  useDocumentTitle("David Nwobia | Projects");

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const project = Projectss.find((proj) => proj.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const currentIndex = Projectss.findIndex((proj) => proj.id === id);

  const nextProjectIndex = (currentIndex + 1) % Projectss.length;
  const nextProject = Projectss[nextProjectIndex];

  const handleBackClick = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/projects');
    }
  };

  // Check if project has a valid video URL
  const hasVideo = project.video && project.video.trim() !== '';

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
          <div className="flex flex-col justify-center items-center p-3 rounded-lg ">
            <h3 className="font-bold uppercase" >tech stack</h3>
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


      <div className=" mt-5 mb-5 relative z-10 flex flex-col justify-center items-center h-[200px] lg:h-[400px] " >
        <div className=" w-[90%] lg:w-[60%] border-2 overflow-hidden rounded-lg h-full ">
          {hasVideo ? (
            <iframe
              width="100%"
              height="100%"
              src={project.video}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <img
              src={project.imgUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <p className=" mt-4 font-bold opacity-40 " >
            {hasVideo ? `${project.title} demo video` : `${project.title} project preview`}
          </p>
        </div>
      </div>

      <div className=" flex lg:flex-row mt-[90px] flex-col pb-16  gap-5 " >

        <div className=" p-5 w-[40%] bg-[#F8FAFC] dark:bg-[#0F172A] border-2 rounded-md ">
          <h2 className=" text-3xl uppercase " >key features:</h2>

          <div className="mt-3" >
            {project.keyFeatures.map((item, index) => (
              <div key={index} className=" text-lg flex body_style  " >
                <span>
                  <Dot />
                </span>
                <span className="ml-2" >{item}</span>
              </div>
            ))}
          </div>
        </div>


        <div className=" w-[60%] " >

          <div className=" w-full flex gap-5 overflow-hidden border mb-5 border-black dark:border-gray-300 rounded-lg " >

            <div className=" bg-black dark:bg-gray-200 dark:text-slate-900 p-4 text-white w-[50%] " >
              <h3 className=" text-xl mb-1 uppercase " >challenges</h3>
              <p className=" body_style tracking-tight leading-5 " >
                {project.challenges}
              </p>
            </div>

            <div className=" w-[50%] p-3 " >
              <h3 className=" text-xl mb-1 uppercase " >solutions</h3>
              <p className=" body_style tracking-tight leading-5 " >
                {project.solutions}
              </p>
            </div>


          </div>

          <div className=" h-[230px] border-2 rounded-lg border-gray-500 dark:border p-3 " >
            <h2 className="text-5xl mb-2 font-semibold text-center uppercase " > Thought Process</h2>

            <p className=" text-xl body_style " >
              {project.thoughtProcess}
            </p>
          </div>

        </div>


      </div>

      <FlowAppButton
        containerClassName="pt-5"
        leftTitle="Back"
        leftDescription="go back to the list of projects"
        leftRoute={handleBackClick}
        rightTitle="Next Project"
        rightDescription="go to the next project"
        rightRoute={`/projects/${nextProject.id}`}

      />

    </div>
  );
};

export default ProjectDetail;