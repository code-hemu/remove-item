import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  RemoveItemError,
  PathNotFoundError,
  PermissionError,
} from "../../src/utils/errors.js";

describe("RemoveItemError", () => {
  it("has correct name and code", () => {
    const err = new RemoveItemError("test error", "ETEST");
    assert.equal(err.name, "RemoveItemError");
    assert.equal(err.code, "ETEST");
    assert.equal(err.message, "test error");
    assert.ok(err instanceof Error);
  });
});

describe("PathNotFoundError", () => {
  it("formats message and sets ENOENT code", () => {
    const err = new PathNotFoundError("/some/path");
    assert.equal(err.name, "PathNotFoundError");
    assert.equal(err.code, "ENOENT");
    assert.equal(err.message, "Path not found: /some/path");
    assert.ok(err instanceof RemoveItemError);
    assert.ok(err instanceof Error);
  });
});

describe("PermissionError", () => {
  it("formats message and sets EACCES code", () => {
    const err = new PermissionError("/restricted");
    assert.equal(err.name, "PermissionError");
    assert.equal(err.code, "EACCES");
    assert.equal(err.message, "Permission denied: /restricted");
    assert.ok(err instanceof RemoveItemError);
    assert.ok(err instanceof Error);
  });
});
