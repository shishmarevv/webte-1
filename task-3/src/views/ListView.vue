<script setup>
import { ref, computed } from 'vue';
import StudentBar from '../components/StudentBar.vue';
import LoadStatus from '../components/LoadStatus.vue';
import TodoToolbar from '../components/TodoToolbar.vue';
import TodoItem from '../components/TodoItem.vue';
import { todoStore } from '../stores/todos.js';
import { filterTodos, sortTodos } from '../utils/todoFilters.js';

const status = ref('all');
const search = ref('');
const sort = ref('date_from-asc');

const counts = computed(function () {
        const done = todoStore.todos.filter(function (todo) {
                return todo.is_finished;
        }).length;
        return { all: todoStore.todos.length, open: todoStore.todos.length - done, done: done };
});

const visibleTodos = computed(function () {
        return sortTodos(filterTodos(todoStore.todos, status.value, search.value), sort.value);
});

function clearFilters() {
        status.value = 'all';
        search.value = '';
}
</script>

<template>
        <section aria-labelledby="list-heading">
                <h2 id="list-heading" class="mb-3">
                        Zoznam úloh
                </h2>
                <StudentBar />
                <LoadStatus />

                <template v-if="todoStore.loaded">
                        <TodoToolbar v-model:status="status" v-model:search="search" v-model:sort="sort" :counts="counts" />

                        <p v-if="todoStore.todos.length === 0" class="border rounded p-4 text-center text-body-secondary">
                                Zatiaľ nemáte žiadne úlohy. Vytvorte novú tlačidlom „Nová úloha“ alebo obnovte ukážkové úlohy.
                        </p>
                        <div v-else-if="visibleTodos.length === 0" class="border rounded p-4 text-center text-body-secondary">
                                <p>
                                        Filtru nezodpovedá žiadna úloha.
                                </p>
                                <button type="button" class="btn btn-sm btn-control" @click="clearFilters">
                                        Zrušiť filtre
                                </button>
                        </div>
                        <ul v-else class="list-unstyled d-grid gap-2 mb-0">
                                <TodoItem v-for="todo in visibleTodos" :key="todo.id" :todo="todo" />
                        </ul>
                </template>
        </section>
</template>
