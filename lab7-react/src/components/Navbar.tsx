import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header>
      <div className="logo">API</div>
      <nav>
        <NavLink to="/jokes" className={({ isActive }) => isActive ? 'active' : ''}>Шутки</NavLink>
        <NavLink to="/weather" className={({ isActive }) => isActive ? 'active' : ''}>Погода</NavLink>
        <NavLink to="/currency" className={({ isActive }) => isActive ? 'active' : ''}>Валюта</NavLink>
        <NavLink to="/books" className={({ isActive }) => isActive ? 'active' : ''}>Книги</NavLink>
        <NavLink to="/dogs" className={({ isActive }) => isActive ? 'active' : ''}>Собаки</NavLink>
        <NavLink to="/threads" className={({ isActive }) => isActive ? 'active' : ''}>Обсуждения</NavLink>
      </nav>
    </header>
  )
}