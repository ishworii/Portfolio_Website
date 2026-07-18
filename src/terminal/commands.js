// Command engine for the site terminal. Commands return arrays of lines:
//   "plain string"
//   { spans: [{ t: "text", c: "blue" }] }   colored segments
//   { link: url, text: "label" }            clickable
// The component adds { cmd, p } echo lines itself.

import { projectsData, site, skillsData, socials } from "../../content/site-content.js";
import { createFs, displayCwd, resolve } from "./fs.js";

const s = (t, c) => ({ t, c });
const line = (...spans) => ({ spans });

const MAN = {
  help: "list available commands",
  whoami: "who runs this place",
  ls: "list directory contents",
  cd: "change directory",
  pwd: "print working directory",
  cat: "print a file",
  head: "first lines of a file",
  tail: "last lines of a file",
  grep: "search inside a file",
  tree: "draw the directory tree",
  mkdir: "make a directory (this session only)",
  touch: "create an empty file (this session only)",
  rm: "remove a file you created",
  echo: "print arguments",
  date: "print the date",
  uptime: "how long this page has been alive",
  uname: "print system information",
  hostname: "print the host name",
  ps: "list running processes",
  history: "your command history",
  man: "read a manual page",
  which: "locate a command",
  neofetch: "system info, with style",
  cowsay: "a cow says your words",
  projects: "shortcut for the project list",
  skills: "shortcut for the skill list",
  contact: "how to reach me",
  resume: "open the resume pdf",
  open: "open a file (resume.pdf)",
  curl: "hit this site's real API",
  clear: "wipe the screen",
};

export const COMMANDS = Object.keys(MAN).concat(["sudo", "exit", "vim", "nano", "emacs"]);

const HELP = [
  line(s("shell     ", "blue"), s("ls  cd  pwd  cat  head  tail  grep  tree  echo  clear  history", "text")),
  line(s("files     ", "blue"), s("mkdir  touch  rm    (session only, go wild)", "text")),
  line(s("system    ", "blue"), s("whoami  uname  uptime  ps  date  hostname  man  which  neofetch", "text")),
  line(s("site      ", "blue"), s("projects  skills  contact  resume  curl <path>", "text")),
  line(s("api paths ", "blue"), s("/  /whoami  /projects  /skills  /contact", "text")),
  line(s("fun       ", "blue"), s("cowsay  sudo  and a few you'll have to find", "text")),
];

// syntax highlight one line of JSON output
function highlightJson(text) {
  const spans = [];
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+\.?\d*)|(\btrue\b|\bfalse\b|\bnull\b)/g;
  let last = 0;
  let match;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) spans.push(s(text.slice(last, match.index), "muted"));
    if (match[1] !== undefined) {
      spans.push(s(match[1], match[2] ? "blue" : "green"));
      if (match[2]) spans.push(s(match[2], "muted"));
    } else if (match[3] !== undefined) {
      spans.push(s(match[3], "amber"));
    } else if (match[4] !== undefined) {
      spans.push(s(match[4], "purple"));
    }
    last = re.lastIndex;
  }
  if (last < text.length) spans.push(s(text.slice(last), "muted"));
  return { spans };
}

function listDir(node, showAll) {
  const names = Object.keys(node.c).sort((a, b) => {
    const ad = node.c[a].t === "d" ? 0 : 1;
    const bd = node.c[b].t === "d" ? 0 : 1;
    return ad - bd || a.localeCompare(b);
  });
  const spans = [];
  if (showAll) spans.push(s(".  ", "blue"), s("..  ", "blue"));
  for (const name of names) {
    const child = node.c[name];
    if (child.t === "d") spans.push(s(`${name}/`, "blue"), s("  ", "text"));
    else if (child.t === "b") spans.push(s(name, "red"), s("  ", "text"));
    else spans.push(s(name, "text"), s("  ", "text"));
  }
  return spans.length ? [{ spans }] : [""];
}

