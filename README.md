# Panama Internet History — Web Dev Final Project

An Express + EJS web application for a web development course final project. It showcases basic server-side rendering, consumes a public REST API, and lets users submit short stories which are persisted to disk. Styling is split into a global stylesheet and per-page styles.

## Features
- Home page renders Panama country info fetched from restcountries.com
- Articles section rendered from a local JSON file
- User story submission form with:
  - Random fun username via sillyname
  - Cute avatar generated via Dicebear (fun-emoji)
  - Server-side validation and persistence to a JSON file
- Timeline page route (/timeline)
- Minimal security and rate limit scaffolding present in code (Helmet and express-rate-limit commented for easy enablement)

## Tech stack
- Node.js (type: module)
- Express 5
- EJS templating
- Axios for HTTP requests
- dotenv for configuration
- Dicebear avatars (@dicebear/core + @dicebear/fun-emoji)
- sillyname for random usernames
- uuid / crypto randomUUID for unique IDs
- Nodemon for development

## Project structure
```
/                     # project root
├─ server.js          # Express app entrypoint
├─ views/             # EJS templates (index, timeline, partials)
├─ public/            # Static assets (styles, images, js, information/*.json)
│  └─ styles/
│     ├─ global.css   # Global/reset, variables, header/footer, shared components
│     ├─ index.css    # Page-specific styles for views/index.ejs
│     └─ styles.css   # Legacy stylesheet (kept for reference; not used by index.ejs)
├─ package.json       # Scripts and dependencies
├─ stories.json       # (legacy root file, not used at runtime)
├─ LICENSE
└─ README.md
```
Notes:
- Stories are loaded from and written to public/information/stories.json
- Articles are read from public/information/articles.json

## Prerequisites
- Node.js 18+ recommended
- npm 9+ (or a compatible package manager)

## Setup
1. Clone the repository:
   git clone https://github.com/ruben-cxtx/web-dev__final.git
   cd web-dev__final
2. Install dependencies:
   npm install
3. Create a .env file (optional):
   - PORT=5000
   If not set, the server defaults to port 5000.

## Run
- Development (with auto-reload via nodemon):
  npm run dev

Then open http://localhost:5000 in your browser.

## Environment variables
- PORT: Port number for the HTTP server (default 5000)

## Data persistence
- User-submitted stories are stored at public/information/stories.json. The server ensures the directory exists and writes the file on each successful submission.
- On startup, the app loads stories from this file (if present). Each session also generates a fun username and an SVG avatar for each story.

## Enabling security middleware (optional)
The code already imports Helmet and express-rate-limit (commented). To enable:
- Uncomment the helmet import and middleware line in server.js
- Uncomment express.json and express-rate-limit lines if you want JSON parsing and rate limiting for APIs
Adjust limits as needed.

## Scripts
- dev: Start the server with nodemon and ignore updates to public/information/stories.json

Example:
  npm run dev

## Troubleshooting
- Port already in use: Change PORT in .env or stop the other process.
- External API failures: The REST Countries API may rate-limit or fail; the app handles errors and will render with partial data.
- Stories not saving: Ensure the app has write permissions to public/information. The server will create the directory if missing.

## License
This project is licensed under the ISC License. See LICENSE for details.

## Acknowledgments
- REST Countries API for Panama data
- Dicebear for avatar generation
