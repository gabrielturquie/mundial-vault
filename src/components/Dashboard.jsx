import React, { useMemo, useState } from 'react'
import {
  TrendingUp, TrendingDown, DollarSign, Package,
  BarChart2, PieChart, Award, ShoppingBag, Plus, Trash2, X, Receipt
} from 'lucide-react'

const EXPENSE_CATEGORIES = ['Ads', 'Platform Fees', 'Shipping Supplies', 'Equipment', 'Packaging', 'Storage', 'Returns', 'Other']
const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Cash', 'Other']

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18` }}
        >
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <span
            className="flex items-center gap-1 text-xs font-medium"
            style={{ color: trend >= 0 ? '#22c55e' : '#ef4444' }}
          >
            {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>{label}</p>
        <p className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>{value}</p>
        {sub && <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{sub}</p>}
      </div>
    </div>
  )
}

function HorizontalBar({ label, value, max, count, color, secondary }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{label}</span>
          {count !== undefined && (
            <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(108,99,255,0.12)', color: '#9c8fff' }}>
              {count}
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>${value.toFixed(2)}</span>
          {secondary && <span className="text-xs ml-2" style={{ color: '#6b7280' }}>{secondary}</span>}
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#2a2a3d' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color || 'linear-gradient(90deg, #6c63ff, #9c8fff)' }}
        />
      </div>
    </div>
  )
}

function MarginBadge({ margin }) {
  if (margin >= 50) return (
    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
      {margin.toFixed(0)}%
    </span>
  )
  if (margin >= 30) return (
    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
      {margin.toFixed(0)}%
    </span>
  )
  return (
    <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
      {margin.toFixed(0)}%
    </span>
  )
}

const inputClass = "w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150"
const inputStyle = { backgroundColor: '#0a0a0f', border: '1px solid #2a2a3d', color: '#e2e8f0' }

function ExpenseForm({ onSave, onCancel }) {
  const [form, setForm] = useState({
    category: 'Ads',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
  })
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      setError('Enter a valid amount')
      return
    }
    onSave({ ...form, amount: parseFloat(form.amount), id: generateId() })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>Category</label>
          <select className={inputClass} style={inputStyle} value={form.category} onChange={set('category')}>
            {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>Amount ($) <span style={{ color: '#ef4444' }}>*</span></label>
          <input
            className={inputClass} style={inputStyle}
            type="number" step="0.01" min="0"
            value={form.amount} onChange={set('amount')} placeholder="0.00"
          />
          {error && <span className="text-xs" style={{ color: '#ef4444' }}>{error}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>Date</label>
          <input className={inputClass} style={inputStyle} type="date" value={form.date} onChange={set('date')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>Payment Method</label>
          <select className={inputClass} style={inputStyle} value={form.paymentMethod} onChange={set('paymentMethod')}>
            <option value="">Select...</option>
            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium" style={{ color: '#94a3b8' }}>Description</label>
        <input
          className={inputClass} style={inputStyle}
          value={form.description} onChange={set('description')}
          placeholder="e.g. Instagram ads for March, Depop shipping bags..."
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #6c63ff, #9c8fff)', color: '#fff' }}
        >
          Add Expense
        </button>
        <button
          type="button" onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg text-sm font-medium"
          style={{ backgroundColor: '#1a1a26', border: '1px solid #2a2a3d', color: '#94a3b8' }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

const CATEGORY_COLORS = {
  Ads: '#f59e0b',
  'Platform Fees': '#3b82f6',
  'Shipping Supplies': '#22c55e',
  Equipment: '#9c8fff',
  Packaging: '#06b6d4',
  Storage: '#ec4899',
  Returns: '#ef4444',
  Other: '#6b7280',
}

export default function Dashboard({ jerseys, expenses, onSaveExpenses }) {
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleAddExpense = (expense) => {
    onSaveExpenses([...expenses, expense])
    setShowExpenseForm(false)
  }

  const handleDeleteExpense = (id) => {
    onSaveExpenses(expenses.filter(e => e.id !== id))
    setDeleteConfirm(null)
  }

  const stats = useMemo(() => {
    const sold = jerseys.filter(j => j.status === 'Sold')
    const unsold = jerseys.filter(j => j.status !== 'Sold')
    const listed = jerseys.filter(j => j.status === 'Listed')
    const inStock = jerseys.filter(j => j.status === 'In Stock')

    const totalRevenue = sold.reduce((s, j) => s + j.salePrice, 0)
    const totalJerseyCost = sold.reduce((s, j) => s + j.costPrice, 0)
    const totalExtraCosts = expenses.reduce((s, e) => s + e.amount, 0)
    const totalCost = totalJerseyCost + totalExtraCosts
    const grossProfit = totalRevenue - totalJerseyCost
    const netProfit = totalRevenue - totalCost
    const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0
    const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0
    const unsoldValue = unsold.reduce((s, j) => s + j.costPrice, 0)
    const totalListedValue = listed.reduce((s, j) => s + j.salePrice, 0)

    const jerseyMargins = sold.map(j => ({
      ...j,
      profit: j.salePrice - j.costPrice,
      margin: j.salePrice > 0 ? ((j.salePrice - j.costPrice) / j.salePrice) * 100 : 0,
    })).sort((a, b) => b.margin - a.margin)

    const teamCount = {}, teamRevenue = {}
    sold.forEach(j => {
      teamCount[j.team] = (teamCount[j.team] || 0) + 1
      teamRevenue[j.team] = (teamRevenue[j.team] || 0) + j.salePrice
    })
    const topTeams = Object.entries(teamRevenue)
      .map(([team, revenue]) => ({ team, revenue, count: teamCount[team] }))
      .sort((a, b) => b.revenue - a.revenue).slice(0, 6)

    const playerCount = {}, playerRevenue = {}
    sold.forEach(j => {
      playerCount[j.player] = (playerCount[j.player] || 0) + 1
      playerRevenue[j.player] = (playerRevenue[j.player] || 0) + j.salePrice
    })
    const topPlayers = Object.entries(playerRevenue)
      .map(([player, revenue]) => ({ player, revenue, count: playerCount[player] }))
      .sort((a, b) => b.count - a.count || b.revenue - a.revenue).slice(0, 5)

    const platformRevenue = {}, platformCount = {}, platformProfit = {}
    sold.forEach(j => {
      platformRevenue[j.platform] = (platformRevenue[j.platform] || 0) + j.salePrice
      platformCount[j.platform] = (platformCount[j.platform] || 0) + 1
      platformProfit[j.platform] = (platformProfit[j.platform] || 0) + (j.salePrice - j.costPrice)
    })
    const platformData = Object.entries(platformRevenue)
      .map(([p, rev]) => ({ platform: p, revenue: rev, count: platformCount[p], profit: platformProfit[p] }))
      .sort((a, b) => b.revenue - a.revenue)

    // Expenses by category
    const expByCategory = {}
    expenses.forEach(e => {
      expByCategory[e.category] = (expByCategory[e.category] || 0) + e.amount
    })
    const expenseBreakdown = Object.entries(expByCategory)
      .map(([cat, total]) => ({ category: cat, total }))
      .sort((a, b) => b.total - a.total)

    return {
      totalRevenue, totalJerseyCost, totalExtraCosts, totalCost,
      grossProfit, netProfit, grossMargin, netMargin,
      unsoldValue, totalListedValue,
      soldCount: sold.length, listedCount: listed.length, inStockCount: inStock.length,
      jerseyMargins, topTeams, topPlayers, platformData,
      expenseBreakdown,
      maxTeamRevenue: topTeams[0]?.revenue || 1,
      maxPlatformRevenue: platformData[0]?.revenue || 1,
    }
  }, [jerseys, expenses])

  const PLATFORM_COLORS = {
    Depop: '#ff2d55', Mercari: '#0066ff', Poshmark: '#c9184a',
    eBay: '#e43137', Vinted: '#09b3af', StockX: '#00ff87', Other: '#6c63ff',
  }

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6b7280' }}>
          {stats.soldCount} jerseys sold · {stats.listedCount} listed · {stats.inStockCount} in stock
        </p>
      </div>

      {/* Main KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} sub={`from ${stats.soldCount} sales`} color="#6c63ff" />
        <StatCard icon={TrendingUp} label="Gross Profit" value={`$${stats.grossProfit.toFixed(2)}`} sub={`${stats.grossMargin.toFixed(1)}% margin (pre-expenses)`} color="#22c55e" trend={stats.grossMargin} />
        <StatCard icon={Receipt} label="Net Profit" value={`$${stats.netProfit.toFixed(2)}`} sub={`${stats.netMargin.toFixed(1)}% margin after all costs`} color={stats.netProfit >= 0 ? '#3b82f6' : '#ef4444'} trend={stats.netMargin} />
        <StatCard icon={Package} label="Unsold Stock Value" value={`$${stats.unsoldValue.toFixed(2)}`} sub={`${stats.inStockCount + stats.listedCount} items at cost`} color="#f59e0b" />
      </div>

      {/* Cost Breakdown */}
      <div className="glass-card p-5">
        <h2 className="text-base font-semibold mb-4" style={{ color: '#e2e8f0' }}>Cost Breakdown</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Jersey Costs', value: stats.totalJerseyCost, color: '#6c63ff' },
            { label: 'Other Expenses', value: stats.totalExtraCosts, color: '#f59e0b' },
            { label: 'Total Costs', value: stats.totalCost, color: '#ef4444' },
            { label: 'Listed Potential', value: stats.totalListedValue, color: '#3b82f6' },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex flex-col gap-1 p-3 rounded-xl" style={{ backgroundColor: '#0a0a0f', border: '1px solid #2a2a3d' }}>
              <span className="text-xs" style={{ color: '#6b7280' }}>{label}</span>
              <span className="text-lg font-bold" style={{ color }}>${value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Tracker */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #2a2a3d' }}>
          <div className="flex items-center gap-2">
            <Receipt size={18} style={{ color: '#f59e0b' }} />
            <h2 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>Expenses</h2>
            <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
              ${stats.totalExtraCosts.toFixed(2)} total
            </span>
          </div>
          <button
            onClick={() => setShowExpenseForm(f => !f)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #6c63ff, #9c8fff)', color: '#fff' }}
          >
            <Plus size={13} />
            Add Expense
          </button>
        </div>

        {showExpenseForm && (
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #2a2a3d', backgroundColor: '#12121a' }}>
            <ExpenseForm onSave={handleAddExpense} onCancel={() => setShowExpenseForm(false)} />
          </div>
        )}

        {/* Expense category summary */}
        {stats.expenseBreakdown.length > 0 && (
          <div className="px-5 py-4 flex flex-wrap gap-2" style={{ borderBottom: '1px solid #2a2a3d', backgroundColor: '#0a0a0f' }}>
            {stats.expenseBreakdown.map(({ category, total }) => (
              <span
                key={category}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: `${CATEGORY_COLORS[category] || '#6b7280'}18`,
                  color: CATEGORY_COLORS[category] || '#6b7280',
                  border: `1px solid ${CATEGORY_COLORS[category] || '#6b7280'}30`,
                }}
              >
                {category}: ${total.toFixed(2)}
              </span>
            ))}
          </div>
        )}

        {/* Delete confirm */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}>
            <div className="w-full max-w-sm rounded-2xl p-6" style={{ backgroundColor: '#12121a', border: '1px solid #2a2a3d' }}>
              <h3 className="text-base font-bold mb-2" style={{ color: '#e2e8f0' }}>Delete expense?</h3>
              <p className="text-sm mb-5" style={{ color: '#94a3b8' }}>This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => handleDeleteExpense(deleteConfirm)} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>Delete</button>
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: '#1a1a26', border: '1px solid #2a2a3d', color: '#94a3b8' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {sortedExpenses.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: '#6b7280' }}>
            No expenses yet — add ads, fees, supplies, etc.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#12121a', borderBottom: '1px solid #2a2a3d' }}>
                  {['Date', 'Category', 'Description', 'Payment', 'Amount', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedExpenses.map((exp, i) => (
                  <tr key={exp.id} className="border-b group" style={{ borderColor: '#2a2a3d', backgroundColor: '#1a1a26' }}>
                    <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{exp.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[exp.category] || '#6b7280'}18`,
                          color: CATEGORY_COLORS[exp.category] || '#6b7280',
                        }}
                      >
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#e2e8f0' }}>{exp.description || '—'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{exp.paymentMethod || '—'}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#ef4444' }}>-${exp.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeleteConfirm(exp.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
                        style={{ color: '#ef4444' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Teams + Players */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} style={{ color: '#6c63ff' }} />
            <h2 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>Top Teams by Revenue</h2>
          </div>
          {stats.topTeams.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: '#6b7280' }}>No sales data yet</p>
          ) : (
            <div className="space-y-4">
              {stats.topTeams.map(({ team, revenue, count }) => (
                <HorizontalBar key={team} label={team} value={revenue} max={stats.maxTeamRevenue} count={count} secondary={`${count} sold`} />
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} style={{ color: '#f59e0b' }} />
            <h2 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>Top Players by Sales</h2>
          </div>
          {stats.topPlayers.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: '#6b7280' }}>No sales data yet</p>
          ) : (
            <div className="space-y-4">
              {stats.topPlayers.map(({ player, revenue, count }) => (
                <HorizontalBar key={player} label={player} value={revenue} max={stats.topPlayers[0]?.revenue || 1} count={count} secondary={`${count} sold`} color="linear-gradient(90deg, #f59e0b, #fbbf24)" />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-5">
          <PieChart size={18} style={{ color: '#3b82f6' }} />
          <h2 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>Platform Breakdown</h2>
        </div>
        {stats.platformData.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: '#6b7280' }}>No sales data yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.platformData.map(({ platform, revenue, count, profit }) => {
              const margin = revenue > 0 ? (profit / revenue) * 100 : 0
              const color = PLATFORM_COLORS[platform] || '#6c63ff'
              return (
                <div key={platform} className="p-4 rounded-xl flex flex-col gap-3" style={{ backgroundColor: '#0a0a0f', border: '1px solid #2a2a3d' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>{platform}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(108,99,255,0.12)', color: '#9c8fff' }}>{count} sold</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs" style={{ color: '#6b7280' }}>Revenue</p>
                      <p className="text-base font-bold" style={{ color: '#e2e8f0' }}>${revenue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#6b7280' }}>Profit</p>
                      <p className="text-base font-bold" style={{ color: profit >= 0 ? '#22c55e' : '#ef4444' }}>${profit.toFixed(2)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs mb-1.5" style={{ color: '#6b7280' }}>Margin</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#2a2a3d' }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min(margin, 100)}%`, backgroundColor: color }} />
                      </div>
                      <MarginBadge margin={margin} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Per-Jersey Margin Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid #2a2a3d' }}>
          <BarChart2 size={18} style={{ color: '#22c55e' }} />
          <h2 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>Profit Margin per Jersey (Sold)</h2>
        </div>
        {stats.jerseyMargins.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: '#6b7280' }}>No sold jerseys yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#12121a', borderBottom: '1px solid #2a2a3d' }}>
                  {['Jersey', 'Source', 'Payment', 'Platform', 'Cost', 'Sale Price', 'Profit', 'Margin'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.jerseyMargins.map((j, i) => (
                  <tr key={j.id || i} className="border-b" style={{ borderColor: '#2a2a3d', backgroundColor: '#1a1a26' }}>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>{j.team} — {j.player}</span>
                      <span className="ml-2 text-xs" style={{ color: '#6b7280' }}>{j.size} · {j.type}</span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{j.purchaseSource || '—'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#94a3b8' }}>{j.paymentMethod || '—'}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#94a3b8' }}>{j.platform}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#94a3b8' }}>${j.costPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: '#e2e8f0' }}>${j.salePrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-semibold" style={{ color: j.profit >= 0 ? '#22c55e' : '#ef4444' }}>
                      {j.profit >= 0 ? '+' : ''}${j.profit.toFixed(2)}
                    </td>
                    <td className="px-4 py-3"><MarginBadge margin={j.margin} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
