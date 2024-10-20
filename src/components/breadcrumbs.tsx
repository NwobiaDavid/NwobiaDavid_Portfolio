import {
  Book,
  Contact,
  DoorClosed,
  Folder,
  Gamepad,
  ShieldCheck,
  Home,
  User,
  Wrench,
  GraduationCap,
  PackageOpen
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const iconMap: Record<string, React.ReactElement> = {
  home: <Home className="h-4 w-4" />,
  profile: <User className="h-4 w-4" />,
  hobby: <Gamepad className="h-4 w-4" />,
  articles: <Book className="h-4 w-4" />,
  projects: <Folder className="h-4 w-4" />,
  project2: <Folder className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  experiences: <PackageOpen className="h-4 w-4" />,
  certifications: <ShieldCheck className="h-4 w-4" />,
  skills: <Wrench className="h-4 w-4" />,
  contact: <Contact className="h-4 w-4" />,
  login: <DoorClosed className="h-4 w-4" />
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <div className="hidden md:flex gap-3  items-center bg-primary-foreground p-2 rounded-md text-sm font-bold">
      <Link to="/" className="flex items-center gap-2">
        {iconMap["home"]}
        Home
      </Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name.replace("-", "");

        return (
          <span key={name} className="flex capitalize items-center gap-2">
            {`>`}
            {isLast ? (
              <>
                {iconMap[displayName] || <span className=""></span>}
                {displayName}
              </>
            ) : (
              <Link to={routeTo} className="flex items-center gap-2">
                {iconMap[displayName] || <span className="h-4 w-4"></span>}
                {displayName}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;
