import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import ReactPlayer from "react-player";
import { useBoolean } from "usehooks-ts";
import { useEffect, useRef, useState } from "react";
import { videoUrls } from "@/constants/data/video";
import { secondsToTimeString } from "@/lib/time";
import { cn } from "@/lib/utils";
import { getRandomVideo } from "@/lib/random";
import { usePlay } from "@/hooks/use-play";

const controlButton =
  "flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-[color,background-color,transform] duration-150 hover:bg-muted hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const randomOtherIndex = (current: number) => {
  let next = getRandomVideo(videoUrls).index;
  while (videoUrls.length > 1 && next === current) next = getRandomVideo(videoUrls).index;
  return next;
};

/** Three bars that bounce while a track is playing and rest when it isn't. */
const Equalizer = ({ playing }: { playing: boolean }) => (
  <span aria-hidden className="flex h-3.5 items-end gap-[2px]">
    {[0, 1, 2].map((bar) => (
      <span
        key={bar}
        className={cn("w-[3px] origin-bottom rounded-full bg-primary", playing ? "eq-bar" : "h-1")}
        style={{ animationDelay: `${bar * -0.3}s` }}
      />
    ))}
  </span>
);

export const MusicHobbyContent = () => {
  const play = usePlay();
  const shuffle = useBoolean(false);
  const repeat = useBoolean(false);
  const playerRef = useRef<ReactPlayer>(null);
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const track = videoUrls[current];

  // Never carry playback past this view.
  const stop = usePlay((state) => state.setFalse);
  useEffect(() => stop, [stop]);

  const select = (index: number) => {
    setStarted(true);
    if (index === current) {
      play.toggle();
      return;
    }
    setCurrent(index);
    setPlayed(0);
    setPlayedSeconds(0);
    play.setTrue();
  };

  const seekTo = (fraction: number) => {
    setPlayed(fraction);
    playerRef.current?.seekTo(fraction, "fraction");
  };

  const skipBack = () => {
    if (playedSeconds > 3) return seekTo(0);
    select(current === 0 ? videoUrls.length - 1 : current - 1);
  };

  const skipForward = () => {
    if (shuffle.value) return select(randomOtherIndex(current));
    select(current === videoUrls.length - 1 ? 0 : current + 1);
  };

  const onEnded = () => (repeat.value ? seekTo(0) : skipForward());

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:gap-10">
      <section aria-label="Now playing" className="min-w-0">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-[0_24px_48px_-28px_hsl(var(--foreground)/0.6)] ring-1 ring-foreground/10">
          {started && (
            <ReactPlayer
              ref={playerRef}
              url={track.link}
              playing={play.value}
              controls={false}
              onEnded={onEnded}
              onError={skipForward}
              onDuration={setDuration}
              onProgress={(e) => {
                if (seeking) return;
                setPlayed(e.played);
                setPlayedSeconds(e.playedSeconds);
              }}
              width="100%"
              height="100%"
              style={{ position: "absolute", inset: 0 }}
            />
          )}
          {!started && (
            <button
              type="button"
              onClick={() => select(current)}
              aria-label={`Play ${track.title}`}
              data-no-blobity
              className="group absolute inset-0 flex items-center justify-center"
            >
              <img src={track.thumbnail} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition-transform duration-200 ease-out group-hover:scale-105 group-active:scale-95">
                <Play className="ml-1 h-7 w-7 fill-current" />
              </span>
              <span className="absolute bottom-4 left-4 text-sm text-white/85">Press play. Sound will start.</span>
            </button>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold tracking-[-0.015em] md:text-3xl">{track.title}</h2>
          <p className="mt-1 text-muted-foreground">{track.artist.trim()}</p>
        </div>

        <div className="mt-6">
          <Slider
            value={[played]}
            max={1}
            step={0.001}
            disabled={!started}
            aria-label="Seek"
            onValueChange={([value]) => {
              setSeeking(true);
              seekTo(value);
            }}
            onValueCommit={() => setSeeking(false)}
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>{secondsToTimeString(Math.floor(playedSeconds))}</span>
            <span>{started ? secondsToTimeString(duration) : "--:--"}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            aria-label="Shuffle"
            aria-pressed={shuffle.value}
            onClick={() => {
              repeat.setFalse();
              shuffle.toggle();
            }}
            className={cn(controlButton, shuffle.value && "text-primary hover:text-primary")}
          >
            <Shuffle className="h-[18px] w-[18px]" />
          </button>
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Previous" onClick={skipBack} className={controlButton}>
              <SkipBack className="h-5 w-5 fill-current" />
            </button>
            <button
              type="button"
              aria-label={play.value ? "Pause" : "Play"}
              onClick={() => select(current)}
              data-no-blobity
              className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_20px_-8px_hsl(var(--primary)/0.7)] transition-transform duration-150 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {play.value ? <Pause className="h-6 w-6 fill-current" /> : <Play className="ml-0.5 h-6 w-6 fill-current" />}
            </button>
            <button type="button" aria-label="Next" onClick={skipForward} className={controlButton}>
              <SkipForward className="h-5 w-5 fill-current" />
            </button>
          </div>
          <button
            type="button"
            aria-label="Repeat track"
            aria-pressed={repeat.value}
            onClick={() => {
              shuffle.setFalse();
              repeat.toggle();
            }}
            className={cn(controlButton, repeat.value && "text-primary hover:text-primary")}
          >
            <Repeat className="h-[18px] w-[18px]" />
          </button>
        </div>
      </section>

      <section aria-label="Playlist" className="min-w-0">
        <h2 className="mb-3 flex items-baseline gap-3 text-xl font-semibold tracking-[-0.01em]">
          Playlist
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground tabular-nums">
            {videoUrls.length}
          </span>
        </h2>
        <ol className="-mx-2 flex max-h-[34rem] flex-col overflow-y-auto pr-1 [scrollbar-width:thin]">
          {videoUrls.map((video, index) => {
            const isCurrent = index === current;
            return (
              <li key={`${index}:${video.link}`}>
                <button
                  type="button"
                  onClick={() => select(index)}
                  aria-current={isCurrent ? "true" : undefined}
                  data-no-blobity
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isCurrent ? "bg-muted" : "hover:bg-muted/60"
                  )}
                >
                  <span className="flex w-5 shrink-0 justify-center text-xs text-muted-foreground tabular-nums">
                    {isCurrent && started ? <Equalizer playing={play.value} /> : index + 1}
                  </span>
                  <img
                    src={video.thumbnail}
                    alt=""
                    loading="lazy"
                    className="aspect-video w-16 shrink-0 rounded-md object-cover ring-1 ring-foreground/10"
                  />
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-sm font-medium", isCurrent && "text-primary")}>
                      {video.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{video.artist.trim()}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
};
