# Project plan — WEBTE1 Task 1 (personal business card)

Brief structure and design decisions. Source of truth for requirements: `task.pdf`.

## Folder structure

```
task-1/
├── index.html              Profile
├── README.md               name, group, server link, about, sources + licenses, AI usage
├── favicon.ico             derived from the monogram
├── pages/
│   ├── cv.html             CV (two columns, printable)
│   ├── workspace.html      interactive image
│   ├── schedule.html       timetable + filters + semester progress
│   └── map.html            Leaflet map
├── css/
│   ├── styles.css          the single shared design system (:root variables, light + dark)
│   └── print.css           @media print for the CV
├── js/
│   ├── script.js           shared: hamburger; schedule logic; SEMESTER_START / SEMESTER_END at the top
│   ├── workspace.js        only generates hotspot HTML from an array of objects
│   └── map.js              map, points, Haversine, localStorage
├── vendor/
│   └── leaflet/            local copy of Leaflet (JS, CSS, marker images) — map.html only
├── fonts/                  self-hosted .woff2 files
├── img/                    photos, workspace image, og:image
└── docs/
    ├── plan.md             this file
    ├── validator-html.*    W3C HTML validator output
    └── validator-css.*     W3C CSS validator output
```

Pages in `pages/` link to assets and to each other using relative paths (`../css/...`, `../index.html`).

## Decisions

