import { reactive } from 'vue';
import * as api from '../services/api.js';

const STUDENT_KEY = 'todo-list:student';
// The server keeps at most 50 tasks; creating one more resets the list to the 5 samples
export const MAX_TODOS = 50;

// Only the student's name is kept in the browser, the tasks always come from the server
function readSavedStudent() {
        try {
                return localStorage.getItem(STUDENT_KEY) || '';
        } catch {
                return '';
        }
}

function saveStudent(name) {
        try {
                if (name) {
                        localStorage.setItem(STUDENT_KEY, name);
                } else {
                        localStorage.removeItem(STUDENT_KEY);
                }
        } catch {
                // Storage can be blocked (private mode); the app then asks for the name on every visit
        }
}

// Single source of truth: the calendar and the list are both computed from `todos`
export const todoStore = reactive({
        student: readSavedStudent(),
        todos: [],
        loading: false,
        loaded: false,
        loadError: '',
        resetting: false,
        busyIds: []
});

function replaceTodo(saved) {
        const index = todoStore.todos.findIndex(function (todo) {
                return todo.id === saved.id;
        });
        if (index === -1) {
                todoStore.todos.push(saved);
        } else {
                todoStore.todos[index] = saved;
        }
}

function removeFromStore(id) {
        todoStore.todos = todoStore.todos.filter(function (todo) {
                return todo.id !== id;
        });
}

export function isBusy(id) {
        return todoStore.busyIds.includes(id);
}

// Marks a task as busy while its request runs, so its buttons can be disabled
async function withBusy(id, work) {
        todoStore.busyIds.push(id);
        try {
                return await work();
        } catch (error) {
                // The task no longer exists on the server, so it must not stay on screen either
                if (error.status === 404) {
                        removeFromStore(id);
                }
                throw error;
        } finally {
                todoStore.busyIds = todoStore.busyIds.filter(function (busyId) {
                        return busyId !== id;
                });
        }
}

// The name is checked on the server first, so a name that is not allowed is never saved
export async function signIn(name) {
        const data = await api.getTodos(name);
        todoStore.student = name;
        todoStore.todos = data.todos;
        todoStore.loaded = true;
        todoStore.loadError = '';
        saveStudent(name);
}

export function signOut() {
        todoStore.student = '';
        todoStore.todos = [];
        todoStore.loaded = false;
        todoStore.loadError = '';
        saveStudent('');
}

export async function loadTodos() {
        todoStore.loading = true;
        todoStore.loadError = '';
        try {
                const data = await api.getTodos(todoStore.student);
                todoStore.todos = data.todos;
                todoStore.loaded = true;
        } catch (error) {
                todoStore.loadError = error.message;
        } finally {
                todoStore.loading = false;
        }
}

export async function createTodo(todo) {
        const limitReached = todoStore.todos.length >= MAX_TODOS;
        const saved = await api.createTodo(todoStore.student, todo);
        if (limitReached) {
                // The server replaced the whole list, so the local copy is outdated
                await loadTodos();
        } else {
                todoStore.todos.push(saved);
        }
        return saved;
}

export function updateTodo(id, todo) {
        return withBusy(id, async function () {
                const saved = await api.updateTodo(todoStore.student, id, todo);
                replaceTodo(saved);
                return saved;
        });
}

export function deleteTodo(id) {
        return withBusy(id, async function () {
                await api.deleteTodo(todoStore.student, id);
                removeFromStore(id);
        });
}

export function setFinished(id, finished) {
        return withBusy(id, async function () {
                const saved = finished
                        ? await api.markDone(todoStore.student, id)
                        : await api.markUndone(todoStore.student, id);
                replaceTodo(saved);
                return saved;
        });
}

// Fetches one task again, used when its detail opens
export function refreshTodo(id) {
        return withBusy(id, async function () {
                const saved = await api.getTodo(todoStore.student, id);
                replaceTodo(saved);
                return saved;
        });
}

export async function resetTodos() {
        todoStore.resetting = true;
        try {
                await api.resetTodos(todoStore.student);
                await loadTodos();
        } finally {
                todoStore.resetting = false;
        }
}
