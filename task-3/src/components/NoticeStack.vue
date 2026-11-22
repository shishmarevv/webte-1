<script setup>
import { board, dismiss } from '../board.js';
</script>

<template>
        <!-- A live region: screen readers read every new notice -->
        <div class="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite">
                <div
                        v-for="notice in board.notices"
                        :key="notice.id"
                        class="toast show"
                        :class="{ 'notice-error': notice.kind === 'error' }"
                >
                        <div class="d-flex align-items-start">
                                <p class="toast-body mb-0">
                                        {{ notice.text }}
                                </p>
                                <button type="button" class="btn-close flex-shrink-0 me-2 mt-2" aria-label="Zavrieť správu" @click="dismiss(notice.id)"></button>
                        </div>
                </div>
        </div>
</template>
