// Canonical site content, shared by the React app and the real API endpoints.
// Keep this file free of asset imports so Node can load it directly.

export const site = {
  name: "Ishwori Khanal",
  role: "Senior Data Engineer",
  email: "ishworikhanal78@gmail.com",
  location: "Dallas, TX",
  githubUsername: "ishworii",
  resumeUrl: "/resume.pdf",
  roles: [
    "Senior Data Engineer",
    "Data Platform Architect",
    "Backend Developer",
    "Automation Engineer",
  ],
  lede:
    "I move data at scale. Cloud pipelines and data platforms by day, APIs, emulators, and the occasional compiler by night.",
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
    "I'm Ishwori. I grew up in Butwal, Nepal, studied Electronics and Communication Engineering in Pokhara, and I'm now a Senior Data Engineer based in Dallas.",
    "I've spent 5+ years building cloud data platforms across AWS, Azure, and GCP: automating 120+ enterprise pipelines at Visa, architecting healthcare analytics on BigQuery and Databricks at Kaiser Permanente, and modernizing clinical data workloads at Merck.",
    "Off the clock I still write code purely for fun. That's where the compilers, emulators, chess engines, and the Game of Life running on this page come from.",
  ],
  interests: ["Chess", "Reading", "Fun side projects"],
};

export const skillsData = [
  { name: "Python", icon: "python", color: "#5da9e9" },
  { name: "Spark", icon: "spark", color: "#e25a1c" },
  { name: "Kafka", icon: "kafka", color: "#94a3b8" },
  { name: "Airflow", icon: "airflow", color: "#017cee" },
  { name: "Snowflake", icon: "snowflake", color: "#29b5e8" },
  { name: "Databricks", icon: "databricks", color: "#ff3621" },
  { name: "AWS", icon: "aws", color: "#ff9900" },
  { name: "GCP", icon: "gcp", color: "#4285f4" },
  { name: "Azure", icon: "azure", color: "#0078d4" },
  { name: "Terraform", icon: "terraform", color: "#7b42bc" },
  { name: "Docker", icon: "docker", color: "#2496ed" },
  { name: "PostgreSQL", icon: "postgresql", color: "#699eca" },
  { name: "FastAPI", icon: "fastapi", color: "#2bb7a3" },
  { name: "Rust", icon: "rust", color: "#dea584" },
  { name: "Scala", icon: "scala", color: "#e45649" },
];
