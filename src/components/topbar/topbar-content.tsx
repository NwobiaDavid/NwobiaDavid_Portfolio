import {
  ArrowLeft,
  ArrowRight,
  ArrowUpIcon,
  DoorOpen,
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

export const TopbarContent = () => {
  const navigate = useNavigate();
  const { isOpen, open } = useSheet();
  const { session } = useSession();

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
      {session && (
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
      )}
    </div>
  );
};
