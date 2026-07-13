import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { removeItem } from "../../src/core/remove.js";

let testDir: string;

async function createFile(name: string): Promise<string> {
  const p = join(testDir, name);
  await writeFile(p, "test");
  return p;
}

async function createDir(name: string): Promise<string> {
  const p = join(testDir, name);
  await mkdir(p, { recursive: true });
  return p;
}

describe("removeItem options", () => {
  before(async () => {
    testDir = join(tmpdir(), `remove-item-options-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
  });

  after(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("removes file with default options", async () => {
    const file = await createFile("default.txt");
    const [result] = await removeItem(file);
    assert.equal(result.success, true);
    await assert.rejects(() => stat(file));
  });

  it("removes directory with recursive:true", async () => {
    const dir = await createDir("recursive-dir");
    await createFile(join("recursive-dir", "child.txt").replace(/\\/g, "/"));
    const [result] = await removeItem(dir, { recursive: true });
    assert.equal(result.success, true);
    await assert.rejects(() => stat(dir));
  });

  it("fails removing directory without recursive", async () => {
    const dir = await createDir("no-flag-dir");
    const [result] = await removeItem(dir);
    assert.equal(result.success, false);
    assert.ok(result.error?.message.includes("--recursive"));
  });

  it("force skips missing path", async () => {
    const missing = join(testDir, "gone.txt");
    const [result] = await removeItem(missing, { force: true });
    assert.equal(result.success, true);
  });

  it("dryRun keeps file intact", async () => {
    const file = await createFile("dry.txt");
    const [result] = await removeItem(file, { dryRun: true });
    assert.equal(result.success, true);
    await stat(file);
  });

  it("dryRun keeps directory intact", async () => {
    const dir = await createDir("dry-dir");
    await createFile(join("dry-dir", "a.txt").replace(/\\/g, "/"));
    const [result] = await removeItem(dir, { dryRun: true, recursive: true });
    assert.equal(result.success, true);
    await stat(dir);
  });

  it("returns results for multiple paths", async () => {
    const f1 = await createFile("multi-a.txt");
    const f2 = await createFile("multi-b.txt");
    const results = await removeItem([f1, f2]);
    assert.equal(results.length, 2);
    assert.equal(results[0].success, true);
    assert.equal(results[1].success, true);
    await assert.rejects(() => stat(f1));
    await assert.rejects(() => stat(f2));
  });

  it("verbose does not throw", async () => {
    const file = await createFile("verbose.txt");
    const [result] = await removeItem(file, { verbose: true });
    assert.equal(result.success, true);
  });

  it("allowRoot blocks root path", async () => {
    const root = process.platform === "win32" ? "C:/" : "/";
    const [result] = await removeItem(root, { recursive: true, force: true });
    assert.equal(result.success, false);
    assert.ok(result.error?.message.includes("root directory"));
  });

  it("glob expansion matches and removes files", async () => {
    const orig = process.cwd();
    process.chdir(testDir);
    try {
      await createFile("glob-a.js");
      await createFile("glob-b.ts");
      const results = await removeItem(["glob-*.js"], {});
      assert.equal(results.length, 1);
      assert.equal(results[0].success, true);
      await assert.rejects(() => stat(join(testDir, "glob-a.js")));
      await stat(join(testDir, "glob-b.ts"));
    } finally {
      process.chdir(orig);
    }
  });

  it("non-matching glob returns error without force", async () => {
    const orig = process.cwd();
    process.chdir(testDir);
    try {
      const [result] = await removeItem(["*.nonexistent"], {});
      assert.equal(result.success, false);
    } finally {
      process.chdir(orig);
    }
  });

  it("non-matching glob returns skipped with force", async () => {
    const orig = process.cwd();
    process.chdir(testDir);
    try {
      const [result] = await removeItem(["*.nonexistent"], { force: true });
      assert.equal(result.success, true);
      assert.equal(result.skipped, true);
    } finally {
      process.chdir(orig);
    }
  });

  it("include filter at removeItem level", async () => {
    const dir = await createDir("rm-include");
    await createFile(join("rm-include", "a.js").replace(/\\/g, "/"));
    await createFile(join("rm-include", "b.ts").replace(/\\/g, "/"));
    const [result] = await removeItem(dir, {
      recursive: true,
      include: ["*.js"],
    });
    assert.equal(result.success, true);
    await assert.rejects(() => stat(join(dir, "a.js")));
    await stat(join(dir, "b.ts"));
  });

  it("maxDepth at removeItem level", async () => {
    const dir = await createDir("rm-depth");
    const sub = join(dir, "sub");
    await mkdir(sub);
    await createFile(join("rm-depth", "root.txt").replace(/\\/g, "/"));
    await createFile(join("rm-depth", "sub", "nested.txt").replace(/\\/g, "/"));
    const [result] = await removeItem(dir, {
      recursive: true,
      maxDepth: 1,
    });
    assert.equal(result.success, true);
    await assert.rejects(() => stat(join(dir, "root.txt")));
    await stat(join(dir, "sub"));
    await stat(join(dir, "sub", "nested.txt"));
  });
});
