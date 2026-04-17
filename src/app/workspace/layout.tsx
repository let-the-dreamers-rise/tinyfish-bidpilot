import Link from "next/link";

import { UserNav } from "@/components/user-nav";

export default function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/10 bg-black/15 px-6 py-5 backdrop-blur-xl lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(245,166,95,0.35)] bg-[rgba(245,166,95,0.08)] text-sm font-semibold text-[var(--accent)]">
              BP
            </span>
            <div>
              <p className="text-sm font-medium text-white">BidPilot Workspace</p>
              <p className="signal-face text-[10px] uppercase tracking-[0.32em] text-white/38">
                supplier ops — live data
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="ghost-button">
              home
            </Link>
            <Link href="/workspace" className="ghost-button">
              queue
            </Link>
            <Link href="/portal-demo" className="ghost-button">
              portal sandbox
            </Link>
            <Link href="/pricing" className="ghost-button">
              plans
            </Link>
            <UserNav />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
