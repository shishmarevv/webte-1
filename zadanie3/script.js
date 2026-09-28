const weatherUrl =
        "https://api.open-meteo.com/v1/forecast" +
        "?latitude=48.15" +
        "&longitude=17.11" +
        "&current=temperature_2m,wind_speed_10m,precipitation,relative_humidity_2m" +
        "&timezone=auto";

fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {

                const temperature = data.current.temperature_2m;
                const wind = data.current.wind_speed_10m;
                const precipitation = data.current.precipitation;
                const humidity = data.current.relative_humidity_2m;
                const time = data.current.time;

                document.getElementById("weather").innerHTML =
                        "Teplota: " + temperature + " °C<br>" +
                        "Vietor: " + wind + " km/h<br>" +
                        "Vlhkost': " + humidity + " mm<br>" +
                        "Zrážky: " + precipitation + " mm<br>" +
                        "Time: " + time;

        })
        .catch(error => {

                document.getElementById("weather").innerHTML =
                        "Nepodarilo sa načítať počasie.";

                console.error(error);

        });
