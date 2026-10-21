import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { apiMessage } from '../../../utils/apiMessage'

type AuthFormProps = { mode: 'login' | 'register' }

export function AuthForm({ mode }: AuthFormProps) {
  const registering = mode === 'register'
  const { setAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (registering && password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      if (registering) {
        await authService.register({ name: name.trim(), email: email.trim(), password })
        navigate('/login', { replace: true, state: { notice: 'Cadastro realizado. Entre com seu e-mail e senha.' } })
      } else {
        await authService.login({ email: email.trim(), password })
        setAuthenticated(true)
        navigate('/orders', { replace: true })
      }
    } catch (requestError) {
      setError(apiMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-layout">
      <aside className="auth-aside">
        <div className="aside-orbit orbit-one" />
        <div className="aside-orbit orbit-two" />
        <p className="eyebrow light-eyebrow">CENTRAL DE OPERAÇÕES · 01</p>
        <div className="aside-copy">
          <span className="aside-dash" />
          <h1>Todo pedido<br />tem seu ritmo.</h1>
          <p>Acompanhe cada etapa da cozinha até a porta.</p>
        </div>
        <div className="aside-bottom"><span>01 — 05</span><span className="aside-line" /><span>GESTÃO EM MOVIMENTO</span></div>
        <div className="decor-number">P.</div>
      </aside>
      <section className="auth-panel">
        <div className="auth-form-wrap">
          <p className="eyebrow">{registering ? 'NOVO ACESSO' : 'BEM-VINDO DE VOLTA'}</p>
          <h2>{registering ? 'Criar conta' : 'Entrar na operação'}</h2>
          <p className="form-intro">{registering ? 'Seus pedidos começam por aqui.' : 'Acesse para acompanhar os pedidos do dia.'}</p>
          {!registering && typeof location.state?.notice === 'string' && <p className="notice notice-success" role="status">{location.state.notice}</p>}
          <form className="form-stack" onSubmit={submit}>
            {registering && <label>Nome completo<input autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Ana Souza" /></label>}
            <label>E-mail<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="voce@email.com" /></label>
            <label>Senha<input type="password" autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 6 : 1} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder={registering ? 'Mínimo de 6 caracteres' : 'Sua senha'} /></label>
            {registering && <label>Confirmar senha<input type="password" autoComplete="new-password" required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repita sua senha" /></label>}
            {error && <p className="notice notice-error" role="alert">{error}</p>}
            <button className="button button-primary auth-submit" disabled={loading}>{loading ? 'Aguarde…' : registering ? 'Criar minha conta' : 'Entrar'}<span aria-hidden="true">↗</span></button>
          </form>
          <p className="auth-switch">{registering ? 'Já tem acesso?' : 'Primeira vez por aqui?'} <Link to={registering ? '/login' : '/register'}>{registering ? 'Entrar' : 'Criar conta'}</Link></p>
        </div>
        <div className="auth-side-note"><span>F·D</span><span>FOOD DELIVERY / 2026</span></div>
      </section>
    </main>
  )
}
