<script setup>
import { ref, onMounted } from 'vue';

defineProps({
        title: { type: String, required: true }
});
const emit = defineEmits(['close']);

const frame = ref(null);

// Focus the dialog, so the Esc key works right away
onMounted(function () {
        frame.value.focus();
});
</script>

<template>
        <!-- Bootstrap modal markup; the parent shows it with v-if, no bootstrap.js needed -->
        <div
                ref="frame"
                class="modal popup-dim d-block"
                tabindex="-1"
                role="dialog"
                aria-modal="true"
                :aria-label="title"
                @keydown.esc="emit('close')"
        >
                <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content">
                                <div class="modal-header">
                                        <h2 class="modal-title fs-5 text-break">
                                                {{ title }}
                                        </h2>
                                        <button type="button" class="btn-close" aria-label="Zavrieť" @click="emit('close')"></button>
                                </div>
                                <slot></slot>
                        </div>
                </div>
        </div>
</template>
