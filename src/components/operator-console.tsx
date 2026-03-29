"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useEffectEvent,
  useState,
} from "react";

type RunStep = {
  title: string;
  log: string;
  note: string;
  duration: number;
};

type RunBlueprint = {
  id: string;
  label: string;
  portal: string;
  company: string;
  estimate: string;
  approvalOwner: string;
  documents: string[];
  objective: string;
  steps: RunStep[];
  outcome: string;
};

const runBlueprints: RunBlueprint[] = [
  {
    id: "public-sector",
    label: "Public sector bid",
    portal: "BidNet Direct",
    company: "Helix Secure Systems",
    estimate: "06m 14s",
    approvalOwner: "Capture lead",
    objective:
      "Open the bid packet, map boilerplate answers, upload the pricing matrix, and stop on the final review page.",
    documents: [
      "Capability statement.pdf",
      "Pricing matrix.xlsx",
      "Past performance.docx",
    ],
    steps: [
      {
        title: "Unlock vault",
        log: "TinyFish vault scope decrypted for BidNet Direct.",
        note: "Credential pack limited to procurement/bidnet-direct.",
        duration: 12,
      },
      {
        title: "Navigate portal",
        log: "Session established in stealth mode and tender workspace opened.",
        note: "Agent detected 42 required fields across six portal panels.",
        duration: 18,
      },
      {
        title: "Map answers",
        log: "Proposal library matched 31 prior answers to the active bid.",
        note: "Conflicts flagged where answer freshness exceeds 45 days.",
        duration: 26,
      },
      {
        title: "Attach evidence",
        log: "Compliance artifacts uploaded and linked to line-item requirements.",
        note: "Filename normalization applied to satisfy portal constraints.",
        duration: 21,
      },
      {
        title: "Stage review",
        log: "Review page reached with one pricing delta waiting for approval.",
        note: "Final submit disabled until the capture lead signs off.",
        duration: 15,
      },
    ],
    outcome:
      "Draft submission staged. Approval packet sent to the capture lead with a portal replay link.",
  },
  {
    id: "security-questionnaire",
    label: "Security questionnaire",
    portal: "Enterprise Trust Portal",
    company: "Northstar Cloud",
    estimate: "04m 48s",
    approvalOwner: "Security operations",
    objective:
      "Open the customer trust center, answer the questionnaire, attach certifications, and request a security approval.",
    documents: ["SOC 2 report.pdf", "ISO 27001.pdf", "Pen-test summary.pdf"],
    steps: [
      {
        title: "Resolve account",
        log: "Customer trust portal account resolved from the shared security vault.",
        note: "Single-tenant browser profile loaded with audit recording enabled.",
        duration: 10,
      },
      {
        title: "Extract questions",
        log: "Agent clustered 118 questions into identity, network, and resilience groups.",
        note: "Questions with legal language routed to the human review queue.",
        duration: 19,
      },
      {
        title: "Fill controls",
        log: "Known controls populated from the security answer library.",
        note: "Evidence references inserted with row-level provenance.",
        duration: 25,
      },
      {
        title: "Upload evidence",
        log: "Artifacts compressed, sanitized, and uploaded to the trust portal.",
        note: "Portal rate limit bypassed through adaptive pacing.",
        duration: 17,
      },
      {
        title: "Request sign-off",
        log: "Questionnaire parked on the final confirmation screen.",
        note: "Approval requested from security operations with one click replay.",
        duration: 12,
      },
    ],
    outcome:
      "Security packet completed with 94% auto-fill coverage and a clean audit trail.",
  },
  {
    id: "supplier-onboarding",
    label: "Supplier onboarding",
    portal: "Ariba Supplier Hub",
    company: "Atlas Industrial",
    estimate: "05m 32s",
    approvalOwner: "Finance ops",
    objective:
      "Complete supplier onboarding across profile, banking, tax, and insurance screens without manual re-entry.",
    documents: [
      "W-9 form.pdf",
      "Insurance certificate.pdf",
      "Bank letter.pdf",
    ],
    steps: [
      {
        title: "Enter workspace",
        log: "Supplier workspace opened with regional tax profile preselected.",
        note: "Agent detected two-factor prompt and used the shared approval inbox.",
        duration: 11,
      },
      {
        title: "Populate master data",
        log: "Legal entity, remit-to, and bank fields autofilled from the onboarding pack.",
        note: "Field normalization matched the portal's country-specific masks.",
        duration: 20,
      },
      {
        title: "Attach documents",
        log: "Tax and insurance artifacts uploaded to their required sections.",
        note: "Checksum recorded for every attachment in the audit ledger.",
        duration: 18,
      },
      {
        title: "Validate errors",
        log: "Agent resolved three inline validation issues without leaving the screen.",
        note: "One insurance expiry warning escalated to finance ops.",
        duration: 22,
      },
      {
        title: "Pause for approval",
        log: "Banking details masked and held at the approval boundary.",
        note: "Human approval required before the portal can activate the supplier.",
        duration: 16,
      },
    ],
    outcome:
      "Supplier onboarding completed up to final approval with full replayable evidence.",
  },
];

