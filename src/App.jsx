import { useState } from "react";
import Nav from "./components/Nav";
import Cursor from "./components/Cursor";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Work from "./components/Work";
import About from "./components/About";
import Terminal from "./components/Terminal";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Intro from "./components/Intro";

// show the intro once per session, never for reduced-motion users
function shouldShowIntro() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return !sessionStorage.getItem("introSeen");
  } catch {
    return true;
  }
}

export default function App() {
  const [showIntro] = useState(shouldShowIntro);
  const [introSettled, setIntroSettled] = useState(!showIntro);
  const [introGone, setIntroGone] = useState(!showIntro);

  return (
    <>
      {showIntro && !introGone && (
        <Intro
          onSettled={() => {
            setIntroSettled(true);
            try {
              sessionStorage.setItem("introSeen", "1");
            } catch {
              // private browsing, fine
            }
          }}
          onDone={() => setIntroGone(true)}
        />
      )}
      {introSettled && (
        <>
          <a className="skip-link" href="#work">
            skip to content
          </a>
          <Cursor />
          <Nav />
          <main>
            <Hero />
            <Marquee />
            <Work />
            <About />
            <Terminal />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
