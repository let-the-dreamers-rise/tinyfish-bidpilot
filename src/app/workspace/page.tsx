import Link from "next/link";

import { LiveWorkspace } from "@/components/live-workspace";
import { createClient } from "@/lib/supabase/server";

export default async function WorkspacePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null; // Middleware handles redirect
  }

  const { data: profile } = (await supabase
    .from("profiles")
    .select("team_id, full_name, onboarded")
    .eq("id", user.id)
    .single()) as { data: { team_id: string | null; full_name: string | null; onboarded: boolean } | null };

  // Fetch real packets from DB
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packets } = (await supabase
    .from("vendor_packets")
    .select(
      `
      *,
      documents(id, file_name, file_size, file_type, status),
      tinyfish_runs(id, tf_run_id, status, safety_mode, created_at),
      audit_entries(id, action, detail, actor_name, created_at)
    `,
    )
    .eq("team_id", profile?.team_id || "")
    .order("created_at", { ascending: false })) as { data: any[] | null };

  // Compute real metrics
  const allPackets = packets || [];
  const metrics = {
    openPackets: allPackets.length,
    awaitingApproval: allPackets.filter((p: any) => p.status === "review").length,
    totalRuns: allPackets.reduce(
      (acc: number, p: any) => acc + (p.tinyfish_runs?.length || 0),
      0,
    ),
    totalDocs: allPackets.reduce(
      (acc: number, p: any) => acc + (p.documents?.length || 0),
      0,
    ),
  };

  return (
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-label">workspace</p>
            <h1 className="mt-4 text-5xl font-medium tracking-[-0.05em] text-white">
              Vendor ops workspace
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/58">
              Your real packets, real documents, real runs. Everything persists.
              Create a packet, upload documents, launch TinyFish, and review
              before approval.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/" className="ghost-button">
              back to home
            </Link>
            <Link href="/dashboard/scanner" className="ghost-button">
              open portal scanner
            </Link>
          </div>
        </div>

        {/* Real metrics */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: "Open packets",
              value: String(metrics.openPackets),
              detail: "Active vendor onboarding workflows",
            },
            {
              label: "Awaiting approval",
              value: String(metrics.awaitingApproval),
              detail: "Packets at the human review gate",
            },
            {
              label: "TinyFish runs",
              value: String(metrics.totalRuns),
              detail: "Total agent executions against portals",
            },
            {
              label: "Documents",
              value: String(metrics.totalDocs),
              detail: "Files uploaded to packet vault",
            },
          ].map((card) => (
            <div
              key={card.label}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--accent)]/70">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-semibold text-white">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-white/40">{card.detail}</p>
            </div>
          ))}
        </div>

        {/* Live workspace with real data */}
        <LiveWorkspace
          initialPackets={allPackets}
          userName={profile?.full_name || user.email || "User"}
        />
      </div>
    </main>
  );
}
