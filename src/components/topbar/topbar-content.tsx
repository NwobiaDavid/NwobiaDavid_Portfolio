import {
  ArrowLeft,
  ArrowRight,
  ArrowUpIcon,
  DoorOpen,
  Heart,
  Menu,
} from "lucide-react";
import Breadcrumbs from "../breadcrumbs";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MainSidebar } from "../sidebar/main-sidebar";
import { useSheet } from "@/hooks/use-sheet";
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { supabase } from "@/database/db";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createAvatarFallback } from "@/lib/string";
import { useEffect, useState } from "react";

export const TopbarContent = () => {
  const navigate = useNavigate();
  const { isOpen, open } = useSheet();
  const { session } = useSession();

  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    const liked = localStorage.getItem("hasLikedPortfolio");
    if (liked) {
      setHasLiked(true);
    }

    // Fetch the likes count from Supabase
    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("count")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Error fetching likes:", error);
      } else if (data) {
        setLikeCount(data.count);
      }
    };

    fetchLikes();
  }, []);

  const handleLike = async () => {
    if (!hasLiked) {
      const { data, error } = await supabase
      .from("likes")
        .update({ count: likeCount + 1 })
        .eq("id", 1)
        .select("count")
        .single();

      if (error) {
        console.error("Error updating likes:", error.message);
      } else if (data) {
        setLikeCount(data.count);
        setHasLiked(true);
        localStorage.setItem("hasLikedPortfolio", "true");
      }
    }
  };
  return (
    <div className="w-screen md:w-full flex items-center justify-between">
      <div className="p-4 flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="md:hidden"
                variant="ghost"
                onClick={open}
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <MainSidebar isMobile />
            </SheetContent>
          </Sheet>
          <ArrowLeft
            className="w-4 h-4 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <ArrowRight
            className="w-4 h-4 cursor-pointer"
            onClick={() => navigate(1)}
          />
          <ArrowUpIcon className="w-4 h-4 cursor-pointer" onClick={() => navigate("/")} />
        </div>
        <Breadcrumbs />
      </div>

      <div className="p-4 text-xs lg:text-base flex lg:flex-row flex-col lg:mr-0 mr-2 justify-center items-center  ">
        <div className=" lg:mr-5 lg:flex justify-center items-center hidden    "><h2 className=" mr-2 font-bold " >{likeCount}</h2> <span className=" whitespace-nowrap capitalize " >like this website</span></div>

        <Button
          className={` gap-4 justify-start ${hasLiked && ' bg-pink-600 text-white ' }  w-full flex hover:bg-pink-100 border-pink-600 text-pink-600 lg:text-black lg:border-0 border hover:text-pink-600 `}
          variant="ghost"
          onClick={handleLike}
          disabled={hasLiked}
        >
          <Heart />
          <h2 className=" hidden lg:flex">{hasLiked ? "Liked" : "Like this Website"}</h2>
        </Button>
      </div>


      {/* {session && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Avatar
                className="mr-2 cursor-pointer"
                onClick={async () => {
                  supabase.auth.signOut().then(() => {
                    window.location.reload();
                  });
                }}
              >
                <AvatarImage
                  src={session?.user.user_metadata.avatar_url}
                  alt={session.user.user_metadata.full_name}
                />
                <AvatarFallback>
                  {createAvatarFallback(
                    session.user.user_metadata.full_name as string
                  )}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent className="flex items-center">
              <DoorOpen className="w-4 h-4 mr-2" /> Sign out
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )} */}
    </div>
  );
};
