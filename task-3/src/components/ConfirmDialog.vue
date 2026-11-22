<script setup>
import BaseModal from './BaseModal.vue';
import { uiStore, answerConfirm } from '../stores/ui.js';
</script>

<template>
        <BaseModal :title="uiStore.confirm.title" @close="answerConfirm(false)">
                <div class="modal-body">
                        <p class="mb-0">
                                {{ uiStore.confirm.message }}
                        </p>
                </div>
                <div class="modal-footer">
                        <button type="button" class="btn btn-control" @click="answerConfirm(false)">
                                Zrušiť
                        </button>
                        <button type="button" class="btn btn-danger-soft" @click="answerConfirm(true)">
                                {{ uiStore.confirm.confirmText }}
                        </button>
                </div>
        </BaseModal>
</template>
