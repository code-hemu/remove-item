import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { removeFile } from "../../src/core/file.js";
import { PathNotFoundError } from "../../src/utils/errors.js";

let testDir: string;

async function createFile(name: string): Promise<string> {
  const p = join(testDir, name);
  await writeFile(p, "test");
  return p;
}

describe("removeFile", () => {
  before(async () => {
    testDir = join(tmpdir(), `remove-item-file-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  after(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("removes an existing file", async () => {
    const file = await createFile("file1.txt");
    const result = await removeFile(file, {});
    assert.equal(result.success, true);
    await assert.rejects(() => stat(file));
  });

  it("throws PathNotFoundError for missing file", async () => {
    const missing = join(testDir, "nope.txt");
    await assert.rejects(
      () => removeFile(missing, {}),
      PathNotFoundError
    );
  });

  it("returns success for missing file with force:true", async () => {
    const missing = join(testDir, "forced.txt");
    const result = await removeFile(missing, { force: true });
    assert.equal(result.success, true);
  });

  it("does not remove with dryRun:true", async () => {
    const file = await createFile("dryrun.txt");
    const result = await removeFile(file, { dryRun: true });
    assert.equal(result.success, true);
    await stat(file);
  });

  it("returns error when path is a directory", async () => {
    const dir = join(testDir, "not-a-file");
    await mkdir(dir);
    const result = await removeFile(dir, {});
    assert.equal(result.success, false);
    assert.ok(result.error?.message.includes("Not a file"));
  });
});
