# Learning Monorepo Guide

A guide for future me (and AI assistants) on how to use, maintain, and extend this learning-focused monorepo.

---

## 1. What This Repo Is

This is a **hands-on learning laboratory** - not a production codebase. Every directory contains:
- Working code examples you can run immediately
- Detailed primers explaining the "why" behind concepts
- Exercises to test understanding
- Notes capturing insights and gotchas

**Philosophy:** Learning happens through doing. Every concept has runnable code.

---

## 2. Monorepo Structure Explained

```
learn/
├── apps/                    # Deployable applications
│   ├── web/vite/           # Vite + React web app
│   ├── web/hono/           # Hono web framework
│   ├── node/openquiz/      # CLI quiz application
│   └── tui/                # Terminal UI apps
├── notebooks/              # Learning sandboxes
│   ├── algos/              # Algorithm patterns
│   ├── nginx/              # Nginx reverse proxy
│   ├── reverse-proxy/      # Build proxy from scratch
│   ├── unix/               # Shell & process management
│   ├── testing/            # Vitest patterns
│   ├── http/               # HTTP server experiments
│   └── node/               # Node.js deep dives
└── packages/               # Shared code (if needed)
```

### The Rule of Three

| Location | Use When | Example |
|----------|----------|---------|
| `apps/` | Building something users interact with | A quiz app, a web dashboard |
| `notebooks/` | Learning or experimenting | Testing nginx configs, practicing algorithms |
| `packages/` | Code shared across multiple apps | UI component library |

**Golden Rule:** When in doubt, put it in `notebooks/`. Move to `apps/` only when it becomes a real tool.

---

## 3. How to Create a New Learning Module

### Step 1: Choose the Right Location

```bash
# Learning a new concept? → notebooks/
mkdir notebooks/new-topic

# Building a usable tool? → apps/
mkdir apps/node/my-cli-tool
```

### Step 2: Required Files

Every notebook must have:

```
notebooks/topic-name/
├── README.md          # Quick start guide
├── NOTES.md           # Insights, gotchas, unknowns
├── src/               # Runnable code
│   ├── index.ts
│   └── examples/
└── package.json       # Bun workspace config
```

### Step 3: Add to Root package.json

```json
{
  "scripts": {
    "new-topic": "bun run notebooks/new-topic/src/index.ts"
  }
}
```

---

## 4. Teaching Through Code: Best Practices

### The Progressive Disclosure Pattern

Start simple, layer complexity:

```typescript
// Step 1: Basic version (understand the core)
function reverseProxy(req) {
  return fetch('http://backend' + req.url)
}

// Step 2: Add one feature at a time
function reverseProxy(req) {
  // Add logging
  console.log(req.method, req.url)
  
  // Add error handling
  try {
    return fetch('http://backend' + req.url)
  } catch (e) {
    return new Response('Error', { status: 500 })
  }
}

// Step 3: Full version with all features
function reverseProxy(req) {
  // Logging, routing, caching, rate limiting...
}
```

### Always Include the "Why"

❌ **Bad:**
```typescript
const map = new Map()  // Use a map
```

✅ **Good:**
```typescript
// Map gives O(1) lookups vs O(n) for arrays
// Trade: More memory (O(n)) for faster time (O(1))
const map = new Map()
```

### Use Analogies Liberally

| Technical Concept | Analogy |
|-------------------|---------|
| Reverse Proxy | Hotel concierge |
| Hash Map | Librarian's notebook |
| Rate Limiting | Bouncer at a club |
| Load Balancing | Multiple checkout lanes |
| Caching | Keeping a copy of frequently asked questions |

---

## 5. The Learning Workflow

### For Me (AI Assistant)

When helping the user learn:

1. **Start with the README** - Have them read the conceptual overview
2. **Run the Code** - Show it working before explaining
3. **Modify and Experiment** - Change one thing, see what happens
4. **Do the Exercises** - Verify understanding through practice
5. **Document Insights** - Add discoveries to NOTES.md

**Reference:** See [AGENTS.md](./AGENTS.md) for technical commands, code style, and testing guidelines.

---

## 6. Common Mistakes to Avoid

### Mistake 1: Too Much Theory, No Code

❌ Spending 30 minutes explaining before showing anything

✅ Show working code in first 2 minutes, explain while it's running

### Mistake 2: Production-Ready on First Try

❌ Building the full-featured version immediately

✅ Start with minimal version, add features incrementally

### Mistake 3: Skipping the Analogy

❌ "A reverse proxy forwards requests to backend servers"

✅ "A reverse proxy is like a hotel concierge - one point of contact, routes to the right service, handles the complexity"

### Mistake 4: No Exercises

❌ Only providing examples

✅ Always include "Now you try" exercises

### Mistake 5: Forgetting the Unknowns

After learning something, document what we DIDN'T cover:

```markdown
## Unknown Unknowns

What we skipped:
- SSL/TLS configuration
- WebSocket proxying
- Distributed rate limiting with Redis
- Health checks with nginx Plus

Why: Beyond scope for fundamentals
When to learn: Before production deployment
```

---

## 7. The Golden Rules

1. **Code First:** Show, don't just tell
2. **Analogies Matter:** Connect to real-world experiences
3. **Progressive Complexity:** Layer concepts one at a time
4. **Hands-On:** Every concept must be runnable
5. **Document Unknowns:** Capture what we didn't cover
6. **Test Everything:** Verify understanding with exercises
7. **Iterate:** Start simple, enhance gradually

---

## 8. Useful External Resources

- **Bun docs:** https://bun.sh/docs
- **Vitest:** https://vitest.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Nginx:** https://nginx.org/en/docs/
- **Docker:** https://docs.docker.com/

---

## Remember

This repo exists to make abstract concepts concrete through code. If I can't run it and see it work, it's not done yet.

When in doubt:
1. What's the simplest version of this concept?
2. Can I run it right now?
3. What analogy makes this intuitive?
4. What exercises prove understanding?

Happy teaching (and learning)! 🚀
