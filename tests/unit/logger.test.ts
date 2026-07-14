import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { log, warn, error, verbose, setQuiet } from "../../src/utils/logger.js";

const PREFIX = "[remove-item]";

let outLogs: string[];
let errLogs: string[];

const origLog = console.log;
const origWarn = console.warn;
const origErr = console.error;

before(() => {
  outLogs = [];
  errLogs = [];
  console.log = (msg: string) => { outLogs.push(msg); };
  console.warn = (msg: string) => { errLogs.push(msg); };
  console.error = (msg: string) => { errLogs.push(msg); };
});

after(() => {
  console.log = origLog;
  console.warn = origWarn;
  console.error = origErr;
  setQuiet(false);
});

describe("logger", () => {
  it("log writes to stdout", () => {
    log("hello");
    assert.equal(outLogs.at(-1), `${PREFIX} hello`);
  });

  it("warn writes to stderr", () => {
    warn("beware");
    assert.equal(errLogs.at(-1), `${PREFIX} beware`);
  });

  it("error writes to stderr", () => {
    error("oops");
    assert.equal(errLogs.at(-1), `${PREFIX} oops`);
  });

  it("verbose writes when isVerbose is true and not quiet", () => {
    verbose("detail", true, false);
    assert.equal(outLogs.at(-1), `${PREFIX} detail`);
  });

  it("verbose does not write when isVerbose is false", () => {
    const before = outLogs.length;
    verbose("hidden", false);
    assert.equal(outLogs.length, before);
  });

  it("verbose does not write when quiet is true", () => {
    const before = outLogs.length;
    verbose("quiet-detail", true, true);
    assert.equal(outLogs.length, before);
  });

  it("setQuiet suppresses log output", () => {
    setQuiet(true);
    const before = outLogs.length;
    log("after-quiet");
    assert.equal(outLogs.length, before);
    setQuiet(false);
  });

  it("setQuiet(false) restores log output", () => {
    setQuiet(true);
    log("still-quiet");
    setQuiet(false);
    log("audible");
    assert.equal(outLogs.at(-1), `${PREFIX} audible`);
  });
});
