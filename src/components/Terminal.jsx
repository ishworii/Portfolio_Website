import { useEffect, useRef, useState } from "react";
import { TRAIN, createSession } from "../terminal/commands.js";
import { useReveal } from "../hooks/useReveal";

function banner() {
  return [
    { spans: [{ t: "ishwori shell v1.0 (dallas build)", c: "amber" }] },
    `this site ships a real API. from your own shell, try: curl ${window.location.host}/projects`,
    "type 'help' to look around. tab completes, arrows recall history.",
    "",
  ];
}

function Line({ line }) {
  if (typeof line === "string") {
    return <div className="t-line">{line === "" ? " " : line}</div>;
  }
  if (line.cmd !== undefined) {
    return (
      <div className="t-line t-cmd">
        <span className="t-prompt">{line.p}</span> {line.cmd}
      </div>
    );
  }
  if (line.link) {
    return (
      <div className="t-line">
        <a href={line.link} target="_blank" rel="noreferrer">
          {line.text}
        </a>
      </div>
    );
  }
  if (line.train) {
    return (
      <div className="t-train" aria-label="a steam locomotive drives by">
        <pre>{TRAIN}</pre>
      </div>
    );
  }
  if (line.spans) {
    return (
      <div className="t-line">
        {line.spans.map((span, i) => (
          <span key={i} className={`c-${span.c}`}>
            {span.t}
          </span>
        ))}
      </div>
    );
  }
  return null;
}

export default function Terminal() {
  const headRef = useReveal();
  const termRef = useReveal();
  const [lines, setLines] = useState(() => banner());
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIndex, setHistIndex] = useState(-1);
  const historyRef = useRef([]);
  const sessionRef = useRef(null);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const bootedRef = useRef(false);

  if (!sessionRef.current) {
    sessionRef.current = createSession(() => historyRef.current);
  }
  const session = sessionRef.current;

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // when the terminal first scrolls into view, type "help" by itself
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || bootedRef.current) return;
        bootedRef.current = true;
        observer.disconnect();

        const word = "help";
        const boot = async () => {
          const output = await session.run(word);
          setLines((prev) => [...prev, { cmd: word, p: session.prompt() }, ...output]);
        };
        if (reduce) {
          boot();
          return;
        }
        let i = 0;
        const timer = setInterval(() => {
          i++;
          setInput(word.slice(0, i));
          if (i >= word.length) {
            clearInterval(timer);
            setTimeout(() => {
              setInput("");
              boot();
            }, 350);
          }
        }, 130);
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [session]);

  async function onSubmit(e) {
    e.preventDefault();
    const value = input;
    const promptNow = session.prompt();
    setInput("");
    setHistIndex(-1);
    if (value.trim()) setHistory((h) => [value, ...h].slice(0, 50));

    if (value.trim() === "clear") {
      setLines([]);
      return;
    }

    const output = await session.run(value);
    setLines((prev) => [...prev, { cmd: value, p: promptNow }, ...output]);
  }

  function onKeyDown(e) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const next = Math.min(histIndex + 1, history.length - 1);
      if (history[next] !== undefined) {
        setHistIndex(next);
        setInput(history[next]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = histIndex - 1;
      setHistIndex(next);
      setInput(next < 0 ? "" : history[next]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const matches = session.completions(input);
      if (matches.length === 1) {
        const tokens = input.split(/\s+/);
        tokens[tokens.length - 1] = matches[0];
        setInput(tokens.join(" ") + (matches[0].endsWith("/") ? "" : " "));
      } else if (matches.length > 1) {
        setLines((prev) => [
          ...prev,
          { cmd: input, p: session.prompt() },
          matches.join("  "),
        ]);
      }
    }
  }

  return (
    <section className="section" id="terminal">
      <div className="container">
        <div className="reveal" ref={headRef}>
          <p className="eyebrow">
            <span className="method m-exec">exec</span> /bin/zsh{" "}
            <span aria-hidden="true">→</span> <span className="status">tty</span>
          </p>
          <h2 className="section-title">
            Poke around<span className="accent">.</span>
          </h2>
          <p className="section-sub">
            An actual shell, more or less. Basic Linux commands work, and the
            GET lines on this page are real endpoints, so curl works in here
            and from your own terminal.
          </p>
        </div>

        <div
          className="terminal live-terminal reveal"
          ref={termRef}
          onClick={() => inputRef.current?.focus()}
        >
          <div className="terminal-bar">
            <div className="dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span className="title">guest@ishwori</span>
          </div>
          <div
            className="terminal-screen"
            ref={bodyRef}
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
          >
            {lines.map((line, i) => (
              <Line key={i} line={line} />
            ))}
            <form className="t-input-row" onSubmit={onSubmit}>
              <label className="t-prompt" htmlFor="terminal-input">
                {session.prompt()}
              </label>
              <input
                id="terminal-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
                aria-label="Terminal input"
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
