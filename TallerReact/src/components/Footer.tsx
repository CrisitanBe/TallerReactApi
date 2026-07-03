export default function Footer() {
  const members = ['Cristián Berrios', 'Elian Tapia', 'Sebastián Brito']

  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-text">Desarrollado por:</p>
        <ul className="members-list">
          {members.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
