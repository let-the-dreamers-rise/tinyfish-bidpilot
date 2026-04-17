import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10 lg:px-10">
      <div className="max-w-2xl rounded-[2rem] border border-white/10 bg-black/20 p-8 text-center backdrop-blur-xl">
        <p className="section-label">404</p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-0.05em] text-white">
          That workspace does not exist.
        </h1>
        <p className="mt-5 text-lg leading-8 text-white/58">
          Head back to BidPilot and reopen the queue, launch pad, or portal
          sandbox from a valid route.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/" className="halo-button">
            go home
          </Link>
          <Link href="/workspace" className="ghost-button">
            open workspace
          </Link>
        </div>
      </div>
    </main>
  );
}
