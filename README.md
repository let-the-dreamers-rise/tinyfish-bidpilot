# BidPilot

BidPilot is a TinyFish-native demo app for live portal automation. It combines:

- a cinematic landing and operator-console experience
- a simulated command deck for hackathon-safe storytelling
- a real TinyFish launch pad that creates async runs and polls run status when `TINYFISH_API_KEY` is configured

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and add your TinyFish key:

```bash
cp .env.example .env.local
```

3. Set:

```bash
TINYFISH_API_KEY=your_key_here
TINYFISH_API_BASE=https://agent.tinyfish.ai/v1
```

4. Run the dev server:

```bash
npm run dev
```

5. Open:

```bash
http://localhost:3000
```

## Live Mode

Without `TINYFISH_API_KEY`, the app still works in demo mode.

With `TINYFISH_API_KEY`, the launch pad uses:

- `POST /api/tinyfish/run` -> proxies to TinyFish `POST /v1/automation/run-async`
- `GET /api/tinyfish/run/[id]` -> proxies to TinyFish `GET /v1/runs/{id}`
- `GET /api/tinyfish/config` -> reports whether live mode is enabled

## Commands

```bash
npm run dev
npm run lint
npm run build
```
