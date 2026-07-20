import React, { useMemo, useState } from 'react'
import {
  ShoppingCart, X, Plus, Minus, Trash2, Truck, ShieldCheck,
  Sparkles, ArrowRight, Mail,
} from 'lucide-react'
import { PRODUCTS, CATEGORIES, STORE } from '../data/products.js'

function ProductTile({ product, onOpen }) {
  const [c1, c2] = product.colors
  return (
    <button
      onClick={() => onOpen(product)}
      className="glass-card text-left overflow-hidden transition-transform duration-200 hover:-translate-y-1 accent-glow"
    >
      <div
        className="h-44 flex items-center justify-center text-6xl relative"
        style={{ background: `linear-gradient(135deg, ${c1}22, ${c2}33)` }}
      >
        <span>{product.emoji}</span>
        {product.badge && (
          <span
            className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(108,99,255,0.9)', color: '#fff' }}
          >
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>{product.category}</p>
        <p className="font-semibold mb-2" style={{ color: '#e2e8f0' }}>{product.name}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold" style={{ color: '#6c63ff' }}>${product.price.toFixed(2)}</span>
          {product.compareAt && (
            <span className="text-xs line-through" style={{ color: '#6b7280' }}>${product.compareAt.toFixed(2)}</span>
          )}
        </div>
      </div>
    </button>
  )
}

function ProductModal({ product, onClose, onAdd }) {
  const [size, setSize] = useState(product.sizes[0])
  const [qty, setQty] = useState(1)
  const [c1, c2] = product.colors
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div className="glass-card max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div
          className="h-52 flex items-center justify-center text-7xl relative"
          style={{ background: `linear-gradient(135deg, ${c1}22, ${c2}33)` }}
        >
          <span>{product.emoji}</span>
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: '#e2e8f0' }}>
            <X size={18} />
          </button>
        </div>
        <div className="p-5">
          <p className="text-xs font-medium mb-1" style={{ color: '#6b7280' }}>{product.category}</p>
          <h3 className="text-xl font-bold mb-2" style={{ color: '#e2e8f0' }}>{product.name}</h3>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-bold" style={{ color: '#6c63ff' }}>${product.price.toFixed(2)}</span>
            {product.compareAt && (
              <span className="text-sm line-through" style={{ color: '#6b7280' }}>${product.compareAt.toFixed(2)}</span>
            )}
          </div>
          <p className="text-sm mb-4" style={{ color: '#94a3b8' }}>{product.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium border"
                style={{
                  borderColor: size === s ? '#6c63ff' : '#2a2a3d',
                  backgroundColor: size === s ? 'rgba(108,99,255,0.12)' : 'transparent',
                  color: size === s ? '#9c8fff' : '#94a3b8',
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border" style={{ borderColor: '#2a2a3d' }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2" style={{ color: '#94a3b8' }}><Minus size={14} /></button>
              <span className="w-8 text-center text-sm font-semibold" style={{ color: '#e2e8f0' }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2" style={{ color: '#94a3b8' }}><Plus size={14} /></button>
            </div>
            <button
              onClick={() => { onAdd(product, size, qty); onClose() }}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #9c8fff)' }}
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CartDrawer({ cart, onClose, onUpdateQty, onRemove }) {
  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0)
  const freeShip = subtotal >= 50

  const checkout = () => {
    const lines = cart.map((l) => `- ${l.qty}x ${l.name} (${l.size}) — $${(l.price * l.qty).toFixed(2)}`).join('\n')
    const body = encodeURIComponent(
      `Hi Mundial Vault,\n\nI'd like to order:\n${lines}\n\nSubtotal: $${subtotal.toFixed(2)}\n\nName:\nShipping address:\n`
    )
    window.location.href = `mailto:${STORE.orderEmail}?subject=${encodeURIComponent('New Order — Mundial Vault')}&body=${body}`
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div className="w-full max-w-md h-full flex flex-col" style={{ backgroundColor: '#12121a', borderLeft: '1px solid #2a2a3d' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#2a2a3d' }}>
          <h3 className="font-bold flex items-center gap-2" style={{ color: '#e2e8f0' }}>
            <ShoppingCart size={18} /> Your Cart ({cart.reduce((s, l) => s + l.qty, 0)})
          </h3>
          <button onClick={onClose} style={{ color: '#94a3b8' }}><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {cart.length === 0 && (
            <p className="text-sm text-center mt-10" style={{ color: '#6b7280' }}>Your cart is empty.</p>
          )}
          {cart.map((l) => (
            <div key={`${l.id}-${l.size}`} className="glass-card p-3 flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                style={{ background: `linear-gradient(135deg, ${l.colors[0]}22, ${l.colors[1]}33)` }}
              >
                {l.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>{l.name}</p>
                <p className="text-xs" style={{ color: '#6b7280' }}>{l.size} · ${l.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => onUpdateQty(l, l.qty - 1)} style={{ color: '#94a3b8' }}><Minus size={13} /></button>
                <span className="w-6 text-center text-sm" style={{ color: '#e2e8f0' }}>{l.qty}</span>
                <button onClick={() => onUpdateQty(l, l.qty + 1)} style={{ color: '#94a3b8' }}><Plus size={13} /></button>
              </div>
              <button onClick={() => onRemove(l)} style={{ color: '#ef4444' }}><Trash2 size={15} /></button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: '#2a2a3d' }}>
            <div className="flex justify-between mb-1">
              <span className="text-sm" style={{ color: '#94a3b8' }}>Subtotal</span>
              <span className="font-bold" style={{ color: '#e2e8f0' }}>${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs mb-3" style={{ color: freeShip ? '#22c55e' : '#6b7280' }}>
              {freeShip ? '✓ Free shipping unlocked' : `Add $${(50 - subtotal).toFixed(2)} more for free shipping`}
            </p>
            <button
              onClick={checkout}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-sm text-white"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #9c8fff)' }}
            >
              <Mail size={16} /> Checkout via Email Order
            </button>
            <p className="text-xs text-center mt-2" style={{ color: '#6b7280' }}>
              Card checkout coming soon — orders are confirmed by email for now.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Storefront({ cart, onSaveCart }) {
  const [category, setCategory] = useState('All')
  const [openProduct, setOpenProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)

  const products = useMemo(
    () => (category === 'All' ? PRODUCTS : PRODUCTS.filter((p) => p.category === category)),
    [category]
  )

  const addToCart = (product, size, qty) => {
    const existing = cart.find((l) => l.id === product.id && l.size === size)
    let updated
    if (existing) {
      updated = cart.map((l) => (l.id === product.id && l.size === size ? { ...l, qty: l.qty + qty } : l))
    } else {
      updated = [...cart, { id: product.id, name: product.name, price: product.price, size, qty, emoji: product.emoji, colors: product.colors }]
    }
    onSaveCart(updated)
    setCartOpen(true)
  }

  const updateQty = (line, qty) => {
    if (qty <= 0) return removeLine(line)
    onSaveCart(cart.map((l) => (l.id === line.id && l.size === line.size ? { ...l, qty } : l)))
  }

  const removeLine = (line) => {
    onSaveCart(cart.filter((l) => !(l.id === line.id && l.size === line.size)))
  }

  const cartCount = cart.reduce((s, l) => s + l.qty, 0)

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="glass-card accent-glow overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: 'radial-gradient(circle at 80% 20%, rgba(108,99,255,0.4), transparent 60%)' }}
        />
        <div className="relative p-8 sm:p-12 max-w-2xl">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: 'rgba(108,99,255,0.15)', color: '#9c8fff' }}
          >
            <Sparkles size={12} /> Post-tournament drop — summer 2026
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 leading-tight" style={{ color: '#e2e8f0' }}>
            Retro football style.<br />
            <span style={{ color: '#6c63ff' }}>No logos, all love.</span>
          </h1>
          <p className="text-sm sm:text-base mb-6" style={{ color: '#94a3b8' }}>
            Vintage-inspired shirts and matchday gear celebrating the beautiful game —
            designed clean, shipped tracked, sized for real fans.
          </p>
          <button
            onClick={() => document.getElementById('shop-grid')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, #6c63ff, #9c8fff)' }}
          >
            Shop the collection <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Trust bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass-card p-4 flex items-center gap-3">
          <Truck size={18} style={{ color: '#6c63ff' }} />
          <span className="text-sm" style={{ color: '#94a3b8' }}>{STORE.shippingNote}</span>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <ShieldCheck size={18} style={{ color: '#22c55e' }} />
          <span className="text-sm" style={{ color: '#94a3b8' }}>{STORE.guarantee}</span>
        </div>
      </div>

      {/* Category filter + cart */}
      <div id="shop-grid" className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="px-4 py-2 rounded-lg text-sm font-medium border"
              style={{
                borderColor: category === c ? '#6c63ff' : '#2a2a3d',
                backgroundColor: category === c ? 'rgba(108,99,255,0.12)' : 'transparent',
                color: category === c ? '#9c8fff' : '#94a3b8',
              }}
            >
              {c}
            </button>
          ))}
        </div>
        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border"
          style={{ borderColor: '#2a2a3d', color: '#e2e8f0' }}
        >
          <ShoppingCart size={16} /> Cart
          {cartCount > 0 && (
            <span
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
              style={{ backgroundColor: '#6c63ff' }}
            >
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {products.map((p) => (
          <ProductTile key={p.id} product={p} onOpen={setOpenProduct} />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs text-center pb-4" style={{ color: '#6b7280' }}>
        All designs are original, unbranded tributes. Mundial Vault is not affiliated with any club, federation, or governing body.
      </p>

      {openProduct && <ProductModal product={openProduct} onClose={() => setOpenProduct(null)} onAdd={addToCart} />}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} onRemove={removeLine} />}
    </div>
  )
}
