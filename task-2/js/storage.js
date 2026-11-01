// One localStorage key per restaurant, so a failing source does not affect the others.
// localStorage can be blocked or full, so every access is guarded: the page then still works
// and only loads the data again on the next visit.

const STORAGE_PREFIX = 'menu:';

function readEntry(id) {
        try {
                return JSON.parse(localStorage.getItem(STORAGE_PREFIX + id));
        } catch (error) {
                return null;
        }
}

function writeEntry(id, entry) {
        try {
                localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(entry));
        } catch (error) {
                console.warn('Dáta sa nepodarilo uložiť:', error);
        }
}

function clearEntry(id) {
        try {
                localStorage.removeItem(STORAGE_PREFIX + id);
        } catch (error) {
                console.warn('Dáta sa nepodarilo vymazať:', error);
        }
}

// A failed attempt is not fresh, so the next visit tries again
function isFresh(entry) {
        if (entry === null || entry.error !== null) {
                return false;
        }

        return new Date(entry.fetchedAt).toDateString() === new Date().toDateString();
}
