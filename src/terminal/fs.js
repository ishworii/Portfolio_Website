// A tiny in-memory filesystem for the site terminal, built from the
// real site content. Session-scoped: mkdir/touch/rm changes live until
// the page reloads.

import { aboutData, projectsData, site, skillsData, socials } from "../../content/site-content.js";

const dir = (children = {}) => ({ t: "d", c: children });
const file = (lines) => ({ t: "f", lines });
const binary = () => ({ t: "b" });

export function createFs() {
  const projectFiles = {};
  for (const p of projectsData) {
    projectFiles[`${p.slug}.md`] = file([
      `# ${p.title}`,
      `tags: ${p.tags.join(", ")}`,
      "",
      p.description,
      "",
      p.github,
    ]);
  }

  return dir({
    "about.txt": file([
      ...aboutData.paragraphs,
      "",
      `interests: ${aboutData.interests.join(", ")}`,
    ]),
    "skills.txt": file(skillsData.map((s) => s.name)),
    "contact.txt": file([
      `email: ${site.email}`,
      ...socials.map((s) => `${s.label.toLowerCase()}: ${s.url}`),
    ]),
    "resume.pdf": binary(),
    projects: dir(projectFiles),
  });
}

// Resolve a path string against cwd (array of segments below home).
// Returns { node, parts } or null. "~" and "/" both mean home.
export function resolve(root, cwd, path) {
  let parts;
  if (!path || path === "~" || path === "/") {
    parts = [];
  } else if (path.startsWith("~/")) {
    parts = path.slice(2).split("/");
  } else if (path.startsWith("/")) {
    parts = path.slice(1).split("/");
  } else {
    parts = [...cwd, ...path.split("/")];
  }

  const clean = [];
  for (const part of parts) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      clean.pop();
      continue;
    }
    clean.push(part);
  }

  let node = root;
  for (const part of clean) {
    if (node.t !== "d" || !(part in node.c)) return null;
    node = node.c[part];
  }
  return { node, parts: clean };
}

export function displayCwd(cwd) {
  return cwd.length ? `~/${cwd.join("/")}` : "~";
}
