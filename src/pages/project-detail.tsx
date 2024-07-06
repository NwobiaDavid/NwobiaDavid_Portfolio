// src/pages/project-detail.tsx

import React from "react";
import { useParams } from "react-router-dom";
import { Projects } from "@/constants/data/projects";
import { Button } from "@/components/ui/button";
import { Github, LayoutTemplate } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";

const ProjectDetail: React.FC = () => {
    useDocumentTitle("Nwobia David | Projects");

  const { id } = useParams<{ id: string }>();
  const project = Projects.find((proj) => proj.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold">{project.title}</h1>
      <img
        src={project.imgUrl}
        alt={project.title}
        className="my-4 w-full rounded-md"
      />
      <p className="text-lg">{project.description}</p>
      <div className="flex gap-2 mt-4">
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
  );
};

export default ProjectDetail;
