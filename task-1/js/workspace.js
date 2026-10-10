// Positions and sizes are percentages of the photo, so hotspots scale with it
const HOTSPOTS = [
        {
                id: 'dell',
                title: 'Pracovný notebook Dell',
                text: 'Na ňom pracujem ako Data Engineering Intern v Dell Technologies: píšem dátové pipeliny v Pythone a sledujem ich v Apache Airflow — práve je otvorený na obrazovke.',
                x: 33, y: 46, width: 17, height: 22
        },
        {
                id: 'monitor',
                title: 'Zakrivený monitor',
                text: 'Hlavná obrazovka: mám na nej kód a dokumentáciu. Navrchu je svetelná lišta, aby som večer nesedel v tme, a webkamera na hovory.',
                x: 40, y: 23, width: 18, height: 20
        },
        {
                id: 'asus',
                title: 'Osobný notebook ASUS',
                text: 'Môj notebook s CachyOS na štúdium a vlastné projekty. Na obrazovke je CSS tohto webu: fotka vznikla, keď som robil životopis.',
                x: 72, y: 14, width: 28, height: 27
        },
        {
                id: 'headphones',
                title: 'Slúchadlá',
                text: 'Visia na druhom monitore, aby boli vždy po ruke. S hudbou sa mi ľahšie sústreďuje na kód.',
                x: 26, y: 17, width: 9, height: 16
        },
        {
                id: 'microphone',
                title: 'Mikrofón',
                text: 'Mikrofón na pohyblivom ramene na hovory a online stretnutia. Keď ho nepotrebujem, jednoducho ho odsuniem nabok.',
                x: 59, y: 32, width: 8, height: 21
        },
        {
                id: 'dino',
                title: 'Triceratops',
                text: 'Plyšový triceratops stráži roh stola. Kód síce nekontroluje, ale ani sa nehádže.',
                x: 22, y: 48, width: 7, height: 7
        },
        {
                id: 'figures',
                title: 'Figúrky',
                text: 'Robot a malá figúrka na kraji stola. Dávajú pozor, aby som sa nerozptyľoval — nie vždy sa im to darí.',
                x: 62, y: 52, width: 8, height: 28
        }
];

// Only builds the HTML; showing the panels is done entirely in CSS
const workspaceImage = document.querySelector('.workspace-image');

if (workspaceImage) {
        HOTSPOTS.forEach(function (spot) {
                const hotspot = document.createElement('div');
                const button = document.createElement('button');
                const panel = document.createElement('div');
                const title = document.createElement('h3');
                const text = document.createElement('p');

                hotspot.className = 'hotspot';
                hotspot.style.setProperty('--x', spot.x + '%');
                hotspot.style.setProperty('--y', spot.y + '%');
                hotspot.style.setProperty('--w', spot.width + '%');
                hotspot.style.setProperty('--h', spot.height + '%');

                // Panels open towards the middle of the photo, so they never leave it
                if (spot.x + spot.width / 2 > 50) {
                        hotspot.classList.add('hotspot-end');
                }
                if (spot.y + spot.height / 2 > 50) {
                        hotspot.classList.add('hotspot-up');
                }

                button.type = 'button';
                button.className = 'hotspot-button';
                button.setAttribute('aria-label', spot.title);
                button.setAttribute('aria-describedby', 'hotspot-' + spot.id);

                panel.className = 'hotspot-panel';
                title.textContent = spot.title;
                text.id = 'hotspot-' + spot.id;
                text.textContent = spot.text;

                panel.append(title, text);
                hotspot.append(button, panel);
                workspaceImage.append(hotspot);
        });
}
