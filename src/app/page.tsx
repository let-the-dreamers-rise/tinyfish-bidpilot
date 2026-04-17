import Image from "next/image";
import Link from "next/link";

import { RoiCalculator } from "@/components/roi-calculator";

const signalLanes = [
  {
    label: "Primary buyer",
    value: "Procurement ops",
    note: "Vendor onboarding, supplier enablement, AP ops, and teams stuck in external supplier portals.",
  },
  {
    label: "Wedge",
    value: "External portal execution",
    note: "Complete packet work, upload artifacts, save the draft, and stop at approval.",
  },
  {
    label: "Why now",
    value: "Last-mile work is still manual",
    note: "Companies already have procurement systems, but the ugly portal handoff still burns operator time.",
  },
];

const executionSteps = [
  {
    label: "01",
    title: "Build the vendor packet once",
    detail:
      "Collect legal details, remit-to data, tax forms, insurance, and proof documents in one reusable packet before any browser automation starts.",
  },
  {
    label: "02",
    title: "Launch TinyFish only when the packet is ready",
    detail:
      "TinyFish handles the live browser execution: sign in, navigate the portal, upload the packet, resolve inline validation, and save the draft.",
  },
  {
    label: "03",
    title: "Hand back a review-ready packet",
    detail:
      "BidPilot owns the review center, audit log, and approval gate so the operator can inspect what happened before the final submit is ever allowed.",
  },
];

