import {
  ArrowLeft,
  ArrowRight,
  ArrowUpIcon,
  // Heart,
  Menu,
} from "lucide-react";
import Breadcrumbs from "../breadcrumbs";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MainSidebar } from "../sidebar/main-sidebar";
import { useSheet } from "@/hooks/use-sheet";
// import { useSession } from "@/hooks/use-session";
// import { supabase } from "@/database/db";
// import { useEffect, useState } from "react";
import "./loader.css"

export const TopbarContent = () => {
  const navigate = useNavigate();
  const { isOpen, open } = useSheet();
  // const { session } = useSession();

  // const [likeCount, setLikeCount] = useState(0);
  // const [hasLiked, setHasLiked] = useState(false);

  // useEffect(() => {
  //   const liked = localStorage.getItem("hasLikedPortfolio");
  //   if (liked) {
  //     setHasLiked(true);
  //   }

  //   // Fetch the likes count from Supabase
  //   const fetchLikes = async () => {
  //     const { data, error } = await supabase
  //       .from("likes")
  //       .select("count")
  //       .eq("id", 1)
  //       .single();

  //     console.log("data here" + JSON.stringify(data))

  //     if (error) {
  //       console.error("Error fetching likes:", error);
  //     } else if (data) {
  //       setLikeCount(data.count);
  //     }
  //   };

  //   fetchLikes();
  // }, []);

  // const handleLike = async () => {
  //   if (!hasLiked) {
  //     const { data, error } = await supabase
  //       .from("likes")
  //       .update({ count: likeCount + 1 })
  //       .eq("id", 1)
  //       .select("count")
  //       .single();

  //     console.log("entering like update-- ")

  //     if (error) {
  //       console.error("Error updating likes:", error.message);
  //     } else if (data) {
  //       setLikeCount(data.count);
  //       setHasLiked(true);
  //       localStorage.setItem("hasLikedPortfolio", "true");
  //     }
  //   }
  // };
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
        {/* <div className=" dark:text-white lg:mr-5 lg:flex justify-center items-center hidden    "><h2 className=" mr-2 font-bold flex items-center justify-center  " >{likeCount > 0 ? likeCount : ( <span className="loader before:bg-black before:dark:bg-white  "></span> )}</h2> <span className=" whitespace-nowrap capitalize " >people love this website <span className=" text-sm opacity-50 ">be one of them</span> </span></div> */}

        <span className=" bg-slate-900 dark:bg-slate-300 rounded-full py-2 px-3 text-white dark:text-black  ">
          💡 “Stay curious. It’s your superpower.”
        </span>
      </div>

    </div>
  );
};
