"use client";

import { useState } from "react";

type FetchResult = {
  url: string;
  final_url: string;
  title: string;
  description: string;
  text: string;
};

type BrowserSessionResult = {
  session_id: string;
  base_url: string;
  status: string;
};

export default function ScannerPage() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<FetchResult | null>(null);
  const [scanError, setScanError] = useState("");

  const [sessionLoading, setSessionLoading] = useState(false);
  const [browserSession, setBrowserSession] = useState<BrowserSessionResult | null>(null);
  const [sessionError, setSessionError] = useState("");

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setScanning(true);
    setScanError("");
    setScanResult(null);
    setBrowserSession(null);
    setSessionError("");

    try {
      const res = await fetch("/api/tinyfish/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [url.trim()], format: "markdown" }),
      });
      const data = await res.json();
      if (data.error) {
        setScanError(data.error);
      } else if (data.results?.[0]) {
        setScanResult(data.results[0]);
      } else if (data.errors?.[0]) {
        setScanError(data.errors[0].error);
      }
    } catch {
      setScanError("Scan failed. Check URL and network connection.");
    } finally {
      setScanning(false);
    }
  }

  async function handleBrowserSession() {
    if (!url.trim()) return;
    setSessionLoading(true);
    setSessionError("");

    try {
      const res = await fetch("/api/tinyfish/browser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (data.error) {
        setSessionError(data.error);
      } else {
        setBrowserSession(data);
      }
    } catch {
      setSessionError("Browser session creation failed.");
    } finally {
      setSessionLoading(false);
    }
  }

  // Parse scanned content for portal intelligence signals
  function extractPortalSignals(text: string) {
    const signals: { label: string; found: boolean; detail: string }[] = [];
    const lower = text.toLowerCase();

    signals.push({
      label: "Login / Registration",
      found: /sign.?in|log.?in|register|create.?account/i.test(lower),
      detail: /sign.?in|log.?in/i.test(lower)
        ? "Login form detected"
        : /register|create.?account/i.test(lower)
          ? "Registration flow detected"
          : "Not detected",
    });

    signals.push({
      label: "Document Upload",
      found: /upload|attach|document|file/i.test(lower),
      detail: /upload|attach/i.test(lower)
        ? "File upload mechanism found"
        : "Document references found",
    });

    signals.push({
      label: "Form Fields",
      found: /required|field|input|form|submit/i.test(lower),
      detail: /required/i.test(lower)
        ? "Required fields detected"
        : "Form elements detected",
    });

    signals.push({
      label: "Compliance / Certification",
      found: /certif|compliance|insurance|w-?9|tax|soc|iso/i.test(lower),
      detail: /insurance/i.test(lower)
        ? "Insurance requirements found"
        : /w-?9|tax/i.test(lower)
          ? "Tax documentation required"
          : /certif/i.test(lower)
            ? "Certification requirements found"
            : "Compliance terms detected",
    });

    signals.push({
      label: "Multi-step Process",
      found: /step|next|continue|progress|wizard/i.test(lower),
      detail: /step.*\d|step.*[1-9]/i.test(lower)
        ? "Numbered steps detected"
        : "Multi-page flow indicators found",
    });

    return signals;
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-sm">
              🌐
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-blue-400/70">
              web fetch + browser api
            </p>
          </div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-white">
            Portal Scanner
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
            Paste any supplier portal URL. TinyFish Web Fetch extracts the page
            content, identifies form fields, document requirements, and compliance
            signals. Launch a Browser session for live inspection.
          </p>
        </div>

        {/* Scan form */}
        <form onSubmit={handleScan} className="mb-8">
          <div className="flex gap-3">
            <input
              id="scanner-url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://supplier.ariba.com/..."
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-blue-400/50 transition-colors"
            />
            <button
              id="scanner-scan-button"
              type="submit"
              disabled={scanning || !url.trim()}
              className="halo-button !py-3 !px-6 !text-[11px] disabled:opacity-40"
            >
              {scanning ? "scanning…" : "scan portal"}
            </button>
          </div>
          <p className="mt-2 text-[10px] text-white/25">
            Powered by TinyFish Web Fetch — renders the page in a real browser and extracts clean content
          </p>
        </form>

        {/* Quick presets */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { label: "BidNet", url: "https://www.bidnet.com" },
            { label: "SAM.gov", url: "https://sam.gov" },
            { label: "Ariba Discovery", url: "https://discovery.ariba.com" },
            { label: "TinyFish", url: "https://www.tinyfish.ai" },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setUrl(preset.url)}
              className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] text-white/40 transition-all hover:border-blue-400/20 hover:text-white/60"
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {scanError && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm text-red-400">
            {scanError}
          </div>
        )}

        {/* Scan results */}
        {scanResult && (
          <div className="space-y-6">
            {/* Page info */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-emerald-400/60">
                    scan complete
                  </p>
                  <h2 className="mt-1 text-lg font-medium text-white">
                    {scanResult.title || "Untitled page"}
                  </h2>
                  <p className="mt-1 text-xs text-white/35">
                    {scanResult.description}
                  </p>
                  <p className="mt-2 text-[10px] text-white/20">
                    Final URL: {scanResult.final_url}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBrowserSession}
                  disabled={sessionLoading}
                  className="flex-shrink-0 ghost-button !py-2 !px-4 !text-[10px] disabled:opacity-40"
                >
                  {sessionLoading
                    ? "creating…"
                    : browserSession
                      ? "✓ session active"
                      : "🌐 open browser session"}
                </button>
              </div>
            </div>

            {/* Browser session info */}
            {browserSession && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
                <p className="text-[10px] uppercase tracking-wider text-blue-400/60 mb-2">
                  browser session active
                </p>
                <div className="grid gap-3 text-xs sm:grid-cols-2">
                  <div>
                    <p className="text-white/25">Session ID</p>
                    <p className="mt-0.5 font-mono text-white/60">
                      {browserSession.session_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/25">Live Preview</p>
                    <a
                      href={browserSession.base_url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-0.5 block text-blue-400 hover:underline"
                    >
                      {browserSession.base_url}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {sessionError && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-xs text-red-400">
                {sessionError}
              </div>
            )}

            {/* Portal intelligence signals */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-6">
              <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-white/50 mb-4">
                Portal Intelligence Signals
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {extractPortalSignals(scanResult.text || "").map((signal) => (
                  <div
                    key={signal.label}
                    className={`rounded-lg border p-3 ${
                      signal.found
                        ? "border-emerald-500/20 bg-emerald-500/5"
                        : "border-white/6 bg-white/[0.01]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          signal.found ? "bg-emerald-400" : "bg-white/15"
                        }`}
                      />
                      <p
                        className={`text-xs font-medium ${
                          signal.found ? "text-emerald-400" : "text-white/30"
                        }`}
                      >
                        {signal.label}
                      </p>
                    </div>
                    <p className="mt-1 text-[10px] text-white/30">
                      {signal.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Raw content */}
            <div className="rounded-xl border border-white/8 bg-white/[0.02] p-6">
              <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-white/50 mb-4">
                Extracted Page Content
              </h3>
              <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-lg border border-white/6 bg-black/30 p-4 text-[11px] leading-relaxed text-white/35">
                {scanResult.text?.slice(0, 5000)}
                {(scanResult.text?.length ?? 0) > 5000 && "\n\n… (truncated at 5000 chars)"}
              </pre>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!scanning && !scanResult && !scanError && (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10 text-2xl">
              🌐
            </div>
            <p className="text-sm font-medium text-white">
              Scan a supplier portal
            </p>
            <p className="mt-1 max-w-sm text-xs text-white/35">
              Paste any portal URL to extract its structure, identify form fields,
              document requirements, and compliance signals automatically.
            </p>
          </div>
        )}

        {/* Pipeline indicator */}
        <div className="mt-10 rounded-xl border border-white/6 bg-white/[0.01] px-5 py-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25 mb-3">
            tinyfish apis used on this page
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-400">
              📄 Web Fetch
            </span>
            <span className="text-white/15">→</span>
            <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[10px] font-medium text-blue-400">
              🌐 Web Browser
            </span>
            <span className="text-white/15">→</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/25">
              🧠 Portal Intelligence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
