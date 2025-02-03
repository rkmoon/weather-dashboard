const API_KEY = '876730c0183f49b7ac4748ccfc9cddb0165ee5100b474fa291946af3c5b6a563';
const APP_KEY = '0023977e82e744c2bf7369f31891dd196c3bafe7051d4fbfa7bc63db807012fc';
const MAC_ADDRESS = '34:94:54:93:18:AD';

async function fetchWeatherData() {
    try {
        const response = await fetch(
            `https://api.ambientweather.net/v1/devices/${MAC_ADDRESS}?apiKey=${API_KEY}&applicationKey=${APP_KEY}`
        );
        const data = await response.json();
        updateDashboard(data[0]); // Get latest observation
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function updateDashboard(weather) {
    const container = document.getElementById('weather-data');
    container.innerHTML = `
        <div class="weather-card">
            <h3>Temperature</h3>
            <p>${weather.tempf}°F</p>
        </div>
        <div class="weather-card">
            <h3>Humidity</h3>
            <p>${weather.humidity}%</p>
        </div>
        <div class="weather-card">
            <h3>Wind Speed</h3>
            <p>${weather.windspeedmph} mph</p>
        </div>
        <div class="weather-card">
            <h3>Rainfall</h3>
            <p>${weather.hourlyrainin}"</p>
        </div>
    `;
}

// Initial load
fetchWeatherData();
// Update every 5 minutes
setInterval(fetchWeatherData, 300000);