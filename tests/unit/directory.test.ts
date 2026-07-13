import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { removeDirectory } from "../../src/core/directory.js";
import { PathNotFoundError } from "../../src/utils/errors.js";

let testDir: string;

async function createDir(name: string): Promise<string> {
  const p = join(testDir, name);
  await mkdir(p, { recursive: true });
  return p;
}

async function createFileIn(dir: string, name: string): Promise<string> {
  const p = join(dir, name);
  await writeFile(p, "content");
  return p;
}

describe("removeDirectory", () => {
  before(async () => {
    testDir = join(tmpdir(), `remove-item-dir-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  after(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("removes an empty directory with recursive:true", async () => {
    const dir = await createDir("empty");
    const result = await removeDirectory(dir, { recursive: true });
    assert.equal(result.success, true);
    await assert.rejects(() => stat(dir));
  });

  it("removes a non-empty directory with recursive:true", async () => {
    const dir = await createDir("nested");
    await createFileIn(dir, "inner.txt");
    await createFileIn(dir, "inner2.txt");
    const result = await removeDirectory(dir, { recursive: true });
    assert.equal(result.success, true);
    await assert.rejects(() => stat(dir));
  });

  it("fails removing directory without recursive", async () => {
    const dir = await createDir("nonrecursive");
    const result = await removeDirectory(dir, {});
    assert.equal(result.success, false);
  });

  it("throws PathNotFoundError for missing directory", async () => {
    const missing = join(testDir, "ghost");
    await assert.rejects(
      () => removeDirectory(missing, { recursive: true }),
      PathNotFoundError
    );
  });

  it("returns success for missing dir with force:true", async () => {
    const missing = join(testDir, "forced-missing");
    const result = await removeDirectory(missing, { force: true });
    assert.equal(result.success, true);
  });

  it("does not remove with dryRun:true", async () => {
    const dir = await createDir("dryrun-dir");
    await createFileIn(dir, "keep.txt");
    const result = await removeDirectory(dir, { dryRun: true, recursive: true });
    assert.equal(result.success, true);
    await stat(dir);
    await stat(join(dir, "keep.txt"));
  });

  it("returns error when path is a file", async () => {
    const file = join(testDir, "file-not-dir.txt");
    await writeFile(file, "hello");
    const result = await removeDirectory(file, { recursive: true });
    assert.equal(result.success, false);
    assert.ok(result.error?.message.includes("Not a directory"));
  });
});
