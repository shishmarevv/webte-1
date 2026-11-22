import { createRouter, createWebHashHistory } from 'vue-router';
import CalendarPage from './pages/CalendarPage.vue';
import ListPage from './pages/ListPage.vue';
import AboutPage from './pages/AboutPage.vue';

const routes = [
        { path: '/', redirect: '/kalendar' },
        { path: '/kalendar', component: CalendarPage, meta: { title: 'Kalendár' } },
        { path: '/zoznam', component: ListPage, meta: { title: 'Zoznam úloh' } },
        { path: '/o-projekte', component: AboutPage, meta: { title: 'O projekte' } },
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
