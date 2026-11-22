<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TopBar from './components/TopBar.vue';
import FooterNote from './components/FooterNote.vue';
import StudentDoor from './components/StudentDoor.vue';
import TaskEditor from './components/TaskEditor.vue';
import TaskPeek from './components/TaskPeek.vue';
import QuestionPopup from './components/QuestionPopup.vue';
import NoticeStack from './components/NoticeStack.vue';
import { board, pullTasks } from './board.js';

const route = useRoute();

onMounted(function () {
        if (board.student) {
                pullTasks();
        }
});
</script>

<template>
        <TopBar />

        <main class="container-xxl flex-grow-1 py-3">
                <!-- Without a student name only "O projekte" can be opened -->
                <StudentDoor v-if="!board.student && route.path !== '/o-projekte'" />
                <RouterView v-else />
        </main>

        <FooterNote />

        <!-- Dialogs are shown by setting board.editor / board.peekId / board.question -->
        <TaskEditor v-if="board.editor" />
        <TaskPeek v-if="board.peekId !== null" />
        <QuestionPopup v-if="board.question" />
        <NoticeStack />
</template>
