import { reactive } from 'vue';

// State of the global dialogs and notifications, rendered once in App.vue
export const uiStore = reactive({
        toasts: [],
        // { title, message, confirmText, resolve }
        confirm: null,
        // { mode: 'create', start, end } or { mode: 'edit', todo }
        form: null,
        detailId: null
});

let nextToastId = 1;

// type: 'success' | 'error'
export function showToast(text, type) {
        const toast = { id: nextToastId, text: text, type: type };
        nextToastId++;
        uiStore.toasts.push(toast);
        // Errors stay longer, so there is time to read them
        setTimeout(function () {
                closeToast(toast.id);
        }, type === 'error' ? 8000 : 4000);
}

export function closeToast(id) {
        uiStore.toasts = uiStore.toasts.filter(function (toast) {
                return toast.id !== id;
        });
}

// Opens ConfirmDialog; the promise resolves to true (confirmed) or false (cancelled)
export function askConfirm(options) {
        return new Promise(function (resolve) {
                uiStore.confirm = {
                        title: options.title,
                        message: options.message,
                        confirmText: options.confirmText,
                        resolve: resolve
                };
        });
}

export function answerConfirm(answer) {
        const dialog = uiStore.confirm;
        uiStore.confirm = null;
        dialog.resolve(answer);
}

export function openCreateForm(start, end) {
        uiStore.detailId = null;
        uiStore.form = { mode: 'create', start: start, end: end };
}

export function openEditForm(todo) {
        uiStore.detailId = null;
        uiStore.form = { mode: 'edit', todo: todo };
}

export function closeForm() {
        uiStore.form = null;
}

export function openDetail(id) {
        uiStore.detailId = id;
}

export function closeDetail() {
        uiStore.detailId = null;
}
