import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
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
import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
// import { VerifiedAvatar } from "@/components/content/verified-avatar";
import { isDarkSystem } from "@/lib/theme";

export default function Home() {
  useDocumentTitle("Nwobia David | Home");
  const [init, setInit] = useState<boolean>(false);
  // const navigate = useNavigate();
  const { session } = useSession();
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
    <div className="md:h-full w-screen relative md:w-full flex items-center justify-center">
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
        className="flex md:flex-row flex-col-reverse items-center justify-center gap-4 md:mx-4"
      >
        <div className="flex z-10 flex-col mt-10 md:mt-0 w-[80%] lg:w-[60%] items-start justify-center gap-2">
          <h3 className="scroll-m-20 z-10 text-2xl p_style  font-semibold tracking-tight">
            console.log("Hello World");
          </h3>
          <Typewriter
            options={{
              cursorClassName: " text-4xl",
              autoStart: true,
              wrapperClassName:
                "scroll-m-20  text-4xl opacity-80 font-extrabold tracking-tight lg:text-5xl",
              loop: true,
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString("I'm a Profram")
                .pauseFor(300)
                .deleteChars(4)
                .typeString("grammer")
                .pauseFor(2000)
                .start();
            }}
          />
          <blockquote className="mb-4 mt-2 text-lg md:text-base h_style border-l-2 pl-6 italic">
            "Frontend-focused software engineer passionate about building sleek, responsive user interfaces. I specialize in creating clean, efficient, and intuitive web experiences using modern technologies like React, JavaScript(ES6+), and Next js."
          </blockquote>
          <Link to="/experiences">
            <Button className="w-fit group" variant="outline">
              Experience{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </Link>

          <a target="_blank" href={"/files/resume.pdf"}>
            <Button
              className={cn(session && "hidden")}
            >
              My Resume
            </Button>
          </a>

          {/* <VerifiedAvatar /> */}
        </div>

        <div className="w-fit">
          <Avatar className="w-52 border-gray-300 border-[3px] h-52">
            <AvatarImage src="/images/profile pic.jpg" />
            <AvatarFallback>Nwobia David</AvatarFallback>
          </Avatar>
          
        </div>
      </motion.div>
    </div>
  );
}
