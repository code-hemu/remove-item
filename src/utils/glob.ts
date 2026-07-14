import { glob } from "globefish";
export { hasGlob } from "./match.js";

export async function expandGlob(pattern: string): Promise<string[]> {
  try {
    return await glob(pattern, { absolute: true });
  } catch {
    return [];
  }
}
