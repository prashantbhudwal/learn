# The Reverse Proxy Pattern: A Complete Primer

The **Reverse Proxy** is a fundamental architectural pattern in web development. It sits between clients and backend servers, acting as an intermediary that forwards requests and returns responses. Understanding this pattern is essential for building scalable, secure, and maintainable applications.

---

## Table of Contents

1. [The Big Picture: What is a Reverse Proxy?](#the-big-picture-what-is-a-reverse-proxy)
2. [The Core Intuition: The "Concierge" Analogy](#the-core-intuition-the-concierge-analogy)
3. [Forward Proxy vs Reverse Proxy](#forward-proxy-vs-reverse-proxy)
4. [Key Benefits and Use Cases](#key-benefits-and-use-cases)
5. [The Building Blocks](#the-building-blocks)
6. [Pattern Variations](#pattern-variations)
7. [Worked Examples](#worked-examples)
8. [Common Pitfalls](#common-pitfalls)
9. [Practice Exercises](#practice-exercises)

---

## The Big Picture: What is a Reverse Proxy?

A reverse proxy is a server that sits in front of one or more backend servers and forwards client requests to those servers. Unlike a forward proxy (which sits in front of clients), a reverse proxy is transparent to clients—they think they're talking directly to the backend.

```
┌─────────┐         ┌──────────────┐         ┌─────────────┐
│ Client  │ ──────► │ Reverse      │ ──────► │ Backend     │
│ (Browser│         │ Proxy        │         │ Server(s)   │
│  /curl) │ ◄────── │ (Port 3000)  │ ◄────── │ (Port 3001) │
└─────────┘         └──────────────┘         └─────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │ Handles:     │
                    │ • Routing    │
                    │ • Load Balancing
                    │ • SSL        │
                    │ • Caching    │
                    └──────────────┘
```

### The Mental Model

| Component | Role | Analogy |
|-----------|------|---------|
| **Client** | Makes requests | Guest at a hotel |
| **Reverse Proxy** | Receives & forwards | Hotel concierge |
| **Backend Server** | Processes requests | Hotel services (spa, restaurant, room service) |

---

## The Core Intuition: The "Concierge" Analogy

Imagine you're staying at a luxury hotel. You want dinner, a massage, and your room cleaned. You don't call the kitchen, spa, and housekeeping directly—you call the **concierge**.

**Without a Reverse Proxy (Direct Access):**
- You must know the phone number for every service
- Services are overwhelmed with direct calls
- No one manages which service handles your request
- If a service is down, you get a busy signal

**With a Reverse Proxy (Concierge):**
- You only need one number (the concierge)
- Concierge routes your request to the right service
- Concierge can send you to a different spa if one is full
- Concierge remembers your preferences (caching)
- You never know (or care) which specific person handled your request

### The Two Phases

Every reverse proxy operation follows this structure:

```
┌─────────────────────────────────────────────────────────────┐
│                     PHASE 1: RECEIVE                        │
│                                                             │
│   Client sends request to proxy (public-facing endpoint).  │
│   Proxy can inspect/modify the request.                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     PHASE 2: FORWARD                        │
│                                                             │
│   Proxy determines target backend and forwards request.    │
│   Proxy receives response and returns it to client.        │
└─────────────────────────────────────────────────────────────┘
```

---

## Forward Proxy vs Reverse Proxy

These are often confused. Here's the distinction:

### Forward Proxy (Client-Side)

```
┌─────────┐         ┌──────────────┐         ┌─────────────┐
│ Client  │ ──────► │ Forward      │ ──────► │ Internet/   │
│         │         │ Proxy        │         │ Destination │
│         │ ◄────── │              │ ◄────── │             │
└─────────┘         └──────────────┘         └─────────────┘
      ▲                   △
      │                   │
   Client knows        Hides client
   about proxy         from destination
```

**Use case:** Hiding the client's identity, bypassing firewalls, accessing blocked content.

### Reverse Proxy (Server-Side)

```
┌─────────┐         ┌──────────────┐         ┌─────────────┐
│ Client  │ ──────► │ Reverse      │ ──────► │ Backend     │
│         │         │ Proxy        │         │ Server(s)   │
│         │ ◄────── │              │ ◄────── │             │
└─────────┘         └──────────────┘         └─────────────┘
      △                   △
      │                   │
   Client thinks       Hides backend
   it's talking        from client
   to backend
```

**Use case:** Load balancing, SSL termination, caching, security.

---

## Key Benefits and Use Cases

### 1. Load Balancing

Distribute incoming requests across multiple backend servers.

```
                    ┌─────────────┐
         ┌─────────►│ Backend 1   │
         │          │ (Port 3001) │
┌──────┐ │          └─────────────┘
│      │─┤
│Proxy │ │          ┌─────────────┐
│      │─┼─────────►│ Backend 2   │
└──────┘ │          │ (Port 3002) │
         │          └─────────────┘
         │
         │          ┌─────────────┐
         └─────────►│ Backend 3   │
                    │ (Port 3003) │
                    └─────────────┘
```

### 2. SSL Termination

Handle HTTPS at the proxy, backend uses HTTP (simpler configuration).

```
Client ──(HTTPS)──► Proxy ──(HTTP)──► Backend
         Encrypted          Plain text
         (public)           (private network)
```

### 3. Caching

Store responses and serve them without hitting the backend.

```
Request for /api/data
        │
        ▼
   ┌─────────┐
   │ Cached? │──Yes──► Return cached response
   └────┬────┘
        │ No
        ▼
   Forward to backend
```

### 4. Security

- Hide backend server details (IPs, ports, technology stack)
- Rate limiting (prevent abuse)
- Web Application Firewall (WAF)
- DDoS protection

### 5. Request Routing

Route different paths to different backends.

```
/api/*     ──► Backend API server (port 3001)
/static/*  ──► Static file server (port 3002)
/admin/*   ──► Admin panel server (port 3003)
```

---

## The Building Blocks

### 1. Basic Reverse Proxy

```typescript
// proxy.ts
const BACKEND_URL = 'http://localhost:3001'
const PROXY_PORT = 3000

const proxy = Bun.serve({
  port: PROXY_PORT,
  async fetch(req) {
    const url = new URL(req.url)
    
    // Build target URL
    const targetUrl = new URL(url.pathname + url.search, BACKEND_URL)
    
    // Forward request to backend
    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.body,
    })
    
    // Return backend response to client
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    })
  },
})
```

### 2. Adding Logging

```typescript
const proxy = Bun.serve({
  port: PROXY_PORT,
  async fetch(req) {
    const url = new URL(req.url)
    const start = Date.now()
    
    console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}`)
    
    const response = await fetch(targetUrl.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.body,
    })
    
    const duration = Date.now() - start
    console.log(`[${duration}ms] ${response.status}`)
    
    return response
  },
})
```

### 3. Error Handling

```typescript
const proxy = Bun.serve({
  port: PROXY_PORT,
  async fetch(req) {
    try {
      const response = await fetch(targetUrl.toString(), {
        method: req.method,
        headers: req.headers,
        body: req.body,
      })
      
      return response
    } catch (error) {
      console.error('Backend error:', error)
      return new Response('Service Unavailable', { status: 503 })
    }
  },
})
```

### 4. Path-Based Routing

```typescript
const ROUTES = {
  '/api/': 'http://localhost:3001',
  '/static/': 'http://localhost:3002',
}

function getBackendUrl(pathname: string): string {
  for (const [prefix, backend] of Object.entries(ROUTES)) {
    if (pathname.startsWith(prefix)) {
      return backend
    }
  }
  return 'http://localhost:3001' // Default
}
```

---

## Pattern Variations

### Variation 1: Round-Robin Load Balancer

Distribute requests evenly across backends.

```typescript
const BACKENDS = [
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
]

let currentIndex = 0

function getNextBackend(): string {
  const backend = BACKENDS[currentIndex]
  currentIndex = (currentIndex + 1) % BACKENDS.length
  return backend
}

// Usage
const backend = getNextBackend()
const targetUrl = new URL(url.pathname, backend)
```

### Variation 2: Health Check Pattern

Don't send requests to unhealthy backends.

```typescript
const backendHealth = new Map<string, boolean>()

async function checkHealth(backend: string): Promise<boolean> {
  try {
    const response = await fetch(backend + '/health', { 
      signal: AbortSignal.timeout(5000) 
    })
    return response.ok
  } catch {
    return false
  }
}

function getHealthyBackend(): string | null {
  for (const backend of BACKENDS) {
    if (backendHealth.get(backend) !== false) {
      return backend
    }
  }
  return null
}
```

### Variation 3: Simple Cache

Cache responses to reduce backend load.

```typescript
const cache = new Map<string, { response: Response; expiry: number }>()
const CACHE_TTL = 60 * 1000 // 60 seconds

async function getCachedResponse(key: string): Promise<Response | null> {
  const cached = cache.get(key)
  if (cached && cached.expiry > Date.now()) {
    return cached.response.clone()
  }
  cache.delete(key)
  return null
}

function setCachedResponse(key: string, response: Response): void {
  cache.set(key, {
    response: response.clone(),
    expiry: Date.now() + CACHE_TTL,
  })
}
```

### Variation 4: Rate Limiting

Prevent abuse by limiting requests per IP.

```typescript
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 100 // requests
const RATE_WINDOW = 60 * 1000 // 60 seconds

function isRateLimited(clientIp: string): boolean {
  const now = Date.now()
  const record = requestCounts.get(clientIp)
  
  if (!record || now > record.resetTime) {
    // New window
    requestCounts.set(clientIp, {
      count: 1,
      resetTime: now + RATE_WINDOW,
    })
    return false
  }
  
  if (record.count >= RATE_LIMIT) {
    return true // Rate limited
  }
  
  record.count++
  return false
}
```

---

## Worked Examples

### Example 1: Basic Reverse Proxy

**Problem:** Create a proxy that forwards all requests from port 3000 to a backend on port 3001.

**Solution:**

```typescript
const proxy = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url)
    const target = new URL(url.pathname + url.search, 'http://localhost:3001')
    
    return await fetch(target.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.body,
    })
  },
})
```

### Example 2: Path-Based Routing

**Problem:** Route `/api/*` to port 3001 and `/static/*` to port 3002.

**Solution:**

```typescript
const proxy = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url)
    
    let backend: string
    if (url.pathname.startsWith('/api/')) {
      backend = 'http://localhost:3001'
    } else if (url.pathname.startsWith('/static/')) {
      backend = 'http://localhost:3002'
    } else {
      return new Response('Not Found', { status: 404 })
    }
    
    const target = new URL(url.pathname + url.search, backend)
    return await fetch(target.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.body,
    })
  },
})
```

### Example 3: Load Balancer with Health Checks

**Problem:** Distribute requests across 3 backends, skipping unhealthy ones.

**Solution:**

```typescript
const BACKENDS = [
  { url: 'http://localhost:3001', healthy: true },
  { url: 'http://localhost:3002', healthy: true },
  { url: 'http://localhost:3003', healthy: true },
]

let currentIndex = 0

function getHealthyBackend(): string | null {
  const startIndex = currentIndex
  
  do {
    const backend = BACKENDS[currentIndex]
    currentIndex = (currentIndex + 1) % BACKENDS.length
    
    if (backend.healthy) {
      return backend.url
    }
  } while (currentIndex !== startIndex)
  
  return null
}

const proxy = Bun.serve({
  port: 3000,
  async fetch(req) {
    const backend = getHealthyBackend()
    if (!backend) {
      return new Response('No healthy backends', { status: 503 })
    }
    
    const url = new URL(req.url)
    const target = new URL(url.pathname + url.search, backend)
    
    try {
      return await fetch(target.toString(), {
        method: req.method,
        headers: req.headers,
        body: req.body,
      })
    } catch (error) {
      // Mark backend as unhealthy
      const backendInfo = BACKENDS.find(b => b.url === backend)
      if (backendInfo) backendInfo.healthy = false
      
      return new Response('Backend error', { status: 502 })
    }
  },
})
```

---

## Common Pitfalls

### Pitfall 1: Not Handling Backend Failures

```typescript
// ❌ WRONG: No error handling
const response = await fetch(backendUrl)
return response

// ✅ CORRECT: Handle backend failures
try {
  const response = await fetch(backendUrl)
  return response
} catch (error) {
  console.error('Backend unavailable:', error)
  return new Response('Service Unavailable', { status: 503 })
}
```

### Pitfall 2: Not Preserving Headers

```typescript
// ❌ WRONG: Creating new headers loses important ones
const response = await fetch(backendUrl, {
  headers: { 'Content-Type': 'application/json' }
})

// ✅ CORRECT: Forward original headers
const response = await fetch(backendUrl, {
  headers: req.headers,
})
```

### Pitfall 3: Blocking the Event Loop

```typescript
// ❌ WRONG: Synchronous operations block other requests
const data = fs.readFileSync('large-file.txt')

// ✅ CORRECT: Use async operations
const data = await fs.promises.readFile('large-file.txt')
```

### Pitfall 4: Not Handling Request Body

```typescript
// ❌ WRONG: POST/PUT requests lose their body
const response = await fetch(backendUrl, {
  method: req.method,
})

// ✅ CORRECT: Forward the body
const response = await fetch(backendUrl, {
  method: req.method,
  body: req.body,
})
```

### Pitfall 5: Memory Leaks in Caching

```typescript
// ❌ WRONG: Cache grows forever
const cache = new Map()
cache.set(key, response)

// ✅ CORRECT: Implement TTL and size limits
const cache = new Map()
const MAX_CACHE_SIZE = 1000

function setCache(key: string, value: Response): void {
  if (cache.size >= MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value
    cache.delete(firstKey)
  }
  cache.set(key, { value, expiry: Date.now() + TTL })
}
```

---

## Practice Exercises

### Exercise 1: Basic Proxy
Create a reverse proxy that forwards requests from port 8080 to a backend on port 3000.

**Test:**
```bash
curl http://localhost:8080/api/test
```

### Exercise 2: Add Logging
Extend the basic proxy to log:
- Timestamp
- Request method and path
- Response status code
- Request duration

### Exercise 3: Path Routing
Create a proxy that routes:
- `/api/*` → port 3001
- `/web/*` → port 3002
- Everything else → port 3001

### Exercise 4: Load Balancer
Implement round-robin load balancing across 3 backends (ports 3001, 3002, 3003).

### Exercise 5: Health Checks
Add a health check endpoint (`/health`) that returns the status of all backends.

### Exercise 6: Rate Limiting
Implement rate limiting: max 10 requests per minute per IP address.

### Exercise 7: Simple Cache
Cache GET responses for 30 seconds. Return cached response if available.

### Exercise 8: SSL Termination
Configure the proxy to accept HTTPS on port 443 and forward HTTP to backends.

---

## Summary: The Decision Checklist

When should you use a reverse proxy?

1. **Multiple backend servers?** → Load balancing
2. **Need HTTPS but backends are HTTP?** → SSL termination
3. **Heavy read traffic?** → Caching
4. **Different services on different paths?** → Path-based routing
5. **Need to hide backend details?** → Security/abstraction
6. **Worried about abuse?** → Rate limiting

---

## Quick Reference: The Code Snippets You'll Use

```typescript
// ═══════════════════════════════════════════
// BASIC REVERSE PROXY
// ═══════════════════════════════════════════

const proxy = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url)
    const target = new URL(url.pathname, 'http://localhost:3001')
    
    return await fetch(target.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.body,
    })
  },
})

// ═══════════════════════════════════════════
// ROUND-ROBIN LOAD BALANCER
// ═══════════════════════════════════════════

const backends = ['http://localhost:3001', 'http://localhost:3002']
let index = 0

function getBackend() {
  const backend = backends[index]
  index = (index + 1) % backends.length
  return backend
}

// ═══════════════════════════════════════════
// PATH-BASED ROUTING
// ═══════════════════════════════════════════

function getBackendUrl(pathname: string): string {
  if (pathname.startsWith('/api/')) return 'http://localhost:3001'
  if (pathname.startsWith('/static/')) return 'http://localhost:3002'
  return 'http://localhost:3001'
}

// ═══════════════════════════════════════════
// ERROR HANDLING
// ═══════════════════════════════════════════

try {
  const response = await fetch(backendUrl, { ... })
  return response
} catch (error) {
  return new Response('Service Unavailable', { status: 503 })
}
```

---

## The Golden Rule

> **A reverse proxy is the "concierge" of your application—it receives all requests, decides where they go, and ensures clients never need to know about the complexity behind the scenes.**

Master this pattern and you'll be able to build scalable, secure, and maintainable systems.

Happy coding! 🚀
