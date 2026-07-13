import { access, constants } from "node:fs/promises";
import { PermissionError } from "../utils/errors.js";

export async function checkReadAccess(path: string): Promise<void> {
  try {
    await access(path, constants.R_OK);
  } catch {
    throw new PermissionError(path);
  }
}

export async function checkWriteAccess(path: string): Promise<void> {
  try {
    await access(path, constants.W_OK);
  } catch {
    throw new PermissionError(path);
  }
}

export async function canRemove(path: string): Promise<boolean> {
  try {
    await access(path, constants.R_OK | constants.W_OK);
    return true;
  } catch {
    return false;
  }
}
