import type { AddressRequest, OrderItemRequest } from '../../../types/api'

type AddressField = { key: keyof AddressRequest; label: string; required: boolean }
const addressFields: AddressField[] = [
  { key: 'street', label: 'Rua / avenida', required: true },
  { key: 'number', label: 'Número', required: true },
  { key: 'complement', label: 'Complemento', required: false },
  { key: 'neighborhood', label: 'Bairro', required: true },
  { key: 'city', label: 'Cidade', required: true },
  { key: 'state', label: 'Estado', required: true },
  { key: 'zipCode', label: 'CEP', required: true },
]

type OrderFormProps = {
  address: AddressRequest
  items: OrderItemRequest[]
  loading: boolean
  error: string
  onAddressChange: (field: keyof AddressRequest, value: string) => void
  onItemChange: (index: number, field: keyof OrderItemRequest, value: string) => void
  onAddItem: () => void
  onRemoveItem: (index: number) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

export function OrderForm({ address, items, loading, error, onAddressChange, onItemChange, onAddItem, onRemoveItem, onSubmit, onCancel }: OrderFormProps) {
  return <form className="create-order-form" onSubmit={onSubmit}>
    <section className="form-section"><div className="block-heading"><span className="block-index">01</span><div><h2>Endereço de entrega</h2><p>Para onde este pedido vai?</p></div></div>
      <div className="field-grid">{addressFields.map(({ key, label, required }) => <label className={`field-${key}`} key={key}>{label}{!required && <span className="optional-label">· opcional</span>}<input required={required} value={address[key]} onChange={(event) => onAddressChange(key, event.target.value)} placeholder={key === 'zipCode' ? '00000-000' : ''} /></label>)}</div>
    </section>
    <section className="form-section"><div className="block-heading"><span className="block-index">02</span><div><h2>Itens do pedido</h2><p>Adicione pelo menos um produto.</p></div></div>
      <div className="item-editor">{items.map((item, index) => <div className="item-editor-row" key={index}><span className="item-index">{String(index + 1).padStart(2, '0')}</span><label className="product-field">Produto<input required value={item.product} onChange={(event) => onItemChange(index, 'product', event.target.value)} placeholder="Nome do produto" /></label><label>Quantidade<input required min="1" type="number" value={item.quantity} onChange={(event) => onItemChange(index, 'quantity', event.target.value)} /></label><label>Preço unitário<input required min="0.01" step="0.01" type="number" value={item.price || ''} onChange={(event) => onItemChange(index, 'price', event.target.value)} placeholder="0,00" /></label>{items.length > 1 && <button className="remove-item" type="button" title="Remover item" onClick={() => onRemoveItem(index)}>×</button>}</div>)}</div>
      <button className="add-item" type="button" onClick={onAddItem}><span>＋</span> Adicionar outro item</button>
    </section>
    {error && <p className="notice notice-error" role="alert">{error}</p>}
    <div className="form-actions"><button className="button button-quiet" type="button" onClick={onCancel}>Cancelar</button><button className="button button-primary" disabled={loading}>{loading ? 'Criando pedido…' : 'Criar pedido'}<span aria-hidden="true">↗</span></button></div>
  </form>
}
