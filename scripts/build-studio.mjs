import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const rootDir = path.resolve(process.cwd());
const sanityDir = path.join(rootDir, "sanity");
const sanityNodeModules = path.join(sanityDir, "node_modules");
const sanityDist = path.join(sanityDir, "dist");
const outDir = path.join(rootDir, "dist", "studio");
const staticOutDir = path.join(rootDir, "dist", "static");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", ...options });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else if (entry.isSymbolicLink()) {
      const link = fs.readlinkSync(srcPath);
      fs.symlinkSync(link, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const env = {
  ...process.env,
  XDG_CONFIG_HOME: path.join(sanityDir, ".config"),
};

if (!fs.existsSync(sanityNodeModules)) {
  run("npm", ["ci", "--prefix", "sanity"], { env });
}

run("npm", ["--prefix", "sanity", "run", "build"], { env });

fs.rmSync(outDir, { recursive: true, force: true });
fs.rmSync(staticOutDir, { recursive: true, force: true });
if (!fs.existsSync(sanityDist)) {
  console.error("Expected Sanity build output at sanity/dist, but it was not found.");
  process.exit(1);
}
copyDir(sanityDist, outDir);

const sanityStaticDir = path.join(sanityDist, "static");
if (fs.existsSync(sanityStaticDir)) {
  copyDir(sanityStaticDir, staticOutDir);
}