const trustRails = [
  {
    label: "Approval-gated",
    detail: "The run can save a supplier draft, but final activation remains blocked until a human reviewer signs off.",
    icon: "🛡️",
  },
  {
    label: "Audit-ready",
    detail: "Every action, artifact, and packet decision is preserved so the operator can replay what happened.",
    icon: "📋",
  },
  {
    label: "TinyFish-native",
    detail: "TinyFish is the execution engine for live browser work. BidPilot wraps the operational context around it.",
    icon: "🐟",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(245,166,95,0.18),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(245,166,95,0.07),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_42%)]" />

        <header className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
            <div className="flex items-center gap-4">
              <Image src="/bidpilot-logo.png" alt="BidPilot" width={44} height={44} className="rounded-full" />
              <div>
                <p className="text-sm font-medium text-white">BidPilot</p>
                <p className="signal-face text-[10px] uppercase tracking-[0.32em] text-white/38">
                  supplier ops edition
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-6 text-sm text-white/58 md:flex">
              <a href="#workflow" className="transition hover:text-white">Workflow</a>
              <a href="#trust" className="transition hover:text-white">Trust</a>
              <Link href="/demo" className="transition hover:text-white">Product Tour</Link>
              <Link href="/pricing" className="transition hover:text-white">Pricing</Link>
              <Link href="/sign-in" className="ghost-pill">Sign in</Link>
              <Link href="/sign-up" className="halo-button !py-2 !px-4 !text-[11px]">Start free</Link>
            </div>
          </div>
        </header>

        <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-6 pb-16 pt-28 lg:grid-cols-[1.04fr_0.96fr] lg:px-10 lg:pt-32">
          <div className="relative z-10 max-w-3xl">
            <p className="section-label reveal-up">
              vendor onboarding, not generic browser automation
            </p>
            <div className="reveal-up delay-1 mt-5">
              <h1 className="max-w-4xl text-[clamp(3.5rem,8vw,7.7rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white">
                Fill out Ariba, Coupa, and Jaggaer in 18 minutes.
              </h1>
            </div>
            <p className="reveal-up delay-2 mt-7 max-w-2xl text-lg leading-8 text-white/60 lg:text-xl">
              Build your vendor packet once. BidPilot&apos;s AI agent fills
              every portal field, uploads your documents, and saves the draft
              — so you review it before anything irreversible happens.
            </p>

            <div className="reveal-up delay-3 mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/sign-up" className="halo-button">
                start automating — free
              </Link>
              <Link href="/pricing" className="ghost-button">
                see pricing
              </Link>
            </div>

            <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
              {signalLanes.map((lane) => (
                <div key={lane.label}>
                  <p className="section-label">{lane.label}</p>
                  <p className="mt-3 text-2xl font-medium text-white">{lane.value}</p>
                  <p className="mt-3 text-sm leading-7 text-white/52">{lane.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual — 4 TinyFish APIs pipeline */}
          <div className="relative flex items-center justify-end">
            <div className="hero-visual reveal-up delay-2 w-full max-w-[42rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="terminal-grid pointer-events-none absolute inset-0 opacity-70" />
              <div className="pointer-events-none absolute -right-[4.5rem] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,166,95,0.3),transparent_60%)] blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="section-label">powered by tinyfish</p>
                    <p className="mt-3 text-xl font-medium text-white">
                      One API key. Four products. Zero routing code.
                    </p>
                  </div>
                  <span className="signal-face text-xs uppercase tracking-[0.32em] text-[var(--accent)]">
                    4 apis
                  </span>
                </div>

                <div className="mt-6 grid gap-3 border-y border-white/8 py-6 sm:grid-cols-2">
                  {[
                    { label: "Web Search", desc: "Find RFPs & portal registrations on the live web", icon: "🔍", api: "search" },
                    { label: "Web Fetch", desc: "Extract bid requirements from any portal URL", icon: "📄", api: "fetch" },
                    { label: "Web Agent", desc: "Fill portals, upload docs, save the draft", icon: "🐟", api: "agent" },
                    { label: "Web Browser", desc: "Stealth sessions for authenticated portals", icon: "🌐", api: "browser" },
                  ].map((feature) => (
                    <div key={feature.label} className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4">
                      <span className="text-lg">{feature.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{feature.label}</p>
                        <p className="mt-0.5 text-xs text-white/40">{feature.desc}</p>
                        <p className="mt-1 font-mono text-[9px] text-[var(--accent)]/50">{feature.api}.tinyfish.ai</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-center gap-2 text-[10px] text-white/20">
                  <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[var(--accent)]">Search</span>
                  <span>→</span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-400">Fetch</span>
                  <span>→</span>
                  <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-blue-400">Agent</span>
                  <span>→</span>
                  <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-purple-400">Browser</span>
                </div>

                <div className="mt-5 text-center">
                  <Link href="/sign-up" className="halo-button">
                    try it now — free
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="px-6 py-24 lg:px-10 lg:py-[7.5rem]">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.84fr_1.16fr]">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className="section-label">workflow</p>
            <h2 className="mt-5 max-w-xl text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-white">
              Build the packet first. Run the browser second.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/58">
              BidPilot owns the operational workflow around TinyFish: packet
              readiness, execution policy, review, and audit. The browser run
              is the middle of the product, not the whole thing.
            </p>
          </div>

          <div className="space-y-8">
            {executionSteps.map((step) => (
              <div
                key={step.title}
                className="grid gap-5 border-b border-white/8 pb-8 last:border-b-0 last:pb-0 md:grid-cols-[auto_1fr]"
              >
                <div className="signal-face text-xl tracking-[0.2em] text-[var(--accent)]">
                  {step.label}
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-white">{step.title}</h3>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-white/56">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust + ROI */}
      <section id="trust" className="px-6 pb-24 lg:px-10 lg:pb-[7.5rem]">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-xl lg:p-8">
            <p className="section-label">trust stack</p>
            <h3 className="mt-3 text-2xl font-medium text-white">
              Safer than the manual process
            </h3>

            <div className="mt-6 space-y-4">
              {trustRails.map((rail) => (
                <div
                  key={rail.label}
                  className="flex gap-4 rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
                >
                  <span className="text-xl">{rail.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-white">{rail.label}</p>
                    <p className="mt-1 text-sm leading-7 text-white/50">{rail.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <RoiCalculator />
        </div>
      </section>



      {/* Enterprise metrics */}
      <section className="px-6 pb-24 lg:px-10 lg:pb-[7.5rem]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="section-label">by the numbers</p>
            <h2 className="mt-5 text-4xl font-medium tracking-[-0.04em] text-white">
              Built for scale, not for demos
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "4", label: "TinyFish APIs integrated", sub: "Search · Fetch · Agent · Browser" },
              { value: "7", label: "Database tables with RLS", sub: "Row-level security on every table" },
              { value: "12", label: "API endpoints", sub: "Server-side routes, zero client secrets" },
              { value: "<18min", label: "Per vendor onboarding", sub: "Down from 6+ hours manual" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 text-center">
                <p className="text-4xl font-semibold text-[var(--accent)]">{metric.value}</p>
                <p className="mt-2 text-sm font-medium text-white">{metric.label}</p>
                <p className="mt-1 text-xs text-white/35">{metric.sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
              <p className="text-sm font-medium text-white">🏗️ Production Architecture</p>
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                Next.js 16 App Router · Supabase (Auth + Postgres + Storage) · Lemon Squeezy Payments · Vercel Edge Network · TinyFish Automation Runtime
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
              <p className="text-sm font-medium text-white">🔐 Enterprise Security</p>
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                AES-256 encryption · TLS 1.3 · RLS policies on all tables · TinyFish Vault for credentials · Immutable audit trail · Draft-save execution default
              </p>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
              <p className="text-sm font-medium text-white">💳 Revenue-Ready</p>
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                Lemon Squeezy checkout integrated · Tiered pricing (Free / Pro / Enterprise) · PCI DSS compliant payments · Subscription billing infrastructure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 pb-[4.5rem] lg:px-10 lg:pb-[5.5rem]">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(245,166,95,0.12),rgba(255,255,255,0.03))] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="section-label">ship mode</p>
              <h2 className="mt-5 max-w-3xl text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-white">
                Stop filling portals manually.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
                Create your free account, upload your vendor documents, and let
                TinyFish handle the portal work while you review before anything
                goes live.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <Link href="/sign-up" className="halo-button text-center">
                start free — no credit card
              </Link>
              <a
                href="https://www.tinyfish.ai"
                target="_blank"
                rel="noreferrer"
                className="ghost-button text-center"
              >
                learn about tinyfish
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 bg-black/40 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-10">
          <div className="flex items-center gap-3">
            <Image src="/bidpilot-logo.png" alt="BidPilot" width={32} height={32} className="rounded-full" />
            <span className="text-sm text-white/40">
              BidPilot © {new Date().getFullYear()}
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-white/35">
            <Link href="/demo" className="transition hover:text-white/60">Product Tour</Link>
            <Link href="/pricing" className="transition hover:text-white/60">Pricing</Link>
            <Link href="/sign-in" className="transition hover:text-white/60">Sign In</Link>
            <Link href="/dashboard" className="transition hover:text-white/60">Dashboard</Link>
            <a href="https://www.tinyfish.ai" target="_blank" rel="noreferrer" className="transition hover:text-white/60">TinyFish</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
