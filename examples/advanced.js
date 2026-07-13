import { removeItem } from "remove-item";

// Mixed cleanup: files + directories in one call
const results = await removeItem(
  ["dist", "coverage", ".cache", "temp.log"],
  { recursive: true, force: true }
);

// Inspect results
for (const result of results) {
  if (result.success) {
    console.log(`✓ Removed: ${result.path}`);
  } else {
    console.error(`✗ Failed: ${result.path} — ${result.error?.message}`);
  }
}

// Safe cleanup workflow: dry-run => confirm => delete
async function safeCleanup(paths) {
  console.log("Previewing deletion...");
  await removeItem(paths, { dryRun: true, recursive: true, verbose: true });

  console.log("Performing actual deletion...");
  const outcomes = await removeItem(paths, { recursive: true, force: true });

  const failed = outcomes.filter((r) => !r.success);
  if (failed.length > 0) {
    console.error(`${failed.length} item(s) could not be removed.`);
    process.exit(1);
  }
  console.log("Cleanup complete.");
}

await safeCleanup(["build", ".temp"]);

// Conditional cleanup based on file metadata
import { stat, readdir } from "node:fs/promises";
import { join } from "node:path";

async function cleanOldLogs(dir, maxDays = 7) {
  const now = Date.now();
  const cutoff = maxDays * 24 * 60 * 60 * 1000;
  const entries = await readdir(dir);

  const old = [];
  for (const entry of entries) {
    if (!entry.endsWith(".log")) continue;
    const p = join(dir, entry);
    const s = await stat(p);
    if (now - s.mtimeMs > cutoff) old.push(p);
  }

  if (old.length > 0) {
    console.log(`Removing ${old.length} old log(s)...`);
    await removeItem(old, { force: true });
  }
}

await cleanOldLogs("./logs");
