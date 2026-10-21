import { useEffect, useState } from 'react'
import { orderService } from '../services/orderService'
import type { OrderResponse, OrderStatus } from '../../../types/api'
import { apiMessage } from '../../../utils/apiMessage'

export function useOrder(id: string) {
  const [order, setOrder] = useState<OrderResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    orderService.get(id)
      .then(setOrder)
      .catch((requestError) => setError(apiMessage(requestError)))
      .finally(() => setLoading(false))
  }, [id])

  async function updateStatus(status: OrderStatus) {
    if (!order) return
    setSaving(true)
    setNotice('')
    try {
      setOrder(await orderService.updateStatus(order.id, status))
      setNotice('Status atualizado.')
    } catch (requestError) {
      setNotice(apiMessage(requestError))
    } finally {
      setSaving(false)
    }
  }

  return { order, loading, error, saving, notice, updateStatus }
}
