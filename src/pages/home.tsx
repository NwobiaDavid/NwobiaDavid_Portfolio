import { Link } from "react-router-dom";
// import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { useDocumentTitle } from "usehooks-ts";
import { type Container } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { particleOptionsDark, particleOptionsLight } from "@/config/particles";
import { useTheme } from "@/components/theme-provider";
// import { supabase } from "@/database/db";
// import { useSession } from "@/hooks/use-session";
// import { cn } from "@/lib/utils";
// import { VerifiedAvatar } from "@/components/content/verified-avatar";
import { isDarkSystem } from "@/lib/theme";
import { ResumeViewer } from "@/components/resume-viewer";

export default function Home() {
  useDocumentTitle("David Nwobia | Home");
  const [init, setInit] = useState<boolean>(false);
  // const navigate = useNavigate();
  // const { session } = useSession();
  const { theme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    console.log(container);
  };

  const particleOptions =
    theme === "dark"
      ? particleOptionsDark
      : theme === "light"
        ? particleOptionsLight
        : theme === "system" && isDarkSystem
          ? particleOptionsDark
          : theme === "system" && !isDarkSystem
            ? particleOptionsLight
            : undefined;



  return (
    <div className="md:h-full w-screen relative md:w-full flex items-center justify-center h-full">
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={particleOptions}
        />
      )}
      <motion.div
        initial={{ opacity: 0, translateY: -10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.8 }}
        className="flex my-20 w-full h-full md:flex-row flex-col-reverse items-center justify-center lg:justify-start gap-4 md:mx-4 md:ml-[20%] md:my-[10%] "
      >
        <div className="flex z-10 flex-col h_style mt-10 md:mt-0 mb-[10%] w-[80%] lg:w-[42%] items-start justify-center lg:justify-start gap-2">
          <h3 className="scroll-m-20 z-10 text-lg lg:text-2xl p_style  font-semibold tracking-tight">
            {/* console.log("Bringing divs to life since 2022"); */}
            David Nwobia
          </h3>
          {/* <Typewriter
            options={{
              cursorClassName: " text-4xl",
              autoStart: true,
              wrapperClassName:
                "scroll-m-20  text-4xl opacity-80 font-extrabold tracking-tight lg:text-5xl",
              loop: true,
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString("Googling error messages")
                .pauseFor(300)
                .deleteAll()
                .typeString("StackOverflow copy-paster")
                .pauseFor(300)
                .deleteAll()
                .typeString("Okay fine, 'Software Engineer'")
                .pauseFor(2000)
                .start();
            }}
          /> */}
          <h1 className="text-3xl opacity-80 font-bold lg:text-5xl">
            Software Engineer
          </h1>
          <blockquote className="mb-4 mt-2 text-lg md:text-base p_style border-l-2 pl-6 italic">
            I build things that work. Then I make them fast.
          </blockquote>
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 ">
          <Link to="/experiences">
            <Button className="w-fit group font-semibold border-2 p_style " variant="outline">
              Experience{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </Link>

          {/* <a target="_blank" href={"/files/my-resume-2025.pdf"}>
            <Button className="p_style font-semibold" >
              My Resume
            </Button>
          </a> */}
          <ResumeViewer
            buttonVariant="default"
            buttonClassName="p_style font-semibold"
            showIcon={false}
          />

          </div>

          {/* <VerifiedAvatar /> */}
        </div>

        <div className="w-fit  mb-[10%]">
          <Avatar className="w-56 rounded-xl border-gray-300 border-[3px] duration-500 h-56" data-blobity-tooltip="Always Active!"
            data-blobity-invert="false">
            <AvatarImage
              className=" "

              src="/images/profile.png" />
            <AvatarFallback>David Nwobia</AvatarFallback>
          </Avatar>

        </div>
      </motion.div>
    </div>
  );
}
