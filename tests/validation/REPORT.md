Accessibility and Markup Improvements — Before/After Summary

Overview
- Scope: All routes — /, /timeline, /infrastructure, /inclusion, /economy, /sources
- Tools: Stylelint, HTML-Validate, W3C vnu, Pa11y
- Snapshots: tests/snapshots/before and tests/snapshots/after

Key Issues Found (Before)
- Duplicate IDs: Repeated id="infra_time" across multiple timeline cards (violates 4.1.1 Parsing).
- Mixed interactive nesting: <a><button>…</button></a> in inclusion program cards.
- Skip-target missing on one page: infrastructure main lacked id for skip-link targeting.
- Low-contrast nav icons (muted gray on white).
- Raw & usage and inline styles in headings (encoding and style separation).

Fixes Applied
- Infrastructure: Added id="main-content" and tabindex="-1" to <main> and removed duplicate id on timeline years.
- Inclusion: Consolidated H1, removed inline style, switched to a link-styled button (<a class="btn-program">…).
- Global: Increased nav link contrast (nav a color → var(--bg-drk)), added generic :focus-visible outline for links/buttons/inputs.
- Economy: Replaced duplicate IDs (info-img, type, status, future) with classes; encoded “&” in headings.

Evidence (Selected)
- vnu (before): Duplicate ID “infra_time” errors on infrastructure.html
- vnu (after): Duplicate ID errors removed; only informational notices remain.
- Pa11y HTML reports (infrastructure):
  - Before: tests/validation/pa11y-before-infrastructure.html
  - After:  tests/validation/pa11y-after-infrastructure.html

Sample Diffs

1) Add main skip-target (infrastructure)
  views/infrastructure.ejs:14
  - <main class="infra__hero" aria-label="hero section">
  + <main id="main-content" tabindex="-1" class="infra__hero" aria-label="hero section">

2) Remove duplicate IDs on timeline year blocks
  views/infrastructure.ejs:27
  - <div class="time__year" id="infra_time">
  + <div class="time__year">

3) Replace nested button-in-link with link-styled button
  views/inclusion.ejs:…
  - <a href="…"><button type="button" class="btn-program">…</button></a>
  + <a class="btn-program" href="…">…</a>

4) Improve color contrast and focus visibility
  public/styles/styles.css: nav link contrast + focus outlines
  - nav a { color: var(--muted); }
  + nav a { color: var(--bg-drk); }
  + a:focus-visible, button:focus-visible, input:focus-visible { outline: 3px solid var(--primary-hgl); outline-offset: 2px; }

5) Encode ampersands / remove inline styles
  views/inclusion.ejs:16
  - <h1>Digital Inclusion & Government Initiatives</h1>
  + <h1>Digital Inclusion &amp; Government Initiatives</h1>
  - <p style="text-align: right;">…</p>
  + <p class="hero__intro-right">…</p>

Results
- Snapshots (Before): tests/snapshots/before/*.html
- Snapshots (After):  tests/snapshots/after/*.html
- Stylelint: tests/validation/stylelint-before.txt (CSS clean)
- HTML-Validate: tests/validation/htmlvalidate-before.txt, htmlvalidate-after.txt
- W3C vnu: tests/validation/vnu-before.json, vnu-after.json
- Pa11y JSON: tests/validation/pa11y-before-*.json, pa11y-after-*.json
- Pa11y HTML (infra): tests/validation/pa11y-before-infrastructure.html, …after…

Short Write‑Up (for report Section E)
We audited the site with HTML validators (HTML‑Validate, W3C vnu), CSS lint (Stylelint), and accessibility tools (Pa11y). The most impactful issues were duplicate IDs on repeated timeline cards, missing/ineffective skip‑link target on one page, low contrast navigation icons, and incorrect interactive semantics (buttons nested in links). We fixed these by removing duplicate IDs, adding a proper main skip‑target and focus management (tabindex="-1"), increasing nav contrast, introducing consistent focus outlines, and replacing nested interactions with link‑styled buttons. We also encoded special characters and removed inline styles for cleaner, standards‑compliant markup. Re‑running the tools shows duplicate‑ID failures resolved and improved a11y reports; remaining findings are minor (e.g., cosmetic whitespace). These changes improve keyboard navigation, screen‑reader parsing, and general readability, aligning with WCAG 2.1 AA expectations.

