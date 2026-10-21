import { useState } from 'react'
import { Link } from 'react-router-dom'
import { OrderList } from '../components/OrderList'
import { orderStatuses } from '../statusLabels'
import { useOrders } from '../hooks/useOrders'

const today = (() => {
  const now = new Date()
  return {
    date: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(now).replace('.', ''),
    weekday: new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(now),
  }
})()

export function OrdersPage() {
  const { orders, loading, error } = useOrders()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('TODOS')
  const visibleOrders = orders.filter((order) => `${order.id} ${order.customerName} ${order.address.city}`.toLowerCase().includes(query.toLowerCase()) && (statusFilter === 'TODOS' || order.status === statusFilter))
  const activeCount = orders.filter((order) => !['ENTREGUE', 'CANCELADO'].includes(order.status)).length

  return (
    <main className="page-content">
      <div className="page-heading">
        <div><p className="eyebrow">PAINEL / VISÃO GERAL</p><h1>Pedidos <span>em movimento.</span></h1><p className="page-subtitle">Uma visão clara do que está acontecendo agora.</p></div>
        <Link className="button button-primary create-link" to="/orders/new"><span aria-hidden="true">＋</span> Novo pedido</Link>
      </div>
      <section className="metrics-row" aria-label="Resumo dos pedidos">
        <div className="metric"><span className="metric-label">TOTAL DE PEDIDOS</span><strong>{loading ? '—' : String(orders.length).padStart(2, '0')}</strong><span className="metric-note">na lista</span></div>
        <div className="metric metric-active"><span className="metric-label">EM ANDAMENTO</span><strong>{loading ? '—' : String(activeCount).padStart(2, '0')}</strong><span className="metric-note"><i /> pedidos ativos</span></div>
        <div className="metric metric-date"><span className="metric-label">HOJE</span><strong>{today.date}</strong><span className="metric-note">{today.weekday}</span></div>
      </section>
      <OrderList orders={visibleOrders} total={orders.length} loading={loading} error={error} query={query} statusFilter={statusFilter} onQueryChange={setQuery} onStatusChange={setStatusFilter} statuses={orderStatuses} />
    </main>
  )
}
