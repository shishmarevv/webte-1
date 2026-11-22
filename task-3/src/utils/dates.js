// The API sends and receives UTC ISO 8601 strings ("2026-11-22T15:59:41Z").
// The app shows and edits everything in the user's local time.

const dateTimeFormat = new Intl.DateTimeFormat('sk-SK', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
});

const timeFormat = new Intl.DateTimeFormat('sk-SK', {
        hour: '2-digit',
        minute: '2-digit'
});

function pad(number) {
        return String(number).padStart(2, '0');
}

// Date -> "2026-11-22T14:30", the value format of <input type="datetime-local"> (local time)
export function toInputValue(date) {
        return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
                + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
}

// "2026-11-22T14:30" (local, no zone) -> "2026-11-22T13:30:00.000Z" for the API
export function inputToIso(value) {
        return new Date(value).toISOString();
}

export function formatDateTime(isoString) {
        return dateTimeFormat.format(new Date(isoString));
}

// "22. 11. 2026 10:00 – 12:00" on one day, otherwise both full dates
export function formatRange(fromIso, toIso) {
        const from = new Date(fromIso);
        const to = new Date(toIso);
        if (from.toDateString() === to.toDateString()) {
                return dateTimeFormat.format(from) + ' – ' + timeFormat.format(to);
        }
        return dateTimeFormat.format(from) + ' – ' + dateTimeFormat.format(to);
}

// Next full hour, the default start of a new task
export function nextFullHour() {
        const date = new Date();
        date.setHours(date.getHours() + 1, 0, 0, 0);
        return date;
}

export function addHours(date, hours) {
        return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function isOverdue(todo) {
        return !todo.is_finished && new Date(todo.date_to) < new Date();
}

// CSS class shared by the list, badges and calendar events
export function stateClass(todo) {
        if (todo.is_finished) {
                return 'state-done';
        }
        return isOverdue(todo) ? 'state-overdue' : 'state-open';
}

export function stateLabel(todo) {
        if (todo.is_finished) {
                return 'Dokončená';
        }
        return isOverdue(todo) ? 'Po termíne' : 'Nedokončená';
}
