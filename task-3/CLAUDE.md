# Task 3 - "Môj TODO List"

WEBTE1, ZS 2026/2027. Author: Viktor Shishmarev. Full assignment: `task.pdf` (Slovak).
Deadline: **22.11.2026 23:59** (late = 0 points). Defense: the author must be able to explain every line, so code stays simple and readable. Claude writes all code and explains it; the user only makes strategic decisions.

## What we build

A Vue 3 single-page app for personal tasks: create, edit, finish/reopen, delete, plus a calendar (month/week/day). All data lives on the prepared REST API, never only in the browser.

### Hard requirements (from the PDF)

- **Stack:** HTML, CSS, JS + a JS UI framework (REQUIRED this time). Server communication via Fetch API or Axios. Calendar: own or a library (FullCalendar suggested). CSS framework allowed. List used frameworks/libraries in the footer or "O projekte".
- **Storage:** every task operation goes through the REST API. Replacing it with a local array or `localStorage` is NOT allowed.
- Chrome + Firefox latest. Slovak content with diacritics, UTF-8.
- **API connection:** student identifier entered by the user, URL `/api/{name}` built with `encodeURIComponent`. First access creates the list with 5 sample tasks, which must be shown. Handle success and failure responses, network errors, invalid input. Show a loading/sending indicator and tell the user about success or failure.
- **CRUD:** GET list (status, description, interval visible), POST create (form: title, description, start date+time, end date+time), PUT edit (prefilled form, includes finished state, sends all `TodoCreate` fields), DELETE (confirm dialog first), PATCH `/done`, PATCH `/undone`.
- **Validation:** title required, max 200; description optional, max 1000; both dates required, start not after end. JSON with `Content-Type: application/json`, ISO 8601 dates.
- **Calendar:** shows real API data by start/end; month, week and day views; prev/next/today; title, time and finished state distinguishable; finished vs unfinished visually different; click on a task shows details with edit/delete/toggle; selecting a date or time range opens the create form prefilled; multi-day tasks span correctly; always consistent with the list.
- **List:** filter by state (all / unfinished / finished), search by title, sort by start or end date, mark overdue and finished tasks, each item shows title, date+time, state and edit/delete/toggle controls; synced with the calendar; clear message for an empty list or no filter results.
- **Reset:** `POST /api/{name}/reset` behind a confirm dialog warning that current tasks are replaced by 5 samples; reload list and calendar after success.
- **UI:** clear, consistent, responsive (desktop, tablet, phone, no horizontal overflow). Split into components (header, nav, calendar, list, form, dialogs). Form as page, dialog or side panel. Validation errors shown at the fields. Clear feedback after create/edit/delete/finish. Running vs finished operation distinguishable. Navigation between calendar, list and other parts.
- **Errors:** server down, network errors and failed HTTP responses must not crash the app; user gets an understandable message. Prevent double form submission. Update list/calendar only after a successful server response (or a reload). After a failure the request can be retried and the form keeps its data. Local time zone for display, consistent format for the server. API data never interpreted as HTML.
- **Project:** clean structure; components, styles and helpers in separate files; API communication in a separate service module; reusable components and the framework's state handling. App has a name, favicon, header and footer. "O projekte" section: app, technologies, calendar library. All links and controls work, no fake buttons.
- **README.md:** technologies, short description, how to install dependencies and the run command. AI use must be stated there.
- **Submission:** ZIP with `index.html` and `README.md` in the root, plus a link to the copy on the school server (`webte1.fei.stuba.sk/~xshishmarev/...`).

### Oddities in the PDF

- The ZIP name says `Z1_priezvisko.zip`, copied from task 1 again; task 2 used `Z2_shishmarev`, so use `Z3_shishmarev.zip` / `~xshishmarev/Z3_shishmarev/`.

## REST API facts

Base `https://wt1zadanie.iolab.sk`, OpenAPI at `/docs` and `/openapi.json`. CORS is open (`*`, all methods, `content-type` header), so no proxy.

