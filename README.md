# 🌦️ SkyCast — Weather, beautifully clear

SkyCast is a responsive weather dashboard built with **HTML, CSS, and vanilla JavaScript**. It uses the free [Open-Meteo API](https://open-meteo.com/) to show current weather conditions and forecasts in a clean, modern glassmorphism interface.

> Search for a city, check the weather at a glance, and plan the week ahead.

## ✨ Features

- 🔎 Search weather by city name
- 🌡️ Switch between Celsius (°C) and Fahrenheit (°F)
- ☀️ Current weather conditions and “feels like” temperature
- 📅 7-day forecast with daily high/low temperatures
- 🕒 Hourly forecast for the next 12 hours
- 💧 Humidity, wind speed, UV index, and visibility
- 🌅 Sunrise and sunset times
- 📱 Responsive layout for desktop, tablet, and mobile
- 🎨 Dark glassmorphism UI with subtle gradients and weather icons
- 🔑 No API key required for the Open-Meteo endpoints used by this project

## 🧰 Built With

- **HTML5** — page structure
- **CSS3** — responsive layout, gradients, glassmorphism, and animations
- **JavaScript (ES6+)** — search, unit conversion, and API data rendering
- **Open-Meteo** — geocoding and weather forecast data
- **Google Fonts** — DM Sans and Manrope

## 📁 Project Structure

```text
skycast-weather/
├── index.html       # Main page
├── style.css        # Styles and responsive design
├── script.js        # Weather API calls and UI logic
├── README.md        # Project documentation
├── CONTRIBUTING.md  # Contribution guidelines
├── LICENSE          # MIT License
└── .gitignore       # Git ignore rules
```

## 🚀 Run Locally

You can run SkyCast directly in a browser, but using a local development server is recommended.

1. **Download or clone this repository**
   ```bash
   git clone https://github.com/YOUR-USERNAME/skycast-weather.git
   ```
2. Open the project folder in VS Code.
3. Install the **Live Server** extension if you do not already have it.
4. Right-click `index.html` and choose **Open with Live Server**.
5. Search for a city and explore the forecast.

Replace `YOUR-USERNAME` in the clone URL with your GitHub username after you create the repository.

### Internet connection

SkyCast fetches live data from Open-Meteo and loads fonts from Google Fonts, so an internet connection is needed for live weather data and remote fonts.

## 🌐 Publish with GitHub Pages

1. Push the project files to a GitHub repository.
2. Open the repository on GitHub and select **Settings**.
3. Open **Pages** in the left sidebar.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)` folder, then click **Save**.
6. Wait for the deployment to finish. GitHub will show the published website URL in the Pages section.

Because this is a static HTML/CSS/JavaScript project, no build step is required.

## 🔌 API Endpoints

SkyCast uses these Open-Meteo endpoints:

- **Geocoding API:** `https://geocoding-api.open-meteo.com/v1/search`
- **Forecast API:** `https://api.open-meteo.com/v1/forecast`

Weather information is provided by [Open-Meteo](https://open-meteo.com/). Review its [terms](https://open-meteo.com/en/terms) and attribution requirements before using the project commercially.

## 🛠️ Ideas for Future Improvements

- Save favourite cities
- Add location-based weather with browser permission
- Add theme or background changes based on weather
- Add weather alerts and air-quality information
- Improve accessibility and add automated tests

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## 📄 License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for details.
