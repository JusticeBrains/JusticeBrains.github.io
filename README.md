# Justice Duodu — Portfolio Website

A fast, zero-dependency portfolio website for Justice Duodu (Backend Software Engineer), built directly from his CV.

## Files

- `index.html` — Semantic HTML5 single-page portfolio covering Core Capabilities, Professional Experience (Faab Systems Ghana Ltd, TEDHUB, Freelance), Technical Skills, Education & GitHub, Contact, and native `<dialog>` modals (Faab Systems architecture deep-dive and printable CV summary).
- `styles.css` — Layered modern CSS (`@layer`), system-first dark/light theme (`color-scheme: light dark` + `light-dark()` with fallbacks), fluid `clamp()` typography, scroll-driven progressive reveal animations, forced-colors support, and a `@media print` CV stylesheet.
- `script.js` — Lightweight vanilla ES module handling the two-state theme toggle, `<dialog closedby>` Safari fallback, skill category filter, one-click email copy, `mailto:` draft composer, mobile menu, and active section highlighting.
- `favicon.svg` — Minimal `JD` geometric monogram favicon.

## Local Preview

Because `script.js` is loaded as an ES module, preview over a local HTTP server:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Deploying to GitHub Pages

1. Push this directory to a repository named `JusticeBrains.github.io` (for `https://JusticeBrains.github.io`) or any repository (e.g., `portfolio`).
2. In GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch** (`main` / `/ (root)`).
3. Your site will be live within a minute—no build step required.
