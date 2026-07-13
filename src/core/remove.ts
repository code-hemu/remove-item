import { stat } from "node:fs/promises";
import { removeFile } from "./file.js";
import { removeDirectory } from "./directory.js";
import { resolvePath } from "../utils/path.js";
import { DEFAULT_OPTIONS } from "../constants.js";
import { verbose } from "../utils/logger.js";
import type { RemoveOptions, RemoveResult } from "../types/index.js";

function mergeOptions(options?: RemoveOptions): Required<RemoveOptions> {
  return {
    recursive: options?.recursive ?? DEFAULT_OPTIONS.recursive,
    force: options?.force ?? DEFAULT_OPTIONS.force,
    verbose: options?.verbose ?? DEFAULT_OPTIONS.verbose,
    dryRun: options?.dryRun ?? DEFAULT_OPTIONS.dryRun,
  };
}

export async function removeItem(
  input: string | string[],
  options?: RemoveOptions
): Promise<RemoveResult[]> {
  const opts = mergeOptions(options);
  const paths = Array.isArray(input) ? input : [input];
  const results: RemoveResult[] = [];

  for (const p of paths) {
    const resolved = resolvePath(p);

    if (opts.dryRun) {
      verbose(`[dry-run] Would remove: ${resolved}`, opts.verbose);
      results.push({ path: resolved, success: true });
      continue;
    }

    try {
      const stats = await stat(resolved);
      if (stats.isDirectory()) {
        if (!opts.recursive) {
          verbose(`Skipping directory (use --recursive): ${resolved}`, opts.verbose);
          results.push({
            path: resolved,
            success: false,
            error: new Error(`Cannot remove directory without --recursive flag`),
          });
          continue;
        }
        const result = await removeDirectory(resolved, opts);
        results.push(result);
      } else {
        const result = await removeFile(resolved, opts);
        results.push(result);
      }
    } catch (err: unknown) {
      if (opts.force && (err as NodeJS.ErrnoException)?.code === "ENOENT") {
        verbose(`Path not found, skipping: ${resolved}`, opts.verbose);
        results.push({ path: resolved, success: true });
      } else {
        results.push({
          path: resolved,
          success: false,
          error: err as Error,
        });
      }
    }
  }

  return results;
}
