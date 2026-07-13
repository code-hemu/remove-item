export interface RemoveOptions {
  recursive?: boolean;
  force?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
  quiet?: boolean;
  interactive?: boolean;
  allowRoot?: boolean;
  include?: string[];
  exclude?: string[];
  maxDepth?: number;
}

export interface RemoveResult {
  path: string;
  success: boolean;
  error?: Error;
  skipped?: boolean;
}
