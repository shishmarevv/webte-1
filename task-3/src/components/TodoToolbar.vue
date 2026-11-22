<script setup>
// The parent owns the filter values, this component only edits them (v-model)
const status = defineModel('status', { type: String, required: true });
const search = defineModel('search', { type: String, required: true });
const sort = defineModel('sort', { type: String, required: true });

defineProps({
        // { all, open, done }
        counts: { type: Object, required: true }
});

const statusOptions = [
        { value: 'all', label: 'Všetky' },
        { value: 'open', label: 'Nedokončené' },
        { value: 'done', label: 'Dokončené' }
];

const sortOptions = [
        { value: 'date_from-asc', label: 'Začiatok, najskôr' },
        { value: 'date_from-desc', label: 'Začiatok, najneskôr' },
        { value: 'date_to-asc', label: 'Koniec, najskôr' },
        { value: 'date_to-desc', label: 'Koniec, najneskôr' }
];
</script>

<template>
        <div class="row g-2 align-items-end mb-3">
                <div class="col-12 col-lg-auto">
                        <p id="status-filter-label" class="form-label small mb-1">
                                Stav
                        </p>
                        <div class="d-flex flex-wrap gap-2" role="group" aria-labelledby="status-filter-label">
                                <button
                                        v-for="option in statusOptions"
                                        :key="option.value"
                                        type="button"
                                        class="btn btn-control"
                                        :aria-pressed="status === option.value"
                                        @click="status = option.value"
                                >
                                        {{ option.label }} ({{ counts[option.value] }})
                                </button>
                        </div>
                </div>
                <div class="col-12 col-sm">
                        <label for="todo-search" class="form-label small mb-1">
                                Hľadať podľa názvu
                        </label>
                        <input id="todo-search" v-model="search" type="search" class="form-control" placeholder="Názov úlohy">
                </div>
                <div class="col-12 col-sm-auto">
                        <label for="todo-sort" class="form-label small mb-1">
                                Zoradiť podľa
                        </label>
                        <select id="todo-sort" v-model="sort" class="form-select">
                                <option v-for="option in sortOptions" :key="option.value" :value="option.value">
                                        {{ option.label }}
                                </option>
                        </select>
                </div>
        </div>
</template>
