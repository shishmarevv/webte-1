const SCHOOL = { name: 'FEI STU', lat: 48.1525, lng: 17.0731 };
const HOME = { name: 'Domov (približne)', lat: 48.1110, lng: 17.1113 };

const FIXED_PLACES = [
        SCHOOL,
        HOME,
        { name: 'Dell Technologies', lat: 48.1532, lng: 17.1180 },
        { name: 'Bar Za Rohom', lat: 48.1416, lng: 17.1131 }
];

const STORAGE_KEY = 'map-points';
const EARTH_RADIUS_KM = 6371;

function toRadians(degrees) {
        return degrees * Math.PI / 180;
}

// Haversine formula: shortest distance between two points on a sphere
function haversine(lat1, lng1, lat2, lng2) {
        const deltaLat = toRadians(lat2 - lat1);
        const deltaLng = toRadians(lng2 - lng1);

        const a = Math.sin(deltaLat / 2) ** 2 +
                Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLng / 2) ** 2;

        return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

function formatDistance(km) {
        return km.toLocaleString('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' km';
}

function loadPoints() {
        try {
                const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));

                if (!Array.isArray(saved)) {
                        return [];
                }

                return saved.filter(function (point) {
                        return typeof point.name === 'string' && Number.isFinite(point.lat) && Number.isFinite(point.lng);
                });
        } catch (error) {
                return [];
        }
}

const mapElement = document.getElementById('map');

