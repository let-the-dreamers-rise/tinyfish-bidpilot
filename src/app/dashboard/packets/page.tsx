import type { Metadata } from "next";
import Link from "next/link";

import { CreatePacketButton } from "./create-packet-button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Packets | BidPilot",
  description: "Manage your vendor onboarding packets.",
};

export default async function PacketsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = (await supabase
    .from("profiles")
    .select("team_id, full_name")
    .eq("id", user.id)
    .single()) as { data: { team_id: string | null; full_name: string | null } | null };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packets } = (await supabase
    .from("vendor_packets")
    .select(`
      *,
      documents(id),
      tinyfish_runs(id, status)
    `)
    .eq("team_id", profile?.team_id || "")
    .order("created_at", { ascending: false })) as { data: any[] | null };

  const allPackets = packets || [];

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

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-white">
              Packets
            </h1>
            <p className="mt-1 text-sm text-white/40">
              {allPackets.length} vendor onboarding {allPackets.length === 1 ? "packet" : "packets"}
            </p>
          </div>
          <CreatePacketButton variant="header" />
        </div>

        {/* Packets grid */}
        {allPackets.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent)]/10 text-3xl">
              📦
            </div>
            <h2 className="text-xl font-medium text-white">No packets yet</h2>
            <p className="mt-2 max-w-md text-sm text-white/40">
              A vendor packet contains all the documents, field mappings, and metadata
              needed to onboard a supplier through their portal. Create one to get started.
            </p>
            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-center gap-3 text-sm text-white/50">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs text-[var(--accent)]">1</span>
                Create a packet with vendor name and portal URL
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs text-[var(--accent)]">2</span>
                Upload tax forms, insurance certificates, and compliance docs
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)]/10 text-xs text-[var(--accent)]">3</span>
                Launch TinyFish to fill the portal automatically
              </div>
            </div>
            <CreatePacketButton variant="empty_state" />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {allPackets.map((packet: any) => (
              <Link
                key={packet.id}
                href={`/dashboard/packets/${packet.id}`}
                className="group rounded-2xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-white/15 hover:bg-white/[0.04]"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base font-medium text-white group-hover:text-[var(--accent)]">
                      {packet.vendor_name}
                    </p>
                    <p className="mt-0.5 text-xs text-white/35">
                      {packet.portal_name || "Custom portal"}
                    </p>
                  </div>
                  <span className={`ml-3 rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${getStatusClasses(packet.status)}`}>
                    {packet.status}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="h-1.5 rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-[var(--accent)] transition-all"
                      style={{ width: `${packet.progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-right text-[10px] tabular-nums text-white/25">
                    {packet.progress}% complete
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-[11px] text-white/30">
                  <div className="flex items-center gap-3">
                    <span>{packet.documents?.length || 0} docs</span>
                    <span>{packet.tinyfish_runs?.length || 0} runs</span>
                  </div>
                  <span>{formatDate(packet.created_at)}</span>
                </div>

                <p className="signal-face mt-3 text-[10px] uppercase tracking-[0.2em] text-white/20">
                  {packet.packet_id}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
