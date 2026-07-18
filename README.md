# ishwor khanal · portfolio

Personal site. React 19 + Vite, hand-written CSS, no UI framework.

Two party tricks:

1. The hero background is a live Conway's Game of Life simulation.
   Click it to drop a glider.
2. The site has a real API. The GET lines shown on the page are actual
   endpoints, and curl gets JSON where browsers get the website:

   ```sh
   curl http://localhost:4000/projects
   curl http://localhost:4000/whoami
   curl -X POST http://localhost:4000/contact -d '{"message": "hi"}'
   ```

   There is also an interactive terminal on the page itself.

## Develop

```sh
npm install
npm run dev      # http://localhost:4000
npm run build    # production build in dist/
```

## Edit content

All copy, projects, skills, and links live in `content/site-content.js`.
That file feeds both the React app and the API. Project screenshots are
attached in `src/data.js`. The resume served at `/resume.pdf` is
`public/resume.pdf`.

## API

The route table lives in `content/api.js`. In dev it is served by a Vite
middleware (`vite.config.js`); in production the same code runs as Vercel
functions in `api/`, with `vercel.json` rewriting pretty paths to JSON
for curl, wget, HTTPie, and Postman user agents.

## Design

Tokens (colors, type, spacing) are defined at the top of
`src/styles/global.css`. Display face is Bricolage Grotesque, body is
IBM Plex Sans, labels and terminal fragments are IBM Plex Mono.
