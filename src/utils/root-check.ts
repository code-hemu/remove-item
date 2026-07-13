import { parse } from "node:path";

export function isRootPath(resolved: string): boolean {
  const parsed = parse(resolved);
  return parsed.root === parsed.dir && parsed.base === "";
}
