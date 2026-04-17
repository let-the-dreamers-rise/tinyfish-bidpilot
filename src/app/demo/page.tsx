"use client";

import Link from "next/link";
import { useState } from "react";

const steps = [
  {
    id: "problem",
    label: "The Problem",
    icon: "⚡",
    title: "Portal work is the most expensive bottleneck in procurement",
    description:
      "Enterprise teams spend 6+ hours per vendor filling supplier portals like Ariba, Coupa, and Jaggaer. It's repetitive, error-prone, and impossible to scale. Your best operators are stuck doing data entry instead of strategic work.",
    stats: [
      { value: "6 hrs", label: "Average time per vendor onboarding" },
      { value: "$12K", label: "Cost per onboarding cycle" },
      { value: "73%", label: "Of errors from manual entry" },
    ],
    visual: "problem",
  },
  {
    id: "solution",
    label: "The Solution",
    icon: "🚀",
    title: "Build the packet once. BidPilot fills every portal.",
    description:
      "BidPilot separates the preparation from the execution. Your team builds a reusable vendor packet with all required documents and data — then our AI agent navigates the portal, fills every field, uploads attachments, and saves the draft. You review before anything goes live.",
    stats: [
      { value: "18 min", label: "Average with BidPilot" },
      { value: "95%", label: "Time reduction" },
      { value: "0", label: "Portal errors" },
    ],
    visual: "solution",
  },
  {
    id: "how",
    label: "How It Works",
    icon: "⚙️",
    title: "Four TinyFish APIs. One intelligent pipeline.",
    description:
      "BidPilot orchestrates four specialized browser automation APIs to handle the full procurement workflow — from discovering opportunities to executing portal submissions.",
    apis: [
      {
        name: "Web Search",
        desc: "Discover RFPs, vendor registrations, and procurement opportunities across the live web",
        endpoint: "search.tinyfish.ai",
        color: "text-[var(--accent)]",
        bg: "bg-[var(--accent)]/10",
        border: "border-[var(--accent)]/30",
      },
      {
        name: "Web Fetch",
        desc: "Extract portal requirements, form fields, and compliance signals from any URL",
        endpoint: "fetch.tinyfish.ai",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
      },
      {
        name: "Web Agent",
        desc: "Navigate multi-step portals, fill forms, upload documents, and save drafts autonomously",
        endpoint: "agent.tinyfish.ai",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
      },
      {
        name: "Web Browser",
        desc: "Stealth browser sessions for authenticated portals with anti-detection",
        endpoint: "browser.tinyfish.ai",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
      },
    ],
    visual: "pipeline",
  },
  {
    id: "workflow",
    label: "Workflow",
    icon: "📋",
    title: "Enterprise-grade workflow, not a toy demo",
    description:
      "BidPilot is built for real procurement teams with real compliance requirements. Every action is audited, every submission requires approval, and your team stays in control.",
    features: [
      {
        title: "Vendor Packets",
        desc: "Reusable bundles of company data, tax forms, insurance docs, and certifications",
      },
      {
        title: "Approval Gates",
        desc: "No portal submission goes live without human sign-off. Draft-save only by default.",
      },
      {
        title: "Audit Trail",
        desc: "Every agent action, document upload, and status change is logged with timestamps and actor IDs",
      },
      {
        title: "Portal Intelligence",
        desc: "BidPilot learns from every run — mapping form fields, identifying quirks, and improving success rates",
      },
      {
        title: "Document Vault",
        desc: "Encrypted storage for W-9s, insurance certificates, and compliance documents with row-level security",
      },
      {
        title: "Team Roles",
        desc: "Admin, operator, and viewer roles with Supabase RLS enforcement at the database layer",
      },
    ],
    visual: "workflow",
  },
  {
    id: "security",
    label: "Security",
    icon: "🛡️",
    title: "Built for enterprise compliance from day one",
    description:
      "We know procurement data is sensitive. BidPilot is architected with security-first principles that enterprise buyers require.",
    securityItems: [
      { label: "Encryption", detail: "AES-256 at rest, TLS 1.3 in transit" },
      { label: "Auth", detail: "Supabase Auth with session management and MFA support" },
      { label: "Database", detail: "Row-Level Security policies on every table" },
      { label: "Credentials", detail: "TinyFish Vault — portal passwords never touch our servers" },
      { label: "Execution Policy", detail: "Read-only or draft-save modes. No irreversible actions without approval." },
      { label: "Audit", detail: "Immutable audit log of every action taken by human or agent" },
    ],
    visual: "security",
  },
  {
    id: "pricing",
    label: "Pricing",
    icon: "💰",
    title: "Simple pricing that scales with your team",
    description:
      "Start free with 5 vendor packets. Upgrade when your onboarding volume demands it. Enterprise plans include SSO, custom portal adapters, and a dedicated success manager.",
    tiers: [
      { name: "Starter", price: "Free", highlight: false, desc: "5 packets, 10 runs, 1 user" },
      { name: "Pro", price: "₹6,500/mo", highlight: true, desc: "Unlimited packets, 100 runs, 5 users" },
      { name: "Enterprise", price: "Custom", highlight: false, desc: "Unlimited everything, SSO, SLA" },
    ],
    visual: "pricing",
  },
];

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState(0);
  const current = steps[activeStep];

  return (
    <main className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[var(--background)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link href="/" className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(245,166,95,0.35)] bg-[rgba(245,166,95,0.08)] text-xs font-semibold text-[var(--accent)]">
              BP
            </span>
            <div>
              <p className="text-sm font-medium text-white">BidPilot</p>
              <p className="signal-face text-[9px] uppercase tracking-[0.3em] text-white/35">
                product tour
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="hidden text-sm text-white/50 transition hover:text-white sm:block">
              Pricing
            </Link>
            <Link href="/sign-up" className="halo-button !py-2 !px-5 !text-[10px]">
              start free trial
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {/* Step navigation */}
        <div className="mb-10 flex items-center gap-2 overflow-x-auto pb-2">
          {steps.map((step, i) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(i)}
              className={`flex flex-shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all ${
                i === activeStep
                  ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-white"
                  : "border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15 hover:text-white/60"
              }`}
            >
              <span>{step.icon}</span>
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{i + 1}</span>
            </button>
          ))}
        </div>

        {/* Step content */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          {/* Left - Info */}
          <div>
            <p className="section-label">{current.label}</p>
            <h1 className="mt-4 text-4xl font-medium leading-[1.1] tracking-[-0.04em] text-white lg:text-5xl">
              {current.title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/55">
              {current.description}
            </p>

            {/* Stats */}
            {current.stats && (
              <div className="mt-8 grid grid-cols-3 gap-4">
                {current.stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-2xl font-semibold text-[var(--accent)]">{stat.value}</p>
                    <p className="mt-1 text-xs text-white/40">{stat.label}</p>
                  </div>
                ))}
              </div>
            )}

            {/* APIs */}
            {current.apis && (
              <div className="mt-8 space-y-3">
                {current.apis.map((api) => (
                  <div
                    key={api.name}
                    className={`flex items-start gap-4 rounded-xl border ${api.border} ${api.bg} p-4`}
                  >
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${api.color}`}>{api.name}</p>
                      <p className="mt-1 text-xs text-white/45">{api.desc}</p>
                    </div>
                    <p className="font-mono text-[9px] text-white/25">{api.endpoint}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Features */}
            {current.features && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {current.features.map((f) => (
                  <div key={f.title} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <p className="text-sm font-medium text-white">{f.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/40">{f.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Security items */}
            {current.securityItems && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {current.securityItems.map((item) => (
                  <div key={item.label} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="mt-0.5 text-xs text-white/40">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pricing tiers */}
            {current.tiers && (
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {current.tiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`rounded-xl border p-5 text-center ${
                      tier.highlight
                        ? "border-[var(--accent)]/40 bg-[var(--accent)]/[0.06]"
                        : "border-white/8 bg-white/[0.02]"
                    }`}
                  >
                    <p className="text-sm font-medium text-white">{tier.name}</p>
                    <p className={`mt-2 text-2xl font-semibold ${tier.highlight ? "text-[var(--accent)]" : "text-white"}`}>
                      {tier.price}
                    </p>
                    <p className="mt-1 text-xs text-white/40">{tier.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right - Visual */}
          <div className="flex items-start justify-center">
            <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {/* Fake browser chrome */}
              <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-white/10" />
                  <div className="h-3 w-3 rounded-full bg-white/10" />
                  <div className="h-3 w-3 rounded-full bg-white/10" />
                </div>
                <div className="ml-4 flex-1 rounded-lg bg-white/5 px-3 py-1.5 text-[10px] text-white/25">
                  {current.id === "problem" && "supplier.ariba.com/registration/step-7-of-12"}
                  {current.id === "solution" && "app.bidpilot.dev/dashboard"}
                  {current.id === "how" && "app.bidpilot.dev/dashboard/discover"}
                  {current.id === "workflow" && "app.bidpilot.dev/dashboard/packets/PKT-A3F2"}
                  {current.id === "security" && "app.bidpilot.dev/dashboard/audit"}
                  {current.id === "pricing" && "app.bidpilot.dev/pricing"}
                </div>
              </div>

              {/* Content area */}
              <div className="p-6">
                {current.id === "problem" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                      <p className="text-xs text-red-400">Step 7 of 12 — Compliance Documentation</p>
                    </div>
                    <div className="space-y-3">
                      {["Company Legal Name *", "DUNS Number *", "Tax ID (EIN) *", "Insurance Certificate *", "W-9 Form Upload *", "Banking Information *"].map((field) => (
                        <div key={field} className="rounded-lg border border-white/8 bg-white/[0.02] px-4 py-3">
                          <p className="text-xs text-white/30">{field}</p>
                          <div className="mt-2 h-4 w-2/3 rounded bg-white/5" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-400">
                      ⚠️ Session expires in 14 minutes. Progress will be lost.
                    </div>
                  </div>
                )}

                {current.id === "solution" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-white">Vendor Packets</p>
                      <span className="rounded-full bg-[var(--success)]/10 px-2.5 py-1 text-[10px] text-[var(--success)]">
                        3 active
                      </span>
                    </div>
                    {[
                      { name: "Acme Corp → Ariba", status: "approved", progress: 100 },
                      { name: "GlobalTech → Coupa", status: "running", progress: 67 },
                      { name: "Nexus Labs → Jaggaer", status: "draft", progress: 30 },
                    ].map((p) => (
                      <div key={p.name} className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-white">{p.name}</p>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] ${
                            p.status === "approved" ? "border-emerald-500/20 text-emerald-400" :
                            p.status === "running" ? "border-amber-500/20 text-amber-400" :
                            "border-white/10 text-white/40"
                          }`}>{p.status}</span>
                        </div>
                        <div className="mt-3 h-1.5 rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-[var(--accent)] transition-all" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {current.id === "how" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs text-white/25">
                      <span className="rounded-full bg-[var(--accent)]/15 px-2 py-0.5 text-[var(--accent)]">Search</span>
                      <span>→</span>
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-emerald-400">Fetch</span>
                      <span>→</span>
                      <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-blue-400">Agent</span>
                      <span>→</span>
                      <span className="rounded-full bg-purple-500/15 px-2 py-0.5 text-purple-400">Browser</span>
                    </div>
                    <div className="rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4">
                      <p className="text-xs text-[var(--accent)]">🔍 Web Search Result</p>
                      <p className="mt-2 text-sm text-white">Ariba Vendor Registration Portal — Open for Q2 2026</p>
                      <p className="mt-1 text-xs text-white/35">discovery.ariba.com/vendor/register</p>
                    </div>
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="text-xs text-emerald-400">📄 Web Fetch Extraction</p>
                      <p className="mt-2 text-xs text-white/50">Required: Legal name, DUNS, Tax ID, Insurance cert, W-9, Banking...</p>
                      <p className="mt-1 text-xs text-white/25">12 required fields · 3 document uploads · 4-step wizard</p>
                    </div>
                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                      <p className="text-xs text-blue-400">🐟 Web Agent Execution</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                        <p className="text-xs text-white/50">Navigating step 3/4... filling tax information</p>
                      </div>
                    </div>
                  </div>
                )}

                {current.id === "workflow" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-white">PKT-A3F2 · Acme Corp</p>
                        <p className="text-xs text-white/30">Ariba Supplier Portal</p>
                      </div>
                      <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] text-amber-400">
                        awaiting review
                      </span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { action: "Packet created", time: "2h ago", icon: "➕" },
                        { action: "W-9 uploaded", time: "1h ago", icon: "📎" },
                        { action: "Insurance cert attached", time: "1h ago", icon: "📎" },
                        { action: "TinyFish run launched", time: "45m ago", icon: "🐟" },
                        { action: "Draft saved on Ariba", time: "38m ago", icon: "💾" },
                        { action: "Approval requested", time: "38m ago", icon: "⏳" },
                      ].map((entry) => (
                        <div key={entry.action} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.01] px-3 py-2 text-xs">
                          <span>{entry.icon}</span>
                          <span className="flex-1 text-white/50">{entry.action}</span>
                          <span className="text-white/20">{entry.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {current.id === "security" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
                      <p className="text-xs text-emerald-400">✓ All security checks passing</p>
                    </div>
                    <div className="space-y-2 font-mono text-[11px]">
                      {[
                        "row_level_security: ENFORCED on 7 tables",
                        "encryption_at_rest: AES-256",
                        "tls_version: 1.3",
                        "vault_credentials: NEVER_STORED_LOCALLY",
                        "execution_policy: DRAFT_SAVE_DEFAULT",
                        "audit_retention: IMMUTABLE",
                      ].map((line) => (
                        <p key={line} className="text-white/30">
                          <span className="text-emerald-400">✓</span> {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {current.id === "pricing" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4 text-center">
                      <p className="text-sm font-medium text-white">Pro Plan — ₹6,500/mo</p>
                      <p className="mt-2 text-xs text-white/40">Unlimited packets · 100 runs · 5 team members</p>
                      <div className="mt-4 flex items-center justify-center gap-2">
                        <svg className="h-4 w-4 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        <span className="text-xs text-white/40">Secured by Lemon Squeezy · PCI DSS compliant</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="ghost-button !py-2.5 !px-5 !text-[11px] disabled:opacity-30"
          >
            ← previous
          </button>

          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep(activeStep + 1)}
              className="halo-button !py-2.5 !px-5 !text-[11px]"
            >
              next →
            </button>
          ) : (
            <Link href="/sign-up" className="halo-button !py-2.5 !px-5 !text-[11px]">
              start your free trial →
            </Link>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-gradient-to-br from-[var(--accent)]/[0.06] to-transparent p-8 text-center lg:p-12">
          <h2 className="text-3xl font-medium text-white">
            Ready to stop filling portals manually?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-white/50">
            Join procurement teams that save 6 hours per vendor onboarding with BidPilot.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/sign-up" className="halo-button">
              start free — no credit card
            </Link>
            <Link href="/pricing" className="ghost-button">
              compare plans
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
