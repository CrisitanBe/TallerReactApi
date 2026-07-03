interface SidebarProps {
  current: 'explore' | 'favorites'
  onNavigate: (page: 'explore' | 'favorites') => void
}

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <button
            className={current === 'explore' ? 'active' : ''}
            onClick={() => onNavigate('explore')}
          >
            Explorar
          </button>
        </li>
        <li>
          <button
            className={current === 'favorites' ? 'active' : ''}
            onClick={() => onNavigate('favorites')}
          >
            Favoritos
          </button>
        </li>
      </ul>
    </nav>
  )
}
