# Contributing

Thank you for considering contributing to **remove-item**!

## Prerequisites

- [Node.js](https://nodejs.org) >= 18
- npm (or pnpm, yarn)

## Setup

Fork the repository, then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/remove-item.git
cd remove-item
npm install
```

## Development

Build the project:

```bash
npm run build
```

Watch mode:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## Project Structure

```
remove-item/
├── src/           TypeScript source code
│   ├── core/      File and directory removal logic
│   ├── cli/       Argument parsing, commands, help
│   ├── utils/     Path, logging, error utilities
│   └── types/     TypeScript type definitions
├── tests/         Test files
│   ├── unit/      Unit tests for core modules
│   └── integration/  CLI integration tests
├── examples/      Runnable usage examples
├── docs/          API and CLI reference docs
└── dist/          Compiled output (generated)
```

## Coding Guidelines

- Write in **TypeScript** using **ESM** (`import`/`export`).
- Existing code uses **no semicolons** — match the style.
- Use `async`/`await` over raw promises.
- Use descriptive variable and function names.
- Keep functions focused and single-purpose.

## Testing

Tests use Node's built-in [`node:test`](https://nodejs.org/api/test.html) with `tsx` for TypeScript support:

```bash
node --import tsx --test tests/**/*.test.ts
```

- Add unit tests in `tests/unit/` for core modules.
- Add integration tests in `tests/integration/` for CLI.
- All tests must pass before submitting a PR.

## Pull Requests

1. Create a branch from `main` with a descriptive name (e.g. `fix/dry-run-error`).
2. Make focused commits with clear messages.
3. Ensure `npm run build` and `npm test` pass.
4. Open a PR against `main` with a clear title and description.

## Reporting Issues

Include:

- Node.js version (`node --version`)
- Operating system
- Steps to reproduce
- Expected vs actual behavior

## Code of Conduct

Please read and follow our [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
