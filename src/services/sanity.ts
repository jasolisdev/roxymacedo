type SanityQueryParams = Record<string, string | number | boolean | null | undefined>;

type SanityResponse<T> = {
  result: T;
};

function getSanityConfig() {
  const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined;
  const dataset = import.meta.env.VITE_SANITY_DATASET as string | undefined;
  const apiVersion =
    (import.meta.env.VITE_SANITY_API_VERSION as string | undefined) ?? "2023-10-01";
  const token = import.meta.env.VITE_SANITY_READ_TOKEN as string | undefined;

  return { projectId, dataset, apiVersion, token };
}

export function isSanityConfigured() {
  const { projectId, dataset } = getSanityConfig();
  return Boolean(projectId && dataset);
}

export async function sanityQuery<T>(query: string, params: SanityQueryParams = {}) {
  const { projectId, dataset, apiVersion, token } = getSanityConfig();
  if (!projectId || !dataset) {
    throw new Error(
      "Sanity is not configured. Set VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET in your env.",
    );
  }

  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set("query", query);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    url.searchParams.set(`$${key}`, typeof value === "string" ? JSON.stringify(value) : String(value));
  }

  const response = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `Sanity query failed: ${response.status} ${response.statusText}${details ? ` - ${details}` : ""}`,
    );
  }

  const json = (await response.json()) as SanityResponse<T>;
  return json.result;
}
