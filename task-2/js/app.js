const TYPE_TITLES = { soup: 'Polievky', main: 'Hlavné jedlá', other: 'Iné' };
const NOT_AVAILABLE = 'Menu na tento deň nie je k dispozícii.';
const WEEK = 'week';

const SECTION_TITLES = {
        '#menu': 'Obedové menu v okolí fakulty',
        '#o-projekte': 'O projekte | Obedové menu v okolí fakulty'
};

const state = {
        selection: todayIndex(),        // 0-4, WEEK, or null on a weekend
        hidden: {},                     // restaurant id -> true when filtered out
        entries: {},                    // restaurant id -> stored entry or null
        loading: {}                     // restaurant id -> true while loading
};

// Date.getDay() starts on Sunday, the menu on Monday. Weekend gives null.
function todayIndex() {
        const day = (new Date().getDay() + 6) % 7;

        return day < DAY_NAMES.length ? day : null;
}

function formatDate(isoDate) {
        const parts = isoDate.split('-');

        return Number(parts[2]) + '. ' + Number(parts[1]) + '. ' + parts[0];
}

function formatDateTime(isoTime) {
        const date = new Date(isoTime);
        const time = date.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' });

        return formatDate(toIsoDate(date)) + ' ' + time;
}

function formatPrice(price) {
        return price.toFixed(2).replace('.', ',') + ' €';
}

function buildPrice(item) {
        const $price = $('<span>', { 'class': 'menu-price fw-bold text-nowrap' });

        if (item.price === null) {
                return $price.addClass('small').text('cena neuvedená');
        }

        if (item.price === 0) {
                return $price.addClass('small').text('v cene menu');
        }

        $price.text(formatPrice(item.price));

        if (item.priceStudent !== null) {
                $('<span>', { 'class': 'd-block small fw-semibold' })
                        .text('ISIC ' + formatPrice(item.priceStudent))
                        .appendTo($price);
        }

        return $price;
}

function buildItem(item) {
        const $item = $('<li>', { 'class': 'd-flex flex-wrap justify-content-between column-gap-3 ps-2 py-1 border-start border-3' });
        const $dish = $('<div>', { 'class': 'menu-dish' }).appendTo($item);
        const meta = [];

        if (item.weight) {
                meta.push(item.weight);
        }

        if (item.allergens) {
                meta.push('alergény: ' + item.allergens);
        }

        $('<span>', { 'class': 'd-block lh-sm' }).text(item.name).appendTo($dish);

        if (meta.length > 0) {
                $('<span>', { 'class': 'd-block small text-body-secondary' }).text(meta.join(' · ')).appendTo($dish);
        }

        return $item.append(buildPrice(item));
}

function buildGroup(type, items) {
        return $('<section>', { 'class': 'menu-group menu-group-' + type }).append(
                $('<h5>', { 'class': 'fs-6 mb-1' }).append(
                        $('<span>', { 'class': 'badge text-uppercase' }).text(TYPE_TITLES[type])
                ),
                $('<ul>', { 'class': 'list-unstyled vstack gap-2 mb-0' }).append(items.map(buildItem))
        );
}

function buildMessage(text) {
        return $('<p>', { 'class': 'mb-0 text-body-secondary' }).text(text);
}

function buildWarning(text) {
        return $('<p>', { 'class': 'alert alert-warning mb-3' }).text(text);
}

function buildDay(items, day) {
        const $day = $('<section>', { 'class': 'vstack gap-3' });
        const $heading = $('<h4>', { 'class': 'fs-6 mb-0' }).text(DAY_NAMES[day]);
        const date = items.length > 0 ? items[0].date : null;

        if (date !== null) {
                $heading.append(' ', $('<time>', { 'class': 'small fw-normal text-body-secondary', datetime: date }).text(formatDate(date)));
        }

        $day.append($heading);

        if (items.length === 0) {
                return $day.append(buildMessage(NOT_AVAILABLE));
        }

        Object.keys(TYPE_TITLES).forEach(function (type) {
                const ofType = items.filter(function (item) {
                        return item.type === type;
                });

                if (ofType.length > 0) {
                        $day.append(buildGroup(type, ofType));
                }
        });

        return $day;
}

function itemsOfDay(entry, day) {
        return entry.items.filter(function (item) {
                return item.day === day;
        });
}

function buildWeek(entry) {
        const $row = $('<div>', { 'class': 'row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-5 g-3' });

        DAY_NAMES.forEach(function (name, day) {
                $('<div>', { 'class': 'col' })
                        .append(buildDay(itemsOfDay(entry, day), day))
                        .appendTo($row);
        });

        return $row;
}

function buildMenu(entry) {
        if (state.selection === WEEK) {
                return buildWeek(entry);
        }

        if (state.selection === null) {
                return buildMessage(NOT_AVAILABLE);
        }

        return buildDay(itemsOfDay(entry, state.selection), state.selection);
}

function buildCardBody(restaurant) {
        const entry = state.entries[restaurant.id];

        if (state.loading[restaurant.id]) {
                return $('<div>', { 'class': 'd-flex align-items-center gap-2 text-body-secondary' }).append(
                        $('<span>', { 'class': 'spinner-border spinner-border-sm', 'aria-hidden': 'true' }),
                        $('<span>').text('Načítavam menu…')
                );
        }

        if (entry === null) {
                return buildMessage('Uložené dáta sú vymazané. Načítajte ich tlačidlom „Aktualizovať menu“.');
        }

        if (entry.items.length === 0) {
                return buildWarning(NOT_AVAILABLE + ' ' + entry.error).removeClass('mb-3').addClass('mb-0');
        }

        // The load failed, but the last good menu is still there
        if (entry.error !== null) {
                return [buildWarning('Zobrazuje sa posledné uložené menu. ' + entry.error), buildMenu(entry)];
        }

        return buildMenu(entry);
}

