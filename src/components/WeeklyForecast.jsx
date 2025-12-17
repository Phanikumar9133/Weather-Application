export default function WeeklyForecast({ weekly, loading }) {
  if (loading) {
    return (
      <section id="weekly-forecast" className="card">
        <h2>7-Day Forecast</h2>
        <div className="forecast-container">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="forecast-item skeleton">
              <p className="skeleton" style={{ height: '1rem', width: '50%' }}></p>
              <p className="skeleton" style={{ height: '1.5rem', width: '70%' }}></p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="weekly-forecast" className="card">
      <h2>7-Day Forecast</h2>
      <div className="forecast-container">
        {weekly.time?.map((time, i) => (
          <div key={i} className="forecast-item">
            <p><strong>{new Date(time).toLocaleDateString([], { weekday: 'short' })}</strong></p>
            <p>{Math.round(weekly.temperature_2m_max[i])}° / {Math.round(weekly.temperature_2m_min[i])}°C</p>
            <p>{weekly.weatherDesc?.[i] || 'Weather'}</p>
          </div>
        ))}
      </div>
    </section>
  );
}