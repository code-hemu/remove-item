import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { expandGlob, hasGlob } from "../../src/utils/glob.js";

describe("expandGlob", () => {
  it("returns matching absolute paths for existing files", async () => {
    const files = await expandGlob("*.md");
    assert.ok(files.length > 0);
    assert.ok(files.every((f) => f.endsWith(".md")));
  });

  it("returns empty array for non-matching pattern", async () => {
    const files = await expandGlob("__nonexistent_glob_match__*");
    assert.deepEqual(files, []);
  });

  it("supports ** recursive patterns", async () => {
    const files = await expandGlob("src/**/*.ts");
    assert.ok(files.length > 0);
    assert.ok(files.every((f) => f.endsWith(".ts")));
    assert.ok(files.some((f) => f.includes("cli")));
  });
});

describe("hasGlob", () => {
  it("returns true for patterns with *", () => {
    assert.equal(hasGlob("*.txt"), true);
  });

  it("returns true for patterns with ?", () => {
    assert.equal(hasGlob("?.txt"), true);
  });

  it("returns false for plain paths", () => {
    assert.equal(hasGlob("file.txt"), false);
    assert.equal(hasGlob("path/to/file.txt"), false);
  });
});
