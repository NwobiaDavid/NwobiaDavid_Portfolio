import IconGithub from "@/components/svg/github-svg";
import { Button } from "./ui/button";

const GithubLink = () => {
  return (
    <Button asChild variant="outline" size="sm" className="shrink-0 gap-2 font-display font-semibold">
      <a target="_blank" rel="noopener noreferrer" href="https://github.com/NwobiaDavid">
        <IconGithub className="h-4 w-4" />
        GitHub
      </a>
    </Button>
  );
};

export default GithubLink;
