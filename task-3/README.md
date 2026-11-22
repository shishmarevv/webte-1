# Môj TODO List

**Viktor Shishmarev**, krúžok: Pondelok 11:00

Aplikácia na školskom serveri: https://webte1.fei.stuba.sk/~xshishmarev/Z3_shishmarev/

## O aplikácii

Webová aplikácia na správu osobných úloh. Úlohy je možné vytvárať, upravovať, označovať ako dokončené, znova otvárať a odstraňovať.
Zobrazujú sa v zozname (filtrovanie podľa stavu, vyhľadávanie podľa názvu, zoradenie podľa dátumu) a v kalendári (mesiac, týždeň, deň).
Nová úloha sa dá vytvoriť aj výberom dňa alebo časového úseku priamo v kalendári.

Všetky údaje sa ukladajú na server cez REST API https://wt1zadanie.iolab.sk (dokumentácia: https://wt1zadanie.iolab.sk/docs).
V prehliadači (`localStorage`) sa pamätá iba identifikátor študenta. Aplikácia má svetlý aj tmavý režim a je responzívna.

## Použité technológie

- [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`), [Vue Router 4](https://router.vuejs.org/) s hash históriou
- [FullCalendar 6](https://fullcalendar.io/) (`@fullcalendar/vue3`, pluginy daygrid, timegrid, interaction)
- [Bootstrap 5](https://getbootstrap.com/), iba CSS; dialógy a menu ovláda Vue
- [Vite](https://vite.dev/) ako vývojový server a nástroj na zostavenie
- [Axios](https://axios-http.com/) na komunikáciu so serverom (REST API, JSON)

## Inštalácia a spustenie

Potrebný je [Node.js](https://nodejs.org/) 20.19+ alebo 22.12+ (testované na 22).

```
npm install      # inštalácia závislostí
npm run dev      # vývojový server, adresa sa vypíše v termináli (predvolene http://localhost:5173/)
npm run build    # zostavenie do priečinka dist/
npm run preview  # lokálne spustenie zostavenej verzie
```

Na školský server sa nahráva obsah priečinka `dist/`. Cesty sú relatívne (`base: './'`), takže funguje v ľubovoľnom podpriečinku.

## Štruktúra

```
src/
├── main.js, App.vue, router.js, styles.css
├── server.js       všetky požiadavky na REST API (Axios)
├── board.js        stav aplikácie a všetky akcie používateľa
├── helpers.js      dátumy, stav úlohy, kontrola formulára
├── pages/          Kalendár, Zoznam úloh, O projekte
└── components/     hlavička, pätička, prihlásenie, panel, položka zoznamu, formulár, detail, dialógy, správy
```

## Zdroje a licencie

- Vue, Vue Router, Vite, Bootstrap, FullCalendar (štandardné pluginy), Axios: MIT License, texty licencií v `node_modules/` po inštalácii.
- Písmo [JetBrains Mono](https://www.jetbrains.com/lp/mono/): SIL Open Font License 1.1, text licencie v `src/assets/fonts/OFL.txt`.
- Obrázok `favicon.ico`/`favicon.svg`: vygenerovaný pomocou Claude.
- Ikona menu: [SVG Repo](https://www.svgrepo.com/svg/511068/menu-alt-05).

## Použitie AI

Pri vypracovaní zadania som používal model Claude Opus 5.5 (návrh riešenia, písanie kódu, ladenie).
