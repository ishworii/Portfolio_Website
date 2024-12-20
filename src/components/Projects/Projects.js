import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import conways from "../../Assets/Projects/conways.gif";
import job_board from "../../Assets/Projects/job_portal.png";
import municipality_scraper from "../../Assets/Projects/municipality_scraper.png";
import scala_api from "../../Assets/Projects/scala_api.png";
import social_media_api from "../../Assets/Projects/social_media_api.png";
import tinybasic from "../../Assets/Projects/tinybasic.png";
import Particle from "../Particle";
import ProjectCard from "./ProjectCards";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={social_media_api}
              isBlog={false}
              title="Social Media API"
                description="Initially started as a simple blog API, this project has evolved into a full-fledged social media API built with FastAPI. It includes features like role-based access control, subscription-based notifications, WebSockets for real-time updates, content moderation, Redis caching, full-text search, and more. The project is a learning journey in FastAPI and its ecosystem, with plans for continuous feature additions and documentation through blogs."
              ghLink="https://github.com/ishworii/FastAPI_Social_Media_API"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={scala_api}
              isBlog={false}
              title="Scala Todo API"
              description="A simple RESTful API built with Scala and Pekko Framework. This API allows users to create, read, update, and delete tasks. The API is built using the Pekko Framework and uses an in-memory database to store tasks."
              ghLink="https://github.com/ishworii/Scala-Todo-API"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={conways}
              isBlog={false}
              title="Conway-s-Game-of-Life in Rust"
              description="A simple implementation of Conway's Game of Life in Rust. The project uses the ggez game engine to render the game and provides a simple GUI to interact with the game. The project is a learning journey in Rust and game development."
              ghLink="https://github.com/ishworii/Conway-s-Game-of-Life"         
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={tinybasic}
              isBlog={false}
              title="TinyBasic Transpiler"
              description="A transpiler that converts TinyBasic source code into C code. Built using Rust, this tool allows users to write programs in TinyBasic and generate equivalent C code, making it easier to integrate with modern systems and compilers."

              ghLink="https://github.com/ishworii/TinyBASIC-Transpiler"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={job_board}
              isBlog={false}
              title="Job board API and Frontend"
                description="A comprehensive job board application with a backend built using FastAPI and SQLite, featuring authentication for both employers and job seekers. The frontend is developed using ReactJS, providing functionalities such as user registration, login, job posting, job searching, and application management."
              ghLink="https://github.com/ishworii/Job_board_API"
              // demoLink="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley" <--------Please include a demo link here
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={municipality_scraper}
              isBlog={false}
              title="Municipality Website Scrapers"
                description="A collection of scrapers written using Selenium in Python to scrape publicly available datasets from various municipality websites into a single repository. This project aims to automate data collection and aggregation for easier access and analysis."
              ghLink="https://github.com/ishworii/scrapers"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
