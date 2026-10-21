import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { authService } from '../../features/auth/services/authService'

export function AppLayout({ children }: { children: ReactNode }) {
  const { authenticated, setAuthenticated } = useAuth()
  const navigate = useNavigate()

  function logout() {
    authService.logout()
    setAuthenticated(false)
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to={authenticated ? '/orders' : '/login'} aria-label="Food Delivery, início">
          <span className="brand-mark">FD</span><span>Food<span className="brand-light">D</span>elivery</span>
        </Link>
        {authenticated && <nav className="topnav"><Link to="/orders">Pedidos</Link><span className="nav-divider" /><button className="logout-button" onClick={logout} title="Sair da conta"><span aria-hidden="true">↗</span> Sair</button></nav>}
      </header>
      {children}
      <footer className="footer"><span>FOOD DELIVERY</span><span>Operação de pedidos</span></footer>
    </div>
  )
}
