<script setup>
import PopupFrame from './PopupFrame.vue';
import { board, answer } from '../board.js';
</script>

<template>
        <PopupFrame :title="board.question.title" @close="answer(false)">
                <div class="modal-body">
                        <p class="mb-0">
                                {{ board.question.text }}
                        </p>
                </div>
                <div class="modal-footer">
                        <button type="button" class="btn btn-control" @click="answer(false)">
                                Zrušiť
                        </button>
                        <button type="button" class="btn btn-soft-danger" @click="answer(true)">
                                {{ board.question.yesText }}
                        </button>
                </div>
        </PopupFrame>
</template>
