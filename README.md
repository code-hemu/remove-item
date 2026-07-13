<p align="center">
  <b>A cross-platform file removal utility for Node.js</b>
</p>

<p align="center">
  Remove files and directories with a simple CLI.<br/>
  Inspired by PowerShell <code>Remove-Item</code>.
</p>

<p align="center">

![npm version](https://img.shields.io/npm/v/remove-item)
![license](https://img.shields.io/npm/l/remove-item)
![node](https://img.shields.io/node/v/remove-item)

</p>

## Features

* Directory removal
* Cross-platform support
* Windows support
* Linux support
* macOS support
* Recursive directory deletion
* Promise-based API
* ESM support
* TypeScript support
* Powerful CLI
* Production tested


## Documentation

| Resource | Description |
|----------|-------------|
| [`docs/api.md`](docs/api.md) | Full Node.js API reference |
| [`docs/cli.md`](docs/cli.md) | Full CLI reference and options |
| [`examples/basic.js`](examples/basic.js) | Basic usage examples |
| [`examples/advanced.js`](examples/advanced.js) | Advanced patterns (dry-run, conditional cleanup) |

# Installation

## npm

```bash
npm install remove-item
```

## pnpm

```bash
pnpm add remove-item
```

## yarn

```bash
yarn add remove-item
```

---

# CLI Usage

> See [`docs/cli.md`](docs/cli.md) for the full CLI reference.

## Remove a file

```bash
remove-item file.txt
```

## Remove a directory

```bash
remove-item dist
```

## Remove recursively

```bash
remove-item node_modules --recursive
```

## Force removal

```bash
remove-item cache --recursive --force
```

## Multiple targets

```bash
remove-item dist coverage .cache --recursive --force
```

# Node.js API

> See [`docs/api.md`](docs/api.md) for the full API reference.

## ESM

```javascript
import { removeItem } from "remove-item";


await removeItem("dist");
```


## Multiple paths

```javascript
import { removeItem } from "remove-item";


await removeItem([
  "dist",
  "coverage",
  ".cache"
]);
```

---

## Options

```javascript
await removeItem("build", {
  recursive: true,
  force: true
});
```

| Option    | Type    | Default | Description                     |
| --------- | ------- | ------- | ------------------------------- |
| recursive | boolean | false   | Remove directories recursively  |
| force     | boolean | false   | Ignore missing files and errors |
| verbose   | boolean | false   | Show operation logs             |
| dryRun    | boolean | false   | Preview deletion                |


# Why remove-item?

Traditional commands are platform dependent:

### Unix

```bash
rm -rf folder
```

### PowerShell

```powershell
Remove-Item folder -Recurse -Force
```

`remove-item` provides a consistent Node.js experience:

```javascript
await removeItem("folder");
```

Works everywhere:

```
Windows ✓
Linux   ✓
macOS   ✓
```

# CLI Examples

## Clean build files

```bash
remove-item dist --recursive
```

## Remove dependencies

```bash
remove-item node_modules --recursive --force
```

## Clean project

```bash
remove-item \
dist \
coverage \
.cache \
--recursive \
--force
```

# TypeScript

Built with first-class TypeScript support.

```typescript
import {
  removeItem
} from "remove-item";


await removeItem("temporary-folder");
```

Types are included automatically.


# Error Handling

```javascript
try {

  await removeItem("temp");

  console.log("Removed successfully");

} catch (error) {

  console.error(error);

}
```

# Safety

⚠️ `remove-item` permanently deletes files.

Always verify paths before executing deletion commands.

For safer workflows:

```javascript
await removeItem("./generated", {
  dryRun: true
});
```

# Examples

Run ready-to-use examples:

```bash
node examples/basic.js
node examples/advanced.js
```

| File | Description |
|------|-------------|
| [`examples/basic.js`](examples/basic.js) | Single file, multiple files, recursive, force, dryRun, error handling |
| [`examples/advanced.js`](examples/advanced.js) | Mixed cleanup, result inspection, dry-run → confirm workflow, conditional cleanup by file age |


# Comparison

| Feature              | remove-item | rimraf  |
| -------------------- | ----------- | ------- |
| Cross-platform       | ✅           | ✅       |
| Node API             | ✅           | ✅       |
| CLI                  | ✅           | ✅       |
| TypeScript           | ✅           | ✅       |
| ESM                  | ✅           | ✅       |
| Modern fs.rm API     | ✅           | Depends |
| PowerShell style API | ✅           | ❌       |


# Development

Clone:

```bash
git clone https://github.com/YOUR_USERNAME/remove-item.git
```

Install:

```bash
npm install
```

Build:

```bash
npm run build
```

Test:

```bash
npm test
```

# Contributing

Contributions, issues, and feature requests are welcome.

Please read:

* CONTRIBUTING.md
* CODE_OF_CONDUCT.md

before submitting a pull request.


# Security

If you discover a security issue, please report it privately.

Do not open a public issue for security vulnerabilities.


# License

Remove-item is licensed under **MIT**. Copyright © [Hemanta Gayen](https://github.com/hemanta-gayen).

# Acknowledgements

Inspired by:

* PowerShell `Remove-Item`
* Unix `rm -rf`
* Node.js filesystem APIs
