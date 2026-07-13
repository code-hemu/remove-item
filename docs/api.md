# API Reference

## `removeItem(input, options?)`

Removes files and/or directories from the filesystem.

```ts
function removeItem(
  input: string | string[],
  options?: RemoveOptions
): Promise<RemoveResult[]>
```

### Parameters

| Param     | Type                | Description                                |
|-----------|---------------------|--------------------------------------------|
| `input`   | `string \| string[]` | Single path or array of paths to remove   |
| `options` | `RemoveOptions`      | Optional configuration (see below)         |

### Returns

An array of [`RemoveResult`](#removeresult) objects — one per path.

---

## `RemoveOptions`

| Option      | Type      | Default | Description                                |
|-------------|-----------|---------|--------------------------------------------|
| `recursive` | `boolean` | `false` | Remove directories recursively             |
| `force`     | `boolean` | `false` | Ignore missing files and errors            |
| `verbose`   | `boolean` | `false` | Print operation logs to console            |
| `dryRun`    | `boolean` | `false` | Preview which files would be removed       |

---

## `RemoveResult`

| Field     | Type     | Description                              |
|-----------|----------|------------------------------------------|
| `path`    | `string` | Resolved absolute path of the target     |
| `success` | `boolean`| Whether the removal succeeded            |
| `error`   | `Error?` | The error object if `success` is `false`  |

---

## Errors

| Class                | Code     | Condition                        |
|----------------------|----------|----------------------------------|
| `PathNotFoundError`  | `ENOENT` | Target path does not exist       |
| `PermissionError`    | `EACCES` | Insufficient read/write access   |

Both extend `RemoveItemError`, which has a `.code` property.

---

## Examples

### Remove a single file

```ts
import { removeItem } from "remove-item";

await removeItem("file.txt");
```

### Remove multiple files

```ts
await removeItem(["file1.txt", "file2.txt"]);
```

### Remove a directory recursively

```ts
await removeItem("dist", { recursive: true });
```

### Force removal (skip missing paths)

```ts
await removeItem("cache", { recursive: true, force: true });
```

### Preview without deleting

```ts
const results = await removeItem("dist", { dryRun: true });
console.log(results);
// → [{ path: "/cwd/dist", success: true }]
```

### Handle results

```ts
const results = await removeItem(["dist", "coverage"], {
  recursive: true,
  force: true,
});

for (const r of results) {
  if (r.success) {
    console.log(`✓ ${r.path}`);
  } else {
    console.error(`✗ ${r.path}: ${r.error?.message}`);
  }
}
```

### Error handling

```ts
try {
  await removeItem("nonexistent");
} catch (err) {
  if (err.code === "ENOENT") {
    console.error("Path not found");
  } else {
    console.error(err.message);
  }
}
```
