import { Session } from "@supabase/supabase-js";
import { User } from "./verified-avatar";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { createAvatarFallback } from "@/lib/string";
import { Check } from "lucide-react";
import { useEffect, useRef } from "react";

interface VerifiedUserListProps {
  value: User;
  session: Session | null;
}

export const VerifiedUserList = ({ value, session }: VerifiedUserListProps) => {
  const userRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (userRef.current && value.user_id === session?.user.id) {
      userRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  return (
    <div
      ref={userRef}
      className={cn(
        value.user_id === session?.user.id && "bg-primary-foreground",
        "p-2 rounded-md flex items-center gap-2 mt-2"
      )}
    >
      <Avatar>
        <AvatarImage
          src={value.image_url as string}
          alt={value.full_name as string}
        />
        <AvatarFallback>
          {createAvatarFallback(value.full_name as string)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-start">
        <p className="text-sm flex items-center gap-1">
          {value.email}{" "}
          {value.user_id === session?.user.id && <Check className="w-4 h-4" />}
        </p>
        <p className="text-xs">{value.full_name}</p>
      </div>
    </div>
  );
};
