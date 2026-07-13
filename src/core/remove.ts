import { stat } from "node:fs/promises";
import { removeFile } from "./file.js";
import { removeDirectory } from "./directory.js";
import { resolvePath } from "../utils/path.js";
import { isRootPath } from "../utils/root-check.js";
import { hasGlob, expandGlob } from "../utils/glob.js";
import { DEFAULT_OPTIONS, ERRORS } from "../constants.js";
import { verbose } from "../utils/logger.js";
import type { RemoveOptions, RemoveResult } from "../types/index.js";

function mergeOptions(
  options?: RemoveOptions
): Required<Omit<RemoveOptions, "include" | "exclude" | "maxDepth">> & {
  include?: string[];
  exclude?: string[];
  maxDepth?: number;
} {
  return {
    recursive: options?.recursive ?? DEFAULT_OPTIONS.recursive,
    force: options?.force ?? DEFAULT_OPTIONS.force,
    verbose: options?.verbose ?? DEFAULT_OPTIONS.verbose,
    dryRun: options?.dryRun ?? DEFAULT_OPTIONS.dryRun,
    quiet: options?.quiet ?? DEFAULT_OPTIONS.quiet,
    interactive: options?.interactive ?? DEFAULT_OPTIONS.interactive,
    allowRoot: options?.allowRoot ?? DEFAULT_OPTIONS.allowRoot,
    include: options?.include,
    exclude: options?.exclude,
    maxDepth: options?.maxDepth,
  };
}

function hasGlobPatterns(inputPaths: string[]): boolean {
  return inputPaths.some((p) => hasGlob(p));
}

export async function removeItem(
  input: string | string[],
  options?: RemoveOptions
): Promise<RemoveResult[]> {
  const opts = mergeOptions(options);
  let paths = Array.isArray(input) ? input : [input];
  const results: RemoveResult[] = [];

  if (hasGlobPatterns(paths)) {
    const expanded: string[] = [];
    for (const p of paths) {
      if (hasGlob(p)) {
        const matched = await expandGlob(p);
        if (matched.length === 0) {
          if (!opts.force) {
            results.push({
              path: resolvePath(p),
              success: false,
              error: new Error(`Path not found: ${p}`),
            });
          } else {
            results.push({ path: resolvePath(p), success: true, skipped: true });
          }
          continue;
        }
        expanded.push(...matched);
      } else {
        expanded.push(p);
      }
    }
    paths = expanded;
  }

  for (const p of paths) {
    const resolved = resolvePath(p);

    if (!opts.allowRoot && isRootPath(resolved)) {
      verbose(`Root path blocked: ${resolved}`, opts.verbose, opts.quiet);
      results.push({
        path: resolved,
        success: false,
        error: new Error(ERRORS.ROOT_REFUSAL(resolved)),
      });
      continue;
    }

    if (opts.dryRun) {
      verbose(`[dry-run] Would remove: ${resolved}`, opts.verbose, opts.quiet);
      results.push({ path: resolved, success: true });
      continue;
    }

    try {
      const stats = await stat(resolved);
      if (stats.isDirectory()) {
        if (!opts.recursive) {
          verbose(
            `Skipping directory (use --recursive): ${resolved}`,
            opts.verbose,
            opts.quiet,
          );
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
        verbose(`Path not found, skipping: ${resolved}`, opts.verbose, opts.quiet);
        results.push({ path: resolved, success: true, skipped: true });
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
