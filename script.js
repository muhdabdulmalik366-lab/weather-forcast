async function getWeather() {

    const cityInput = document.getElementById("cityInput");
    const city = cityInput.value.trim();

    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    // Clear old messages
    error.textContent = "";
    loading.textContent = "";

    if (city === "") {
        error.textContent = "Please enter a city name.";
        return;
    }

    try {

        loading.textContent = "Loading weather...";


        // STEP 1:
        // Find the city's latitude and longitude

        const locationURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const locationResponse = await fetch(locationURL);

        if (!locationResponse.ok) {
            throw new Error("Could not find the city.");
        }

        const locationData = await locationResponse.json();

        if (!locationData.results || locationData.results.length === 0) {
            throw new Error("City not found.");
        }

        const location = locationData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // STEP 2:
        // Get the actual weather

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,showers,weather_code,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh&precipitation_unit=mm`;

        const weatherResponse = await fetch(weatherURL);

        if (!weatherResponse.ok) {
            throw new Error("Could not get weather data.");
        }

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;


        // STEP 3:
        // Display the information

        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("temperature").textContent =
            `${Math.round(current.temperature_2m)}°C`;

        document.getElementById("rain").textContent =
            `${current.rain} mm`;

        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;


        // Weather condition

        const condition = getWeatherCondition(current.weather_code);

        document.getElementById("condition").textContent =
            condition.text;

        document.getElementById("weatherIcon").textContent =
            condition.icon;


        loading.textContent = "";

    } catch (error) {

        loading.textContent = "";

        error.textContent =
            error.message || "Something went wrong.";

    }
}


// Convert Open-Meteo weather codes into descriptions

function getWeatherCondition(code) {

    if (code === 0) {
        return {
            text: "Clear Sky",
            icon: "☀️"
        };
    }

    if (code === 1 || code === 2) {
        return {
            text: "Partly Cloudy",
            icon: "🌤️"
        };
    }

    if (code === 3) {
        return {
            text: "Overcast",
            icon: "☁️"
        };
    }

    if (code === 45 || code === 48) {
        return {
            text: "Foggy",
            icon: "🌫️"
        };
    }

    if (code >= 51 && code <= 57) {
        return {
            text: "Drizzle",
            icon: "🌦️"
        };
    }

    if (code >= 61 && code <= 67) {
        return {
            text: "Rain",
            icon: "🌧️"
        };
    }

    if (code >= 71 && code <= 77) {
        return {
            text: "Snow",
            icon: "❄️"
        };
    }

    if (code >= 80 && code <= 82) {
        return {
            text: "Rain Showers",
            icon: "🌦️"
        };
    }

    if (code >= 95) {
        return {
            text: "Thunderstorm",
            icon: "⛈️"
        };
    }

    return {
        text: "Unknown Weather",
        icon: "🌤️"
    };
}