<script setup>
import { computed, ref, watch, onMounted } from 'vue';
import BaseModal from './BaseModal.vue';
import { todoStore, refreshTodo, isBusy } from '../stores/todos.js';
import { uiStore, closeDetail, openEditForm } from '../stores/ui.js';
import { toggleFinished, removeTodo } from '../stores/actions.js';
import { formatDateTime, stateClass, stateLabel } from '../utils/dates.js';

const todoId = uiStore.detailId;
const refreshing = ref(true);
const refreshError = ref('');

// Read from the store, so the dialog shows every change made elsewhere
const todo = computed(function () {
        return todoStore.todos.find(function (item) {
                return item.id === todoId;
        });
});

const busy = computed(function () {
        return isBusy(todoId);
});

// The task was deleted (here or on the server), so there is nothing to show
watch(todo, function (value) {
        if (!value) {
                closeDetail();
        }
});

// Load the current version of the task from the server (GET /api/{name}/{todo_id})
onMounted(async function () {
        try {
                await refreshTodo(todoId);
        } catch (error) {
                refreshError.value = error.message;
        } finally {
                refreshing.value = false;
        }
});
</script>

<template>
        <BaseModal :title="todo ? todo.title : 'Úloha'" @close="closeDetail">
                <div v-if="todo" class="modal-body">
                        <p class="d-flex flex-wrap align-items-center gap-2">
                                <span class="badge state-badge" :class="stateClass(todo)">{{ stateLabel(todo) }}</span>
                                <span v-if="refreshing" class="small text-body-secondary" role="status">
                                        <span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                                        Overujem aktuálny stav na serveri…
                                </span>
                        </p>
                        <p v-if="refreshError" class="alert alert-warning small">
                                {{ refreshError }} Zobrazujú sa naposledy načítané údaje.
                        </p>

                        <dl class="row mb-0">
                                <dt class="col-sm-3">Začiatok</dt>
                                <dd class="col-sm-9">
                                        <time :datetime="todo.date_from">{{ formatDateTime(todo.date_from) }}</time>
                                </dd>
                                <dt class="col-sm-3">Koniec</dt>
                                <dd class="col-sm-9">
                                        <time :datetime="todo.date_to">{{ formatDateTime(todo.date_to) }}</time>
                                </dd>
                                <dt class="col-sm-3">Popis</dt>
                                <dd class="col-sm-9 todo-description-full">{{ todo.description || 'Bez popisu.' }}</dd>
                                <dt class="col-sm-3">Vytvorená</dt>
                                <dd class="col-sm-9 mb-0">
                                        <time :datetime="todo.created_at">{{ formatDateTime(todo.created_at) }}</time>
                                </dd>
                        </dl>
                </div>

                <div v-if="todo" class="modal-footer">
                        <button type="button" class="btn btn-danger-soft me-auto" :disabled="busy" @click="removeTodo(todo)">
                                Odstrániť
                        </button>
                        <button type="button" class="btn btn-control" :disabled="busy" @click="toggleFinished(todo)">
                                <span v-if="busy && !refreshing" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                                {{ todo.is_finished ? 'Otvoriť znova' : 'Dokončiť' }}
                        </button>
                        <button type="button" class="btn btn-brand" :disabled="busy" @click="openEditForm(todo)">
                                Upraviť
                        </button>
                </div>
        </BaseModal>
</template>
