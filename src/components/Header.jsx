// Updated Header.jsx
import { useState } from 'react';

export default function Header({ onSearch, suggestions, onSelectCity, scrollToCurrent, scrollToHourly, scrollToWeekly, scrollToFavorites, scrollToRecent, isDarkTheme, toggleTheme, currentCity, currentTemp }) {
  const [query, setQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
      setQuery('');
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="logo-section">
          <h1 onClick={scrollToCurrent} style={{ cursor: 'pointer' }}>Weather App 🌤️</h1>
          <div className="current-info">
            <span className="current-location">{currentCity} 📍</span>
            {currentTemp !== null && <span className="current-temp">{currentTemp}°C</span>}
          </div>
        </div>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <button onClick={scrollToCurrent}>Current</button>
          <button onClick={scrollToHourly}>Hourly</button>
          <button onClick={scrollToWeekly}>7-Day</button>
          <button onClick={scrollToFavorites}>Favorites ⭐</button>
          <button onClick={scrollToRecent}>Recent 🔍</button>
        </nav>

        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value, true);
            }}
            placeholder="Search city..."
            autoComplete="off"
          />
          <button type="submit">🔍</button>
          {suggestions.length > 0 && (
            <div className="suggestions">
              {suggestions.map((r, i) => (
                <div
                  key={i}
                  className="suggestion-item"
                  onClick={() => {
                    setQuery('');
                    onSelectCity(r.name);
                  }}
                >
                  {r.name}, {r.country_code}
                </div>
              ))}
            </div>
          )}
        </form>

        <button className="theme-toggle" onClick={toggleTheme}>
          {isDarkTheme ? '☀️' : '🌙'}
        </button>

        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          ☰
        </button>
      </div>
    </header>
  );
}