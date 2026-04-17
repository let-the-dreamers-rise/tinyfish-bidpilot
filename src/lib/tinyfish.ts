// ---------------------------------------------------------------------------
// TinyFish unified client — all 4 APIs under one API key
// Agent  : POST https://agent.tinyfish.ai/v1/automation/run-async
// Search : GET  https://api.search.tinyfish.ai
// Fetch  : POST https://api.fetch.tinyfish.ai
// Browser: POST https://api.browser.tinyfish.ai
// ---------------------------------------------------------------------------

// ---- Shared ----------------------------------------------------------------

export function hasTinyFishApiKey() {
  return Boolean(process.env.TINYFISH_API_KEY);
}

function getTinyFishApiKey() {
  const apiKey = process.env.TINYFISH_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Missing TINYFISH_API_KEY. Add it to your environment to unlock live runs.",
    );
  }
  return apiKey;
}

async function parseTinyFishResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => null)) as T | null;

  if (!response.ok || !payload) {
    const message =
      payload && typeof payload === "object" && "error" in payload
        ? JSON.stringify(payload)
        : `TinyFish request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload;
}

// ---- Agent API (existing) --------------------------------------------------

const TINYFISH_AGENT_BASE =
  process.env.TINYFISH_API_BASE ?? "https://agent.tinyfish.ai/v1";

export type BrowserProfile = "lite" | "stealth";

export type TinyFishLaunchInput = {
  url: string;
  goal: string;
  browserProfile: BrowserProfile;
  useVault: boolean;
  proxyEnabled: boolean;
  proxyCountryCode?: string;
  credentialItemIds?: string[];
};

export type TinyFishStep = {
  id?: string;
  timestamp?: string;
  status?: string;
  action?: string;
  screenshot?: string;
  duration?: string;
};

export type TinyFishRun = {
  run_id: string;
  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "CANCELLED";
  goal: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  num_of_steps: number | null;
  result: Record<string, unknown>;
  error: {
    message?: string;
    category?: string;
    code?: string;
    retry_after?: number;
    help_url?: string;
    help_message?: string;
  } | null;
  streaming_url: string | null;
  browser_config: {
    proxy_enabled?: boolean;
    proxy_country_code?: string;
  };
  steps: TinyFishStep[];
};

export async function launchTinyFishRun(input: TinyFishLaunchInput) {
  const apiKey = getTinyFishApiKey();

  const credentialItemIds = input.credentialItemIds?.filter(Boolean);
  const payload = {
    url: input.url,
    goal: input.goal,
    browser_profile: input.browserProfile,
    proxy_config: input.proxyEnabled
      ? { enabled: true, country_code: input.proxyCountryCode || "US" }
      : { enabled: false },
    api_integration: "bidpilot-nextjs",
    use_vault: input.useVault,
    ...(input.useVault && credentialItemIds?.length
      ? { credential_item_ids: credentialItemIds }
      : {}),
  };

  const response = await fetch(`${TINYFISH_AGENT_BASE}/automation/run-async`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  return parseTinyFishResponse<{ run_id: string | null; error: unknown }>(
    response,
  );
}

export async function getTinyFishRun(runId: string) {
  const apiKey = getTinyFishApiKey();
  const response = await fetch(
    `${TINYFISH_AGENT_BASE}/runs/${encodeURIComponent(runId)}?screenshots=none`,
    {
      method: "GET",
      headers: { "X-API-Key": apiKey },
      cache: "no-store",
    },
  );

  return parseTinyFishResponse<TinyFishRun>(response);
}

// ---- Search API (NEW) ------------------------------------------------------

const TINYFISH_SEARCH_BASE = "https://api.search.tinyfish.ai";

export type SearchResult = {
  position: number;
  site_name: string;
  title: string;
  snippet: string;
  url: string;
};

export type SearchResponse = {
  query: string;
  results: SearchResult[];
  total_results: number;
};

export type SearchOptions = {
  location?: string;
  language?: string;
};

export async function searchWeb(
  query: string,
  options?: SearchOptions,
): Promise<SearchResponse> {
  const apiKey = getTinyFishApiKey();

  const params = new URLSearchParams({ query });
  if (options?.location) params.set("location", options.location);
  if (options?.language) params.set("language", options.language);

  const response = await fetch(`${TINYFISH_SEARCH_BASE}?${params.toString()}`, {
    method: "GET",
    headers: { "X-API-Key": apiKey },
    cache: "no-store",
  });

  return parseTinyFishResponse<SearchResponse>(response);
}

// ---- Fetch API (NEW) -------------------------------------------------------

const TINYFISH_FETCH_BASE = "https://api.fetch.tinyfish.ai";

export type FetchFormat = "markdown" | "html" | "json";

export type FetchResultItem = {
  url: string;
  final_url: string;
  title: string;
  description: string;
  language: string;
  text: string;
};

export type FetchErrorItem = {
  url: string;
  error: string;
};

export type FetchResponse = {
  results: FetchResultItem[];
  errors: FetchErrorItem[];
};

export async function fetchUrls(
  urls: string[],
  format: FetchFormat = "markdown",
): Promise<FetchResponse> {
  const apiKey = getTinyFishApiKey();

  const response = await fetch(TINYFISH_FETCH_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({ urls, format }),
    cache: "no-store",
  });

  return parseTinyFishResponse<FetchResponse>(response);
}

// ---- Browser API (NEW) -----------------------------------------------------

const TINYFISH_BROWSER_BASE = "https://api.browser.tinyfish.ai";

export type BrowserSession = {
  session_id: string;
  cdp_url: string;
  base_url: string;
};

export async function createBrowserSession(
  url: string,
): Promise<BrowserSession> {
  const apiKey = getTinyFishApiKey();

  const response = await fetch(TINYFISH_BROWSER_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({ url }),
    cache: "no-store",
  });

  return parseTinyFishResponse<BrowserSession>(response);
}
