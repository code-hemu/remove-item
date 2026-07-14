import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isAbsolute, resolve } from "node:path";
import { resolvePath, normalizePath } from "../../src/utils/path.js";

describe("resolvePath", () => {
  it("returns absolute path unchanged", () => {
    if (process.platform === "win32") {
      assert.equal(resolvePath("C:\\foo"), "C:\\foo");
      assert.equal(resolvePath("C:/foo"), "C:/foo");
    } else {
      assert.equal(resolvePath("/foo"), "/foo");
    }
  });

  it("resolves relative path to absolute", () => {
    const result = resolvePath("some/relative");
    assert.ok(isAbsolute(result));
    assert.ok(result.endsWith("some\\relative") || result.endsWith("some/relative"));
  });

  it("resolves dot to cwd", () => {
    const result = resolvePath(".");
    assert.equal(result, resolve("."));
  });
});

describe("normalizePath", () => {
  it("replaces backslashes with forward slashes", () => {
    const result = normalizePath("a\\b\\c");
    assert.equal(result, resolve("a\\b\\c").replace(/\\/g, "/"));
    assert.ok(!result.includes("\\"));
  });

  it("preserves forward slashes", () => {
    const result = normalizePath("a/b/c");
    assert.equal(result, resolve("a/b/c").replace(/\\/g, "/"));
  });
});
