import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle } from "../ui/card";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import { PcCase, Smartphone } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

interface GameData {
  label: string;
  imgUrl: string;
  link?: string;
}

const pcGameData: GameData[] = [
  {
    label: "Stardew Valley",
    imgUrl:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg?t=1666917466",
    link: "https://store.steampowered.com/app/413150/Stardew_Valley/",
  },
  {
    label: "Assassin’s Creed® IV Black Flag™",
    imgUrl:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/242050/header.jpg?t=1698852989",
    link: "https://store.steampowered.com/app/242050/Assassins_Creed_IV_Black_Flag",
  },
  {
    label: "Insaniquarium Deluxe",
    imgUrl:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/3320/header.jpg?t=1615205929",
    link: "https://store.steampowered.com/app/3320/Insaniquarium_Deluxe/",
  },
  {
    label: "Call of Duty®: Modern Warfare® 2 (2009)",
    imgUrl:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/10180/header.jpg?t=1654809646",
    link: "https://store.steampowered.com/app/10180/Call_of_Duty_Modern_Warfare_2_2009/",
  },
  {
    label: "NARUTO SHIPPUDEN: Ultimate Ninja STORM 4",
    imgUrl:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/349040/header.jpg?t=1703080866",
    link: "https://store.steampowered.com/app/349040/NARUTO_SHIPPUDEN_Ultimate_Ninja_STORM_4/",
  },
  {
    label: "The Forest",
    imgUrl:
      "https://cdn.cloudflare.steamstatic.com/steam/apps/242760/header.jpg?t=1699381053",
    link: "https://store.steampowered.com/app/242760/The_Forest/",
  },
];

const mobileGameData: GameData[] = [
  {
    label: "Sky: Children of the Light",
    imgUrl:
      "https://play-lh.googleusercontent.com/L5UqaoUk21eF3bapkMraeqNUjsL0Tom8E3l4lakVuEF0ApKi1l-D12QhYz-bPLEp_nM=w526-h296",
    link: "https://play.google.com/store/apps/details?id=com.tgc.sky.android&hl=en-ID",
  },
  {
    label: "Chess - Play and Learn",
    imgUrl:
      "https://play-lh.googleusercontent.com/qrVYHOZYsh_NsIG0sVdvVLVq5itOVPtc_NI9H5NYZfiimxf2S_QaCjBNI-sQZqaeE6A=w526-h296",
    link: "https://play.google.com/store/apps/details?id=com.chess&hl=en-ID",
  },
  {
    label: "Clash of Clans",
    imgUrl:
      "https://play-lh.googleusercontent.com/cla_4m7mPjHRGSMAuOZa5Ua5sqs84sW_TihTHc9bLoaO7NbyKoYjsC5Twv2ZpGg4LwM=w526-h296",
    link: "https://play.google.com/store/apps/details?id=com.supercell.clashofclans&hl=en-ID",
  },
];

export const GameHobbyContent = () => {
  const [apiPcGame, setApiPcGame] = React.useState<CarouselApi>();
  const [apiMobileGame, setApiMobileGame] = React.useState<CarouselApi>();
  const [currentPcGame, setCurrentPcGame] = React.useState(0);
  const [currentMobileGame, setCurrentMobileGame] = React.useState(0);

  React.useEffect(() => {
    if (!apiPcGame) {
      return;
    }

    setCurrentPcGame(apiPcGame.selectedScrollSnap());

    apiPcGame.on("select", () => {
      setCurrentPcGame(apiPcGame.selectedScrollSnap());
    });
  }, [apiPcGame]);

  React.useEffect(() => {
    if (!apiMobileGame) {
      return;
    }

    setCurrentMobileGame(apiMobileGame.selectedScrollSnap());

    apiMobileGame.on("select", () => {
      setCurrentMobileGame(apiMobileGame.selectedScrollSnap());
    });
  }, [apiMobileGame]);

  return (
    <div className="p-5 w-full mt-4">
      <h3 className="scroll-m-20 mb-1 text-2xl font-semibold tracking-tight flex items-center gap-1">
        <PcCase /> PC
      </h3>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full flex flex-col justify-center"
      >
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          setApi={setApiPcGame}
        >
          <CarouselContent className="md:-ml-4 md:pl-2 md:py-2">
            {pcGameData.map((value) => (
              <CarouselItem
                key={value.label}
                className="md:basis-1/2 lg:basis-1/3 hover:scale-105 transition-all"
              >
                <Link to={value.link as string} replace target="_blank">
                  <Card className="overflow-hidden h-full">
                    <CardHeader className="p-0">
                      <img
                        src={value.imgUrl}
                        alt={value.label}
                        className="object-contain"
                      />
                      <div className="p-6 hidden md:block">
                        <CardTitle className="text-lg">{value.label}</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="md:hidden py-2 text-center text-sm text-muted-foreground">
          {pcGameData[currentPcGame].label}
        </div>
      </motion.div>
      <h3 className="scroll-m-20 mb-1 mt-6 text-2xl font-semibold tracking-tight flex items-center gap-1">
        <Smartphone /> Mobile
      </h3>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full flex flex-col justify-center"
      >
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full"
          plugins={[
            Autoplay({
              delay: 2500,
            }),
          ]}
          setApi={setApiMobileGame}
        >
          <CarouselContent className="md:-ml-4 md:pl-2 md:py-2">
            {mobileGameData.map((value) => (
              <CarouselItem
                key={value.label}
                className="md:basis-1/2 lg:basis-1/3 hover:scale-105 transition-all"
              >
                <Link to={value.link as string} replace target="_blank">
                  <Card className="overflow-hidden h-full">
                    <CardHeader className="p-0">
                      <img
                        src={value.imgUrl}
                        alt={value.label}
                        className="object-cover h-40 w-full"
                      />
                      <div className="p-6 hidden md:block">
                        <CardTitle className="text-lg">{value.label}</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="md:hidden py-2 text-center text-sm text-muted-foreground">
          {mobileGameData[currentMobileGame].label}
        </div>
      </motion.div>
    </div>
  );
};
