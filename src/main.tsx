import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "./hooks/layouts/main-layout.tsx";
import Home from "./pages/home.tsx";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.tsx";
import Education from "./pages/education.tsx";
import Hobby from "./pages/hobby.tsx";
import Projects from "./pages/projects.tsx";
import Skills from "./pages/skills.tsx";
import Login from "./pages/login.tsx";
import Certifications from "./pages/certifications.tsx";
import Experiences from "./pages/experiences.tsx";

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


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>,
)
