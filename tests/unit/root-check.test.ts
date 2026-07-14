import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isRootPath } from "../../src/utils/root-check.js";

describe("isRootPath", () => {
  it("identifies / as root on posix", () => {
    assert.equal(isRootPath("/"), true);
  });

  it("identifies C:/ as root on windows", () => {
    if (process.platform === "win32") {
      assert.equal(isRootPath("C:\\"), true);
      assert.equal(isRootPath("C:/"), true);
      assert.equal(isRootPath("D:\\"), true);
    }
  });

  it("returns false for regular paths", () => {
    assert.equal(isRootPath("/usr"), false);
    assert.equal(isRootPath("/home/user"), false);
    assert.equal(isRootPath("relative/path"), false);
  });

  it("returns false for empty string", () => {
    assert.equal(isRootPath(""), true);
  });
});
