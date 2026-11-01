// Adding a restaurant: save its page into data/, write one parser in js/parsers/ and add it here.

const RESTAURANTS = [
        {
                id: 'eatandmeet',
                name: 'Eat&Meet',
                url: 'https://eatandmeet.sk/tyzdenne-menu',
                address: 'Staré Grunty 36, Bratislava',
                file: 'data/eatandmeet.html',
                parser: parseEatAndMeet
        },
        {
                id: 'fiitfood',
                name: 'FIIT Food',
                url: 'http://www.freefood.sk/menu/#fiit-food',
                address: 'FIIT STU, Ilkovičova 2, Bratislava',
                file: 'data/fiitfood.html',
                parser: parseFiitFood
        },
        {
                id: 'whitedragon',
                name: 'White Dragon',
                url: 'https://whitedragon.sk/menucka/',
                address: 'Staré Grunty 18, Bratislava',
                file: 'data/whitedragon.html',
                parser: parseWhiteDragon
        }
];
