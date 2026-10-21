import { ApiError } from '../lib/api'

export function apiMessage(error: unknown): string {
  if (error instanceof ApiError) {
    const fieldMessages = error.fields ? Object.values(error.fields).join(' ') : ''
    return fieldMessages || error.message
  }
  return 'Não foi possível conectar à API. Verifique se o backend está ativo e tente novamente.'
}
