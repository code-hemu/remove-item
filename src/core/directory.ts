import { rm, stat, readdir, unlink, rmdir } from "node:fs/promises";
import { join } from "node:path";
import { resolvePath } from "../utils/path.js";
import { PathNotFoundError } from "../utils/errors.js";
import { verbose } from "../utils/logger.js";
import { confirm } from "../utils/prompt.js";
import { matchesGlob } from "../utils/match.js";
import type { RemoveOptions, RemoveResult } from "../types/index.js";

async function removeFiltered(
  dir: string,
  options: RemoveOptions & {
    include?: string[];
    exclude?: string[];
    maxDepth?: number;
  },
  depth: number,
): Promise<void> {
  if (options.maxDepth !== undefined && depth >= options.maxDepth) {
    return;
  }

  let entries: { name: string; isDir: boolean }[];
  try {
    const dirEntries = await readdir(dir, { withFileTypes: true });
    entries = dirEntries.map((e) => ({ name: e.name, isDir: e.isDirectory() }));
  } catch {
    return;
  }

  for (const entry of entries) {
    if (options.exclude?.some((p) => matchesGlob(entry.name, p))) continue;
    if (options.include && !options.include.some((p) => matchesGlob(entry.name, p))) continue;

    const fullPath = join(dir, entry.name);

    if (entry.isDir) {
      const canRecurse =
        options.maxDepth === undefined || depth + 1 < options.maxDepth;
      if (canRecurse) {
        await removeFiltered(fullPath, options, depth + 1);
      }
      if (options.interactive) {
        const ok = await confirm(`Remove directory: ${fullPath}?`);
        if (!ok) continue;
      }
      try {
        await rmdir(fullPath);
      } catch {
        // directory may not be empty if contents were excluded or depth-limited
      }
    } else {
      if (options.interactive) {
        const ok = await confirm(`Remove file: ${fullPath}?`);
        if (!ok) continue;
      }
      await unlink(fullPath);
    }
  }
}

export async function removeDirectory(
  dirPath: string,
  options: RemoveOptions,
  currentDepth: number = 0,
): Promise<RemoveResult> {
  const resolved = resolvePath(dirPath);

  if (options.maxDepth !== undefined && currentDepth > options.maxDepth) {
    verbose(
      `Max depth reached, skipping: ${resolved}`,
      !!options.verbose,
      options.quiet,
    );
    return { path: resolved, success: true, skipped: true };
  }

  try {
    const stats = await stat(resolved);
    if (!stats.isDirectory()) {
      return {
        path: resolved,
        success: false,
        error: new Error(`Not a directory: ${resolved}`),
      };
    }
  } catch (err: unknown) {
    if (options.force && (err as NodeJS.ErrnoException)?.code === "ENOENT") {
      verbose(
        `Directory not found, skipping: ${resolved}`,
        !!options.verbose,
        options.quiet,
      );
      return { path: resolved, success: true, skipped: true };
    }
    throw new PathNotFoundError(resolved);
  }

  if (options.dryRun) {
    verbose(
      `[dry-run] Would remove directory: ${resolved}`,
      !!options.verbose,
      options.quiet,
    );
    return { path: resolved, success: true };
  }

  if (options.interactive) {
    const ok = await confirm(`Remove directory: ${resolved}?`);
    if (!ok) {
      verbose(`Skipped: ${resolved}`, !!options.verbose, options.quiet);
      return { path: resolved, success: true, skipped: true };
    }
  }

  try {
    if (options.include || options.exclude || options.maxDepth !== undefined) {
      const canProcess =
        options.maxDepth === undefined || currentDepth < options.maxDepth;
      if (canProcess) {
        await removeFiltered(resolved, options, currentDepth);
      }
      try {
        await rmdir(resolved);
      } catch {
        // not empty due to excluded or depth-limited files — ok
      }
    } else {
      await rm(resolved, {
        recursive: !!options.recursive,
        force: !!options.force,
      });
    }

    verbose(`Removed directory: ${resolved}`, !!options.verbose, options.quiet);
    return { path: resolved, success: true };
  } catch (err: unknown) {
    const nodeErr = err as NodeJS.ErrnoException;
    if (nodeErr.code === "ERR_FS_EISDIR") {
      return {
        path: resolved,
        success: false,
        error: new Error(`Cannot remove directory without --recursive flag`),
      };
    }
    if (options.force) {
      verbose(
        `Failed to remove directory (force on): ${resolved}`,
        !!options.verbose,
        options.quiet,
      );
      return {
        path: resolved,
        success: false,
        error: nodeErr,
      };
    }
    throw err;
  }
}
