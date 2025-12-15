type SubscribeRequestBody = {
  email?: unknown;
  source?: unknown;
  company?: unknown; // honeypot
};

function getEnv(name: string) {
  const value = process.env[name];
  return value && value.trim() ? value.trim() : undefined;
}

function json(res: any, status: number, body: unknown) {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function subscriberIdForEmail(email: string) {
  const encoded = Buffer.from(email, "utf8").toString("base64url");
  return `newsletterSubscriber.${encoded}`;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  const body = (req.body ?? {}) as SubscribeRequestBody;
  if (typeof body.company === "string" && body.company.trim()) {
    return json(res, 200, { ok: true });
  }

  if (typeof body.email !== "string") {
    return json(res, 400, { ok: false, error: "Email is required" });
  }

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) {
    return json(res, 400, { ok: false, error: "Invalid email" });
  }

  const projectId = getEnv("SANITY_PROJECT_ID") ?? getEnv("SANITY_STUDIO_PROJECT_ID");
  const dataset = getEnv("SANITY_DATASET") ?? getEnv("SANITY_STUDIO_DATASET");
  const apiVersion = getEnv("SANITY_API_VERSION") ?? "2023-10-01";
  const writeToken = getEnv("SANITY_WRITE_TOKEN");

  if (!projectId || !dataset || !writeToken) {
    return json(res, 500, { ok: false, error: "Server is missing Sanity env vars" });
  }

  const source = typeof body.source === "string" ? body.source.slice(0, 120) : "homepage";
  const userAgent = typeof req.headers["user-agent"] === "string" ? req.headers["user-agent"].slice(0, 300) : "";

  const mutation = {
    createIfNotExists: {
      _id: subscriberIdForEmail(email),
      _type: "newsletterSubscriber",
      email,
      createdAt: new Date().toISOString(),
      source,
      userAgent,
    },
  };

  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${writeToken}`,
    },
    body: JSON.stringify({ mutations: [mutation] }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    return json(res, 502, { ok: false, error: "Sanity write failed", details });
  }

  return json(res, 200, { ok: true });
}
