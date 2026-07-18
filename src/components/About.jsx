import { GitHubCalendar } from "react-github-calendar";
import {
  SiCplusplus,
  SiDjango,
  SiFastapi,
  SiGit,
  SiMongodb,
  SiPostgresql,
  SiPython,
  SiRust,
  SiScala,
  SiSelenium,
} from "react-icons/si";
import { about, site, skills } from "../data";
import { spotlight } from "../hooks/spotlight";
import { useReveal } from "../hooks/useReveal";

const ICONS = {
  python: SiPython,
  cpp: SiCplusplus,
  scala: SiScala,
  rust: SiRust,
  django: SiDjango,
  fastapi: SiFastapi,
  selenium: SiSelenium,
  postgresql: SiPostgresql,
  mongodb: SiMongodb,
  git: SiGit,
};

// amber ramp for the contribution graph, darkest → brightest
const CALENDAR_THEME = {
  dark: ["#161b26", "#3d2e14", "#7a5a1e", "#c08a2d", "#ffb454"],
};

export default function About() {
  const headRef = useReveal();
  const termRef = useReveal();
  const skillsRef = useReveal();
  const calRef = useReveal();

  return (
    <section className="section" id="about">
      <div className="container">
        <div className="reveal" ref={headRef}>
          <p className="eyebrow">
            <span className="method m-get">GET</span> /about{" "}
            <span aria-hidden="true">→</span>{" "}
            <span className="status">200 OK</span>
          </p>
          <h2 className="section-title">
            The view from the backend<span className="accent">.</span>
          </h2>
        </div>

        <div className="about-grid" style={{ marginTop: "2.5rem" }}>
          <div className="terminal reveal" ref={termRef}>
            <div className="terminal-bar">
              <div className="dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="title">about.txt</span>
            </div>
            <div className="terminal-body">
              <p className="terminal-cmd">
                <span className="prompt">$</span> cat about.txt
              </p>
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
              <ul className="interests">
                {about.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="reveal" ref={skillsRef} style={{ "--reveal-delay": "0.1s" }}>
            <p className="skills-heading"># tools I reach for</p>
            <div className="skills-grid">
              {skills.map((skill, i) => {
                const Icon = ICONS[skill.icon];
                return (
                  <div
                    className="skill-tile"
                    key={skill.name}
                    onMouseMove={spotlight}
                    style={{ "--skill-color": skill.color, "--i": i }}
                  >
                    <Icon aria-hidden="true" />
                    <span className="label">{skill.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="calendar-wrap reveal" ref={calRef}>
          <p className="skills-heading"># days I code</p>
          <div className="calendar-scroll">
            <GitHubCalendar
              username={site.githubUsername}
              colorScheme="dark"
              theme={CALENDAR_THEME}
              blockSize={11}
              blockMargin={4}
              fontSize={12}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
