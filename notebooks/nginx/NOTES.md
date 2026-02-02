# Nginx Learning Notes

## Core Concepts

### 1. What is a Reverse Proxy?

A reverse proxy sits between clients and backend servers, forwarding requests and returning responses. Think of it as a "concierge" that receives all requests, decides where they go, and ensures clients never see the backend complexity.

**Key benefits:**
- **Load balancing** - Distribute traffic across multiple servers
- **SSL termination** - Handle HTTPS at the proxy, backend uses HTTP
- **Caching** - Store responses to reduce backend load
- **Security** - Hide backend server details
- **Rate limiting** - Prevent abuse

**Architecture:**
```
Client → Reverse Proxy (port 80/443) → Backend Server(s)
              ↓
        Handles SSL, caching,
        rate limiting, routing
```

**Code:** See [nginx.conf](nginx.conf) for implementation

---

### 2. Forward Proxy vs Reverse Proxy

**Forward Proxy (Client-side):**
- Sits in front of clients
- Client knows about proxy
- Hides client from destination
- Use case: Bypassing firewalls, anonymity

**Reverse Proxy (Server-side):**
- Sits in front of servers
- Client thinks it's talking to backend
- Hides backend from client
- Use case: Load balancing, SSL, caching

```
Forward Proxy:          Reverse Proxy:
Client → Proxy → Web    Client → Proxy → Backend
   ↑       ↑                ↑       ↑
Client  knows            Client  thinks it's
about proxy              talking to backend
```

---

### 3. Nginx Configuration Structure

Nginx config has a hierarchical structure:

```
Main Context (global settings)
├── Events Context (connection handling)
└── HTTP Context (web server config)
    ├── Upstream (backend definitions)
    └── Server Context (virtual host)
        └── Location Context (routes)
```

**Key files:**
- [nginx.conf](nginx.conf) - Main configuration
- [docker-compose.yml](docker-compose.yml) - Container setup

---

### 4. Rate Limiting

**Purpose:** Protect backend from overload and prevent abuse

**How it works:**
- Define zones with request rates (e.g., 10 requests/second)
- Apply zones to specific routes
- Burst allows temporary spikes
- Excess requests get 429 (Too Many Requests)

**Types of limits:**
- **General** - 100 req/s for standard APIs
- **Strict** - 10 req/s for sensitive data
- **Search** - 5 req/s for expensive operations

**Implementation:** See `limit_req_zone` and `limit_req` directives in [nginx.conf](nginx.conf)

---

### 5. Caching

**Purpose:** Reduce backend load and improve response times

**How it works:**
- First request: Fetches from backend (MISS), stores in cache
- Subsequent requests: Serves from cache (HIT), no backend call
- Cache key determines uniqueness (URL, method, etc.)
- TTL (Time To Live) determines expiration

**Cache statuses:**
- `MISS` - Not in cache, fetched from backend
- `HIT` - Served from cache
- `EXPIRED` - Cache expired, fetched fresh
- `BYPASS` - Cache skipped intentionally

**When to cache:**
- ✅ GET requests with same responses
- ✅ Static data (products, users list)
- ❌ POST/PUT/DELETE (modifies data)
- ❌ User-specific sensitive data

**Implementation:** See `proxy_cache` directives in [nginx.conf](nginx.conf)

---

### 6. Docker for Testing

**Why Docker:**
- Isolated environment (no system changes)
- Easy to reset and test different configs
- Simulates production environment
- Version controlled setup

**Key concepts:**
- **Dockerfile** - How to BUILD an image (recipe)
- **docker-compose.yml** - How to RUN containers (orchestration)
- **Volumes** - Share files between host and container
- **Port mapping** - Expose container ports to host

**We used:**
- Official nginx image (no Dockerfile needed)
- Bun image for backend
- Volume mounts for config files
- Port 8080 on host → 80 in container

**Files:** [docker-compose.yml](docker-compose.yml)

---

### 7. Load Testing

**Purpose:** Find breaking points and measure performance

**Apache Bench (ab):**
```bash
ab -n 1000 -c 10 http://localhost:8080/
# -n: total requests
# -c: concurrent connections
```

**Key metrics:**
- **RPS** (Requests Per Second) - Throughput
- **Latency** - Response time (mean, percentiles)
- **Failed requests** - Errors or rate limiting
- **Non-2xx responses** - HTTP error codes

**Our results (CX23 specs: 2 CPU, 4GB RAM):**
- Static content: ~9,000 RPS
- Cached API: ~9,000 RPS (but rate limited)
- Strict rate limited: ~150 RPS (78% blocked)
- Breaking point: ~1,000-5,000 concurrent connections

**Guide:** See [TESTING.md](TESTING.md)

---