| method | path | result |
|---|---|---|
| GET | `/api/{name}` | `StudentOut` (creates the student with 5 seed tasks on first access) |
| POST | `/api/{name}` | 201 `TodoOut` |
| POST | `/api/{name}/reset` | `StudentOut` with 5 seed tasks |
| GET / PUT / DELETE | `/api/{name}/{todo_id}` | `TodoOut` / `TodoOut` / 204 |
| PATCH | `/api/{name}/{todo_id}/done`, `/undone` | `TodoOut` |

- `name`: string, max 100. Only names in the server's `users.json` are allowed, others get **403**.
- Max **50 tasks** per student: creating one beyond that hard-resets the list to the 5 seeds.
- `TodoCreate`: `title` (max 200, required), `description` (max 1000, default ""), `date_from`, `date_to` (date-time, required), `is_finished` (default false).
- `TodoOut` = `TodoCreate` + `id` (int), `student_id`, `created_at`. `StudentOut` = `id`, `name`, `created_at`, `todos[]`.
- Validation errors: 422 `{ detail: [{ loc, msg, type }] }`. A non-whitelisted name gets 403 with an empty body.
- Dates come back in UTC with `Z` (`2026-11-22T15:59:41Z`), so `new Date(value)` parses them directly.
- The author's name `xshishmarev` is whitelisted (list created 22.11.2026, seeds Task1..Task5 span several days each).
- FullCalendar is pinned to 6.1.x: the 7.x line is new and its daygrid/timegrid plugins are still 6.1.22. vue-router stays on 4.6 (stable API) instead of 5.x.

## Style carried over from task 1 and 2 (`../task-2/css/styles.css`)

- **Font:** JetBrains Mono (400, 700; 600 was dropped, the browser uses 700), local `.woff2` in `src/assets/fonts/` (bundled by Vite through `styles.css`), OFL 1.1 license in `src/assets/fonts/OFL.txt`.
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

- Radius 3px (`--bs-border-radius*`). Bootstrap themed through its `--bs-*` variables mapped to our tokens (same mapping as task 2), FullCalendar through its `--fc-*` variables.
- Active nav item / pressed toggle = `--color-brand-green` background, `aria-current="page"` / `aria-pressed="true"` as styling hooks. Three button styles: `.btn-control` (neutral, from task 2), `.btn-brand` (main action), `.btn-soft-danger` (delete/reset); hover/pressed/disabled reuse the normal colours.
- One focus style (3px `--color-accent` outline) for everything, navbar toggler below 768px. Dropped on purpose to keep task 3 simple: skip link (it fought the hash router), `any-hover` media query.
- Favicon: the "BШ" monogram (`favicon.svg` + `favicon.ico`), also used as the navbar brand icon.
- Footer: "Viktor Shishmarev, WEBTE1, ZS 2026/2027" + used libraries.
- Code style: 8-space indentation, English comments only where the reason is not obvious, Slovak UI text. No emojis anywhere.

## Decisions

