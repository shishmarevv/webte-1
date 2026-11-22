<script setup>
import { ref, computed } from 'vue';
import BoardBar from '../components/BoardBar.vue';
import TaskCard from '../components/TaskCard.vue';
import { board } from '../board.js';

const shown = ref('all');
const searched = ref('');
const order = ref('date_from-asc');

const doneCount = computed(function () {
        return board.tasks.filter(function (task) {
                return task.is_finished;
        }).length;
});

// Lower case without diacritics, so "ulohu" also finds "Úlohu"
function plain(text) {
        return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

const visibleTasks = computed(function () {
        const wanted = plain(searched.value.trim());
        // order is "<field>-<direction>", e.g. "date_to-desc"
        const [field, direction] = order.value.split('-');

        // filter() returns a new array, so sort() does not reorder board.tasks
        return board.tasks
                .filter(function (task) {
                        if (shown.value === 'open' && task.is_finished) {
                                return false;
                        }
                        if (shown.value === 'done' && !task.is_finished) {
                                return false;
                        }
                        return plain(task.title).includes(wanted);
                })
                .sort(function (a, b) {
                        const difference = new Date(a[field]) - new Date(b[field]);
                        return direction === 'asc' ? difference : -difference;
                });
});

function clearFilters() {
        shown.value = 'all';
        searched.value = '';
}
</script>

<template>
        <section aria-labelledby="list-heading">
                <h2 id="list-heading" class="mb-3">
                        Zoznam úloh
                </h2>
                <BoardBar />

                <div class="row g-2 align-items-end mb-3">
                        <div class="col-12 col-lg-auto">
                                <p class="form-label small mb-1">Stav</p>
                                <div class="d-flex flex-wrap gap-2" role="group" aria-label="Filtrovať podľa stavu">
                                        <button type="button" class="btn btn-control" :aria-pressed="shown === 'all'" @click="shown = 'all'">
                                                Všetky ({{ board.tasks.length }})
                                        </button>
                                        <button type="button" class="btn btn-control" :aria-pressed="shown === 'open'" @click="shown = 'open'">
                                                Nedokončené ({{ board.tasks.length - doneCount }})
                                        </button>
                                        <button type="button" class="btn btn-control" :aria-pressed="shown === 'done'" @click="shown = 'done'">
                                                Dokončené ({{ doneCount }})
                                        </button>
                                </div>
                        </div>
                        <div class="col-12 col-sm">
                                <label for="task-search" class="form-label small mb-1">Hľadať podľa názvu</label>
                                <input id="task-search" v-model="searched" type="search" class="form-control" placeholder="Názov úlohy">
                        </div>
                        <div class="col-12 col-sm-auto">
                                <label for="task-order" class="form-label small mb-1">Zoradiť podľa</label>
                                <select id="task-order" v-model="order" class="form-select">
                                        <option value="date_from-asc">Začiatok, najskôr</option>
                                        <option value="date_from-desc">Začiatok, najneskôr</option>
                                        <option value="date_to-asc">Koniec, najskôr</option>
                                        <option value="date_to-desc">Koniec, najneskôr</option>
                                </select>
                        </div>
                </div>

                <ul v-if="visibleTasks.length > 0" class="list-unstyled d-grid gap-2 mb-0">
                        <TaskCard v-for="task in visibleTasks" :key="task.id" :task="task" />
                </ul>
                <p v-else-if="board.tasks.length > 0" class="border rounded p-4 text-center text-body-secondary">
                        Filtru nezodpovedá žiadna úloha.
                        <button type="button" class="btn btn-sm btn-control ms-2" @click="clearFilters">Zrušiť filtre</button>
                </p>
                <p v-else-if="!board.loading && !board.problem" class="border rounded p-4 text-center text-body-secondary">
                        Zatiaľ nemáte žiadne úlohy. Vytvorte novú tlačidlom „Nová úloha“ alebo obnovte ukážkové úlohy.
                </p>
        </section>
</template>
