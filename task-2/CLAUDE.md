# Task 2 - "Obedové menu v okolí fakulty"

WEBTE1, ZS 2026/2027. Author: Viktor Shishmarev. Full assignment: `task.pdf` (Slovak).
Deadline: **1.11.2026 23:59** (late = 0 points). Defense: the author must be able to explain every line, so code stays simple and readable. Claude writes the code (including the parsers), but explains each part so the user can defend it.

## What we build

A client-only site (HTML, CSS, JS) that loads restaurant/canteen pages near FEI STU, parses their daily menus and shows them per weekday.

### Hard requirements (from the PDF)

- **Libraries:** at least 1 CSS library and 1 JS helper library are REQUIRED (e.g. Bootstrap / Tailwind, jQuery, icon sets). NO JS frameworks (React, Vue, Angular, Svelte) and NO scraping libraries. List used libraries in the footer or on "O projekte".
- **Validity:** HTML via validator.w3.org, CSS via jigsaw. Save both outputs (text or screenshot) into `docs/`. Vendor-prefixed properties may be invalid, nothing else.
- **Font:** not the system default; local `@font-face` `.woff2`, license in `README.md`.
- Chrome + Firefox latest. Slovak content with diacritics, UTF-8, `lang="sk"`.
- HTML5 with DOCTYPE, maximum semantic tags (`header`, `nav`, `main`, `section`, `article`, `footer`, `time`, ...).
- **Restaurants:** min. 3 near FEI that publish the menu in HTML (not image/PDF), each with a different page structure. Selection must be approved by the instructor.
- **Loading:**
  - CORS: the course proxy is NOT available to us. Store local copies of the restaurant pages in the project (e.g. `data/*.html`) and load those. The assignment still requires a switch "live page / local copy"; keep the live path behind a single configurable proxy URL. Never use public CORS proxies.
  - Async via Fetch API or jQuery AJAX.
  - Parse with `DOMParser` + `querySelector(All)` / jQuery selectors. Regex over the whole document is NOT allowed (regex on a single extracted string, e.g. a price, is fine).
  - NEVER insert foreign HTML into our page (no `innerHTML` of fetched content). Only our own extracted values, set via `textContent` or built elements.
  - Per day extract at least: day (+ date if available), item type (soup, main, ...), dish name, price. Allergens and weight too if the source has them.
  - Normalize all sources into one structure (array of JS objects).
- **Storage:** parsed data in `localStorage`. Do not refetch on page open if stored data is from today. Buttons "Aktualizovať menu" (refetch) and one to clear stored data. Show last-update date/time per restaurant. Loading indicator while fetching.
- **Display:**
  - Day picker Mon-Fri (tabs/buttons), no page reload. Default = today; on weekend show a "menu not available" note (or Monday).
  - A "whole week" view as well.
  - Filter by restaurant (show/hide each).
  - Each restaurant in its own block (card/table) with name, clickable link to its page, optional address. Soups, mains and prices visually distinguished.
- **Errors:** unavailable page, changed structure or missing day must not break the page; show a clear message ("Menu na tento deň nie je k dispozícii"). One failing restaurant must not block the others.
- **"O projekte"** subpage or section: sources, how data is parsed, libraries used. Navigation is a `<ul>`, all links work.
- Page `<title>` per subpage, favicon.
- HTML, CSS, JS in separate files. One parser function per restaurant returning the common structure, so adding a restaurant is easy.
- Looks and usability weigh a lot. Responsive is mandatory (non-responsive = -50%).
- **Submission:** ZIP with `index.html` and `README.md` in the root, plus a link to the copy on the school server (`webte1.fei.stuba.sk/~xshishmarev/...`). AI use must be stated in `README.md`.

### Oddities in the PDF

- The ZIP name says `Z1 priezvisko.zip`, probably copied from task 1; confirm with the instructor (likely `Z2_shishmarev.zip`).
- Points (10)/(11) are overlaid with stray text from a different assignment (a "Napíšte nám" contact form with a hidden 5-second delay). It is not part of this task; ignore it.

## Style carried over from task 1 (`../task-1`)

Reuse the same visual identity:

