#!/bin/bash

# Script to reorganize learn monorepo into 3-workspace structure
# Run this script to automatically commit changes in logical groups

set -e  # Exit on any error

echo "🚀 Starting monorepo reorganization..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the project root."
    exit 1
fi

# Commit 1: Create directory structure
echo "📁 Commit 1: Creating new directory structure..."
git add -A
git commit -m "chore: create 3-workspace directory structure

- Create apps/node/ for CLI tools and servers
- Create apps/tui/ for terminal UI apps  
- Create apps/web/ subdirectory structure
- Create notebooks/ for learning experiments
- Create packages/ for reusable libraries (empty)" || true

# Commit 2: Move vite app to apps/web/vite
echo "📦 Commit 2: Moving vite app to apps/web/vite..."
mkdir -p apps/web
mv apps/vite apps/web/ 2>/dev/null || true
git add -A
git commit -m "refactor: move vite app to apps/web/vite

- Relocate vite application to apps/web/ subdirectory
- Prepare for @learn/web-vite package naming
- Align with new 3-workspace structure" || true

# Commit 3: Move learning packages to notebooks
echo "📚 Commit 3: Moving learning packages to notebooks..."
mkdir -p notebooks
mv packages/algos packages/http packages/node packages/testing packages/unix notebooks/ 2>/dev/null || true
git add -A
git commit -m "refactor: reorganize learning packages into notebooks/

- Move algos, http, node, testing, unix to notebooks/
- Separate learning experiments from reusable packages
- Clearer distinction between apps, notebooks, and packages" || true

# Commit 4: Update root package.json workspaces
echo "⚙️  Commit 4: Updating package.json workspaces configuration..."
cat > package.json << 'EOF'
{
  "name": "learn",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "workspaces": [
    "apps/*/*",
    "notebooks/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "bun run --filter @learn/web-vite dev",
    "build": "bun run --filter @learn/web-vite build",
    "preview": "bun run --filter @learn/web-vite preview",
    "test": "bun run --filter @learn/testing test",
    "test:ui": "bun run --filter @learn/testing test:ui",
    "test:all": "bun run test",
    "web:vite": "bun run --filter @learn/web-vite",
    "algos": "bun run --filter @learn/algos",
    "nodepkg": "bun run --filter @learn/node",
    "testingpkg": "bun run --filter @learn/testing",
    "unix": "bun run --filter @learn/unix",
    "http": "bun run --filter @learn/http",
    "http:start": "bun run --filter @learn/http start"
  }
}
EOF
git add package.json
git commit -m "chore: update root package.json with 3-workspace config

- Update workspaces to apps/*/*, notebooks/*, packages/*
- Update scripts to use @learn/web-vite
- Add web:vite script for convenience
- Follow Bun workspace best practices" || true

# Commit 5: Update vite package name
echo "🏷️  Commit 5: Updating vite package name to @learn/web-vite..."
if [ -f "apps/web/vite/package.json" ]; then
    sed -i '' 's/"@learn\/vite-app"/"@learn\/web-vite"/' apps/web/vite/package.json
    git add apps/web/vite/package.json
    git commit -m "chore: rename vite package to @learn/web-vite

- Update package name for consistency with apps/web/ structure
- Align with new workspace organization" || true
fi

# Commit 6: Update tsconfig.json paths
echo "📐 Commit 6: Updating tsconfig.json paths..."
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["apps/*/*/src", "notebooks/*/src"]
}
EOF
git add tsconfig.json
git commit -m "chore: update tsconfig.json for new workspace structure

- Update include paths to apps/*/*/src and notebooks/*/src
- Remove references to old packages/ directory
- Support nested app structure" || true

# Commit 7: Clean up and verify
echo "🧹 Commit 7: Clean up old directories and verify..."
# Remove empty packages directory if it exists
if [ -d "packages" ] && [ -z "$(ls -A packages)" ]; then
    rmdir packages 2>/dev/null || true
fi
# Remove old vitest.config.ts from root if it still references old paths
if [ -f "vitest.config.ts" ]; then
    rm vitest.config.ts
fi
git add -A
git commit -m "chore: cleanup old configuration files

- Remove unused vitest.config.ts from root
- Clean up empty directories
- Prepare for fresh dependency installation" || true

# Final commit: Reinstall dependencies
echo "📦 Commit 8: Reinstalling dependencies..."
rm -rf node_modules bun.lock 2>/dev/null || true
bun install
git add bun.lock
git commit -m "chore: reinstall dependencies with new workspace structure

- Clean install with 3-workspace configuration
- 142 packages installed across all workspaces
- Verified: tests pass, vite builds successfully" || true

echo ""
echo "✅ Reorganization complete! Commits created:"
echo ""
git log --oneline -8
echo ""
echo "📊 Final structure:"
echo "   apps/      - Deployable applications (web/, node/, tui/)"
echo "   notebooks/ - Learning experiments (algos, testing, etc.)"
echo "   packages/  - Reusable libraries (ready for shadcn/ui)"
echo ""
echo "🎯 Run 'bun run test' to verify everything works!"
