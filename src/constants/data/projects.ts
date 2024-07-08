// src/constants/data/projects.ts

export enum Category {
    FRONTEND,
    BACKEND,
    FULLSTACK,
  }
  
  export interface Project {
    id: string;
    title: string;
    stack: string[];
    imgUrl: string;
    description: string;
    githubUrl?: string;
    liveDemo?: string;
    category: Category;
  }
  
  export const Projectss: Project[] = [
    {
      id: "1",
      stack: ["typescript", "Next js", "Tailwind css"],
      title: "Speechify",
      description: "This is an web application that allows you convert input text into a human-like speech, it utilizes AI  models from the hugging face platform to make this functionality possible.",
      imgUrl: "https://raw.githubusercontent.com/RizkyFauziIlmi/project-simulasi-gerak/master/public/Screenshot%20from%202023-05-21%2017-46-16.png",
      githubUrl: "https://github.com/NwobiaDavid/speechify",
      liveDemo: "https://speechifyy.vercel.app/",
      category: Category.FRONTEND,
    },
    {
      id: "2",
      stack: ["node js", "express", "ejs", "mongo db", "auth"],
      title: "Notebook",
      description: "Notebook is a comprehensive note taking application. it serves as a practical and efficient solution for managing notes and taking notes, incorporating a seamless blend of front-end and back-end technologies.",
      imgUrl: "https://raw.githubusercontent.com/RizkyFauziIlmi/TaskEase/main/client/src/assets/Screenshot%202024-01-04%20at%2006-23-54%20TaskEase%20-%20Todo.png",
      githubUrl: "https://github.com/NwobiaDavid/notebook",
      liveDemo: "https://notebook-nglu.onrender.com/",
      category: Category.FULLSTACK,
    },
    {
      id: "3",
      stack: ["next js", "clerk", "mongo db", "upload thing"],
      title: "Hebron Hub",
      description: "a social media platform designed for covenant university students. that serves as a place to get the latest university information. it allows the functionality of commenting, following and joining groups",
      imgUrl: "https://raw.githubusercontent.com/RizkyFauziIlmi/portofolio/master/public/Screenshot%202024-01-04%20at%2006-27-22%20Rizky%20Fauzi%20Ilmi%20-%20Home.png",
      githubUrl: "https://github.com/NwobiaDavid/Hebron-Hub",
      liveDemo: "https://threads-murex-nine.vercel.app/",
      category: Category.FULLSTACK,
    },
    {
      id: "4",
      stack: ["next js", "upload thing", "next auth", "mongo db"],
      title: "Pallly",
      description: "a food delivery service that has over 100+ users built and deployed for production. secured",
      imgUrl: "https://raw.githubusercontent.com/RizkyFauziIlmi/portofolio/master/public/Screenshot%202024-01-04%20at%2006-27-22%20Rizky%20Fauzi%20Ilmi%20-%20Home.png",
      githubUrl: "https://github.com/RizkyFauziIlmi/project-simulasi-gerak",
      liveDemo: "https://rizkyfauziilmi.vercel.app/",
      category: Category.FULLSTACK,
    },
    {
      id: "5",
      stack: ["node js", "express", "react", "react-query"],
      title: "Byte&Crunch",
      description: "a food delivery service that has over 100+ users built and deployed for production. secured",
      imgUrl: "https://raw.githubusercontent.com/RizkyFauziIlmi/portofolio/master/public/Screenshot%202024-01-04%20at%2006-27-22%20Rizky%20Fauzi%20Ilmi%20-%20Home.png",
      githubUrl: "https://github.com/RizkyFauziIlmi/project-simulasi-gerak",
      liveDemo: "https://rizkyfauziilmi.vercel.app/",
      category: Category.FRONTEND,
    },
    {
      id: "6",
      stack: ["node js", "telegraf", "mongo db", "jwt"],
      title: "Byte&Crunch Telegram bot",
      description: "a food delivery service bot built on telegram, that makes it easy to updates it';s menu items by just uploading a menu.csv file and it automatically updates. that has over 100+ users built and deployed for production. secured",
      imgUrl: "https://raw.githubusercontent.com/RizkyFauziIlmi/portofolio/master/public/Screenshot%202024-01-04%20at%2006-27-22%20Rizky%20Fauzi%20Ilmi%20-%20Home.png",
      githubUrl: "https://github.com/NwobiaDavid/BnC_bot",
      category: Category.BACKEND,
    },
  ];
  