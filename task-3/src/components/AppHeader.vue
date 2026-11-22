<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const links = [
        { to: '/kalendar', label: 'Kalendár' },
        { to: '/zoznam', label: 'Zoznam úloh' },
        { to: '/o-projekte', label: 'O projekte' }
];

const menuOpen = ref(false);
const route = useRoute();

// Close the mobile menu after navigating
watch(function () {
        return route.fullPath;
}, function () {
        menuOpen.value = false;
});
</script>

<template>
        <header class="navbar navbar-expand-md">
                <div class="container-xxl">
                        <h1 class="fs-5 m-0">
                                <RouterLink class="navbar-brand d-flex align-items-center gap-2 m-0" to="/kalendar">
                                        <svg class="flex-shrink-0" width="36" height="36" viewBox="0 0 1270 1270" aria-hidden="true">
                                                <path fill="currentColor" d="M87.6 286.1H332.6Q435.6 286.1 490.1 336.1Q544.6 386.1 544.6 472.1Q544.6 532.1 515.1 567.6Q485.6 603.1 430.6 619.1V625.1Q495.6 641.1 531.1 681.1Q566.6 721.1 566.6 792.1Q566.6 880.1 511.1 932.1Q455.6 984.1 355.6 984.1H87.6ZM309.6 879.1Q363.6 879.1 388.6 861.1Q413.6 843.1 413.6 795.1V766.1Q413.6 718.1 388.6 700.1Q363.6 682.1 309.6 682.1H233.6V879.1ZM290.6 582.1Q343.6 582.1 367.6 564.6Q391.6 547.1 391.6 501.1V471.1Q391.6 425.1 367.6 408.1Q343.6 391.1 290.6 391.1H233.6V582.1ZM638.6 286.1H766.6V871.1H846.6V286.1H974.6V871.1H1054.6V286.1H1182.6V984.1H638.6Z"/>
                                        </svg>
                                        <span>Môj TODO List</span>
                                </RouterLink>
                        </h1>

                        <button
                                class="navbar-toggler"
                                type="button"
                                aria-controls="navigation"
                                :aria-expanded="menuOpen"
                                aria-label="Menu"
                                @click="menuOpen = !menuOpen"
                        >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                        <path d="M5 17H13M5 12H19M11 7H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                        </button>

                        <!-- Bootstrap shows .collapse.show, so Vue only toggles the class -->
                        <nav id="navigation" class="collapse navbar-collapse" :class="{ show: menuOpen }" aria-label="Hlavná navigácia">
                                <ul class="navbar-nav nav-pills ms-auto gap-1 pt-2 pt-md-0">
                                        <li v-for="link in links" :key="link.to" class="nav-item">
                                                <!-- RouterLink adds aria-current="page" to the active link -->
                                                <RouterLink class="nav-link px-3" active-class="active" :to="link.to">
                                                        {{ link.label }}
                                                </RouterLink>
                                        </li>
                                </ul>
                        </nav>
                </div>
        </header>
</template>
