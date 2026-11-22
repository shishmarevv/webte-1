// Small helpers for dates, task state and the form check.
// The API sends and receives UTC ISO 8601 strings ("2026-11-22T15:59:41Z"),
// the app shows and edits everything in the user's local time.

export const TITLE_MAX = 200;
export const DESCRIPTION_MAX = 1000;

const dateFormat = new Intl.DateTimeFormat('sk-SK', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
});

export function humanDate(iso) {
        return dateFormat.format(new Date(iso));
}

function twoDigits(number) {
        return String(number).padStart(2, '0');
}

// Date -> "2026-11-22T14:30", the value of <input type="datetime-local"> (local time)
export function forInput(date) {
        return date.getFullYear() + '-' + twoDigits(date.getMonth() + 1) + '-' + twoDigits(date.getDate())
                + 'T' + twoDigits(date.getHours()) + ':' + twoDigits(date.getMinutes());
}

// "2026-11-22T14:30" (local) -> "2026-11-22T13:30:00.000Z" for the API
export function fromInput(value) {
        return new Date(value).toISOString();
}

// Default time of a new task: from the next full hour, one hour long
export function freshSlot() {
        const start = new Date();
        start.setHours(start.getHours() + 1, 0, 0, 0);
        const end = new Date(start);
        end.setHours(start.getHours() + 1);
        return { start: start, end: end };
}

// 'done', 'late' (end has passed, not finished) or 'open'; used as the CSS class "state-..."
export function stateOf(task) {
        if (task.is_finished) {
                return 'done';
        }
        return new Date(task.date_to) < new Date() ? 'late' : 'open';
}

export const STATE_NAMES = {
        open: 'Nedokončená',
        late: 'Po termíne',
        done: 'Dokončená'
};

// Returns { field: message } for every wrong field; an empty object means the form is fine
export function checkTask(draft) {
        const mistakes = {};
        if (draft.title.trim() === '') {
                mistakes.title = 'Názov úlohy je povinný.';
        }
        if (!draft.date_from) {
                mistakes.date_from = 'Zadajte dátum a čas začiatku.';
        }
        if (!draft.date_to) {
                mistakes.date_to = 'Zadajte dátum a čas ukončenia.';
        } else if (draft.date_from && new Date(draft.date_from) > new Date(draft.date_to)) {
                mistakes.date_to = 'Koniec nemôže byť skôr ako začiatok.';
        }
        return mistakes;
}
