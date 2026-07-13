export const DEFAULT_OPTIONS = {
  recursive: false,
  force: false,
  verbose: false,
  dryRun: false,
} as const;

export const ERRORS = {
  NOT_FOUND: (path: string) => `Path not found: ${path}`,
  NOT_FILE: (path: string) => `Not a file: ${path}`,
  NOT_DIRECTORY: (path: string) => `Not a directory: ${path}`,
  PERMISSION_DENIED: (path: string) => `Permission denied: ${path}`,
  REMOVE_FAILED: (path: string) => `Failed to remove: ${path}`,
} as const;
