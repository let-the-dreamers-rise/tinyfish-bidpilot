"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 py-10 text-[var(--foreground)]">
        <main className="max-w-2xl rounded-[2rem] border border-white/10 bg-black/25 p-8 text-center backdrop-blur-xl">
          <p className="section-label">global error</p>
          <h1 className="mt-4 text-5xl font-medium tracking-[-0.05em] text-white">
            BidPilot hit an unexpected failure.
          </h1>
          <p className="mt-5 text-lg leading-8 text-white/58">
            The workflow should stay recoverable even when a run or route
            misbehaves. Reset the screen or return to the workspace and try the
            packet again.
          </p>
          <p className="mt-5 text-sm leading-7 text-white/42">
            {error.message}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button type="button" onClick={() => reset()} className="halo-button">
              retry
            </button>
            <Link href="/" className="ghost-button">
              back to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
