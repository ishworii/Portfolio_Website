import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  AiFillGithub,
  AiOutlineTwitter
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import Tilt from "react-parallax-tilt";
import myImg from "../../Assets/my-avatar.svg";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              WANT TO <span className="purple">KNOW</span> WHAT MAKES ME TICK?
            </h1>
            <p className="home-about-body">
              One day I started tinkering with code, and before I knew it, 
              I was hooked! Now I'm diving deep into the backend universe 🚀
              <br />
              <br />
              I've mastered the art of speaking to computers in
              <i>
                <b className="purple"> C, C++, Python, and Scala </b>
              </i>
              (and I'm working on my JavaScript accent! 😉)
              <br />
              <br />
              What gets me excited? I'm like a backend architect crafting
              <i>
                <b className="purple"> digital skyscrapers </b> and
                solving puzzles in{" "}
                <b className="purple">
                  scalable system design
                </b>
              </i>
              <br />
              <br />
              You'll usually find me wielding <b className="purple">Django</b> and
              <i>
                <b className="purple">
                  {" "}
                  FastAPI like a coding ninja
                </b>
              </i>
              , with
              <i>
                <b className="purple"> Selenium as my trusty sidekick</b>
              </i>
              . These days, I'm on an exciting adventure learning
              <i>
                <b className="purple"> Scala's backend superpowers</b>
              </i>
              , while keeping React.js in my toolkit for those frontend moments!
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>LET'S CONNECT!</h1>
            <p>
              Don't be shy, my social links don't bite! <span className="purple">Say hello </span> 👋
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/ishworii"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://x.com/ishworkhanal21"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiOutlineTwitter />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/ishwor-khanal-2654951ab/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Home2;