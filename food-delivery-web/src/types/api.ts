export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
}

export interface AddressRequest {
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
}

export interface OrderItemRequest {
  product: string
  quantity: number
  price: number
}

export interface CreateOrderRequest {
  address: AddressRequest
  items: OrderItemRequest[]
}

export interface AddressResponse extends AddressRequest {
  id: number
}

export interface OrderItemResponse extends OrderItemRequest {
  id: number
}

export const orderStatuses = [
  'RECEBIDO',
  'EM_PREPARO',
  'SAIU_PARA_ENTREGA',
  'ENTREGUE',
  'CANCELADO',
] as const

export type OrderStatus = (typeof orderStatuses)[number]

export interface OrderResponse {
  id: number
  customerId: number
  customerName: string
  items: OrderItemResponse[]
  address: AddressResponse
  status: OrderStatus
  createdAt: string
}

export interface ApiErrorBody {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
  fields?: Record<string, string>
}