"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useEffect, useEffectEvent, useState } from "react";

type SafetyMode = "read-only" | "draft-save";

type RunStep = {
  id?: string;
  action?: string;
  status?: string;
  duration?: string;
};

type RunResult = {
  runId?: string;
  tf_run_id?: string;
  status?: string;
  steps?: RunStep[];
  result?: Record<string, unknown>;
  created_at?: string;
  num_of_steps?: number;
  goal?: string;
  error?: string;
};

export default function PacketRunPage() {
  const params = useParams();
  const router = useRouter();
  const packetId = params.id as string;

  const [url, setUrl] = useState("");
  const [goal, setGoal] = useState(
    "Sign in to the supplier portal, navigate through profile steps, upload any required documents from the vendor packet, save the draft, and stop before final submit for human approval.",
  );
  const [safetyMode, setSafetyMode] = useState<SafetyMode>("draft-save");
  const [browserProfile, setBrowserProfile] = useState<"stealth" | "lite">("stealth");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [runId, setRunId] = useState<string | null>(null);
  const [run, setRun] = useState<RunResult | null>(null);
  const [packetInfo, setPacketInfo] = useState<{
    vendor_name: string;
    portal_url: string;
    portal_name: string | null;
  } | null>(null);

  // Load packet info
  useEffect(() => {
    async function loadPacket() {
      try {
        const response = await fetch(`/api/packets/${packetId}`, {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          const pkt = data.packet || data;
          setPacketInfo({
            vendor_name: pkt.vendor_name,
            portal_url: pkt.portal_url,
            portal_name: pkt.portal_name,
          });
          setUrl(pkt.portal_url || "");
        }
      } catch {
        // silently fail, user can type URL manually
      }
    }
    loadPacket();
  }, [packetId]);

  // Poll run status
  const fetchRun = useEffectEvent(async () => {
    if (!runId) return;
    try {
      const response = await fetch(`/api/tinyfish/run/${runId}`, {
        cache: "no-store",
      });
      const payload = (await response.json()) as RunResult & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to poll the TinyFish run.");
      }
      startTransition(() => {
        setRun(payload);
        setErrorMessage(null);
      });
    } catch (error) {
      startTransition(() => {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to poll the TinyFish run.",
        );
      });
    }
  });

  useEffect(() => {
    if (!runId) return;
    fetchRun();
    const interval = window.setInterval(fetchRun, 3000);
    return () => window.clearInterval(interval);
  }, [runId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setRunId(null);
    setRun(null);

    try {
      const response = await fetch("/api/tinyfish/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          goal,
          browserProfile,
          safetyMode,
          packetId,
          proxyEnabled: false,
          proxyCountryCode: "US",
          useVault: safetyMode === "draft-save",
        }),
      });

      const payload = await response.json();

      if (!response.ok || !payload.runId) {
        throw new Error(payload.error ?? "TinyFish did not return a run identifier.");
      }

      startTransition(() => {
        setRunId(payload.runId);
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to start the TinyFish run.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRunActive = run?.status === "PENDING" || run?.status === "RUNNING";
  const isRunTerminal =
    run?.status === "COMPLETED" || run?.status === "FAILED" || run?.status === "CANCELLED";
  const statusTone =
    run?.status === "COMPLETED"
      ? "text-emerald-400"
      : run?.status === "FAILED" || run?.status === "CANCELLED"
        ? "text-red-400"
        : "text-[var(--accent)]";

  const guardrailCopy =
    safetyMode === "draft-save"
      ? "Agent may log in, fill fields, and upload documents, but will always block final irreversible submit actions and stop on the approval edge."
      : "Agent stays read-only. It can inspect the portal and extract information, but it will not log in, upload, submit, or modify anything.";

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-white/30">
          <Link href="/dashboard" className="transition hover:text-white/60">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/dashboard/packets" className="transition hover:text-white/60">
            Packets
          </Link>
          <span>/</span>
          <Link
            href={`/dashboard/packets/${packetId}`}
            className="transition hover:text-white/60"
          >
            {packetInfo?.vendor_name || packetId.slice(0, 8)}
          </Link>
          <span>/</span>
          <span className="text-white/50">Launch Run</span>
        </nav>

        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--accent)]/70">
            tinyfish execution
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-white">
            Launch a portal run
          </h1>
          <p className="mt-2 text-sm text-white/40">
            {packetInfo
              ? `${packetInfo.vendor_name} → ${packetInfo.portal_name || packetInfo.portal_url}`
              : "Configure and launch a TinyFish agent run for this vendor packet."}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Left: Config */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                  Target URL
                </span>
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]/50"
                  placeholder="https://supplier.ariba.com/..."
                />
              </label>

              <label className="block">
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                  Goal
                </span>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  required
                  rows={5}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-white outline-none transition focus:border-[var(--accent)]/50"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                    Execution Policy
                  </span>
                  <select
                    value={safetyMode}
                    onChange={(e) => setSafetyMode(e.target.value as SafetyMode)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="draft-save">Draft-save only</option>
                    <option value="read-only">Read-only audit</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                    Browser Profile
                  </span>
                  <select
                    value={browserProfile}
                    onChange={(e) =>
                      setBrowserProfile(e.target.value as "stealth" | "lite")
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="stealth">Stealth</option>
                    <option value="lite">Lite</option>
                  </select>
                </label>
              </div>

              {/* Guardrails */}
              <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/30">
                  Guardrails
                </p>
                <p className="mt-2 text-sm leading-7 text-white/50">{guardrailCopy}</p>
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !url}
                className="halo-button w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "launching..." : "🐟 launch tinyfish run"}
              </button>
            </form>
          </div>

          {/* Right: Run status */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/40">
                  Run Status
                </p>
                <h3 className="mt-2 text-lg font-medium text-white">
                  {runId ? runId.slice(0, 16) + "..." : "No run launched yet"}
                </h3>
              </div>
              <span
                className={`text-xs font-medium uppercase tracking-[0.2em] ${statusTone}`}
              >
                {run?.status ?? "idle"}
              </span>
            </div>

            <div className="mt-6 rounded-xl border border-white/8 bg-white/[0.02] p-5">
              {run ? (
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                        Created
                      </p>
                      <p className="mt-1 text-sm text-white/60">{run.created_at || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                        Steps
                      </p>
                      <p className="mt-1 text-sm text-white/60">
                        {run.num_of_steps ?? run.steps?.length ?? 0}
                      </p>
                    </div>
                  </div>

                  {/* Live indicator */}
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isRunActive
                          ? "bg-[var(--accent)] shadow-[0_0_14px_rgba(245,166,95,0.8)] animate-pulse"
                          : "bg-white/25"
                      }`}
                    />
                    <p className="text-sm font-medium text-white">
                      {isRunActive
                        ? "Live updates flowing..."
                        : isRunTerminal
                          ? "Run complete"
                          : "Waiting for data"}
                    </p>
                  </div>

                  {/* Steps */}
                  {run.steps && run.steps.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                        {isRunActive ? "Live steps" : "Recent steps"}
                      </p>
                      <div className="mt-3 space-y-2">
                        {run.steps.slice(-5).map((step, i) => (
                          <div
                            key={`${step.id ?? step.action ?? "step"}-${i}`}
                            className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2"
                          >
                            <p className="text-sm text-white/70">
                              {step.action ?? "TinyFish step"}
                            </p>
                            <p className="mt-1 text-[10px] uppercase tracking-wider text-white/30">
                              {step.status ?? "UNKNOWN"}
                              {step.duration ? ` · ${step.duration}` : ""}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Result */}
                  {isRunTerminal && run.result && (
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                        Result payload
                      </p>
                      <pre className="mt-2 max-h-48 overflow-auto rounded-lg border border-white/5 bg-black/30 p-3 font-mono text-xs leading-6 text-white/60">
                        {JSON.stringify(run.result, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Back to packet */}
                  {isRunTerminal && (
                    <button
                      type="button"
                      onClick={() => router.push(`/dashboard/packets/${packetId}`)}
                      className="ghost-button w-full justify-center"
                    >
                      ← back to packet
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-2xl">🐟</p>
                  <p className="mt-3 text-sm text-white/40">
                    Configure the run on the left and hit launch. This panel will poll
                    the TinyFish API and show live progress.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
