# BidPilot HackerEarth Submission

## Project Name

BidPilot

## One-Line Pitch

BidPilot is the approval-gated submission agent for proposal teams working inside government and enterprise portals.

## Public Links

- X post: https://x.com/ashgoyal1990
- Live app: https://tinyfish-bidpilot-puxfju1tx-ashwin-goyals-projects.vercel.app
- GitHub repo: https://github.com/let-the-dreamers-rise/tinyfish-bidpilot

## Business Case

Proposal teams already use AI to draft answers, but they still lose hours inside procurement portals doing repetitive browser work: navigating forms, resolving required fields, uploading attachments, saving drafts, and routing approvals. BidPilot exists because that last-mile execution work is still manual, expensive, and repeated every single bid cycle. The primary buyer is the proposal manager or capture lead at a small or mid-market government contractor that responds to bids every month. A team handling around 8 bids per month at 25 hours per bid can recover meaningful labor if even 70% of portal work is automated. BidPilot starts with one sharp wedge, save draft and stop at review, and can later expand into security questionnaires, DDQs, and supplier onboarding.

## Technical Architecture

BidPilot is a Next.js 16 App Router application with a TinyFish-native runtime layer. The frontend provides a launch pad for configuring real runs, including browser profile, proxy settings, execution policy, and optional TinyFish Vault credential item IDs for authenticated workflows. Server-side route handlers under `/api/tinyfish/*` keep the TinyFish API key private and proxy requests to TinyFish async automation endpoints. The run API enforces execution guardrails through two policies: `read-only` for audit/extraction workflows and `draft-save` for authenticated workflows that may log in, fill fields, and upload documents but must stop before final irreversible submit actions. The UI polls TinyFish run state in real time and renders run status, recent steps, audit-friendly payloads, and trust-layer context directly inside the product. TinyFish is core infrastructure, not optional plumbing, because all live-web interaction, browser execution, and authenticated surface handling are powered through TinyFish runs.

## Safety / Trust

BidPilot is approval-gated, audit-logged, and explicitly blocks blind final submit behavior.

## Recommended Screenshot Set

1. Hero plus buyer/value proposition
2. ROI section plus trust stack
3. Launch pad with execution policy and Vault credential input
4. Live run panel with steps and result payload
