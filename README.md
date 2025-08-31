# Panama Internet History — Web Dev Final

This is my final project for a web development course. I built a small Node + Express app with EJS templates to explore how Panama’s internet evolved. The site has multiple pages (timeline, infrastructure, inclusion, economy, and sources) and a simple form where visitors can submit short stories that are saved to a JSON file.

## What You Can Do
- View Panama basics on the home page (fetched from REST Countries).
- Read short articles and a timeline about internet milestones.
- Explore infrastructure and providers (subsea cables, IXP, public programs, spectrum/5G).
- Check digital inclusion (government milestones, platforms, and community programs).
- See the economy angle (fintech, e‑commerce, entrepreneurship, and trends).
- Submit a short story; it gets a random fun username and an SVG avatar, then saves to `public/information/stories.json`.

## How It Works (Stack)
- Node.js + Express 5 with EJS views.
- Axios to fetch Panama data from `restcountries.com` for the home page.
- Content comes from JSON files in `public/information/` (timeline, infrastructure, inclusion, economy, sources).
- Random usernames via `sillyname` and avatars via Dicebear (`@dicebear/core` + `@dicebear/fun-emoji`).
- Environment variables via `dotenv`; auto‑reload in dev via `nodemon`.

## Getting Started
1) Prereqs: Node 18+ and npm.
2) Install:
   - Clone the repo and `cd` into it
   - `npm install`
3) Run (dev):
   - `npm run dev`
   - Open `http://localhost:5000`

Optional: Create a `.env` with `PORT=5000` (defaults to 5000 if not set).

## Routes
- `/` Home (Panama info + articles + stories)
- `/timeline` Key insights and a timeline
- `/infrastructure` Infrastructure and providers
- `/inclusion` Digital inclusion and e‑government
- `/economy` Digital economy overview
- `/sources` List of sources and references

## Project Structure (short)
```
server.js                  # Express app
views/                     # EJS templates (pages + partials)
public/                    # Static files
public/information/*.json  # Data used to render pages
public/styles/             # CSS (global + per-page)
```

Useful data files to edit:
- `public/information/articles.json`
- `public/information/infrastructure_panama.json`
- `public/information/providers_panama.json`
- `public/information/key_insights.json`
- `public/information/timeline.json`
- `public/information/inclusion.json`
- `public/information/economy.json`
- `public/information/combined_sources_v2.json`
- `public/information/stories.json` (created/updated when users submit stories)

## CSS Approach
- Global styles live in `public/styles/styles.css` (reset, variables, header/footer, shared utilities like `.cards__container`).
- Page styles live in `public/styles/*` (e.g., `timeline.css`, `infras.css`, `index.css`, etc.).
- Shared hero utilities: `.hero__container` layout and `.bg-dim` overlay are defined once in `styles.css`; pages only set background-image and text color.
- Shared list utility: `.info-card__list` (used by Economy and Inclusion) is centralized in `styles.css`.
- Duplicates removed: common helpers moved to `styles.css`; page files keep only page‑specific rules.
- Example: the base `.cards__container` layout is defined once in `styles.css`; timeline‑specific media tweaks remain in `timeline.css`.

## CSS Linting
Stylelint is configured to catch duplicate selectors and duplicate properties.

- Lint CSS:
  npm run lint:css
- Auto‑fix (where safe):
  npm run lint:css:fix

Config files:
- `.stylelintrc.json` (keeps checks focused on duplicates to avoid noise)
- `.stylelintignore`

## Accessibility
- Added a visible-on-focus skip link on all pages to jump to main content (`.skip-link`).
- Labeled primary navigation (`aria-label="Primary navigation"`).
- Ensured each page’s `<main>` has `id="main-content"` and `tabindex="-1"` for skip-link focus.
- Marked decorative icons with `aria-hidden="true"`; improved icon-only buttons/links.
- Added `rel="noopener noreferrer"` to all `target="_blank"` links.
- Gave story avatars an accessible name via `role="img"` + `aria-label`.

You can run an accessibility checker (e.g., Lighthouse, axe) to see improvements, then iterate further (e.g., add `aria-current` to nav, refine color contrast, and heading order checks as needed).

## Notes / Troubleshooting
- If the port is busy, set a different `PORT` in `.env`.
- If REST Countries is slow or rate‑limited, the home page still renders with whatever data is available.
- Stories save to `public/information/stories.json`; make sure the app can write to that folder.

## Acknowledgments
- REST Countries API (Panama country data)
- Dicebear (avatar generation)
- sillyname (random usernames)

## License
ISC — see `LICENSE`.
