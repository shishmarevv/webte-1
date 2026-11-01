// Helpers shared by the restaurant parsers.
//
// Every parser takes a Document from DOMParser and returns a flat array of:
// { day, date, type, name, price, priceStudent, allergens, weight }
//   day           0 = Monday ... 4 = Friday
//   date          ISO date, or null when the source has no dates
//   type          'soup' | 'main' | 'other'
//   price         full price in EUR, 0 = included in the menu, null = unknown
//   priceStudent  reduced price, null when there is none
//   allergens     '1,3,7', or '' when none
//   weight        '120g', or '' when none

const DAY_NAMES = ['Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok'];

function cleanText(text) {
        return text.replace(/\s+/g, ' ').trim();
}

function textOf(element, selector) {
        const found = element.querySelector(selector);
        return found ? cleanText(found.textContent) : '';
}

// "4,50 €" -> 4.5, "1.70€" -> 1.7, text without a number -> null
function parsePrice(text) {
        const match = text.match(/\d+(?:[.,]\d+)?/);
        return match ? Number(match[0].replace(',', '.')) : null;
}

// "Pondelok" or "pondelok" -> 0, anything else (weekend, plain text) -> -1
function dayIndex(name) {
        const lowerName = cleanText(name).toLowerCase();

        return DAY_NAMES.findIndex(function (day) {
                return day.toLowerCase() === lowerName;
        });
}

// Built from local parts: toISOString() converts to UTC and could return the previous day
function toIsoDate(date) {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return date.getFullYear() + '-' + month + '-' + day;
}
