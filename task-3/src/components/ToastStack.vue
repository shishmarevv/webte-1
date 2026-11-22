<script setup>
import { uiStore, closeToast } from '../stores/ui.js';
</script>

<template>
        <!-- The container is a live region, so screen readers announce every new message -->
        <div class="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite">
                <div
                        v-for="toast in uiStore.toasts"
                        :key="toast.id"
                        class="toast show"
                        :class="{ 'toast-error': toast.type === 'error' }"
                        :role="toast.type === 'error' ? 'alert' : 'status'"
                >
                        <div class="d-flex align-items-start">
                                <p class="toast-body mb-0">
                                        {{ toast.text }}
                                </p>
                                <button type="button" class="btn-close flex-shrink-0 me-2 mt-2" aria-label="Zavrieť správu" @click="closeToast(toast.id)"></button>
                        </div>
                </div>
        </div>
</template>
