const API_KEY = '876730c0183f49b7ac4748ccfc9cddb0165ee5100b474fa291946af3c5b6a563';
const APP_KEY = '0023977e82e744c2bf7369f31891dd196c3bafe7051d4fbfa7bc63db807012fc';
const MAC_ADDRESS = '34:94:54:93:18:AD';

// Bronson, Texas coordinates
const BRONSON_LAT = 31.5;
const BRONSON_LON = -94.6;

// Historical data storage
let historicalData = {
    timestamps: [],
    temperatures: [],
    humidities: [],
    windSpeeds: [],
    rainfalls: []
};

async function fetchWeatherData() {
    try {
        const response = await fetch(
            `https://api.ambientweather.net/v1/devices/${MAC_ADDRESS}?apiKey=${API_KEY}&applicationKey=${APP_KEY}`
        );
        const data = await response.json();
        const latestWeather = data[0]; // Get latest observation
        
        // Store historical data
        storeHistoricalData(latestWeather);
        
        updateDashboard(latestWeather);
        updateWeatherChart();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function storeHistoricalData(weather) {
    const now = new Date();
    
    // Limit historical data to last 24 entries (roughly 2 hours if updating every 5 minutes)
    if (historicalData.timestamps.length >= 24) {
        historicalData.timestamps.shift();
        historicalData.temperatures.shift();
        historicalData.humidities.shift();
        historicalData.windSpeeds.shift();
        historicalData.rainfalls.shift();
    }
    
    historicalData.timestamps.push(now.toLocaleTimeString());
    historicalData.temperatures.push(weather.tempf);
    historicalData.humidities.push(weather.humidity);
    historicalData.windSpeeds.push(weather.windspeedmph);
    historicalData.rainfalls.push(weather.hourlyrainin);
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
    
    // Always use Bronson, Texas coordinates
    initRadar();
}

function initRadar() {
    const radarContainer = document.getElementById('radar-container');
    // Clear previous iframe
    radarContainer.innerHTML = '';
    
    // Create new iframe
    const iframe = document.createElement('iframe');
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.frameBorder = "0";
    iframe.src = `https://www.rainviewer.com/map.html?loc=${BRONSON_LAT},${BRONSON_LON},6&oFa=0&oC=0&oU=0&oCS=1&oF=0&oAP=1&c=1&o=83&lm=1&layer=radar&sm=1&sn=1`;
    iframe.onload = () => console.log('Radar loaded successfully');
    iframe.onerror = (e) => console.error('Radar loading error:', e);
    
    radarContainer.appendChild(iframe);
}

function updateWeatherChart() {
    const ctx = document.getElementById('weather-chart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: historicalData.timestamps,
            datasets: [
                {
                    label: 'Temperature (°F)',
                    data: historicalData.temperatures,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y',
                },
                {
                    label: 'Humidity (%)',
                    data: historicalData.humidities,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            stacked: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Temperature (°F)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Humidity (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                },
            }
        }
    });
}

// Initial load
fetchWeatherData();
// Update every 5 minutes
setInterval(fetchWeatherData, 300000);
