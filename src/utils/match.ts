import { matchPath } from "globefish";

const GLOB_CHARS = /[*?[\]{}]/;

export function hasGlob(s: string): boolean {
  return GLOB_CHARS.test(s);
}

export function matchesGlob(name: string, pattern: string): boolean {
  return matchPath(name, pattern);
}
