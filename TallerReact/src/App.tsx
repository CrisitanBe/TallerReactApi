import { useEffect, useMemo, useState } from 'react'
import SearchBar from './components/SearchBar'

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

  return (
    <div className="app">
      <section className="page-title">
        <h1>Digimon Explorer</h1>
      </section>

      <div className="controls">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {loading ? (
        <div className="status-message">Cargando Digimon...</div>
      ) : error ? (
        <div className="status-message status-error">{error}</div>
      ) : filteredDigimon.length === 0 ? (
        <div className="status-message">No se encontraron Digimon para "{search}".</div>
      ) : (
        <div className="card-grid">
          {filteredDigimon.map((item) => (
            <article key={item.name} className="card">
              <img src={item.img} alt={item.name} />
              <div className="card-body">
                <h2 className="card-title">{item.name}</h2>
                <p className="card-meta">Nivel: {item.level}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
