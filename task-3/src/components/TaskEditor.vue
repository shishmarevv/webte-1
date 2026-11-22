<script setup>
import { reactive, ref, onMounted } from 'vue';
import PopupFrame from './PopupFrame.vue';
import { board, waiting, pinTask, rewriteTask, closeEditor, TASK_LIMIT } from '../board.js';
import { forInput, fromInput, checkTask, TITLE_MAX, DESCRIPTION_MAX } from '../helpers.js';

// board.editor is { task } when editing, { start, end } for a new task
const original = board.editor.task;
const editing = Boolean(original);

const draft = reactive({
        title: editing ? original.title : '',
        description: editing ? original.description || '' : '',
        date_from: forInput(editing ? new Date(original.date_from) : board.editor.start),
        date_to: forInput(editing ? new Date(original.date_to) : board.editor.end),
        is_finished: editing ? original.is_finished : false
});

const mistakes = ref({});
const failed = ref(false);
const titleInput = ref(null);

onMounted(function () {
        titleInput.value.focus();
});

async function save() {
        // The button is disabled while sending, this also stops a second submit by the Enter key
        if (waiting()) {
                return;
        }
        mistakes.value = checkTask(draft);
        if (Object.keys(mistakes.value).length > 0) {
                return;
        }

        // PUT replaces the whole task, so every field is always sent
        const task = {
                title: draft.title.trim(),
                description: draft.description.trim(),
                date_from: fromInput(draft.date_from),
                date_to: fromInput(draft.date_to),
                is_finished: draft.is_finished
        };
        const accepted = editing ? await rewriteTask(original.id, task) : await pinTask(task);

        // After a failure the dialog stays open with everything the user typed
        if (accepted) {
                closeEditor();
        } else {
                failed.value = true;
        }
}

// The form cannot be closed while it is being saved, its result belongs to it
function cancel() {
        if (!board.busy) {
                closeEditor();
        }
}
</script>

<template>
        <PopupFrame :title="editing ? 'Upraviť úlohu' : 'Nová úloha'" @close="cancel">
                <div class="modal-body">
                        <p v-if="!editing && board.tasks.length >= TASK_LIMIT" class="alert alert-warning small">
                                Máte {{ TASK_LIMIT }} úloh, čo je limit servera. Pri vytvorení ďalšej úlohy server nahradí celý zoznam piatimi ukážkovými úlohami.
                        </p>

                        <form id="task-form" novalidate @submit.prevent="save">
                                <div class="mb-3">
                                        <label for="task-title" class="form-label">Názov <span class="small text-body-secondary">(povinný)</span></label>
                                        <input
                                                id="task-title"
                                                ref="titleInput"
                                                v-model="draft.title"
                                                type="text"
                                                class="form-control"
                                                :class="{ 'is-invalid': mistakes.title }"
                                                :maxlength="TITLE_MAX"
                                        >
                                        <p class="invalid-feedback mb-0">{{ mistakes.title }}</p>
                                        <p class="form-text mb-0">{{ draft.title.length }} / {{ TITLE_MAX }} znakov</p>
                                </div>

                                <div class="mb-3">
                                        <label for="task-description" class="form-label">Popis <span class="small text-body-secondary">(nepovinný)</span></label>
                                        <textarea id="task-description" v-model="draft.description" class="form-control" rows="4" :maxlength="DESCRIPTION_MAX"></textarea>
                                        <p class="form-text mb-0">{{ draft.description.length }} / {{ DESCRIPTION_MAX }} znakov</p>
                                </div>

                                <div class="mb-3">
                                        <label for="task-from" class="form-label">Začiatok</label>
                                        <input id="task-from" v-model="draft.date_from" type="datetime-local" class="form-control" :class="{ 'is-invalid': mistakes.date_from }">
                                        <p class="invalid-feedback mb-0">{{ mistakes.date_from }}</p>
                                </div>

                                <div class="mb-3">
                                        <label for="task-to" class="form-label">Koniec</label>
                                        <input id="task-to" v-model="draft.date_to" type="datetime-local" class="form-control" :class="{ 'is-invalid': mistakes.date_to }">
                                        <p class="invalid-feedback mb-0">{{ mistakes.date_to }}</p>
                                </div>

                                <div v-if="editing" class="form-check">
                                        <input id="task-finished" v-model="draft.is_finished" type="checkbox" class="form-check-input">
                                        <label for="task-finished" class="form-check-label">Úloha je dokončená</label>
                                </div>
                        </form>

                        <p v-if="failed" class="alert alert-warning small mt-3 mb-0" role="alert">
                                Uloženie sa nepodarilo. Zadané údaje zostali vo formulári, môžete to skúsiť znova.
                        </p>
                </div>

                <div class="modal-footer">
                        <button type="button" class="btn btn-control" :disabled="board.busy" @click="cancel">
                                Zrušiť
                        </button>
                        <!-- The button is outside the <form>, the form attribute connects them -->
                        <button type="submit" form="task-form" class="btn btn-brand" :disabled="waiting()">
                                <span v-if="board.busy" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                {{ board.busy ? 'Ukladám…' : (editing ? 'Uložiť zmeny' : 'Vytvoriť úlohu') }}
                        </button>
                </div>
        </PopupFrame>
</template>
