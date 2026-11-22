<script setup>
import { ref, onMounted, onUnmounted, useId } from 'vue';

const props = defineProps({
        title: { type: String, required: true },
        // A form should not close because of a stray click next to it
        closeOnBackdrop: { type: Boolean, default: true },
        // Bootstrap size class, e.g. 'modal-lg'
        size: { type: String, default: '' }
});
const emit = defineEmits(['close']);

const titleId = useId();
const dialog = ref(null);
let previousFocus = null;

onMounted(function () {
        previousFocus = document.activeElement;
        document.body.classList.add('modal-open');
        dialog.value.focus();
});

onUnmounted(function () {
        // Another dialog can still be open (confirm over detail, or the form that replaced the detail)
        const otherModal = document.querySelector('.modal');
        if (!otherModal) {
                document.body.classList.remove('modal-open');
        }
        // Give focus back to the button that opened this dialog, unless another dialog took over
        const canRestore = previousFocus && document.body.contains(previousFocus);
        if (canRestore && (!otherModal || otherModal.contains(previousFocus))) {
                previousFocus.focus();
        }
});

function onBackdropClick() {
        if (props.closeOnBackdrop) {
                emit('close');
        }
}
</script>

<template>
        <!-- Bootstrap modal markup, shown and hidden by Vue (v-if in the parent) instead of bootstrap.js -->
        <Teleport to="body">
                <div
                        ref="dialog"
                        class="modal modal-dim d-block"
                        tabindex="-1"
                        role="dialog"
                        aria-modal="true"
                        :aria-labelledby="titleId"
                        @keydown.esc="emit('close')"
                        @click.self="onBackdropClick"
                >
                        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" :class="size">
                                <div class="modal-content">
                                        <div class="modal-header">
                                                <h2 :id="titleId" class="modal-title fs-5">
                                                        {{ title }}
                                                </h2>
                                                <button type="button" class="btn-close" aria-label="Zavrieť" @click="emit('close')"></button>
                                        </div>
                                        <slot></slot>
                                </div>
                        </div>
                </div>
        </Teleport>
</template>
