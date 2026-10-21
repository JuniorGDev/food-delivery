import { useEffect, useState } from 'react'
import { orderService } from '../services/orderService'
import type { OrderResponse } from '../../../types/api'
import { apiMessage } from '../../../utils/apiMessage'

export function useOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    orderService.list()
      .then(setOrders)
      .catch((requestError) => setError(apiMessage(requestError)))
      .finally(() => setLoading(false))
  }, [])

  return { orders, loading, error }
}
