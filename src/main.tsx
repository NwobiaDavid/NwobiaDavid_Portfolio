// main.tsx
/* eslint-disable react-refresh/only-export-components */
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./hooks/layouts/main-layout.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import Home from "./pages/home.tsx";
import Education from "./pages/education.tsx";
import Hobby from "./pages/hobby.tsx";
import Projects from "./pages/projects.tsx";
import Skills from "./pages/skills.tsx";
import Login from "./pages/login.tsx";
import Certifications from "./pages/certifications.tsx";
import Experiences from "./pages/experiences.tsx";
import ProjectDetail from "./pages/project-detail.tsx";
// import Blobity from "blobity";
import BlobProviders from "./components/blobity-provider.tsx";
// import Splash from "./pages/splash.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/education",
        element: <Education />,
      },
      {
        path: "/experiences",
        element: <Experiences />,
      },
      {
        path: "/hobby",
        element: <Hobby />,
      },
      {
        path: "/projects",
        element: <Projects />,
      },
      { path: "/projects/:id", element: <ProjectDetail /> },
      {
        path: "/skills",
        element: <Skills />,
      },
      {
        path: "/certifications",
        element: <Certifications />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

const App = () => {

  // Initialize Blobity
  // useEffect(() => {
  //   // Wait for body to be fully loaded
  //   const initBlobity = () => {
  //     new Blobity({
  //       // License key - use 'opensource' for open source projects
  //       // or your GitHub username if you're a sponsor
  //       licenseKey: 'opensource',
        
  //       // Cursor appearance
  //       color: 'rgb(180, 180, 180)',
  //       dotColor: 'rgb(100, 100, 100)',
  //       dotSize: 6,
  //       size: 40,
        
  //       // Magnetic effect on buttons/links
  //       magnetic: true,
        
  //       // Smooth animations
  //       mode: 'normal', // Options: 'normal', 'slow', 'bouncy'
  //       kineticMorphing: true,
        
  //       // Elements that Blobity will interact with
  //       focusableElements: '[data-blobity], a:not([data-no-blobity]), button:not([data-no-blobity]), [data-blobity-tooltip]',
        
  //       // Visual styling
  //       radius: 8,
  //       opacity: 0.8,
        
  //       // Offset for hover effects
  //       focusableElementsOffsetX: 0,
  //       focusableElementsOffsetY: 0,
        
  //       // Z-index (set to -1 to keep it behind content)
  //       zIndex: 9999,
  //     });
  //   };

  //   // Initialize after a small delay to ensure DOM is ready
  //   const timer = setTimeout(initBlobity, 100);
    
  //   return () => clearTimeout(timer);
  // }, []);

  // if (loading) {
  //   return <Splash />; 
  // }

  return <RouterProvider router={router} />; 
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BlobProviders>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <App />
    </ThemeProvider>
    </BlobProviders>
  </React.StrictMode>,
);