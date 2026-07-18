// Canonical site content, shared by the React app and the real API endpoints.
// Keep this file free of asset imports so Node can load it directly.

export const site = {
  name: "Ishwor Khanal",
  role: "Backend Engineer",
  email: "ishworkhanal21@gmail.com",
  location: "Miami, FL",
  githubUsername: "ishworii",
  resumeUrl: "/resume.pdf",
  roles: [
    "Backend Developer",
    "API Designer",
    "Web Scraping Expert",
    "Automation Engineer",
  ],
  lede:
    "I live in the backend. I design APIs, move data around, and sometimes write a compiler just to see if I can.",
};

export const socials = [
  { label: "GitHub", url: "https://github.com/ishworii" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/ishwor-khanal-2654951ab/" },
  { label: "X", url: "https://x.com/ishworkhanal21" },
];

export const projectsData = [
  {
    slug: "url-shortener",
    title: "Distributed URL Shortener",
    tags: ["Python", "Rust", "Microservices", "Redis", "Docker"],
    description:
      "A production style URL shortener split into microservices: a dedicated key generation service, an async Python API, and a high performance Rust redirector, with multi tier caching over PostgreSQL and Redis, all wired together with Docker.",
    github: "https://github.com/ishworii/distributed-url-shortener",
  },
  {
    slug: "social-media-api",
    title: "Social Media API",
    tags: ["FastAPI", "PostgreSQL", "Redis", "WebSockets"],
    description:
      "Started as a tiny blog API and kept growing. It now handles role-based access control, real-time notifications over WebSockets, content moderation, Redis caching, and full-text search.",
    github: "https://github.com/ishworii/FastAPI_Social_Media_API",
  },
  {
    slug: "tinybasic-transpiler",
    title: "TinyBASIC Transpiler",
    tags: ["Rust", "Compilers"],
    description:
      "A transpiler that turns TinyBASIC into C. I wrote the lexer, parser, and emitter from scratch in Rust because I wanted to know how compilers actually work.",
    github: "https://github.com/ishworii/TinyBASIC-Transpiler",
  },
  {
    slug: "game-of-life",
    title: "Conway's Game of Life",
    tags: ["Rust", "ggez"],
    description:
      "The classic cellular automaton with an interactive GUI, built in Rust on the ggez engine. The little squares drifting around the top of this site? Same simulation.",
    github: "https://github.com/ishworii/Conway-s-Game-of-Life",
  },
  {
    slug: "chip8-emulator",
    title: "CHIP-8 Emulator",
    tags: ["Rust", "Emulation"],
    description:
      "A CHIP-8 emulator in Rust: fetch, decode, execute, sixteen registers, a sixty hertz timer, and many hours of very retro Pong. My gateway into systems emulation.",
    github: "https://github.com/ishworii/chip8_emulator",
  },
  {
    slug: "chess-engine",
    title: "Chess Engine",
    tags: ["Python", "Chess AI"],
    description:
      "A chess engine and GUI in pure Python: move generation, minimax with alpha beta pruning, and an evaluation function I keep arguing with. I play chess, so this one is personal.",
    github: "https://github.com/ishworii/sejal_chess_engine",
  },
  {
    slug: "http-server",
    title: "HTTP Server From Scratch",
    tags: ["Scala", "Networking"],
    description:
      "An HTTP server built up from raw sockets in Scala: parsing requests, routing, and serving responses with no framework in sight. The best way to understand HTTP is to implement it.",
    github: "https://github.com/ishworii/Custom-HTTP-Server",
  },
  {
    slug: "job-board",
    title: "Job Board",
    tags: ["FastAPI", "React", "SQLite"],
    description:
      "A complete job board with auth for both employers and job seekers, job posting, search, and application tracking. FastAPI on the back, React on the front.",
    github: "https://github.com/ishworii/Job_board_API",
  },
  {
    slug: "municipality-scrapers",
    title: "Municipality Scrapers",
    tags: ["Python", "Selenium"],
    description:
      "A pile of Selenium scrapers that pull public datasets from municipality websites into one tidy repo. Hours of manual data collection, automated away.",
    github: "https://github.com/ishworii/scrapers",
  },
];

export const aboutData = {
  paragraphs: [
    "I'm Ishwor. I grew up in Butwal, Nepal and I'm now in Miami working on a Master's in Information Technology. Before that I earned a Bachelor's in Electronics and Communication Engineering in Pokhara.",
    "I started tinkering with code one day and never really stopped. These days I live in the backend, designing APIs, building data pipelines, and automating anything I catch myself doing twice.",
    "Most of my day to day is Python with Django and FastAPI, plus Selenium for scraping. Lately I've been poking at Scala and Rust, which is how the TinyBASIC transpiler happened.",
  ],
  interests: ["Chess", "Reading", "Fun side projects"],
};

export const skillsData = [
  { name: "Python", icon: "python", color: "#5da9e9" },
  { name: "C / C++", icon: "cpp", color: "#659ad2" },
  { name: "Scala", icon: "scala", color: "#e45649" },
  { name: "Rust", icon: "rust", color: "#dea584" },
  { name: "Django", icon: "django", color: "#44b78b" },
  { name: "FastAPI", icon: "fastapi", color: "#2bb7a3" },
  { name: "Selenium", icon: "selenium", color: "#43b02a" },
  { name: "PostgreSQL", icon: "postgresql", color: "#699eca" },
  { name: "MongoDB", icon: "mongodb", color: "#4db33d" },
  { name: "Git", icon: "git", color: "#f0653e" },
];
