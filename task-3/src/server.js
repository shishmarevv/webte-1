// All communication with the REST API lives here, the components never call axios themselves
import axios from 'axios';

const http = axios.create({
        baseURL: 'https://wt1zadanie.iolab.sk/api/',
        headers: { 'Content-Type': 'application/json' }
});

// Turns an axios error into a sentence the user understands
function explain(error) {
        // No response at all: offline, DNS problem or the server is down
        if (!error.response) {
                return 'Server je nedostupný. Skontrolujte pripojenie na internet a skúste to znova.';
        }
        const status = error.response.status;
        if (status === 403) {
                return 'Toto meno nie je na serveri povolené. Použite svoj študentský identifikátor.';
        }
        if (status === 404) {
                return 'Úloha sa na serveri nenašla, možno už bola odstránená.';
        }
        if (status === 422) {
                return 'Server odmietol zadané údaje.';
        }
        return 'Server odpovedal chybou ' + status + '. Skúste to o chvíľu znova.';
}

// Axios rejects on network errors and on every 4xx/5xx status, so one catch covers all failures
async function callServer(method, path, body) {
        try {
                const response = await http.request({ method: method, url: path, data: body });
                return response.data;
        } catch (error) {
                throw new Error(explain(error));
        }
}

function studentPath(name) {
        return encodeURIComponent(name);
}

function taskPath(name, id) {
        return studentPath(name) + '/' + encodeURIComponent(id);
}

export function fetchStudent(name) {
        return callServer('get', studentPath(name));
}

export function addTask(name, task) {
        return callServer('post', studentPath(name), task);
}

export function resetSamples(name) {
        return callServer('post', studentPath(name) + '/reset');
}

export function fetchTask(name, id) {
        return callServer('get', taskPath(name, id));
}

export function replaceTask(name, id, task) {
        return callServer('put', taskPath(name, id), task);
}

export function removeTask(name, id) {
        return callServer('delete', taskPath(name, id));
}

export function markDone(name, id) {
        return callServer('patch', taskPath(name, id) + '/done');
}

export function markUndone(name, id) {
        return callServer('patch', taskPath(name, id) + '/undone');
}
