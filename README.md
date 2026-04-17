# BidPilot

**Supplier Portal Automation for Procurement Teams**

BidPilot turns vendor onboarding into executable web labor. Build your vendor packet once — BidPilot's AI agent fills every supplier portal, uploads your documents, and saves the draft. Your team reviews before anything goes live.

## Live Links

- **App:** https://tinyfish-bidpilot-puxfju1tx-ashwin-goyals-projects.vercel.app
- **Product Tour:** https://tinyfish-bidpilot-puxfju1tx-ashwin-goyals-projects.vercel.app/demo
- **Repo:** https://github.com/let-the-dreamers-rise/tinyfish-bidpilot

## The Problem

Enterprise procurement teams spend 6+ hours per vendor filling supplier portals like Ariba, Coupa, and Jaggaer. It's repetitive, error-prone, and impossible to scale. The "last mile" of procurement — the actual portal work — is still entirely manual.

## The Solution

BidPilot separates preparation from execution:

1. **Build the packet** — Collect legal details, tax forms, insurance, and compliance documents in one reusable vendor packet
2. **Launch the agent** — TinyFish navigates the live portal, fills every field, uploads attachments, and saves the draft
3. **Review and approve** — Your team inspects the saved draft before any final submission is allowed

## Product Architecture

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 App Router, React 19, Tailwind CSS 4 |
| Auth | Supabase Auth with session management |
| Database | Supabase Postgres with Row-Level Security on all 7 tables |
| Storage | Supabase Storage with encrypted document vault |
| Payments | Razorpay (PCI DSS compliant) |
| Automation | TinyFish — 4 APIs under one key |
| Deployment | Vercel (Edge Network) |

## TinyFish Integration — All 4 APIs

BidPilot uses every TinyFish API product under a single API key:

| API | Endpoint | Used For |
|---|---|---|
| **Web Search** | `search.tinyfish.ai` | Discover RFPs, vendor registrations, and procurement opportunities |
| **Web Fetch** | `fetch.tinyfish.ai` | Extract portal requirements, form fields, and compliance signals |
| **Web Agent** | `agent.tinyfish.ai` | Navigate portals, fill forms, upload documents, save drafts |
| **Web Browser** | `browser.tinyfish.ai` | Stealth browser sessions for authenticated portal inspection |

## API Surface

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/tinyfish/config` | GET | Check if live mode is enabled |
| `/api/tinyfish/run` | POST | Launch an asynchronous TinyFish agent run |
| `/api/tinyfish/run/[id]` | GET | Poll run status, steps, and results |
| `/api/tinyfish/search` | GET | Search the web via TinyFish Search |
| `/api/tinyfish/fetch` | POST | Extract content from URLs via TinyFish Fetch |
| `/api/tinyfish/browser` | POST | Create a browser session via TinyFish Browser |
| `/api/payments/razorpay` | POST | Create a Razorpay order for subscription |
| `/api/payments/razorpay/verify` | POST | Verify payment signature and upgrade plan |
| `/api/packets` | GET/POST | List and create vendor packets |
| `/api/packets/[id]` | GET/PATCH/DELETE | Manage individual packets |
| `/api/packets/[id]/documents` | GET/POST | Manage packet documents |

## Dashboard Pages

| Page | Description |
|---|---|
| **Overview** | Real-time metrics from Supabase — packets, runs, documents, activity feed |
| **Packets** | Create, manage, and track vendor onboarding packets |
| **Runs** | Monitor TinyFish agent executions with live polling |
| **Audit** | Immutable log of every action taken by human or agent |
| **Portal Intel** | Learned patterns from TinyFish executions across portals |
| **Discover** | Search the live web for procurement opportunities (Web Search + Web Fetch) |
| **Scanner** | Scan any portal URL to extract requirements and launch browser sessions |
| **Settings** | Team, profile, and integration management |

## Security

- **Encryption:** AES-256 at rest, TLS 1.3 in transit
- **Auth:** Supabase Auth with middleware-enforced session checks
- **Database:** Row-Level Security policies on every table
- **Credentials:** TinyFish Vault — portal passwords never touch our servers
- **Execution Policy:** Read-only or draft-save modes by default. No irreversible actions without human approval.
- **Audit:** Immutable audit trail of every action

## Environment Variables

Create `.env.local` from `.env.example` and set:

```env
TINYFISH_API_KEY=your_tinyfish_key
TINYFISH_API_BASE=https://agent.tinyfish.ai/v1
BIDPILOT_DEMO_CODE=optional_access_code

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## Local Setup

```bash
npm install
cp .env.example .env.local
# Add your keys to .env.local
npm run dev
# Open http://localhost:3000
```

## Deployment

The app is deployed on Vercel and linked to the GitHub repository. All environment variables are configured on Vercel for development, preview, and production environments.

## Submission Assets

The repo includes ready-to-use assets in `submission/`:

- `LOI_TEMPLATE.md` — Non-binding Letter of Intent for pilot customers
- `OUTREACH_TEMPLATES.md` — LinkedIn, email, and objection-handling scripts
- `DEMO_CHECKLIST.md` — Pre-demo verification steps
- `PILOT_OUTREACH.md` — Pilot program details
- `capability-statement.pdf` — Company capability statement

## Validation

- `npm run build` — passes clean
- `npx tsc --noEmit` — zero type errors
- Real TinyFish smoke test completed through the live app
- Live Vercel deployment verified
- All 4 TinyFish APIs tested and integrated
