import { useDocumentTitle } from "usehooks-ts";
import { ArrowUpRight, Contact, ShieldCheck } from "lucide-react";
import { FlowAppButton } from "@/components/content/flow-app-button";
import { PageHeader, PageShell } from "@/components/page-header";

const SCHOLAR_PROFILE = "https://scholar.google.com/citations?user=YkGtZM4AAAAJ&hl=en";
const RESEARCHGATE_PROFILE = "https://www.researchgate.net/profile/David-Nwobia";
const scholarEntry = (id: string) =>
  `https://scholar.google.com/citations?view_op=view_citation&hl=en&user=YkGtZM4AAAAJ&citation_for_view=YkGtZM4AAAAJ:${id}`;

interface Publication {
  title: string;
  authors: string[];
  venue?: string;
  /** Volume, issue and pages, already formatted. */
  details?: string;
  year: number;
  link: string;
}

// Most-recent first, mirroring the Google Scholar profile.
const publications: Publication[] = [
  {
    title: "Modelling of High-fidelity Magnetic Materials for Electric Vehicles",
    authors: [
      "O. C. Olawole", "D. U. Nwobia", "O. F. Olawole", "D. O. Olawole", "B. O. Ayinmode", "M. Ariyo",
      "C. P. Adighije", "E. C. Mbey-Ogbonnaya", "J. O. Mbila-uma", "C. O. Iheanacho", "E. S. Ekemezie",
      "T. S. Olowookere", "E. S. Joel", "O. Nwamata", "A. A. Ajayi", "J. O. Ozuomba", "O. F. Oladapo",
      "C. S. Akpota", "S. A. Akinwumi", "T. A. Adagunodo", "O. Ayanbisi", "W. A. Ayara", "S. Akinmeji",
      "D. K. De",
    ],
    venue: "Anchor University Journal of Science and Technology",
    details: "7(2), 162–173",
    year: 2026,
    link: "https://www.ajol.info/index.php/aujst/article/view/339034",
  },
  {
    title: "Design of a Sensor-Based Misalignment Detector for Wireless Electric Vehicle Charging Systems",
    authors: [
      "T. A. Adagunodo", "O. C. Olawole", "D. U. Nwobia", "O. Ayanbisi", "B. O. Ayinmode", "J. O. Mbila-uma",
      "L. I. Akindapo", "M. Ariyo", "W. A. Ayara", "O. F. Oladapo", "O. F. Olawole", "D. O. Olawole",
      "S. A. Akinwumi",
    ],
    venue: "Journal of Harbin Engineering University",
    details: "47(2), 187–191",
    year: 2026,
    link: scholarEntry("9yKSN-GCB0IC"),
  },
  {
    title: "Development of an Automatic Pumping Machine and Filter for Residential Water Supply",
    authors: [
      "I. L. Akindapo", "O. C. Olawole", "D. U. Nwobia", "W. A. Ayara", "O. Ayanbisi", "J. A. Achuka",
      "B. O. Ayinmode", "M. Ariyo",
    ],
    year: 2025,
    link: scholarEntry("u5HHmVD_uO8C"),
  },
];

const ProfileLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-0.5 text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors duration-150 hover:decoration-foreground"
  >
    {children}
    <ArrowUpRight className="h-3.5 w-3.5" />
  </a>
);

const isMe = (author: string) => author.includes("Nwobia");

// Author lists here run long. Keep everyone up to one name past mine, then summarise the rest.
const Authors = ({ authors }: { authors: string[] }) => {
  const shown = authors.slice(0, Math.max(3, authors.findIndex(isMe) + 2));
  const rest = authors.length - shown.length;
  return (
    <p className="text-sm leading-relaxed text-muted-foreground">
      {shown.map((author, i) => (
        <span key={author}>
          {i > 0 && ", "}
          {isMe(author) ? <span className="font-medium text-foreground">{author}</span> : author}
        </span>
      ))}
      {rest > 0 && <span title={authors.slice(shown.length).join(", ")}>, …</span>}
    </p>
  );
};

export default function Publications() {
  useDocumentTitle("David Nwobia | Publications");

  return (
    <PageShell>
      <PageHeader
        title="Publications"
        meta={publications.length}
        description={
          <>
            Peer-reviewed research from my physics work, mostly on electric vehicle systems. The full record lives on{" "}
            <ProfileLink href={SCHOLAR_PROFILE}>Google Scholar</ProfileLink> and{" "}
            <ProfileLink href={RESEARCHGATE_PROFILE}>ResearchGate</ProfileLink>.
          </>
        }
      />

      <ol className="stagger flex flex-col">
        {publications.map((pub, index) => (
          <li
            key={pub.title}
            data-no-blobity
            style={{ "--i": index } as React.CSSProperties}
            className="grid grid-cols-1 gap-1 border-t py-6 last:border-b sm:grid-cols-[4.5rem_1fr] sm:gap-6"
          >
            <span className="pt-0.5 text-sm text-muted-foreground tabular-nums">{pub.year}</span>
            <article className="flex flex-col gap-2">
              <h2 className="max-w-[70ch] text-lg font-semibold leading-snug tracking-[-0.01em]">
                <a
                  href={pub.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline decoration-foreground/30 underline-offset-4 hover:underline"
                >
                  {pub.title}
                  <ArrowUpRight className="ml-1 inline h-4 w-4 align-[-0.125em] text-muted-foreground transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </h2>
              <Authors authors={pub.authors} />
              {pub.venue && (
                <p className="text-sm text-muted-foreground">
                  <span className="italic">{pub.venue}</span>
                  {pub.details && <>, {pub.details}</>}
                </p>
              )}
            </article>
          </li>
        ))}
      </ol>

      <FlowAppButton
        leftTitle="Certifications"
        leftDescription="see institutions backing up my skills"
        leftIcon={<ShieldCheck />}
        leftRoute="/certifications"
        rightTitle="Say hi"
        rightDescription="reach out to me through these channels"
        rightIcon={<Contact />}
      />
    </PageShell>
  );
}
