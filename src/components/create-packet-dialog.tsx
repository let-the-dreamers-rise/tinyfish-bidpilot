"use client";

import { useState } from "react";

type CreatePacketDialogProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const PORTAL_PRESETS = [
  { name: "SAP Ariba", url: "https://supplier.ariba.com" },
  { name: "Coupa Supplier Portal", url: "https://supplier.coupahost.com" },
  { name: "Jaggaer", url: "https://app.jaggaer.com" },
  { name: "BidNet Direct", url: "https://www.bidnetdirect.com" },
  { name: "Oracle Procurement", url: "https://procurement.oracle.com" },
  { name: "Ivalua", url: "https://app.ivalua.com" },
];

export function CreatePacketDialog({
  open,
  onClose,
  onCreated,
}: CreatePacketDialogProps) {
  const [vendorName, setVendorName] = useState("");
  const [portalUrl, setPortalUrl] = useState("");
  const [portalName, setPortalName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function selectPreset(preset: { name: string; url: string }) {
    setPortalUrl(preset.url);
    setPortalName(preset.name);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/packets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vendor_name: vendorName,
          portal_url: portalUrl,
          portal_name: portalName,
          owner_name: ownerName,
          due_date: dueDate || null,
          summary: summary || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create packet");
      }

      // Reset form
      setVendorName("");
      setPortalUrl("");
      setPortalName("");
      setOwnerName("");
      setDueDate("");
      setSummary("");

      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative mx-4 w-full max-w-lg rounded-2xl border border-white/10 bg-[#0d1117] p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="section-label">new packet</p>
            <h2 className="mt-1 text-xl font-medium text-white">
              Create vendor packet
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Portal presets */}
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-white/40">
            Quick select portal
          </p>
          <div className="flex flex-wrap gap-2">
            {PORTAL_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => selectPreset(preset)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  portalName === preset.name
                    ? "border-[var(--accent)]/50 bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="vendor-name"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
              >
                Vendor name *
              </label>
              <input
                id="vendor-name"
                type="text"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="Northstar Components"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[var(--accent)]/50"
              />
            </div>
            <div>
              <label
                htmlFor="owner-name"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
              >
                Owner *
              </label>
              <input
                id="owner-name"
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[var(--accent)]/50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="portal-url"
              className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
            >
              Portal URL *
            </label>
            <input
              id="portal-url"
              type="url"
              required
              value={portalUrl}
              onChange={(e) => setPortalUrl(e.target.value)}
              placeholder="https://supplier.ariba.com/..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[var(--accent)]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="portal-name"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
              >
                Portal name
              </label>
              <input
                id="portal-name"
                type="text"
                value={portalName}
                onChange={(e) => setPortalName(e.target.value)}
                placeholder="SAP Ariba"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[var(--accent)]/50"
              />
            </div>
            <div>
              <label
                htmlFor="due-date"
                className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
              >
                Due date
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none focus:border-[var(--accent)]/50 [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="summary"
              className="mb-1.5 block text-xs font-medium uppercase tracking-[0.2em] text-white/40"
            >
              Summary
            </label>
            <textarea
              id="summary"
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="New supplier onboarding — tax, insurance, and remit-to details."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[var(--accent)]/50"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="ghost-button flex-1 justify-center"
            >
              cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="halo-button flex-1 justify-center disabled:opacity-50"
            >
              {loading ? "creating..." : "create packet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