### 8. Scaling Architecture

**Current (single instance):**
- 1 Nginx + 1 Backend
- Handles ~1,000 concurrent users
- Single point of failure

**For 10,000 concurrent users:**
```
Load Balancer (HAProxy/AWS ALB)
    ├── Nginx 1 (2 CPU, 4GB)
    ├── Nginx 2 (2 CPU, 4GB)
    └── Nginx 3 (2 CPU, 4GB)
            └── Backend Cluster (3-5 instances)
                    └── Redis (shared state)
```

**Changes needed:**
1. **Load balancer** - Distributes traffic (Layer 4)
2. **Multiple nginx** - Horizontal scaling
3. **Multiple backends** - Handle more requests
4. **Redis** - Shared rate limiting, sessions, cache
5. **Database pooling** - Manage DB connections

**Why it scales:**
- Load balancer handles 10k+ connections
- Each nginx handles ~1k (3 × 1k = 3k)
- Multiple backends share load
- Redis coordinates state across instances

---

### 9. Nginx vs Caddy vs Coolify

| Feature | Nginx | Caddy | Coolify |
|---------|-------|-------|---------|
| **Type** | Web server/proxy | Web server/proxy | PaaS platform |
| **Config** | Complex, powerful | Simple, automatic | GUI-based |
| **SSL** | Manual setup | Automatic | Automatic |
| **Performance** | Excellent | Good | Good |
| **Learning curve** | Steep | Easy | Easy |
| **Best for** | High traffic, complex rules | Simple setups, auto HTTPS | Self-hosting apps |

**When to use what:**
- **Nginx** - You need maximum performance, complex routing, or have ops experience
- **Caddy** - You want simplicity and automatic HTTPS
- **Coolify** - You want Heroku-like experience for self-hosting

**Coolify uses Caddy** internally for reverse proxy, adds deployment automation, database management, and web UI.

---

### 10. Production Checklist

Before deploying to production:

**Security:**
- [ ] SSL certificates (Let's Encrypt)
- [ ] Rate limiting configured
- [ ] WAF (Web Application Firewall)
- [ ] Hide server version headers
- [ ] Access logs and monitoring

**Reliability:**
- [ ] Health checks
- [ ] Circuit breaker pattern
- [ ] Graceful shutdown handling
- [ ] Backup/failover nginx instances
- [ ] Database connection pooling

**Performance:**
- [ ] Caching strategy
- [ ] Compression (gzip/brotli)
- [ ] HTTP/2 or HTTP/3
- [ ] Resource limits tested
- [ ] Load tested at expected capacity

**Observability:**
- [ ] Centralized logging
- [ ] Metrics (Prometheus/Grafana)
- [ ] Alerting
- [ ] Distributed tracing

---

## File Reference

| File | Purpose |
|------|---------|
| [nginx.conf](nginx.conf) | Main nginx configuration with rate limiting, caching, routing |
| [docker-compose.yml](docker-compose.yml) | Container orchestration with resource limits |
| [backend.ts](backend.ts) | Realistic Bun API with 1000 users, 500 products, 5000 orders |
| [tsconfig.json](tsconfig.json) | TypeScript configuration |
| [README.md](README.md) | Setup and usage instructions |
| [TESTING.md](TESTING.md) | Load testing commands and examples |

---

## Quick Commands

```bash
# Start containers
docker-compose up -d

# View logs
docker-compose logs -f nginx

# Reload config (no restart needed)
docker-compose exec nginx nginx -s reload

# Load test
ab -n 1000 -c 10 http://localhost:8080/api/users

# Check cache headers
curl -s -D - http://localhost:8080/api/users | grep X-Cache

# Stop everything
docker-compose down
```

---

## Key Takeaways

1. **Nginx is a powerful reverse proxy** - Handles SSL, caching, rate limiting, load balancing
2. **Configuration is hierarchical** - Main → Events → HTTP → Server → Location
3. **Rate limiting protects your backend** - Different zones for different endpoints
4. **Caching dramatically improves performance** - But only cache safe, idempotent requests
5. **Docker makes testing easy** - Isolated, reproducible environments
6. **Load testing reveals bottlenecks** - Test early and often
7. **Single instance has limits** - Plan for horizontal scaling beyond ~1,000 concurrent users
8. **Monitoring is essential** - You can't optimize what you don't measure

---

## Resources

- **Nginx docs:** https://nginx.org/en/docs/
- **Docker Compose:** https://docs.docker.com/compose/
- **Apache Bench:** https://httpd.apache.org/docs/2.4/programs/ab.html
- **Bun docs:** https://bun.sh/docs
- **Caddy vs Nginx:** https://caddyserver.com/docs/
- **Coolify:** https://coolify.io/docs/
