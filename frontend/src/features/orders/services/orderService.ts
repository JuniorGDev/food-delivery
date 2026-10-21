import type { CreateOrderRequest, OrderResponse, OrderStatus } from '../../../types/api'
import { apiRequest } from '../../../lib/api'

export const orderService = {
  list(): Promise<OrderResponse[]> {
    return apiRequest('/orders')
  },

  get(id: string): Promise<OrderResponse> {
    return apiRequest(`/orders/${encodeURIComponent(id)}`)
  },

  create(request: CreateOrderRequest): Promise<OrderResponse> {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  },

  updateStatus(id: number, status: OrderStatus): Promise<OrderResponse> {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
}
