export default function HourlyForecast({ hourly, loading }) {
  if (loading) {
    return (
      <section id="hourly-forecast" className="card">
        <h2>Hourly Forecast</h2>
        <div className="forecast-container">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="forecast-item skeleton">
              <p className="skeleton" style={{ height: '1rem', width: '60%' }}></p>
              <p className="skeleton" style={{ height: '1.5rem', width: '70%' }}></p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="hourly-forecast" className="card">
      <h2>Hourly Forecast</h2>
      <div className="forecast-container">
        {hourly.time?.slice(0, 24).map((time, i) => (
          <div key={i} className="forecast-item">
            <p><strong>{new Date(time).toLocaleTimeString([], { hour: '2-digit' })}</strong></p>
            <p>{Math.round(hourly.temperature_2m[i])}°C</p>
            <p>{hourly.weatherDesc?.[i] || 'Weather'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}