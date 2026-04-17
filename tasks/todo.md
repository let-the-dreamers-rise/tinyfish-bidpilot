# BidPilot → Real Product: Task Tracker

## Phase 1: Infrastructure (Supabase + Auth + Storage)
- [x] Install dependencies (@supabase/supabase-js, @supabase/ssr)
- [x] Create Supabase client (browser)
- [x] Create Supabase server client
- [x] Create database types
- [x] Create SQL schema file
- [x] Create middleware for auth route protection
- [x] Update .env.example
- [x] Update layout with Supabase session

## Phase 2: Auth Pages
- [x] Sign-in page (dark theme, email/password + GitHub OAuth)
- [x] Sign-up page (creates team automatically)
- [x] Auth layout
- [x] Onboarding wizard (post-signup)
- [x] User nav component (avatar, dropdown, sign out)
- [x] Auth callback route
- [x] Suspense boundary for useSearchParams (Next.js 16 requirement)

## Phase 3: Core Product (Real CRUD)
- [x] API: Packets CRUD (list, create, get, update, delete)
- [x] API: Document upload (multipart → Supabase Storage)
- [x] API: TinyFish runs (create + persist + poll + update)
- [x] API: Audit trail (automatic logging)
- [x] API: Portal intelligence (learn from runs)
- [x] Create packet dialog component
- [x] Document uploader component
- [x] Modify workspace to use real data from Supabase
- [x] Modify launchpad to persist runs
- [x] Modify workspace layout with user nav

## Phase 4: Business Layer
- [x] Pricing page (3 tiers: Free, $79/mo Pro, Enterprise)
- [x] Update landing page hero copy (user-speak, not founder-speak)
- [x] Dashboard with real metrics from DB
- [x] Workspace settings page

## Phase 5: Verification
- [x] npx tsc --noEmit passes (0 errors)
- [x] npm run build passes (14/14 routes)
- [ ] Full flow test: signup → onboard → create packet → upload doc → launch run → audit
- [ ] Deploy to Vercel and verify live

## Remaining work (from stress test)
- [ ] Set up Supabase project and run schema.sql
- [ ] Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
- [ ] Run 10 real TinyFish executions across portals
- [ ] Record 2-3 min demo video
- [ ] Talk to 5 procurement ops people
- [ ] Get an LOI
