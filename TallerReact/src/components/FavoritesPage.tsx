import type { Digimon } from '../App'

interface FavoritesPageProps {
  items: Digimon[]
  onToggle: (item: Digimon) => void
  loading?: boolean
  error?: string | null
}

export default function FavoritesPage({
  items,
  onToggle,
  loading = false,
  error = null,
}: FavoritesPageProps) {
  if (loading) {
    return (
      <div className="status-message">
        <div className="spinner">Cargando favoritos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="status-message status-error">
        <strong>⚠️ Error</strong>
        <p>{error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return <div className="status-message">❤️ No hay favoritos aún. Agrega algunos desde la exploración.</div>
  }

  return (
    <div className="card-grid">
      {items.map((item) => (
        <article key={item.name} className="card">
          <img src={item.img} alt={item.name} />
          <div className="card-body">
            <h2 className="card-title">{item.name}</h2>
            <p className="card-meta">Nivel: {item.level}</p>
            <button
              className="fav-btn active"
              onClick={() => onToggle(item)}
              aria-label={`Quitar ${item.name} de favoritos`}
            >
              ♥
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
