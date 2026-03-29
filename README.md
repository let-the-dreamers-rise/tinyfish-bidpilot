# BidPilot

BidPilot turns proposal operations into executable web labor.

It is a TinyFish-native Next.js app for teams that lose hours to portal work: opening procurement sites, locating bid entry points, navigating multi-step forms, and pushing toward submission-ready drafts. The product pairs a cinematic landing page with a real TinyFish launch pad so the demo can tell a strong story and also perform live work on the web.

## Live Links

- App: https://tinyfish-bidpilot-puxfju1tx-ashwin-goyals-projects.vercel.app
- Repo: https://github.com/let-the-dreamers-rise/tinyfish-bidpilot

## Why This Exists

Most AI demos stop at drafting. Real operations teams still have to do the ugly last-mile browser work themselves:

- log in to web portals
- find the right section
- carry context across multiple screens
- upload the right files
- save progress and stop at approval

BidPilot is built around the idea that proposal software should not just suggest answers. It should actually move through the live web and get work done.

## What The App Does

- presents a bold landing page for hackathon demos, judge walkthroughs, and product storytelling
- simulates an operator console for safe narrative framing even when you do not want to spend live credits
- launches real TinyFish runs through a server-side API layer
- polls run status, recent steps, and final result payloads in the UI
- supports stealth or lite browser profiles, `read-only` and `draft-save` execution policies, proxy configuration, and optional TinyFish Vault credentials

## Product Surfaces

### 1. Landing Experience

The homepage positions BidPilot as a portal automation system for bids, security questionnaires, and onboarding-heavy workflows.

### 2. Operator Console

The operator console gives you a cinematic command-deck feel for pitch videos and live walkthroughs.

### 3. TinyFish Launch Pad

The launch pad is the real engine. It accepts a target URL and goal, starts an asynchronous TinyFish automation run, and streams the status back into the app.

## Verified Live Run

A real smoke test was successfully completed against `https://bidnet.com` through this app.

The agent:

- opened BidNet
- located the vendor login entry point
- identified the primary bid-search entry point
- extracted visible call-to-action labels from the landing page
- stopped without logging in, submitting anything, or modifying data

This proves the full path is live:

`BidPilot UI -> Next.js API routes -> TinyFish API -> live run polling -> result payload`

## Architecture

- frontend: Next.js 16 App Router, React 19, Tailwind CSS 4
- server routes: `/api/tinyfish/config`, `/api/tinyfish/run`, `/api/tinyfish/run/[id]`
- TinyFish client: typed wrapper for async run creation and run polling
- deployment: Vercel
- source control: GitHub

## Core Flow

1. The UI asks the local API whether TinyFish is enabled.
2. When live mode is enabled, the user launches a run with a target URL and goal.
3. The server route forwards the request to TinyFish using `X-API-Key`.
4. TinyFish returns a `run_id`.
5. The UI polls the run endpoint until it reaches a terminal state.
6. The user sees status, recent actions, and the final result payload.

## Environment Variables

Create `.env.local` from `.env.example` and set:

```env
TINYFISH_API_KEY=your_tinyfish_key
TINYFISH_API_BASE=https://agent.tinyfish.ai/v1
```

Important:

- keep `TINYFISH_API_KEY` server-side only
- do not prefix it with `NEXT_PUBLIC_`
- the app falls back to demo mode when the key is missing

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the env template:

```bash
cp .env.example .env.local
```

3. Add your TinyFish key to `.env.local`.

4. Start the app:

```bash
npm run dev
```

5. Open:

```bash
http://localhost:3000
```

## API Surface

- `GET /api/tinyfish/config`
  Returns whether live mode is enabled and the default browser settings.

- `POST /api/tinyfish/run`
  Starts a TinyFish async run using the submitted URL, goal, browser profile, execution policy, proxy configuration, vault toggle, and optional TinyFish Vault credential item IDs.

- `GET /api/tinyfish/run/[id]`
  Polls a single TinyFish run and returns its latest status, steps, stream link, and result payload.

## Demo Strategy

For a low-risk live demo:

- use the verified BidNet preset first
- show the run ID and status changes in real time
- open the result payload to prove the agent actually did browser work
- keep credentialed flows for a second demo after the smoke test succeeds

## Deployment

The app is deployed on Vercel and linked to the GitHub repository above. TinyFish environment variables are configured on Vercel for development, preview, and production environments.

## Submission Assets

The repo includes a ready-to-use submission pack in `submission/`:

- `HACKEREARTH_SUBMISSION.md`
- `X_POST.md`
- `DEMO_CHECKLIST.md`
- `PILOT_OUTREACH.md`

## Security Notes

- never commit `.env.local`
- rotate the TinyFish API key if it is ever shared publicly
- keep destructive or credentialed automations behind deliberate human approval steps

## Validation

The project has been validated with:

- `npm run lint`
- `npm run build`
- a real TinyFish smoke test completed through the local app
- a live Vercel deployment

## Next Steps

- add domain branding and a custom demo video
- introduce saved workflow templates per portal
- add approval checkpoints before final submit
- support credentialed TinyFish Vault flows for real customer portals
