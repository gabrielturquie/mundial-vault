import React, { useMemo } from 'react'
import {
  TrendingUp, TrendingDown, DollarSign, Package,
  BarChart2, PieChart, Award, ShoppingBag
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color, trend }) {
  return (
    <div
      className="glass-card p-5 flex flex-col gap-3"
    >
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
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(108,99,255,0.12)', color: '#9c8fff' }}
            >
              {count}
            </span>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
            ${value.toFixed(2)}
          </span>
          {secondary && (
            <span className="text-xs ml-2" style={{ color: '#6b7280' }}>{secondary}</span>
          )}
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#2a2a3d' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: color || 'linear-gradient(90deg, #6c63ff, #9c8fff)',
          }}
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

export default function Dashboard({ jerseys }) {
  const stats = useMemo(() => {
    const sold = jerseys.filter(j => j.status === 'Sold')
    const unsold = jerseys.filter(j => j.status !== 'Sold')
    const listed = jerseys.filter(j => j.status === 'Listed')
    const inStock = jerseys.filter(j => j.status === 'In Stock')

    const totalRevenue = sold.reduce((s, j) => s + j.salePrice, 0)
    const totalCost = sold.reduce((s, j) => s + j.costPrice, 0)
    const totalProfit = totalRevenue - totalCost
    const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    const unsoldValue = unsold.reduce((s, j) => s + j.costPrice, 0)
    const totalListedValue = listed.reduce((s, j) => s + j.salePrice, 0)

    // Per-jersey profit margins (sold only)
    const jerseyMargins = sold.map(j => ({
      ...j,
      profit: j.salePrice - j.costPrice,
      margin: j.salePrice > 0 ? ((j.salePrice - j.costPrice) / j.salePrice) * 100 : 0,
    })).sort((a, b) => b.margin - a.margin)

    // Best-selling teams (by count sold)
    const teamCount = {}
    const teamRevenue = {}
    sold.forEach(j => {
      teamCount[j.team] = (teamCount[j.team] || 0) + 1
      teamRevenue[j.team] = (teamRevenue[j.team] || 0) + j.salePrice
    })
    const topTeams = Object.entries(teamRevenue)
      .map(([team, revenue]) => ({ team, revenue, count: teamCount[team] }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)

    // Best-selling players (by count sold)
    const playerCount = {}
    const playerRevenue = {}
    sold.forEach(j => {
      playerCount[j.player] = (playerCount[j.player] || 0) + 1
      playerRevenue[j.player] = (playerRevenue[j.player] || 0) + j.salePrice
    })
    const topPlayers = Object.entries(playerRevenue)
      .map(([player, revenue]) => ({ player, revenue, count: playerCount[player] }))
      .sort((a, b) => b.count - a.count || b.revenue - a.revenue)
      .slice(0, 5)

    // Platform breakdown (all jerseys)
    const platformRevenue = {}
    const platformCount = {}
    const platformProfit = {}
    sold.forEach(j => {
      platformRevenue[j.platform] = (platformRevenue[j.platform] || 0) + j.salePrice
      platformCount[j.platform] = (platformCount[j.platform] || 0) + 1
      platformProfit[j.platform] = (platformProfit[j.platform] || 0) + (j.salePrice - j.costPrice)
    })
    const platformData = Object.entries(platformRevenue)
      .map(([p, rev]) => ({ platform: p, revenue: rev, count: platformCount[p], profit: platformProfit[p] }))
      .sort((a, b) => b.revenue - a.revenue)

    return {
      totalRevenue,
      totalCost,
      totalProfit,
      avgMargin,
      unsoldValue,
      totalListedValue,
      soldCount: sold.length,
      listedCount: listed.length,
      inStockCount: inStock.length,
      jerseyMargins,
      topTeams,
      topPlayers,
      platformData,
      maxTeamRevenue: topTeams[0]?.revenue || 1,
      maxPlatformRevenue: platformData[0]?.revenue || 1,
    }
  }, [jerseys])

  const PLATFORM_COLORS = {
    Depop: '#ff2d55',
    Mercari: '#0066ff',
    Poshmark: '#c9184a',
    eBay: '#e43137',
    Vinted: '#09b3af',
    StockX: '#00ff87',
    Other: '#6c63ff',
  }

  if (jerseys.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold" style={{ color: '#e2e8f0' }}>Dashboard</h1>
        <div className="glass-card p-12 text-center">
          <BarChart2 size={40} className="mx-auto mb-3" style={{ color: '#2a2a3d' }} />
          <p className="text-sm" style={{ color: '#6b7280' }}>
            Add jerseys to your inventory to see financial insights here.
          </p>
        </div>
      </div>
    )
  }

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
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          sub={`from ${stats.soldCount} sales`}
          color="#6c63ff"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Profit"
          value={`$${stats.totalProfit.toFixed(2)}`}
          sub={`avg margin ${stats.avgMargin.toFixed(1)}%`}
          color="#22c55e"
          trend={stats.avgMargin}
        />
        <StatCard
          icon={Package}
          label="Unsold Stock Value"
          value={`$${stats.unsoldValue.toFixed(2)}`}
          sub={`${stats.inStockCount + stats.listedCount} items`}
          color="#f59e0b"
        />
        <StatCard
          icon={ShoppingBag}
          label="Listed Value"
          value={`$${stats.totalListedValue.toFixed(2)}`}
          sub={`potential revenue`}
          color="#3b82f6"
        />
      </div>

      {/* Row 2: Teams + Players */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Teams */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} style={{ color: '#6c63ff' }} />
            <h2 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>Top Teams by Revenue</h2>
          </div>
          {stats.topTeams.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: '#6b7280' }}>
              No sales data yet
            </p>
          ) : (
            <div className="space-y-4">
              {stats.topTeams.map(({ team, revenue, count }) => (
                <HorizontalBar
                  key={team}
                  label={team}
                  value={revenue}
                  max={stats.maxTeamRevenue}
                  count={count}
                  secondary={`${count} sold`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Top Players */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-5">
            <Award size={18} style={{ color: '#f59e0b' }} />
            <h2 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>Top Players by Sales</h2>
          </div>
          {stats.topPlayers.length === 0 ? (
            <p className="text-sm text-center py-6" style={{ color: '#6b7280' }}>
              No sales data yet
            </p>
          ) : (
            <div className="space-y-4">
              {stats.topPlayers.map(({ player, revenue, count }, i) => (
                <HorizontalBar
                  key={player}
                  label={player}
                  value={revenue}
                  max={stats.topPlayers[0]?.revenue || 1}
                  count={count}
                  secondary={`${count} sold`}
                  color={`linear-gradient(90deg, #f59e0b, #fbbf24)`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Platform Breakdown */}
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
                <div
                  key={platform}
                  className="p-4 rounded-xl flex flex-col gap-3"
                  style={{ backgroundColor: '#0a0a0f', border: '1px solid #2a2a3d' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-semibold" style={{ color: '#e2e8f0' }}>
                        {platform}
                      </span>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded"
                      style={{ backgroundColor: 'rgba(108,99,255,0.12)', color: '#9c8fff' }}
                    >
                      {count} sold
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs" style={{ color: '#6b7280' }}>Revenue</p>
                      <p className="text-base font-bold" style={{ color: '#e2e8f0' }}>
                        ${revenue.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: '#6b7280' }}>Profit</p>
                      <p className="text-base font-bold" style={{ color: profit >= 0 ? '#22c55e' : '#ef4444' }}>
                        ${profit.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs mb-1.5" style={{ color: '#6b7280' }}>Margin</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#2a2a3d' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${Math.min(margin, 100)}%`, backgroundColor: color }}
                        />
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

      {/* Row 4: Per-Jersey Margin Table */}
      <div className="glass-card overflow-hidden">
        <div
          className="px-5 py-4 flex items-center gap-2"
          style={{ borderBottom: '1px solid #2a2a3d' }}
        >
          <BarChart2 size={18} style={{ color: '#22c55e' }} />
          <h2 className="text-base font-semibold" style={{ color: '#e2e8f0' }}>Profit Margin per Jersey (Sold)</h2>
        </div>

        {stats.jerseyMargins.length === 0 ? (
          <p className="text-sm text-center py-8" style={{ color: '#6b7280' }}>
            No sold jerseys yet
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#12121a', borderBottom: '1px solid #2a2a3d' }}>
                  {['Jersey', 'Platform', 'Cost', 'Sale Price', 'Profit', 'Margin'].map(h => (
                    <th key={h} className="px-5 py-3 text-left">
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6b7280' }}>
                        {h}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.jerseyMargins.map((j, i) => (
                  <tr
                    key={j.id || i}
                    className="border-b"
                    style={{ borderColor: '#2a2a3d', backgroundColor: i % 2 === 0 ? '#1a1a26' : '#16162010' }}
                  >
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>
                        {j.team} — {j.player}
                      </span>
                      <span className="ml-2 text-xs" style={{ color: '#6b7280' }}>
                        {j.size} · {j.type}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm" style={{ color: '#94a3b8' }}>{j.platform}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm" style={{ color: '#94a3b8' }}>${j.costPrice.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-medium" style={{ color: '#e2e8f0' }}>${j.salePrice.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: j.profit >= 0 ? '#22c55e' : '#ef4444' }}
                      >
                        {j.profit >= 0 ? '+' : ''}${j.profit.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <MarginBadge margin={j.margin} />
                    </td>
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
