<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import StudentGate from './components/StudentGate.vue';
import TodoFormModal from './components/TodoFormModal.vue';
import TodoDetailModal from './components/TodoDetailModal.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
import ToastStack from './components/ToastStack.vue';
import { todoStore, loadTodos } from './stores/todos.js';
import { uiStore } from './stores/ui.js';

const route = useRoute();

// "O projekte" is readable without a student name, the task pages are not
const needsStudent = computed(function () {
        return !todoStore.student && route.path !== '/o-projekte';
});

onMounted(function () {
        if (todoStore.student) {
                loadTodos();
        }
});

// A normal #main-content link would change the router's hash, so focus the element directly
function skipToContent() {
        document.getElementById('main-content').focus();
}
</script>

<template>
        <a class="visually-hidden-focusable p-2" href="#main-content" @click.prevent="skipToContent">
                Preskočiť na obsah
        </a>

        <AppHeader />

        <main id="main-content" class="container-xxl flex-grow-1 py-3" tabindex="-1">
                <StudentGate v-if="needsStudent" />
                <RouterView v-else />
        </main>

        <AppFooter />

        <TodoFormModal v-if="uiStore.form" />
        <TodoDetailModal v-if="uiStore.detailId !== null" />
        <ConfirmDialog v-if="uiStore.confirm" />
        <ToastStack />
</template>
