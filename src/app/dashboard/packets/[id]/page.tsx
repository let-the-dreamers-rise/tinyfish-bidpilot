import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DocumentUploader } from "@/components/document-uploader";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata(
  props: { params: Promise<{ id: string }> },
): Promise<Metadata> {
  const { id } = await props.params;
  const supabase = await createClient();

  const { data: packet } = (await supabase
    .from("vendor_packets")
    .select("vendor_name, portal_name")
    .eq("id", id)
    .single()) as { data: { vendor_name: string; portal_name: string | null } | null };

  if (!packet) return { title: "Packet Not Found | BidPilot" };

  return {
    title: `${packet.vendor_name} | BidPilot`,
    description: `Vendor packet for ${packet.vendor_name} on ${packet.portal_name || "portal"}.`,
  };
}

export default async function PacketDetailPage(
  props: { params: Promise<{ id: string }> },
) {
  const { id } = await props.params;
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

  // Fetch packet with all relations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: packet } = (await supabase
    .from("vendor_packets")
    .select(`
      *,
      documents(id, file_name, file_size, file_type, status, created_at),
      tinyfish_runs(id, tf_run_id, status, safety_mode, url, created_at, finished_at),
      audit_entries(id, action, detail, actor_name, created_at)
    `)
    .eq("id", id)
    .eq("team_id", profile?.team_id || "")
    .single()) as { data: any | null };

  if (!packet) notFound();

  function getStatusClasses(status: string) {
    switch (status) {
      case "approved":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      case "review":
        return "border-blue-500/30 bg-blue-500/10 text-blue-400";
      case "running":
        return "border-amber-500/30 bg-amber-500/10 text-amber-400";
      case "ready":
        return "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]";
      case "blocked":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      case "completed":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
      case "failed":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      default:
        return "border-white/10 bg-white/5 text-white/50";
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-white/30">
          <Link href="/dashboard" className="transition hover:text-white/60">Dashboard</Link>
          <span>/</span>
          <Link href="/dashboard/packets" className="transition hover:text-white/60">Packets</Link>
          <span>/</span>
          <span className="text-white/50">{packet.vendor_name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-medium tracking-tight text-white">
                {packet.vendor_name}
              </h1>
              <span className={`rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-wider ${getStatusClasses(packet.status)}`}>
                {packet.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-white/40">
              {packet.portal_name || packet.portal_url} · {packet.owner_name} · {packet.packet_id}
            </p>
            {packet.summary && (
              <p className="mt-2 max-w-2xl text-sm text-white/50">{packet.summary}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            {packet.status === "review" && (
              <form action={`/api/packets/${packet.id}`} method="POST">
                <button type="submit" className="halo-button !py-2.5 !px-5 !text-[10px]">
                  ✓ approve packet
                </button>
              </form>
            )}
            {["draft", "ready"].includes(packet.status) && (
              <Link
                href={`/dashboard/packets/${packet.id}/run`}
                className="halo-button !py-2.5 !px-5 !text-[10px]"
              >
                🐟 launch tinyfish
              </Link>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-white/30">
            <span>Progress</span>
            <span className="tabular-nums">{packet.progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/70 transition-all"
              style={{ width: `${packet.progress}%` }}
            />
          </div>
        </div>

        {/* Three-column layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Documents */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.15em] text-white/50">
              Documents ({packet.documents?.length || 0})
            </h2>

            {packet.documents?.length > 0 ? (
              <div className="mb-4 space-y-2">
                {packet.documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2.5"
                  >
                    <span className="text-sm">
                      {doc.file_type?.includes("pdf") ? "📄" :
                       doc.file_type?.includes("image") ? "🖼️" :
                       doc.file_type?.includes("sheet") ? "📊" : "📎"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white">{doc.file_name}</p>
                      <p className="text-[10px] text-white/25">
                        {doc.file_size ? `${(doc.file_size / 1024).toFixed(1)} KB` : "—"}
                      </p>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider ${getStatusClasses(doc.status)}`}>
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mb-4 text-xs text-white/30">No documents uploaded yet.</p>
            )}

            <DocumentUploader packetId={packet.id} />
          </div>

          {/* Runs */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-white/50">
                TinyFish Runs ({packet.tinyfish_runs?.length || 0})
              </h2>
              {["draft", "ready"].includes(packet.status) && (
                <Link
                  href={`/dashboard/packets/${packet.id}/run`}
                  className="text-xs text-[var(--accent)] transition hover:text-[var(--accent)]/80"
                >
                  Launch →
                </Link>
              )}
            </div>

            {packet.tinyfish_runs?.length > 0 ? (
              <div className="space-y-3">
                {packet.tinyfish_runs.map((run: any) => (
                  <Link
                    key={run.id}
                    href={`/dashboard/runs/${run.id}`}
                    className="block rounded-xl border border-white/8 bg-white/[0.03] p-3 transition hover:border-white/12"
                  >
                    <div className="flex items-center justify-between">
                      <span className="signal-face text-[10px] text-white/40">
                        {run.tf_run_id?.slice(0, 12)}...
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider ${getStatusClasses(run.status)}`}>
                        {run.status}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-white/30">
                      {run.safety_mode} · {formatDate(run.created_at)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/8 py-8 text-center">
                <p className="text-lg">🐟</p>
                <p className="mt-2 text-xs text-white/30">
                  No runs yet. Launch TinyFish to automate portal work.
                </p>
              </div>
            )}
          </div>

          {/* Audit trail */}
          <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
            <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.15em] text-white/50">
              Audit Trail ({packet.audit_entries?.length || 0})
            </h2>

            {packet.audit_entries?.length > 0 ? (
              <div className="space-y-0">
                {packet.audit_entries.map((entry: any, i: number) => (
                  <div
                    key={entry.id}
                    className={`flex gap-3 py-2.5 ${i < packet.audit_entries.length - 1 ? "border-b border-white/5" : ""}`}
                  >
                    <div className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--accent)]/40" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-white/60">{entry.action}</p>
                      <p className="mt-0.5 truncate text-[10px] text-white/25">{entry.detail}</p>
                      <p className="mt-0.5 text-[10px] text-white/20">
                        {entry.actor_name} · {formatDate(entry.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/30">No activity yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
