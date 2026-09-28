const latitude = 48.1486;
const longitude = 17.1077;

const weatherUrl =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + latitude +
        "&longitude=" + longitude +
        "&current=temperature_2m,wind_speed_10m,relative_humidity_2m" +
        "&daily=precipitation_probability_max,uv_index_max" +
        "&timezone=auto";

fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {

                const precipitation = data.daily.precipitation_probability_max[0];
                const uv_index = data.daily.uv_index_max[0];

                const temperature = data.current.temperature_2m;
                const wind = data.current.wind_speed_10m;
                const humidity = data.current.relative_humidity_2m;
                const time = data.current.time;

                document.getElementById("weather").innerHTML =
                        "Teplota: " + temperature + " °C<br>" +
                        "Vietor: " + wind + " km/h<br>" +
                        "Vlhkost': " + humidity + " %<br>" +
                        "Pravdepodobnosť zrážok: " + precipitation + " %<br>" +
                        "UV Index: " + uv_index + " <br>" +
                        "Time: " + time;

        })
        .catch(error => {

                document.getElementById("weather").innerHTML =
                        "Nepodarilo sa načítať počasie.";

                console.error(error);

        });


const map = L.map("map").setView(
        [latitude, longitude],
        15
);

L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
                maxZoom: 19,
                attribution:
                        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }
).addTo(map);

L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("Bratislava")
        .openPopup();

L.marker([48.151965, 17.072995])
        .addTo(map)
        .bindPopup("FEI STU Bratislava")
        .openPopup();
