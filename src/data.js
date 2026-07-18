// The React app's view of the site content. Copy lives in
// content/site-content.js (shared with the real API); this file just
// attaches media that only the browser bundle needs.

import {
  aboutData,
  projectsData,
  site,
  skillsData,
  socials,
} from "../content/site-content.js";

import socialMediaApi from "./assets/projects/social_media_api.png";
import conwaysVideo from "./assets/projects/conways.mp4";
import tinybasic from "./assets/projects/tinybasic.png";
import jobPortal from "./assets/projects/job_portal.png";
import municipalityScraper from "./assets/projects/municipality_scraper.png";

// projects without screenshots get a styled "cover" with a glyph instead
const media = {
  "url-shortener": { cover: { glyph: "/xK9 → 301", color: "#ffb454" } },
  "social-media-api": { image: socialMediaApi },
  "tinybasic-transpiler": { image: tinybasic },
  "game-of-life": { video: conwaysVideo },
  "chip8-emulator": { cover: { glyph: "0xDXYN", color: "#f07178" } },
  "chess-engine": { cover: { glyph: "♞ Nf3!?", color: "#59c2ff" } },
  "http-server": { cover: { glyph: "HTTP/1.1", color: "#7fd962" } },
  "job-board": { image: jobPortal },
  "municipality-scrapers": { image: municipalityScraper },
};

export const projects = projectsData.map((project) => ({
  ...project,
  ...media[project.slug],
}));

export const about = aboutData;
export const skills = skillsData;
export { site, socials };
