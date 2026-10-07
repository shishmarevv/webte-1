const hamburger = document.getElementById("hamburger");

hamburger.removeAttribute("hidden");

hamburger.addEventListener('click', function () {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        const shouldExpand = !isExpanded;
        hamburger.setAttribute('aria-expanded', shouldExpand);
});