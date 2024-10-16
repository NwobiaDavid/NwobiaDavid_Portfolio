import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDrawer } from "@/hooks/use-drawer";

interface FlowAppButtonProps {
  containerClassName?: string;
  leftTitle: string;
  leftDescription: string;
  leftIcon: JSX.Element;
  leftRoute: string;
  rightTitle: string;
  rightDescription: string;
  rightIcon: JSX.Element;
  rightRoute?: string;
}

export const FlowAppButton = ({
  containerClassName,
  leftTitle,
  leftDescription,
  leftIcon,
  leftRoute,
  rightTitle,
  rightDescription,
  rightIcon,
  rightRoute,
}: FlowAppButtonProps) => {
  const navigate = useNavigate();
  const { open } = useDrawer();

  return (
    <div
      className={cn(
        "flex w-full md:flex-row flex-col justify-center md:justify-start gap-4",
        containerClassName
      )}
    >
      <Button
        variant="outline"
        className="h-fit flex justify-start md:justify-center gap-3 group"
        onClick={() => navigate(leftRoute)}
      >
        <ChevronLeft className="group-hover:-translate-x-1 transition-all" />
        {leftIcon}
        <div className="flex flex-col items-start">
          <h4 className="scroll-m-20 text-md md:text-lg p_style font-semibold tracking-tight">
            {leftTitle}
          </h4>
          <p className="text-xs md:text-sm text-muted-foreground">{leftDescription}</p>
        </div>
      </Button>
      <Button
        variant="outline"
        className="h-fit flex justify-end md:justify-center gap-3 group"
        onClick={() => {
          if (rightRoute) {
            navigate(rightRoute);
          } else {
            open();
          }
        }}
      >
        <div className="flex flex-col items-end">
          <h4 className="scroll-m-20 text-md md:text-lg p_style font-semibold tracking-tight">
            {rightTitle}
          </h4>
          <p className="text-xs md:text-sm text-muted-foreground">{rightDescription}</p>
        </div>
        {rightIcon}
        <ChevronRight className="group-hover:translate-x-1 transition-all" />
      </Button>
    </div>
  );
};
