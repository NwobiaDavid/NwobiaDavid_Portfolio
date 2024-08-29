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
    video: string;
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
      imgUrl: "/images/projects/speechify.png",
      githubUrl: "https://github.com/NwobiaDavid/speechify",
      liveDemo: "https://speechifyy.vercel.app/",
      video: "https://youtu.be/KjsFCFAY1TE",
      category: Category.FRONTEND,
    },
    {
      id: "2",
      stack: ["node js", "express", "ejs", "mongo db", "auth"],
      title: "Notebook",
      description: "Notebook is a comprehensive note taking application. it serves as a practical and efficient solution for managing notes and taking notes, incorporating a seamless blend of front-end and back-end technologies.",
      imgUrl: "/images/projects/notebk.png",
      githubUrl: "https://github.com/NwobiaDavid/notebook",
      video: "https://youtu.be/KjsFCFAY1TE",
      liveDemo: "https://notebook-nglu.onrender.com/",
      category: Category.FULLSTACK,
    },
    {
      id: "3",
      stack: ["Next JS", "Clerk", "Mongo DB", "Upload Thing"],
      title: "Hebron Hub",
      description: "a social media platform designed for covenant university students. that serves as a place to get the latest university information. it allows the functionality of commenting, following and joining groups",
      imgUrl: "/images/projects/hebron.png",
      githubUrl: "https://github.com/NwobiaDavid/Hebron-Hub",
      video: "https://youtu.be/KjsFCFAY1TE",
      liveDemo: "https://threads-murex-nine.vercel.app/",
      category: Category.FULLSTACK,
    },
    {
      id: "4",
      stack: ["Next JS", "upload thing", "next auth", "mongo db"],
      title: "Pallly",
      description: "a food delivery service that has over 100+ users built and deployed for production. secured",
      imgUrl: "/images/projects/pally.png",
      video: "https://youtu.be/KjsFCFAY1TE",
      // githubUrl: "https://github.com/RizkyFauziIlmi/project-simulasi-gerak",
      liveDemo: "https://pallly-online.vercel.app/",
      category: Category.FULLSTACK,
    },
    {
      id: "5",
      stack: ["Node JS", "express", "Mongo DB","react", "react-query"],
      title: "Byte&Crunch",
      description: "an e commerce store that has over 100 product listing and it asks as food delivery web  that has over 100+ users built and deployed for production. secured",
      imgUrl: "/images/projects/bnc webapp.png",
      video: "https://www.youtube.com/embed/K8GEqIIJz84",
      // githubUrl: "https://github.com/RizkyFauziIlmi/project-simulasi-gerak",
      liveDemo: "https://byteandcrunch.onrender.com/",
      category: Category.FULLSTACK,
    },
    {
      id: "6",
      stack: ["Node JS", "Telegraf", "Mongo DB", "JWT"],
      title: "Byte&Crunch Telegram bot",
      description: "a food delivery service bot built on telegram, that makes it easy to updates it's menu items by just uploading a menu.csv file and it automatically updates. that has over 100+ users built and deployed for production.",
      imgUrl: "/images/projects/bnc bot.png",
      video: "https://www.youtube.com/embed/KjsFCFAY1TE",
      githubUrl: "https://github.com/NwobiaDavid/BnC_bot",
      category: Category.BACKEND,
    },
  ];

  // <iframe width="1250" height="703" src="https://www.youtube.com/embed/K8GEqIIJz84" title="bnc e-commerce webapp" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  