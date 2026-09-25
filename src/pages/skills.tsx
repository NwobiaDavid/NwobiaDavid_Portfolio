import IconExpress from "@/components/svg/express-svg";
import IconFirebase from "@/components/svg/firebase-svg";
import IconGit from "@/components/svg/git-svg";
import IconBrandJavascript from "@/components/svg/javascript-svg";
import IconMongodb from "@/components/svg/mongodb-svg";
import IconNextjs from "@/components/svg/nextjs-svg";
import IconPython from "@/components/svg/python-svg";
import IconReact from "@/components/svg/react-svg";
import IconSupabase from "@/components/svg/supabase-svg";
import IconTypescript from "@/components/svg/typescript-svg";
import IconCplusjs from "@/components/svg/cplusplus-svg";
import IconDocker from "@/components/svg/docker-svg";
import IconElectron from "@/components/svg/electron-svg";
import { useDocumentTitle } from "usehooks-ts";
import { FlowAppButton } from "@/components/content/flow-app-button";
import { Folder, ShieldCheckIcon } from "lucide-react";
import { PageHeader, PageShell } from "@/components/page-header";

type IconComponent = (props: React.SVGProps<SVGSVGElement>) => JSX.Element;

interface SkillGroup {
  title: string;
  /** Icon is optional: not every tool has an SVG in components/svg yet. */
  skills: { title: string; icon?: IconComponent }[];
}

// Grouped to match the CV's skills section.
const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    skills: [
      { title: "TypeScript", icon: IconTypescript },
      { title: "JavaScript", icon: IconBrandJavascript },
      { title: "Python", icon: IconPython },
      { title: "C++", icon: IconCplusjs },
      { title: "SQL" },
    ],
  },
  {
    title: "Frontend & mobile",
    skills: [
      { title: "React", icon: IconReact },
      { title: "Next.js", icon: IconNextjs },
      { title: "React Native", icon: IconReact },
      { title: "Redux" },
      { title: "Zustand" },
      { title: "GSAP" },
      { title: "Electron", icon: IconElectron },
    ],
  },
  {
    title: "Backend",
    skills: [
      { title: "Node.js" },
      { title: "Express", icon: IconExpress },
      { title: "FastAPI" },
      { title: "REST APIs" },
      { title: "JWT / NextAuth" },
    ],
  },
  {
    title: "AI & search",
    skills: [
      { title: "LangChain" },
      { title: "Groq" },
      { title: "Embeddings" },
      { title: "RAG" },
    ],
  },
  {
    title: "Data & DevOps",
    skills: [
      { title: "PostgreSQL" },
      { title: "Supabase", icon: IconSupabase },
      { title: "MongoDB", icon: IconMongodb },
      { title: "Firebase", icon: IconFirebase },
      { title: "Docker", icon: IconDocker },
      { title: "Git", icon: IconGit },
      { title: "CI/CD" },
      { title: "Vercel" },
    ],
  },
];

export default function Skills() {
  useDocumentTitle("David Nwobia | Skills");

  return (
    <PageShell>
      <PageHeader title="Skills" />

      <dl className="stagger divide-y border-y">
        {skillGroups.map((group, index) => (
          <div
            key={group.title}
            className="grid gap-3 py-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-6"
            style={{ "--i": index } as React.CSSProperties}
          >
            <dt className="pt-2 font-display text-base font-semibold">{group.title}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {group.skills.map(({ title, icon: Icon }) => (
                  <li
                    key={title}
                    data-no-blobity
                    className={`flex h-10 items-center gap-2.5 rounded-lg border bg-background/40 pr-3.5 text-[0.95rem] ${Icon ? "pl-2.5" : "pl-3.5"}`}
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0" aria-hidden />}
                    {title}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>

      <FlowAppButton
        leftTitle="Projects"
        leftDescription="see what I'm working on"
        leftIcon={<Folder />}
        leftRoute="/projects"
        rightTitle="Certifications"
        rightDescription="see institutions backing up my skills"
        rightIcon={<ShieldCheckIcon />}
        rightRoute="/certifications"
      />
    </PageShell>
  );
}
