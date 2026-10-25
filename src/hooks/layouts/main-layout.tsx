import { Outlet } from "react-router-dom";

import { MainSidebar } from "@/components/sidebar/main-sidebar";
import { ContentLayout } from "./content-layout";
import { Toaster } from "@/components/ui/sonner";
import { LiquidGlass } from "@/components/liquid-glass";
import { Intro } from "@/components/intro";

export default function MainLayout() {
  return (
    <div className="flex h-[100dvh] w-full overflow-hidden">
      <MainSidebar />
      <ContentLayout>
        <Outlet />
      </ContentLayout>
      <Toaster />
      <LiquidGlass />
      <div className="grain" aria-hidden />
      <Intro />
    </div>
  );
}
