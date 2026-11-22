// The whole state of the app and every action the user can do.
// The tasks live on the server: after each change the list is read again,
// so the calendar and the list always show exactly what the server has.
import { reactive } from 'vue';
import * as server from './server.js';

const NAME_KEY = 'todo-list:student';
// The server keeps at most 50 tasks; creating one more resets the list to the 5 samples
export const TASK_LIMIT = 50;

export const board = reactive({
        // Only the name is remembered in the browser, never the tasks
        student: localStorage.getItem(NAME_KEY) || '',
        tasks: [],
        loading: false,
        // true while a change (create, edit, delete, ...) is being sent
        busy: false,
        problem: '',
        notices: [],
        // Open dialogs: confirm question, task form, task detail
        question: null,
        editor: null,
        peekId: null
});

// While the app waits for the server, every action button is disabled,
// so two requests never overlap and an old answer cannot overwrite a newer one
export function waiting() {
        return board.busy || board.loading;
}

// Student

// The name is checked on the server first, so a name that is not allowed is never saved
export async function enter(name) {
        const data = await server.fetchStudent(name);
        board.student = name;
        board.tasks = data.todos;
        board.problem = '';
        localStorage.setItem(NAME_KEY, name);
}

export function leave() {
        board.student = '';
        board.tasks = [];
        board.problem = '';
        localStorage.removeItem(NAME_KEY);
}

// Reading tasks

export async function pullTasks() {
        board.loading = true;
        board.problem = '';
        try {
                const data = await server.fetchStudent(board.student);
                board.tasks = data.todos;
        } catch (error) {
                board.problem = error.message;
        }
        board.loading = false;
}

// Loads one task again (GET /api/{name}/{id}), used when its detail opens.
// Skipped while another request runs: the list is read again after it anyway.
export async function recheckTask(id) {
        if (waiting()) {
                return;
        }
        board.loading = true;
        try {
                const fresh = await server.fetchTask(board.student, id);
                board.tasks = board.tasks.map(function (task) {
                        return task.id === id ? fresh : task;
                });
                board.loading = false;
        } catch (error) {
                board.loading = false;
                notify(error.message, 'error');
                await pullTasks();
        }
}

// Changing tasks

// Every change goes through here: send it, report the result, read the list again.
// Returns true when the server accepted the change.
async function change(send, successText) {
        board.busy = true;
        let accepted = false;
        try {
                await send();
                notify(successText, 'ok');
                accepted = true;
        } catch (error) {
                notify(error.message, 'error');
        }
        // Also after a failure: the task may have been deleted in the meantime
        await pullTasks();
        board.busy = false;
        return accepted;
}

export function pinTask(task) {
        return change(function () {
                return server.addTask(board.student, task);
        }, 'Úloha „' + task.title + '“ bola vytvorená.');
}

export function rewriteTask(id, task) {
        return change(function () {
                return server.replaceTask(board.student, id, task);
        }, 'Zmeny v úlohe „' + task.title + '“ boli uložené.');
}

export function flipTask(task) {
        if (task.is_finished) {
                return change(function () {
                        return server.markUndone(board.student, task.id);
                }, 'Úloha „' + task.title + '“ je znova otvorená.');
        }
        return change(function () {
                return server.markDone(board.student, task.id);
        }, 'Úloha „' + task.title + '“ je dokončená.');
}

export async function tearOff(task) {
        const sure = await askFirst('Odstrániť úlohu?', 'Úloha „' + task.title + '“ bude natrvalo odstránená zo servera.', 'Odstrániť');
        if (sure) {
                await change(function () {
                        return server.removeTask(board.student, task.id);
                }, 'Úloha „' + task.title + '“ bola odstránená.');
        }
}

export async function wipeToSamples() {
        const sure = await askFirst('Obnoviť ukážkové úlohy?',
                'Všetky vaše aktuálne úlohy budú odstránené a nahradené piatimi ukážkovými úlohami. Túto akciu nie je možné vrátiť.',
                'Obnoviť');
        if (sure) {
                await change(function () {
                        return server.resetSamples(board.student);
                }, 'Ukážkové úlohy boli obnovené.');
        }
}

// Notices (toasts)

let noticeCount = 0;

// kind: 'ok' | 'error'; errors stay longer so there is time to read them
export function notify(text, kind) {
        noticeCount++;
        const notice = { id: noticeCount, text: text, kind: kind };
        board.notices.push(notice);
        setTimeout(function () {
                dismiss(notice.id);
        }, kind === 'error' ? 8000 : 4000);
}

export function dismiss(id) {
        board.notices = board.notices.filter(function (notice) {
                return notice.id !== id;
        });
}

// Dialogs

// Shows QuestionPopup and waits: resolves to true (yes) or false (no)
export function askFirst(title, text, yesText) {
        return new Promise(function (resolve) {
                board.question = { title: title, text: text, yesText: yesText, resolve: resolve };
        });
}

export function answer(yes) {
        board.question.resolve(yes);
        board.question = null;
}

// New task, start and end are Date objects to prefill the form
export function draftTask(start, end) {
        board.peekId = null;
        board.editor = { start: start, end: end };
}

export function editTask(task) {
        board.peekId = null;
        board.editor = { task: task };
}

export function closeEditor() {
        board.editor = null;
}

export function peek(id) {
        board.peekId = id;
}

export function closePeek() {
        board.peekId = null;
}
