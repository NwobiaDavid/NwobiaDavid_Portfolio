import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MainProjects } from "@/constants/data/projects";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import IconGithub from "@/components/svg/github-svg";
import { useDocumentTitle } from "usehooks-ts";
import { FlowAppButton } from "@/components/content/flow-app-button";
import { PageShell } from "@/components/page-header";

const ProjectDetail: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const project = MainProjects.find((proj) => proj.id === id);
  useDocumentTitle(project ? `David Nwobia | ${project.title}` : "David Nwobia | Projects");

  if (!project) {
    return (
      <PageShell className="flex flex-1 flex-col items-start justify-center">
        <h1 className="text-3xl font-semibold tracking-[-0.02em]">Project not found</h1>
        <p className="mt-3 text-muted-foreground">There is no project at this address. It may have been renamed or removed.</p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/projects">See all projects</Link>
        </Button>
      </PageShell>
    );
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

  return (
    <PageShell className="max-w-6xl">
      <header className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-[-0.03em] md:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          {project.impact && (
            <p className="mt-3 text-base font-medium text-foreground/75">{project.impact}</p>
          )}
        </div>

        <p className="max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-3">
          {project.liveDemo && (
            <Button asChild className="gap-1.5 font-display font-semibold">
              <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">
                Live demo
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Button>
          )}
          {project.githubUrl && (
            <Button asChild variant="outline" className="gap-2 font-display font-semibold">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <IconGithub className="h-4 w-4" />
                GitHub
              </a>
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-4">
          <h2 className="shrink-0 font-sans text-sm font-medium text-muted-foreground">Built with</h2>
          <ul className="flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li
                key={item}
                data-no-blobity
                className="rounded-md border bg-background/50 px-2 py-0.5 text-sm text-foreground/80"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </header>

      <figure className="mt-10 overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10">
        {hasVideo ? (
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={project.video}
              title={`${project.title} demo video`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            ></iframe>
          </div>
        ) : (
          <img
            src={project.imgUrl}
            alt={`${project.title} screenshot`}
            decoding="async"
            className="h-auto w-full"
          />
        )}
      </figure>

      <FlowAppButton
        leftTitle="Back"
        leftDescription="go back to the list of projects"
        leftRoute={handleBackClick}
        rightTitle="Next Project"
        rightDescription={nextProject.title}
        rightRoute={`/projects/${nextProject.id}`}
      />
    </PageShell>
  );
};

export default ProjectDetail;
