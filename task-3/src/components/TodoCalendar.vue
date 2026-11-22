<script setup>
import { computed } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import skLocale from '@fullcalendar/core/locales/sk';
import { todoStore } from '../stores/todos.js';
import { openCreateForm, openDetail } from '../stores/ui.js';
import { formatRange, stateClass, stateLabel } from '../utils/dates.js';

const plugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];

// Events are computed from the same store as the list, so both always show the same data
const events = computed(function () {
        return todoStore.todos.map(function (todo) {
                return {
                        id: String(todo.id),
                        title: todo.title,
                        start: todo.date_from,
                        end: todo.date_to,
                        allDay: false,
                        classNames: [stateClass(todo)],
                        extendedProps: { state: stateLabel(todo) }
                };
        });
});

// Selecting days or a time range opens the form with that range filled in
function handleSelect(info) {
        let start = info.start;
        let end = info.end;
        if (info.allDay) {
                // The month view selects whole days (end is the next midnight),
                // a task needs times: 9:00 on the first day until 10:00 on the last day
                start = new Date(info.start);
                start.setHours(9, 0, 0, 0);
                end = new Date(info.end);
                end.setDate(end.getDate() - 1);
                end.setHours(10, 0, 0, 0);
        }
        info.view.calendar.unselect();
        openCreateForm(start, end);
}

function handleEventClick(info) {
        openDetail(Number(info.event.id));
}

// Native tooltip with the full title, time and state (set as text, never as HTML)
function handleEventDidMount(info) {
        info.el.title = info.event.title + '\n' + formatRange(info.event.startStr, info.event.endStr)
                + '\n' + info.event.extendedProps.state;
}

const options = computed(function () {
        return {
                plugins: plugins,
                locale: skLocale,
                firstDay: 1,
                initialView: 'dayGridMonth',
                headerToolbar: {
                        start: 'prev,next today',
                        center: 'title',
                        end: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                height: 'auto',
                allDaySlot: false,
                slotDuration: '01:00:00',
                snapDuration: '00:30:00',
                nowIndicator: true,
                dayMaxEvents: 3,
                eventDisplay: 'block',
                displayEventEnd: true,
                eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
                slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
                selectable: true,
                selectMirror: true,
                selectLongPressDelay: 300,
                events: events.value,
                select: handleSelect,
                eventClick: handleEventClick,
                eventDidMount: handleEventDidMount
        };
});
</script>

<template>
        <FullCalendar :options="options" />
</template>
