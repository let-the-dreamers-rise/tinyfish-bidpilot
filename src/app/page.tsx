import { OperatorConsole } from "@/components/operator-console";
import { RoiCalculator } from "@/components/roi-calculator";
import { TinyFishLaunchpad } from "@/components/tinyfish-launchpad";

const signalLanes = [
  {
    label: "Primary buyer",
    value: "Proposal manager",
    note: "Small and mid-market government contractors that live inside procurement portals.",
  },
  {
    label: "Core workflow",
    value: "Save draft, stop at review",
    note: "Log in, extract requirements, attach files, and park the bid at the approval edge.",
  },
  {
    label: "ROI story",
    value: "$11.9k / month",
    note: "At 8 bids per month, 25 hours per bid, and 70% automation coverage.",
  },
];

const workflowSteps = [
  {
    title: "Scope one portal, one bid, one owner",
    detail:
      "BidPilot is not trying to automate the whole company. It gets a single bid workspace, one credential scope, one proposal pack, and one owner who can approve the final handoff.",
  },
  {
    title: "Read the live portal and extract the ugly parts",
    detail:
      "TinyFish handles rendering, sessions, pagination, and dynamic UI. The agent resolves required fields, stale boilerplate, and missing attachments without turning the workflow into a brittle script.",
  },
  {
    title: "Map answers, evidence, and required uploads",
    detail:
      "The run pulls from the proposal pack, trust library, and pricing matrix, then writes back into the actual portal with traceable artifacts and a clean draft state.",
  },
  {
    title: "Generate an approval packet instead of blind submit",
    detail:
      "The agent does the labor, but the human keeps the irreversible action. Approval gates, audit logs, and a replayable draft handoff make this usable in a real proposal team.",
  },
];

const heroEvents = [
  "buyer = proposal-manager",
  "required.fields = 42",
  "attachments.mapped = 3",
  "submit.lock = approval-gated",
];

const buyerSignals = [
  {
    label: "Who pays",
    title: "Capture lead or proposal manager",
    detail:
      "The buyer already owns deadline risk, portal chaos, and the labor cost of every repetitive submission cycle.",
  },
  {
    label: "Why now",
    title: "More bids now end in portals, not inboxes",
    detail:
      "Proposal teams already use AI for drafting. The painful last mile is still browser labor, attachment work, and manual draft staging.",
  },
  {
    label: "How often",
    title: "Every bid cycle, multiple times each month",
    detail:
      "This is not a one-off workflow. Teams repeat company profile entry, attachment mapping, and approval routing every single time they respond.",
  },
];

