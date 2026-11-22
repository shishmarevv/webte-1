<script setup>
import StudentBar from '../components/StudentBar.vue';
import LoadStatus from '../components/LoadStatus.vue';
import TodoCalendar from '../components/TodoCalendar.vue';
</script>

<template>
        <section aria-labelledby="calendar-heading">
                <h2 id="calendar-heading" class="mb-3">
                        Kalendár úloh
                </h2>
                <StudentBar />
                <LoadStatus />

                <p class="small text-body-secondary">
                        Novú úlohu vytvoríte kliknutím na deň alebo výberom časového úseku. Kliknutím na úlohu zobrazíte jej detail.
                </p>

                <TodoCalendar />

                <ul class="list-inline small mt-3 mb-0" aria-label="Legenda farieb">
                        <li class="list-inline-item me-3">
                                <span class="legend-swatch state-open" aria-hidden="true"></span>
                                Nedokončená
                        </li>
                        <li class="list-inline-item me-3">
                                <span class="legend-swatch state-overdue" aria-hidden="true"></span>
                                Po termíne
                        </li>
                        <li class="list-inline-item">
                                <span class="legend-swatch state-done" aria-hidden="true"></span>
                                Dokončená (preškrtnutá, so značkou ✓)
                        </li>
                </ul>
        </section>
</template>
