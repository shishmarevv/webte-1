# Obedové menu v okolí fakulty

**Viktor Shishmarev**, krúžok: Pondelok 11:00

Stránka na školskom serveri: https://webte1.fei.stuba.sk/~xshishmarev/Z2_shishmarev/

## O webe

Stránka zobrazuje denné menu troch reštaurácií a jedální v okolí FEI STU na jednom mieste, podľa dní v týždni.
Beží iba na strane klienta (HTML, CSS, JavaScript), má svetlý aj tmavý režim a je responzívna.

## Spustenie

Stránka potrebuje HTTP server, pretože prehliadač pri otvorení cez `file://` blokuje načítanie súborov z priečinka `data/`:

```
python3 -m http.server
```

Potom stačí otvoriť http://localhost:8000/.

## Zdroje dát

Proxy sa podľa pokynu cvičiaceho nepoužíva, dáta sa načítavajú z lokálnych kópií stránok v priečinku `data/`:

- [Eat&Meet](https://eatandmeet.sk/tyzdenne-menu): `data/eatandmeet.html`, kópia neobsahuje dátumy.
- [FIIT Food](http://www.freefood.sk/menu/#fiit-food): `data/fiitfood.html`
- [White Dragon](https://whitedragon.sk/menucka/): `data/whitedragon.html`

## Aktualizácia lokálnych kópií

Menu sa zverejňuje po týždňoch, preto stačí kópie obnoviť približne raz za týždeň:

1. Otvoriť stránku reštaurácie v prehliadači a uložiť ju (Ctrl+S, typ „Webová stránka, iba HTML“) cez príslušný súbor v `data/`.
2. Na stránke kliknúť na „Aktualizovať menu“. Na školskom serveri treba nové súbory najprv nahrať.

Sťahovanie skriptom nefunguje, pretože firewall týchto stránok automatizované požiadavky odmieta.

## Pridanie reštaurácie

1. Uložiť jej stránku do `data/`.
2. Napísať parser v `js/parsers/`, ktorý vracia položky v jednotnej štruktúre (popis je v `js/parsers/utils.js`).
3. Pridať skript do `index.html` a záznam do poľa `RESTAURANTS` v `js/config.js`.

## Zdroje a licencie

- CSS knižnica [Bootstrap 5.3.3](https://getbootstrap.com/) (iba CSS): MIT License, text licencie v `vendor/bootstrap/LICENSE`.
- JS knižnica [jQuery 3.7.1](https://jquery.com/): MIT License, text licencie v `vendor/jquery/LICENSE`.
- Písmo [JetBrains Mono](https://www.jetbrains.com/lp/mono/): SIL Open Font License 1.1, text licencie v `fonts/OFL.txt`.
- Obrázok `favicon.ico`/`favicon.svg`: vygenerovaný pomocou Claude.
- Ikona menu: [SVG Repo](https://www.svgrepo.com/svg/511068/menu-alt-05).
- Texty menu v `data/` patria príslušným reštauráciám.

## Použitie AI

Kód stránky (HTML, CSS, JavaScript vrátane parserov), texty, návrh riešenia a testovanie vznikli pomocou modelu Claude Opus 5.5 na základe mojich požiadaviek a rozhodnutí.
Výber reštaurácií, ich lokálne kópie a kontrolu výsledku som urobil sám.
