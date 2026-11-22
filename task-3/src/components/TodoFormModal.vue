<script setup>
import { reactive, ref, computed, onMounted, useId } from 'vue';
import BaseModal from './BaseModal.vue';
import { todoStore, createTodo, updateTodo, MAX_TODOS } from '../stores/todos.js';
import { uiStore, closeForm, showToast } from '../stores/ui.js';
import { toInputValue, inputToIso } from '../utils/dates.js';
import { validateTodo, TITLE_MAX, DESCRIPTION_MAX } from '../utils/validation.js';

const formId = useId();
const editing = uiStore.form.mode === 'edit';
const source = uiStore.form.todo;

// Edit: prefill with the task's current values. Create: empty, with the chosen time range.
const form = reactive({
        title: editing ? source.title : '',
        description: editing ? source.description || '' : '',
        date_from: toInputValue(editing ? new Date(source.date_from) : uiStore.form.start),
        date_to: toInputValue(editing ? new Date(source.date_to) : uiStore.form.end),
        is_finished: editing ? source.is_finished : false
});

const errors = ref({});
const serverError = ref('');
const submitting = ref(false);
const titleInput = ref(null);

const limitReached = computed(function () {
        return !editing && todoStore.todos.length >= MAX_TODOS;
});

onMounted(function () {
        titleInput.value.focus();
});

async function submit() {
        // A second click while the request runs must not create a duplicate task
        if (submitting.value) {
                return;
        }
        errors.value = validateTodo(form);
        if (Object.keys(errors.value).length > 0) {
                return;
        }

        // PUT replaces the whole task, so every TodoCreate field is always sent
        const payload = {
                title: form.title.trim(),
                description: form.description.trim(),
                date_from: inputToIso(form.date_from),
                date_to: inputToIso(form.date_to),
                is_finished: form.is_finished
        };

        submitting.value = true;
        serverError.value = '';
        try {
                if (editing) {
                        await updateTodo(source.id, payload);
                        showToast('Zmeny v úlohe „' + payload.title + '“ boli uložené.', 'success');
                } else {
                        await createTodo(payload);
                        showToast('Úloha „' + payload.title + '“ bola vytvorená.', 'success');
                }
                closeForm();
        } catch (error) {
                // The dialog stays open with the typed values, so the user can try again
                serverError.value = error.message;
                errors.value = error.fields;
        } finally {
                submitting.value = false;
        }
}
</script>

<template>
        <BaseModal :title="editing ? 'Upraviť úlohu' : 'Nová úloha'" size="modal-lg" :close-on-backdrop="false" @close="closeForm">
                <div class="modal-body">
                        <p v-if="limitReached" class="alert alert-warning small">
                                Máte {{ MAX_TODOS }} úloh, čo je limit servera. Pri vytvorení ďalšej úlohy server nahradí celý zoznam piatimi ukážkovými úlohami.
                        </p>

                        <form :id="formId" novalidate @submit.prevent="submit">
                                <div class="mb-3">
                                        <label :for="formId + '-title'" class="form-label">
                                                Názov <span class="text-body-secondary small">(povinný)</span>
                                        </label>
                                        <input
                                                :id="formId + '-title'"
                                                ref="titleInput"
                                                v-model="form.title"
                                                type="text"
                                                class="form-control"
                                                :class="{ 'is-invalid': errors.title }"
                                                :maxlength="TITLE_MAX"
                                                :aria-invalid="Boolean(errors.title)"
                                                :aria-describedby="formId + '-title-help'"
                                        >
                                        <p v-if="errors.title" class="invalid-feedback mb-0">{{ errors.title }}</p>
                                        <p :id="formId + '-title-help'" class="form-text mb-0">{{ form.title.length }} / {{ TITLE_MAX }} znakov</p>
                                </div>

                                <div class="mb-3">
                                        <label :for="formId + '-description'" class="form-label">
                                                Popis <span class="text-body-secondary small">(nepovinný)</span>
                                        </label>
                                        <textarea
                                                :id="formId + '-description'"
                                                v-model="form.description"
                                                class="form-control"
                                                :class="{ 'is-invalid': errors.description }"
                                                rows="4"
                                                :maxlength="DESCRIPTION_MAX"
                                                :aria-invalid="Boolean(errors.description)"
                                                :aria-describedby="formId + '-description-help'"
                                        ></textarea>
                                        <p v-if="errors.description" class="invalid-feedback mb-0">{{ errors.description }}</p>
                                        <p :id="formId + '-description-help'" class="form-text mb-0">{{ form.description.length }} / {{ DESCRIPTION_MAX }} znakov</p>
                                </div>

                                <div class="row g-3 mb-3">
                                        <div class="col-sm-6">
                                                <label :for="formId + '-from'" class="form-label">Začiatok</label>
                                                <input
                                                        :id="formId + '-from'"
                                                        v-model="form.date_from"
                                                        type="datetime-local"
                                                        class="form-control"
                                                        :class="{ 'is-invalid': errors.date_from }"
                                                        :aria-invalid="Boolean(errors.date_from)"
                                                >
                                                <p v-if="errors.date_from" class="invalid-feedback mb-0">{{ errors.date_from }}</p>
                                        </div>
                                        <div class="col-sm-6">
                                                <label :for="formId + '-to'" class="form-label">Koniec</label>
                                                <input
                                                        :id="formId + '-to'"
                                                        v-model="form.date_to"
                                                        type="datetime-local"
                                                        class="form-control"
                                                        :class="{ 'is-invalid': errors.date_to }"
                                                        :aria-invalid="Boolean(errors.date_to)"
                                                >
                                                <p v-if="errors.date_to" class="invalid-feedback mb-0">{{ errors.date_to }}</p>
                                        </div>
                                </div>

                                <div v-if="editing" class="form-check">
                                        <input :id="formId + '-finished'" v-model="form.is_finished" type="checkbox" class="form-check-input">
                                        <label :for="formId + '-finished'" class="form-check-label">Úloha je dokončená</label>
                                </div>
                        </form>

                        <div v-if="serverError" class="alert alert-danger small mt-3 mb-0" role="alert">
                                {{ serverError }} Zadané údaje zostali vo formulári, môžete to skúsiť znova.
                        </div>
                </div>

                <div class="modal-footer">
                        <button type="button" class="btn btn-control" @click="closeForm">
                                Zrušiť
                        </button>
                        <!-- The button sits outside the <form>, the form attribute connects it -->
                        <button type="submit" class="btn btn-brand" :form="formId" :disabled="submitting">
                                <span v-if="submitting" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                <template v-if="submitting">Ukladám…</template>
                                <template v-else>{{ editing ? 'Uložiť zmeny' : 'Vytvoriť úlohu' }}</template>
                        </button>
                </div>
        </BaseModal>
</template>
