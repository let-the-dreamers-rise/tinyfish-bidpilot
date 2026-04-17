"use client";

import { useCallback, useState } from "react";

type DocumentUploaderProps = {
  packetId: string;
  onUploaded?: () => void;
};

type UploadedDoc = {
  id: string;
  file_name: string;
  file_size: number | null;
  file_type: string | null;
  status: string;
};

export function DocumentUploader({ packetId, onUploaded }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`/api/packets/${packetId}/documents`, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const { document } = await res.json();
        setUploadedDocs((prev) => [document, ...prev]);
        onUploaded?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [packetId, onUploaded],
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragActive
            ? "border-[var(--accent)]/50 bg-[var(--accent)]/5"
            : "border-white/10 hover:border-white/20"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[var(--accent)]" />
            <p className="text-sm text-white/50">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="mb-2 text-2xl">📎</div>
            <p className="text-sm text-white/60">
              Drag and drop files here, or{" "}
              <label className="cursor-pointer text-[var(--accent)] hover:underline">
                browse
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg"
                />
              </label>
            </p>
            <p className="mt-1 text-xs text-white/30">
              PDF, DOC, XLS, images — max 50 MB
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          {error}
        </div>
      )}

      {/* Uploaded documents list */}
      {uploadedDocs.length > 0 && (
        <div className="space-y-2">
          {uploadedDocs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5"
            >
              <span className="text-sm">
                {doc.file_type?.includes("pdf")
                  ? "📄"
                  : doc.file_type?.includes("image")
                    ? "🖼️"
                    : doc.file_type?.includes("sheet") || doc.file_type?.includes("excel")
                      ? "📊"
                      : "📎"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-white">{doc.file_name}</p>
                <p className="text-xs text-white/30">{formatSize(doc.file_size)}</p>
              </div>
              <span className="rounded-full bg-[var(--success)]/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-[var(--success)]">
                {doc.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
