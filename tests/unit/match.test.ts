import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { hasGlob, matchesGlob } from "../../src/utils/match.js";

describe("matchesGlob", () => {
  it("matches * to any name", () => {
    assert.equal(matchesGlob("file.txt", "*"), true);
    assert.equal(matchesGlob("", "*"), true);
  });

  it("matches *.ext correctly", () => {
    assert.equal(matchesGlob("file.js", "*.js"), true);
    assert.equal(matchesGlob("file.ts", "*.js"), false);
    assert.equal(matchesGlob("file.jsx", "*.js"), false);
  });

  it("matches ? as single character", () => {
    assert.equal(matchesGlob("a.txt", "?.txt"), true);
    assert.equal(matchesGlob("ab.txt", "?.txt"), false);
  });

  it("treats dots as literal", () => {
    assert.equal(matchesGlob("file.txt", "file.txt"), true);
    assert.equal(matchesGlob("fileXtxt", "file.txt"), false);
  });

  it("matches prefix and suffix patterns", () => {
    assert.equal(matchesGlob("test.min.js", "*min*"), true);
    assert.equal(matchesGlob("test.dev.js", "*min*"), false);
  });

  it("matches patterns with multiple *", () => {
    assert.equal(matchesGlob("a-b-c.txt", "a-*-c.*"), true);
    assert.equal(matchesGlob("a-x-c.txt", "a-*-c.*"), true);
    assert.equal(matchesGlob("a-b-c.md", "a-*-c.*"), true);
    assert.equal(matchesGlob("a-b-c", "a-*-c.*"), false);
  });

  it("does not cross path separators", () => {
    assert.equal(matchesGlob("a/b.txt", "*.txt"), false);
    assert.equal(matchesGlob("a/b.txt", "a/*"), true);
  });
});

describe("hasGlob", () => {
  it("returns true for patterns with *", () => {
    assert.equal(hasGlob("*.txt"), true);
  });

  it("returns true for patterns with ?", () => {
    assert.equal(hasGlob("?.txt"), true);
  });

  it("returns true for patterns with [ ]", () => {
    assert.equal(hasGlob("[abc].txt"), true);
  });

  it("returns true for patterns with { }", () => {
    assert.equal(hasGlob("{a,b}.txt"), true);
  });

  it("returns false for plain paths", () => {
    assert.equal(hasGlob("file.txt"), false);
    assert.equal(hasGlob("path/to/file.txt"), false);
  });
});
