<script setup>
import { computed } from 'vue';
import { isBusy } from '../stores/todos.js';
import { openEditForm, openDetail } from '../stores/ui.js';
import { toggleFinished, removeTodo } from '../stores/actions.js';
import { formatDateTime, stateClass, stateLabel } from '../utils/dates.js';

const props = defineProps({
        todo: { type: Object, required: true }
});

// True while a request for this task runs; its buttons are disabled meanwhile
const busy = computed(function () {
        return isBusy(props.todo.id);
});
</script>

<template>
        <li class="card todo-item" :class="stateClass(todo)" :aria-busy="busy">
                <div class="card-body d-flex flex-column flex-md-row align-items-md-center gap-2 gap-md-3">
                        <div class="flex-grow-1 min-w-0">
                                <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                                        <h3 class="h6 mb-0">
                                                <button type="button" class="btn btn-link p-0 text-start fw-bold todo-title" @click="openDetail(todo.id)">
                                                        {{ todo.title }}
                                                </button>
                                        </h3>
                                        <span class="badge state-badge">{{ stateLabel(todo) }}</span>
                                </div>
                                <p class="small text-body-secondary mb-1">
                                        <time :datetime="todo.date_from">{{ formatDateTime(todo.date_from) }}</time>
                                        –
                                        <time :datetime="todo.date_to">{{ formatDateTime(todo.date_to) }}</time>
                                </p>
                                <p v-if="todo.description" class="todo-description small mb-0">
                                        {{ todo.description }}
                                </p>
                        </div>

                        <div class="d-flex flex-wrap gap-2 flex-shrink-0">
                                <button type="button" class="btn btn-sm btn-control" :disabled="busy" @click="toggleFinished(todo)">
                                        <span v-if="busy" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                                        {{ todo.is_finished ? 'Otvoriť znova' : 'Dokončiť' }}
                                </button>
                                <button type="button" class="btn btn-sm btn-control" :disabled="busy" @click="openEditForm(todo)">
                                        Upraviť
                                </button>
                                <button type="button" class="btn btn-sm btn-danger-soft" :disabled="busy" @click="removeTodo(todo)">
                                        Odstrániť
                                </button>
                        </div>
                </div>
        </li>
</template>
