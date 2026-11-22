<script setup>
import { ref } from 'vue';
import { signIn } from '../stores/todos.js';
import { validateStudent, STUDENT_MAX } from '../utils/validation.js';

const name = ref('');
const error = ref('');
const submitting = ref(false);

async function submit() {
        if (submitting.value) {
                return;
        }
        const value = name.value.trim();
        error.value = validateStudent(value);
        if (error.value) {
                return;
        }

        submitting.value = true;
        try {
                await signIn(value);
        } catch (requestError) {
                error.value = requestError.message;
        } finally {
                submitting.value = false;
        }
}
</script>

<template>
        <section class="row justify-content-center my-4" aria-labelledby="gate-heading">
                <div class="col-md-9 col-lg-6">
                        <div class="card">
                                <div class="card-body p-4">
                                        <h2 id="gate-heading" class="h4">
                                                Vitajte
                                        </h2>
                                        <p class="text-body-secondary">
                                                Úlohy sa ukladajú na server pod vaším študentským identifikátorom.
                                                Pri prvom prihlásení server pripraví päť ukážkových úloh.
                                        </p>

                                        <form novalidate @submit.prevent="submit">
                                                <label for="student-name" class="form-label">
                                                        Identifikátor študenta
                                                </label>
                                                <input
                                                        id="student-name"
                                                        v-model="name"
                                                        type="text"
                                                        class="form-control"
                                                        :class="{ 'is-invalid': error }"
                                                        :maxlength="STUDENT_MAX"
                                                        autocomplete="username"
                                                        placeholder="napr. xpriezvisko"
                                                        aria-describedby="student-error"
                                                        :aria-invalid="error !== ''"
                                                >
                                                <p id="student-error" class="invalid-feedback mb-0">
                                                        {{ error }}
                                                </p>

                                                <button type="submit" class="btn btn-brand mt-3" :disabled="submitting">
                                                        <span v-if="submitting" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                                                        {{ submitting ? 'Overujem na serveri…' : 'Pokračovať' }}
                                                </button>
                                        </form>
                                </div>
                        </div>
                </div>
        </section>
</template>
