<script setup>
import { computed } from 'vue';
import { todoStore, loadTodos, signOut } from '../stores/todos.js';
import { openCreateForm } from '../stores/ui.js';
import { resetToSamples } from '../stores/actions.js';
import { nextFullHour, addHours } from '../utils/dates.js';

// Slovak plural: 1 úloha, 2-4 úlohy, 0 and 5+ úloh
const countLabel = computed(function () {
        const count = todoStore.todos.length;
        if (count === 1) {
                return '1 úloha';
        }
        if (count >= 2 && count <= 4) {
                return count + ' úlohy';
        }
        return count + ' úloh';
});

function createNew() {
        const start = nextFullHour();
        openCreateForm(start, addHours(start, 1));
}
</script>

<template>
        <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <p class="mb-0 text-body-secondary">
                        Študent: <strong class="text-body">{{ todoStore.student }}</strong>
                        <span v-if="todoStore.loaded">, {{ countLabel }}</span>
                        <button type="button" class="btn btn-link btn-sm p-0 ms-2 align-baseline" @click="signOut">
                                Zmeniť študenta
                        </button>
                </p>
                <div class="d-flex flex-wrap gap-2">
                        <button type="button" class="btn btn-brand" :disabled="!todoStore.loaded" @click="createNew">
                                Nová úloha
                        </button>
                        <button type="button" class="btn btn-control" :disabled="todoStore.loading" @click="loadTodos">
                                Načítať znova
                        </button>
                        <button type="button" class="btn btn-danger-soft" :disabled="todoStore.resetting || !todoStore.loaded" @click="resetToSamples">
                                <span v-if="todoStore.resetting" class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                                Obnoviť ukážkové úlohy
                        </button>
                </div>
        </div>
</template>
