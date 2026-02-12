import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainProjects } from "@/constants/data/projects";
import { Button } from "@/components/ui/button";
import { Github, LayoutTemplate } from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";
import { Dot } from 'lucide-react';
import { FlowAppButton } from "@/components/content/flow-app-button";
import { motion } from "framer-motion";

const ProjectDetail: React.FC = () => {
  useDocumentTitle("David Nwobia | Projects");

  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const project = MainProjects.find((proj) => proj.id === id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const currentIndex = MainProjects.findIndex((proj) => proj.id === id);

  const nextProjectIndex = (currentIndex + 1) % MainProjects.length;
  const nextProject = MainProjects[nextProjectIndex];

  const handleBackClick = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/projects');
    }
  };

  // Check if project has a valid video URL
  const hasVideo = project.video && project.video.trim() !== '';

  const sectionVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-6 px-3 md:px-6 xl:px-16 2xl:px-24">
      {/* Header */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex justify-between lg:flex-row flex-col gap-4 lg:items-center"
      >
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Case study
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold p_style">
            {project.title}
          </h1>
        </div>
        <div className="flex lg:flex-col flex-row w-full lg:w-[20%] gap-2 z-10  justify-end">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              className="w-1/2 lg:w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full gap-2">
                <Github className="h-4 w-4" />
                Github
              </Button>
            </a>
          )}
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              className="w-1/2 lg:w-full"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" className="w-full gap-2">
                <LayoutTemplate className="h-4 w-4" />
                Live demo
              </Button>
            </a>
          )}
        </div>
      </motion.div>

      {/* Intro + tech stack */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.05 }}
        className="mt-6 mb-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-start"
      >
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground p_style">
            Overview
          </p>
          <p className="text-base md:text-lg body_style text-muted-foreground">
            {project.description}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] p-4 md:p-5 shadow-sm">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-3 p_style">
            Tech stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((item, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs md:text-sm rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60 p_style"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Media section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-4 mb-10 relative z-10"
      >
        <div className="w-full lg:w-4/5 xl:w-3/4 mx-auto overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#020617] aspect-video shadow-md">
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
        <p className="mt-4 text-xs text-center uppercase tracking-[0.25em] text-muted-foreground p_style">
          {hasVideo ? `${project.title} demo video` : `${project.title} project preview`}
        </p>
      </motion.div>

      {/* Content grid */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.25 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)] pb-16"
      >
        {/* Key features */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] p-5 md:p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-muted-foreground mb-4 p_style">
            Key features
          </h2>
          <div className="space-y-2">
            {project.keyFeatures.map((item, index) => (
              <div key={index} className="text-sm md:text-base flex body_style">
                <span className="mt-[2px] text-muted-foreground">
                  <Dot />
                </span>
                <span className="ml-2">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges, solutions, thought process */}
        <div className="space-y-5">
          <div className="w-full grid gap-4 md:grid-cols-2 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFC] dark:bg-[#0F172A] shadow-sm">
            <div className="bg-black dark:bg-gray-100 dark:text-slate-900 text-white p-4 md:p-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                Challenges
              </h3>
              <p className="body_style text-sm md:text-base leading-relaxed">
                {project.challenges}
              </p>
            </div>

            <div className="p-4 md:p-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3">
                Solutions
              </h3>
              <p className="body_style text-sm md:text-base leading-relaxed">
                {project.solutions}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-5 md:p-6 bg-[#F8FAFC] dark:bg-[#020817]">
            <h2 className="text-xs font-semibold uppercase tracking-[0.25em] mb-3 text-muted-foreground text-center p_style">
              Thought process
            </h2>
            <p className="text-sm md:text-base body_style text-center md:text-left leading-relaxed">
              {project.thoughtProcess}
            </p>
          </div>
        </div>
      </motion.div>

      <FlowAppButton
        containerClassName="pt-3"
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