const trustRails = [
  {
    label: "Approval gate",
    detail:
      "Final irreversible submit actions stay blocked. The run stops on the last review screen or draft-saved state.",
  },
  {
    label: "Audit log",
    detail:
      "Each run returns recent steps, replay context, and a structured result payload so the human can verify what happened.",
  },
  {
    label: "Bounded delegation",
    detail:
      "One portal, one run, one credential scope. The agent gets a mandate, not open-ended authority.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <section className="relative min-h-screen overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(245,166,95,0.18),transparent_24%),radial-gradient(circle_at_80%_10%,rgba(245,166,95,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_40%)]" />

        <header className="absolute inset-x-0 top-0 z-20">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(245,166,95,0.35)] bg-[rgba(245,166,95,0.08)] text-sm font-semibold text-[var(--accent)]">
                BP
              </span>
              <div>
                <p className="text-sm font-medium text-white">BidPilot</p>
                <p className="signal-face text-[10px] uppercase tracking-[0.32em] text-white/38">
                  TinyFish native
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-6 text-sm text-white/58 md:flex">
              <a href="#workflow" className="transition hover:text-white">
                Workflow
              </a>
              <a href="#economics" className="transition hover:text-white">
                ROI
              </a>
              <a href="#console" className="transition hover:text-white">
                Command deck
              </a>
            </div>
          </div>
        </header>

        <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-6 pb-16 pt-28 lg:grid-cols-[1.03fr_0.97fr] lg:px-10 lg:pt-32">
          <div className="relative z-10 max-w-3xl">
            <p className="section-label reveal-up">
              public-sector bid operations, not demo theater
            </p>
            <div className="reveal-up delay-1 mt-5">
              <div className="mb-5 text-sm font-medium uppercase tracking-[0.38em] text-white/32">
                BidPilot
              </div>
              <h1 className="max-w-4xl text-[clamp(3.7rem,9vw,8.4rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white">
                The draft-submission agent for government contractors.
              </h1>
            </div>
            <p className="reveal-up delay-2 mt-7 max-w-2xl text-lg leading-8 text-white/60 lg:text-xl">
              BidPilot helps proposal teams log into live procurement portals,
              extract requirements, map answers, upload evidence, save a clean
              draft, and stop before the last irreversible click.
            </p>

            <div className="reveal-up delay-3 mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#console" className="halo-button">
                open command deck
              </a>
              <a href="#economics" className="ghost-button">
                see the ROI case
              </a>
              <a href="/portal-demo" className="ghost-button">
                open portal demo
              </a>
            </div>

            <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
              {signalLanes.map((lane) => (
                <div key={lane.label}>
                  <p className="section-label">{lane.label}</p>
                  <p className="mt-3 text-2xl font-medium text-white">
                    {lane.value}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-white/52">
                    {lane.note}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-end">
            <div className="hero-visual reveal-up delay-2 w-full max-w-[42rem] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 sm:p-6">
              <div className="terminal-grid pointer-events-none absolute inset-0 opacity-70" />
              <div className="pointer-events-none absolute -right-[4.5rem] top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,166,95,0.3),transparent_60%)] blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="section-label">raw demo surface</p>
                    <p className="mt-3 text-xl font-medium text-white">
                      Run 018 | approval packet
                    </p>
                  </div>
                  <span className="signal-face text-xs uppercase tracking-[0.32em] text-[var(--accent)]">
                    stealth active
                  </span>
                </div>

                <div className="mt-6 grid gap-5 border-y border-white/8 py-6 sm:grid-cols-[0.92fr_1.08fr]">
                  <div>
                    <p className="text-6xl font-medium tracking-[-0.06em] text-white">
                      84%
                    </p>
                    <p className="mt-3 max-w-xs text-sm leading-7 text-white/52">
                      The agent has already handled field discovery, attachment
                      mapping, and draft staging inside a live procurement
                      portal.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {heroEvents.map((event, index) => (
                      <div
                        key={event}
                        className="flex items-center justify-between gap-3 rounded-[1rem] border border-white/8 bg-black/20 px-4 py-3"
                      >
                        <span className="signal-face text-[11px] uppercase tracking-[0.24em] text-white/62">
                          {event}
                        </span>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            index < 3
                              ? "bg-[var(--success)]"
                              : "bg-[var(--accent)]"
                          } shadow-[0_0_16px_rgba(245,166,95,0.55)]`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-5 lg:grid-cols-[1.06fr_0.94fr]">
                  <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
                    <p className="section-label">Execution rail</p>
                    <div className="mt-4 space-y-3">
                      {[
                        "Unlock scoped portal access",
                        "Resolve required bid fields",
                        "Attach proposal evidence",
                        "Park on final review",
                      ].map((step, index) => (
                        <div
                          key={step}
                          className="flex items-center gap-4 border-b border-white/8 pb-3 last:border-b-0 last:pb-0"
                        >
                          <span className="signal-face text-xs text-[var(--accent)]">
                            0{index + 1}
                          </span>
                          <span className="text-sm text-white/65">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/8 bg-black/20 p-5">
                    <p className="section-label">Trust boundary</p>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-white/58">
                      <p>Scoped credentials, replay logs, approval gates.</p>
                      <p>No hidden submit. No silent payment. No toy chatbot loop.</p>
                      <p>
                        Exactly the last-mile portal work proposal teams still
                        do by hand.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-black/15">
        <div className="mx-auto grid max-w-7xl gap-0 px-6 lg:grid-cols-3 lg:px-10">
          {signalLanes.map((lane, index) => (
            <div
              key={lane.label}
              className={`py-10 ${
                index < signalLanes.length - 1 ? "lg:border-r lg:border-white/8" : ""
              }`}
            >
              <p className="section-label">{lane.label}</p>
              <p className="mt-4 text-3xl font-medium text-white">{lane.value}</p>
              <p className="mt-3 max-w-sm text-sm leading-7 text-white/52">
                {lane.note}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="workflow" className="px-6 py-24 lg:px-10 lg:py-[7.5rem]">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.84fr_1.16fr]">
          <div className="lg:sticky lg:top-10 lg:self-start">
            <p className="section-label">winning wedge</p>
            <h2 className="mt-5 max-w-xl text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-white">
              One buyer. One painful workflow. One obvious reason to pay.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/58">
              BidPilot is sharpest when it behaves like proposal operations
              software, not a general AI agent. The motion is simple: recover
              labor from repetitive public-sector portal work while keeping the
              final decision with the human owner.
            </p>
          </div>

          <div className="space-y-8">
            {workflowSteps.map((step, index) => (
              <div
                key={step.title}
                className="grid gap-5 border-b border-white/8 pb-8 last:border-b-0 last:pb-0 md:grid-cols-[auto_1fr]"
              >
                <div className="signal-face text-xl tracking-[0.2em] text-[var(--accent)]">
                  0{index + 1}
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

      <section id="economics" className="px-6 pb-24 lg:px-10 lg:pb-[7.5rem]">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="space-y-4">
            {buyerSignals.map((signal) => (
              <div
                key={signal.label}
                className="rounded-[1.6rem] border border-white/10 bg-black/20 p-6"
              >
                <p className="section-label">{signal.label}</p>
                <h3 className="mt-4 text-2xl font-medium text-white">
                  {signal.title}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/56">
                  {signal.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <RoiCalculator />

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 p-6 backdrop-blur-xl lg:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="section-label">trust stack</p>
                  <h3 className="mt-3 text-2xl font-medium text-white">
                    The product only works if the handoff is trusted
                  </h3>
                </div>
                <span className="signal-face text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
                  approval-first
                </span>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {trustRails.map((rail) => (
                  <div
                    key={rail.label}
                    className="rounded-[1.25rem] border border-white/8 bg-white/[0.03] p-4"
                  >
                    <p className="section-label">{rail.label}</p>
                    <p className="mt-3 text-sm leading-7 text-white/58">
                      {rail.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="console" className="px-6 pb-24 lg:px-10 lg:pb-[7.5rem]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="section-label">interactive prototype</p>
            <h2 className="mt-5 text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-white">
              A command surface designed to show real proposal labor.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/58">
              Switch between the primary bid workflow and adjacent expansion
              paths, relaunch the run, and show a replayable path from scoped
              access to human-approved draft.
            </p>
          </div>

          <OperatorConsole />

          <div className="mt-[4.5rem] max-w-3xl">
            <p className="section-label">runtime bridge</p>
            <h2 className="mt-5 text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-white">
              Flip from demo mode to real TinyFish runs without changing the product.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/58">
              The launch pad below is wired to real route handlers. Drop in a
              `TINYFISH_API_KEY`, launch a run, and the app will poll TinyFish for
              live status, recent steps, and the result payload while enforcing a
              read-only or draft-save execution policy.
            </p>
          </div>

          <div className="mt-10">
            <TinyFishLaunchpad />
          </div>
        </div>
      </section>

      <section className="px-6 pb-[4.5rem] lg:px-10 lg:pb-[5.5rem]">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(245,166,95,0.12),rgba(255,255,255,0.03))] px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
          <p className="section-label">ship mode</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-3xl text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-white">
                Show the portal. Show the labor. Stop at approval.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
                This concept is strongest when the audience watches the agent do
                boring, high-value portal work on a live website. Keep the demo
                honest, scoped, and impossible to confuse with generic AI chat.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <a href="#console" className="halo-button text-center">
                relaunch demo
              </a>
              <a href="/portal-demo" className="ghost-button text-center">
                open portal demo
              </a>
              <a
                href="https://www.tinyfish.ai"
                target="_blank"
                rel="noreferrer"
                className="ghost-button text-center"
              >
                get TinyFish access
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
