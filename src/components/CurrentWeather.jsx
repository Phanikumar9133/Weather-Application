export default function CurrentWeather({ weather, loading, onFavorite, animationRef }) {
  if (loading) {
    return (
      <section id="current-weather" className="card">
        <div className="skeleton" style={{ height: '3rem', width: '80%' }}></div>
        <div className="skeleton" style={{ height: '9rem', width: '70%', margin: '1rem 0' }}></div>
        <div className="skeleton" style={{ height: '2.5rem', width: '60%' }}></div>
      </section>
    );
  }

  if (!weather) return null;

  return (
    <section id="current-weather" className="card">
      <div className="animation-layer" ref={animationRef}></div>
      <div id="location">{weather.name}</div>
      <div id="temp">{weather.temp}°C</div>
      <div id="description">{weather.description}</div>
      <div id="details-grid">
        <div className="detail-item"><div className="detail-label">Feels Like</div><div className="detail-value">{weather.feels_like}°C</div></div>
        <div className="detail-item"><div className="detail-label">Humidity</div><div className="detail-value">{weather.humidity}%</div></div>
        <div className="detail-item"><div className="detail-label">Wind Speed</div><div className="detail-value">{weather.wind} km/h</div></div>
        <div className="detail-item"><div className="detail-label">Pressure</div><div className="detail-value">{weather.pressure} hPa</div></div>
        <div className="detail-item"><div className="detail-label">UV Index</div><div className="detail-value">{weather.uv}</div></div>
        <div className="detail-item"><div className="detail-label">Visibility</div><div className="detail-value">{weather.visibility} km</div></div>
      </div>
      <div id="sunrise-sunset">{weather.sunrise_sunset}</div>
      <button className="fav-btn" onClick={() => onFavorite(weather.name)}>⭐ Add to Favorites</button>
    </section>
  );
}