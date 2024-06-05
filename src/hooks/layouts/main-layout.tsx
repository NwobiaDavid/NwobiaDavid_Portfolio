import { Outlet } from "react-router-dom";

import { MainSidebar } from "@/components/sidebar/main-sidebar";
import { ContentLayout } from "./content-layout";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout() {
  return (
    <div className="flex h-screen w-screen">
      <MainSidebar />
      <ContentLayout>
        <Outlet />
      </ContentLayout>
      <Toaster />
    </div>
  );
}
