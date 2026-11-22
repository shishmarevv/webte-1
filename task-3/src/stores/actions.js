// User actions shared by the list, the detail dialog and the toolbar:
// confirm where needed, call the store, then report the result in a toast.
import { deleteTodo, setFinished, resetTodos } from './todos.js';
import { askConfirm, showToast } from './ui.js';

export async function toggleFinished(todo) {
        const finish = !todo.is_finished;
        try {
                await setFinished(todo.id, finish);
                showToast(finish
                        ? 'Úloha „' + todo.title + '“ je dokončená.'
                        : 'Úloha „' + todo.title + '“ je znova otvorená.', 'success');
        } catch (error) {
                showToast(error.message, 'error');
        }
}

// Returns true when the task was deleted
export async function removeTodo(todo) {
        const confirmed = await askConfirm({
                title: 'Odstrániť úlohu?',
                message: 'Úloha „' + todo.title + '“ bude natrvalo odstránená zo servera.',
                confirmText: 'Odstrániť'
        });
        if (!confirmed) {
                return false;
        }
        try {
                await deleteTodo(todo.id);
                showToast('Úloha „' + todo.title + '“ bola odstránená.', 'success');
                return true;
        } catch (error) {
                showToast(error.message, 'error');
                return false;
        }
}

export async function resetToSamples() {
        const confirmed = await askConfirm({
                title: 'Obnoviť ukážkové úlohy?',
                message: 'Všetky vaše aktuálne úlohy budú odstránené a nahradené piatimi ukážkovými úlohami. Túto akciu nie je možné vrátiť.',
                confirmText: 'Obnoviť'
        });
        if (!confirmed) {
                return;
        }
        try {
                await resetTodos();
                showToast('Ukážkové úlohy boli obnovené.', 'success');
        } catch (error) {
                showToast(error.message, 'error');
        }
}
