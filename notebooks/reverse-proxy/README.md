# Reverse Proxy Learning Notebook

Welcome! This notebook will teach you reverse proxy concepts through hands-on practice. Start with the **Primer** for comprehensive learning, then use the code examples here.

---

## Quick Start

```bash
# Terminal 1: Start the backend
bun run backend

# Terminal 2: Start the proxy
bun run start

# Terminal 3: Test it
curl http://localhost:3000/api/data
```

---

## Documentation

- **[PRIMER.md](./PRIMER.md)** - Complete learning guide (read this first!)
  - Core concepts with analogies
  - Pattern variations (load balancing, caching, rate limiting)
  - Worked examples
  - Common pitfalls
  - Practice exercises

---

## Code Structure

```
notebooks/reverse-proxy/
├── src/
│   ├── proxy.ts      # Basic reverse proxy (port 3000)
│   └── backend.ts    # Test backend server (port 3001)
├── PRIMER.md         # Comprehensive learning guide
└── README.md         # This file
```

---

## Learning Path

1. **Read PRIMER.md** - Understand the concepts
2. **Run the basic proxy** - See it in action
3. **Complete exercises** - Build your own variations
4. **Experiment** - Try the pattern variations

---

## Exercises (from PRIMER.md)

1. **Basic Proxy** - Forward port 8080 to 3000
2. **Add Logging** - Log requests with timestamps and duration
3. **Path Routing** - Route `/api/*` and `/web/*` to different backends
4. **Load Balancer** - Round-robin across 3 backends
5. **Health Checks** - Skip unhealthy backends
6. **Rate Limiting** - 10 requests/minute per IP
7. **Simple Cache** - Cache GET responses for 30s
8. **SSL Termination** - HTTPS in, HTTP out

---

## The "Concierge" Analogy

Think of a reverse proxy like a **hotel concierge**:

| Hotel | Web Application |
|-------|----------------|
| Guest calls one number (concierge) | Client calls one endpoint (proxy) |
| Concierge routes to kitchen/spa/housekeeping | Proxy routes to API/static/admin servers |
| Guest doesn't know which staff member helped | Client doesn't know which backend responded |
| Concierge remembers preferences (caching) | Proxy caches responses |
| If spa is full, send to another (load balancing) | If backend is down, try another |

---

## Key Commands

```bash
# Run the proxy
bun run start

# Run with auto-reload
bun run dev

# Run the backend
bun run backend

# Test endpoints
curl http://localhost:3000/
curl http://localhost:3000/api/data
curl http://localhost:3000/api/users
```
