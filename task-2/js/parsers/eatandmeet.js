// Eat&Meet: tab panes #day-1 ... #day-7, each with .menu-details cards. The page has no dates.

function eatAndMeetType(title) {
        if (title.startsWith('Polievka')) {
                return 'soup';
        }

        if (title === 'SLADKÉ' || title === 'MÚČNE' || title === 'ŠALÁT') {
                return 'other';
        }

        return 'main';
}

function parseEatAndMeet(doc) {
        const items = [];

        DAY_NAMES.forEach(function (dayName, day) {
                doc.querySelectorAll('#day-' + (day + 1) + ' .menu-details').forEach(function (card) {
                        const description = card.querySelector('.desc');
                        const priceElement = card.querySelector('.price');

                        // "4,50 € / 2,10 €": the reduced price is the nested span
                        const price = parsePrice(cleanText(priceElement.textContent).split('/')[0]);
                        const priceStudent = parsePrice(textOf(priceElement, 'span'));

                        items.push({
                                day: day,
                                date: null,
                                type: eatAndMeetType(textOf(card, '.menu-title h4')),
                                name: cleanText(description.firstChild.textContent),
                                price: price,
                                priceStudent: priceStudent === price ? null : priceStudent,
                                allergens: textOf(description, 'span').replace(/[()\s]/g, ''),
                                weight: ''
                        });
                });
        });

        return items;
}
