import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest, tokenKey } from './api'

describe('apiRequest', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('envia o token bearer e retorna o JSON da API', async () => {
    sessionStorage.setItem(tokenKey, 'jwt-teste')
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify([{ id: 7 }]), { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiRequest<Array<{ id: number }>>('/orders')).resolves.toEqual([{ id: 7 }])
    expect(fetchMock.mock.calls[0][1].headers.get('Authorization')).toBe('Bearer jwt-teste')
  })

  it('limpa a sessão, notifica a aplicação e lança erro estruturado no 401', async () => {
    sessionStorage.setItem(tokenKey, 'expirado')
    const unauthorized = vi.fn()
    window.addEventListener('auth:unauthorized', unauthorized)
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 401, message: 'Autenticação necessária' }), { status: 401 })))

    await expect(apiRequest('/orders')).rejects.toMatchObject({ status: 401, message: 'Autenticação necessária' })
    expect(sessionStorage.getItem(tokenKey)).toBeNull()
    expect(unauthorized).toHaveBeenCalledOnce()
    window.removeEventListener('auth:unauthorized', unauthorized)
  })
})
