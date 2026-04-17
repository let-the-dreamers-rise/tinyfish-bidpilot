"use client";

import Link from "next/link";
import RazorpayCheckout from "@/components/razorpay-checkout";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "",
    description: "For teams exploring portal automation.",
    highlight: false,
    features: [
      "5 vendor packets per month",
      "10 TinyFish agent runs",
      "1 team member",
      "Basic audit trail",
      "Draft-save execution only",
      "Community support",
    ],
    cta: "Get started free",
    href: "/sign-up",
    razorpayPlan: null,
  },
  {
    name: "Pro",
    price: "₹6,499",
    period: "/month",
    description: "For ops teams running weekly onboardings.",
    highlight: true,
    features: [
      "Unlimited vendor packets",
      "100 TinyFish agent runs",
      "5 team members",
      "Full audit trail with export",
      "Portal intelligence engine",
      "Reusable vendor profiles",
      "Document vault with versioning",
      "Priority support",
    ],
    cta: "Start 14-day trial",
    href: "/sign-up?plan=pro",
    razorpayPlan: "pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For procurement orgs with enterprise compliance needs.",
    highlight: false,
    features: [
      "Everything in Pro",
      "Unlimited runs & team members",
      "SSO / SAML authentication",
      "ERP integrations (SAP, Oracle, NetSuite)",
      "Custom portal adapters",
      "SOC 2 compliance package",
      "Dedicated success manager",
      "99.9% SLA",
    ],
    cta: "Talk to sales",
    href: "mailto:ashwin@bidpilot.dev?subject=BidPilot%20Enterprise",
    razorpayPlan: null,
  },
];

const faqs = [
  {
    q: "What counts as an agent run?",
    a: "One agent run = one TinyFish execution against a supplier portal. Each run navigates the portal, fills fields, uploads documents, and stops at draft-save. Polling for status doesn't count.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. Upgrade or downgrade anytime. If you upgrade mid-cycle, you're prorated. If you downgrade, the change takes effect at the next billing cycle.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted at rest and in transit. Documents are stored in isolated Supabase Storage buckets with row-level security. Agent runs use scoped TinyFish Vault credentials — we never see your portal passwords.",
  },
  {
    q: "What portals are supported?",
    a: "BidPilot works with any web-based supplier portal. We've verified Ariba, Coupa, Jaggaer, BidNet, and Oracle Procurement. The TinyFish agent adapts to any portal's UI automatically.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes — annual plans get 2 months free. Contact us for annual pricing.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept all major credit and debit cards, UPI, net banking, and wallets via Razorpay. International cards are supported.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen px-6 py-16 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <p className="section-label">pricing</p>
          <h1 className="mt-4 text-5xl font-medium tracking-[-0.05em] text-white lg:text-6xl">
            Simple pricing.
            <br />
            Real ROI from day one.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/58">
            Every plan includes the full BidPilot workflow: packet management,
            TinyFish agent execution, approval gates, and audit trails.
            <br />
            Start free. Scale when you&apos;re ready.
          </p>
        </div>

        {/* Plans */}
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.highlight
                  ? "border-[var(--accent)]/40 bg-gradient-to-b from-[var(--accent)]/[0.06] to-transparent shadow-[0_0_60px_rgba(245,166,95,0.08)]"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-[var(--accent)] px-4 py-1 text-xs font-semibold uppercase tracking-widest text-black">
                    Most popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-white">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-base text-white/40">{plan.period}</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-white/50">{plan.description}</p>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <svg
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                        plan.highlight ? "text-[var(--accent)]" : "text-[var(--success)]"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-white/70">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Payment button or link */}
              {plan.razorpayPlan ? (
                <RazorpayCheckout
                  plan={plan.razorpayPlan}
                  label={plan.cta}
                  highlight={plan.highlight}
                />
              ) : (
                <Link
                  href={plan.href}
                  className={`${plan.highlight ? "halo-button" : "ghost-button"} w-full justify-center`}
                >
                  {plan.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Payment badge */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
            <svg className="h-4 w-4 text-[var(--success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs text-white/50">
              Secured by <span className="font-medium text-white/70">Razorpay</span> · PCI DSS compliant
            </span>
          </div>
        </div>

        {/* ROI callout */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center lg:p-12">
          <p className="section-label">roi impact</p>
          <h2 className="mt-4 text-3xl font-medium text-white">
            The math is simple
          </h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-4">
            {[
              { stat: "6 hours", label: "Manual onboarding time per vendor" },
              { stat: "18 min", label: "With BidPilot + TinyFish" },
              { stat: "95%", label: "Time reduction on portal work" },
              { stat: "₹48L+", label: "Annual savings for a 10-person team" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-3xl font-semibold text-[var(--accent)]">
                  {item.stat}
                </p>
                <p className="mt-2 text-sm text-white/50">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="mb-8 text-center text-3xl font-medium text-white">
            Frequently asked questions
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-white marker:content-none">
                  {faq.q}
                  <svg
                    className="h-4 w-4 text-white/40 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="border-t border-white/5 px-6 py-4 text-sm leading-relaxed text-white/60">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Link href="/sign-up" className="halo-button">
            start automating — free
          </Link>
          <p className="mt-4 text-sm text-white/40">
            No credit card required. Set up in 2 minutes.
          </p>
        </div>

        {/* Back link */}
        <div className="mt-8 text-center">
          <Link href="/" className="ghost-pill">
            ← back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
