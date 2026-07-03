import { useState, useEffect } from 'react'

interface UseFetchOptions {
  signal?: AbortSignal
}

interface UseFetchResult<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Hook personalizado para fetching de datos desde una API
 * @param url - URL de la API
 * @param options - Opciones adicionales (signal para AbortController)
 * @returns {UseFetchResult} Objeto con data, loading y error
 */
export function useFetch<T>(url: string, options?: UseFetchOptions): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(url, { signal: options?.signal })
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const result = (await response.json()) as T
        setData(result)
      } catch (err) {
        if (err instanceof Error) {
          if (err.name !== 'AbortError') {
            setError(err.message)
          }
        } else {
          setError('Error desconocido')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url, options?.signal])

  return { data, loading, error }
}
