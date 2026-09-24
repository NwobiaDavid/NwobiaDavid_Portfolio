import { useDocumentTitle } from "usehooks-ts";
import { AnimatePresence, motion } from "framer-motion";
import { FlowAppButton } from "@/components/content/flow-app-button";
import { ArrowUpRight, Contact, GraduationCap, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PageHeader, PageShell } from "@/components/page-header";

enum Category {
  WEBDEVELOPMENT,
  DATASCIENCE,
  OTHERS,
}

interface Certificate {
  title: string;
  image: string;
  link: string;
  category: Category;
}

const Certs: Certificate[] = [
  {
    title: "JavaScript (Intermediate) Certificate",
    link: "https://www.hackerrank.com/certificates/a26fd989b676",
    image: "/images/certs/JavaScript (Intermediate) Certificate.png",
    category: Category.WEBDEVELOPMENT
  },
  {
    title: "JavaScript (Basic) Certificate",
    link: "https://www.hackerrank.com/certificates/1ed1cb5ddcf3",
    image: "/images/certs/JavaScript (Basic) Certificate.png",
    category: Category.WEBDEVELOPMENT
  },
  {
    title: "Advanced Learning Algorithms",
    link: "https://coursera.org/verify/YUCH3EAAM63S",
    image: "/images/certs/Coursera cert 3.jpg",
    category: Category.DATASCIENCE
  },
  {
    title: "Python for Data Science, AI & Development",
    link: "https://coursera.org/verify/E28S3GM28MXA",
    image: "/images/certs/Coursera cert 2_page-0001.jpg",
    category: Category.DATASCIENCE
  },
  {
    title: "Prompt Engineering Course on Large Language Models(LLMs)",
    link: "#",
    image: "/images/certs/obs.png",
    category: Category.OTHERS
  },
  {
    title: "Machine Learning",
    link: "https://www.coursera.org/account/accomplishments/specialization/DG6UFVA4QPRJ",
    image: "/images/certs/Coursera cert 5.jpg",
    category: Category.DATASCIENCE
  },
  {
    title: "Supervised Machine Learning: Regression and Classification",
    link: "https://coursera.org/verify/LULZL2QEFZY4",
    image: "/images/certs/Coursera cert 1.png_page-0001.jpg",
    category: Category.DATASCIENCE
  },
  {
    title: "Unsupervised Learning, Recommenders, Reinforcement Learning",
    link: "https://www.coursera.org/account/accomplishments/verify/HB3XADKR5ZSA",
    image: "/images/certs/Coursera cert 6_page-0001.jpg",
    category: Category.DATASCIENCE
  },
]

const sections = [
  { title: "Web Development", category: Category.WEBDEVELOPMENT },
  { title: "Data Science", category: Category.DATASCIENCE },
  { title: "Others", category: Category.OTHERS },
];

// Critically damped: the certificate travels and settles without overshoot.
const travel = { type: "spring", bounce: 0, duration: 0.45 } as const;

export default function Certifications() {
  useDocumentTitle("David Nwobia | Certificates");

  const [selected, setSelected] = useState<Certificate | null>(null);

  return (
    <PageShell>
      <PageHeader title="Certifications" meta={Certs.length} />

      <div className="flex flex-col gap-12">
        {sections.map((section) => {
          const certs = Certs.filter((cert) => cert.category === section.category);
          return (
            <section key={section.title}>
              <h2 className="mb-5 text-xl font-semibold tracking-[-0.01em]">{section.title}</h2>
              <ul className="stagger grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {certs.map((cert, index) => (
                  <li key={cert.image} data-no-blobity style={{ "--i": index } as React.CSSProperties}>
                    <figure className="flex flex-col gap-3">
                      <button
                        type="button"
                        onClick={() => setSelected(cert)}
                        aria-label={`Enlarge ${cert.title}`}
                        data-no-blobity
                        className="group block cursor-zoom-in overflow-hidden rounded-xl bg-white p-2 ring-1 ring-foreground/10 transition-[box-shadow,transform] duration-200 ease-out hover:shadow-[0_16px_32px_-16px_hsl(var(--foreground)/0.35)] active:scale-[0.985]"
                      >
                        {/* The thumbnail keeps the certificate's own proportions so it can
                            grow into the lightbox without stretching mid-flight. */}
                        <motion.img
                          layoutId={`cert-${cert.image}`}
                          transition={travel}
                          src={cert.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="h-auto w-full rounded-md"
                        />
                      </button>
                      <figcaption className="flex items-start justify-between gap-3">
                        <span className="text-[0.95rem] leading-snug">{cert.title}</span>
                        {cert.link !== "#" && (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex shrink-0 items-center gap-0.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                          >
                            Verify
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <Lightbox cert={selected} onClose={() => setSelected(null)} />

      <FlowAppButton
        leftTitle="Education"
        leftDescription="history of my academics timeline"
        leftIcon={<GraduationCap />}
        leftRoute="/education"
        rightTitle="Say hi"
        rightDescription="reach out to me through these channels"
        rightIcon={<Contact />}
      />
    </PageShell>
  );
}

const Lightbox = ({ cert, onClose }: { cert: Certificate | null; onClose: () => void }) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cert) return;
    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      // Hand focus back to the thumbnail the visitor opened.
      previous?.focus();
    };
  }, [cert, onClose]);

  return createPortal(
    <AnimatePresence>
      {cert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={cert.title}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12"
          onClick={onClose}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.25 }}
          />
          <motion.img
            layoutId={`cert-${cert.image}`}
            transition={travel}
            src={cert.image}
            alt={cert.title}
            className="relative max-h-full max-w-full cursor-zoom-out rounded-lg bg-white object-contain shadow-2xl"
          />
          <motion.button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
