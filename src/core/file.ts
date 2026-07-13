import { unlink, stat } from "node:fs/promises";
import { resolvePath } from "../utils/path.js";
import { PathNotFoundError } from "../utils/errors.js";
import { verbose } from "../utils/logger.js";
import type { RemoveOptions, RemoveResult } from "../types/index.js";

export async function removeFile(
  filePath: string,
  options: RemoveOptions
): Promise<RemoveResult> {
  const resolved = resolvePath(filePath);

  try {
    const stats = await stat(resolved);
    if (!stats.isFile()) {
      return {
        path: resolved,
        success: false,
        error: new Error(`Not a file: ${resolved}`),
      };
    }
  } catch (err: unknown) {
    if (options.force && (err as NodeJS.ErrnoException)?.code === "ENOENT") {
      verbose(`File not found, skipping: ${resolved}`, !!options.verbose);
      return { path: resolved, success: true };
    }
    throw new PathNotFoundError(resolved);
  }

  if (options.dryRun) {
    verbose(`[dry-run] Would remove file: ${resolved}`, !!options.verbose);
    return { path: resolved, success: true };
  }

  try {
    await unlink(resolved);

    verbose(`Removed file: ${resolved}`, !!options.verbose);
    return { path: resolved, success: true };
  } catch (err: unknown) {
    if (options.force) {
      verbose(`Failed to remove (force on): ${resolved}`, !!options.verbose);
      return {
        path: resolved,
        success: false,
        error: err as Error,
      };
    }
    throw err;
  }
}