- **Font:** JetBrains Mono (Regular 400, SemiBold 600, Bold 700), `.woff2` in `fonts/`, OFL 1.1 license in `fonts/OFL.txt`.
- **Color tokens** on `:root`, dark mode via `@media screen and (prefers-color-scheme: dark)`, `color-scheme: light dark`:

  | token | light | dark |
  |---|---|---|
  | `--color-background` | `#FAF6EE` | `#1B1E1A` |
  | `--color-surface` | `#F0E9DA` | `#252A24` |
  | `--color-brand-green` | `#B9D3B0` | `#3E5A40` |
  | `--color-brand-pink` | `#F3CCD3` | `#5A3440` |
  | `--color-brand-pink-strong` | `#E7AEBB` | `#74404F` |
  | `--color-text` | `#2B2A27` | `#EFE9DC` |
  | `--color-muted-text` | `#5E5A52` | `#B8B1A3` |
  | `--color-link` | `#2F5D3A` | `#A9CCA0` |
  | `--color-accent` | `#9A3B55` | `#F0B3C1` |

- **Spacing scale:** `--space: 1rem`, `--space-xs/-s/-l/-xl` = 0.25/0.5/2/4 x. `--radius: 3px`.
- Layout: body flex column, `min-height: 100dvh`, sticky footer via `main { flex: 1 }`, line-height 1.6.
- Active nav item / pressed toggle = `--color-brand-green` background, using `aria-current="page"` and `aria-pressed="true"` as the styling hooks.
- Focus ring in `--color-accent`, skip link "Preskočiť na obsah", hamburger button for mobile (breakpoint 768px), hover styles under `@media (any-hover: hover)`.
- Favicon: the "BШ" monogram SVG (`favicon.svg` + `favicon.ico`), green `#2F5D3A` / dark `#A9CCA0`.
- Code style: 8-space indentation, `function () {}` callbacks rather than arrows, English comments only where the reason is not obvious, Slovak UI text.
- `[hidden] { display: none !important; }` guard.
- No emojis anywhere (site or suggestions).

Since a CSS library is now required, it must not override this identity: map the library's theme variables to our tokens (or use it only for layout/components) rather than shipping its default look.

## Decisions

- **Restaurants:** chosen later; no instructor approval needed. Still min. 3, HTML menus, different page structures.
- **Local copies:** saved on Sunday/Monday so one snapshot covers the whole week. Stored in `data/<restaurant-id>.html`.
- **Live mode:** a `PROXY_URL` constant in `js/config.js`, empty for now. Live mode with no proxy shows a clear "proxy nie je nastavený" error instead of breaking.
- **CSS library:** Bootstrap 5, themed through its CSS variables with our tokens (not the stock Bootstrap look).
- **JS library:** jQuery (AJAX + selectors for parsing).
- **Libraries stored locally** in `vendor/` (as Leaflet in task 1), with their license files.
- **"O projekte"** is a section on `index.html`, not a separate page. Nav `<ul>` links to in-page anchors.
- **Week view:** one column per day (grid on desktop, stacked on mobile).
- **Weekend:** only a message that the menu is not available (no fallback to Monday).
- **Restaurant filter:** not persisted, resets on every visit.
- **Dark mode:** kept, same tokens as task 1.
- **Who codes:** Claude writes all code, the parsers too, and explains it.
- **Cache:** one `localStorage` key per restaurant (e.g. `menu:<restaurant-id>`), each with its own data, fetch timestamp and error state, so one failing source does not affect the others.

## File structure

```
task-2/
├── index.html            menu + "O projekte" section
├── README.md             author, school server link, sources, font + library licenses, AI use
├── favicon.svg / .ico    from task 1
├── css/styles.css        our tokens + Bootstrap variable overrides + own components
├── js/
│   ├── config.js         PROXY_URL, list of restaurants (id, name, url, address, local file, parser)
│   ├── parsers/          one file per restaurant: parse<Name>(doc) -> array of menu items
│   ├── storage.js        localStorage read/write/clear per restaurant
│   ├── loader.js         fetch (live via proxy / local copy) + DOMParser
│   └── app.js            UI: day tabs, week view, filter, buttons, loading indicator, rendering
├── data/                 local HTML copies of restaurant pages
├── fonts/                JetBrains Mono .woff2 + OFL.txt
├── vendor/
│   ├── bootstrap/        bootstrap.min.css, bootstrap.bundle.min.js, LICENSE
│   └── jquery/           jquery.min.js, LICENSE
└── docs/                 validator outputs (HTML + CSS)
```
