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
import "./loader.css"
import GithubLink from "../github-link";

export const TopbarContent = () => {
  const navigate = useNavigate();
  const { isOpen, open } = useSheet();

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
                <Menu className="w-6 h-6 md:w-4 md:h-4 " />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <MainSidebar isMobile />
            </SheetContent>
          </Sheet>
          <ArrowLeft
            className="w-6 h-6 md:w-4 md:h-4 cursor-pointer"
            onClick={() => navigate(-1)}
          />
          <ArrowRight
            className="w-6 h-6 md:w-4 md:h-4 cursor-pointer"
            onClick={() => navigate(1)}
          />
          <ArrowUpIcon
            className="w-6 h-6 md:w-4 md:h-4 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <Breadcrumbs />
      </div>

      <div className=" p-0 lg:p-4 text-xs lg:text-base flex lg:flex-row flex-col lg:mr-0 mr-2 justify-center items-center  ">
        {/* <div className=" dark:text-white lg:mr-5 lg:flex justify-center items-center hidden    "><h2 className=" mr-2 font-bold flex items-center justify-center  " >{likeCount > 0 ? likeCount : ( <span className="loader before:bg-black before:dark:bg-white  "></span> )}</h2> <span className=" whitespace-nowrap capitalize " >people love this website <span className=" text-sm opacity-50 ">be one of them</span> </span></div> */}

        {/* <span className=" bg-slate-900 dark:bg-slate-300 rounded-full py-2 px-3 text-white dark:text-black  "> */}
          <GithubLink />
        {/* </span> */}
      </div>

    </div>
  );
};
