import { removeItem } from "../core/remove.js";
import { printHelp } from "./help.js";
import { log, error as logError, setQuiet } from "../utils/logger.js";
import type { ParsedArgs } from "./args.js";

export async function run(args: ParsedArgs): Promise<void> {
  if (args.paths.length === 0) {
    printHelp();
    process.exit(1);
  }

  setQuiet(!!args.options.quiet);

  const results = await removeItem(args.paths, args.options);

  for (const result of results) {
    if (result.success) {
      if (!result.skipped && !args.options.quiet) {
        log(`Removed: ${result.path}`);
      }
    } else {
      logError(`Failed: ${result.path} - ${result.error?.message ?? "Unknown error"}`);
    }
  }

  const failed = results.filter((r) => !r.success);
  if (failed.length > 0) {
    process.exit(1);
  }
}
