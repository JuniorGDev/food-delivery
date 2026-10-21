import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OrderForm } from '../components/OrderForm'
import { orderService } from '../services/orderService'
import { apiMessage } from '../../../utils/apiMessage'
import type { AddressRequest, CreateOrderRequest, OrderItemRequest } from '../../../types/api'

const emptyAddress: AddressRequest = { street: '', number: '', complement: '', neighborhood: '', city: '', state: '', zipCode: '' }
const emptyItem: OrderItemRequest = { product: '', quantity: 1, price: 0 }

export function CreateOrderPage() {
  const navigate = useNavigate()
  const [address, setAddress] = useState<AddressRequest>(emptyAddress)
  const [items, setItems] = useState<OrderItemRequest[]>([{ ...emptyItem }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function updateAddress(field: keyof AddressRequest, value: string) {
    setAddress((current) => ({ ...current, [field]: value }))
  }

  function updateItem(index: number, field: keyof OrderItemRequest, value: string) {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: field === 'product' ? value : Number(value) } : item))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    const request: CreateOrderRequest = { address, items }
    try {
      const order = await orderService.create(request)
      navigate(`/orders/${order.id}`, { replace: true })
    } catch (requestError) {
      setError(apiMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return <main className="page-content form-page"><Link className="back-link" to="/orders">← Todos os pedidos</Link><div className="detail-heading"><div><p className="eyebrow">PEDIDOS / NOVO</p><h1>Um novo <span>começo.</span></h1><p className="page-subtitle">Informe o endereço e os itens. O cliente será associado à sua conta.</p></div><span className="form-step">01 <i /> 03</span></div>
    <OrderForm address={address} items={items} loading={loading} error={error} onAddressChange={updateAddress} onItemChange={updateItem} onAddItem={() => setItems((current) => [...current, { ...emptyItem }])} onRemoveItem={(index) => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} onSubmit={submit} onCancel={() => navigate('/orders')} />
  </main>
}
