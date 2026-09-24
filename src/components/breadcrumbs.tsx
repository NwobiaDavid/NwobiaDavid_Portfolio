import {
  Book,
  ChevronRight,
  Contact,
  DoorClosed,
  Folder,
  Gamepad,
  ShieldCheck,
  Home,
  User,
  Wrench,
  GraduationCap,
  PackageOpen,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MainProjects } from "@/constants/data/projects";
import { cn } from "@/lib/utils";

const iconClass = "h-3.5 w-3.5 shrink-0";

const iconMap: Record<string, React.ReactElement> = {
  home: <Home className={iconClass} />,
  profile: <User className={iconClass} />,
  hobby: <Gamepad className={iconClass} />,
  articles: <Book className={iconClass} />,
  projects: <Folder className={iconClass} />,
  education: <GraduationCap className={iconClass} />,
  experiences: <PackageOpen className={iconClass} />,
  certifications: <ShieldCheck className={iconClass} />,
  skills: <Wrench className={iconClass} />,
  contact: <Contact className={iconClass} />,
  login: <DoorClosed className={iconClass} />,
};

// A project URL ends in its id; the trail should read its name instead.
const labelFor = (segment: string, parent?: string) => {
  if (parent === "projects") {
    return MainProjects.find((project) => project.id === segment)?.title ?? segment;
  }
  return segment.replace(/-/g, " ");
};

const crumb =
  "flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors duration-150";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const atHome = pathnames.length === 0;

  return (
    <ol className="hidden min-w-0 items-center gap-0.5 text-sm md:flex">
      <li className="flex items-center">
        {atHome ? (
          <span aria-current="page" className={cn(crumb, "font-medium text-foreground")}>
            {iconMap.home}
            Home
          </span>
        ) : (
          <Link to="/" className={cn(crumb, "text-muted-foreground hover:bg-muted/70 hover:text-foreground")}>
            {iconMap.home}
            Home
          </Link>
        )}
      </li>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const label = labelFor(name, pathnames[index - 1]);
        const icon = iconMap[name];

        return (
          <li key={routeTo} className="flex min-w-0 items-center gap-0.5">
            <ChevronRight aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
            {isLast ? (
              <span aria-current="page" className={cn(crumb, "min-w-0 font-medium capitalize text-foreground")}>
                {icon}
                <span className="truncate">{label}</span>
              </span>
            ) : (
              <Link
                to={routeTo}
                className={cn(crumb, "capitalize text-muted-foreground hover:bg-muted/70 hover:text-foreground")}
              >
                {icon}
                {label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  );
};

export default Breadcrumbs;
