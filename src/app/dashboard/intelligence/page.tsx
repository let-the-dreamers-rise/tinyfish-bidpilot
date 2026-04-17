import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Portal Intelligence | BidPilot",
  description: "Knowledge base of supplier portal patterns and success rates.",
};

export default async function IntelligencePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: portals } = (await supabase
    .from("portal_intelligence")
    .select("*")
    .order("runs_completed", { ascending: false })) as { data: any[] | null };

  const allPortals = portals || [];

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "Never";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-white">Portal Intelligence</h1>
          <p className="mt-1 text-sm text-white/40">
            Learned patterns from TinyFish executions across supplier portals. This database grows with every run.
          </p>
        </div>

        {allPortals.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <div className="mb-5 text-4xl">🌐</div>
            <h2 className="text-xl font-medium text-white">No portal data yet</h2>
            <p className="mt-2 max-w-md text-sm text-white/40">
              Every time TinyFish completes a run, it records portal-specific patterns here. Run more executions to build your intelligence database.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {["Ariba", "Coupa", "Jaggaer", "BidNet", "Oracle", "Ivalua"].map((name) => (
                <div key={name} className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center">
                  <p className="text-sm text-white/40">{name}</p>
                  <p className="mt-1 text-[10px] text-white/20">awaiting first run</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {allPortals.map((portal: any) => (
              <div
                key={portal.id}
                className="rounded-2xl border border-white/8 bg-white/[0.02] p-5"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="text-base font-medium text-white">{portal.portal_name}</p>
                    <p className="text-xs text-white/30">{portal.portal_domain}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-lg">
                    🌐
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/25">Runs</p>
                    <p className="mt-1 text-xl font-semibold tabular-nums text-white">
                      {portal.runs_completed}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/25">Success</p>
                    <p className="mt-1 text-xl font-semibold text-emerald-400">
                      {portal.success_rate ? `${portal.success_rate}%` : "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-white/5 pt-3">
                  <p className="text-[10px] text-white/20">
                    Last run: {formatDate(portal.last_run_at)}
                  </p>
                  {portal.avg_duration_ms && (
                    <p className="text-[10px] text-white/20">
                      Avg duration: {Math.round(portal.avg_duration_ms / 1000)}s
                    </p>
                  )}
                </div>

                {portal.known_quirks && portal.known_quirks.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/25">Known quirks</p>
                    <div className="mt-1 space-y-1">
                      {portal.known_quirks.map((q: string, i: number) => (
                        <p key={i} className="text-xs text-white/40">• {q}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
