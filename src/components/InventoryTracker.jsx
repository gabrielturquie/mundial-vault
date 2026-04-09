import React, { useState, useMemo } from 'react'
import {
  Plus, Search, X, Edit2, Trash2, Tag, ChevronDown,
  ChevronUp, Filter, Check, MoreHorizontal
} from 'lucide-react'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const TYPES = ['Home', 'Away', 'Third', 'GK', 'Special Edition']
const QUALITIES = ['A', 'B']
const PLATFORMS = ['Depop', 'Mercari', 'Poshmark', 'eBay', 'Vinted', 'StockX', 'Other']
const STATUSES = ['In Stock', 'Listed', 'Sold']
const PURCHASE_SOURCES = ['Amazon', 'eBay', 'Alibaba', 'AliExpress', 'DHgate', 'Local Market', 'Wholesale', 'Other']
const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Cash', 'Other']

const STATUS_STYLES = {
  'In Stock': { bg: 'rgba(34,197,94,0.12)', color: '#22c55e', dot: '#22c55e' },
  'Listed': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', dot: '#3b82f6' },
  'Sold': { bg: 'rgba(108,99,255,0.12)', color: '#6c63ff', dot: '#6c63ff' },
}

const EMPTY_FORM = {
  team: '',
  player: '',
  number: '',
  size: 'M',
  type: 'Home',
  quality: 'A',
  costPrice: '',
  salePrice: '',
  platform: 'Depop',
  status: 'In Stock',
  notes: '',
  dateAdded: new Date().toISOString().split('T')[0],
  purchaseSource: '',
  purchaseDate: '',
  deliveryDate: '',
  paymentMethod: '',
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function InputField({ label, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>
        {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
      </label>
      {children}
      {error && <span className="text-xs" style={{ color: '#ef4444' }}>{error}</span>}
    </div>
  )
}

const inputClass = "w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
const inputStyle = {
  backgroundColor: '#0a0a0f',
  border: '1px solid #2a2a3d',
  color: '#e2e8f0',
}

function JerseyForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const errs = {}
    if (!form.team.trim()) errs.team = 'Required'
    if (!form.player.trim()) errs.player = 'Required'
    if (!form.costPrice || isNaN(form.costPrice)) errs.costPrice = 'Valid number required'
    if (!form.salePrice || isNaN(form.salePrice)) errs.salePrice = 'Valid number required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave({
      ...form,
      costPrice: parseFloat(form.costPrice),
      salePrice: parseFloat(form.salePrice),
      id: form.id || generateId(),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Team" required error={errors.team}>
          <input
            className={inputClass}
            style={inputStyle}
            value={form.team}
            onChange={set('team')}
            placeholder="e.g. Real Madrid"
          />
        </InputField>
        <InputField label="Player Name" required error={errors.player}>
          <input
            className={inputClass}
            style={inputStyle}
            value={form.player}
            onChange={set('player')}
            placeholder="e.g. Bellingham"
          />
        </InputField>
        <InputField label="Player Number">
          <input
            className={inputClass}
            style={inputStyle}
            value={form.number}
            onChange={set('number')}
            placeholder="e.g. 5"
          />
        </InputField>
        <InputField label="Size">
          <select className={inputClass} style={inputStyle} value={form.size} onChange={set('size')}>
            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </InputField>
        <InputField label="Type">
          <select className={inputClass} style={inputStyle} value={form.type} onChange={set('type')}>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </InputField>
        <InputField label="Quality">
          <select className={inputClass} style={inputStyle} value={form.quality} onChange={set('quality')}>
            {QUALITIES.map(q => <option key={q} value={q}>Grade {q}</option>)}
          </select>
        </InputField>
        <InputField label="Cost Price ($)" required error={errors.costPrice}>
          <input
            className={inputClass}
            style={inputStyle}
            type="number"
            step="0.01"
            min="0"
            value={form.costPrice}
            onChange={set('costPrice')}
            placeholder="0.00"
          />
        </InputField>
        <InputField label="Sale Price ($)" required error={errors.salePrice}>
          <input
            className={inputClass}
            style={inputStyle}
            type="number"
            step="0.01"
            min="0"
            value={form.salePrice}
            onChange={set('salePrice')}
            placeholder="0.00"
          />
        </InputField>
        <InputField label="Platform">
          <select className={inputClass} style={inputStyle} value={form.platform} onChange={set('platform')}>
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </InputField>
        <InputField label="Status">
          <select className={inputClass} style={inputStyle} value={form.status} onChange={set('status')}>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </InputField>
      </div>
      <InputField label="Notes">
        <input
          className={inputClass}
          style={inputStyle}
          value={form.notes}
          onChange={set('notes')}
          placeholder="Any additional notes..."
        />
      </InputField>

      {/* Purchase Details */}
      <div
        className="pt-2 pb-1 text-xs font-semibold uppercase tracking-wide"
        style={{ color: '#6b7280', borderTop: '1px solid #2a2a3d' }}
      >
        Purchase Details
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField label="Purchased From">
          <select className={inputClass} style={inputStyle} value={form.purchaseSource} onChange={set('purchaseSource')}>
            <option value="">Select source...</option>
            {PURCHASE_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </InputField>
        <InputField label="Payment Method">
          <select className={inputClass} style={inputStyle} value={form.paymentMethod} onChange={set('paymentMethod')}>
            <option value="">Select method...</option>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </InputField>
        <InputField label="Order Date">
          <input
            className={inputClass}
            style={inputStyle}
            type="date"
            value={form.purchaseDate}
            onChange={set('purchaseDate')}
          />
        </InputField>
        <InputField label="Delivery Date">
          <input
            className={inputClass}
            style={inputStyle}
            type="date"
            value={form.deliveryDate}
            onChange={set('deliveryDate')}
          />
        </InputField>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6c63ff, #9c8fff)', color: '#fff' }}
        >
          {initial ? 'Save Changes' : 'Add Jersey'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
          style={{ backgroundColor: '#1a1a26', border: '1px solid #2a2a3d', color: '#94a3b8' }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function JerseyRow({ jersey, onEdit, onDelete, onGenerateListing }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const profit = jersey.salePrice - jersey.costPrice
  const margin = jersey.salePrice > 0 ? ((profit / jersey.salePrice) * 100).toFixed(0) : 0
  const st = STATUS_STYLES[jersey.status] || STATUS_STYLES['In Stock']

  return (
    <tr
      className="border-b transition-colors duration-150 group"
      style={{ borderColor: '#2a2a3d' }}
    >
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
            {jersey.team}
          </span>
          <span className="text-xs" style={{ color: '#6c63ff' }}>
            {jersey.player}{jersey.number ? ` · ${jersey.number}` : ''}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          style={{ backgroundColor: 'rgba(108,99,255,0.12)', color: '#9c8fff' }}
        >
          {jersey.size}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs" style={{ color: '#94a3b8' }}>{jersey.type}</span>
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold"
          style={{
            backgroundColor: jersey.quality === 'A' ? 'rgba(34,197,94,0.12)' : 'rgba(245,158,11,0.12)',
            color: jersey.quality === 'A' ? '#22c55e' : '#f59e0b',
          }}
        >
          Grade {jersey.quality}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>
            ${jersey.salePrice.toFixed(2)}
          </span>
          <span className="text-xs" style={{ color: '#6b7280' }}>
            cost ${jersey.costPrice.toFixed(2)}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span
            className="text-sm font-semibold"
            style={{ color: profit >= 0 ? '#22c55e' : '#ef4444' }}
          >
            {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
          </span>
          <span className="text-xs" style={{ color: '#6b7280' }}>{margin}% margin</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="text-xs" style={{ color: '#94a3b8' }}>{jersey.platform}</span>
      </td>
      <td className="px-4 py-3">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: st.bg, color: st.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: st.dot }} />
          {jersey.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onGenerateListing(jersey)}
            className="p-1.5 rounded-lg transition-colors duration-150"
            style={{ color: '#6c63ff' }}
            title="Generate listing"
          >
            <Tag size={14} />
          </button>
          <button
            onClick={() => onEdit(jersey)}
            className="p-1.5 rounded-lg transition-colors duration-150"
            style={{ color: '#94a3b8' }}
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(jersey.id)}
            className="p-1.5 rounded-lg transition-colors duration-150"
            style={{ color: '#ef4444' }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function InventoryTracker({ jerseys, onSave, onSelectForListing }) {
  const [showForm, setShowForm] = useState(false)
  const [editingJersey, setEditingJersey] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    platform: '',
    type: '',
    quality: '',
    size: '',
  })
  const [sortField, setSortField] = useState('dateAdded')
  const [sortDir, setSortDir] = useState('desc')
  const [showFilters, setShowFilters] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleAdd = (jersey) => {
    onSave([...jerseys, jersey])
    setShowForm(false)
  }

  const handleEdit = (jersey) => {
    const updated = jerseys.map(j => j.id === jersey.id ? jersey : j)
    onSave(updated)
    setEditingJersey(null)
  }

  const handleDelete = (id) => {
    onSave(jerseys.filter(j => j.id !== id))
    setDeleteConfirm(null)
  }

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortField(field); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    let result = [...jerseys]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(j =>
        j.team.toLowerCase().includes(q) ||
        j.player.toLowerCase().includes(q) ||
        j.platform.toLowerCase().includes(q) ||
        (j.notes || '').toLowerCase().includes(q)
      )
    }
    if (filters.status) result = result.filter(j => j.status === filters.status)
    if (filters.platform) result = result.filter(j => j.platform === filters.platform)
    if (filters.type) result = result.filter(j => j.type === filters.type)
    if (filters.quality) result = result.filter(j => j.quality === filters.quality)
    if (filters.size) result = result.filter(j => j.size === filters.size)

    result.sort((a, b) => {
      let va = a[sortField], vb = b[sortField]
      if (sortField === 'salePrice' || sortField === 'costPrice') {
        va = parseFloat(va); vb = parseFloat(vb)
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return result
  }, [jerseys, search, filters, sortField, sortDir])

  const activeFilterCount = Object.values(filters).filter(Boolean).length

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={12} style={{ color: '#4a5568' }} />
    return sortDir === 'asc'
      ? <ChevronUp size={12} style={{ color: '#6c63ff' }} />
      : <ChevronDown size={12} style={{ color: '#6c63ff' }} />
  }

  const summaryStats = useMemo(() => {
    const total = jerseys.length
    const inStock = jerseys.filter(j => j.status === 'In Stock').length
    const listed = jerseys.filter(j => j.status === 'Listed').length
    const sold = jerseys.filter(j => j.status === 'Sold').length
    return { total, inStock, listed, sold }
  }, [jerseys])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>Inventory</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
            {summaryStats.total} jerseys · {summaryStats.inStock} in stock · {summaryStats.listed} listed · {summaryStats.sold} sold
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setEditingJersey(null) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6c63ff, #9c8fff)', color: '#fff' }}
        >
          <Plus size={16} />
          Add Jersey
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: summaryStats.total, color: '#9c8fff' },
          { label: 'In Stock', value: summaryStats.inStock, color: '#22c55e' },
          { label: 'Listed', value: summaryStats.listed, color: '#3b82f6' },
          { label: 'Sold', value: summaryStats.sold, color: '#6c63ff' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="glass-card p-4 flex flex-col gap-1"
          >
            <span className="text-xs font-medium" style={{ color: '#6b7280' }}>{label}</span>
            <span className="text-2xl font-bold" style={{ color }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {(showForm || editingJersey) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={(e) => { if (e.target === e.currentTarget) { setShowForm(false); setEditingJersey(null) } }}
        >
          <div
            className="w-full max-w-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: '#12121a', border: '1px solid #2a2a3d' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold" style={{ color: '#e2e8f0' }}>
                {editingJersey ? 'Edit Jersey' : 'Add New Jersey'}
              </h2>
              <button
                onClick={() => { setShowForm(false); setEditingJersey(null) }}
                className="p-1.5 rounded-lg"
                style={{ color: '#6b7280' }}
              >
                <X size={18} />
              </button>
            </div>
            <JerseyForm
              initial={editingJersey}
              onSave={editingJersey ? handleEdit : handleAdd}
              onCancel={() => { setShowForm(false); setEditingJersey(null) }}
            />
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ backgroundColor: '#12121a', border: '1px solid #2a2a3d' }}
          >
            <h3 className="text-base font-bold mb-2" style={{ color: '#e2e8f0' }}>Delete jersey?</h3>
            <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#1a1a26', border: '1px solid #2a2a3d', color: '#94a3b8' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4a5568' }} />
            <input
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-all duration-150"
              style={{ backgroundColor: '#1a1a26', border: '1px solid #2a2a3d', color: '#e2e8f0' }}
              placeholder="Search by team, player, platform..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#6b7280' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(f => !f)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: showFilters || activeFilterCount > 0 ? 'rgba(108,99,255,0.12)' : '#1a1a26',
              border: `1px solid ${showFilters || activeFilterCount > 0 ? '#6c63ff' : '#2a2a3d'}`,
              color: showFilters || activeFilterCount > 0 ? '#6c63ff' : '#94a3b8',
            }}
          >
            <Filter size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span
                className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold"
                style={{ backgroundColor: '#6c63ff', color: '#fff' }}
              >
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div
            className="p-4 rounded-xl grid grid-cols-2 sm:grid-cols-5 gap-3"
            style={{ backgroundColor: '#1a1a26', border: '1px solid #2a2a3d' }}
          >
            {[
              { key: 'status', label: 'Status', opts: STATUSES },
              { key: 'platform', label: 'Platform', opts: PLATFORMS },
              { key: 'type', label: 'Type', opts: TYPES },
              { key: 'quality', label: 'Quality', opts: QUALITIES.map(q => `Grade ${q}`) },
              { key: 'size', label: 'Size', opts: SIZES },
            ].map(({ key, label, opts }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: '#6b7280' }}>{label}</label>
                <select
                  className="px-2 py-1.5 rounded-lg text-xs"
                  style={{ backgroundColor: '#0a0a0f', border: '1px solid #2a2a3d', color: '#e2e8f0' }}
                  value={key === 'quality' ? (filters.quality ? `Grade ${filters.quality}` : '') : filters[key]}
                  onChange={e => {
                    let val = e.target.value
                    if (key === 'quality' && val) val = val.replace('Grade ', '')
                    setFilters(f => ({ ...f, [key]: val }))
                  }}
                >
                  <option value="">All</option>
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            {activeFilterCount > 0 && (
              <div className="flex items-end sm:col-span-5">
                <button
                  onClick={() => setFilters({ status: '', platform: '', type: '', quality: '', size: '' })}
                  className="text-xs flex items-center gap-1"
                  style={{ color: '#ef4444' }}
                >
                  <X size={12} /> Clear filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid #2a2a3d' }}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#12121a', borderBottom: '1px solid #2a2a3d' }}>
                {[
                  { label: 'Jersey', field: 'team' },
                  { label: 'Size', field: 'size' },
                  { label: 'Type', field: 'type' },
                  { label: 'Quality', field: 'quality' },
                  { label: 'Price', field: 'salePrice' },
                  { label: 'Profit', field: null },
                  { label: 'Platform', field: 'platform' },
                  { label: 'Status', field: 'status' },
                  { label: '', field: null },
                ].map(({ label, field }, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-left"
                    onClick={field ? () => handleSort(field) : undefined}
                    style={{ cursor: field ? 'pointer' : 'default' }}
                  >
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                        {label}
                      </span>
                      {field && <SortIcon field={field} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ backgroundColor: '#1a1a26' }}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                      {jerseys.length === 0 ? 'No jerseys yet. Add your first one!' : 'No jerseys match your filters.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map(jersey => (
                  <JerseyRow
                    key={jersey.id}
                    jersey={jersey}
                    onEdit={setEditingJersey}
                    onDelete={setDeleteConfirm}
                    onGenerateListing={onSelectForListing}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div
            className="px-4 py-2.5 text-xs"
            style={{ borderTop: '1px solid #2a2a3d', color: '#6b7280', backgroundColor: '#12121a' }}
          >
            Showing {filtered.length} of {jerseys.length} jerseys
          </div>
        )}
      </div>
    </div>
  )
}