function drawTree(node, prefix = "") {
  const names = Object.keys(node.c);
  return names.flatMap((name, i) => {
    const isLast = i === names.length - 1;
    const child = node.c[name];
    const branch = isLast ? "└── " : "├── ";
    const label =
      child.t === "d" ? s(`${name}/`, "blue") : child.t === "b" ? s(name, "red") : s(name, "text");
    const row = line(s(prefix + branch, "muted"), label);
    if (child.t === "d") {
      return [row, ...drawTree(child, prefix + (isLast ? "    " : "│   "))];
    }
    return [row];
  });
}

const COW = String.raw`        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||`;

function cowsay(message) {
  const text = message || "moo";
  const top = " " + "_".repeat(text.length + 2);
  const bottom = " " + "-".repeat(text.length + 2);
  return [top, `< ${text} >`, bottom, ...COW.split("\n")];
}

const NEOFETCH_ART = [
  " _ _    ",
  "(_) | __",
  "| | |/ /",
  "| |   < ",
  "|_|_|\\_\\",
  "        ",
];

// split respecting single and double quotes, so -d '{"message": "hi"}' works
function tokenize(input) {
  const out = [];
  const re = /'([^']*)'|"([^"]*)"|(\S+)/g;
  let match;
  while ((match = re.exec(input)) !== null) {
    out.push(match[1] ?? match[2] ?? match[3]);
  }
  return out;
}

async function fakeCurl(args) {
  let method = "GET";
  let data = null;
  const rest = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-X" && args[i + 1]) method = args[++i].toUpperCase();
    else if (args[i] === "-d" && args[i + 1]) data = args[++i];
    else rest.push(args[i]);
  }
  let path = rest[0] || "/";
  // accept full urls, scheme-less hosts (like the banner suggests), and bare paths
  path = path.replace(/^https?:\/\/[^/]+/, "") || "/";
  if (!path.startsWith("/")) {
    const slash = path.indexOf("/");
    const head = slash === -1 ? path : path.slice(0, slash);
    if (head.includes(".") || head.includes(":")) {
      path = slash === -1 ? "/" : path.slice(slash);
    } else {
      path = "/" + path;
    }
  }
  const apiPath = path.startsWith("/api") ? path : `/api${path === "/" ? "" : path}`;
  if (data && method === "GET") method = "POST";

  const options = { method };
  if (data && method !== "GET" && method !== "HEAD") {
    options.headers = { "content-type": "application/json" };
    // if the user already passed JSON, send it as-is; otherwise wrap it
    let body;
    try {
      JSON.parse(data);
      body = data;
    } catch {
      body = JSON.stringify({ message: data });
    }
    options.body = body;
  }

  try {
    const res = await fetch(apiPath, options);
    const body = await res.text();
    const ok = res.status < 400;
    const status = line(s(`HTTP/1.1 ${res.status}`, ok ? "green" : "red"), s(` ${res.statusText || ""}`.trimEnd(), "muted"));
    const isJson = (res.headers.get("content-type") || "").includes("json");
    const bodyLines = body.split("\n").map((l) => (isJson ? highlightJson(l) : l));
    return [status, ...bodyLines];
  } catch {
    return [line(s("curl: could not reach the API. Is the dev server running?", "red"))];
  }
}

