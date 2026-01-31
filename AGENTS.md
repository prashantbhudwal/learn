# Agent Guidelines for this Repository

This document contains instructions for AI agents (like Cursor, Copilot, etc.) working in this repository.

## 1. Environment & Commands

### Package Manager
- This project uses `bun` (based on `bun.lockb`).
- If `bun` is not available, please install it or discuss with the user.

### Commands
- **Install Dependencies:** `bun install`
- **Development Server:** `bun run dev` (Runs Vite)
- **Build:** `bun run build` (Runs `tsc` and `vite build`)
- **Preview Build:** `bun run preview`
- **Test:** `bun run test` (Runs Vitest)

### Running Specific Tests
To run a specific test file or test case:
- **Run a single file:** `bun run test path/to/test.ts`
- **Run with filter:** `bun run test -t "test name pattern"`

### Linting & Type Checking
- **Type Check:** `bun x tsc --noEmit`
- Note: The `build` script includes a `tsc` check. Always verify type safety before committing.

## 2. Code Style & Conventions

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
  - Use explicit file extensions (e.g., `import { x } from './file.ts'`) as configured in `tsconfig.json` (`allowImportingTsExtensions`).
  - Group imports: 3rd party first, then local.

### Naming Conventions
- **Variables & Functions:** camelCase (e.g., `setupCounter`, `element`).
- **Files:** kebab-case (e.g., `intro.test.ts`, `bun.lockb`) or camelCase depending on existing patterns (currently mixed, prefer existing consistency).
- **Classes/Components:** PascalCase.

### Error Handling
- Use `try...catch` blocks for async operations.
- Throw `Error` objects with descriptive messages.
- In tests, use `expect(() => function()).toThrow()` to verify error handling.

## 3. Testing Guidelines

### Framework
- Use **Vitest** for testing.
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
- Use `toStrictEqual()` for objects/arrays to ensure deep equality and strict type checking.

## 4. Documentation

- **Comments:** Use JSDoc `/** ... */` for functions explaining *why* logic exists, not *what* it does.
- **Self-documenting code:** Prefer descriptive variable/function names over comments.

## 5. File System Operations

- **Paths:** Always use absolute paths when performing file operations (read/write).
- **Verify:** Always verify file existence before attempting to read/edit.

## 6. General Behavior

- **Safety:** Do not delete files or directories unless explicitly instructed.
- **Verification:** After making changes, run the relevant tests (`bun run test`) and type check (`bun x tsc --noEmit`) to ensure no regressions.
- **Conventions:** Follow the existing patterns in the codebase. If existing code uses a specific style (even if different from above), prioritize consistency with the immediate context.
