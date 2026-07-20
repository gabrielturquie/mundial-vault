# Mundial Vault — Dropshipping Playbook

Written July 2026, the day after the World Cup final. This is your operating
manual: what to sell, where to source it, what's legal, and how orders flow.

## 1. The product strategy (and why)

**Do NOT dropship replica jerseys with real club crests, brand logos, or
player names.** That is trademark/copyright infringement — clubs, brands, and
FIFA actively sue and file platform takedowns against small sellers. It will
also get your payment processor account (Stripe/PayPal) banned, which is
business-ending.

The legal, proven alternative — and what the catalog in
`src/data/products.js` is built on:

| Category | Products | Why it works |
|---|---|---|
| Retro Collection | Unbranded vintage-style shirts ($34.99) | Retro football aesthetics aren't trademarked; fans recognize "the '70 gold shirt" without any logo |
| Nation Fanwear | Nation-color tees, hoodies, scarves | National colors and flags are free to use; 48 World Cup nations = 48 audiences |
| Matchday Accessories | Clear stadium bags, flag capes, watch party kits | Problem-solvers (stadium bag policy) and party items; zero IP risk |

**Timing:** the 2026 World Cup (June 11 – July 19) just ended. Post-tournament
demand runs strong through August (celebration merch for the winner's fans,
retro nostalgia, end-of-summer parties). Then pivot to the European club season
(retro styles run year-round) and start building for the 2027 Copa América /
Women's World Cup cycles.

## 2. Sourcing

Ordered by how fast you can start:

1. **Print-on-demand (start here, this week):** Printful or Printify.
   Upload nation-color designs → they print and ship per order, no inventory,
   integrates with Shopify/Etsy. Margins ~40–50% at the prices in the catalog.
2. **Dropship aggregators:** CJdropshipping, Zendrop, AutoDS — search
   "retro football shirt no logo", "fan scarf", "clear stadium bag",
   "flag cape". They handle supplier + shipping with tracking.
3. **Wholesale (later, better margins):** Global Sources / Alibaba suppliers
   with low MOQs (some do 10 pieces). Only once a product is proven.

Fill in each product's `supplierUrl` in `src/data/products.js` as you lock in
suppliers — it's your private fulfillment map, not shown to customers.

**Supplier vetting checklist:** order a sample first · confirm tracked
shipping under 14 days to the US · confirm no branded/counterfeit items in
their catalog photos of what they'd ship you · get their returns policy in
writing.

## 3. How orders flow today (and how to upgrade)

**Today (v1, zero cost):** customer builds a cart on the site → "Checkout via
Email Order" opens a pre-filled email to you → you invoice them (PayPal
invoice or Stripe payment link) → you place the order with the supplier using
the customer's address → forward tracking number.

**Upgrade path (do this within 2 weeks):**
1. Create a [Stripe Payment Link](https://stripe.com/payments/payment-links)
   per product (5 minutes each, no code).
2. Paste each link into the product's `checkoutUrl` field in
   `src/data/products.js`.
3. When volume justifies it (~10 orders/week), move the storefront to
   Shopify Basic ($39/mo) for real checkout + AutoDS/Printful auto-fulfillment,
   and keep this site as your marketing landing page.

## 4. Unit economics

Using catalog estimates (verify against real supplier quotes):

| Product | Price | Est. cost | Ship est. | Gross margin |
|---|---|---|---|---|
| Retro shirt | $34.99 | ~$11 | ~$5 | ~54% |
| Nation tee (POD) | $24.99 | ~$8 | ~$4 | ~52% |
| Hoodie | $44.99 | ~$16 | ~$6 | ~51% |
| Scarf | $14.99 | ~$4 | ~$3 | ~53% |
| Stadium bag | $19.99 | ~$6 | ~$4 | ~50% |
| Watch party kit | $29.99 | ~$10 | ~$5 | ~50% |

Rule of thumb for paid ads: you need ≥60% gross margin OR an average order
value ≥$50 to profitably run ads. That's why the site pushes the $50 free
shipping threshold — bundle a scarf or flag cape with every shirt.

Track every real order in the **Inventory** tab and every ad dollar in the
**Dashboard → Expenses** tab you already have. Your profit dashboard is
already built — use it from order #1.

## 5. Legal & admin checklist

- [ ] Keep all designs unbranded — no crests, no brand stripes/chevrons that
      imitate Nike/Adidas trade dress, no player names or likenesses
- [ ] The site already carries a non-affiliation disclaimer (footer) — keep it
- [ ] Publish a shipping policy + returns policy page before running ads
- [ ] Register a sole proprietorship / LLC once revenue is real (~first $1k)
- [ ] Sales tax: US marketplaces/processors handle most of it; check your
      state's threshold
- [ ] Use a business email (orders@ on your own domain) — currently orders go
      to your Gmail (set in `src/data/products.js` → `STORE.orderEmail`)

## 6. This repo

- `src/data/products.js` — catalog, prices, checkout links, supplier map. **This is your control panel.**
- `src/components/Storefront.jsx` — the public shop (default tab)
- Inventory / Listing Generator / Dashboard tabs — your back office
- Deploys to GitHub Pages automatically on push to `main`

## Sources

- [Quora — Can clubs sue me for dropshipping football jerseys?](https://www.quora.com/Can-clubs-and-brands-sue-me-for-copyright-if-I-start-dropshipping-with-football-jerseys)
- [Syncee — Winning World Cup 2026 dropshipping products](https://syncee.com/blog/drop-shipping/world-cup-2026-dropshipping-products/)
- [CJdropshipping — Best products for the 2026 World Cup](https://cjdropshipping.com/blogs/winning-products/best-dropshipping-products-2026-world-cup)
- [AK Dropshipping — World Cup 2026 e-commerce guide](https://www.akdropshipping.com/blog/world-cup-2026-ecommerce-trends-and-dropshipping-guide.html)
- [Merchize — Best POD products for World Cup 2026](https://merchize.com/best-products-to-sell-on-world-cup/)
- [Global Sources — wholesale soccer jerseys](https://www.globalsources.com/manufacturers/soccer-jersey.html)
