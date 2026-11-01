// FIIT Food: nested lists in #fiit-food. Other tabs on the page belong to other canteens.

const FIIT_WEIGHT = /\d[\d,]*(?:g|l)(?:,\d+g)*/;
const FIIT_ALLERGENS = /A:([\d,]+)/;

// "26.10.2026" -> "2026-10-26"
function fiitFoodDate(text) {
        const parts = text.trim().split('.');

        return toIsoDate(new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])));
}

// The dish is the text directly in the li, between its two spans
function fiitFoodDishText(row) {
        const textNodes = Array.from(row.childNodes).filter(function (node) {
                return node.nodeType === Node.TEXT_NODE;
        });

        return cleanText(textNodes.map(function (node) {
                return node.textContent;
        }).join(' '));
}

function parseFiitFood(doc) {
        const items = [];

        doc.querySelectorAll('#fiit-food .daily-offer > li').forEach(function (dayBlock) {
                // "pondelok, 26.10.2026"
                const title = textOf(dayBlock, '.day-title').split(',');
                const day = dayIndex(title[0]);
                const date = fiitFoodDate(title[1]);

                if (day === -1) {
                        return;
                }

                dayBlock.querySelectorAll('.day-offer > li').forEach(function (row) {
                        // "Parené buchty s makom a maslom 300g A:1,3,7 (V)"
                        const dish = fiitFoodDishText(row);
                        const weight = dish.match(FIIT_WEIGHT);
                        const allergens = dish.match(FIIT_ALLERGENS);

                        items.push({
                                day: day,
                                date: date,
                                type: textOf(row, '.brand:not(.price)') === 'P.' ? 'soup' : 'main',
                                name: cleanText(dish.replace(FIIT_WEIGHT, '').replace(FIIT_ALLERGENS, '')),
                                price: parsePrice(textOf(row, '.price')),
                                priceStudent: null,
                                allergens: allergens ? allergens[1] : '',
                                weight: weight ? weight[0] : ''
                        });
                });
        });

        return items;
}
