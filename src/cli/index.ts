#!/usr/bin/env node

import { parseArgs } from "./args.js";
import { run } from "./commands.js";

const argv = process.argv.slice(2);

if (argv.includes("--help") || argv.includes("-h")) {
  const { printHelp } = await import("./help.js");
  printHelp();
  process.exit(0);
}

const args = parseArgs(argv);
await run(args);
