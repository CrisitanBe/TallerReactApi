import { useEffect, useMemo, useState } from 'react'

interface Digimon {
  name: string
  img: string
  level: string
}

export default function App() {
  const [digimon, setDigimon] = useState<Digimon[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const loadDigimon = async () => {
      try {
        const response = await fetch('https://digimon-api.vercel.app/api/digimon', {
          signal: controller.signal,
        })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }
        const data = (await response.json()) as Digimon[]
        setDigimon(data)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('No se pudo cargar los Digimon desde la API.')
        }
      } finally {
        setLoading(false)
      }
    }

    loadDigimon()
    return () => controller.abort()
  }, [])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return digimon
    return digimon.filter((item) => item.name.toLowerCase().includes(term))
  }, [digimon, search])

  return (
    <div className="app">
      <header>
        <h1>Listado de Digimon</h1>
        <p>Imágenes y datos cargados desde la API de Digimon en Vite.</p>
      </header>

      <div className="controls">
        <input
          type="search"
          placeholder="Buscar Digimon por nombre..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Cargando Digimon...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="empty">No se encontraron Digimon para "{search}".</div>
      ) : (
        <div className="grid">
          {filtered.map((item) => (
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
