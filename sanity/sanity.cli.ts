import { defineCliConfig } from "sanity/cli";
import fs from "node:fs";
import path from "node:path";

function loadDotEnv(envPath: string) {
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

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity env vars: set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET (or SANITY_PROJECT_ID/SANITY_DATASET).",
  );
}

export default defineCliConfig({
  api: { projectId, dataset },
});
