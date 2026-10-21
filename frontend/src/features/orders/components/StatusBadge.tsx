import type { OrderStatus } from '../../../types/api'
import { statusLabels } from '../statusLabels'

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}><span className="status-dot" />{statusLabels[status]}</span>
}
