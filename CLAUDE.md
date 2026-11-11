# The Lucky Mat website

Custom site, bookings, ticketing, payments and enquiries for The Lucky Mat (mobile mat Pilates, Melbourne). Built with Claude Code, shipped through GitHub and Vercel.

## Stack

- Next.js 16 (App Router, TypeScript), plain CSS with CSS modules. No Tailwind.
- Planned: Neon Postgres + Drizzle, Stripe Payment Element + Invoicing + webhooks, Resend email, Auth.js magic link, Vercel Blob.

## Brand rules (non-negotiable)

- Tokens live in `src/app/globals.css` `:root`, copied from the brand system (`brand/system/lucky-brand.css` in the project files). Never hard-code hex outside `:root` or `src/lib/brand.ts`.
- Lead colour is heritage red `#A21F2B`. No black anywhere. Chocolate `#3B2116` is the darkest colour.
- Fonts: DM Serif Display, Instrument Serif, Archivo (variable width), DM Mono. Nothing else on the site.
- Square corners, no shadows, gradients, glows, emoji or stock icons.
- Copy: collective "we", Australian spelling, no em dashes, no full stop or exclamation mark after headlines. Banned words include elevate, unlock, seamless, curated, journey, bespoke, vibrant.
- Never use the old business name.

## Prices and dates

- Prices are in `src/lib/offers.ts` and `src/lib/park.ts` (locked 4 Nov 2026). Not GST registered, so never show "+ GST".
- Park: Sundays 8am from Sun 6 Dec 2026, $25 or $35 for two, 20 mats. No classes 20 Dec to 3 Jan, back Sun 10 Jan. Rain cancellations come back as credit.
- Thu 31 Dec "Sweat out the year" event: tickets on sale by Thu 3 Dec. Time, place and price still to come.

## Build slices

| Ship by | Slice |
|---|---|
| Fri 13 Nov | Ground: domain, repo, Vercel, Stripe, Neon, Resend |
| Sun 15 Nov | Launch link: home, /park booking and checkout, real-payment test before the Mon 16 Nov 7am post |
| Fri 20 Nov | Events: hens, corporate, brands, private, deposits, invoices, enquiry form |
| Fri 27 Nov | Ops: admin, rain cancel with credit, My Lucky Mat |
| Thu 3 Dec | Tickets for 31 Dec |
| Mon 7 Dec | Vouchers, credits, teacher PDF downloads |
| Sat 2 Jan | Sundays back from 10 Jan, waitlist |

## Park bookings (slice 1)

- Flow: `/park` → `/park/book/[date]` form → server action holds the mats (pending row) → Stripe Checkout (30 min expiry) → `/park/booked` (also checks Stripe directly) or `/park/cancelled` (frees the hold).
- `src/lib/bookings.ts`: capacity is paid rows plus pending rows under 35 min old, capped at 20, with a per-date advisory lock so two buyers can't take the last mat.
- Schema is created on first query by `ready()` in `src/lib/db.ts` (no migration tool yet).
- Webhook: `POST /api/stripe/webhook` for `checkout.session.completed`, `.expired`, `.async_payment_succeeded`, `.async_payment_failed`.
- Booking links only show when `DATABASE_URL` and `STRIPE_SECRET_KEY` are both set.

## Environment variables (set in Vercel, never commit)

- `DATABASE_URL` (Neon via Vercel Storage)
- `STRIPE_SECRET_KEY` (test key until the real-payment test)
- `STRIPE_WEBHOOK_SECRET` (signing secret of the webhook endpoint)

## Commands

- `npm run dev`, `npm run build`, `npm run lint`. Run build and lint before every push.
