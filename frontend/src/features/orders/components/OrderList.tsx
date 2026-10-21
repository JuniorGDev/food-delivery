import { Link } from 'react-router-dom'
import type { OrderResponse, OrderStatus } from '../../../types/api'
import { StatusBadge } from './StatusBadge'
import { statusLabels } from '../statusLabels'

type OrderListProps = {
  orders: OrderResponse[]
  total: number
  loading: boolean
  error: string
  query: string
  statusFilter: string
  onQueryChange: (value: string) => void
  onStatusChange: (value: string) => void
  statuses: readonly OrderStatus[]
}

export function OrderList({ orders, total, loading, error, query, statusFilter, onQueryChange, onStatusChange, statuses }: OrderListProps) {
  return (
    <section className="orders-section">
      <div className="section-heading">
        <div><p className="eyebrow">ACOMPANHAMENTO</p><h2>Todos os pedidos <span className="count-pill">{loading ? '—' : orders.length}</span></h2></div>
        <div className="table-controls">
          <label className="search-box"><span aria-hidden="true">⌕</span><input aria-label="Buscar pedido" value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Buscar pedido ou cliente" /></label>
          <select aria-label="Filtrar por status" value={statusFilter} onChange={(event) => onStatusChange(event.target.value)}><option value="TODOS">Todos os status</option>{statuses.map((status) => <option value={status} key={status}>{statusLabels[status]}</option>)}</select>
        </div>
      </div>
      {loading ? <div className="state-block"><span className="spinner" />Carregando pedidos…</div>
        : error ? <div className="state-block state-error"><span>!</span><div><strong>Não foi possível carregar os pedidos</strong><p>{error}</p><button className="text-button" onClick={() => window.location.reload()}>Tentar novamente ↗</button></div></div>
          : orders.length === 0 ? <div className="state-block state-empty"><span className="empty-symbol">○</span><strong>{total ? 'Nenhum pedido corresponde à busca.' : 'Nenhum pedido por aqui ainda.'}</strong><p>{total ? 'Altere os filtros e tente novamente.' : 'Quando um pedido for criado, ele aparecerá nesta lista.'}</p>{!total && <Link className="text-button" to="/orders/new">Criar primeiro pedido ↗</Link>}</div>
            : <div className="orders-table-wrap"><table className="orders-table"><thead><tr><th>PEDIDO</th><th>CLIENTE</th><th>ITENS</th><th>DESTINO</th><th>STATUS</th><th>HORÁRIO</th><th /></tr></thead><tbody>{orders.map((order) => <tr key={order.id}>
              <td><Link className="order-number" to={`/orders/${order.id}`}>#{String(order.id).padStart(4, '0')}</Link></td>
              <td><span className="customer-name">{order.customerName}</span><span className="customer-id">ID cliente {order.customerId}</span></td>
              <td><span className="item-count">{order.items.length} {order.items.length === 1 ? 'item' : 'itens'}</span><span className="item-preview">{order.items.map((item) => item.product).join(', ')}</span></td>
              <td><span className="destination">{order.address.city}, {order.address.state}</span><span className="customer-id">{order.address.neighborhood}</span></td>
              <td><StatusBadge status={order.status} /></td>
              <td className="time-cell">{new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(order.createdAt))}<span>{new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(order.createdAt)).replace('.', '')}</span></td>
              <td><Link className="row-arrow" to={`/orders/${order.id}`} aria-label={`Ver pedido ${order.id}`}>↗</Link></td>
            </tr>)}</tbody></table></div>}
      <div className="table-footnote"><span>EXIBINDO {loading ? '—' : orders.length} DE {loading ? '—' : total} PEDIDOS</span><span>DADOS ATUALIZADOS AO ABRIR A PÁGINA</span></div>
    </section>
  )
}
