// The site's real API. One route table, served two ways:
//  - in dev, by a Vite middleware (see vite.config.js)
//  - in production, by the Vercel functions in /api
// Pretty paths (/projects, /whoami, ...) are also rewritten here for
// curl / wget / httpie / Postman user agents, so the GET lines shown
// on the page actually work from a shell.

import { aboutData, projectsData, site, skillsData, socials } from "./site-content.js";

const json = (body, status = 200) => ({
  status,
  type: "application/json; charset=utf-8",
  body: JSON.stringify(body, null, 2) + "\n",
});

const text = (body, status = 200) => ({
  status,
  type: "text/plain; charset=utf-8",
  body,
});

const ENDPOINTS = ["/whoami", "/about", "/projects", "/skills", "/contact"];

const banner = `
  _     _
 (_)___| |____      _____  _ __
 | / __| '_ \\ \\ /\\ / / _ \\| '__|
 | \\__ \\ | | \\ V  V / (_) | |
 |_|___/_| |_|\\_/\\_/ \\___/|_|

${site.name} · ${site.role} · ${site.location}

Endpoints:
  GET  /whoami      who is this
  GET  /projects    things I have built
  GET  /skills      tools I reach for
  GET  /contact     how to reach me
  POST /contact     say hello (json: {"message": "..."})

You found the API. I like you already.
`;

export function handleRoute(method, path, body) {
  if (path === "/" || path === "") {
    return text(banner);
  }

  if (path === "/whoami" || path === "/about") {
    if (method !== "GET") return methodNotAllowed(["GET"]);
    return json({
      name: site.name,
      role: site.role,
      location: site.location,
      origin: "Butwal, Nepal",
      about: aboutData.paragraphs,
      interests: aboutData.interests,
      github: `https://github.com/${site.githubUsername}`,
    });
  }

  if (path === "/projects") {
    if (method !== "GET") return methodNotAllowed(["GET"]);
    return json(
      projectsData.map(({ slug, title, tags, description, github }) => ({
        slug,
        title,
        tags,
        description,
        github,
      }))
    );
  }

  if (path === "/skills") {
    if (method !== "GET") return methodNotAllowed(["GET"]);
    return json(skillsData.map((skill) => skill.name));
  }

  if (path === "/contact") {
    if (method === "GET") {
      return json({
        email: site.email,
        socials: Object.fromEntries(socials.map((s) => [s.label.toLowerCase(), s.url])),
        hint: 'POST /contact with {"message": "..."} also works',
      });
    }
    if (method === "POST") {
      const message = extractMessage(body);
      if (!message) {
        return json(
          { error: "send a message", example: '{"message": "hi ishwor"}' },
          400
        );
      }
      return json(
        {
          status: "received",
          note: `Honest disclaimer: this demo endpoint does not store anything yet. For a reply, email ${site.email}`,
          echo: message.slice(0, 280),
        },
        202
      );
    }
    return methodNotAllowed(["GET", "POST"]);
  }

  return json({ error: "not found", try: ENDPOINTS }, 404);
}

function methodNotAllowed(allow) {
  return json({ error: "method not allowed", allow }, 405);
}

// Body shape differs by runtime: dev middleware gives a string or parsed
// JSON, Vercel's helper may give parsed JSON, a raw string, or (for
// curl's default urlencoded content-type) an object whose KEY is the
// JSON text. Accept all of them.
function extractMessage(body) {
  if (typeof body === "string") {
    const s = body.trim();
    if (!s) return null;
    try {
      const parsed = JSON.parse(s);
      if (parsed && typeof parsed === "object")
        return parsed.message ? String(parsed.message) : null;
    } catch {
      // not JSON: treat the raw string as the message
    }
    return s;
  }
  if (body && typeof body === "object") {
    if (body.message) return String(body.message);
    for (const key of Object.keys(body)) {
      try {
        const parsed = JSON.parse(key);
        if (parsed && typeof parsed === "object" && parsed.message)
          return String(parsed.message);
      } catch {
        // key was not JSON, keep looking
      }
    }
  }
  return null;
}

// Adapter for Node-style (req, res), used by Vercel functions and Vite middleware.
export function nodeHandler(fixedPath) {
  return async (req, res) => {
    // Vercel's req.body getter THROWS on malformed JSON; never let that
    // take down the function, fall back to reading the stream.
    let body;
    try {
      body = req.body;
    } catch {
      body = undefined;
    }
    if (body === undefined) body = await readBody(req);
    const url = (req.url || "/").split("?")[0];
    // with no fixed path (the /api catch-all), route by URL minus the prefix
    const path = fixedPath ?? (url.replace(/^\/api(?=\/|$)/, "") || "/");
    const result = handleRoute(req.method || "GET", path, body);
    res.statusCode = result.status;
    res.setHeader("content-type", result.type);
    res.setHeader("x-powered-by", "caffeine");
    res.end(result.body);
  };
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    // if the runtime already consumed the stream, don't hang forever
    const timer = setTimeout(() => resolve(undefined), 3000);
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      clearTimeout(timer);
      if (!data) return resolve(undefined);
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve(data);
      }
    });
    req.on("error", () => {
      clearTimeout(timer);
      resolve(undefined);
    });
  });
}

export const CLI_UA = /curl|wget|httpie|postman/i;
export const PRETTY_PATHS = ["/", ...ENDPOINTS];
