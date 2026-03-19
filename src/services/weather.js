import axios from 'axios';

const WEATHER_CACHE_KEY = 'farmflux_weather_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getCached(key) {
    try {
        const cache = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || '{}');
        const entry = cache[key];
        if (entry && Date.now() - entry.timestamp < CACHE_DURATION) return entry.data;
        return null;
    } catch { return null; }
}

function setCache(key, data) {
    try {
        const cache = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || '{}');
        cache[key] = { data, timestamp: Date.now() };
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cache));
    } catch { /* storage full */ }
}

export async function getWeather(location = 'auto') {
    const cacheKey = `weather_${location}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    try {
        const loc = location === 'auto' ? '' : location;
        const { data } = await axios.get(`https://wttr.in/${loc}?format=j1`, {
            timeout: 10000,
        });

        const current = data.current_condition?.[0] || {};
        const forecast = data.weather || [];

        const result = {
            current: {
                temp: parseInt(current.temp_C) || 25,
                feelsLike: parseInt(current.FeelsLikeC) || 25,
                humidity: parseInt(current.humidity) || 60,
                windSpeed: parseInt(current.windspeedKmph) || 10,
                description: current.weatherDesc?.[0]?.value || 'Clear',
                icon: mapWeatherIcon(current.weatherCode),
                precipitation: parseFloat(current.precipMM) || 0,
                uvIndex: parseInt(current.uvIndex) || 5,
                visibility: parseInt(current.visibility) || 10,
                pressure: parseInt(current.pressure) || 1013,
            },
            forecast: forecast.slice(0, 7).map(day => ({
                date: day.date,
                maxTemp: parseInt(day.maxtempC) || 30,
                minTemp: parseInt(day.mintempC) || 20,
                description: day.hourly?.[4]?.weatherDesc?.[0]?.value || 'Clear',
                icon: mapWeatherIcon(day.hourly?.[4]?.weatherCode),
                precipitation: parseFloat(day.hourly?.[4]?.precipMM) || 0,
                humidity: parseInt(day.hourly?.[4]?.humidity) || 60,
            })),
            location: data.nearest_area?.[0]?.areaName?.[0]?.value || location,
        };

        setCache(cacheKey, result);
        return result;
    } catch (err) {
        const cached2 = getCached(cacheKey);
        if (cached2) return cached2;
        return {
            current: { temp: 28, feelsLike: 30, humidity: 65, windSpeed: 12, description: 'Partly Cloudy', icon: '⛅', precipitation: 0, uvIndex: 6, visibility: 10, pressure: 1013 },
            forecast: Array.from({ length: 7 }, (_, i) => ({
                date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
                maxTemp: 32, minTemp: 22, description: 'Clear', icon: '☀️', precipitation: 0, humidity: 60,
            })),
            location: location === 'auto' ? 'Your Location' : location,
        };
    }
}

function mapWeatherIcon(code) {
    const c = parseInt(code) || 0;
    if (c === 113) return '☀️';
    if (c === 116) return '⛅';
    if (c === 119 || c === 122) return '☁️';
    if ([176, 263, 266, 293, 296, 299, 302, 305, 308, 311, 314, 317, 353, 356, 359].includes(c)) return '🌧️';
    if ([179, 182, 185, 227, 230, 320, 323, 326, 329, 332, 335, 338, 350, 362, 365, 368, 371, 374, 377, 392, 395].includes(c)) return '❄️';
    if ([200, 386, 389].includes(c)) return '⛈️';
    if (c === 143 || c === 248 || c === 260) return '🌫️';
    return '🌤️';
}

export async function getUserLocation() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) { resolve('Delhi'); return; }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { data } = await axios.get(`https://wttr.in/${pos.coords.latitude},${pos.coords.longitude}?format=j1`, { timeout: 5000 });
                    resolve(data.nearest_area?.[0]?.areaName?.[0]?.value || 'Delhi');
                } catch { resolve('Delhi'); }
            },
            () => resolve('Delhi'),
            { timeout: 5000 }
        );
    });
}
