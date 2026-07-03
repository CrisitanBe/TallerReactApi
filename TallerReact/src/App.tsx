import { useEffect, useMemo, useState } from 'react'
import SearchBar from './components/SearchBar'
import Sidebar from './components/Sidebar'
import FavoritesPage from './components/FavoritesPage'
import BlockedPage from './components/BlockedPage'

export interface Digimon {
  name: string
  img: string
  level: string
}

const API_URL = 'https://digimon-api.vercel.app/api/digimon'

export default function App() {
  const [digimon, setDigimon] = useState<Digimon[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState<'explore' | 'favorites' | 'blocked'>('explore')
  const [favorites, setFavorites] = useState<Digimon[]>(() => {
    try {
      const raw = localStorage.getItem('favorites')
      return raw ? (JSON.parse(raw) as Digimon[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    const controller = new AbortController()

    const loadDigimon = async () => {
      try {
        const response = await fetch(API_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = (await response.json()) as Digimon[]
        setDigimon(data)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('No se pudo cargar los Digimon desde la API pública.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadDigimon()
    return () => controller.abort()
  }, [])

  const filteredDigimon = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return digimon
    return digimon.filter((item) => item.name.toLowerCase().includes(term))
  }, [digimon, search])

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites))
    } catch {}
  }, [favorites])

  const toggleFavorite = (item: Digimon) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.name === item.name)
      if (exists) return prev.filter((p) => p.name !== item.name)
      return [...prev, item]
    })
  }

  const [blocked, setBlocked] = useState<Digimon[]>(() => {
    try {
      const raw = localStorage.getItem('blocked')
      return raw ? (JSON.parse(raw) as Digimon[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('blocked', JSON.stringify(blocked))
    } catch {}
  }, [blocked])

  const toggleBlocked = (item: Digimon) => {
    setBlocked((prev) => {
      const exists = prev.some((p) => p.name === item.name)
      if (exists) return prev.filter((p) => p.name !== item.name)
      return [...prev, item]
    })
    // si bloqueamos, quitar de favoritos
    setFavorites((prev) => prev.filter((p) => p.name !== item.name))
  }

  return (
    <div className="app layout-with-sidebar">
      <Sidebar current={page} onNavigate={setPage} />

      <main className="main">
        <section className="page-title">
          <h1>Digimon Explorer</h1>
        </section>

        <div className="controls">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        {loading && page === 'explore' ? (
          <div className="status-message">Cargando Digimon...</div>
        ) : error && page === 'explore' ? (
          <div className="status-message status-error">{error}</div>
        ) : page === 'favorites' ? (
          <FavoritesPage items={favorites} onToggle={toggleFavorite} loading={loading} error={error} />
        ) : page === 'blocked' ? (
          <BlockedPage items={blocked} onToggle={toggleBlocked} loading={loading} error={error} />
        ) : filteredDigimon.length === 0 ? (
          <div className="status-message">No se encontraron Digimon para "{search}".</div>
        ) : (
          <div className="card-grid">
            {filteredDigimon
              .filter((item) => !blocked.some((b) => b.name === item.name))
              .map((item) => {
                const isFav = favorites.some((f) => f.name === item.name)
                const isBlocked = blocked.some((b) => b.name === item.name)
                return (
                  <article key={item.name} className="card">
                    <img src={item.img} alt={item.name} />
                    <div className="card-body">
                      <h2 className="card-title">{item.name}</h2>
                      <p className="card-meta">Nivel: {item.level}</p>
                      <div className="card-buttons">
                        <button
                          className={"fav-btn" + (isFav ? ' active' : '')}
                          onClick={() => toggleFavorite(item)}
                          aria-label={`${isFav ? 'Quitar' : 'Agregar'} ${item.name} de favoritos`}
                        >
                          ♥
                        </button>
                        <button
                          className={"block-btn" + (isBlocked ? ' active' : '')}
                          onClick={() => toggleBlocked(item)}
                          aria-label={`${isBlocked ? 'Desbloquear' : 'Bloquear'} ${item.name}`}
                        >
                          {isBlocked ? '🔓' : '🔒'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
          </div>
        )}
      </main>
    </div>
  )
}
