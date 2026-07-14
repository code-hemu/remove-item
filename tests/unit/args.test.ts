import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseArgs } from "../../src/cli/args.js";

describe("parseArgs", () => {
  it("parses paths", () => {
    const { paths, options } = parseArgs(["file.txt", "dir"]);
    assert.deepEqual(paths, ["file.txt", "dir"]);
    assert.deepEqual(options, {});
  });

  it("parses --recursive / -r", () => {
    assert.equal(parseArgs(["-r"]).options.recursive, true);
    assert.equal(parseArgs(["--recursive"]).options.recursive, true);
  });

  it("parses --force / -f", () => {
    assert.equal(parseArgs(["-f"]).options.force, true);
    assert.equal(parseArgs(["--force"]).options.force, true);
  });

  it("parses --verbose / -v", () => {
    assert.equal(parseArgs(["-v"]).options.verbose, true);
    assert.equal(parseArgs(["--verbose"]).options.verbose, true);
  });

  it("parses --dry-run", () => {
    assert.equal(parseArgs(["--dry-run"]).options.dryRun, true);
  });

  it("parses --quiet / -q", () => {
    assert.equal(parseArgs(["-q"]).options.quiet, true);
    assert.equal(parseArgs(["--quiet"]).options.quiet, true);
  });

  it("parses --interactive / -i", () => {
    assert.equal(parseArgs(["-i"]).options.interactive, true);
    assert.equal(parseArgs(["--interactive"]).options.interactive, true);
  });

  it("parses --allow-root", () => {
    assert.equal(parseArgs(["--allow-root"]).options.allowRoot, true);
  });

  it("parses --max-depth", () => {
    const { options } = parseArgs(["--max-depth", "3"]);
    assert.equal(options.maxDepth, 3);
  });

  it("parses --include with comma-separated patterns", () => {
    const { options } = parseArgs(["--include", "*.ts,*.js"]);
    assert.deepEqual(options.include, ["*.ts", "*.js"]);
  });

  it("parses --exclude with comma-separated patterns", () => {
    const { options } = parseArgs(["--exclude", "*.json,*.md"]);
    assert.deepEqual(options.exclude, ["*.json", "*.md"]);
  });

  it("parses multiple --include flags", () => {
    const { options } = parseArgs(["--include", "*.ts", "--include", "*.js"]);
    assert.deepEqual(options.include, ["*.ts", "*.js"]);
  });

  it("ignores unknown flags", () => {
    const { paths, options } = parseArgs(["--unknown", "file.txt"]);
    assert.deepEqual(paths, ["file.txt"]);
    assert.deepEqual(options, {});
  });

  it("parses mixed paths and options", () => {
    const { paths, options } = parseArgs([
      "dist",
      "--recursive",
      "--force",
      "coverage",
    ]);
    assert.deepEqual(paths, ["dist", "coverage"]);
    assert.equal(options.recursive, true);
    assert.equal(options.force, true);
  });

  it("handles empty argv", () => {
    const { paths, options } = parseArgs([]);
    assert.deepEqual(paths, []);
    assert.deepEqual(options, {});
  });
});
