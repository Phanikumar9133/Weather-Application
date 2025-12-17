// Updated App.jsx
import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import CurrentWeather from './components/CurrentWeather';
import HourlyForecast from './components/HourlyForecast';
import WeeklyForecast from './components/WeeklyForecast';
import Favorites from './components/Favorites';
import RecentSearches from './components/RecentSearches';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState({});
  const [weekly, setWeekly] = useState({});
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('weather_favorites') || '[]'));
  const [history, setHistory] = useState(JSON.parse(localStorage.getItem('weather_history') || '[]'));
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [currentCity, setCurrentCity] = useState('Vijayawada');
  const [currentTemp, setCurrentTemp] = useState(null); // New: for navbar temp display
  const animationRef = useRef(null);
  const currentRef = useRef(null);
  const hourlyRef = useRef(null);
  const weeklyRef = useRef(null);
  const favoritesRef = useRef(null);
  const recentRef = useRef(null);

  useEffect(() => {
    fetchWeather('Vijayawada');
    const savedTheme = localStorage.getItem('weather_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkTheme(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
    localStorage.setItem('weather_theme', newTheme ? 'dark' : 'light');
  };

  const wmoCodeToDesc = (code) => {
    const map = {
      0: 'Clear sky ☀️', 1: 'Mainly clear 🌤️', 2: 'Partly cloudy ⛅', 3: 'Overcast ☁️',
      45: 'Fog 🌫️', 48: 'Fog 🌫️', 51: 'Light drizzle 🌧️', 61: 'Light rain 🌦️', 63: 'Rain 🌧️', 65: 'Heavy rain ⛈️',
      71: 'Light snow ❄️', 73: 'Snow 🌨️', 75: 'Heavy snow ❄️', 80: 'Rain showers 🌦️', 95: 'Thunderstorm ⚡'
    };
    return map[code] || 'Weather ❓';
  };

  const updateAnimations = (code) => {
    if (!animationRef.current) return;
    animationRef.current.innerHTML = '';
    // (same animations code as before)
    if ([61, 63, 65, 80, 81, 82, 95].includes(code)) {
      for (let i = 0; i < 50; i++) {
        const drop = document.createElement('div');
        drop.className = 'rain-drop';
        drop.style.left = `${Math.random() * 100}%`;
        drop.style.animationDelay = `${Math.random() * 1.2}s`;
        drop.style.animationDuration = `${0.5 + Math.random() * 0.5}s`;
        animationRef.current.appendChild(drop);
      }
    } else if ([71, 73, 75].includes(code)) {
      for (let i = 0; i < 45; i++) {
        const flake = document.createElement('div');
        flake.className = 'snow-flake';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDelay = `${Math.random() * 6}s`;
        flake.style.animationDuration = `${5 + Math.random() * 5}s`;
        animationRef.current.appendChild(flake);
      }
    } else if (code === 0) {
      const sun = document.createElement('div');
      sun.className = 'sun-glow pulse';
      animationRef.current.appendChild(sun);
    } else if (code <= 3) {
      for (let i = 0; i < 6; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud drift';
        cloud.style.top = `${Math.random() * 50}%`;
        cloud.style.animationDelay = `${Math.random() * 12}s`;
        cloud.style.animationDuration = `${20 + Math.random() * 10}s`;
        animationRef.current.appendChild(cloud);
      }
    }
  };

  const fetchWeather = async (query, isSuggestion = false) => {
    if (isSuggestion) {
      if (query.length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en`);
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch {
        setSuggestions([]);
      }
      return;
    }

    setLoading(true);
    setError('');
    setSuggestions([]);
    try {
      const resGeo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en`);
      const geoData = await resGeo.json();
      if (!geoData.results?.length) throw new Error('City not found');
      const { latitude: lat, longitude: lon } = geoData.results[0];
      const fullName = `${geoData.results[0].name}, ${geoData.results[0].country_code}`;
      const cityOnly = geoData.results[0].name;
      setCurrentCity(cityOnly);

      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m,pressure_msl,visibility,is_day',
        hourly: 'temperature_2m,weather_code',
        daily: 'temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset,uv_index_max',
        timezone: 'auto',
        forecast_days: 7
      });

      const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
      if (!res.ok) throw new Error('Weather data unavailable');
      const data = await res.json();

      const currentTempRounded = Math.round(data.current.temperature_2m);
      setCurrentTemp(currentTempRounded); // Update temp for navbar

      const desc = wmoCodeToDesc(data.current.weather_code);

      const hourlyDesc = data.hourly.weather_code.map(wmoCodeToDesc);
      const weeklyDesc = data.daily.weather_code.map(wmoCodeToDesc);

      setWeather({
        name: fullName,
        temp: currentTempRounded,
        description: desc,
        feels_like: Math.round(data.current.apparent_temperature),
        humidity: data.current.relative_humidity_2m,
        wind: Math.round(data.current.wind_speed_10m),
        pressure: Math.round(data.current.pressure_msl),
        visibility: (data.current.visibility / 1000).toFixed(1),
        uv: data.daily.uv_index_max[0].toFixed(1),
        sunrise_sunset: `🌅 Sunrise ${new Date(data.daily.sunrise[0]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})} • 🌇 Sunset ${new Date(data.daily.sunset[0]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`
      });

      setHourly({ ...data.hourly, weatherDesc: hourlyDesc });
      setWeekly({ ...data.daily, weatherDesc: weeklyDesc });

      updateAnimations(data.current.weather_code);
      addToHistory(fullName);
    } catch (err) {
      setError(err.message || 'Failed to load weather');
    } finally {
      setLoading(false);
    }
  };

  const addToHistory = (city) => {
    const newHistory = history.filter(c => c !== city);
    newHistory.unshift(city);
    const updated = newHistory.slice(0, 12);
    setHistory(updated);
    localStorage.setItem('weather_history', JSON.stringify(updated));
  };

  const addFavorite = (city) => {
    if (!favorites.includes(city)) {
      const newFavs = [city, ...favorites];
      setFavorites(newFavs);
      localStorage.setItem('weather_favorites', JSON.stringify(newFavs));
    }
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header 
        onSearch={fetchWeather} 
        suggestions={suggestions} 
        onSelectCity={(name) => fetchWeather(name)}
        scrollToCurrent={() => scrollToSection(currentRef)}
        scrollToHourly={() => scrollToSection(hourlyRef)}
        scrollToWeekly={() => scrollToSection(weeklyRef)}
        scrollToFavorites={() => scrollToSection(favoritesRef)}
        scrollToRecent={() => scrollToSection(recentRef)}
        isDarkTheme={isDarkTheme}
        toggleTheme={toggleTheme}
        currentCity={currentCity}
        currentTemp={currentTemp}
      />
      <main className="main-content">
        <div ref={currentRef}><CurrentWeather weather={weather} loading={loading} onFavorite={addFavorite} animationRef={animationRef} /></div>
        <div ref={hourlyRef}><HourlyForecast hourly={hourly} loading={loading} /></div>
        <div ref={weeklyRef}><WeeklyForecast weekly={weekly} loading={loading} /></div>
        <div ref={favoritesRef}><Favorites favorites={favorites} onCityClick={(name) => fetchWeather(name)} /></div>
        <div ref={recentRef}><RecentSearches history={history} onCityClick={(name) => fetchWeather(name)} /></div>
      </main>
      {error && <p id="error-message">{error}</p>}
      <footer className="footer">
        <p>© 2025 Weather App | Powered by Open-Meteo API</p>
      </footer>
    </>
  );
}

export default App;