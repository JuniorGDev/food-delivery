import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { tokenKey } from '../lib/api'

vi.mock('../features/orders/services/orderService', () => ({
  orderService: { list: vi.fn(), get: vi.fn(), create: vi.fn(), updateStatus: vi.fn() },
}))
vi.mock('../features/auth/services/authService', () => ({
  authService: {
    login: vi.fn(), register: vi.fn(), logout: vi.fn(() => sessionStorage.removeItem(tokenKey)),
    getToken: vi.fn(() => sessionStorage.getItem(tokenKey)),
    isAuthenticated: vi.fn(() => Boolean(sessionStorage.getItem(tokenKey))),
  },
}))

describe('rotas e formulário de autenticação', () => {
  beforeEach(() => {
    sessionStorage.clear()
    window.history.replaceState({}, '', '/')
  })

  it('redireciona a rota de pedidos para login sem autenticação', async () => {
    window.history.replaceState({}, '', '/orders')
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Entrar na operação' })).toBeInTheDocument()
  })

  it('não envia cadastro quando as senhas não coincidem', async () => {
    window.history.replaceState({}, '', '/register')
    render(<App />)
    fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: 'Ana Souza' } })
    fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'ana@example.com' } })
    fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'senha-segura' } })
    fireEvent.change(screen.getByLabelText('Confirmar senha'), { target: { value: 'outra-senha' } })
    fireEvent.click(screen.getByRole('button', { name: /Criar minha conta/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('As senhas não coincidem.')
    const { authService } = await import('../features/auth/services/authService')
    expect(authService.register).not.toHaveBeenCalled()
  })
})
