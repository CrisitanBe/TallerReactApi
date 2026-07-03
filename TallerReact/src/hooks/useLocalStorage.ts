import { useState } from 'react'

/**
 * Hook personalizado para manejar persistencia en localStorage
 * @param key - Clave del localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns [valor, setValue, isLoading, error]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean, string | null] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch (err) {
      console.error(`Error al leer localStorage[${key}]:`, err)
      return initialValue
    }
  })

  const [isLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido'
      setError(`No se pudo guardar en localStorage: ${message}`)
      console.error(`Error al escribir en localStorage[${key}]:`, err)
    }
  }

  return [storedValue, setValue, isLoading, error]
}
