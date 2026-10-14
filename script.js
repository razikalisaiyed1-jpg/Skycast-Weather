const API = "https://api.open-meteo.com/v1/forecast";
const GEO_API = "https://geocoding-api.open-meteo.com/v1/search";

const $ = (id) => document.getElementById(id);
const state = { unit: "C", location: null, weather: null };

const weatherCodes = {
  0: ["Clear sky", "☀️"], 1: ["Mainly clear", "🌤️"], 2: ["Partly cloudy", "⛅"],
  3: ["Overcast", "☁️"], 45: ["Foggy", "🌫️"], 48: ["Rime fog", "🌫️"],
  51: ["Light drizzle", "🌦️"], 53: ["Drizzle", "🌦️"], 55: ["Dense drizzle", "🌧️"],
  56: ["Freezing drizzle", "🌧️"], 57: ["Heavy freezing drizzle", "🌧️"],
  61: ["Light rain", "🌦️"], 63: ["Rain", "🌧️"], 65: ["Heavy rain", "🌧️"],
  66: ["Freezing rain", "🌧️"], 67: ["Heavy freezing rain", "🌧️"],
  71: ["Light snow", "🌨️"], 73: ["Snow", "❄️"], 75: ["Heavy snow", "🌨️"],
  77: ["Snow grains", "🌨️"], 80: ["Rain showers", "🌦️"], 81: ["Showers", "🌧️"],
  82: ["Heavy showers", "⛈️"], 85: ["Snow showers", "🌨️"], 86: ["Heavy snow showers", "🌨️"],
  95: ["Thunderstorm", "⛈️"], 96: ["Thunderstorm & hail", "⛈️"], 99: ["Heavy thunderstorm", "⛈️"]
};

function celsiusToFahrenheit(c) { return (c * 9 / 5) + 32; }
function temp(value) {
  if (value == null || Number.isNaN(Number(value))) return "--°";
  const n = state.unit === "C" ? Math.round(value) : Math.round(celsiusToFahrenheit(value));
  return `${n}°`;
}
function weatherInfo(code) { return weatherCodes[code] || ["Weather conditions", "🌤️"]; }
function formatDay(dateString, options = { weekday: "short" }) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined, options);
}
function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function showStatus(message, isError = false) {
  $("statusMessage").textContent = message;
  $("statusMessage").classList.toggle("error", isError);
}
function windDescription(speed) {
  if (speed < 6) return "Light air";
  if (speed < 20) return "Gentle breeze";
  if (speed < 40) return "Moderate wind";
  return "Strong wind";
}
function uvDescription(uv) {
  if (uv < 3) return "Low exposure";
  if (uv < 6) return "Moderate exposure";
  if (uv < 8) return "High exposure";
  if (uv < 11) return "Very high exposure";
  return "Extreme exposure";
}

async function findCity(name) {
  const response = await fetch(`${GEO_API}?name=${encodeURIComponent(name)}&count=1&language=en&format=json`);
  if (!response.ok) throw new Error("Could not search for that city.");
  const data = await response.json();
  if (!data.results?.length) throw new Error("City not found. Check the spelling and try again.");
  return data.results[0];
}
async function fetchWeather(location) {
  const params = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,wind_direction_10m",
    hourly: "temperature_2m,precipitation_probability,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max",
    timezone: "auto",
    forecast_days: "7"
  });
  const response = await fetch(`${API}?${params}`);
  if (!response.ok) throw new Error("Weather data is unavailable right now. Please try again.");
  return response.json();
}
function renderWeather(location, data) {
  state.location = location;
  state.weather = data;
  const current = data.current;
  const daily = data.daily;
  const info = weatherInfo(current.weather_code);

  $("cityName").textContent = [location.name, location.admin1, location.country].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(", ");
  $("dateLine").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  $("mainIcon").textContent = info[1];
  $("temperature").innerHTML = `${temp(current.temperature_2m).replace("°", "")}<span>°</span>`;
  $("condition").textContent = info[0];
  $("feelsLike").textContent = temp(current.apparent_temperature);
  $("highLow").textContent = `H: ${temp(daily.temperature_2m_max[0])}   ·   L: ${temp(daily.temperature_2m_min[0])}`;
  $("sunTimes").textContent = `Sunrise ${formatTime(daily.sunrise[0])} · Sunset ${formatTime(daily.sunset[0])}`;
  $("humidity").textContent = `${current.relative_humidity_2m}%`;
  $("wind").innerHTML = `${Math.round(current.wind_speed_10m)} <small>km/h</small>`;
  $("windDirection").textContent = windDescription(current.wind_speed_10m);
  $("uv").textContent = daily.uv_index_max[0] ?? "--";
  $("uvLabel").textContent = uvDescription(daily.uv_index_max[0] ?? 0);
  $("visibility").innerHTML = `${(data.hourly.visibility?.[0] / 1000 || 10).toFixed(1)} <small>km</small>`;
  renderForecast(data);
  renderHourly(data);
  $("weatherContent").hidden = false;
  showStatus(`Weather updated for ${location.name}.`);
}
function renderForecast(data) {
  const daily = data.daily;
  $("forecastList").innerHTML = daily.time.map((date, index) => {
    const info = weatherInfo(daily.weather_code[index]);
    return `<div class="forecast-day ${index === 0 ? "today" : ""}">
      <span class="day-name">${index === 0 ? "Today" : formatDay(date)}</span>
      <span class="day-icon" aria-label="${info[0]}">${info[1]}</span>
      <span class="day-desc">${info[0]}</span>
      <div class="day-temps"><span>${temp(daily.temperature_2m_max[index])}</span><span>${temp(daily.temperature_2m_min[index])}</span></div>
    </div>`;
  }).join("");
}
function renderHourly(data) {
  const hours = data.hourly;
  const now = new Date();
  let start = hours.time.findIndex(t => new Date(t).getTime() >= now.getTime() - 60 * 60 * 1000);
  if (start < 0) start = 0;
  $("hourlyList").innerHTML = hours.time.slice(start, start + 12).map((time, offset) => {
    const i = start + offset;
    const info = weatherInfo(hours.weather_code[i]);
    const label = offset === 0 ? "Now" : formatTime(time);
    return `<div class="hour-item">
      <span class="hour-time">${label}</span>
      <span class="hour-icon" aria-label="${info[0]}">${info[1]}</span>
      <strong class="hour-temp">${temp(hours.temperature_2m[i])}</strong>
      <span class="hour-rain">💧 ${hours.precipitation_probability?.[i] ?? 0}%</span>
    </div>`;
  }).join("");
}
async function loadCity(cityName) {
  showStatus("Looking up your weather...");
  $("weatherContent").hidden = true;
  try {
    const location = await findCity(cityName);
    const data = await fetchWeather(location);
    renderWeather(location, data);
  } catch (error) {
    showStatus(error.message || "Something went wrong. Please try again.", true);
  }
}
$("searchForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const city = $("cityInput").value.trim();
  if (!city) {
    showStatus("Please enter a city name.", true);
    $("cityInput").focus();
    return;
  }
  loadCity(city);
});
$("unitToggle").addEventListener("click", () => {
  state.unit = state.unit === "C" ? "F" : "C";
  $("unitToggle").innerHTML = state.unit === "C" ? "°C <span class=\"toggle-divider\">/</span> °F" : "°F <span class=\"toggle-divider\">/</span> °C";
  if (state.weather && state.location) renderWeather(state.location, state.weather);
});

// Load a sensible starter city. Search for any city using the field above.
loadCity("Ahmedabad");
