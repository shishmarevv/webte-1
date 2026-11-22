<script setup>
import { ref } from 'vue';
import { enter } from '../board.js';

const name = ref('');
const mistake = ref('');
const checking = ref(false);

async function knock() {
        const value = name.value.trim();
        if (value === '') {
                mistake.value = 'Zadajte identifikátor študenta.';
                return;
        }
        checking.value = true;
        mistake.value = '';
        try {
                await enter(value);
        } catch (error) {
                mistake.value = error.message;
        }
        checking.value = false;
}
</script>

<template>
        <section class="row justify-content-center my-4" aria-labelledby="door-heading">
                <div class="col-md-9 col-lg-6">
                        <div class="card">
                                <div class="card-body p-4">
                                        <h2 id="door-heading" class="h4">
                                                Vitajte
                                        </h2>
                                        <p class="text-body-secondary">
                                                Úlohy sa ukladajú na server pod vaším študentským identifikátorom.
                                                Pri prvom prihlásení server pripraví päť ukážkových úloh.
                                        </p>

                                        <form novalidate @submit.prevent="knock">
                                                <label for="student-name" class="form-label">
                                                        Identifikátor študenta
                                                </label>
                                                <input
                                                        id="student-name"
                                                        v-model="name"
                                                        type="text"
                                                        class="form-control"
                                                        :class="{ 'is-invalid': mistake }"
                                                        maxlength="100"
                                                        autocomplete="username"
                                                        placeholder="napr. xpriezvisko"
                                                >
                                                <p class="invalid-feedback mb-0">
                                                        {{ mistake }}
                                                </p>

                                                <button type="submit" class="btn btn-brand mt-3" :disabled="checking">
                                                        <span v-if="checking" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                                        {{ checking ? 'Overujem na serveri…' : 'Pokračovať' }}
                                                </button>
                                        </form>
                                </div>
                        </div>
                </div>
        </section>
</template>
