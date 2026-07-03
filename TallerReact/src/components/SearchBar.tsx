interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-box">
      <input
        type="search"
        value={value}
        placeholder="Busca un Digimon por nombre..."
        onChange={(event) => onChange(event.target.value)}
        aria-label="Buscar Digimon"
      />
    </div>
  )
}
