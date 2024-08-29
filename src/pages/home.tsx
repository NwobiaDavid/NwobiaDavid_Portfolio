import { Link } from "react-router-dom";
import Typewriter from "typewriter-effect";
import { motion } from "framer-motion";
import { useDocumentTitle } from "usehooks-ts";
import { type Container } from "@tsparticles/engine";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

import {  ArrowRight } from "lucide-react";
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

  // const verifyPortofolio = async () => {
  //   if (session) {
  //     const user = session.user.user_metadata;
  //     await supabase.from("verified").insert({
  //       user_id: session.user.id,
  //       email: user.email,
  //       full_name: user.full_name,
  //       image_url: user.avatar_url,
  //     });
  //   } else {
  //     return;
  //   }
  // };

  // useEffect(() => {
  //   verifyPortofolio();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [session?.user.id]);

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
        initial={{ opacity: 0, translateY: window.innerHeight }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ duration: 0.8 }}
        className="flex md:flex-row flex-col-reverse items-center justify-center gap-4 md:mx-4"
      >
        <div className="flex flex-col w-[80%] lg:w-[60%] items-start justify-center gap-2">
          <h3 className="scroll-m-20 text-2xl  font-semibold tracking-tight">
            Hello World
          </h3>
          <Typewriter
            options={{
              cursorClassName: "text-4xl",
              autoStart: true,
              wrapperClassName:
                "scroll-m-20 text-4xl opacity-80 font-extrabold tracking-tight lg:text-5xl",
              loop: true,
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString("I'm a Program")
                .pauseFor(300)
                .deleteChars(4)
                .typeString("grammer")
                .pauseFor(2000)
                .start();
            }}
          />
          <blockquote className="mb-4 mt-2 border-l-2 pl-6 italic">
            "I'm a Software engineer that specializes in Front-end development. I try simplifying my day-to-day life using coding. I'm passionate
            about using technology to solve problems and make the world an easier place."
          </blockquote>
          <Link to="/experiences">
            <Button className="w-fit group" variant="outline">
              Experience{" "}
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-all duration-300" />
            </Button>
          </Link>

          <a href={"/files/resume.pdf"}>
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
            <AvatarImage  src="/images/profile pic.jpg" />
            <AvatarFallback>Nwobia David</AvatarFallback>
          </Avatar>
        </div>
      </motion.div>
    </div>
  );
}
