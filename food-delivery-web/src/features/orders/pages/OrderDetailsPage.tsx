import { Link, useNavigate, useParams } from 'react-router-dom'
import { useOrder } from '../hooks/useOrder'
import { StatusBadge } from '../components/StatusBadge'
import { statusLabels } from '../statusLabels'
import type { OrderStatus } from '../../../types/api'

const nextStatuses: Partial<Record<OrderStatus, OrderStatus[]>> = {
  RECEBIDO: ['EM_PREPARO', 'CANCELADO'],
  EM_PREPARO: ['SAIU_PARA_ENTREGA', 'CANCELADO'],
  SAIU_PARA_ENTREGA: ['ENTREGUE'],
}

export function OrderDetailsPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { order, loading, error, saving, notice, updateStatus } = useOrder(id)
  const total = order?.items.reduce((sum, item) => sum + item.price * item.quantity, 0) ?? 0

  async function requestStatus(status: OrderStatus) {
    if (status === 'CANCELADO' && !window.confirm('Deseja cancelar este pedido?')) return
    await updateStatus(status)
  }

  return <main className="page-content detail-page"><Link className="back-link" to="/orders">← Todos os pedidos</Link>{loading ? <div className="state-block"><span className="spinner" />Carregando pedido…</div> : error || !order ? <div className="state-block state-error"><strong>Não foi possível abrir este pedido.</strong><p>{error}</p><button className="text-button" onClick={() => navigate('/orders')}>Voltar para a lista ↗</button></div> : <>
    <div className="detail-heading"><div><p className="eyebrow">PEDIDO / DETALHES</p><h1>Pedido <span>#{String(order.id).padStart(4, '0')}</span></h1><p className="page-subtitle">Criado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(order.createdAt))}</p></div><StatusBadge status={order.status} /></div>
    {notice && <p className={`notice ${notice === 'Status atualizado.' ? 'notice-success' : 'notice-error'}`} role="status">{notice}</p>}
    <div className="detail-grid"><section className="detail-main"><div className="detail-block"><div className="block-heading"><span className="block-index">01</span><h2>Itens do pedido</h2></div><div className="detail-items">{order.items.map((item) => <div className="detail-item" key={item.id}><span className="quantity-box">{String(item.quantity).padStart(2, '0')}×</span><span className="detail-product">{item.product}</span><span className="detail-price">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price * item.quantity)}</span></div>)}</div><div className="order-total"><span>Total dos itens</span><strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</strong></div></div>
      <div className="detail-block"><div className="block-heading"><span className="block-index">02</span><h2>Endereço de entrega</h2></div><address className="address-card"><strong>{order.address.street}, {order.address.number}</strong>{order.address.complement && <span>{order.address.complement}</span>}<span>{order.address.neighborhood}</span><span>{order.address.city} · {order.address.state}</span><span>CEP {order.address.zipCode}</span></address></div></section>
      <aside className="detail-aside"><div className="customer-card"><span className="eyebrow">CLIENTE</span><span className="customer-avatar">{order.customerName.charAt(0).toUpperCase()}</span><strong>{order.customerName}</strong><span>Cliente #{order.customerId}</span></div>
        <div className="status-card"><span className="eyebrow">ATUALIZAR ETAPA</span><div className="status-timeline">{(['RECEBIDO', 'EM_PREPARO', 'SAIU_PARA_ENTREGA', 'ENTREGUE'] as const).map((status, index) => <div className={`timeline-step ${order.status === status ? 'current' : ''} ${['RECEBIDO', 'EM_PREPARO', 'SAIU_PARA_ENTREGA', 'ENTREGUE'].indexOf(order.status) > index && order.status !== 'CANCELADO' ? 'complete' : ''}`} key={status}><span className="timeline-marker">{index + 1}</span><span>{statusLabels[status]}</span></div>)}{order.status === 'CANCELADO' && <div className="timeline-step timeline-cancelled current"><span className="timeline-marker">×</span><span>Cancelado</span></div>}</div>
          <div className="status-actions">{(nextStatuses[order.status] || []).map((status) => <button disabled={saving} className={status === 'CANCELADO' ? 'button button-danger' : 'button button-primary'} key={status} onClick={() => requestStatus(status)}>{saving ? 'Salvando…' : status === 'CANCELADO' ? 'Cancelar pedido' : `Marcar: ${statusLabels[status]}`}</button>)}</div>
        </div></aside></div>
  </>}</main>
}
