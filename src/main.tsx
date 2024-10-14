/* eslint-disable react-refresh/only-export-components */
import React, { useEffect, useState } from "react";
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
import Splash from "./pages/splash.tsx";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 8000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Splash />; 
  }

  return <RouterProvider router={router} />; 

};

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
       <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <App />
      </ThemeProvider>
    </React.StrictMode>,
  );
