import { GameHobbyContent } from "@/components/content/game-hobby-content";
import { MusicHobbyContent } from "@/components/content/music-hobby-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Book,
  Folder,
  Gamepad2,
  GraduationCap,
  Headphones,
  Speaker,
  UserCircle2,
  Volume2,
} from "lucide-react";
import { useDocumentTitle } from "usehooks-ts";
import { useState } from "react";
import { FlowAppButton } from "@/components/content/flow-app-button";
import { cn } from "@/lib/utils";
import { TourProvider } from "@reactour/tour";
import { steps } from "@/constants/steps";
import { usePlay } from "@/hooks/use-play";
import { BookHobbyContent } from "@/components/content/books-hobby-content";

export default function Hobby() {
  useDocumentTitle("Nwobia David | Hobby");
  const [tabState, setTabState] = useState("books");
  const play = usePlay();

  return (
    <TourProvider
      steps={steps}
      scrollSmooth
      onClickClose={(e) => {
        e.setIsOpen(false);
        play.setTrue();
      }}
      onClickMask={(e) => {
        e.setIsOpen(false);
        play.setTrue();
      }}
      badgeContent={({ totalSteps, currentStep }) =>
        currentStep + 1 + "/" + totalSteps
      }
      styles={{
        popover: (base) => ({
          ...base,
          backgroundColor:
            document.documentElement.className === "dark" ? "black" : "white",
        }),
      }}
    >
      <div className="w-screen md:w-full h-full overflow-y-auto">
        <Tabs value={tabState}>
          <TabsList className="mx-5">
            <TabsTrigger
              value="books"
              onClick={() => {
                setTabState("books");
                play.setFalse();
              }}
            >
              <Book className="h-4 w-4 mr-2" /> Books
            </TabsTrigger>
            <AlertDialog>
              <AlertDialogTrigger>
                <TabsTrigger value="music">
                  <Headphones className="h-4 w-4 mr-2" /> Musics
                </TabsTrigger>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <Volume2 /> Audio Playback Confirmation
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will play audio in background, are you sure?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No, Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => setTabState("music")}>
                    <Speaker className="w-4 h-4 mr-1" /> Yes, Play
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </TabsList>
          <TabsContent value="game">
            <GameHobbyContent />
          </TabsContent>
          <TabsContent value="books">
            <BookHobbyContent />
          </TabsContent>
          <TabsContent value="music" className="h-full  bg-blue-600">
            <MusicHobbyContent />
          </TabsContent>
        </Tabs>
        <FlowAppButton
          containerClassName={cn(
            tabState === "music" && "hidden",
            "p-5 w-full"
          )}
          leftTitle="Education"
          leftDescription="see about me"
          leftIcon={<GraduationCap />}
          leftRoute="/education"
          rightTitle="Projects"
          rightDescription="see what I'm working on"
          rightIcon={<Folder />}
          rightRoute="/projects"
        />
      </div>
    </TourProvider>
  );
}
