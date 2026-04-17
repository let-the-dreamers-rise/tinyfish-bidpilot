import type { Metadata } from "next";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Audit Log | BidPilot",
  description: "Full audit trail of all vendor operations.",
};

export default async function AuditPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = (await supabase
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single()) as { data: { team_id: string | null } | null };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: entries } = (await supabase
    .from("audit_entries")
    .select(`
      id, action, detail, actor_name, actor_id, created_at,
      vendor_packets(id, vendor_name, packet_id)
    `)
    .eq("team_id", profile?.team_id || "")
    .order("created_at", { ascending: false })
    .limit(100)) as { data: any[] | null };

  const allEntries = entries || [];

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  function getIcon(action: string) {
    if (action.includes("uploaded")) return "📎";
    if (action.includes("created") || action.includes("Created")) return "➕";
    if (action.includes("Run") || action.includes("run")) return "🐟";
    if (action.includes("approved") || action.includes("Approved")) return "✅";
    if (action.includes("completed")) return "✓";
    if (action.includes("failed")) return "❌";
    return "📝";
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-white">Audit Log</h1>
            <p className="mt-1 text-sm text-white/40">
              {allEntries.length} {allEntries.length === 1 ? "entry" : "entries"} — complete activity trail
            </p>
          </div>
        </div>

        {allEntries.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <div className="mb-5 text-4xl">📋</div>
            <h2 className="text-xl font-medium text-white">No audit entries yet</h2>
            <p className="mt-2 max-w-md text-sm text-white/40">
              Every action you take — creating packets, uploading documents, launching runs, approving packets — is logged here automatically.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/8 bg-white/[0.02]">
            {allEntries.map((entry: any, i: number) => (
              <div
                key={entry.id}
                className={`flex items-start gap-4 px-6 py-4 transition-colors hover:bg-white/[0.02] ${
                  i < allEntries.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-sm">
                  {getIcon(entry.action)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{entry.action}</p>
                    {entry.vendor_packets && (
                      <span className="signal-face rounded-md bg-white/5 px-2 py-0.5 text-[10px] text-white/30">
                        {entry.vendor_packets.packet_id}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-white/40">{entry.detail}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-white/25">
                    <span>{entry.actor_name || "System"}</span>
                    <span>·</span>
                    <span>{formatDate(entry.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
