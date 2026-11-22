// All communication with the REST API lives here, the UI only calls these functions
const BASE_URL = 'https://wt1zadanie.iolab.sk/api/';

export class ApiError extends Error {
        constructor(message, status, fields) {
                super(message);
                this.status = status;
                // Field name -> server message, filled for 422 validation errors
                this.fields = fields || {};
        }
}

function messageForStatus(status) {
        if (status === 403) {
                return 'Toto meno nie je na serveri povolené. Použite svoj študentský identifikátor.';
        }
        if (status === 404) {
                return 'Úloha sa na serveri nenašla. Možno už bola odstránená.';
        }
        if (status === 422) {
                return 'Server odmietol zadané údaje. Skontrolujte formulár.';
        }
        if (status >= 500) {
                return 'Na serveri nastala chyba. Skúste to o chvíľu znova.';
        }
        return 'Požiadavka zlyhala (kód ' + status + ').';
}

// 422 body: { detail: [{ loc: ['body', 'title'], msg: '...' }] } -> { title: '...' }
function fieldErrors(detail) {
        const fields = {};
        if (!Array.isArray(detail)) {
                return fields;
        }
        detail.forEach(function (error) {
                const field = error.loc[error.loc.length - 1];
                fields[field] = 'Server: ' + error.msg;
        });
        return fields;
}

async function request(method, path, body) {
        const options = { method: method, headers: {} };
        if (body !== undefined) {
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(body);
        }

        let response;
        try {
                response = await fetch(BASE_URL + path, options);
        } catch {
                // fetch rejects only when no response arrived at all (offline, DNS, server down)
                throw new ApiError('Server je nedostupný. Skontrolujte pripojenie na internet a skúste to znova.', 0);
        }

        if (!response.ok) {
                let fields = {};
                if (response.status === 422) {
                        const data = await response.json().catch(function () {
                                return null;
                        });
                        fields = fieldErrors(data && data.detail);
                }
                throw new ApiError(messageForStatus(response.status), response.status, fields);
        }

        // DELETE answers 204 without a body
        if (response.status === 204) {
                return null;
        }

        try {
                return await response.json();
        } catch {
                throw new ApiError('Server vrátil neplatnú odpoveď.', response.status);
        }
}

function studentPath(name) {
        return encodeURIComponent(name);
}

function todoPath(name, id) {
        return studentPath(name) + '/' + encodeURIComponent(id);
}

export function getTodos(name) {
        return request('GET', studentPath(name));
}

export function createTodo(name, todo) {
        return request('POST', studentPath(name), todo);
}

export function resetTodos(name) {
        return request('POST', studentPath(name) + '/reset');
}

export function getTodo(name, id) {
        return request('GET', todoPath(name, id));
}

export function updateTodo(name, id, todo) {
        return request('PUT', todoPath(name, id), todo);
}

export function deleteTodo(name, id) {
        return request('DELETE', todoPath(name, id));
}

export function markDone(name, id) {
        return request('PATCH', todoPath(name, id) + '/done');
}

export function markUndone(name, id) {
        return request('PATCH', todoPath(name, id) + '/undone');
}
