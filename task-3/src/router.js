import { createRouter, createWebHashHistory } from 'vue-router';
import CalendarView from './views/CalendarView.vue';
import ListView from './views/ListView.vue';
import AboutView from './views/AboutView.vue';

const routes = [
        { path: '/', redirect: '/kalendar' },
        { path: '/kalendar', component: CalendarView, meta: { title: 'Kalendár' } },
        { path: '/zoznam', component: ListView, meta: { title: 'Zoznam úloh' } },
        { path: '/o-projekte', component: AboutView, meta: { title: 'O projekte' } },
        { path: '/:pathMatch(.*)*', redirect: '/kalendar' }
];

// Hash history (#/zoznam) needs no rewrite rules, so it works on the static school server
const router = createRouter({
        history: createWebHashHistory(),
        routes: routes
});

router.afterEach(function (to) {
        document.title = to.meta.title + ' | Môj TODO List';
});

export default router;
