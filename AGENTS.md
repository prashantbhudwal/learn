# Agent Guidelines for this Repository

This document contains instructions for AI agents (like Cursor, Copilot, Claude, etc.) working in this repository.

## 1. Project Overview

This is a **learning-focused monorepo** organized into three distinct workspaces:

```
learn/
├── apps/          # Deployable applications
│   ├── web/       # Web apps (Vite-based)
│   ├── node/      # Node.js/CLI tools
│   └── tui/       # Terminal UI applications
├── notebooks/     # Learning experiments & practice
│   ├── algos/     # Algorithm practice
│   ├── testing/   # Testing patterns
│   ├── node/      # Node.js experiments
│   ├── http/      # HTTP server experiments
│   └── unix/      # Shell scripting
└── packages/      # Reusable libraries (for shared code like UI components)
```

**Rule of thumb:**
- Building something users interact with? → `apps/`
- Learning or practicing a concept? → `notebooks/`
- Creating shared code for multiple apps? → `packages/`

**See Also:** [LEARNING.md](./LEARNING.md) - Comprehensive guide on monorepo patterns, creating learning modules, and teaching best practices.

## 2. Environment & Commands

### Package Manager
- This project uses **Bun** (evidenced by `bun.lockb`).
- **Workspaces:** Configured in root `package.json` using `"workspaces": ["apps/*/*", "notebooks/*", "packages/*"]`.
- If `bun` is not available, please install it or discuss with the user.

### Commands by Workspace

#### Apps
```bash
# Web apps
bun run web:vite dev        # Start Vite dev server
bun run web:vite build      # Build for production

# TUI apps
bun run quiz                # Run OpenQuiz TUI app

# Node apps
# (Add commands here as node apps are created)
```

#### Notebooks (Learning)
```bash
bun run algos               # Run algorithm experiments
bun run nodepkg             # Run Node.js experiments
bun run testingpkg          # Run testing examples
bun run unix                # Run Unix experiments
bun run http                # Run HTTP server experiments
```

#### Testing
```bash
bun run test                # Run tests in notebooks/testing/
bun run test:ui             # Run tests with UI
bun run test:all            # Run all tests across workspaces
```

### Adding Dependencies
- **To a specific workspace:** `cd apps/web/vite && bun add <package>`
- **Install all:** `bun install` (from root)

### Linting & Type Checking
- **Type Check:** `bun x tsc --noEmit`
- Note: Build scripts include `tsc` check. Always verify type safety before committing.

## 3. Code Style & Conventions

### Formatting
- **Indentation:** 2 spaces.
- **Semicolons:** Avoid semicolons (ASI style), unless strictly necessary for compilation.
- **Quotes:** Use single quotes `'` for strings.
- **Line Endings:** LF (Unix style).

### TypeScript
- **Strict Mode:** Enabled (`"strict": true` in `tsconfig.json`).
- **Target:** ES2022.
- **Module Resolution:** Bundler.
- **Explicit Types:** Use explicit return types for public functions. Avoid `any`.
- **Imports:**
  - Use explicit file extensions (e.g., `import { x } from './file.ts'`).
  - Group imports: 3rd party first, then local.

### Naming Conventions
- **Variables & Functions:** camelCase (e.g., `setupCounter`, `element`).
- **Files:** kebab-case (e.g., `intro.test.ts`) or camelCase depending on existing patterns.
- **Classes/Components:** PascalCase.
- **Package Names:** `@learn/<workspace>-<name>` (e.g., `@learn/web-vite`, `@learn/openquiz`).

### Error Handling
- Use `try...catch` blocks for async operations.
- Throw `Error` objects with descriptive messages.
- In tests, use `expect(() => function()).toThrow()` to verify error handling.

## 4. Testing Guidelines

### Framework
- Use **Vitest** for testing (located in `notebooks/testing/`).
- Import `describe`, `test`, `expect` from `'vitest'`.

### Structure
- Group related tests using `describe` blocks.
- Use `test` (preferable over `it`) for defining test cases.
- **Example:**
  ```typescript
  import { describe, expect, test } from 'vitest'
  import { add } from './math'

  describe('math functions', () => {
    test('should return the sum', () => {
      expect(add(1, 2)).toBe(3)
    })
  })
  ```

### Assertions
- Use `toBe()` for primitives.
- Use `toStrictEqual()` for objects/arrays to ensure deep equality.

## 5. Documentation

- **Comments:** Use JSDoc `/** ... */` for functions explaining *why* logic exists, not *what* it does.
- **Self-documenting code:** Prefer descriptive variable/function names over comments.

## 6. File System Operations

- **Paths:** Always use absolute paths when performing file operations.
- **Verify:** Always verify file existence before attempting to read/edit.

## 7. General Behavior

- **Safety:** Do not delete files or directories unless explicitly instructed.
- **Verification:** After making changes, run relevant tests (`bun run test`) and type check (`bun x tsc --noEmit`).
- **Conventions:** Follow existing patterns. Prioritize consistency with the immediate context.
- **Commits:** Create modular, logical commits with clear messages.
