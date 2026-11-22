<template>
        <section class="col-lg-9" aria-labelledby="about-heading">
                <h2 id="about-heading">
                        O projekte
                </h2>
                <p>
                        Môj TODO List je webová aplikácia na správu osobných úloh. Úlohy je možné vytvárať, upravovať, označovať ako dokončené a odstraňovať,
                        a to v klasickom zozname aj v kalendári. Obe časti čítajú tie isté údaje, takže zmena v jednej sa hneď prejaví aj v druhej.
                        Aplikácia vznikla ako 3. zadanie z predmetu WEBTE1.
                </p>

                <h3>
                        Ukladanie údajov
                </h3>
                <p>
                        Úlohy sa ukladajú výhradne na server cez
                        <a href="https://wt1zadanie.iolab.sk/docs" target="_blank" rel="noopener">REST API wt1zadanie.iolab.sk</a>.
                        Každý študent má vlastný zoznam na adrese <code>/api/{meno}</code>. V prehliadači sa pamätá iba identifikátor študenta.
                        Zoznam aj kalendár sa menia až po úspešnej odpovedi servera.
                </p>

                <h3>
                        Použité technológie
                </h3>
                <ul>
                        <li>
                                <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>: JavaScriptový framework, komponenty a reaktívny stav aplikácie.
                        </li>
                        <li>
                                <a href="https://router.vuejs.org/" target="_blank" rel="noopener">Vue Router 4</a>: navigácia medzi kalendárom, zoznamom a touto stránkou.
                        </li>
                        <li>
                                <a href="https://fullcalendar.io/" target="_blank" rel="noopener">FullCalendar 6</a>: knižnica kalendára. Zobrazuje úlohy v mesačnom, týždennom a dennom pohľade,
                                umožňuje výber dňa alebo časového úseku na vytvorenie úlohy. Vlastné farby stavov sú nastavené cez jej CSS premenné.
                        </li>
                        <li>
                                <a href="https://getbootstrap.com/" target="_blank" rel="noopener">Bootstrap 5</a>: CSS framework (rozloženie, formuláre, dialógy), prefarbený na vlastné farby.
                        </li>
                        <li>
                                <a href="https://vite.dev/" target="_blank" rel="noopener">Vite</a>: vývojový server a zostavenie aplikácie.
                        </li>
                        <li>
                                <a href="https://axios-http.com/" target="_blank" rel="noopener">Axios</a>: HTTP požiadavky na REST API (posiela a prijíma JSON, chyby servera vracia ako výnimky).
                        </li>
                        <li>
                                Písmo <a href="https://www.jetbrains.com/lp/mono/" target="_blank" rel="noopener">JetBrains Mono</a> (SIL Open Font License 1.1).
                        </li>
                </ul>

                <h3>
                        Autor
                </h3>
                <p>
                        Viktor Shishmarev, FEI STU, ZS 2026/2027.
                </p>
        </section>
</template>
