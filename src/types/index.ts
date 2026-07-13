export interface RemoveOptions {
  recursive?: boolean;
  force?: boolean;
  verbose?: boolean;
  dryRun?: boolean;
}

export interface RemoveResult {
  path: string;
  success: boolean;
  error?: Error;
}
