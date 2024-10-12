import { VideoData, videoUrls } from "@/constants/data/video";
import { cn } from "@/lib/utils";
import { Disc3, Pause, Play } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useRef } from "react";
import { PlayState } from "@/hooks/use-play";

interface MusicListProps {
  value: VideoData;
  index: number;
  currentVideoIndex: number;
  handleNotSelectedSongButtonClick: (value: VideoData) => void;
  play: PlayState;
}

export const MusicList = ({
  value,
  index,
  currentVideoIndex,
  handleNotSelectedSongButtonClick,
  play,
}: MusicListProps) => {
  const musicRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (musicRef.current && value.link === videoUrls[currentVideoIndex].link) {
      musicRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentVideoIndex]);

  return (
    <div
      ref={musicRef}
      key={`${index}${value.link}`}
      className="flex justify-between items-center p-2 rounded-sm text-white hover:bg-black/80 hover:scale-[101%] group transition-all"
    >
      <div className="flex gap-2">
        <img
          src={value.thumbnail}
          alt={value.title}
          className="rounded-md w-20 md:w-40"
        />
        <div>
          <h3 className="scroll-m-20 p_style text-md md:text-xl font-semibold tracking-tight">
            {value.title}
          </h3>
          <p className="leading-7 text-sm">{value.artist}</p>
          {value.link === videoUrls[currentVideoIndex].link && (
            <p className="text-sm flex items-center gap-2 mt-1 text-muted-foreground">
              <Disc3
                className={cn(
                  play.value && "animate-spin",
                  "w-4 h-4 md:w-6 md:h-6"
                )}
              />
              Now Playing
            </p>
          )}
        </div>
      </div>

      {value.link === videoUrls[currentVideoIndex].link && play.value ? (
        <Button size="icon" variant="ghost" onClick={play.toggle}>
          <Pause />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          onClick={() => handleNotSelectedSongButtonClick(value)}
        >
          <Play />
        </Button>
      )}
    </div>
  );
};
