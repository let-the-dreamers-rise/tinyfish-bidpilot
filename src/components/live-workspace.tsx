"use client";

import { useCallback, useState } from "react";

import { CreatePacketDialog } from "@/components/create-packet-dialog";
import { DocumentUploader } from "@/components/document-uploader";

type WorkspaceRail = "queue" | "packet" | "run" | "review" | "audit";

type PacketWithRelations = {
  id: string;
  vendor_name: string;
  portal_url: string;
  portal_name: string | null;
  owner_name: string;
  status: string;
  progress: number;
  due_date: string | null;
  packet_id: string;
  summary: string | null;
  field_mappings: unknown;
  checklist: unknown;
  created_at: string;
  documents: {
    id: string;
    file_name: string;
    file_size: number | null;
    file_type: string | null;
    status: string;
  }[];
  tinyfish_runs: {
    id: string;
    tf_run_id: string | null;
    status: string;
    safety_mode: string;
    created_at: string;
  }[];
  audit_entries: {
    id: string;
    action: string;
    detail: string | null;
    actor_name: string | null;
    created_at: string;
  }[];
};

const rails: { id: WorkspaceRail; label: string }[] = [
  { id: "queue", label: "Queue" },
  { id: "packet", label: "Packet" },
  { id: "run", label: "Run" },
  { id: "review", label: "Review" },
  { id: "audit", label: "Audit" },
];

