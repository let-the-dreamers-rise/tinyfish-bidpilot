"use client";

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useState,
  type FormEvent,
} from "react";

import type { BrowserProfile, TinyFishRun } from "@/lib/tinyfish";

type SafetyMode = "read-only" | "draft-save";

type LaunchPreset = {
  id: string;
  label: string;
  url: string;
  goal: string;
  recommendedMode: SafetyMode;
  recommendedVault: boolean;
};

type ConfigResponse = {
  enabled: boolean;
  defaultBrowserProfile: BrowserProfile;
  defaultProxyCountryCode: string;
  defaultSafetyMode: SafetyMode;
  requiresDemoCode: boolean;
};

const DEMO_CODE_HEADER = "x-bidpilot-demo-code";

const presets: LaunchPreset[] = [
  {
    id: "bid",
    label: "Public bid",
    url: "https://bidnet.com",
    goal:
      "Open BidNet, locate the vendor login and primary active-bids search entry points, capture the visible landing-page call-to-action labels, and stop without logging in, submitting anything, or modifying data.",
    recommendedMode: "read-only",
    recommendedVault: false,
  },
  {
    id: "security",
    label: "Security review",
    url: "https://trust.openai.com",
    goal:
      "Open the trust center, identify the main security and compliance entry points, capture the visible trust navigation labels, and stop without logging in or modifying anything.",
    recommendedMode: "read-only",
    recommendedVault: false,
  },
  {
    id: "supplier",
    label: "Supplier onboarding",
    url: "https://supplier.ariba.com",
    goal:
      "Sign in to the supplier portal, navigate profile, tax, and insurance sections, upload the required documents, save the supplier draft, and stop before final activation for human approval.",
    recommendedMode: "draft-save",
    recommendedVault: true,
  },
  {
    id: "sandbox",
    label: "Portal sandbox",
    url: "https://tinyfish-bidpilot.vercel.app/portal-demo",
    goal:
      "Open the Northstar Vendor Portal sandbox, sign in with any email and password, open the Documents tab, click 'attach sample capability statement', save the draft, and stop on the review state where final publish is locked.",
    recommendedMode: "draft-save",
    recommendedVault: false,
  },
];

