// White Dragon: pasted text in .post_content, one <p> per day with dishes separated by <br>.
// The page also has an Instagram feed with menus in alt attributes; it is outside .post_content.

const DRAGON_SOUPS_PER_DAY = 2;
const DRAGON_FRIDAY_INDEX = DAY_NAMES.length - 1;

// A <br> leaves no character in textContent, so it becomes a newline in a copy of the paragraph
function dragonLines(paragraph) {
        const copy = paragraph.cloneNode(true);

        copy.querySelectorAll('br').forEach(function (lineBreak) {
                lineBreak.replaceWith('\n');
        });

        return copy.textContent.split('\n').map(cleanText).filter(Boolean);
}

// "26.- 30.10.2026": the end of the range is Friday, so the week may cross into a new month
function dragonFriday(post) {
        const match = textOf(post, 'strong').match(/(\d+)\.(\d+)\.(\d{4})$/);

        return match ? new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])) : null;
}

function dragonDate(friday, day) {
        if (friday === null) {
                return null;
        }

        const date = new Date(friday);
        date.setDate(friday.getDate() - (DRAGON_FRIDAY_INDEX - day));

        return toIsoDate(date);
}

// "Cena menu – 9,90 eur" and "Cena menu špeciál – 12 eur"
function dragonPrices(post) {
        const text = cleanText(post.textContent);
        const menu = text.match(/Cena menu\s*[–-]\s*([\d,]+)/);
        const special = text.match(/Cena menu špeciál\s*[–-]\s*([\d,]+)/);

        return {
                menu: menu ? parsePrice(menu[1]) : null,
                special: special ? parsePrice(special[1]) : null
        };
}

function dragonDish(line, day, friday, type, price) {
        // "..., arašidmi a sezamom 1,3,4,6 11": allergens are the digits at the end
        const allergens = line.match(/\s(\d[\d,\s]*)$/);

        return {
                day: day,
                date: dragonDate(friday, day),
                type: type,
                name: allergens ? line.slice(0, allergens.index) : line,
                price: price,
                priceStudent: null,
                allergens: allergens ? allergens[1].trim().replace(/\s+/g, ',') : '',
                weight: ''
        };
}

function parseWhiteDragon(doc) {
        const post = doc.querySelector('.post_content');
        const friday = dragonFriday(post);
        const prices = dragonPrices(post);
        const items = [];
        let currentDay = -1;

        function addSpecial(line) {
                items.push(dragonDish(line, currentDay, friday, 'main', prices.special));
        }

        post.querySelectorAll('p').forEach(function (paragraph) {
                const lines = dragonLines(paragraph);
                const day = lines.length > 0 ? dayIndex(lines[0]) : -1;

                if (day === -1) {
                        // The special can be a paragraph of its own after its day
                        if (lines.length > 0 && lines[0].startsWith('Špeciál:') && currentDay !== -1) {
                                addSpecial(lines[0]);
                        }

                        return;
                }

                currentDay = day;

                lines.slice(1).forEach(function (line, position) {
                        if (line.startsWith('Zatvorené')) {
                                return;
                        }

                        if (line.startsWith('Špeciál:')) {
                                addSpecial(line);
                        } else if (position < DRAGON_SOUPS_PER_DAY) {
                                items.push(dragonDish(line, day, friday, 'soup', 0));
                        } else {
                                items.push(dragonDish(line, day, friday, 'main', prices.menu));
                        }
                });
        });

        return items;
}
