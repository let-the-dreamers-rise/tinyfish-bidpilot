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

const TINYFISH_API_BASE =
  process.env.TINYFISH_API_BASE ?? "https://agent.tinyfish.ai/v1";

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

export async function launchTinyFishRun(input: TinyFishLaunchInput) {
  const apiKey = getTinyFishApiKey();

  const credentialItemIds = input.credentialItemIds?.filter(Boolean);
  const payload = {
    url: input.url,
    goal: input.goal,
    browser_profile: input.browserProfile,
    proxy_config: input.proxyEnabled
      ? {
          enabled: true,
          country_code: input.proxyCountryCode || "US",
        }
      : {
          enabled: false,
        },
    api_integration: "bidpilot-nextjs",
    use_vault: input.useVault,
    ...(input.useVault && credentialItemIds?.length
      ? { credential_item_ids: credentialItemIds }
      : {}),
  };

  const response = await fetch(`${TINYFISH_API_BASE}/automation/run-async`, {
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
    `${TINYFISH_API_BASE}/runs/${encodeURIComponent(runId)}?screenshots=none`,
    {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
      },
      cache: "no-store",
    },
  );

  return parseTinyFishResponse<TinyFishRun>(response);
}