const buildSeedLogs = (run: RunBlueprint) => [
  `Run queued from ${run.company}.`,
  `Objective: ${run.objective}`,
  run.steps[0].log,
  run.steps[0].note,
];

export function OperatorConsole() {
  const initialRun = runBlueprints[0];
  const [selectedRunId, setSelectedRunId] = useState(initialRun.id);
  const [activeStep, setActiveStep] = useState(0);
  const [completion, setCompletion] = useState(
    Math.round((1 / initialRun.steps.length) * 100),
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(14);
  const [logs, setLogs] = useState<string[]>(buildSeedLogs(initialRun));
  const [isRunning, setIsRunning] = useState(true);
  const deferredRunId = useDeferredValue(selectedRunId);

  const activeRun =
    runBlueprints.find((run) => run.id === selectedRunId) ?? initialRun;
  const previewRun =
    runBlueprints.find((run) => run.id === deferredRunId) ?? activeRun;

  const launchRun = (runId: string) => {
    const nextRun =
      runBlueprints.find((run) => run.id === runId) ?? runBlueprints[0];

    startTransition(() => {
      setSelectedRunId(nextRun.id);
      setActiveStep(0);
      setCompletion(Math.round((1 / nextRun.steps.length) * 100));
      setElapsedSeconds(14);
      setLogs(buildSeedLogs(nextRun));
      setIsRunning(true);
    });
  };

  const advanceRun = useEffectEvent(() => {
    const currentRun =
      runBlueprints.find((run) => run.id === selectedRunId) ?? initialRun;

    if (activeStep >= currentRun.steps.length - 1) {
      startTransition(() => {
        setCompletion(100);
        setElapsedSeconds((value) => value + 9);
        setLogs((currentLogs) => {
          if (currentLogs.at(-1) === currentRun.outcome) {
            return currentLogs;
          }

          return [
            ...currentLogs,
            `Awaiting ${currentRun.approvalOwner} sign-off before final submit.`,
            currentRun.outcome,
          ];
        });
        setIsRunning(false);
      });

      return;
    }

    const nextStepIndex = activeStep + 1;
    const nextStep = currentRun.steps[nextStepIndex];

    startTransition(() => {
      setActiveStep(nextStepIndex);
      setCompletion(
        Math.round(((nextStepIndex + 1) / currentRun.steps.length) * 100),
      );
      setElapsedSeconds((value) => value + nextStep.duration);
      setLogs((currentLogs) => [...currentLogs, nextStep.log, nextStep.note]);
    });
  });

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      advanceRun();
    }, 1400);

    return () => window.clearInterval(interval);
  }, [isRunning]);

  const artifactStatus = activeRun.documents.map((document, index) => {
    if (activeStep >= index + 2) {
      return { document, status: "attached" };
    }

    if (activeStep === index + 1) {
      return { document, status: "mapping" };
    }

    return { document, status: "queued" };
  });

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
      <div className="grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="border-b border-white/10 p-6 lg:border-r lg:border-b-0 lg:p-7">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="section-label">Run presets</p>
              <h3 className="mt-3 text-2xl font-medium text-white">
                TinyFish command deck
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-[11px] uppercase tracking-[0.32em] text-white/50">
              <span className="h-2 w-2 rounded-full bg-[var(--success)] shadow-[0_0_16px_rgba(158,217,181,0.85)]" />
              live run
            </div>
          </div>

          <div className="space-y-3">
            {runBlueprints.map((run) => {
              const selected = run.id === selectedRunId;

              return (
                <button
                  key={run.id}
                  type="button"
                  onClick={() => launchRun(run.id)}
                  className={`w-full rounded-[1.4rem] border px-4 py-4 text-left transition duration-300 ${
                    selected
                      ? "border-[var(--accent)] bg-[linear-gradient(135deg,rgba(245,166,95,0.18),rgba(255,255,255,0.03))] shadow-[0_24px_80px_rgba(245,166,95,0.12)]"
                      : "border-white/10 bg-black/10 hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-white">
                        {run.label}
                      </p>
                      <p className="mt-1 text-sm text-white/55">{run.portal}</p>
                    </div>
                    <span className="signal-face text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
                      {run.estimate}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-2">
            <div>
              <p className="section-label">Current surface</p>
              <p className="mt-3 text-lg font-medium text-white">
                {previewRun.portal}
              </p>
              <p className="mt-2 max-w-sm text-sm leading-7 text-white/58">
                {previewRun.objective}
              </p>
            </div>
            <div>
              <p className="section-label">Approval owner</p>
              <p className="mt-3 text-lg font-medium text-white">
                {previewRun.approvalOwner}
              </p>
              <p className="mt-2 text-sm leading-7 text-white/58">
                Final submit stays gated until a human approves the replay and
                the delta summary.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => launchRun(selectedRunId)}
              className="halo-button"
            >
              relaunch run
            </button>
            <span className="ghost-pill">stealth browser</span>
            <span className="ghost-pill">vault scoped</span>
            <span className="ghost-pill">approval gated</span>
          </div>
        </div>

        <div className="relative overflow-hidden p-6 lg:p-7">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(245,166,95,0.8),transparent)] lg:hidden" />
          <div className="terminal-grid pointer-events-none absolute inset-0 opacity-70" />

          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="section-label">Run telemetry</p>
                <h3 className="mt-3 text-3xl font-medium text-white">
                  {activeRun.company}
                </h3>
              </div>
              <div className="text-right">
                <p className="signal-face text-xs uppercase tracking-[0.32em] text-[var(--accent)]">
                  {completion}% complete
                </p>
                <p className="mt-2 text-sm text-white/55">
                  elapsed {elapsedSeconds}s
                </p>
              </div>
            </div>

            <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/8">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),#ffd7a8)] transition-all duration-700"
                style={{ width: `${completion}%` }}
              />
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
              <div className="space-y-5">
                {activeRun.steps.map((step, index) => {
                  const state =
                    index < activeStep
                      ? "done"
                      : index === activeStep
                        ? "active"
                        : "queued";

                  return (
                    <div
                      key={step.title}
                      className="flex gap-4 border-b border-white/8 pb-5 last:border-b-0 last:pb-0"
                    >
                      <div
                        className={`mt-1 h-10 w-10 shrink-0 rounded-full border text-center text-sm leading-10 transition duration-300 ${
                          state === "done"
                            ? "border-[var(--success)] bg-[rgba(158,217,181,0.14)] text-[var(--success)]"
                            : state === "active"
                              ? "border-[var(--accent)] bg-[rgba(245,166,95,0.14)] text-[var(--accent)] shadow-[0_0_24px_rgba(245,166,95,0.24)]"
                              : "border-white/10 bg-white/4 text-white/38"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-base font-medium text-white">
                          {step.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-white/55">
                          {step.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="section-label">Live transcript</p>
                    <span className="signal-face text-xs uppercase tracking-[0.28em] text-[var(--accent)]">
                      replayable
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {logs.slice(-6).map((entry) => (
                      <p
                        key={entry}
                        className="signal-face text-xs leading-6 tracking-[0.14em] text-white/68"
                      >
                        {entry}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <p className="section-label">Artifacts</p>
                    <div className="mt-4 space-y-3">
                      {artifactStatus.map((artifact) => (
                        <div
                          key={artifact.document}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="text-white/68">{artifact.document}</span>
                          <span
                            className={`signal-face text-[10px] uppercase tracking-[0.26em] ${
                              artifact.status === "attached"
                                ? "text-[var(--success)]"
                                : artifact.status === "mapping"
                                  ? "text-[var(--accent)]"
                                  : "text-white/38"
                            }`}
                          >
                            {artifact.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                    <p className="section-label">Boundaries</p>
                    <div className="mt-4 space-y-4 text-sm leading-7 text-white/62">
                      <p>Credential scope: one portal, one role, one run.</p>
                      <p>Auto-submit: disabled until human approval arrives.</p>
                      <p>Replay: full action log available for every run.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
