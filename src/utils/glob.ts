import { readdir } from "node:fs/promises";
import { resolve, sep } from "node:path";
export { hasGlob } from "./match.js";
import { hasGlob, matchesGlob } from "./match.js";

function splitGlob(pattern: string): [baseDir: string, globPart: string] {
  const normalized = pattern.replace(/[\\/]+/g, sep);
  const segments = normalized.split(sep);
  let splitIndex = segments.findIndex((s) => hasGlob(s));
  if (splitIndex === -1) splitIndex = segments.length - 1;
  if (splitIndex === 0) {
    return [".", normalized];
  }
  return [segments.slice(0, splitIndex).join(sep), segments.slice(splitIndex).join(sep)];
}

export async function expandGlob(pattern: string): Promise<string[]> {
  const [baseDir, globPart] = splitGlob(pattern);
  const resolvedBase = resolve(baseDir);
  let entries: string[];
  try {
    entries = await readdir(resolvedBase);
  } catch {
    return [];
  }
  const matched = entries.filter((e) => matchesGlob(e, globPart));
  return matched.map((e) => resolve(resolvedBase, e));
}
