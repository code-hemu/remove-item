import { resolve, isAbsolute } from "node:path";

export function resolvePath(input: string): string {
  if (isAbsolute(input)) {
    return input;
  }
  return resolve(input);
}

export function normalizePath(input: string): string {
  return resolvePath(input).replace(/\\/g, "/");
}
