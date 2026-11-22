<script setup>
import { computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import skLocale from '@fullcalendar/core/locales/sk';
import BoardBar from '../components/BoardBar.vue';
import { board, draftTask, peek } from '../board.js';
import { stateOf } from '../helpers.js';

const HOURS = { hour: '2-digit', minute: '2-digit', hour12: false };

// Selecting days or a time range opens the form with that range filled in
function onSelect(info) {
        let start = info.start;
        let end = info.end;
        // The month view selects whole days (end = next midnight), a task needs times:
        // 9:00 on the first day until 10:00 on the last day
        if (info.allDay) {
                start = new Date(info.start);
                start.setHours(9, 0, 0, 0);
                end = new Date(info.end);
                end.setDate(end.getDate() - 1);
                end.setHours(10, 0, 0, 0);
        }
        draftTask(start, end);
}

function onEventClick(info) {
        peek(Number(info.event.id));
}

// The events are made from board.tasks, the same array the list uses,
// so a change shows up in both places at once
const calendarOptions = computed(function () {
        return {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                locale: skLocale,
                initialView: 'dayGridMonth',
                headerToolbar: {
                        start: 'prev,next today',
                        center: 'title',
                        end: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                height: 'auto',
                allDaySlot: false,
                slotDuration: '01:00:00',
                slotLabelFormat: HOURS,
                eventTimeFormat: HOURS,
                eventDisplay: 'block',
                dayMaxEvents: 3,
                nowIndicator: true,
                selectable: true,
                select: onSelect,
                eventClick: onEventClick,
                events: board.tasks.map(function (task) {
                        return {
                                id: String(task.id),
                                title: task.title,
                                start: task.date_from,
                                end: task.date_to,
                                classNames: ['state-' + stateOf(task)]
                        };
                })
        };
});
</script>

<template>
        <section aria-labelledby="calendar-heading">
                <h2 id="calendar-heading" class="mb-3">
                        Kalendár úloh
                </h2>
                <BoardBar />

                <p class="small text-body-secondary">
                        Novú úlohu vytvoríte kliknutím na deň alebo výberom časového úseku. Kliknutím na úlohu zobrazíte jej detail.
                </p>

                <FullCalendar :options="calendarOptions" />

                <ul class="list-inline small mt-3 mb-0" aria-label="Legenda farieb">
                        <li class="list-inline-item me-3">
                                <span class="swatch state-open" aria-hidden="true"></span>
                                Nedokončená
                        </li>
                        <li class="list-inline-item me-3">
                                <span class="swatch state-late" aria-hidden="true"></span>
                                Po termíne
                        </li>
                        <li class="list-inline-item">
                                <span class="swatch state-done" aria-hidden="true"></span>
                                Dokončená (preškrtnutá, so značkou ✓)
                        </li>
                </ul>
        </section>
</template>
