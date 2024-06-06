import { TopbarContent } from "@/components/topbar/topbar-content";

interface ContentLayoutProps {
  children: React.ReactNode;
}

export const ContentLayout = ({ children }: ContentLayoutProps) => {
  return (
    <div className="flex flex-col w-full lg:w-[80%] overflow-x-hidden ">
      <TopbarContent />
      {children}
    </div>
  );
};