export function TinyFishLaunchpad() {
  const [config, setConfig] = useState<ConfigResponse | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState(presets[0].id);
  const [url, setUrl] = useState(presets[0].url);
  const [goal, setGoal] = useState(presets[0].goal);
  const [browserProfile, setBrowserProfile] =
    useState<BrowserProfile>("stealth");
  const [safetyMode, setSafetyMode] = useState<SafetyMode>("read-only");
  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [proxyCountryCode, setProxyCountryCode] = useState("US");
  const [useVault, setUseVault] = useState(false);
  const [credentialItemIdsInput, setCredentialItemIdsInput] = useState("");
  const [demoAccessCode, setDemoAccessCode] = useState("");
  const [runId, setRunId] = useState<string | null>(null);
  const [run, setRun] = useState<TinyFishRun | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadConfig() {
      const response = await fetch("/api/tinyfish/config", {
        cache: "no-store",
      });
      const nextConfig = (await response.json()) as ConfigResponse;

      if (!isMounted) {
        return;
      }

      setConfig(nextConfig);
      setBrowserProfile(nextConfig.defaultBrowserProfile);
      setProxyCountryCode(nextConfig.defaultProxyCountryCode);
      setSafetyMode(nextConfig.defaultSafetyMode);
    }

    loadConfig().catch(() => {
      if (!isMounted) {
        return;
      }

      setConfig({
        enabled: false,
        defaultBrowserProfile: "stealth",
        defaultProxyCountryCode: "US",
        defaultSafetyMode: "read-only",
        requiresDemoCode: false,
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchRun = useEffectEvent(async () => {
    if (!runId) {
      return;
    }

    try {
      const response = await fetch(`/api/tinyfish/run/${runId}`, {
        cache: "no-store",
        headers: config?.requiresDemoCode
          ? {
              [DEMO_CODE_HEADER]: demoAccessCode.trim(),
            }
          : undefined,
      });
      const payload = (await response.json()) as TinyFishRun & {
        error?: string;
      };

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
          error instanceof Error
            ? error.message
            : "Unable to poll the TinyFish run.",
        );
      });
    }
  });

  useEffect(() => {
    if (!runId) {
      return;
    }

    fetchRun();

    const interval = window.setInterval(() => {
      fetchRun();
    }, 3000);

    return () => window.clearInterval(interval);
  }, [runId]);

  const applyPreset = (preset: LaunchPreset) => {
    setSelectedPresetId(preset.id);
    setUrl(preset.url);
    setGoal(preset.goal);
    setSafetyMode(preset.recommendedMode);
    setUseVault(preset.recommendedVault);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);
    setRunId(null);
    setRun(null);

    const credentialItemIds = credentialItemIdsInput
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/tinyfish/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(config?.requiresDemoCode
            ? { [DEMO_CODE_HEADER]: demoAccessCode.trim() }
            : {}),
        },
        body: JSON.stringify({
          url,
          goal,
          browserProfile,
          proxyEnabled,
          proxyCountryCode,
          useVault,
          safetyMode,
          credentialItemIds,
        }),
      });

      const payload = (await response.json()) as {
        runId?: string;
        error?: string;
      };

      if (!response.ok || !payload.runId) {
        throw new Error(
          payload.error ?? "TinyFish did not return a run identifier.",
        );
      }

      startTransition(() => {
        setRunId(payload.runId ?? null);
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to start the TinyFish run.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLiveMode = Boolean(config?.enabled);
  const isRunActive = run?.status === "PENDING" || run?.status === "RUNNING";
  const hasCredentialIds = credentialItemIdsInput.trim().length > 0;
  const needsDemoCode = Boolean(config?.requiresDemoCode);
  const guardrailCopy =
    safetyMode === "draft-save"
      ? "Agent may log in, fill fields, and upload documents, but the server will always block final irreversible submit actions and stop on the approval edge."
      : "Agent stays read-only. It can inspect the portal and extract what matters, but it will not log in, upload, submit, or modify anything.";
  const statusTone =
    run?.status === "COMPLETED"
      ? "text-[var(--success)]"
      : run?.status === "FAILED" || run?.status === "CANCELLED"
        ? "text-[#ff8b7b]"
        : "text-[var(--accent)]";

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 backdrop-blur-xl">
      <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="border-b border-white/10 p-6 lg:border-r lg:border-b-0 lg:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-label">live launch pad</p>
              <h3 className="mt-3 text-2xl font-medium text-white">
                Trigger a real TinyFish run
              </h3>
            </div>
            <span
              className={`signal-face text-xs uppercase tracking-[0.3em] ${
                isLiveMode ? "text-[var(--success)]" : "text-white/38"
              }`}
            >
              {isLiveMode ? "live mode ready" : "demo mode only"}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  preset.id === selectedPresetId
                    ? "border-[var(--accent)] bg-[rgba(245,166,95,0.12)] text-white"
                    : "border-white/10 bg-white/[0.03] text-white/62 hover:border-white/20 hover:text-white"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="section-label">target url</span>
              <input
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
                placeholder="https://..."
              />
            </label>

            <label className="block">
              <span className="section-label">goal</span>
              <textarea
                value={goal}
                onChange={(event) => setGoal(event.target.value)}
                rows={6}
                className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm leading-7 text-white outline-none transition focus:border-[var(--accent)]"
                placeholder="Describe what the agent should do on the live web."
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="section-label">browser profile</span>
                <select
                  value={browserProfile}
                  onChange={(event) =>
                    setBrowserProfile(event.target.value as BrowserProfile)
                  }
                  className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
                >
                  <option value="stealth">stealth</option>
                  <option value="lite">lite</option>
                </select>
              </label>

              <label className="block">
                <span className="section-label">execution policy</span>
                <select
                  value={safetyMode}
                  onChange={(event) =>
                    setSafetyMode(event.target.value as SafetyMode)
                  }
                  className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
                >
                  <option value="read-only">read-only audit</option>
                  <option value="draft-save">draft-save only</option>
                </select>
              </label>

              <label className="block">
                <span className="section-label">proxy country</span>
                <input
                  value={proxyCountryCode}
                  onChange={(event) => setProxyCountryCode(event.target.value)}
                  className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
                  placeholder="US"
                  maxLength={2}
                />
              </label>
            </div>

            <div className="rounded-[1rem] border border-white/8 bg-black/20 px-4 py-4">
              <p className="section-label">guardrails</p>
              <p className="mt-3 text-sm leading-7 text-white/58">
                {guardrailCopy}
              </p>
            </div>

            {needsDemoCode ? (
              <label className="block">
                <span className="section-label">demo access code</span>
                <input
                  value={demoAccessCode}
                  onChange={(event) => setDemoAccessCode(event.target.value)}
                  className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--accent)]"
                  placeholder="Enter the private code for live TinyFish runs"
                />
                <p className="mt-3 text-sm leading-7 text-white/50">
                  The public production site stays open, but live automation is
                  protected with a private code so random traffic cannot burn
                  TinyFish credits.
                </p>
              </label>
            ) : null}

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/72">
                <input
                  type="checkbox"
                  checked={proxyEnabled}
                  onChange={(event) => setProxyEnabled(event.target.checked)}
                />
                enable proxy
              </label>

              <label className="flex items-center gap-3 rounded-[1rem] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/72">
                <input
                  type="checkbox"
                  checked={useVault}
                  onChange={(event) => setUseVault(event.target.checked)}
                />
                include vault credentials
              </label>
            </div>

            {useVault ? (
              <label className="block">
                <span className="section-label">vault credential item ids</span>
                <textarea
                  value={credentialItemIdsInput}
                  onChange={(event) =>
                    setCredentialItemIdsInput(event.target.value)
                  }
                  rows={3}
                  className="mt-3 w-full rounded-[1.1rem] border border-white/10 bg-black/25 px-4 py-3 text-sm leading-7 text-white outline-none transition focus:border-[var(--accent)]"
                  placeholder="cred_bidnet_login, cred_pricing_matrix, cred_vendor_profile"
                />
                <p className="mt-3 text-sm leading-7 text-white/50">
                  Pass TinyFish Vault credential item IDs here for authenticated
                  draft-save workflows. Separate multiple IDs with commas, or
                  leave this blank to let TinyFish use all eligible enabled
                  Vault items.
                </p>
              </label>
            ) : null}

            {safetyMode === "draft-save" ? (
              <div className="rounded-[1rem] border border-[rgba(245,166,95,0.18)] bg-[rgba(245,166,95,0.08)] px-4 py-4">
                <p className="section-label">draft-save checklist</p>
                <div className="mt-3 space-y-2 text-sm leading-7 text-white/60">
                  <p>1. Use a real portal account through TinyFish Vault.</p>
                  <p>2. Upload one supporting file to prove real labor.</p>
                  <p>3. Save the draft and stop before final submit.</p>
                </div>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={
                !isLiveMode || isSubmitting || (needsDemoCode && !demoAccessCode.trim())
              }
              className="halo-button disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "launching run" : "launch TinyFish run"}
            </button>
          </form>

          <div className="mt-6 text-sm leading-7 text-white/56">
            {isLiveMode ? (
              <p>
                Live mode is enabled. This form will create a real asynchronous
                run via `POST /v1/automation/run-async`
                {needsDemoCode
                  ? " after the private demo access code is supplied."
                  : "."}
              </p>
            ) : (
              <p>
                Add{" "}
                <code className="signal-face text-[var(--accent)]">
                  TINYFISH_API_KEY
                </code>{" "}
                to unlock live runs. Until then, the cinematic command deck
                above remains your demo-safe fallback.
              </p>
            )}
          </div>
        </div>

        <div className="p-6 lg:p-7">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="section-label">run status</p>
              <h3 className="mt-3 text-2xl font-medium text-white">
                {runId ? runId : "No run launched yet"}
              </h3>
            </div>
            <span
              className={`signal-face text-xs uppercase tracking-[0.3em] ${statusTone}`}
            >
              {run?.status ?? "idle"}
            </span>
          </div>

          <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-5">
            {errorMessage ? (
              <p className="text-sm leading-7 text-[#ffb3a8]">{errorMessage}</p>
            ) : run ? (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="section-label">created</p>
                    <p className="mt-3 text-sm text-white/68">
                      {run.created_at}
                    </p>
                  </div>
                  <div>
                    <p className="section-label">steps</p>
                    <p className="mt-3 text-sm text-white/68">
                      {run.num_of_steps ?? run.steps.length}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="section-label">execution policy</p>
                    <p className="mt-3 text-sm text-white/68">{safetyMode}</p>
                  </div>
                  <div>
                    <p className="section-label">vault state</p>
                    <p className="mt-3 text-sm text-white/68">
                      {useVault
                        ? hasCredentialIds
                          ? "credential ids attached"
                          : "all enabled vault items allowed"
                        : "no vault credentials"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="section-label">human handoff</p>
                    <p className="mt-3 text-sm text-white/68">
                      capture lead approval required
                    </p>
                  </div>
                  <div>
                    <p className="section-label">run type</p>
                    <p className="mt-3 text-sm text-white/68">
                      {safetyMode === "draft-save"
                        ? "authenticated draft workflow"
                        : "read-only audit workflow"}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="section-label">goal</p>
                  <p className="mt-3 text-sm leading-7 text-white/68">
                    {run.goal}
                  </p>
                </div>

                <div className="rounded-[1rem] border border-white/8 bg-black/20 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        isRunActive
                          ? "bg-[var(--accent)] shadow-[0_0_14px_rgba(245,166,95,0.8)]"
                          : "bg-white/25"
                      }`}
                    />
                    <p className="text-sm font-medium text-white">
                      {isRunActive
                        ? "Live updates are flowing in below"
                        : "Run replay is captured below"}
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/56">
                    BidPilot keeps the run readable inside this panel using
                    TinyFish polling, so you can follow step progress, status,
                    and results without relying on an external stream tab.
                  </p>
                </div>

                <div>
                  <p className="section-label">
                    {isRunActive ? "live steps" : "recent steps"}
                  </p>
                  <div className="mt-4 space-y-3">
                    {run.steps.slice(-5).map((step, index) => (
                      <div
                        key={`${step.id ?? step.action ?? "step"}-${index}`}
                        className="rounded-[1rem] border border-white/8 bg-black/20 px-4 py-3"
                      >
                        <p className="text-sm font-medium text-white">
                          {step.action ?? "TinyFish step"}
                        </p>
                        <p className="mt-2 text-xs uppercase tracking-[0.24em] text-white/42">
                          {step.status ?? "UNKNOWN"}
                          {step.duration ? ` | ${step.duration}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="section-label">result payload</p>
                  <pre className="signal-face mt-4 max-h-64 overflow-auto rounded-[1rem] border border-white/8 bg-black/25 p-4 text-xs leading-6 text-white/70">
                    {JSON.stringify(run.result ?? {}, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-sm leading-7 text-white/56">
                Launch a run from the left panel and this surface will poll the
                TinyFish run API until it reaches a terminal state.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
