"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

const PORTALS = [
  { id: "ariba", label: "SAP Ariba", icon: "🏢" },
  { id: "coupa", label: "Coupa", icon: "📦" },
  { id: "jaggaer", label: "Jaggaer", icon: "⚙️" },
  { id: "bidnet", label: "BidNet", icon: "🏛️" },
  { id: "ivalua", label: "Ivalua", icon: "📊" },
  { id: "oracle", label: "Oracle Procurement", icon: "🔮" },
  { id: "sap-fieldglass", label: "SAP Fieldglass", icon: "🌱" },
  { id: "other", label: "Other portal", icon: "🌐" },
];

const VOLUME_OPTIONS = [
  { value: "1-5", label: "1–5 per month", detail: "Early stage" },
  { value: "5-15", label: "5–15 per month", detail: "Growing team" },
  { value: "15-50", label: "15–50 per month", detail: "Scaling ops" },
  { value: "50+", label: "50+ per month", detail: "Enterprise volume" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPortals, setSelectedPortals] = useState<string[]>([]);
  const [volume, setVolume] = useState<string>("");
  const [loading, setLoading] = useState(false);

  function togglePortal(id: string) {
    setSelectedPortals((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  }

  async function handleComplete() {
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await (supabase
        .from("profiles") as any)
        .update({
          portals_used: selectedPortals,
          packets_per_month: parseInt(volume) || null,
          onboarded: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    router.push("/workspace");
    router.refresh();
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-black/25 p-8 backdrop-blur-xl">
      {/* Progress bar */}
      <div className="mb-8 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              s <= step ? "bg-[var(--accent)]" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div>
          <p className="section-label">step 1 of 3</p>
          <h1 className="mt-3 text-2xl font-medium text-white">
            Which portals do you work with?
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Select all the supplier portals your team uses. This helps BidPilot
            learn the right field mappings.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {PORTALS.map((portal) => (
              <button
                key={portal.id}
                type="button"
                onClick={() => togglePortal(portal.id)}
                className={`rounded-xl border px-4 py-3 text-left text-sm transition-all ${
                  selectedPortals.includes(portal.id)
                    ? "border-[var(--accent)]/50 bg-[var(--accent)]/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20"
                }`}
              >
                <span className="mr-2">{portal.icon}</span>
                {portal.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            disabled={selectedPortals.length === 0}
            className="halo-button mt-6 w-full justify-center disabled:opacity-30"
          >
            next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <p className="section-label">step 2 of 3</p>
          <h1 className="mt-3 text-2xl font-medium text-white">
            How many onboardings per month?
          </h1>
          <p className="mt-2 text-sm text-white/50">
            This helps us recommend the right plan and calculate your ROI.
          </p>

          <div className="mt-6 space-y-3">
            {VOLUME_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setVolume(opt.value)}
                className={`w-full rounded-xl border px-4 py-4 text-left transition-all ${
                  volume === opt.value
                    ? "border-[var(--accent)]/50 bg-[var(--accent)]/10"
                    : "border-white/10 bg-white/[0.03] hover:border-white/20"
                }`}
              >
                <p className="text-sm font-medium text-white">{opt.label}</p>
                <p className="mt-0.5 text-xs text-white/40">{opt.detail}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="ghost-button flex-1 justify-center"
            >
              back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={!volume}
              className="halo-button flex-1 justify-center disabled:opacity-30"
            >
              next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <p className="section-label">step 3 of 3</p>
          <h1 className="mt-3 text-2xl font-medium text-white">
            You&apos;re all set
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Your workspace is ready. Start by creating your first vendor packet.
          </p>

          <div className="mt-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs text-[var(--accent)]">
                ✓
              </div>
              <div>
                <p className="text-sm text-white">Portals configured</p>
                <p className="text-xs text-white/40">
                  {selectedPortals.length} portal{selectedPortals.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs text-[var(--accent)]">
                ✓
              </div>
              <div>
                <p className="text-sm text-white">Volume estimated</p>
                <p className="text-xs text-white/40">{volume} packets/month</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs text-[var(--accent)]">
                ✓
              </div>
              <div>
                <p className="text-sm text-white">Team workspace created</p>
                <p className="text-xs text-white/40">
                  Starter plan — upgrade anytime
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="ghost-button flex-1 justify-center"
            >
              back
            </button>
            <button
              type="button"
              onClick={handleComplete}
              disabled={loading}
              className="halo-button flex-1 justify-center disabled:opacity-50"
            >
              {loading ? "launching..." : "open workspace"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
