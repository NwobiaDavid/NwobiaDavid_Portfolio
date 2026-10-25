// The top-level pages, in sidebar order. They keep their own URLs but share one
// scrolling page, so the reader can move between them with the scroll wheel.
export const sections = [
  { path: "/", title: "David Nwobia | Home" },
  { path: "/experiences", title: "David Nwobia | Experiences" },
  { path: "/projects", title: "David Nwobia | Projects" },
  { path: "/education", title: "David Nwobia | Education" },
  { path: "/skills", title: "David Nwobia | Skills" },
  { path: "/certifications", title: "David Nwobia | Certificates" },
  { path: "/publications", title: "David Nwobia | Publications" },
] as const;

export type SectionPath = (typeof sections)[number]["path"];

const normalize = (pathname: string) => (pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname);

export const sectionIndex = (pathname: string) => {
  const path = normalize(pathname);
  return sections.findIndex((section) => section.path === path);
};

/** Every section is the same page; anything else (a case study, login) is a page of its own. */
export const pageKeyFor = (pathname: string) => (sectionIndex(pathname) >= 0 ? "sections" : pathname);
