import type { RemoveOptions } from "../types/index.js";

export interface ParsedArgs {
  paths: string[];
  options: RemoveOptions;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const paths: string[] = [];
  const options: RemoveOptions = {};

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
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
      case "--quiet":
      case "-q":
        options.quiet = true;
        break;
      case "--interactive":
      case "-i":
        options.interactive = true;
        break;
      case "--allow-root":
        options.allowRoot = true;
        break;
      case "--max-depth": {
        const val = argv[++i];
        options.maxDepth = Number(val);
        break;
      }
      case "--include": {
        const val = argv[++i];
        const patterns = val.split(",").map((s) => s.trim()).filter(Boolean);
        (options.include ??= []).push(...patterns);
        break;
      }
      case "--exclude": {
        const val = argv[++i];
        const patterns = val.split(",").map((s) => s.trim()).filter(Boolean);
        (options.exclude ??= []).push(...patterns);
        break;
      }
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
