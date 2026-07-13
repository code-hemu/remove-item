# CLI Reference

## Usage

```
remove-item <path...> [options]
```

One or more file or directory paths can be specified.


## Options

| Flag                 | Description                              |
|----------------------|------------------------------------------|
| `-r, --recursive`    | Remove directories and their contents    |
| `-f, --force`        | Ignore missing files and continue on err |
| `-v, --verbose`      | Print detailed operation logs            |
| `-q, --quiet`        | Suppress all non-error output            |
| `-i, --interactive`  | Prompt before each removal               |
| `--dry-run`          | Show what would be deleted without doing |
| `--include <pattern>`| Only remove paths matching pattern (repeatable, comma-separated) |
| `--exclude <pattern>`| Skip paths matching pattern (repeatable, comma-separated) |
| `--max-depth <n>`    | Limit recursion depth                    |
| `--allow-root`       | Allow removing root directory (`/` or `C:\`) |
| `-h, --help`         | Display help text and exit               |


## Exit Codes

| Code | Meaning                            |
|------|------------------------------------|
| `0`  | All paths removed successfully     |
| `1`  | One or more paths failed, or no args given |


## Examples

### Remove a single file

```bash
remove-item file.txt
```

### Remove multiple files

```bash
remove-item file1.txt file2.txt file3.txt
```

### Remove a directory

```bash
remove-item dist --recursive
```

### Force remove a directory

```bash
remove-item node_modules --recursive --force
```

### Preview deletion

```bash
remove-item dist --dry-run
```

### Preview with verbose logging

```bash
remove-item temp --dry-run --verbose
```

### Clean multiple targets

```bash
remove-item dist coverage .cache --recursive --force
```

### Remove with glob patterns

```bash
remove-item "*.tmp" --force
```

### Remove only matching files

```bash
remove-item src --recursive --include "*.ts"
remove-item build --recursive --include "*.js,*.css"
```

### Exclude files

```bash
remove-item . --recursive --exclude "node_modules"
remove-item dist --recursive --exclude "*.map"
```

### Quiet mode

```bash
remove-item cache --recursive --force --quiet
```

### Interactive mode

```bash
remove-item dist --recursive --interactive
```

### Limit recursion depth

```bash
remove-item node_modules --recursive --max-depth 2
```

### Override root protection

```bash
remove-item / --recursive --force --allow-root
```

### Display help

```bash
remove-item --help
```
