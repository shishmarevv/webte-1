// Same limits as the TodoCreate schema of the API
export const TITLE_MAX = 200;
export const DESCRIPTION_MAX = 1000;
export const STUDENT_MAX = 100;

// form: { title, description, date_from, date_to } with datetime-local strings.
// Returns { field: message }; an empty object means the form is valid.
export function validateTodo(form) {
        const errors = {};
        const title = form.title.trim();

        if (title === '') {
                errors.title = 'Názov úlohy je povinný.';
        } else if (title.length > TITLE_MAX) {
                errors.title = 'Názov môže mať najviac ' + TITLE_MAX + ' znakov.';
        }

        if (form.description.length > DESCRIPTION_MAX) {
                errors.description = 'Popis môže mať najviac ' + DESCRIPTION_MAX + ' znakov.';
        }

        if (!form.date_from || isNaN(new Date(form.date_from))) {
                errors.date_from = 'Zadajte platný dátum a čas začiatku.';
        }
        if (!form.date_to || isNaN(new Date(form.date_to))) {
                errors.date_to = 'Zadajte platný dátum a čas ukončenia.';
        }

        if (!errors.date_from && !errors.date_to && new Date(form.date_from) > new Date(form.date_to)) {
                errors.date_to = 'Koniec nemôže byť skôr ako začiatok.';
        }

        return errors;
}

export function validateStudent(name) {
        if (name === '') {
                return 'Zadajte identifikátor študenta.';
        }
        if (name.length > STUDENT_MAX) {
                return 'Identifikátor môže mať najviac ' + STUDENT_MAX + ' znakov.';
        }
        return '';
}
