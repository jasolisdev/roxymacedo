import fs from "node:fs";
import path from "node:path";

function loadDotEnv(envPath) {
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const normalized = trimmed.startsWith("export ") ? trimmed.slice("export ".length) : trimmed;
    const idx = normalized.indexOf("=");
    if (idx === -1) continue;
    const key = normalized.slice(0, idx).trim();
    let value = normalized.slice(idx + 1).trim();
    if (!key) continue;
    if (process.env[key] !== undefined) continue;
    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

loadDotEnv(path.resolve(process.cwd(), ".env"));
loadDotEnv(path.resolve(process.cwd(), "../.env"));

const projectId = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || "2023-10-01";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset) {
  throw new Error("Missing SANITY_PROJECT_ID/SANITY_DATASET (or SANITY_STUDIO_*).");
}
if (!token) {
  throw new Error("Missing SANITY_WRITE_TOKEN (server-side token with write access).");
}

const baseUrl = `https://${projectId}.api.sanity.io/v${apiVersion}`;

async function sanityFetch(path, { method = "GET", body } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`${method} ${path} failed: ${response.status} ${response.statusText}${details ? ` - ${details}` : ""}`);
  }

  return response.json();
}

async function query(groq, params = {}) {
  const url = new URL(`${baseUrl}/data/query/${dataset}`);
  url.searchParams.set("query", groq);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  }
  const response = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Query failed: ${response.status} ${response.statusText}${details ? ` - ${details}` : ""}`);
  }
  const json = await response.json();
  return json.result;
}

async function mutate(mutations) {
  return sanityFetch(`/data/mutate/${dataset}`, {
    method: "POST",
    body: { mutations },
  });
}

const HOME_PAGE_ID = "homePage";

const defaultHomePage = {
  _id: HOME_PAGE_ID,
  _type: "homePage",
  profileName: "Roxy Macedo",
  profileBio: "Whisking up happiness one batch at a time 🍰 | Home Baker & Recipe Creator",
  links: [
    { _key: "tiktok", title: "TikTok", url: "https://www.tiktok.com/@roxymsolis", category: "social", icon: "tiktok" },
    { _key: "instagram", title: "Instagram", url: "https://www.instagram.com/roxymsolis", category: "social", icon: "instagram" },
    { _key: "shop", title: "Amazon Shop", url: "https://www.amazon.com/", category: "shop", icon: "shop" },
    { _key: "email", title: "Email", url: "mailto:macedo.roxanna@yahoo.com", category: "social", icon: "email" },
  ],
  newsletterTitle: "Join the list 💌",
  newsletterDescription: "Get updates in your inbox.",
  newsletterPlaceholder: "Enter your email address",
  newsletterButtonLabel: "Subscribe",
};

const defaultWelcomePost = {
  _id: "blogPost.welcome",
  _type: "blogPost",
  title: "Welcome",
  slug: { _type: "slug", current: "welcome" },
  publishedAt: new Date().toISOString(),
  excerpt: "A quick hello and what you can expect here.",
  body: [
    {
      _type: "block",
      style: "normal",
      children: [{ _type: "span", text: "Hi! I’m Roxy — welcome to my little home on the internet." }],
      markDefs: [],
    },
    {
      _type: "block",
      style: "normal",
      children: [
        {
          _type: "span",
          text: "I’ll post updates, favorites, and announcements here so everything stays in one place.",
        },
      ],
      markDefs: [],
    },
  ],
};

async function main() {
  const existingHome = await query('*[_type == "homePage" && _id == $id][0]{_id}', { id: HOME_PAGE_ID });
  if (!existingHome?._id) {
    await mutate([{ createIfNotExists: defaultHomePage }]);
    // eslint-disable-next-line no-console
    console.log(`Created Home Page document (_id: ${HOME_PAGE_ID})`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Home Page document already exists (_id: ${HOME_PAGE_ID})`);
  }

  const postCount = await query('count(*[_type == "blogPost" && defined(slug.current)])');
  if (typeof postCount === "number" && postCount === 0) {
    await mutate([{ createIfNotExists: defaultWelcomePost }]);
    // eslint-disable-next-line no-console
    console.log("Created default Welcome blog post");
  } else {
    // eslint-disable-next-line no-console
    console.log("Blog posts already exist; skipping default post seed");
  }
}

await main();