export function createSession(getHistory) {
  const fs = createFs();
  let cwd = [];
  const start = Date.now();

  const prompt = () => `guest@ishwor:${displayCwd(cwd)}$`;

  async function run(input) {
    const tokens = tokenize(input.trim());
    const cmd = tokens[0] || "";
    const args = tokens.slice(1);
    const flags = args.filter((a) => a.startsWith("-"));
    const rest = args.filter((a) => !a.startsWith("-"));

    switch (cmd) {
      case "":
        return [];
      case "help":
        return HELP;
      case "whoami":
        return [`${site.name} · ${site.role} · ${site.location}`];
      case "hostname":
        return [window.location.hostname || "ishwor.dev"];
      case "pwd":
        return [`/home/ishwor${cwd.length ? "/" + cwd.join("/") : ""}`];

      case "ls": {
        const target = resolve(fs, cwd, rest[0] || ".");
        if (!target) return [line(s(`ls: ${rest[0]}: no such file or directory`, "red"))];
        if (target.node.t !== "d") return [rest[0]];
        return listDir(target.node, flags.includes("-a") || flags.includes("-la"));
      }

      case "cd": {
        const target = resolve(fs, cwd, rest[0] || "~");
        if (!target) return [line(s(`cd: ${rest[0]}: no such file or directory`, "red"))];
        if (target.node.t !== "d") return [line(s(`cd: ${rest[0]}: not a directory`, "red"))];
        cwd = target.parts;
        return [];
      }

      case "cat":
      case "head":
      case "tail": {
        // parse "-n 5 file", "-n5 file", and plain "file"
        let n = 10;
        const files = [];
        for (let i = 0; i < args.length; i++) {
          const a = args[i];
          if (a === "-n") n = parseInt(args[++i], 10) || 10;
          else if (/^-n\d+$/.test(a)) n = parseInt(a.slice(2), 10) || 10;
          else if (!a.startsWith("-")) files.push(a);
        }
        const fileArg = files[0];
        if (!fileArg) return [line(s(`${cmd}: missing file operand`, "red"))];
        const target = resolve(fs, cwd, fileArg);
        if (!target) return [line(s(`${cmd}: ${fileArg}: no such file`, "red"))];
        if (target.node.t === "d") return [line(s(`${cmd}: ${fileArg}: is a directory`, "red"))];
        if (target.node.t === "b")
          return ["binary file. try 'open resume.pdf' or just 'resume'."];
        const lines = target.node.lines;
        if (cmd === "head") return lines.slice(0, n);
        if (cmd === "tail") return lines.slice(-n);
        return [...lines];
      }

      case "grep": {
        if (rest.length < 2) return ["usage: grep <pattern> <file>"];
        const target = resolve(fs, cwd, rest[1]);
        if (!target || target.node.t !== "f")
          return [line(s(`grep: ${rest[1]}: no such file`, "red"))];
        const pattern = rest[0].toLowerCase();
        const hits = target.node.lines.filter((l) => l.toLowerCase().includes(pattern));
        return hits.length ? hits : [line(s("(no matches)", "muted"))];
      }

      case "tree": {
        const target = resolve(fs, cwd, rest[0] || ".");
        if (!target || target.node.t !== "d") return [line(s("tree: not a directory", "red"))];
        return [line(s(displayCwd(target.parts), "blue")), ...drawTree(target.node)];
      }

      case "mkdir": {
        if (!rest[0]) return [line(s("mkdir: missing operand", "red"))];
        const parent = resolve(fs, cwd, ".");
        const name = rest[0].replace(/\/+$/, "");
        if (parent.node.c[name]) return [line(s(`mkdir: ${name}: already exists`, "red"))];
        parent.node.c[name] = { t: "d", c: {} };
        return [];
      }

      case "touch": {
        if (!rest[0]) return [line(s("touch: missing operand", "red"))];
        const parent = resolve(fs, cwd, ".");
        if (!parent.node.c[rest[0]]) parent.node.c[rest[0]] = { t: "f", lines: [""] };
        return [];
      }

      case "rm": {
        if (rest[0] === "/" || rest[0] === "~" || flags.includes("-rf") || flags.includes("-fr")) {
          if (rest[0] === "/" || rest[0] === "~" || !rest[0]) {
            return [
              "rm: removing /home/ishwor ...",
              "rm: removing /home/ishwor/projects ...",
              "rm: removing the whole career ...",
              line(s("just kidding. this shell regenerates on reload. nice try though.", "amber")),
            ];
          }
        }
        if (!rest[0]) return [line(s("rm: missing operand", "red"))];
        const parent = resolve(fs, cwd, ".");
        const name = rest[0];
        if (!parent.node.c[name]) return [line(s(`rm: ${name}: no such file`, "red"))];
        delete parent.node.c[name];
        return [];
      }

      case "echo":
        return [args.join(" ")];
      case "date":
        return [new Date().toString()];

      case "uptime": {
        const mins = Math.floor((Date.now() - start) / 60000);
        return [`up ${mins < 1 ? "less than a minute" : mins + " min"}, 1 user, load average: 0.00, chill, chill`];
      }

      case "uname":
        if (flags.includes("-a"))
          return ["IshworOS ishwor 1.0.0-portfolio #1 SMP x86_64 GNU/React"];
        return ["IshworOS"];

      case "ps":
        return [
          line(s("  PID TTY      CMD", "blue")),
          "    1 tty1     game_of_life",
          "    2 tty1     site_api",
          "    3 tty1     ishwor-sh",
          "   42 tty1     ambition",
        ];

      case "history":
        return getHistory()
          .slice()
          .reverse()
          .map((h, i) => `  ${i + 1}  ${h}`);

      case "man": {
        if (!rest[0]) return ["what manual page do you want? try: man curl"];
        const desc = MAN[rest[0]];
        return desc
          ? [line(s(rest[0].toUpperCase() + "(1)", "blue")), "", `  ${rest[0]}  ·  ${desc}`]
          : [line(s(`no manual entry for ${rest[0]}`, "red"))];
      }

      case "which":
        return COMMANDS.includes(rest[0])
          ? [`/usr/bin/${rest[0]}`]
          : [line(s(`which: no ${rest[0] || ""} in /usr/bin`, "red"))];

      case "neofetch": {
        const mins = Math.floor((Date.now() - start) / 60000);
        const info = [
          ["guest@ishwor", ""],
          ["-------------", ""],
          ["OS", "IshworOS 1.0 (miami build)"],
          ["Host", window.location.host],
          ["Kernel", "react 19.2 / vite 8"],
          ["Uptime", mins < 1 ? "just booted" : `${mins} min`],
          ["Shell", "ishwor-sh 1.0"],
          ["Resolution", `${window.innerWidth}x${window.innerHeight}`],
          ["Theme", "amber-on-ink"],
          ["CPU", "caffeine (8 cores)"],
          ["Memory", "mostly chess openings"],
        ];
        return NEOFETCH_ART.map((art, i) => {
          const [label, value] = info[i] || ["", ""];
          return line(
            s(art + "   ", "amber"),
            s(label ? label + (value ? ": " : "") : "", "blue"),
            s(value, "text")
          );
        }).concat(
          info.slice(NEOFETCH_ART.length).map(([label, value]) =>
            line(s(" ".repeat(11), "text"), s(label + (value ? ": " : ""), "blue"), s(value, "text"))
          )
        );
      }

      case "cowsay":
        return cowsay(args.join(" "));

      case "projects":
        return projectsData.flatMap((p) => [
          line(s(p.slug.padEnd(24), "amber"), s(p.tags.join(" · "), "muted")),
          { link: p.github, text: `  ${p.github.replace("https://", "")}` },
        ]);

      case "skills":
        return [skillsData.map((sk) => sk.name).join(" · ")];

      case "contact":
        return [
          { link: `mailto:${site.email}`, text: site.email },
          ...socials.map((so) => ({ link: so.url, text: so.url.replace("https://", "") })),
        ];

      case "resume":
        window.open(site.resumeUrl, "_blank", "noopener");
        return ["opening resume.pdf ..."];

      case "open":
        if (rest[0] === "resume.pdf" || rest[0] === "~/resume.pdf") {
          window.open(site.resumeUrl, "_blank", "noopener");
          return ["opening resume.pdf ..."];
        }
        return [line(s(`open: ${rest[0] || ""}: nothing to open`, "red"))];

      case "curl":
        return fakeCurl(args);

      case "sudo":
        return ["nice try. this incident will be reported to absolutely no one."];
      case "exit":
        return ["there is no escape. try 'clear'."];
      case "vim":
      case "nano":
      case "emacs":
        return [`${cmd}: this is a website. you are already trapped in an editor of sorts.`];

      default:
        return [line(s(`command not found: ${cmd}`, "red"), s("  (try 'help')", "muted"))];
    }
  }

  function completions(input) {
    const tokens = input.split(/\s+/);
    const last = tokens[tokens.length - 1];
    if (tokens.length <= 1) {
      return COMMANDS.filter((c) => c.startsWith(last));
    }
    const here = resolve(fs, cwd, ".");
    const names = here && here.node.t === "d" ? Object.keys(here.node.c) : [];
    const withDirs = names.concat(["projects/"]).filter((n, i, a) => a.indexOf(n) === i);
    return withDirs.filter((n) => n.startsWith(last));
  }

  return { run, prompt, completions };
}

export { HELP };