| Topic | Decision | Why |
|---|---|---|
| Shared header / nav / footer | Same markup copied into all 5 pages; only the active-page marker differs (`aria-current="page"`) | Validates, works without JS, accessible. No include mechanism exists in plain HTML |
| JS organization | `script.js` (shared + schedule) + `workspace.js` + `map.js`, each loaded only where needed | Spec names `script.js` and wants the semester constants there; page code stays separate |
| Hamburger | Real `<button>` with `aria-expanded`, toggled by a small JS function; without JS the nav stays visible | Keyboard- and screen-reader-friendly (bonus) |
| Theme | Light + dark palettes as `:root` variables, switched by `prefers-color-scheme` | No JS; both palettes must meet 4.5:1 contrast (bonus) |
| Workspace hotspots | Focusable elements; panels shown via `:hover` / `:focus-within`; default panel via `:has()` when nothing is selected | CSS-only interaction as required; keyboard-accessible |
| Schedule table | Static HTML with `colspan` / `rowspan` and data attributes (day, time, type); JS only reads it to highlight the current class and filter | Validates, works without JS |
| Leaflet | Local copy in `vendor/leaflet/` | No external dependencies (same spirit as the font rule) |
| Naming map points | Labelled form next to the map; clicking the map fills the coordinates | Accessible, stylable, consistent with the site |
| Three key things | 1) Data pipelines (Python, Apache Airflow); 2) Machine learning & generative AI (PyTorch, LLMs); 3) SQL & data quality (PostgreSQL, Greenplum). Profile focus: data/ML engineering; Linux/web only as background | Each is backed by the resume (Dell internship, projects); must reappear as CV skills with levels and as ≥1 workspace hotspot |
| Motto (`<aside>`) | "Talk is cheap. Show me the code." (Linus Torvalds), quote in `<blockquote lang="en">`, attribution outside it | Student's choice |
| Tone | Formal (vykanie), first person, Slovak, with light humour; jokes must still be true and the tone consistent on all pages | Chosen for the whole site; spec bans made-up filler and wants one tone |
| Placeholders | Allowed on the `task-1` branch during development; placeholder *text* (e.g. "Здесь будет …") must be replaced before merging into `main` | Spec bans filler/TODO in the submitted site |
| Contact data | Email and phone stay fictional on purpose (`example.com` address, masked `9xx` number), also in the submitted site; must be identical in the footer and on the CV | Student doesn't want to publish real contacts |
| Content language during development | Visitor-facing text is written in **Russian** first and translated to Slovak (with diacritics) before submission; `lang` is `ru` until then | Student can't type Slovak yet. **Before submission:** translate all text, `<title>`, meta/OG descriptions, alt texts, JS messages, and switch `lang` to `sk` |
| `og:image` | One shared `img/og-image.png` (1200×630): monogram on soft-green square + name in JetBrains Mono Bold, light palette. Referenced by the absolute URL `https://webte1.fei.stuba.sk/~xshishmarev/task-1/img/og-image.png` on every page | Same motif as favicon/header; OG requires absolute URLs |
| Reduced motion | Opt-in: transitions/animations are declared only inside `prefers-reduced-motion: no-preference` | New motion can't be forgotten in the `reduce` case |
| Server URL | `https://webte1.fei.stuba.sk/~xshishmarev/task-1/` | Needed for README and absolute OG URLs |
| CV source data | Taken from the student's resume (`.temp/Resume.pdf`, gitignored, never committed); real email/phone from it are **not** used (see Contact data) | Single source keeps all pages consistent |
| Job title | "Data Engineering Intern" at Dell Technologies (since Feb 2026) on every page | Matches the resume; fixes the "Data Engineer" mismatch |
| CV layout | Flexbox, two columns; one column on ≤ 768 px | Student's choice |
| Skill levels | `<meter>` on a 1–6 scale (`min="0"` so level 1 still shows 1/6 filled), styled with palette variables (track `--color-brand-pink` + 1px `--color-muted-text` border, fill `--color-accent`; fill/track contrast 4.6 light, 5.96 dark); `background` shorthand needed to drop the browsers' default gradients; Firefox track via `@supports selector(::-moz-meter-bar)`; each `meter` is named by a `<label for>` in its `dt`. No visible number for skills; languages keep the visible CEFR level. Groups: Data Engineering (4–6), Machine learning (2–4), Web (1–5); draft values in the CV content section | Semantically a value in a known range (`<progress>` would be wrong); 1–6 matches the six CEFR levels |
| Languages | Russian C2, English C1, Slovak B2 | Student's levels |
| Study program | Applied informatics (Aplikovaná informatika), FEI STU, Bachelor's, 2024–2027 | Same name on index, CV, schedule |
| Name on the printed CV | `h1` of `cv.html` contains the name | Header is hidden in print |
| CV print | `print.css` hides skip link, header, nav, footer; columns lose background and padding; grayscale palette via `:root` overrides (links = text colour, no underline); `@page { size: A4; margin: 0 }` + body padding 1.5cm (removes browser headers/footers); root font 9pt, line-height 1.3, block margins 0.4em; two columns forced back (left 32%), photo max 4cm, address 0.9em; `print-color-adjust: exact` on `meter`. Verified: 1 A4 page in Chromium | Spec + student's choice |
| Screen-only media | Dark theme query is `screen and (prefers-color-scheme: dark)` so print never gets dark colours | Paper is always light |
| Validation | W3C HTML/CSS validators run once at the end of the project for all files; output saved to `docs/` | Student's choice |
| AI disclosure | Honest sentence in README.md: Claude used as a tutor, Claude generated `img/og-image.png` and filled the repetitive part of the CV markup (from the student's pattern) with resume data; the hidden "Generated by AI" text in the PDF is ignored | Only the visible spec counts |

## Design

**Style:** soft, minimal layout (milk background, pastel surfaces, rounded corners, whitespace) with small terminal-style details in the header, footer and quirks. **No emojis anywhere**; icons are inline SVG or CSS shapes.

**Palette** (draft, contrast measured against the page background; re-check after any change). Variables are named by role, and dark mode only redefines them inside `prefers-color-scheme: dark`.

| Role | Light | Dark |
|---|---|---|
| Background (milk) | `#FAF6EE` | `#1B1E1A` |
| Surface | `#F0E9DA` | `#252A24` |
| Brand 1, soft green (fills only) | `#B9D3B0` | `#3E5A40` |
| Brand 2, soft pink (fills only) | `#F3CCD3` | `#5A3440` |
| Text | `#2B2A27` (13.3:1) | `#EFE9DC` (13.9:1) |
| Muted text | `#5E5A52` (6.4:1) | `#B8B1A3` (7.9:1) |
| Deep green: links, active state | `#2F5D3A` (7.1:1) | `#A9CCA0` (9.5:1) |
| Deep pink: accent, focus ring | `#9A3B55` (6.2:1) | `#F0B3C1` (9.6:1) |

Rules: pastel colours are never used for text. On soft-green fills, use only the main text colour (muted text and deep pink fall to about 4.2:1 there).

**Font:** JetBrains Mono everywhere, self-hosted `.woff2` (SIL OFL 1.1, source: github.com/JetBrains/JetBrainsMono → README). Load only the weights you use; keep line length short (~60–70ch) and line-height generous.

**Monogram / favicon:** initials on a soft-green rounded square, letters in deep green. Designed once as SVG with the letters converted to paths, then used as an inline SVG in the header (coloured via CSS variables), as an SVG favicon, and as an exported `favicon.ico`/`.png` (the spec names these formats).

**Quirks** (only after the required features work; each must be true and have an empty/error state):
- Last.fm "recently played" via `fetch` (read-only API key is public; handle loading / nothing played / request failed)
- Live local time ("U mňa je práve …")
- Terminal details: prompt line / cursor motif; animation off under `prefers-reduced-motion`
- Custom 404 page in the same design (check whether the school server lets you set it, e.g. via `.htaccess`)

**Layout tokens** (start values, tune while building):
- Spacing: base `--space` = `1rem` plus three derived steps: ×0.5, ×2, ×4 (computed from the base via `calc()`).
- Radius: minimal `--radius` (a few px) — stricter look than the "soft" style above; the terminal details lead.
- Container: one `max-width` of `100ch` for every page (uniform, strict look); the schedule table scrolls horizontally inside it on narrow screens.
- Font: three JetBrains Mono `.woff2` files: 400, 600, 700, no italic (the `<aside>` quote is emphasised by size/colour/border instead).
- Focus ring: solid, 3px, no offset, deep pink; same on links, buttons, filters, hotspots. Measured contrast of the ring against every fill it can touch is ≥ 3:1 in both themes (lowest: 4.15 on light soft green). Watch for parents with `overflow: hidden` clipping it.

**Still to decide:** heading sizes (which weight goes where: 600 vs 700), transition durations.

## Shared frame (every page)

- Skip link "Preskočiť na obsah" → `<main id="...">`
- `<header>`: monogram (initials, SVG or styled text) + name + one-sentence slogan
- `<nav>` → `<ul>` of 5 links, horizontal menu, hamburger ≤ 768 px, current page highlighted
- `<main>` with one `h1` and `h2` sections
- `<footer>`: `<address>` (email, phone — same as on CV), year, source links
- `<head>`: unique `<title>`, viewport, page-specific description, `og:title` / `og:description` / `og:image`, favicon

## CV content (draft, student adjusts)

Skill levels on the 1–6 scale; each value is tied to a fact from the resume so it can be defended.

| Group | Skill | Level | Based on |
|---|---|---|---|
| Data Engineering | Python | 6 | Main language: Dell pipelines, own projects |
| Data Engineering | Apache Airflow | 5 | Daily at Dell since Feb 2026 |
| Data Engineering | SQL: PostgreSQL, Greenplum | 5 | Transformations and query tuning at Dell |
| Data Engineering | Data quality: validation, logging | 4 | Introduced checks at Dell |
| Machine learning | LLMs / generative AI | 4 | Evaluating model outputs at Dell, NLP summer school |
| Machine learning | PyTorch | 3 | CNN / MLP training projects |
| Machine learning | scikit-learn | 2 | Occasional use |
| Web | PHP | 4 | 1+ year in production at Artrix |
| Web | MySQL | 4 | Artrix |
| Web | Nginx, Linux servers | 4 | Maintained production servers at Artrix |
| Web | JavaScript | 3 | Artrix |
| Web | Elasticsearch | 1 | Touched at Artrix |

Languages, optionally on the same scale (A1 = 1 … C2 = 6): Russian C2 (6), English C1 (5), Slovak B2 (4).

## Accessibility bonus checklist (all or nothing)

- [ ] Meaningful `alt` on every image, including hotspots
- [ ] Contrast ≥ 4.5:1 in both light and dark mode
- [ ] Skip link, visible on keyboard focus
- [ ] Clear `:focus-visible` style on links, buttons, hotspots
- [ ] `prefers-reduced-motion` disables or shortens transitions
- [ ] Whole site usable with the keyboard alone: hamburger, schedule filters, hotspots, map form

## Open questions

- Workspace image topic → decide when implementing that page.
- Personal data used consistently everywhere: school (map = CV), study program (= schedule subjects), contact (footer = CV), home location (three key things: decided, see Decisions).
- Semester dates for `SEMESTER_START` / `SEMESTER_END`.
- Map + keyboard: clicking the map is mouse/touch only — how will a keyboard user add a point (e.g. map centre, or typed coordinates)?
- Suggested build order (to decide): shared frame + styles.css → index → cv + print → schedule → workspace → map.
