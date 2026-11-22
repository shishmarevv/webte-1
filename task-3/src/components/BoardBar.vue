<script setup>
import { computed } from 'vue';
import { board, waiting, leave, pullTasks, wipeToSamples, draftTask } from '../board.js';
import { freshSlot } from '../helpers.js';

// Slovak plural: 1 úloha, 2-4 úlohy, 0 and 5+ úloh
const taskCount = computed(function () {
        const count = board.tasks.length;
        if (count === 1) {
                return '1 úloha';
        }
        if (count >= 2 && count <= 4) {
                return count + ' úlohy';
        }
        return count + ' úloh';
});

function startNew() {
        const slot = freshSlot();
        draftTask(slot.start, slot.end);
}
</script>

<template>
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                <p class="mb-0">
                        Študent: <strong>{{ board.student }}</strong>, {{ taskCount }}
                        <button type="button" class="btn btn-link btn-sm p-0 ms-2 align-baseline" :disabled="waiting()" @click="leave">
                                Zmeniť študenta
                        </button>
                </p>
                <div class="d-flex flex-wrap gap-2">
                        <button type="button" class="btn btn-brand" :disabled="waiting()" @click="startNew">
                                Nová úloha
                        </button>
                        <button type="button" class="btn btn-control" :disabled="waiting()" @click="pullTasks">
                                Načítať znova
                        </button>
                        <button type="button" class="btn btn-soft-danger" :disabled="waiting()" @click="wipeToSamples">
                                Obnoviť ukážkové úlohy
                        </button>
                </div>
        </div>

        <!-- State of the communication with the server. The line is always there with the same height,
             only its text changes, so the page below does not jump while a change is being saved. -->
        <p class="status-line small text-body-secondary mb-2" role="status">
                <template v-if="board.busy || board.loading">
                        <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                        {{ board.busy ? 'Ukladám zmenu na server…' : 'Načítavam úlohy zo servera…' }}
                </template>
        </p>
        <div v-if="board.problem && !board.loading" class="alert alert-warning d-flex flex-wrap align-items-center justify-content-between gap-2" role="alert">
                {{ board.problem }}
                <button type="button" class="btn btn-sm btn-control" @click="pullTasks">
                        Skúsiť znova
                </button>
        </div>
</template>
