export function printHelp(): void {
  console.log(`
remove-item - Remove files and directories

USAGE
  remove-item <path> [options]

ARGUMENTS
  <path>    File or directory path(s) to remove. Supports multiple paths.

OPTIONS
  -r, --recursive    Remove directories recursively
  -f, --force        Ignore missing files and errors
  -v, --verbose      Show operation logs
  --dry-run          Preview deletion without removing

EXAMPLES
  remove-item file.txt
  remove-item dist --recursive
  remove-item node_modules --recursive --force
  remove-item dist coverage .cache --recursive --force
  remove-item temp --dry-run --verbose
`);
}
