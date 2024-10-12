import {
  Music,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import ReactPlayer from "react-player";
import { useBoolean } from "usehooks-ts";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { OnProgressProps } from "react-player/base";
import { toast } from "sonner";
import { VideoData, videoUrls } from "@/constants/data/video";
import { MusicList } from "../music/music-list";
import { secondsToTimeString } from "@/lib/time";
import { cn } from "@/lib/utils";
import { getRandomVideo } from "@/lib/random";
import { motion } from "framer-motion";
import { useTour } from "@reactour/tour";
import { usePlay } from "@/hooks/use-play";

export const MusicHobbyContent = () => {
  const { setIsOpen, isOpen, currentStep } = useTour();
  const isFirstRender = useRef(true);
  const play = usePlay();
  const seek = useBoolean(false);
  const shuffle = useBoolean(false);
  const repeat = useBoolean(false);
  const playerRef = useRef<ReactPlayer>(null);
  const [progressState, setProgressState] = useState<OnProgressProps>({
    loaded: 0,
    loadedSeconds: 0,
    played: 0,
    playedSeconds: 0,
  });
  const [duration, setDuration] = useState<number>(0);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const isTourFinish = !isOpen && currentStep === 5;

  useEffect(() => {
    if (!isTourFinish) {
      setIsOpen(true);
    } else {
      play.setTrue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const [currentVideoIndex, setCurrentVideoIndex] = useState<number>(0);

  const handleSeekChange = (newPlayed: number) => {
    setProgressState((prevState) => ({
      ...prevState,
      played: newPlayed,
    }));
    playerRef.current?.seekTo(newPlayed, "fraction");
  };

  const handleSkipBack = () => {
    if (Math.floor(progressState.playedSeconds) !== 0) {
      handleSeekChange(0);
      return;
    }

    setCurrentVideoIndex((prevIndex) =>
      prevIndex === 0 ? videoUrls.length - 1 : prevIndex - 1,
    );

    play.setTrue();
  };

  const handleSkipForward = () => {
    // if shuffle on, next song will ignore
    if (shuffle.value) {
      // get random video
      let randomVideo = getRandomVideo(videoUrls);
      // if random video is same with current video, get another random video
      while (randomVideo.video.link === videoUrls[currentVideoIndex].link) {
        randomVideo = getRandomVideo(videoUrls);
      }
      setCurrentVideoIndex(randomVideo.index);
      return;
    }

    setCurrentVideoIndex((prevIndex) =>
      prevIndex === videoUrls.length - 1 ? 0 : prevIndex + 1,
    );

    play.setTrue();
  };

  const findIndexByLink = (array: VideoData[], searchLink: string): number => {
    for (let i = 0; i < array.length; i++) {
      if (array[i].link === searchLink) {
        return i;
      }
    }
    return -1;
  };

  const handleNotSelectedSongButtonClick = (value: VideoData) => {
    if (value.link === videoUrls[currentVideoIndex].link) {
      play.toggle();
    } else {
      const newIndex = findIndexByLink(videoUrls, value.link);
      setCurrentVideoIndex(newIndex);
    }

    play.setTrue();
  };

  const handleOnEnded = () => {
    if (repeat.value) {
      handleSeekChange(0);
    } else if (shuffle.value) {
      let randomVideo = getRandomVideo(videoUrls);
      while (randomVideo.video.link === videoUrls[currentVideoIndex].link) {
        randomVideo = getRandomVideo(videoUrls);
      }
      setCurrentVideoIndex(randomVideo.index);
    } else {
      handleSkipForward();
    }
  };

  useEffect(() => {
    if (!isFirstRender.current) {
      // This code will run after currentVideoIndex is updated
      toast(`Now playing: ${videoUrls[currentVideoIndex].title}`, {
        description: `By ${videoUrls[currentVideoIndex].artist}`,
        cancel: {
          label: "Prev",
          onClick: handleSkipBack,
        },
        action: {
          label: "Next",
          onClick: handleSkipForward,
        },
        icon: <Music />,
        dismissible: true,
        position: "top-right",
        duration: 3000,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoIndex]);

  useEffect(() => {
    if (!isFirstRender.current) {
      if (shuffle.value) {
        toast("Song shuffle is enabled!", {
          cancel: {
            label: "Disable shuffle",
            onClick: shuffle.setFalse,
          },
          position: "bottom-right",
          duration: 3000,
        });
      } else {
        toast("Song shuffle is disabled!", {
          action: {
            label: "Enable shuffle",
            onClick: shuffle.setTrue,
          },
          position: "bottom-right",
          duration: 3000,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffle.setFalse, shuffle.setTrue, shuffle.value]);

  useEffect(() => {
    if (isFirstRender.current && !repeat.value) {
      isFirstRender.current = false;
      return;
    } else {
      if (repeat.value) {
        toast("Song repeat is enabled!", {
          cancel: {
            label: "Disable Repeat",
            onClick: repeat.setFalse,
          },
          position: "bottom-right",
          duration: 3000,
        });
      } else {
        toast("Song repeat is disabled", {
          action: {
            label: "Enable Repeat",
            onClick: repeat.setTrue,
          },
          position: "bottom-right",
          duration: 3000,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeat.setFalse, repeat.setTrue, repeat.value]);

  return (
    <div className="h-screen relative w-full flex flex-col justify-between">
      <ReactPlayer
        ref={playerRef}
        url={videoUrls[currentVideoIndex].link}
        onEnded={handleOnEnded}
        onError={() => handleSkipForward()}
        controls={false}
        playing={play.value}
        onProgress={(e) => {
          if (!seek.value) {
            setProgressState((prevState) => ({
              ...prevState,
              loaded: e.loaded,
              loadedSeconds: e.loadedSeconds,
              played: e.played,
              playedSeconds: e.playedSeconds,
            }));
          }
        }}
        onDuration={(duration) => setDuration(duration)}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
        width="100%"
        height="100%"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="z-30 w-full overflow-auto bg-black/70 p-4 flex flex-col gap-4 music-list"
      >
        {videoUrls.map((value, index) => (
          <MusicList
            key={`${index}:${value.link}`}
            currentVideoIndex={currentVideoIndex}
            handleNotSelectedSongButtonClick={handleNotSelectedSongButtonClick}
            index={index}
            play={play}
            value={value}
          />
        ))}
      </motion.div>
      <div className="px-4 py-2 sticky bottom-0 bg-popover z-40 music-player">
        <div>
          <h4 className="scroll-m-20 text-md md:text-lg font-semibold tracking-tight">
            {videoUrls[currentVideoIndex].title}
          </h4>
          <p className="text-sm text-muted-foreground">
            {videoUrls[currentVideoIndex].artist}
          </p>
        </div>
        <Slider
          value={[
            progressState.played as number,
            progressState.loaded as number,
          ]}
          onValueChange={(values) => handleSeekChange(values[0])}
          onValueCommit={() => seek.setFalse()}
          max={1}
          step={0.0001}
          className="mt-6 music-duration"
        />
        <div className="flex justify-between mt-2">
          <p className="text-sm text-muted-foreground">
            {secondsToTimeString(Math.floor(progressState.playedSeconds))}
          </p>
          <p className="text-sm text-muted-foreground">
            {secondsToTimeString(duration)}
          </p>
        </div>
        <div className="w-full flex justify-between mt-4">
          <Button
            onClick={() => {
              if (repeat.value) {
                repeat.setFalse();
              }
              shuffle.toggle();
            }}
            size="icon"
            variant="ghost"
            className="shuffle-button"
          >
            <Shuffle
              className={cn(
                shuffle.value ? "text-primary" : "text-muted-foreground",
              )}
            />
          </Button>
          <div className="flex gap-4 control-buttons">
            <Button onClick={handleSkipBack} size="icon" variant="ghost">
              <SkipBack />
            </Button>
            <Button onClick={play.toggle} size="icon" variant="ghost">
              {play.value ? <Pause /> : <Play />}
            </Button>
            <Button onClick={handleSkipForward} size="icon" variant="ghost">
              <SkipForward />
            </Button>
          </div>
          <Button
            onClick={() => {
              if (shuffle.value) {
                shuffle.setFalse();
              }

              repeat.toggle();
            }}
            size="icon"
            variant="ghost"
            className="repeat-button"
          >
            <Repeat
              className={cn(
                repeat.value ? "text-primary" : "text-muted-foreground",
              )}
            />
          </Button>
        </div>
      </div>
      <div ref={bottomRef}></div>
    </div>
  );
};
