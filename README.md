The [PowerShell command](<https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.management/remove-item>) `Remove-Item` for Node.js in a cross-platform implementation.

![npm version](https://img.shields.io/npm/v/remove-item)
![license](https://img.shields.io/npm/l/remove-item)
![node](https://img.shields.io/node/v/remove-item)

> [!CAUTION]
>
> ## ⚠️ `remove-item` permanently deletes files and directories.
>
> Always double-check your target paths before running removal commands.
> Prefer relative paths scoped to your project directory, and avoid passing user-supplied strings directly without validation.
> 
> For safer workflows, use `dryRun` first to preview what will be deleted:
>
> ```javascript
> await removeItem("./generated", {
>   dryRun: true
> });
> ```
> If you discover a security vulnerability in `remove-item`, please report it privately by emailing the maintainer directly.
> Do not open a public GitHub issue for security-related bugs, as this may expose users before a fix is available.

Install `remove-item` using your preferred package manager.
```bash
npm install remove-item
```

## CLI Usage

The `remove-item` CLI lets you delete files and directories directly from your terminal, with consistent behavior across all platforms. No shell-specific syntax required.

> See [`docs/cli.md`](docs/cli.md) for the full CLI reference, all flags, and exit code documentation.

### Remove a single file

Deletes a specific file by path.

```bash
remove-item file.txt
```

### Remove a directory

Deletes an empty directory. Use `--recursive` for non-empty directories.

```bash
remove-item dist
```

### Remove recursively

Deletes a directory and all of its contents - subdirectories and files included.

```bash
remove-item node_modules --recursive
```

### Force removal

Suppresses errors for missing files and non-empty directories. Useful in CI and cleanup scripts where the target may or may not exist.

```bash
remove-item cache --recursive --force
```

### Remove multiple targets

Pass multiple paths in a single command. All targets are resolved and removed in sequence.

```bash
remove-item dist coverage .cache --recursive --force
```
## Node.js API

Use `remove-item` programmatically in your Node.js scripts and build tools. The API is promise-based and fully async.

> See [`docs/api.md`](docs/api.md) for the complete API reference, including return types, option schemas, and extended examples.

### ESM Import

```javascript
import { removeItem } from "remove-item";

await removeItem("dist");
```

### Remove Multiple Paths

Pass an array of paths to remove several targets in a single call.

```javascript
import { removeItem } from "remove-item";

await removeItem([
  "dist",
  "coverage",
  ".cache"
]);
```

## Options

Customize removal behavior by passing an options object as the second argument.

```javascript
await removeItem("build", {
  recursive: true,
  force: true
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `recursive` | `boolean` | `false` | Removes directories and all of their contents recursively |
| `force` | `boolean` | `false` | Ignores errors for missing files or already-deleted targets |
| `verbose` | `boolean` | `false` | Prints operation logs to stdout for each path processed |
| `dryRun` | `boolean` | `false` | Simulates the operation without making any changes — useful for previewing what would be deleted |


## CLI Examples

Common real-world usage patterns for CI pipelines, build scripts, and local development workflows.

### Clean build output

```bash
remove-item dist --recursive
```

### Remove installed dependencies

```bash
remove-item node_modules --recursive --force
```

### Full project cleanup in one command

```bash
remove-item \
  dist \
  coverage \
  .cache \
  --recursive \
  --force
```

## TypeScript

`remove-item` is written in TypeScript and ships with type declarations included. No `@types` package needed — just import and use.

```typescript
import { removeItem } from "remove-item";

await removeItem("temporary-folder");
```

The options object is fully typed, giving you autocomplete and compile-time validation in editors like VS Code and WebStorm.

```typescript
import { removeItem, RemoveItemOptions } from "remove-item";

const options: RemoveItemOptions = {
  recursive: true,
  force: true,
  dryRun: false,
  verbose: true
};

await removeItem("./output", options);
```

## Error Handling

`remove-item` throws on failure by default. Wrap calls in a `try/catch` block to handle errors gracefully in production scripts.

```javascript
try {
  await removeItem("temp");
  console.log("Removed successfully");
} catch (error) {
  console.error("Removal failed:", error.message);
}
```

To suppress errors for missing or already-deleted paths, use the `force` option instead of catching manually:

```javascript
await removeItem("temp", { force: true });
```


## Examples

Ready-to-run example scripts are included in the `examples/` directory. Clone the repo and run them directly with Node.js.

| File | Description |
|------|-------------|
| [`examples/basic.js`](examples/basic.js) | Covers single file removal, multiple files, recursive deletion, force mode, dry-run preview, and error handling |
| [`examples/advanced.js`](examples/advanced.js) | Demonstrates mixed cleanup strategies, result inspection, dry-run confirmation workflows, and conditional deletion based on file age |


## Comparison

How `remove-item` compares to the most popular alternative:

| Feature | remove-item | rimraf |
|---------|-------------|--------|
| Cross-platform | ✅ | ✅ |
| Node.js API | ✅ | ✅ |
| CLI | ✅ | ✅ |
| TypeScript | ✅ | ✅ |
| ESM support | ✅ | ✅ |
| Uses modern `fs.rm` API | ✅ | Depends on version |
| PowerShell-style naming | ✅ | ❌ |

`remove-item` is built on Node.js's native `fs.rm` API (introduced in Node 14.14), which is the current recommended approach for file removal. No custom recursive logic or shell delegation involved.

## License

`remove-item` is released under the **MIT License**.

Copyright © [Hemanta Gayen](https://github.com/hemanta-gayen). See [`LICENSE`](LICENSE) for the full license text.


## Acknowledgements

`remove-item` draws inspiration from:

- **PowerShell `Remove-Item`** - the naming convention and flag structure that makes deletion intuitive on Windows
- **Unix `rm -rf`** - the gold standard for fast, recursive removal on Unix-like systems
- **Node.js `fs.rm` / `fs.rmdir`** - the underlying platform APIs that make cross-platform consistency possible

