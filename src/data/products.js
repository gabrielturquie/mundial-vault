// Product catalog for the Mundial Vault storefront.
//
// Every product here is intentionally UNBRANDED — no club crests, no brand
// logos, no player names — so it can be dropshipped legally without a
// license. See docs/PLAYBOOK.md for sourcing and legal notes.
//
// checkoutUrl: paste a Stripe Payment Link (or Shopify/Gumroad link) per
// product to take real payments. While null, the cart falls back to an
// email order flow.
// supplierUrl: private note for you — where to fulfill the order from.

export const CATEGORIES = ['All', 'Retro Collection', 'Nation Fanwear', 'Matchday Accessories']

export const PRODUCTS = [
  // ── Retro Collection ─────────────────────────────────────────────
  {
    id: 'retro-90s-madrid-white',
    name: "Retro '90s Classic White Shirt",
    category: 'Retro Collection',
    price: 34.99,
    compareAt: 49.99,
    estimatedCost: 11,
    description:
      'A clean homage to the iconic all-white kits of the 90s. Premium breathable polyester, vintage collar, no logos — just pure retro style.',
    colors: ['#f8fafc', '#c7b45e'],
    emoji: '👕',
    badge: 'Best Seller',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    checkoutUrl: null,
    supplierUrl: '',
  },
  {
    id: 'retro-azzurri-blue',
    name: "Retro '82 Azure Blue Shirt",
    category: 'Retro Collection',
    price: 34.99,
    compareAt: 49.99,
    estimatedCost: 11,
    description:
      'Inspired by the legendary azure kits of Italian football history. Old-school fit, embroidered generic laurel badge, vintage numbering available.',
    colors: ['#1d4ed8', '#93c5fd'],
    emoji: '👕',
    badge: null,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    checkoutUrl: null,
    supplierUrl: '',
  },
  {
    id: 'retro-brasil-gold',
    name: "Retro '70 Samba Gold Shirt",
    category: 'Retro Collection',
    price: 34.99,
    compareAt: 49.99,
    estimatedCost: 11,
    description:
      'The golden era, bottled. Canary yellow with green trim, 1970s cut, zero trademarks — a tribute every fan recognizes instantly.',
    colors: ['#facc15', '#16a34a'],
    emoji: '👕',
    badge: 'Hot',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    checkoutUrl: null,
    supplierUrl: '',
  },

  // ── Nation Fanwear ───────────────────────────────────────────────
  {
    id: 'nation-tee-custom',
    name: 'Custom Nation Colors Tee',
    category: 'Nation Fanwear',
    price: 24.99,
    compareAt: 34.99,
    estimatedCost: 8,
    description:
      'Pick your country, we print your colors. Soft-touch cotton tee with your name and number on the back. 48 nations available.',
    colors: ['#ef4444', '#f8fafc'],
    emoji: '🎽',
    badge: 'Customizable',
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    checkoutUrl: null,
    supplierUrl: '',
  },
  {
    id: 'nation-hoodie',
    name: 'Nation Colors Hoodie',
    category: 'Nation Fanwear',
    price: 44.99,
    compareAt: 59.99,
    estimatedCost: 16,
    description:
      'Heavyweight fleece hoodie in your national colors with an embroidered flag chest patch. Perfect for cold matchday evenings.',
    colors: ['#0ea5e9', '#f8fafc'],
    emoji: '🧥',
    badge: null,
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    checkoutUrl: null,
    supplierUrl: '',
  },
  {
    id: 'nation-scarf',
    name: 'Woven Nation Scarf',
    category: 'Nation Fanwear',
    price: 14.99,
    compareAt: 22.99,
    estimatedCost: 4,
    description:
      'Classic double-sided woven fan scarf in national colors. The single most-purchased fan item during tournaments.',
    colors: ['#dc2626', '#facc15'],
    emoji: '🧣',
    badge: 'Top Rated',
    sizes: ['One Size'],
    checkoutUrl: null,
    supplierUrl: '',
  },

  // ── Matchday Accessories ─────────────────────────────────────────
  {
    id: 'acc-stadium-bag',
    name: 'Clear Stadium Bag',
    category: 'Matchday Accessories',
    price: 19.99,
    compareAt: 29.99,
    estimatedCost: 6,
    description:
      'Stadium-policy-compliant transparent crossbody bag. Required at most US venues — a problem-solver product, not just merch.',
    colors: ['#94a3b8', '#e2e8f0'],
    emoji: '👜',
    badge: 'Problem Solver',
    sizes: ['One Size'],
    checkoutUrl: null,
    supplierUrl: '',
  },
  {
    id: 'acc-flag-cape',
    name: 'Fan Flag Cape (48 Nations)',
    category: 'Matchday Accessories',
    price: 12.99,
    compareAt: 19.99,
    estimatedCost: 3,
    description:
      'Wearable 3x5 flag cape with collar snap. The photo-op product — shows up in every fan zone picture.',
    colors: ['#16a34a', '#f8fafc'],
    emoji: '🚩',
    badge: null,
    sizes: ['One Size'],
    checkoutUrl: null,
    supplierUrl: '',
  },
  {
    id: 'acc-watch-party-kit',
    name: 'Watch Party Kit',
    category: 'Matchday Accessories',
    price: 29.99,
    compareAt: 44.99,
    estimatedCost: 10,
    description:
      'Everything for a match night at home: 2 mini flags, face paint sticks, noise clappers, drink markers and a penalty-shootout drinking game card set.',
    colors: ['#a855f7', '#facc15'],
    emoji: '🎉',
    badge: 'Bundle',
    sizes: ['One Size'],
    checkoutUrl: null,
    supplierUrl: '',
  },
]

export const STORE = {
  name: 'Mundial Vault',
  tagline: 'Retro football style. No logos, all love.',
  orderEmail: 'turquieburstein@gmail.com',
  shippingNote: 'Free tracked shipping on orders over $50 · 7–14 day delivery',
  guarantee: '30-day fit guarantee — wrong size, we reship free.',
}
