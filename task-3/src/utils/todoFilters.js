// Lower case without diacritics, so "ulohu" also finds "Úlohu"
function normalize(text) {
        return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

// status: 'all' | 'open' | 'done'
export function filterTodos(todos, status, search) {
        const query = normalize(search.trim());
        return todos.filter(function (todo) {
                if (status === 'open' && todo.is_finished) {
                        return false;
                }
                if (status === 'done' && !todo.is_finished) {
                        return false;
                }
                return normalize(todo.title).includes(query);
        });
}

// sort: 'date_from-asc' | 'date_from-desc' | 'date_to-asc' | 'date_to-desc'
export function sortTodos(todos, sort) {
        const [field, direction] = sort.split('-');
        const sign = direction === 'asc' ? 1 : -1;
        // slice() copies the array, sort() would otherwise change the store
        return todos.slice().sort(function (a, b) {
                return sign * (new Date(a[field]) - new Date(b[field]));
        });
}
