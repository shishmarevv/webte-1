const ERROR_UNAVAILABLE = 'Stránku reštaurácie sa nepodarilo načítať.';
const ERROR_STRUCTURE = 'Stránka reštaurácie má inú štruktúru, než sa očakávalo, a menu sa nedá spracovať.';

function createEntry(items, error) {
        return {
                items: items,
                fetchedAt: new Date().toISOString(),
                error: error
        };
}

function parseRestaurant(restaurant, html) {
        try {
                // DOMParser builds a separate document: its scripts do not run and it is never put on our page
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const items = restaurant.parser(doc);

                return createEntry(items, items.length > 0 ? null : ERROR_STRUCTURE);
        } catch (error) {
                // A parser throws when an element it needs is missing
                return createEntry([], ERROR_STRUCTURE);
        }
}

// Always resolves, with the error inside the entry, so one failing restaurant cannot stop the others
function loadRestaurant(restaurant) {
        return new Promise(function (resolve) {
                $.ajax({
                        url: restaurant.file,
                        dataType: 'text',
                        // The saved pages are UTF-8, whatever charset the server declares
                        mimeType: 'text/html; charset=utf-8',
                        // A replaced file must be read again, not taken from the browser cache
                        cache: false
                }).done(function (html) {
                        resolve(parseRestaurant(restaurant, html));
                }).fail(function () {
                        resolve(createEntry([], ERROR_UNAVAILABLE));
                });
        });
}
