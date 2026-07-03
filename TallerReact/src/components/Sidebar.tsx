interface SidebarProps {
  current: 'explore' | 'favorites' | 'blocked'
  onNavigate: (page: 'explore' | 'favorites' | 'blocked') => void
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
        <li>
          <button
            className={current === 'blocked' ? 'active' : ''}
            onClick={() => onNavigate('blocked')}
          >
            Bloqueados
          </button>
        </li>
      </ul>
    </nav>
  )
}
