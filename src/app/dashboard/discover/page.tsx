"use client";

import { useState } from "react";

type SearchResult = {
  position: number;
  site_name: string;
  title: string;
  snippet: string;
  url: string;
};

type FetchResult = {
  url: string;
  title: string;
  text: string;
};

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [fetchingUrl, setFetchingUrl] = useState<string | null>(null);
  const [fetchedPages, setFetchedPages] = useState<Record<string, FetchResult>>({});

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setSearchError("");
    setResults([]);

    try {
      const res = await fetch(
        `/api/tinyfish/search?query=${encodeURIComponent(query)}&location=US`,
      );
      const data = await res.json();
      if (data.error) {
        setSearchError(data.error);
      } else {
        setResults(data.results || []);
      }
    } catch {
      setSearchError("Search request failed. Check your network connection.");
    } finally {
      setSearching(false);
    }
  }

  async function handleFetch(url: string) {
    if (fetchedPages[url]) return;
    setFetchingUrl(url);

    try {
      const res = await fetch("/api/tinyfish/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: [url], format: "markdown" }),
      });
      const data = await res.json();
      if (data.results?.[0]) {
        setFetchedPages((prev) => ({
          ...prev,
          [url]: data.results[0],
        }));
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setFetchingUrl(null);
    }
  }

  return (
    <div className="px-6 py-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-sm">
              🔍
            </span>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]/70">
              web search api
            </p>
          </div>
          <h1 className="mt-2 text-3xl font-medium tracking-tight text-white">
            Discover Opportunities
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
            Search the live web for supplier onboarding opportunities, RFPs, and
            portal registrations using TinyFish Web Search — then extract
            details with Web Fetch. Two APIs, one pipeline.
          </p>
        </div>

        {/* Search form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              id="discover-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. supplier onboarding portal Ariba 2026"
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]/50 transition-colors"
            />
            <button
              id="discover-search-button"
              type="submit"
              disabled={searching || !query.trim()}
              className="halo-button !py-3 !px-6 !text-[11px] disabled:opacity-40"
            >
              {searching ? "searching…" : "search"}
            </button>
          </div>
          <p className="mt-2 text-[10px] text-white/25">
            Powered by TinyFish Web Search — live browser-rendered results, never cached
          </p>
        </form>

        {/* Error */}
        {searchError && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm text-red-400">
            {searchError}
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-white/50">
                Results
              </h2>
              <p className="text-[10px] text-white/25">
                {results.length} results
              </p>
            </div>

            {results.map((r) => (
              <div
                key={r.url}
                className="rounded-xl border border-white/8 bg-white/[0.02] p-5 transition-all hover:border-white/12"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-[var(--accent)]/60">
                      {r.site_name}
                    </p>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-1 block text-sm font-medium text-white hover:text-[var(--accent)] transition-colors"
                    >
                      {r.title}
                    </a>
                    <p className="mt-1.5 text-xs leading-relaxed text-white/40">
                      {r.snippet}
                    </p>
                    <p className="mt-2 truncate text-[10px] text-white/20">
                      {r.url}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleFetch(r.url)}
                    disabled={fetchingUrl === r.url || !!fetchedPages[r.url]}
                    className="flex-shrink-0 ghost-button !py-1.5 !px-3 !text-[10px] disabled:opacity-40"
                  >
                    {fetchedPages[r.url]
                      ? "✓ fetched"
                      : fetchingUrl === r.url
                        ? "fetching…"
                        : "fetch details"}
                  </button>
                </div>

                {/* Fetched content */}
                {fetchedPages[r.url] && (
                  <div className="mt-4 rounded-lg border border-white/6 bg-black/30 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-400/70">
                        web fetch result
                      </span>
                    </div>
                    <p className="text-xs font-medium text-white/70">
                      {fetchedPages[r.url].title}
                    </p>
                    <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap text-[11px] leading-relaxed text-white/35">
                      {fetchedPages[r.url].text?.slice(0, 2000)}
                      {(fetchedPages[r.url].text?.length ?? 0) > 2000 && "\n\n… (truncated)"}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!searching && results.length === 0 && !searchError && (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-white/10 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)]/10 text-2xl">
              🔍
            </div>
            <p className="text-sm font-medium text-white">
              Search for opportunities
            </p>
            <p className="mt-1 max-w-sm text-xs text-white/35">
              Use TinyFish Web Search to find supplier portals, RFP listings,
              and onboarding pages. Then fetch details to extract requirements.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {[
                "supplier onboarding portal",
                "Ariba vendor registration",
                "Coupa supplier portal open",
                "government RFP procurement 2026",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    setQuery(suggestion);
                  }}
                  className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[10px] text-white/40 transition-all hover:border-[var(--accent)]/20 hover:text-white/60"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline indicator */}
        <div className="mt-10 rounded-xl border border-white/6 bg-white/[0.01] px-5 py-4">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/25 mb-3">
            tinyfish apis used on this page
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3 py-1 text-[10px] font-medium text-[var(--accent)]">
              🔍 Web Search
            </span>
            <span className="text-white/15">→</span>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-400">
              📄 Web Fetch
            </span>
            <span className="text-white/15">→</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/25">
              🐟 Web Agent (runs)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
