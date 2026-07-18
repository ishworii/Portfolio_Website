import { FiGithub } from "react-icons/fi";
import { projects } from "../data";
import { spotlight } from "../hooks/spotlight";
import { useReveal } from "../hooks/useReveal";
import { TAG_COLORS } from "../tagColors";

function ProjectCard({ project, index, featured }) {
  const ref = useReveal();

  return (
    <article
      className={`project-card reveal ${featured ? "featured" : ""}`}
      ref={ref}
      onMouseMove={spotlight}
      style={{ "--reveal-delay": `${(index % 3) * 0.08}s` }}
    >
      <div className="repo-strip">
        <span className="dot" aria-hidden="true" />
        ~/{project.slug}
      </div>
      {project.video ? (
        <video
          className="project-image"
          src={project.video}
          autoPlay={!window.matchMedia("(prefers-reduced-motion: reduce)").matches}
          muted
          loop
          playsInline
          aria-label={`Recording of ${project.title}`}
        />
      ) : project.image ? (
        <img
          className="project-image"
          src={project.image}
          alt={`Screenshot of ${project.title}`}
          loading="lazy"
        />
      ) : (
        <div
          className="project-cover"
          style={{ "--cover-color": project.cover.color }}
          aria-hidden="true"
        >
          <span className="cover-glyph">{project.cover.glyph}</span>
        </div>
      )}
      <div className="project-body">
        <h3 className="project-title">{project.title}</h3>
        <div className="tag-row">
          {project.tags.map((tag) => (
            <span
              className="tag"
              key={tag}
              style={{ "--tag-color": TAG_COLORS[tag] }}
            >
              <i className="tag-dot" aria-hidden="true" />
              {tag}
            </span>
          ))}
        </div>
        <p className="project-desc">{project.description}</p>
        <div className="project-links">
          <a href={project.github} target="_blank" rel="noreferrer">
            <FiGithub aria-hidden="true" /> source
          </a>
        </div>
      </div>
    </article>
  );
}

export default function Work() {
  const ref = useReveal();

  return (
    <section className="section" id="work">
      <div className="container">
        <div className="reveal" ref={ref}>
          <p className="eyebrow">
            <span className="method m-get">GET</span> /projects{" "}
            <span aria-hidden="true">→</span>{" "}
            <span className="status">200 OK</span>
          </p>
          <h2 className="section-title">
            Things I've built<span className="accent">.</span>
          </h2>
          <p className="section-sub">
            APIs, compilers, scrapers. The interesting parts are all under the
            hood, which is exactly how I like it.
          </p>
        </div>

        <div className="work-grid">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              featured={i === 0 || i === projects.length - 1}
            />
          ))}
          <a
            className="ghost-card"
            href="https://github.com/ishworii?tab=repositories"
            target="_blank"
            rel="noreferrer"
          >
            <span className="ghost-plus" aria-hidden="true">+</span>
            more experiments on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
