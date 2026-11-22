<script setup>
import { todoStore, loadTodos } from '../stores/todos.js';
</script>

<template>
        <p v-if="todoStore.loading" class="d-flex align-items-center gap-2 text-body-secondary" role="status">
                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
                Načítavam úlohy zo servera…
        </p>
        <div v-else-if="todoStore.loadError" class="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-2" role="alert">
                <span>
                        {{ todoStore.loadError }}
                        <template v-if="todoStore.loaded">Zobrazujú sa naposledy načítané údaje.</template>
                </span>
                <button type="button" class="btn btn-sm btn-control" @click="loadTodos">
                        Skúsiť znova
                </button>
        </div>
</template>
