import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";

import { schemaTypes } from "./schemaTypes";
import { structure } from "./deskStructure";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "Missing Sanity env vars: set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET (or SANITY_PROJECT_ID/SANITY_DATASET).",
  );
}

export default defineConfig({
  name: "default",
  title: "Roxy Macedo",
  projectId,
  dataset,
  plugins: [deskTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
