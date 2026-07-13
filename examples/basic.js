import { removeItem } from "remove-item";

// Remove a single file
await removeItem("temp/file.txt");

// Remove multiple files
await removeItem(["file1.txt", "file2.txt", "file3.txt"]);

// Remove a directory recursively
await removeItem("node_modules", { recursive: true });

// Force removal (skip missing paths)
await removeItem("cache", { recursive: true, force: true });

// Preview without deleting
const results = await removeItem("dist", { dryRun: true });
console.log(results);

// Error handling
try {
  await removeItem("nonexistent");
} catch (err) {
  console.error(err.message);
}
