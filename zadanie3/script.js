const latitude = 48.1486;
const longitude = 17.1077;

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

const bratislavaMarker = L.marker([latitude, longitude])
        .addTo(map)
        .bindPopup("Bratislava<br>Načítavam počasie...");

L.marker([48.151965, 17.072995])
        .addTo(map)
        .bindPopup("FEI STU Bratislava")
        .openPopup();


const weatherUrl =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=" + latitude +
        "&longitude=" + longitude +
        "&current=temperature_2m,wind_speed_10m,wind_direction_10m,relative_humidity_2m" +
        "&daily=precipitation_probability_max,uv_index_max" +
        "&timezone=auto";

let precipitation;
let uv_index;
let temperature;
let wind;
let wind_direction;
let humidity;
let time;

fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {

                precipitation = data.daily.precipitation_probability_max[0];
                uv_index = data.daily.uv_index_max[0];

                temperature = data.current.temperature_2m;
                wind = data.current.wind_speed_10m;
                wind_direction = data.current.wind_direction_10m;
                humidity = data.current.relative_humidity_2m;
                time = data.current.time;

                document.getElementById("weather").innerHTML =
                        "Teplota: " + temperature + " °C<br>" +
                        "Vietor: " + wind + " km/h, smer " + wind_direction + "°<br>" +
                        "Vlhkost': " + humidity + " %<br>" +
                        "Pravdepodobnosť zrážok: " + precipitation + " %<br>" +
                        "UV Index: " + uv_index + " <br>" +
                        "Time: " + time;

                bratislavaMarker.setPopupContent(
                        "Bratislava<br>" +
                        "Weather: " + temperature + " °C, " +
                        wind + " km/h, smer " + wind_direction + "°, " +
                        humidity + " %"
                );

        })
        .catch(error => {

                document.getElementById("weather").innerHTML =
                        "Nepodarilo sa načítať počasie.";

                console.error(error);

        });


