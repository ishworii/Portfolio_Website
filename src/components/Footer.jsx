import { site } from "../data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>
          Designed &amp; built by {site.name} · ©{year}
        </span>
        <span className="footer-status">
          <span className="ok">●</span> 200 OK · {site.location}
        </span>
      </div>
    </footer>
  );
}
