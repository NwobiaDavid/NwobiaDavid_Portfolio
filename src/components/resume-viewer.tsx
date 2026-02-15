import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

interface ResumeViewerProps {
  onClose?: () => void;
  buttonVariant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  buttonClassName?: string;
  showIcon?: boolean;
}

export const ResumeViewer = ({ 
  onClose, 
  buttonVariant = "ghost",
  buttonClassName = "",
  showIcon = true 
}: ResumeViewerProps) => {
  const [open, setOpen] = useState(false);

  const handleDownload = () => {
    // Create a temporary link to download the file
    const link = document.createElement("a");
    // link.href = "/files/my-resume-2025.pdf";
    link.href = "/files/David_Nwobia_Fullstack.pdf";
    link.download = "David_Nwobia_Fullstack.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className={buttonClassName}
          variant={buttonVariant}
        >
          {showIcon && <FileText />}
          My Resume
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b pr-14">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              My Resume
            </DialogTitle>
            <Button
              onClick={handleDownload}
              variant="default"
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <iframe
            src="/files/David_Nwobia_Fullstack.pdf"
            // src="/files/my-resume-2025.pdf"
            className="w-full h-full border-0"
            title="Resume PDF Viewer"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};