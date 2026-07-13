export const DEFAULT_OPTIONS = {
  recursive: false,
  force: false,
  verbose: false,
  dryRun: false,
  quiet: false,
  interactive: false,
  allowRoot: false,
} as const;

export const ERRORS = {
  NOT_FOUND: (path: string) => `Path not found: ${path}`,
  NOT_FILE: (path: string) => `Not a file: ${path}`,
  NOT_DIRECTORY: (path: string) => `Not a directory: ${path}`,
  PERMISSION_DENIED: (path: string) => `Permission denied: ${path}`,
  REMOVE_FAILED: (path: string) => `Failed to remove: ${path}`,
  ROOT_REFUSAL: (path: string) =>
    `Refusing to remove root directory: ${path}. Use --allow-root to override.`,
} as const;
