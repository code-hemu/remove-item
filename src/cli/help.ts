export function printHelp(): void {
  console.log(`
remove-item - Remove files and directories

USAGE
  remove-item <path> [options]

ARGUMENTS
  <path>    File or directory path(s) to remove. Supports multiple paths.
            Glob patterns are expanded (e.g. "*.log").

OPTIONS
  -r, --recursive       Remove directories recursively
  -f, --force           Ignore missing files and errors
  -v, --verbose         Show operation logs
  -q, --quiet           Suppress all non-error output
  -i, --interactive     Prompt before each removal
  --dry-run             Preview deletion without removing
  --include <pattern>   Only remove paths matching pattern (repeatable, comma-separated)
  --exclude <pattern>   Skip paths matching pattern (repeatable, comma-separated)
  --max-depth <n>       Limit recursion depth
  --allow-root          Allow removing root directory (/ or C:\)

EXAMPLES
  remove-item file.txt
  remove-item dist --recursive
  remove-item node_modules --recursive --force
  remove-item dist coverage .cache --recursive --force
  remove-item temp --dry-run --verbose
  remove-item "*.tmp" --force
  remove-item src --recursive --include "*.ts" --include "*.js"
  remove-item . --recursive --exclude "node_modules"
  remove-item cache --recursive --max-depth 2
`);
}
