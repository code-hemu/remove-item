import type { RemoveOptions } from "../types/index.js";

export interface ParsedArgs {
  paths: string[];
  options: RemoveOptions;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const paths: string[] = [];
  const options: RemoveOptions = {};

  for (const arg of argv) {
    switch (arg) {
      case "--recursive":
      case "-r":
        options.recursive = true;
        break;
      case "--force":
      case "-f":
        options.force = true;
        break;
      case "--verbose":
      case "-v":
        options.verbose = true;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      default:
        if (arg.startsWith("-")) {
          // unknown flag, ignore
        } else {
          paths.push(arg);
        }
    }
  }

  return { paths, options };
}
