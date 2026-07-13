# CLI Reference

## Usage

```
remove-item <path...> [options]
```

One or more file or directory paths can be specified.


## Options

| Flag              | Description                              |
|-------------------|------------------------------------------|
| `-r, --recursive` | Remove directories and their contents    |
| `-f, --force`     | Ignore missing files and continue on err |
| `-v, --verbose`   | Print detailed operation logs            |
| `--dry-run`       | Show what would be deleted without doing |
| `-h, --help`      | Display help text and exit               |


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

### Display help

```bash
remove-item --help
```