function statusTone(status: string) {
  if (["approved", "review"].includes(status)) return "text-[var(--success)]";
  if (["running", "ready", "draft"].includes(status))
    return "text-[var(--accent)]";
  return "text-white/50";
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function LiveWorkspace({
  initialPackets,
  userName,
}: {
  initialPackets: PacketWithRelations[];
  userName: string;
}) {
  const [packets, setPackets] = useState(initialPackets);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialPackets[0]?.id || null,
  );
  const [activeRail, setActiveRail] = useState<WorkspaceRail>("queue");
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState("");

  const selected = packets.find((p) => p.id === selectedId) || null;

  const filtered = packets.filter(
    (p) =>
      p.vendor_name.toLowerCase().includes(filter.toLowerCase()) ||
      p.portal_name?.toLowerCase().includes(filter.toLowerCase()) ||
      p.packet_id.toLowerCase().includes(filter.toLowerCase()),
  );

  const reloadPackets = useCallback(async () => {
    const res = await fetch("/api/packets");
    if (res.ok) {
      const data = await res.json();
      setPackets(data.packets || []);
    }
  }, []);

  async function approvePacket(packetId: string) {
    await fetch(`/api/packets/${packetId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved", progress: 100 }),
    });
    reloadPackets();
  }

  return (
    <>
      {/* Rail tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {rails.map((rail) => (
          <button
            key={rail.id}
            type="button"
            onClick={() => setActiveRail(rail.id)}
            className={`signal-face rounded-lg border px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
              activeRail === rail.id
                ? "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
            }`}
          >
            {rail.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        {/* Packet queue sidebar */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search packets..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-[var(--accent)]/50"
            />
            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/20"
              title="Create new packet"
            >
              +
            </button>
          </div>

          {filtered.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center">
              <p className="text-2xl">📦</p>
              <p className="mt-2 text-sm text-white/50">
                No packets yet. Create your first one!
              </p>
              <button
                type="button"
                onClick={() => setShowCreate(true)}
                className="halo-button mt-4"
              >
                create packet
              </button>
            </div>
          )}

          {filtered.map((packet) => (
            <button
              key={packet.id}
              type="button"
              onClick={() => {
                setSelectedId(packet.id);
                setActiveRail("packet");
              }}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                selectedId === packet.id
                  ? "border-[var(--accent)]/30 bg-[var(--accent)]/[0.06]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {packet.vendor_name}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    {packet.portal_name || "Custom portal"} · {packet.packet_id}
                  </p>
                </div>
                <span
                  className={`signal-face text-[10px] uppercase tracking-widest ${statusTone(packet.status)}`}
                >
                  {packet.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-all"
                  style={{ width: `${packet.progress}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-white/30">
                  {packet.documents?.length || 0} docs ·{" "}
                  {packet.tinyfish_runs?.length || 0} runs
                </span>
                <span className="text-xs text-white/30">
                  {packet.due_date || "No deadline"}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          {!selected ? (
            <div className="flex min-h-[400px] items-center justify-center text-center">
              <div>
                <p className="text-3xl">🚀</p>
                <p className="mt-3 text-lg text-white/50">
                  Select a packet or create a new one
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreate(true)}
                  className="halo-button mt-4"
                >
                  create your first packet
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Packet header */}
              <div className="mb-6 flex items-start justify-between border-b border-white/10 pb-6">
                <div>
                  <p className="signal-face text-xs uppercase tracking-[0.2em] text-[var(--accent)]">
                    {selected.packet_id}
                  </p>
                  <h2 className="mt-1 text-2xl font-medium text-white">
                    {selected.vendor_name}
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    {selected.portal_name || selected.portal_url} ·{" "}
                    {selected.owner_name}
                  </p>
                </div>
                <span
                  className={`signal-face rounded-full border px-3 py-1 text-xs uppercase tracking-widest ${
                    selected.status === "approved"
                      ? "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]"
                      : selected.status === "review"
                        ? "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]"
                        : "border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)]"
                  }`}
                >
                  {selected.status}
                </span>
              </div>

              {/* Rail content */}
              {activeRail === "queue" && (
                <div>
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
                    Packet summary
                  </h3>
                  <p className="text-sm leading-relaxed text-white/70">
                    {selected.summary || "No summary yet."}
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-widest text-white/40">
                        Progress
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-white">
                        {selected.progress}%
                      </p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <p className="text-xs uppercase tracking-widest text-white/40">
                        Created
                      </p>
                      <p className="mt-1 text-sm text-white">
                        {formatDate(selected.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeRail === "packet" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
                      Documents
                    </h3>
                    {selected.documents?.length > 0 ? (
                      <div className="space-y-2">
                        {selected.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
                          >
                            <span className="text-sm">
                              {doc.file_type?.includes("pdf") ? "📄" : "📎"}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-white">
                                {doc.file_name}
                              </p>
                              <p className="text-xs text-white/30">
                                {doc.file_size
                                  ? `${(doc.file_size / 1024).toFixed(1)} KB`
                                  : "—"}
                              </p>
                            </div>
                            <span className="rounded-full bg-[var(--success)]/10 px-2 py-0.5 text-[10px] uppercase text-[var(--success)]">
                              {doc.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-white/40">No documents yet.</p>
                    )}
                  </div>

                  <div>
                    <h3 className="mb-3 text-sm font-medium uppercase tracking-widest text-white/60">
                      Upload documents
                    </h3>
                    <DocumentUploader
                      packetId={selected.id}
                      onUploaded={reloadPackets}
                    />
                  </div>
                </div>
              )}

              {activeRail === "run" && (
                <div>
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
                    TinyFish runs
                  </h3>
                  {selected.tinyfish_runs?.length > 0 ? (
                    <div className="space-y-3">
                      {selected.tinyfish_runs.map((run) => (
                        <div
                          key={run.id}
                          className="rounded-lg border border-white/10 bg-white/[0.03] p-4"
                        >
                          <div className="flex items-center justify-between">
                            <span className="signal-face text-xs text-white/50">
                              {run.tf_run_id?.slice(0, 16) || "—"}...
                            </span>
                            <span
                              className={`signal-face text-[10px] uppercase tracking-widest ${
                                run.status === "completed"
                                  ? "text-[var(--success)]"
                                  : run.status === "failed"
                                    ? "text-red-400"
                                    : "text-[var(--accent)]"
                              }`}
                            >
                              {run.status}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-white/40">
                            {run.safety_mode} · {formatDate(run.created_at)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-white/10 p-6 text-center">
                      <p className="text-sm text-white/40">
                        No runs yet. Use the TinyFish launch pad to start a
                        portal execution.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeRail === "review" && (
                <div>
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
                    Approval review
                  </h3>
                  {selected.status === "review" ? (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-[var(--success)]/20 bg-[var(--success)]/5 p-4">
                        <p className="text-sm text-[var(--success)]">
                          ✓ This packet is ready for final approval
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                          All runs completed. Review the audit trail before
                          approving.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => approvePacket(selected.id)}
                        className="halo-button w-full justify-center"
                      >
                        approve and mark complete
                      </button>
                    </div>
                  ) : selected.status === "approved" ? (
                    <div className="rounded-lg border border-[var(--success)]/20 bg-[var(--success)]/5 p-4">
                      <p className="text-sm text-[var(--success)]">
                        ✓ This packet has been approved by {userName}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-white/40">
                      Not ready for review yet. Complete the packet and run
                      TinyFish first.
                    </p>
                  )}
                </div>
              )}

              {activeRail === "audit" && (
                <div>
                  <h3 className="mb-4 text-sm font-medium uppercase tracking-widest text-white/60">
                    Audit trail
                  </h3>
                  {selected.audit_entries?.length > 0 ? (
                    <div className="space-y-3">
                      {selected.audit_entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex gap-3 border-l-2 border-white/10 pl-4"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white">
                              {entry.action}
                            </p>
                            <p className="mt-0.5 text-xs text-white/40">
                              {entry.detail}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="signal-face text-xs text-white/30">
                              {formatTime(entry.created_at)}
                            </p>
                            <p className="text-xs text-white/20">
                              {entry.actor_name}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/40">
                      No audit entries yet. Actions will be logged here
                      automatically.
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CreatePacketDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={reloadPackets}
      />
    </>
  );
}
