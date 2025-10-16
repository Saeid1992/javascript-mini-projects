/* -------------------------
   ELEMENT REFERENCES
------------------------- */
const cityInput = document.getElementById("city-input");
const showWeatherButton = document.getElementById("show-weather-btn");
const weatherCard = document.getElementById("weather-card");
const weatherInfo = document.getElementById("weather-info");
const iconEl = document.getElementById("icon");
const temperatureEl = document.getElementById("temperature");
const descriptionEl = document.getElementById("description");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");

/* -------------------------
   WEATHER MAPPING
------------------------- */
const weatherMap = [
  {
    codes: [0],
    icon: "☀️",
    desc: "Clear Sky",
    gradient: "linear-gradient(135deg, #fceabb, #f8b500)",
  },
  {
    codes: [1, 2, 3],
    icon: "⛅",
    desc: "Partly Cloudy",
    gradient: "linear-gradient(135deg, #cfd9df, #e2ebf0)",
  },
  {
    codes: [45, 48],
    icon: "🌫️",
    desc: "Foggy",
    gradient: "linear-gradient(135deg, #d7d2cc, #304352)",
  },
  {
    codes: [51, 53, 55, 56, 57],
    icon: "🌦️",
    desc: "Drizzle",
    gradient: "linear-gradient(135deg, #a1c4fd, #c2e9fb)",
  },
  {
    codes: [61, 63, 65, 66, 67],
    icon: "🌧️",
    desc: "Rain",
    gradient: "linear-gradient(135deg, #4b79a1, #283e51)",
  },
  {
    codes: [71, 73, 75, 77],
    icon: "❄️",
    desc: "Snow",
    gradient: "linear-gradient(135deg, #83a4d4, #b6fbff)",
  },
  {
    codes: [80, 81, 82],
    icon: "🌧️",
    desc: "Rain Showers",
    gradient: "linear-gradient(135deg, #5f72bd, #9b23ea)",
  },
  {
    codes: [85, 86],
    icon: "❄️",
    desc: "Snow Showers",
    gradient: "linear-gradient(135deg, #d7d2cc, #304352)",
  },
  {
    codes: [95, 96, 99],
    icon: "⛈️",
    desc: "Thunderstorm",
    gradient: "linear-gradient(135deg, #434343, #000000)",
  },
];

/* -------------------------
   GET WEATHER STYLE BY CODE
------------------------- */
function getWeatherStyle(code) {
  return (
    weatherMap.find((w) => w.codes.includes(code)) || {
      icon: "☀️",
      desc: "Clear Sky",
      gradient: "linear-gradient(135deg, #e4bc87, #2ebde5)", // Brand fallback
    }
  );
}

/* -------------------------
   FETCH WEATHER DATA
------------------------- */
async function getWeather(city) {
  try {
    // Step 1: Get coordinates for the city
    const geoRes = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );
    const geoData = await geoRes.json();
    if (!geoData.results || geoData.results.length === 0)
      throw new Error("City not found");

    const { latitude, longitude, name } = geoData.results[0];

    // Step 2: Fetch weather data including humidity + wind
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m`
    );
    const weatherData = await weatherRes.json();

    const { temperature, weathercode, windspeed } = weatherData.current_weather;
    const humidity = weatherData.hourly.relativehumidity_2m[0]; // Approx. current

    // Step 3: Update the card visually
    updateWeatherCard(temperature, weathercode, name, humidity, windspeed);
  } catch (error) {
    console.error(error);
    descriptionEl.textContent = "City not found. Try again.";
  }
}

/* -------------------------
   UPDATE WEATHER CARD
------------------------- */
function updateWeatherCard(temp, code, city, humidity, windspeed) {
  const { icon, desc, gradient } = getWeatherStyle(code);

  // Animate icon
  iconEl.style.transform = "scale(0)";
  setTimeout(() => {
    iconEl.textContent = icon;
    iconEl.style.transform = "scale(1)";
  }, 200);

  // Animate temperature and description
  temperatureEl.style.opacity = "0";
  descriptionEl.style.opacity = "0";
  setTimeout(() => {
    temperatureEl.textContent = `${temp}°C`;
    descriptionEl.textContent = `${desc} in ${city}`;
    temperatureEl.style.opacity = "1";
    descriptionEl.style.opacity = "1";
  }, 200);

  // Update humidity and wind info
  humidityEl.textContent = `${humidity}%`;
  windEl.textContent = `${windspeed} km/h`;

  // Apply gradient background
  weatherInfo.style.background = gradient;
}

/* -------------------------
   EVENT LISTENERS
------------------------- */
showWeatherButton.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) getWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
  }
});
