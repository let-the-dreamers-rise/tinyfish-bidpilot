import type { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Runs | BidPilot",
  description: "Monitor all TinyFish executions.",
};

export default async function RunsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = (await supabase
    .from("profiles")
    .select("team_id")
    .eq("id", user.id)
    .single()) as { data: { team_id: string | null } | null };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: runs } = (await supabase
    .from("tinyfish_runs")
    .select(`
      id, tf_run_id, status, safety_mode, url, created_at, finished_at, error_message,
      vendor_packets(id, vendor_name, portal_name, packet_id)
    `)
    .eq("team_id", profile?.team_id || "")
    .order("created_at", { ascending: false })) as { data: any[] | null };

  const allRuns = runs || [];

  function getStatusClasses(status: string) {
    switch (status) {
      case "completed": return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
      case "running": return "border-amber-500/20 bg-amber-500/10 text-amber-400";
      case "failed": return "border-red-500/20 bg-red-500/10 text-red-400";
      case "cancelled": return "border-white/10 bg-white/5 text-white/40";
      default: return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  function duration(start: string, end: string | null) {
    if (!end) return "—";
    const ms = new Date(end).getTime() - new Date(start).getTime();
    const secs = Math.floor(ms / 1000);
    if (secs < 60) return `${secs}s`;
    return `${Math.floor(secs / 60)}m ${secs % 60}s`;
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-medium tracking-tight text-white">Runs</h1>
          <p className="mt-1 text-sm text-white/40">
            {allRuns.length} TinyFish {allRuns.length === 1 ? "execution" : "executions"}
          </p>
        </div>

        {allRuns.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <div className="mb-5 text-4xl">🐟</div>
            <h2 className="text-xl font-medium text-white">No runs yet</h2>
            <p className="mt-2 max-w-md text-sm text-white/40">
              TinyFish runs appear here when you launch a portal execution from a packet.
            </p>
            <Link href="/dashboard/packets" className="halo-button mt-6 !py-2.5 !px-5 !text-[10px]">
              go to packets
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/8 bg-white/[0.02]">
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Run ID</th>
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Vendor</th>
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Status</th>
                  <th className="hidden px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-white/30 md:table-cell">Mode</th>
                  <th className="hidden px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-white/30 lg:table-cell">Duration</th>
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.15em] text-white/30">Date</th>
                </tr>
              </thead>
              <tbody>
                {allRuns.map((run: any, i: number) => (
                  <tr
                    key={run.id}
                    className={`transition-colors hover:bg-white/[0.03] ${i < allRuns.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    <td className="px-5 py-3.5">
                      <span className="signal-face text-xs text-white/50">
                        {run.tf_run_id?.slice(0, 16) || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {run.vendor_packets ? (
                        <Link
                          href={`/dashboard/packets/${run.vendor_packets.id}`}
                          className="text-sm text-white/70 transition hover:text-[var(--accent)]"
                        >
                          {run.vendor_packets.vendor_name}
                        </Link>
                      ) : (
                        <span className="text-sm text-white/30">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${getStatusClasses(run.status)}`}>
                        {run.status === "running" && (
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                        )}
                        {run.status}
                      </span>
                    </td>
                    <td className="hidden px-5 py-3.5 md:table-cell">
                      <span className="text-xs text-white/35">{run.safety_mode}</span>
                    </td>
                    <td className="hidden px-5 py-3.5 lg:table-cell">
                      <span className="signal-face text-xs text-white/35">
                        {duration(run.created_at, run.finished_at)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-white/35">{formatDate(run.created_at)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
