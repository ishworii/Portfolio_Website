import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Ishwor Khanal </span>
            from <span className="purple">Butwal, Nepal,</span> currently living in <span className="purple">Miami, USA.</span>
            <br />
            I am pursuing a Master's in Information Technology.
            <br />
            I hold a Bachelor's degree in Electronics and Communication Engineering 
            from <span className="purple">Western Regional Campus, Pokhara, Nepal.</span>
            <br />
            <br />
            Apart from my academic and professional pursuits, here are a few activities I enjoy:
          </p>
          <ul style={{ listStyleType: "square", marginLeft: "20px" }}>
            <li className="about-activity">
              <ImPointRight style={{ marginRight: "8px" }} /> Playing Chess
            </li>
            <li className="about-activity">
              <ImPointRight style={{ marginRight: "8px" }} /> Reading Books
            </li>
            <li className="about-activity">
              <ImPointRight style={{ marginRight: "8px" }} /> Working on Fun Projects
            </li>
          </ul>

          <p style={{ color: "rgb(155 126 172)", marginTop: "20px" }}>
            "Keep challenging yourself; growth happens outside your comfort zone!"{" "}
          </p>
          <footer className="blockquote-footer">Ishwor</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