if (typeof L !== 'undefined') {
        const mapError = document.querySelector('.map-error');
        const form = document.querySelector('.map-form');
        const nameInput = document.getElementById('point-name');
        const coordsOutput = document.querySelector('.map-coords');
        const centerButton = document.querySelector('.map-center');
        const formError = document.querySelector('.map-form-error');
        const storageError = document.querySelector('.map-storage-error');
        const emptyMessage = document.querySelector('.map-empty');
        const pointsList = document.querySelector('.map-points');
        const mapInfo = document.querySelector('.map-info');
        const mapHint = document.querySelector('.map-hint');

        mapError.hidden = true;
        mapElement.removeAttribute('hidden');
        mapHint.removeAttribute('hidden');
        form.removeAttribute('hidden');

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const map = L.map(mapElement, {
                zoomAnimation: !reduceMotion,
                fadeAnimation: !reduceMotion,
                markerZoomAnimation: !reduceMotion
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
        }).addTo(map);

        map.attributionControl.setPrefix('<a href="https://leafletjs.com/" target="_blank" rel="noopener">Leaflet</a>');

        map.fitBounds(FIXED_PLACES.map(function (place) {
                return [place.lat, place.lng];
        }), { padding: [40, 40] });

        // Colours come from the CSS palette, so dark mode works and no colour is repeated here
        const styles = getComputedStyle(document.documentElement);
        const schoolColor = styles.getPropertyValue('--color-link').trim();
        const homeColor = styles.getPropertyValue('--color-accent').trim();

        // Markers are plain divs (L.divIcon), so styles.css paints them with the site palette
        function createIcon(className) {
                return L.divIcon({
                        className: 'map-marker ' + className,
                        iconSize: [18, 18],
                        tooltipAnchor: [0, -9],
                        popupAnchor: [0, -9]
                });
        }

        // Leaflet inserts string labels as HTML, so visitor-typed names go in as a text-only element
        function createLabel(text) {
                const label = document.createElement('span');
                label.textContent = text;
                return label;
        }

        FIXED_PLACES.forEach(function (place) {
                const isMain = place === SCHOOL || place === HOME;

                L.marker([place.lat, place.lng], {
                        icon: createIcon(isMain ? 'map-marker-main' : 'map-marker-place'),
                        keyboard: false
                })
                        .bindTooltip(place.name, { permanent: true, direction: 'top' })
                        .addTo(map);
        });

        const pointsLayer = L.layerGroup().addTo(map);
        const linesLayer = L.layerGroup().addTo(map);

        let points = loadPoints();
        let markers = [];
        let selectedIndex = null;
        let pendingLatLng = null;
        let pendingMarker = null;

        function savePoints() {
                try {
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(points));
                        storageError.hidden = true;
                } catch (error) {
                        storageError.hidden = false;
                }
        }

        // Built with textContent, because the name is typed by the visitor
        function createPopup(name, toSchool, toHome) {
                const popup = document.createElement('div');
                const title = document.createElement('strong');
                const schoolLine = document.createElement('p');
                const homeLine = document.createElement('p');

                title.textContent = name;
                schoolLine.textContent = 'Od FEI STU: ' + formatDistance(toSchool);
                homeLine.textContent = 'Od domova: ' + formatDistance(toHome);

                popup.append(title, schoolLine, homeLine);
                return popup;
        }

        function setPending(latlng) {
                pendingLatLng = latlng.wrap();
                coordsOutput.textContent = pendingLatLng.lat.toFixed(5) + ', ' + pendingLatLng.lng.toFixed(5);
                formError.hidden = true;

                if (pendingMarker === null) {
                        pendingMarker = L.marker(pendingLatLng, {
                                icon: createIcon('map-marker-pending'),
                                interactive: false,
                                keyboard: false
                        }).addTo(map);
                } else {
                        pendingMarker.setLatLng(pendingLatLng);
                }
        }

        function clearPending() {
                pendingLatLng = null;
                coordsOutput.textContent = 'nevybrané';

                if (pendingMarker !== null) {
                        pendingMarker.remove();
                        pendingMarker = null;
                }
        }

        function selectPoint(index) {
                selectedIndex = index;

                const point = points[index];
                const toSchool = haversine(point.lat, point.lng, SCHOOL.lat, SCHOOL.lng);
                const toHome = haversine(point.lat, point.lng, HOME.lat, HOME.lng);

                linesLayer.clearLayers();
                L.polyline([[point.lat, point.lng], [SCHOOL.lat, SCHOOL.lng]], {
                        color: schoolColor,
                        weight: 4,
                        interactive: false
                }).addTo(linesLayer);
                L.polyline([[point.lat, point.lng], [HOME.lat, HOME.lng]], {
                        color: homeColor,
                        weight: 4,
                        dashArray: '8 8',
                        interactive: false
                }).addTo(linesLayer);

                map.fitBounds([
                        [point.lat, point.lng],
                        [SCHOOL.lat, SCHOOL.lng],
                        [HOME.lat, HOME.lng]
                ], {
                        paddingTopLeft: [40, 120],
                        paddingBottomRight: [40, 40],
                        animate: !reduceMotion
                });

                markers[index]
                        .bindPopup(createPopup(point.name, toSchool, toHome), { autoPan: false })
                        .openPopup();

                mapInfo.textContent = point.name + ': od FEI STU ' + formatDistance(toSchool) +
                        ', od domova ' + formatDistance(toHome);
                mapInfo.hidden = false;

                pointsList.querySelectorAll('.map-point-select').forEach(function (button, buttonIndex) {
                        button.setAttribute('aria-pressed', buttonIndex === index);
                });

                markers.forEach(function (marker, markerIndex) {
                        marker.getElement().classList.toggle('is-selected', markerIndex === index);
                });
        }

        function deletePoint(index) {
                points.splice(index, 1);
                savePoints();

                if (selectedIndex === index) {
                        selectedIndex = null;
                        linesLayer.clearLayers();
                        mapInfo.hidden = true;
                } else if (selectedIndex !== null && selectedIndex > index) {
                        selectedIndex--;
                }

                renderPoints();

                // Keep keyboard focus nearby instead of losing it with the removed button
                const nextButton = pointsList.querySelectorAll('.map-point-select')[Math.min(index, points.length - 1)];
                if (nextButton) {
                        nextButton.focus();
                } else {
                        nameInput.focus();
                }
        }

        function renderPoints() {
                pointsList.innerHTML = '';
                pointsLayer.clearLayers();
                markers = [];

                points.forEach(function (point, index) {
                        const isSelected = index === selectedIndex;

                        // The list below is the keyboard route, so map markers stay out of the Tab order
                        const marker = L.marker([point.lat, point.lng], {
                                icon: createIcon(isSelected ? 'map-marker-point is-selected' : 'map-marker-point'),
                                keyboard: false
                        }).addTo(pointsLayer);

                        marker.bindTooltip(createLabel(point.name), { direction: 'top' });
                        marker.on('click', function () {
                                selectPoint(index);
                        });
                        markers.push(marker);

                        const item = document.createElement('li');
                        const selectButton = document.createElement('button');
                        const deleteButton = document.createElement('button');

                        selectButton.type = 'button';
                        selectButton.className = 'map-point-select';
                        selectButton.textContent = point.name;
                        selectButton.setAttribute('aria-pressed', isSelected);
                        selectButton.addEventListener('click', function () {
                                selectPoint(index);
                        });

                        deleteButton.type = 'button';
                        deleteButton.textContent = 'Odstrániť';
                        deleteButton.setAttribute('aria-label', 'Odstrániť bod ' + point.name);
                        deleteButton.addEventListener('click', function () {
                                deletePoint(index);
                        });

                        item.append(selectButton, deleteButton);
                        pointsList.append(item);
                });

                emptyMessage.hidden = points.length > 0;
        }

        map.on('click', function (event) {
                setPending(event.latlng);
        });

        centerButton.addEventListener('click', function () {
                setPending(map.getCenter());
        });

        // Keyboard: while the map itself has focus, Enter marks its centre (shown by the crosshair in CSS)
        mapElement.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' && event.target === mapElement) {
                        setPending(map.getCenter());
                }
        });

        form.addEventListener('submit', function (event) {
                event.preventDefault();

                const name = nameInput.value.trim();

                if (pendingLatLng === null) {
                        formError.hidden = false;
                        return;
                }

                if (name === '') {
                        nameInput.value = '';
                        nameInput.reportValidity();
                        return;
                }

                points.push({ name: name, lat: pendingLatLng.lat, lng: pendingLatLng.lng });
                savePoints();

                form.reset();
                clearPending();
                renderPoints();
                selectPoint(points.length - 1);
        });

        renderPoints();
}
