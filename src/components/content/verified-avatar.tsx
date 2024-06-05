import { supabase } from "@/database/db";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { shuffleArray } from "@/lib/random";
import { createAvatarFallback } from "@/lib/string";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Smile } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { toast } from "sonner";
import { VerifiedUserList } from "./verifed-user-list";

export interface User {
  created_at: string;
  email: string | null;
  full_name: string | null;
  id: number;
  image_url: string | null;
  user_id: string;
}

export const VerifiedAvatar = () => {
  const [data, setData] = useState<User[] | null>(null);
  const { session } = useSession();

  const getData = async () => {
    const { data } = await supabase.from("verified").select("*");

    setData(data);
    if (
      data?.filter((value) => value.user_id === session?.user.id).length ||
      0 !== 0
    ) {
      toast(
        <div className="flex items-center gap-2">
          <Smile />
          <p>
            Thank you {session?.user.user_metadata.full_name} for supporting me!
          </p>
        </div>,
        {
          duration: 2000,
        }
      );
    }
  };

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  if (data) {
    return (
      <div className="flex w-full justify-center md:justify-start items-center my-4">
        <Dialog>
          <DialogTrigger className="flex flex-col md:flex-row items-center gap-2 text-sm">
            <p className="text-muted-foreground font-semibold">Verified by</p>
            <div className="flex items-center">
              {shuffleArray(data).map((value, index) => {
                if (index < 3) {
                  return (
                    <div key={value.user_id} className="-mr-2">
                      <Avatar>
                        <AvatarImage
                          src={value.image_url as string}
                          alt={value.full_name as string}
                        />
                        <AvatarFallback>
                          {createAvatarFallback(value.full_name as string)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  );
                }
              })}
              {data.length > 3 && (
                <p className="ml-4 text-muted-foreground">
                  {data.length - 3} more ...
                </p>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="w-[90%]">
            <DialogHeader>
              <DialogTitle className="text-center">
                Thank You for All Supporter
              </DialogTitle>
              <DialogDescription className="text-center">
                Below are people who have verified this portfolio
              </DialogDescription>
              <ScrollArea className="h-[200px]">
                {data.map((value) => (
                  <VerifiedUserList
                    key={value.user_id}
                    session={session}
                    value={value}
                  />
                ))}
              </ScrollArea>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
};
