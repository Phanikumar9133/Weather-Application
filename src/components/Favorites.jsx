export default function Favorites({ favorites, onCityClick }) {
  return (
    <section className="card list-card">
      <h2>Favorites</h2>
      <div className="city-table">
        {favorites.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', opacity: 0.7 }}>
            No favorites yet ⭐
          </p>
        ) : (
          favorites.map((city, i) => (
            <div key={i} className="city-item" onClick={() => onCityClick(city.split(',')[0].trim())}>
              {city}
            </div>
          ))
        )}
      </div>
    </section>
  );
}