- **Simplicity first:** the user found task 2 over-engineered. Prefer fewer files and fewer special cases; a component used once lives inside its page. Do not add features the PDF does not ask for.
- **Framework:** Vue 3, Composition API with `<script setup>` single-file components.
- **Build:** Node + Vite (`npm install`, `npm run dev`, `npm run build`). `base: './'` so `dist/` works in any folder on the school server. Node 22 from apt; `node_modules/` and `dist/` are not committed.
- **HTTP:** Axios (allowed by the PDF next to Fetch), pinned to exactly `1.21.0` (axios had a supply-chain incident in 2026, so no floating range). jQuery / `$.ajax` was requested and rejected: the PDF allows only Fetch or Axios, and jQuery next to Vue fights over the DOM.
- **Navigation:** vue-router with hash history (`#/kalendar`, `#/zoznam`, `#/o-projekte`), so the static school server needs no rewrites. Each route sets `document.title`.
- **CSS:** Bootstrap 5 CSS only. Dialogs, navbar collapse and toasts are driven by Vue state, not by `bootstrap.bundle.js`.
- **Calendar:** FullCalendar (`@fullcalendar/vue3` + daygrid, timegrid, interaction), Slovak locale (week starts Monday).
- **State:** one plain `reactive()` object `board` in `src/board.js` (no Pinia) holds the student, tasks, loading/busy flags, notices and which dialog is open. Calendar events and the list are both computed from `board.tasks`.
- **Server is the truth:** every change goes through `change()` in `board.js`: send the request, show a notice, then read the whole list again (`pullTasks`). No local patching of the array, so the list, the calendar and the server can never disagree (this also covers the 50-task reset and tasks deleted elsewhere). One `board.busy` flag disables all action buttons while a change runs.
- **No layout jumps:** the spinner line in `BoardBar` (`.status-line`) is always rendered with a reserved height and only its text changes. Showing it with `v-if` made the whole page jump 41px on every change.
- **One request at a time:** `waiting()` in `board.js` (= `busy || loading`) disables every action button while the app waits for the server, so requests never overlap and an older answer cannot overwrite a newer one. The task form cannot be closed while it is saving. `recheckTask` is skipped while another request runs.
- **Gotcha when writing files:** the editing tools turned `\u0300` escapes into the raw combining characters. Write such regex escapes via `chr(92)` in a script and check with `grep -P '[\x{0300}-\x{036f}]'`.
- **GET one task** (`/api/{name}/{id}`) is used when the task detail opens (`recheckTask`).
- **Student name:** asked on first visit and checked on the server (403 = not allowed); only the name is kept in `localStorage`.
- **Dates:** sent as `Date.toISOString()` (UTC), shown in local time via `Intl.DateTimeFormat('sk-SK')`.
- **Form:** one dialog for create and edit; client checks (title required, start <= end) shown at the fields, length limits via `maxlength`; stays open with the typed data after a failure.

## Naming vocabulary

The user wants the code to read as their own, not as generic tutorial code. Keep using this vocabulary for new code:

| idea | name |
|---|---|
| app state | `board` (`src/board.js`) |
| REST module / request helper | `server.js` / `callServer()`, error text `explain()` |
| load list / one task | `pullTasks()` / `recheckTask(id)` |
| create / edit / toggle / delete / reset | `pinTask` / `rewriteTask` / `flipTask` / `tearOff` / `wipeToSamples` |
| toast | `notify()` / `dismiss()`, list `board.notices`, component `NoticeStack` |
| confirm dialog | `askFirst()` / `answer()`, `board.question`, `QuestionPopup` |
| dialog shell | `PopupFrame` |
| task form | `TaskEditor`, `draftTask()` (new) / `editTask()`, form data `draft`, errors `mistakes`, check `checkTask()` |
| task detail | `TaskPeek`, `peek(id)` / `closePeek()`, `board.peekId` |
| list item | `TaskCard` |
| login screen | `StudentDoor`, `enter()` / `leave()` |
| bar above calendar and list | `BoardBar` |
| task state | `stateOf(task)` -> `open` / `late` / `done`, CSS `state-*`, labels `STATE_NAMES` |
| date helpers | `humanDate()`, `forInput()`, `fromInput()`, `freshSlot()` |

## File structure

```
task-3/
├── index.html            Vite entry, lang="sk", favicon
├── README.md             author, school server link, technologies, install/run, licenses, AI use
├── package.json          dependencies (axios pinned exactly)
├── vite.config.js        base './'
├── public/               favicon.svg/.ico (copied as-is)
└── src/
    ├── assets/fonts/     JetBrains Mono Regular + Bold, OFL.txt
    ├── main.js           createApp, router, global CSS
    ├── router.js         hash routes + page titles
    ├── styles.css        tokens, --bs-* / --fc-* mapping, buttons, task state colours
    ├── App.vue           layout + global dialogs
    ├── server.js         all REST calls (axios), Slovak error messages
    ├── board.js          app state + every user action
    ├── helpers.js        dates, task state, form check
    ├── pages/            CalendarPage (FullCalendar), ListPage (filters + list), AboutPage
    └── components/       TopBar, FooterNote, StudentDoor, BoardBar, TaskCard, TaskEditor, TaskPeek,
                          PopupFrame, QuestionPopup, NoticeStack
```
