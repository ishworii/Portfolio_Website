import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { site, socials } from "../data";
import { useReveal } from "../hooks/useReveal";

const SOCIAL_ICONS = {
  GitHub: FaGithub,
  LinkedIn: FaLinkedinIn,
  X: FaXTwitter,
};

export default function Contact() {
  const ref = useReveal();

  return (
    <section className="section contact" id="contact">
      <div className="container reveal" ref={ref}>
        <p className="eyebrow">
          <span className="method">POST</span> /contact
        </p>
        <h2 className="contact-title">
          Let's build something<span className="accent">.</span>
        </h2>
        <p className="contact-body">
          I'm open to data engineering and backend work, or just a good
          conversation about systems. Email me, I actually reply.
        </p>
        <div className="contact-actions">
          <a className="btn btn-solid" href={`mailto:${site.email}`}>
            <FiMail aria-hidden="true" /> {site.email}
          </a>
          <div className="contact-socials">
            {socials.map((social) => {
              const Icon = SOCIAL_ICONS[social.label];
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                >
                  <Icon aria-hidden="true" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
