import { rm, stat } from "node:fs/promises";
import { resolvePath } from "../utils/path.js";
import { PathNotFoundError } from "../utils/errors.js";
import { verbose } from "../utils/logger.js";
import type { RemoveOptions, RemoveResult } from "../types/index.js";

export async function removeDirectory(
  dirPath: string,
  options: RemoveOptions
): Promise<RemoveResult> {
  const resolved = resolvePath(dirPath);

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
      verbose(`Directory not found, skipping: ${resolved}`, !!options.verbose);
      return { path: resolved, success: true };
    }
    throw new PathNotFoundError(resolved);
  }

  if (options.dryRun) {
    verbose(`[dry-run] Would remove directory: ${resolved}`, !!options.verbose);
    return { path: resolved, success: true };
  }

  try {
    await rm(resolved, { recursive: !!options.recursive, force: !!options.force });
    verbose(`Removed directory: ${resolved}`, !!options.verbose);
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
      verbose(`Failed to remove directory (force on): ${resolved}`, !!options.verbose);
      return {
        path: resolved,
        success: false,
        error: nodeErr,
      };
    }
    throw err;
  }
}
