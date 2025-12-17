export default function RecentSearches({ history, onCityClick }) {
  return (
    <section className="card list-card">
      <h2>Recent Searches</h2>
      <div className="city-table">
        {history.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.7 }}>
            No recent searches
          </p>
        ) : (
          history.map((city, i) => (
            <div key={i} className="city-item" onClick={() => onCityClick(city.split(',')[0].trim())}>
              {city}
            </div>
          ))
        )}
      </div>
    </section>
  );
}