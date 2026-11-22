<script setup>
import { computed, watch, onMounted } from 'vue';
import PopupFrame from './PopupFrame.vue';
import { board, waiting, recheckTask, flipTask, tearOff, editTask, closePeek } from '../board.js';
import { humanDate, stateOf, STATE_NAMES } from '../helpers.js';

const id = board.peekId;

// Read from the board, so the dialog follows every change of the task
const task = computed(function () {
        return board.tasks.find(function (item) {
                return item.id === id;
        });
});

// The task is gone (deleted here or on the server), there is nothing to show
watch(task, function (value) {
        if (!value) {
                closePeek();
        }
});

// Show the current version from the server
onMounted(function () {
        recheckTask(id);
});
</script>

<template>
        <PopupFrame v-if="task" :title="task.title" @close="closePeek">
                <div class="modal-body">
                        <p>
                                <span class="badge state-badge" :class="'state-' + stateOf(task)">{{ STATE_NAMES[stateOf(task)] }}</span>
                        </p>
                        <dl class="row mb-0">
                                <dt class="col-sm-3">Začiatok</dt>
                                <dd class="col-sm-9"><time :datetime="task.date_from">{{ humanDate(task.date_from) }}</time></dd>
                                <dt class="col-sm-3">Koniec</dt>
                                <dd class="col-sm-9"><time :datetime="task.date_to">{{ humanDate(task.date_to) }}</time></dd>
                                <dt class="col-sm-3">Popis</dt>
                                <dd class="col-sm-9 text-break keep-lines">{{ task.description || 'Bez popisu.' }}</dd>
                                <dt class="col-sm-3">Vytvorená</dt>
                                <dd class="col-sm-9 mb-0"><time :datetime="task.created_at">{{ humanDate(task.created_at) }}</time></dd>
                        </dl>
                </div>
                <div class="modal-footer">
                        <button type="button" class="btn btn-soft-danger me-auto" :disabled="waiting()" @click="tearOff(task)">
                                Odstrániť
                        </button>
                        <button type="button" class="btn btn-control" :disabled="waiting()" @click="flipTask(task)">
                                {{ task.is_finished ? 'Otvoriť znova' : 'Dokončiť' }}
                        </button>
                        <button type="button" class="btn btn-brand" :disabled="waiting()" @click="editTask(task)">
                                Upraviť
                        </button>
                </div>
        </PopupFrame>
</template>