function buildCardFooter(entry) {
        const label = entry.items.length > 0 ? 'Aktualizované: ' : 'Posledný pokus: ';

        return $('<footer>', { 'class': 'card-footer bg-body-tertiary small text-body-secondary' }).append(
                label,
                $('<time>', { datetime: entry.fetchedAt }).text(formatDateTime(entry.fetchedAt))
        );
}

function buildCard(restaurant) {
        const entry = state.entries[restaurant.id];
        const columns = state.selection === WEEK ? 'col-12' : 'col-12 col-md-6 col-xl-4';
        const $card = $('<div>', { 'class': 'card h-100' });

        $('<header>', { 'class': 'card-header bg-body-tertiary' }).append(
                $('<h3>', { 'class': 'fs-5 mb-0' }).append(
                        $('<a>', { href: restaurant.url, target: '_blank', rel: 'noopener' }).text(restaurant.name)
                ),
                $('<address>', { 'class': 'small text-body-secondary mb-0' }).text(restaurant.address)
        ).appendTo($card);

        $('<div>', { 'class': 'card-body' }).append(buildCardBody(restaurant)).appendTo($card);

        if (entry !== null && !state.loading[restaurant.id]) {
                $card.append(buildCardFooter(entry));
        }

        return $('<article>', { 'class': columns }).append($card);
}

function renderMenu() {
        const visible = RESTAURANTS.filter(function (restaurant) {
                return !state.hidden[restaurant.id];
        });

        $('#restaurants').empty().append(visible.map(buildCard));

        if (visible.length === 0) {
                $('<div>', { 'class': 'col-12' })
                        .append(buildMessage('Vyberte aspoň jednu reštauráciu.'))
                        .appendTo('#restaurants');
        }
}

function renderControls() {
        $('#day-picker button').each(function () {
                const value = $(this).data('day');
                $(this).attr('aria-pressed', String(value === state.selection));
        });

        // The week view needs room for five columns
        $('.js-page-width')
                .toggleClass('container-xxl', state.selection !== WEEK)
                .toggleClass('container-fluid', state.selection === WEEK);

        $('#weekend-note').prop('hidden', state.selection !== null);
}

function setBusy(isBusy) {
        $('#refresh, #clear').prop('disabled', isBusy);
}

function refreshRestaurants(restaurants) {
        setBusy(true);

        restaurants.forEach(function (restaurant) {
                state.loading[restaurant.id] = true;
        });
        renderMenu();

        const loads = restaurants.map(function (restaurant) {
                return loadRestaurant(restaurant).then(function (loaded) {
                        const entry = keepLastGoodItems(loaded, state.entries[restaurant.id]);

                        writeEntry(restaurant.id, entry);
                        state.entries[restaurant.id] = entry;
                        delete state.loading[restaurant.id];
                        renderMenu();
                });
        });

        Promise.all(loads).then(function () {
                setBusy(false);
        });
}

function clearData() {
        RESTAURANTS.forEach(function (restaurant) {
                clearEntry(restaurant.id);
                state.entries[restaurant.id] = null;
        });

        renderMenu();
}

function buildFilter() {
        RESTAURANTS.forEach(function (restaurant) {
                $('<button>', { type: 'button', 'class': 'btn btn-sm btn-control', 'aria-pressed': 'true' })
                        .text(restaurant.name)
                        .on('click', function () {
                                const isHidden = !state.hidden[restaurant.id];

                                state.hidden[restaurant.id] = isHidden;
                                $(this).attr('aria-pressed', String(!isHidden));
                                renderMenu();
                        })
                        .appendTo('#restaurant-filter');
        });
}

function showToday() {
        const now = new Date();
        const text = now.toLocaleDateString('sk-SK', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
        });

        $('#today').text('Dnes je ').append($('<time>', { datetime: toIsoDate(now) }).text(text));

        if (state.selection !== null) {
                $('#day-picker button[data-day="' + state.selection + '"]').attr('aria-current', 'date');
        }
}

function showSection() {
        const hash = location.hash || '#menu';

        // Other hashes, such as the skip link, stay on the current section
        if (!SECTION_TITLES[hash]) {
                return;
        }

        $('#menu').prop('hidden', hash !== '#menu');
        $('#o-projekte').prop('hidden', hash !== '#o-projekte');
        document.title = SECTION_TITLES[hash];

        $('#navigation a').each(function () {
                const isCurrent = $(this).attr('href') === hash;

                $(this).toggleClass('active', isCurrent);

                if (isCurrent) {
                        $(this).attr('aria-current', 'page');
                } else {
                        $(this).removeAttr('aria-current');
                }
        });

        // On a phone the opened menu closes after choosing a section
        bootstrap.Collapse.getOrCreateInstance(document.getElementById('navigation'), { toggle: false }).hide();
}

function bindEvents() {
        $('#day-picker button').on('click', function () {
                state.selection = $(this).data('day');
                renderControls();
                renderMenu();
        });

        $('#refresh').on('click', function () {
                refreshRestaurants(RESTAURANTS);
        });

        $('#clear').on('click', clearData);

        $(window).on('hashchange', function () {
                showSection();
                window.scrollTo(0, 0);
        });
}

function init() {
        buildFilter();
        bindEvents();
        showToday();
        showSection();
        renderControls();

        RESTAURANTS.forEach(function (restaurant) {
                state.entries[restaurant.id] = readEntry(restaurant.id);
        });

        const stale = RESTAURANTS.filter(function (restaurant) {
                return !isFresh(state.entries[restaurant.id]);
        });

        renderMenu();

        if (stale.length > 0) {
                refreshRestaurants(stale);
        }
}

$(init);
