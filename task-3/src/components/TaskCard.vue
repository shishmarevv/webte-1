<script setup>
import { board, flipTask, tearOff, editTask, peek } from '../board.js';
import { humanDate, stateOf, STATE_NAMES } from '../helpers.js';

defineProps({
        task: { type: Object, required: true }
});
</script>

<template>
        <li class="card task-card" :class="'state-' + stateOf(task)">
                <div class="card-body d-flex flex-column flex-md-row align-items-md-center gap-2 gap-md-3">
                        <div class="flex-grow-1">
                                <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                                        <h3 class="h6 mb-0">
                                                <button type="button" class="btn btn-link p-0 text-start fw-bold text-break task-title" @click="peek(task.id)">
                                                        {{ task.title }}
                                                </button>
                                        </h3>
                                        <span class="badge state-badge">{{ STATE_NAMES[stateOf(task)] }}</span>
                                </div>
                                <p class="small text-body-secondary mb-1">
                                        <time :datetime="task.date_from">{{ humanDate(task.date_from) }}</time>
                                        –
                                        <time :datetime="task.date_to">{{ humanDate(task.date_to) }}</time>
                                </p>
                                <p v-if="task.description" class="small text-break keep-lines mb-0">{{ task.description }}</p>
                        </div>

                        <div class="d-flex flex-wrap gap-2 flex-shrink-0">
                                <button type="button" class="btn btn-sm btn-control" :disabled="board.busy" @click="flipTask(task)">
                                        {{ task.is_finished ? 'Otvoriť znova' : 'Dokončiť' }}
                                </button>
                                <button type="button" class="btn btn-sm btn-control" :disabled="board.busy" @click="editTask(task)">
                                        Upraviť
                                </button>
                                <button type="button" class="btn btn-sm btn-soft-danger" :disabled="board.busy" @click="tearOff(task)">
                                        Odstrániť
                                </button>
                        </div>
                </div>
        </li>
</template>
