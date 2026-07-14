import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  checkReadAccess,
  checkWriteAccess,
  canRemove,
} from "../../src/core/permissions.js";
import { PermissionError } from "../../src/utils/errors.js";

let testDir: string;

before(async () => {
  testDir = join(tmpdir(), `remove-item-perm-test-${Date.now()}`);
  await mkdir(testDir, { recursive: true });
});

after(async () => {
  await rm(testDir, { recursive: true, force: true });
});

describe("permissions", () => {
  it("checkReadAccess resolves for existing file", async () => {
    const file = join(testDir, "readable.txt");
    await writeFile(file, "data");
    await assert.doesNotReject(() => checkReadAccess(file));
  });

  it("checkReadAccess rejects for missing file", async () => {
    const missing = join(testDir, "nope.txt");
    await assert.rejects(() => checkReadAccess(missing), PermissionError);
  });

  it("checkWriteAccess resolves for existing file", async () => {
    const file = join(testDir, "writable.txt");
    await writeFile(file, "data");
    await assert.doesNotReject(() => checkWriteAccess(file));
  });

  it("checkWriteAccess rejects for missing file", async () => {
    const missing = join(testDir, "missing.txt");
    await assert.rejects(() => checkWriteAccess(missing), PermissionError);
  });

  it("canRemove returns true for writable file", async () => {
    const file = join(testDir, "removable.txt");
    await writeFile(file, "data");
    const ok = await canRemove(file);
    assert.equal(ok, true);
  });

  it("canRemove returns false for missing file", async () => {
    const missing = join(testDir, "absent.txt");
    const ok = await canRemove(missing);
    assert.equal(ok, false);
  });
});
