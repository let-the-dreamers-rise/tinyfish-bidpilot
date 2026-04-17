# BidPilot Lessons

## April 11, 2026 — Stress Test Results

### Core Lesson
A hackathon demo ≠ a product. The gap between "polished UI with mock data" and "fundable business" is:
1. **Data persistence** (database, file storage)
2. **User authentication** (accounts, sessions)
3. **Real customer validation** (pilot users, LOIs)
4. **Revenue model** (pricing, billing)
5. **Portal coverage proof** (10+ real TinyFish runs documented)

### Pattern to Avoid
- Don't spend more time on landing page aesthetics when the core product loop has zero persistence
- Don't hardcode demo data when a database + real data would be equally easy and 100x more convincing
- Don't leave submission templates with placeholder text (`PASTE_X_POST_URL_HERE`)

### Pattern to Follow
- Talk to customers BEFORE building more UI
- Run real TinyFish workflows and document results BEFORE writing marketing copy about them
- Build backend infrastructure (auth, DB, file storage) BEFORE adding more frontend features

## April 15, 2026 — Pre-Pilot Critical Analysis

### Lesson: Priority Inversion
- Time spent on landing page CSS > time spent on actual portal runs
- `page.tsx` (317 lines of marketing) + `vendor-ops-data.ts` (335 lines of mock data) > `tinyfish.ts` (134 lines of actual integration)
- Submission files still contain `PASTE_X_POST_URL_HERE` — an unforgivable oversight that signals "not finished"

### Lesson: Use All 4 TinyFish APIs
- TinyFish expanded to 4 products: Web Agent, Web Search, Web Fetch, Web Browser
- BidPilot only uses Web Agent (1 of 4)
- Web Search → discover new RFPs, Web Fetch → parse bid docs, Web Browser → session management
- Not using them means missing TinyFish's "compound value" thesis: "One task. Four APIs. Zero routing code."

### Lesson: Mock Data in Production = Credibility Death
- `vendor-ops-data.ts` is 335 lines of fake vendors (Northstar, Atlas, Vertex)
- When judges/pilots see this next to real Supabase queries, it destroys trust
- Rule: if Supabase is connected, delete ALL hardcoded mock data

## April 12, 2026 — Supabase TypeScript Typing

### Lesson: Supabase generic types with relational `.select()` queries
- Supabase v2's `.from("table")` + `.select("*, relation(...)") ` infers `data` as `never` when using relational queries
- The fix: use explicit type assertions `as { data: T | null }` on query results
- Don't try to make Supabase Relationships generics work perfectly — use `as any` on mutation operations (`.insert()`, `.update()`, `.upsert()`) and typed assertions on select results
- This is a known limitation of Supabase's TypeScript tooling with complex joined queries

### Lesson: Next.js 16 — useSearchParams requires Suspense
- `useSearchParams()` in a page that gets statically generated **must** be wrapped in `<Suspense>` boundary
- Next.js 16 also deprecates `middleware.ts` in favor of `proxy` — this is a non-blocking warning for now
