import { TopbarContent } from "@/components/topbar/topbar-content";

interface ContentLayoutProps {
  children: React.ReactNode;
}

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <div className="flex flex-col w-[80%]">
      <TopbarContent />
      {children}
    </div>
  );
};
