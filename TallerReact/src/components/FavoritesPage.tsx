import type { Digimon } from '../App'

interface FavoritesPageProps {
  items: Digimon[]
  onToggle: (item: Digimon) => void
}

export default function FavoritesPage({ items, onToggle }: FavoritesPageProps) {
  if (items.length === 0) {
    return <div className="status-message">No hay favoritos aún.</div>
  }

  return (
    <div className="card-grid">
      {items.map((item) => (
        <article key={item.name} className="card">
          <img src={item.img} alt={item.name} />
          <div className="card-body">
            <h2 className="card-title">{item.name}</h2>
            <p className="card-meta">Nivel: {item.level}</p>
            <button className="fav-btn active" onClick={() => onToggle(item)} aria-label={`Quitar ${item.name} de favoritos`}>
              ♥
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
