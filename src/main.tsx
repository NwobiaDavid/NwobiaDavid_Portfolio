// main.tsx
/* eslint-disable react-refresh/only-export-components */
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./hooks/layouts/main-layout.tsx";
import "lenis/dist/lenis.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/syne";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import Hobby from "./pages/hobby.tsx";
import Login from "./pages/login.tsx";
import ProjectDetail from "./pages/project-detail.tsx";
import SectionStack from "./components/section-stack.tsx";
import { sections } from "./constants/sections.ts";
import BlobProviders from "./components/blobity-provider.tsx";
import { MotionConfig } from "framer-motion";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // The top-level pages share one scrolling page; each keeps its own URL.
      ...sections.map(({ path }) => ({ path, element: <SectionStack /> })),
      {
        path: "/hobby",
        element: <Hobby />,
      },
      { path: "/projects/:id", element: <ProjectDetail /> },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

const App = () => {

  return <RouterProvider router={router} />; 
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BlobProviders>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {/* Framer motion follows the OS reduced-motion setting: movement drops out,
          opacity changes stay so state changes remain legible. */}
      <MotionConfig reducedMotion="user">
        <App />
      </MotionConfig>
    </ThemeProvider>
    </BlobProviders>
  </React.StrictMode>,
);