import type { Metadata } from "next";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard | BidPilot",
  description: "Overview of your supplier portal operations.",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = (await supabase
    .from("profiles")
    .select("team_id, full_name, onboarded")
    .eq("id", user.id)
    .single()) as { data: { team_id: string | null; full_name: string | null; onboarded: boolean } | null };

  // Fetch packets
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packets } = (await supabase
    .from("vendor_packets")
    .select("id, vendor_name, portal_name, status, progress, created_at, packet_id")
    .eq("team_id", profile?.team_id || "")
    .order("created_at", { ascending: false })) as { data: any[] | null };

  // Fetch recent audit entries
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: recentAudit } = (await supabase
    .from("audit_entries")
    .select("id, action, detail, actor_name, created_at")
    .eq("team_id", profile?.team_id || "")
    .order("created_at", { ascending: false })
    .limit(8)) as { data: any[] | null };

  // Fetch runs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: runs } = (await supabase
    .from("tinyfish_runs")
    .select("id, status, created_at")
    .eq("team_id", profile?.team_id || "")) as { data: any[] | null };

  // Fetch documents count
  const { count: docsCount } = await supabase
    .from("documents")
    .select("id", { count: "exact", head: true });

  const allPackets = packets || [];
  const allRuns = runs || [];
  const allAudit = recentAudit || [];

  const metrics = [
    {
      label: "Open Packets",
      value: allPackets.length,
      change: allPackets.filter((p: any) => p.status === "draft").length + " drafts",
      icon: "📦",
    },
    {
      label: "Awaiting Review",
      value: allPackets.filter((p: any) => p.status === "review").length,
      change: "at approval gate",
      icon: "⏳",
    },
    {
      label: "TinyFish Runs",
      value: allRuns.length,
      change: allRuns.filter((r: any) => r.status === "completed").length + " completed",
      icon: "🐟",
    },
    {
      label: "Documents",
      value: docsCount || 0,
      change: "in packet vault",
      icon: "📄",
    },
  ];

  function getStatusClasses(status: string) {
    switch (status) {
      case "approved":
        return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
      case "review":
        return "border-blue-500/20 bg-blue-500/10 text-blue-400";
      case "running":
        return "border-amber-500/20 bg-amber-500/10 text-amber-400";
      case "ready":
        return "border-[var(--accent)]/20 bg-[var(--accent)]/10 text-[var(--accent)]";
      case "blocked":
        return "border-red-500/20 bg-red-500/10 text-red-400";
      default:
        return "border-white/10 bg-white/5 text-white/50";
    }
  }

  function timeAgo(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-white/40">
            Welcome back, {profile?.full_name || user.email?.split("@")[0]}
          </p>
          <h1 className="mt-1 text-3xl font-medium tracking-tight text-white">
            Dashboard
          </h1>
        </div>

        {/* Metrics */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-colors hover:border-white/12"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-white/40">
                  {m.label}
                </p>
                <span className="text-lg">{m.icon}</span>
              </div>
              <p className="mt-3 text-3xl font-semibold tabular-nums text-white">
                {m.value}
              </p>
              <p className="mt-1 text-xs text-white/30">{m.change}</p>
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Recent packets */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-white/50">
                Recent Packets
              </h2>
              <Link
                href="/dashboard/packets"
                className="text-xs text-[var(--accent)] transition-colors hover:text-[var(--accent)]/80"
              >
                View all →
              </Link>
            </div>

            {allPackets.length === 0 ? (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]/10 text-2xl">
                  📦
                </div>
                <p className="text-sm font-medium text-white">No packets yet</p>
                <p className="mt-1 max-w-xs text-xs text-white/40">
                  Create your first vendor packet to start automating portal onboarding with TinyFish.
                </p>
                <Link href="/dashboard/packets" className="halo-button mt-5 !py-2 !px-5 !text-[10px]">
                  create first packet
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {allPackets.slice(0, 6).map((packet: any) => (
                  <Link
                    key={packet.id}
                    href={`/dashboard/packets/${packet.id}`}
                    className="group flex items-center gap-4 rounded-xl border border-transparent px-4 py-3 transition-all hover:border-white/8 hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white group-hover:text-[var(--accent)]">
                        {packet.vendor_name}
                      </p>
                      <p className="mt-0.5 text-xs text-white/35">
                        {packet.portal_name || "Custom portal"} · {packet.packet_id}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${getStatusClasses(packet.status)}`}>
                      {packet.status}
                    </span>
                    <div className="hidden w-16 sm:block">
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-[var(--accent)] transition-all"
                          style={{ width: `${packet.progress}%` }}
                        />
                      </div>
                      <p className="mt-1 text-right text-[10px] tabular-nums text-white/30">
                        {packet.progress}%
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Activity feed */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-white/50">
                Recent Activity
              </h2>
              <Link
                href="/dashboard/audit"
                className="text-xs text-[var(--accent)] transition-colors hover:text-[var(--accent)]/80"
              >
                Full log →
              </Link>
            </div>

            {allAudit.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center">
                <p className="text-2xl">📝</p>
                <p className="mt-2 text-xs text-white/40">
                  Activity will appear here as you work with packets and runs.
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {allAudit.map((entry: any, i: number) => (
                  <div
                    key={entry.id}
                    className={`flex gap-3 py-3 ${i < allAudit.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-[10px]">
                      {entry.action.includes("uploaded") ? "📎" :
                       entry.action.includes("created") ? "➕" :
                       entry.action.includes("Run") ? "🐟" :
                       entry.action.includes("approved") ? "✅" : "📝"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-white/70">{entry.action}</p>
                      <p className="mt-0.5 truncate text-[11px] text-white/30">
                        {entry.detail}
                      </p>
                    </div>
                    <p className="flex-shrink-0 text-[10px] text-white/25">
                      {timeAgo(entry.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard/packets"
            className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-[var(--accent)]/20 hover:bg-[var(--accent)]/[0.03]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-lg transition-transform group-hover:scale-110">
              ➕
            </div>
            <div>
              <p className="text-sm font-medium text-white">New Packet</p>
              <p className="text-xs text-white/35">Start a vendor onboarding</p>
            </div>
          </Link>
          <Link
            href="/dashboard/runs"
            className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-[var(--accent)]/20 hover:bg-[var(--accent)]/[0.03]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-lg transition-transform group-hover:scale-110">
              🐟
            </div>
            <div>
              <p className="text-sm font-medium text-white">View Runs</p>
              <p className="text-xs text-white/35">Monitor TinyFish executions</p>
            </div>
          </Link>
          <Link
            href="/dashboard/intelligence"
            className="group flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-[var(--accent)]/20 hover:bg-[var(--accent)]/[0.03]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-lg transition-transform group-hover:scale-110">
              🌐
            </div>
            <div>
              <p className="text-sm font-medium text-white">Portal Intel</p>
              <p className="text-xs text-white/35">See known portal patterns</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
