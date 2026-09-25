import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { useDocumentTitle } from "usehooks-ts";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { particleOptionsFor } from "@/config/particles";
import { useTheme } from "@/components/theme-provider";
import { ResumeViewer } from "@/components/resume-viewer";

// Delay, in ms, for each beat of the hero entrance. The name leads, the two headline
// lines follow on the same rhythm, then the supporting copy and actions settle in.
const beat = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

export default function Home() {
  useDocumentTitle("David Nwobia | Home");
  const [init, setInit] = useState<boolean>(false);
  const { resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particleOptions = useMemo(
    () => particleOptionsFor(resolvedTheme, reduceMotion),
    [resolvedTheme, reduceMotion]
  );

  return (
    <div className="relative flex flex-1 items-center overflow-hidden">
      {init && (
        <Particles
          // Remount on theme change so the new colour applies to every square at once.
          key={`${resolvedTheme}-${reduceMotion}`}
          id="tsparticles"
          options={particleOptions}
        />
      )}

      <section className="relative z-10 mx-auto grid w-full max-w-[60rem] items-center gap-8 px-5 pb-16 pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 md:px-10 md:py-16 lg:gap-20">
        <div className="flex flex-col items-start">
          <h1 className="font-display text-lg font-medium text-muted-foreground lg:text-xl">
            <span className="hero-line">
              <span style={beat(0)}>David Nwobia</span>
            </span>
          </h1>
          <p
            aria-label="Software Engineer"
            className="mt-2 font-display text-[clamp(2.75rem,7vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.035em]"
          >
            <span className="hero-line" aria-hidden>
              <span style={beat(90)}>Software</span>
            </span>
            <span className="hero-line" aria-hidden>
              <span style={beat(170)}>Engineer</span>
            </span>
          </p>

          <p
            className="hero-fade mt-6 max-w-[44ch] text-lg leading-relaxed text-muted-foreground"
            style={beat(380)}
          >
            Building things that work, then making them fast is my philosophy, shaped by five
            years of coding and a 4.68 GPA Industrial Physics degree from Covenant University.
          </p>

          <div className="hero-fade mt-8 flex flex-wrap gap-3" style={beat(470)}>
            <Button asChild variant="outline" size="lg" className="group gap-2 px-5 font-display font-semibold">
              <Link to="/experiences">
                Experience
                <ArrowRight className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <ResumeViewer
              buttonVariant="default"
              buttonClassName="h-11 px-5 font-display font-semibold"
              showIcon={false}
            />
          </div>
        </div>

        <div className="order-first md:order-none">
          <div
            className="hero-portrait w-40 overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10 sm:w-52 md:w-64 lg:w-72"
            data-blobity-tooltip="Always Active!"
            data-blobity-invert="false"
          >
            <img
              src="/images/pfpmain-comp.jpg"
              alt="David Nwobia"
              width={576}
              height={576}
              decoding="async"
              className="aspect-square h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
