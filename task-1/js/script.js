const SEMESTER_START = new Date(2026, 8, 14);
const SEMESTER_END = new Date(2026, 11, 14);

function toMinutes(time) {
        const parts = time.split(':');
        return Number(parts[0]) * 60 + Number(parts[1]);
}

const hamburger = document.getElementById("hamburger");

hamburger.removeAttribute("hidden");

hamburger.addEventListener('click', function () {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        const shouldExpand = !isExpanded;
        hamburger.setAttribute('aria-expanded', shouldExpand);
});

const scheduleFilter = document.querySelector(".schedule-filter");

if (scheduleFilter) {
        scheduleFilter.removeAttribute("hidden");

        const scheduleButtons = scheduleFilter.querySelectorAll('button');
        const scheduleItems = document.querySelectorAll('.schedule-table td[data-day]');
        const scheduleEmpty = document.querySelector('.schedule-empty');
        const scheduleStatus = document.querySelector('.schedule-status');

        scheduleButtons.forEach(function (button) {
                button.addEventListener('click', function () {
                        scheduleButtons.forEach(function (other) {
                                other.setAttribute('aria-pressed', other === button);
                        });

                        const filter = button.dataset.filter;
                        let visibleCount = 0;

                        scheduleItems.forEach(function (item) {
                                const matches = filter === 'all' || item.classList.contains(filter);
                                item.classList.toggle('is-filtered-out', !matches);

                                if (matches) {
                                        visibleCount++;
                                }
                        });

                        scheduleEmpty.hidden = visibleCount > 0;
                });
        });

        const now = new Date();
        const nowInWeek = now.getDay() * 1440 + now.getHours() * 60 + now.getMinutes();
        if (now < SEMESTER_START) {
                scheduleStatus.textContent = "Semester ešte nezačal";
        } else if (now > SEMESTER_END) {
                scheduleStatus.textContent = "Semester sa už skončil";
        } else {
                let currentItem = null;
                let nextItem = null;
        
                scheduleItems.forEach(function (item) {
                        const day = Number(item.dataset.day);
                        const start = day * 1440 + toMinutes(item.dataset.start);
                        const end = day * 1440 + toMinutes(item.dataset.end);
        
                        if (start <= nowInWeek && nowInWeek < end) {
                                currentItem = item;
                        } else if (start > nowInWeek && nextItem === null) {
                                nextItem = item;
                        }
                });
        
                if (nextItem === null) {
                        nextItem = scheduleItems[0];
                }
                
                if (currentItem) {
                        currentItem.classList.add('is-current');
                        currentItem.setAttribute('aria-current', 'time');
                        scheduleStatus.textContent = 'Práve prebieha: ' + currentItem.querySelector('abbr').title;
                } else {
                        scheduleStatus.textContent = 'Najbližšia hodina: ' +
                                nextItem.querySelector('abbr').title +
                                ', ' +
                                nextItem.closest('tr').querySelector('abbr').title.toLowerCase() +
                                ' ' +
                                nextItem.dataset.start;
                }
        }
        scheduleStatus.removeAttribute('hidden');

        const semesterSection = document.querySelector('.semester');
        const semesterProgress = document.getElementById('semester-progress');
        const semesterPercent = document.querySelector('.semester-percent');

        const ratio = (now - SEMESTER_START) / (SEMESTER_END - SEMESTER_START);
        const percent = Math.round(Math.min(Math.max(ratio, 0), 1) * 100);
        
        semesterProgress.value = percent;
        semesterPercent.textContent = percent + ' %';
        semesterSection.removeAttribute('hidden');    
}