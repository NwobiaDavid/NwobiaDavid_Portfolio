import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useDrawer } from "@/hooks/use-drawer";

interface FlowAppButtonProps {
  containerClassName?: string;
  leftTitle: string;
  leftDescription: string;
  leftIcon?: JSX.Element;
  leftRoute: string | (() => void);
  rightTitle: string;
  rightDescription: string;
  rightIcon?: JSX.Element;
  /** Omit to open the contact drawer instead of navigating. */
  rightRoute?: string | (() => void);
}

const card =
  "group flex min-h-[4.5rem] w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-[background-color,border-color,transform] duration-150 ease-out hover:border-foreground/20 hover:bg-muted/50 active:scale-[0.985] [&_svg]:shrink-0";

interface EndProps {
  side: "left" | "right";
  title: string;
  description: string;
  icon?: JSX.Element;
  route: string | (() => void);
}

// Real links wherever the destination is a route, so middle-click and
// open-in-new-tab work. Only callbacks render as buttons.
const End = ({ side, title, description, icon, route }: EndProps) => {
  const isLeft = side === "left";
  const body = (
    <>
      {isLeft && (
        <ChevronLeft className="h-5 w-5 text-muted-foreground transition-transform duration-200 ease-out group-hover:-translate-x-0.5" />
      )}
      {icon && <span className="text-muted-foreground [&_svg]:h-5 [&_svg]:w-5">{icon}</span>}
      <span className={cn("flex min-w-0 flex-1 flex-col", !isLeft && "items-end text-right")}>
        <span className="font-display text-base font-semibold md:text-lg">{title}</span>
        <span className="text-sm text-muted-foreground">{description}</span>
      </span>
      {!isLeft && (
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
      )}
    </>
  );

  if (typeof route === "string") {
    return (
      <Link to={route} className={card}>
        {body}
      </Link>
    );
  }

  return (
    <button type="button" onClick={route} className={card}>
      {body}
    </button>
  );
};

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
  const { open } = useDrawer();

  return (
    <nav
      aria-label="Continue reading"
      className={cn("mt-12 grid w-full gap-3 border-t pt-6 sm:grid-cols-2", containerClassName)}
    >
      <div className="order-2 sm:order-1">
        <End side="left" title={leftTitle} description={leftDescription} icon={leftIcon} route={leftRoute} />
      </div>
      <div className="order-1 sm:order-2">
        <End side="right" title={rightTitle} description={rightDescription} icon={rightIcon} route={rightRoute ?? open} />
      </div>
    </nav>
  );
};
