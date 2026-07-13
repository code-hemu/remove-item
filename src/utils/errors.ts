export class RemoveItemError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "RemoveItemError";
  }
}

export class PathNotFoundError extends RemoveItemError {
  constructor(path: string) {
    super(`Path not found: ${path}`, "ENOENT");
    this.name = "PathNotFoundError";
  }
}

export class PermissionError extends RemoveItemError {
  constructor(path: string) {
    super(`Permission denied: ${path}`, "EACCES");
    this.name = "PermissionError";
  }
}
