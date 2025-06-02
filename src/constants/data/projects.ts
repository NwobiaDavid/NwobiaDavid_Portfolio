// src/constants/data/projects.ts

export enum Category {
  FEATURED,
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
  keyFeatures: string[];
  thoughtProcess: string;
  challenges: string;
  solutions: string;
  video?: string;
  githubUrl?: string;
  liveDemo?: string;
  categories: Category[];
}

export const Projectss: Project[] = [
  {
    id: '1',
    stack: ['TypeScript', 'Next.js', 'Tailwind CSS'],
    title: 'Speechify',
    description:
      'Speechify is a web application that enables users to convert input text into lifelike human speech using advanced AI models from Hugging Face. It is built for performance and optimized to deliver fast and accurate audio output, ensuring a seamless user experience.',
    keyFeatures: [
      'Text-to-speech conversion',
      'AI model integration with Hugging Face',
      'Responsive UI built with Tailwind CSS',
      'Real-time performance optimization',
      'Cross-browser compatibility',
    ],
    thoughtProcess:
      'The goal was to create a simple interface where users could enter text and convert it into speech seamlessly. I chose Next.js for fast server-side rendering and AI models from Hugging Face for reliable text-to-speech conversion.',
    challenges:
      "One challenge was ensuring the AI model's performance in real-time, especially when handling longer text inputs.",
    solutions:
      'I optimized the server-side processes in Next.js and implemented lazy loading to ensure smooth user experience, even with large input sizes.',
    imgUrl: '/images/projects/speechify.png',
    githubUrl: 'https://github.com/NwobiaDavid/speechify',
    liveDemo: 'https://speechifyy.vercel.app/',
    categories: [Category.FRONTEND],
  },
  {
    id: '2',
    stack: ['Node.js', 'Express', 'EJS', 'MongoDB', 'Authentication'],
    title: 'Notebook',
    description:
      'Notebook is a full-stack note-taking application offering a streamlined solution for organizing, managing, and accessing notes. Built using modern technologies, it provides a secure and intuitive interface for users to create, edit, and store notes efficiently.',
    keyFeatures: [
      'Secure authentication system',
      'CRUD operations for note management',
      'Responsive user interface with EJS',
      'Scalable backend with MongoDB',
      'RESTful API integration',
    ],
    thoughtProcess:
      'I aimed to build a practical and efficient tool for note management, focusing on simplicity and security. I used EJS for server-side rendering and MongoDB to handle a growing user base and data storage.',
    challenges:
      'Integrating authentication while maintaining smooth user experience was difficult, especially handling sessions securely.',
    solutions:
      'I implemented token-based authentication using JWT, which provided secure access control without compromising performance.',
    imgUrl: '/images/projects/notebk.png',
    githubUrl: 'https://github.com/NwobiaDavid/notebook',
    liveDemo: 'https://notebook-nglu.onrender.com/',
    categories: [Category.FEATURED, Category.FULLSTACK],
  },
  {
    id: '3',
    stack: ['Next.js', 'Clerk', 'MongoDB', 'UploadThing'],
    title: 'Hebron Hub',
    description:
      'Hebron Hub is a social media platform designed for Covenant University students to stay connected and informed. It allows users to follow, comment, and join groups, offering a real-time experience with data stored securely in MongoDB.',
    keyFeatures: [
      'Real-time data updates',
      'Group and commenting features',
      'User authentication with Clerk',
      'MongoDB for scalable data storage',
      'Responsive and intuitive user interface',
    ],
    thoughtProcess:
      'I wanted to create a social hub where students could easily access university-related content and connect with each other. My goal was to integrate real-time updates and seamless user interactions using Next.js.',
    challenges:
      'Managing real-time updates for large data sets and user interactions in a scalable way proved to be a challenge.',
    solutions:
      'I utilized MongoDB’s scalability features along with efficient querying techniques and optimized the API calls to reduce latency.',
    imgUrl: '/images/projects/hebron.png',
    githubUrl: 'https://github.com/NwobiaDavid/Hebron-Hub',
    liveDemo: 'https://threads-murex-nine.vercel.app/',
    categories: [Category.FULLSTACK],
  },
  {
    id: '4',
    stack: ['Next.js', 'UploadThing', 'NextAuth', 'MongoDB'],
    title: 'Pallly',
    description:
      'Pallly is a scalable and secure food delivery platform that serves over 100 active users. The platform is optimized for production, offering features like real-time order updates and secure authentication with NextAuth.',
    keyFeatures: [
      'User authentication with NextAuth',
      'Responsive UI for various devices',
      'Efficient food delivery ordering system',
      'Real-time updates for order tracking',
      'MongoDB for secure and scalable data storage',
    ],
    thoughtProcess:
      'My primary goal was to design a robust, user-friendly platform that could scale easily and handle real-time orders. Security and user data protection were key priorities.',
    challenges:
      'Ensuring a secure user authentication system while maintaining scalability as user numbers grew.',
    solutions:
      'I integrated NextAuth for authentication and MongoDB for managing secure data at scale. I also utilized efficient API architecture to handle increasing data load.',
    imgUrl: '/images/projects/pally.png',
    liveDemo: 'https://pallly-online.vercel.app/',
    categories: [Category.FEATURED, Category.FULLSTACK],
  },
  {
    id: '5',
    stack: ['Node.js', 'Express', 'MongoDB', 'React', 'React Query'],
    title: 'Byte&Crunch',
    description:
      'Byte&Crunch is an e-commerce platform with over 100 product listings, designed for food delivery services. The platform is optimized for real-time product updates and user authentication, built to scale with a growing user base.',
    keyFeatures: [
      'E-commerce store with product listings',
      'User authentication and payment gateway',
      'Real-time product updates',
      'Efficient data fetching with React Query',
      'MongoDB for database management',
    ],
    thoughtProcess:
      'I wanted to build a production-ready e-commerce platform for food delivery, focusing on user experience, scalability, and secure payment handling.',
    challenges:
      'Handling real-time updates for product listings and ensuring a seamless user experience with multiple API integrations was tricky.',
    solutions:
      'React Query enabled efficient data fetching, while MongoDB provided the necessary scalability. I also fine-tuned the backend APIs to improve performance.',
    imgUrl: '/images/projects/bnc-webapp.png',
    video: 'https://www.youtube.com/embed/K8GEqIIJz84',
    liveDemo: 'https://byteandcrunch.onrender.com/',
    categories: [Category.FULLSTACK],
  },
  {
    id: '6',
    stack: ['Node.js', 'Telegraf', 'MongoDB', 'JWT'],
    title: 'Byte&Crunch Telegram Bot',
    description:
      'Byte&Crunch Telegram Bot automates the food delivery menu update process by allowing administrators to upload a CSV file. The bot integrates with Telegraf and MongoDB to efficiently handle user orders and streamline operations.',
    keyFeatures: [
      'Automated menu updates via CSV uploads',
      'Secure user authentication with JWT',
      'Real-time order management',
      'Built using Telegraf and Node.js',
      'Scalable database management with MongoDB',
    ],
    thoughtProcess:
      'I aimed to create a simple but effective automation tool that reduced manual menu updates. The goal was to use a familiar platform like Telegram to streamline order management.',
    challenges:
      'Handling real-time updates in a bot environment while maintaining secure user access was a key challenge.',
    solutions:
      'Using JWT for secure authentication and MongoDB for quick data retrieval, I ensured that the bot could handle multiple user requests efficiently while maintaining data security.',
    imgUrl: '/images/projects/bnc-bot.png',
    video: 'https://www.youtube.com/embed/KjsFCFAY1TE',
    githubUrl: 'https://github.com/NwobiaDavid/BnC_bot',
    categories: [Category.BACKEND],
  },
  {
    id: '7',
    stack: ['React', 'Vite', 'React Router', 'GSAP', 'Zustand'],
    title: 'Kelani.ng - Engineering, Power & Consulting',
    description:
      'Kelani.ng is a corporate website showcasing the company\'s engineering, power, and consulting services. I built a single template that powers all three sections, demonstrating efficient code reuse and modular design. The site features smooth animations and state management for an engaging user experience.',
    keyFeatures: [
      'Single template reused across multiple sections',
      'Smooth animations powered by GSAP',
      'Efficient state management with Zustand',
      'Responsive design for all devices',
      'Fast performance with Vite build tool',
    ],
    thoughtProcess:
      'The goal was to create a cohesive corporate website with consistent design across different service sections. By building a single, flexible template, I was able to maintain design consistency while minimizing code duplication.',
    challenges:
      'Creating a template flexible enough to accommodate different content structures while maintaining consistent animations and interactions.',
    solutions:
      'I designed a modular component system with configurable props and used Zustand for shared state management. GSAP animations were parameterized to work with varying content lengths.',
    imgUrl: '/images/projects/img-kelani.PNG',
    liveDemo: 'https://kelani.ng/',
    githubUrl: 'https://github.com/NwobiaDavid/Kelani-Engineering',
    categories: [Category.FRONTEND],
  },
];
