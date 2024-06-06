import IconGithub from "@/components/svg/github-svg";
import IconGoogle from "@/components/svg/google-svg";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/database/db";

export default function Login() {
  const { session } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="w-screen md:w-full h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Step 1: </CardTitle>
          <CardDescription>
            Login to Help me verified my Portfolio
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button
            className="flex gap-2"
            variant="outline"
            onClick={async () =>
              supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  queryParams: {
                    access_type: "offline",
                    prompt: "consent",
                  },
                },
              })
            }
          >
            <IconGoogle /> Login with Google
          </Button>
          <Button
            className="flex gap-2"
            variant="outline"
            onClick={async () =>
              supabase.auth.signInWithOAuth({
                provider: "github",
              })
            }
          >
            <IconGithub /> Login with Github
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
