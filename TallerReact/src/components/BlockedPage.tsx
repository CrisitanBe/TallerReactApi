import type { Digimon } from '../App'

interface BlockedPageProps {
  items: Digimon[]
  onToggle: (item: Digimon) => void
}

export default function BlockedPage({ items, onToggle }: BlockedPageProps) {
  if (items.length === 0) {
    return <div className="status-message">No hay Digimon bloqueados.</div>
  }

  return (
    <div className="card-grid">
      {items.map((item) => (
        <article key={item.name} className="card">
          <img src={item.img} alt={item.name} />
          <div className="card-body">
            <h2 className="card-title">{item.name}</h2>
            <p className="card-meta">Nivel: {item.level}</p>
            <button className="block-btn active" onClick={() => onToggle(item)} aria-label={`Desbloquear ${item.name}`}>
              🔓
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
