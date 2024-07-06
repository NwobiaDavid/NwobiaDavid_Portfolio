// src/constants/data/projects.ts

export enum Category {
    FRONTEND,
    BACKEND,
    FULLSTACK,
  }
  
  export interface Project {
    id: string;
    title: string;
    imgUrl: string;
    description: string;
    githubUrl: string;
    liveDemo?: string;
    category: Category;
  }
  
  export const Projects: Project[] = [
    {
      id: "1",
      title: "Free Fall Motion and Projectile Motion Simulation with HTML5 Canvas and JavaScript",
      description: "This interactive simulation employs HTML5 Canvas and JavaScript to visualize free fall motion. With customizable parameters, real-time animation provides a direct understanding of physics principles. Designed for education and exploration, the simulation is responsive, informative, and accessible across platforms.",
      imgUrl: "https://raw.githubusercontent.com/RizkyFauziIlmi/project-simulasi-gerak/master/public/Screenshot%20from%202023-05-21%2017-46-16.png",
      githubUrl: "https://github.com/RizkyFauziIlmi/project-simulasi-gerak",
      category: Category.FRONTEND,
    },
    {
      id: "2",
      title: "TaskEase",
      description: "TaskEase is a comprehensive Todo application developed as a final project for the third semester, utilizing the MERN (MongoDB, Express.js, React, Node.js) stack. This application serves as a practical and efficient solution for managing tasks and to-dos, incorporating a seamless blend of front-end and back-end technologies.",
      imgUrl: "https://raw.githubusercontent.com/RizkyFauziIlmi/TaskEase/main/client/src/assets/Screenshot%202024-01-04%20at%2006-23-54%20TaskEase%20-%20Todo.png",
      githubUrl: "https://github.com/RizkyFauziIlmi/TaskEase",
      category: Category.FULLSTACK,
    },
    {
      id: "3",
      title: "Portfolio",
      description: "Dynamic and visually appealing web application developed using the React library. This portfolio is designed to showcase my skills, projects, and achievements with an elegant touch of shadows and interactive elements, providing a memorable user experience.",
      imgUrl: "https://raw.githubusercontent.com/RizkyFauziIlmi/portofolio/master/public/Screenshot%202024-01-04%20at%2006-27-22%20Rizky%20Fauzi%20Ilmi%20-%20Home.png",
      githubUrl: "https://github.com/RizkyFauziIlmi/project-simulasi-gerak",
      liveDemo: "https://rizkyfauziilmi.vercel.app/",
      category: Category.FRONTEND,
    },
  ];
  