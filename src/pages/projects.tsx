import { ArrowUpRight, GraduationCap, PackageOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useDocumentTitle } from "usehooks-ts";
import { FlowAppButton } from "@/components/content/flow-app-button";
import { MainProjects } from "@/constants/data/projects";
import { PageHeader, PageShell } from "@/components/page-header";

const externalLink =
  "inline-flex items-center gap-1 rounded-md text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground";

export default function Projects() {
  useDocumentTitle("David Nwobia | Projects");

  return (
    <PageShell>
      <PageHeader title="Projects" meta={MainProjects.length} />

      <ul className="stagger grid gap-x-8 gap-y-12 sm:grid-cols-2 2xl:grid-cols-3">
        {MainProjects.map((project, index) => (
          <li key={project.id} data-no-blobity style={{ "--i": index } as React.CSSProperties}>
            <article className="group flex h-full flex-col">
              <Link
                to={project.id}
                aria-label={`${project.title} case study`}
                data-no-blobity
                className="block aspect-[16/10] overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10"
              >
                <img
                  src={project.imgUrl}
                  alt=""
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                />
              </Link>

              <div className="mt-4 flex flex-1 flex-col">
                <h2 className="text-xl font-semibold tracking-[-0.01em]">
                  <Link to={project.id} className="underline-offset-4 hover:underline">
                    {project.title}
                  </Link>
                </h2>
                {project.impact && (
                  <p className="mt-1 text-sm font-medium text-foreground/75">{project.impact}</p>
                )}
                <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <ul aria-label="Stack" className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <li
                      key={item}
                      data-no-blobity
                      className="rounded-md border bg-background/50 px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex items-center gap-5 pt-5">
                  <Link to={project.id} className="inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">
                    Case study
                  </Link>
                  {project.liveDemo && (
                    <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className={externalLink}>
                      Live demo
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={externalLink}>
                      GitHub
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <FlowAppButton
        leftTitle="Experiences"
        leftDescription="timeline of my work experiences"
        leftIcon={<PackageOpen />}
        leftRoute="/experiences"
        rightTitle="Education"
        rightDescription="history of my academics timeline"
        rightIcon={<GraduationCap />}
        rightRoute="/education"
      />
    </PageShell>
  );
}
