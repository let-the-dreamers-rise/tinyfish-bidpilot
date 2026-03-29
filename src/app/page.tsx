import { OperatorConsole } from "@/components/operator-console";
import { TinyFishLaunchpad } from "@/components/tinyfish-launchpad";

const signalLanes = [
  {
    label: "Portal coverage",
    value: "11 live surfaces",
    note: "Procurement, trust centers, and supplier onboarding flows.",
  },
  {
    label: "Human effort removed",
    value: "25 hrs per bid",
    note: "Targeting the slowest manual portal labor instead of generic chat.",
  },
  {
    label: "Trust model",
    value: "bounded delegation",
    note: "The agent acts inside one scoped surface and stops at the approval edge.",
  },
];

const workflowSteps = [
  {
    title: "Lock the scope",
    detail:
      "Attach one credential pack, one portal, and one objective so the agent behaves like an operator with a bounded mandate instead of a general chatbot.",
  },
  {
    title: "Read the live surface",
    detail:
      "TinyFish handles the hard browser work: rendering, session state, form discovery, and the ugly edges that break scripted API wrappers.",
  },
  {
    title: "Map evidence and answers",
    detail:
      "The run pulls from your proposal pack, trust library, or onboarding data, then writes everything back into the actual portal with provenance.",
  },
  {
    title: "Stop at the approval edge",
    detail:
      "The agent does the labor, but the human keeps the last decision. Replay, deltas, and approval gates make the workflow trustworthy on camera and in production.",
  },
];

const heroEvents = [
  "vault://procurement/bidnet-direct",
  "session.stealth = true",
  "forms.detected = 42",
  "draft.status = review-ready",
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
              <a href="#console" className="transition hover:text-white">
                Command deck
              </a>
              <a
                href="https://www.tinyfish.ai"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                TinyFish
              </a>
            </div>
          </div>
        </header>

        <div className="mx-auto grid min-h-screen max-w-7xl items-center gap-14 px-6 pb-16 pt-28 lg:grid-cols-[1.03fr_0.97fr] lg:px-10 lg:pt-32">
          <div className="relative z-10 max-w-3xl">
            <p className="section-label reveal-up">live web work, not demo theater</p>
            <div className="reveal-up delay-1 mt-5">
              <div className="mb-5 text-sm font-medium uppercase tracking-[0.38em] text-white/32">
                BidPilot
              </div>
              <h1 className="max-w-4xl text-[clamp(3.7rem,9vw,8.4rem)] font-medium leading-[0.92] tracking-[-0.06em] text-white">
                Launch the web agent that actually finishes the bid.
              </h1>
            </div>
            <p className="reveal-up delay-2 mt-7 max-w-2xl text-lg leading-8 text-white/60 lg:text-xl">
              A TinyFish-powered operator for proposal portals, security
              questionnaires, and approval-heavy onboarding flows. It logs in,
              navigates the live surface, fills the ugly parts, and stops before
              the last irreversible click.
            </p>

            <div className="reveal-up delay-3 mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="#console" className="halo-button">
                open command deck
              </a>
              <a href="#workflow" className="ghost-button">
                see the operator flow
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
                      Run 018 · portal replay
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
                      The agent has already handled login, field discovery,
                      attachment mapping, and draft staging inside a live portal.
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
                            index < 3 ? "bg-[var(--success)]" : "bg-[var(--accent)]"
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
                        "Unlock portal vault",
                        "Resolve required fields",
                        "Link proposal evidence",
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
                      <p>No hidden submit. No fake screenshots. No toy chat loop.</p>
                      <p>
                        Exactly the kind of ugly, live-web labor TinyFish was
                        built to make executable.
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
            <p className="section-label">operator model</p>
            <h2 className="mt-5 max-w-xl text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-white">
              Every useful web agent needs a crisp mandate.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/58">
              The difference between a trustworthy operator and a flashy demo is
              the boundary: scoped authority, live execution, and a deliberate
              pause at the approval edge.
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

      <section id="console" className="px-6 pb-24 lg:px-10 lg:pb-[7.5rem]">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="section-label">interactive prototype</p>
            <h2 className="mt-5 text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-white">
              A command surface designed for the hackathon demo camera.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/58">
              Switch between high-value workflows, relaunch the run, and show a
              replayable path from authenticated login to human-approved draft.
            </p>
          </div>

          <OperatorConsole />

          <div className="mt-[4.5rem] max-w-3xl">
            <p className="section-label">runtime bridge</p>
            <h2 className="mt-5 text-5xl font-medium leading-[1.02] tracking-[-0.05em] text-white">
              Flip from demo mode to real TinyFish runs without rebuilding the UI.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/58">
              The launch pad below is wired to real route handlers. Drop in a
              `TINYFISH_API_KEY`, launch a run, and the app will poll TinyFish for
              live status, recent steps, and the result payload.
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
                Show the portal. Show the work. Post the raw run.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
                This concept is strongest when the audience watches the agent do
                boring, high-value labor on a live website. Keep the demo honest,
                scoped, and impossible to confuse with a chatbot.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <a href="#console" className="halo-button text-center">
                relaunch demo
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
