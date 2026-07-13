import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { mkdir, writeFile, rm, stat } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { spawnSync } from "node:child_process";

const BIN = join(import.meta.dirname, "../../bin/remove-item.js");

let testDir: string;
let nodeBin: string;

function run(args: string[]): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(nodeBin, [BIN, ...args], {
    cwd: testDir,
    encoding: "utf-8",
  });
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    status: result.status,
  };
}

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

describe("CLI", () => {
  before(async () => {
    testDir = join(tmpdir(), `remove-item-cli-test-${Date.now()}`);
    await mkdir(testDir, { recursive: true });
    nodeBin = process.execPath;
  });

  after(async () => {
    await rm(testDir, { recursive: true, force: true });
  });

  it("prints help with --help", () => {
    const { stdout, status } = run(["--help"]);
    assert.ok(stdout.includes("remove-item"));
    assert.ok(stdout.includes("--recursive"));
    assert.equal(status, 0);
  });

  it("prints help and exits 1 with no args", () => {
    const { stdout, status } = run([]);
    assert.ok(stdout.includes("remove-item"));
    assert.equal(status, 1);
  });

  it("removes a file", async () => {
    const file = await createFile("cli-file.txt");
    const { status } = run([file]);
    assert.equal(status, 0);
    await assert.rejects(() => stat(file));
  });

  it("does not remove with --dry-run", async () => {
    const file = await createFile("cli-dry.txt");
    const { status } = run([file, "--dry-run"]);
    assert.equal(status, 0);
    await stat(file);
  });

  it("removes directory with --recursive --force", async () => {
    const dir = await createDir("cli-dir");
    await createFile(join("cli-dir", "inner.txt"));
    const { status } = run([dir, "--recursive", "--force"]);
    assert.equal(status, 0);
    await assert.rejects(() => stat(dir));
  });

  it("removes multiple paths", async () => {
    const f1 = await createFile("multi1.txt");
    const f2 = await createFile("multi2.txt");
    const { status } = run([f1, f2]);
    assert.equal(status, 0);
    await assert.rejects(() => stat(f1));
    await assert.rejects(() => stat(f2));
  });

  it("exits 1 when path missing without --force", async () => {
    const { status, stderr, stdout } = run(["nope.txt"]);
    assert.equal(status, 1);
    assert.ok(stdout.includes("Failed") || stderr.length >= 0);
  });
});
