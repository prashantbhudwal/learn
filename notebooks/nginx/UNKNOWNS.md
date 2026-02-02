# Unknown Unknowns: What We Didn't Cover

This document captures important nginx and infrastructure concepts we didn't explore in the main learning notebook. These are the gaps between "knowing what you know" and "knowing what you don't know."

---

## 1. Security (Critical Priority)

### SSL/TLS Configuration

**What it is:** Encrypting traffic between client and nginx using HTTPS.

**Why we skipped it:** Docker setup with self-signed certificates is complex for beginners.

**Why it matters:**
- Without HTTPS, passwords and data travel in plain text
- Browsers mark HTTP sites as "Not Secure"
- Required for HTTP/2 and modern web features

**What you need to learn:**
- Let's Encrypt (free SSL certificates)
- Certificate renewal automation
- HTTP to HTTPS redirects
- TLS versions and cipher suites
- HSTS (HTTP Strict Transport Security)

**Example configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name api.example.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;
    
    # HSTS - force HTTPS for 1 year
    add_header Strict-Transport-Security "max-age=31536000" always;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.example.com;
    return 301 https://$server_name$request_uri;
}
```

**Real-world scenario:**
A fintech startup launched without HTTPS. Within a week, attackers intercepted login credentials on public WiFi. The company faced regulatory fines and lost customer trust.

---

### Security Headers

**What they are:** HTTP headers that tell browsers how to handle your content securely.

**Why they matter:** Prevent XSS, clickjacking, MIME-type sniffing attacks.

**Critical headers:**

```nginx
# Prevent clickjacking (embedding your site in iframe)
add_header X-Frame-Options "SAMEORIGIN" always;

# Prevent MIME-type sniffing
add_header X-Content-Type-Options "nosniff" always;

# XSS Protection
add_header X-XSS-Protection "1; mode=block" always;

# Content Security Policy (CSP)
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;

# Referrer Policy
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

**What happens without them:**
- Competitor embeds your pricing page in iframe and undercuts you
- Attacker uploads file with `.jpg` extension but JavaScript content
- XSS vulnerability allows session hijacking

---

### Web Application Firewall (WAF)

**What it is:** Filters and monitors HTTP traffic for attacks.

**Why we skipped it:** Requires ModSecurity or commercial solution (complex setup).

**What it blocks:**
- SQL injection attempts
- Cross-site scripting (XSS)
- Path traversal attacks
- Bot traffic
- DDoS patterns

**Example attacks it prevents:**
```
GET /api/users?id=1 OR 1=1 --           ← SQL injection
GET /api/users/<script>alert(1)</script> ← XSS
GET /../../../etc/passwd               ← Path traversal
```

**Real-world impact:**
Without WAF, a simple SQL injection in search box exposed 50 million user records at a major retailer.

---

## 2. Timeouts & Buffers

### Connection Timeouts

**What they are:** How long nginx waits for various operations.

**Why we skipped it:** Used defaults which work for simple cases.

**Why they matter:**
- Too short: Requests fail prematurely
- Too long: Resources tied up, slow clients cause DoS

**Key timeout directives:**

```nginx
# How long to wait for backend connection
proxy_connect_timeout 5s;

# How long to wait for backend response
proxy_read_timeout 60s;

# How long to wait for client to send request
proxy_send_timeout 60s;

# How long to keep connection open
keepalive_timeout 65s;

# Client body timeout (file uploads)
client_body_timeout 30s;

# Client header timeout
client_header_timeout 10s;
```

**Real-world scenario:**

An e-commerce site had default 60s proxy_read_timeout. During Black Friday, slow database queries piled up. Each request held a connection for 60s. With 1000 concurrent users, all connections exhausted. Site went down for 2 hours.

**Solution:**
```nginx
# Shorter timeout for most requests
proxy_read_timeout 10s;

# Longer timeout for specific slow endpoints
location /api/reports {
    proxy_read_timeout 300s;
}
```

---

### Buffer Configuration

**What they are:** Memory areas for storing request/response data.

**Why they matter:**
- Too small: Can't handle large uploads/downloads
- Too large: Waste memory, potential DoS

**Key buffer directives:**

```nginx
# Buffer size for reading client request header
client_header_buffer_size 1k;

# Maximum number and size of buffers for client headers
large_client_header_buffers 4 8k;

# Buffer size for reading backend response
proxy_buffer_size 4k;

# Number and size of buffers for backend response
proxy_buffers 8 4k;

# Buffer size for temporary files
proxy_temp_file_write_size 64k;

# Max body size (file uploads)
client_max_body_size 10m;
```

**When to tune:**
- File uploads failing → Increase `client_max_body_size`
- Large JSON responses → Increase `proxy_buffers`
- Memory issues → Decrease buffer sizes

---

## 3. Health Checks & Failover

### Active Health Checks

**What they are:** Nginx periodically pings backends to check if they're alive.

**Why we skipped it:** Requires nginx Plus (commercial) or third-party modules.

**Why it matters:** Without health checks, nginx sends traffic to dead backends.

**How it works:**
```nginx
upstream backend {
    server app1:3000;
    server app2:3000;
    server app3:3000;
    
    # Check /health every 5s, mark down after 3 failures
    # (Requires nginx Plus or third-party module)
}
```

**Open source alternatives:**
- **HAProxy** - Has built-in health checks
- **Envoy** - Advanced health checking
- **Consul** - Service discovery with health checks

**Real-world scenario:**

A deployment updated backend from v1.2 to v1.3, but v1.3 had a bug and crashed. Nginx kept sending 33% of traffic to the crashed instance. Users saw 502 errors for 10 minutes until manual intervention.

**With health checks:**
Nginx would detect the failure in 15 seconds and stop sending traffic to the bad instance.

---

### Passive Health Checks

**What they are:** Nginx monitors responses and marks backends as failed after errors.

**What we configured:**
```nginx
upstream backend {
    server app1:3000 max_fails=3 fail_timeout=30s;
    server app2:3000 max_fails=3 fail_timeout=30s;
}
```

**How it works:**
- After 3 failed requests in 30 seconds, mark backend as "down"
- Don't send traffic for 30 seconds
- Try again after timeout

**Limitation:** Only works for connection errors, not slow responses or 500 errors.

---

### Circuit Breaker Pattern

**What it is:** Stop sending requests to failing backend for a period.

**Why we skipped it:** Requires application-level implementation or advanced proxy.

**How it works:**
```
Normal:     Request → Backend
Failing:    Request → Backend (fails)
            Request → Backend (fails)
            Request → Backend (fails)
Open:       Request → Fast fail (don't bother backend)
            ... wait 30s ...
Half-open:  Request → Backend (test if recovered)
Normal:     Request → Backend (if test succeeded)
```

**Why it matters:** Prevents cascade failures. If database is slow, don't overwhelm it with more requests.

**Implementation:**
- **Application level:** Use libraries like `opossum` (Node.js)
- **Service mesh:** Istio/Linkerd handle this automatically
- **API Gateway:** Kong, Ambassador have circuit breaker features

---

## 4. WebSockets & Real-Time Connections

### WebSocket Proxying

**What they are:** Persistent two-way connections between client and server.

**Why we skipped it:** Requires special header handling.

**Why it matters:** Used for:
- Chat applications
- Live updates (stocks, sports scores)
- Collaborative editing
- Gaming

**The problem:**
WebSockets use `Upgrade: websocket` header. Default nginx config strips this.

**Solution:**
```nginx
location /ws {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    
    # Longer timeouts for persistent connections
    proxy_read_timeout 86400s;
    proxy_send_timeout 86400s;
}
```

**Real-world scenario:**

A trading platform used WebSockets for live price updates. Nginx config didn't handle the Upgrade header. Connections kept dropping every 30 seconds. Traders missed critical price movements.

---

### Server-Sent Events (SSE)

**What they are:** One-way server-to-client streaming over HTTP.

**Use case:** Live notifications, progress bars, logs streaming.

**Configuration:**
```nginx
location /events {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_buffering off;  # Important: disable buffering for SSE
    proxy_cache off;      # Don't cache streaming responses
    
    # Disable compression for streaming
    gzip off;
}
```

**Key point:** `proxy_buffering off` - Send data immediately, don't wait for buffer to fill.

---

## 5. Distributed Rate Limiting

### The Problem

**What we built:** Per-instance rate limiting

**The issue:** With 3 nginx servers:
- Each allows 100 req/s
- Total: 300 req/s (not 100)
- Attacker can hit 300 req/s by rotating between servers

**Real-world scenario:**

API allows 100 req/minute per API key. Company scales to 3 nginx instances. Attacker discovers they can make 300 req/minute by load balancing their requests. Rate limit bypassed.

---

### Solutions

**Option 1: Redis-based rate limiting**
```lua
# Using nginx + Lua + Redis
local redis = require "resty.redis"
local red = redis:new()

local key = "rate_limit:" .. ngx.var.binary_remote_addr
local current = red:incr(key)
red:expire(key, 60)

if current > 100 then
    ngx.exit(429)
end
```

**Option 2: API Gateway**
- Kong, Ambassador, Traefik
- Built-in distributed rate limiting
- Stores counters in Redis/database

**Option 3: Application-level**
```typescript
// Backend checks Redis
const key = `rate_limit:${api_key}`
const current = await redis.incr(key)
await redis.expire(key, 60)

if (current > 100) {
    return new Response('Too Many Requests', { status: 429 })
}
```

**Trade-offs:**
- Redis adds latency (~1-5ms)
- Adds complexity
- Single point of failure (unless Redis cluster)

---

## 6. Cache Invalidation

### The Problem

**What we configured:** Cache with TTL (Time To Live)

**The issue:**
- User updates their profile
- Cache still shows old data for 5 minutes
- User sees stale information

**Real-world scenario:**

E-commerce site caches product prices for 1 hour. Admin updates price from $100 to $80. Customers still see $100 for up to 1 hour. Some customers charged wrong price. Support nightmare.

---

### Solutions

**Option 1: Shorter TTLs**
```nginx
proxy_cache_valid 200 1m;  # Cache for 1 minute instead of 5
```
**Trade-off:** More backend load

**Option 2: Cache purge API**
```bash
# When data changes, purge specific URL
curl -X PURGE http://nginx/api/products/123
```

**Nginx config:**
```nginx
location ~ /purge(/.*) {
    allow 10.0.0.0/8;  # Only internal IPs
    deny all;
    proxy_cache_purge api_cache $1;
}
```

**Option 3: Cache tags (keys)**
```nginx
proxy_cache_key "$scheme$request_method$host$request_uri";
proxy_cache_valid 200 5m;

# Purge by pattern
curl -X PURGE http://nginx/purge/api/products/*
```

**Option 4: Event-driven invalidation**
- Database publishes change event
- Cache listens and invalidates automatically
- Requires message queue (Redis Pub/Sub, RabbitMQ)

---

## 7. Observability

### Structured Logging

**What we have:** Plain text logs
```
192.168.1.1 - - [02/Feb/2026:17:30:29 +0000] "GET /api/users HTTP/1.1" 200 47
```

**What we need:** JSON logs for parsing
```json
{
  "timestamp": "2026-02-02T17:30:29Z",
  "client_ip": "192.168.1.1",
  "method": "GET",
  "path": "/api/users",
  "status": 200,
  "response_time": 0.045,
  "cache_status": "HIT",
  "user_agent": "Mozilla/5.0..."
}
```

**Why it matters:**
- Plain text: Hard to query, filter, aggregate
- JSON: Easy to search in ELK, Datadog, Splunk

---

### Request Tracing

**What it is:** Following a request through multiple services.

**The problem:**
```
Client → Nginx → Backend → Database
        ↑_________________|
              Where did it slow down?
```

**Solution:** Request ID
```nginx
# Generate unique request ID
add_header X-Request-ID $request_id always;
proxy_set_header X-Request-ID $request_id;
```

**Logs:**
```
Nginx:  request_id=abc123 duration=45ms
Backend: request_id=abc123 db_query=30ms
Database: request_id=abc123 query_time=25ms
```

**Result:** We can see the 45ms was spent: 25ms in DB, 5ms backend processing, 15ms network.

---

### Metrics & Alerting

**What we need:**
- Request rate (RPS)
- Error rate (5xx percentage)
- Latency percentiles (p50, p95, p99)
- Cache hit ratio
- Rate limiting events

**Tools:**
- **Prometheus** - Collects metrics
- **Grafana** - Visualizes dashboards
- **AlertManager** - Sends alerts

**Example alert:**
```yaml
# Alert if error rate > 1% for 5 minutes
- alert: HighErrorRate
  expr: rate(nginx_http_requests_total{status=~"5.."}[5m]) > 0.01
  for: 5m
  annotations:
    summary: "High error rate detected"
```

**Real-world scenario:**

Without monitoring, a database slowdown caused 50% of requests to fail. Engineers didn't know for 3 hours (no one checking logs). With alerting, would have been caught in 5 minutes.

---

## 8. Zero-Downtime Deployments

### The Problem

**What happens now:**
```bash
docker-compose restart nginx
# All active connections dropped!
```

**Impact:** Users see errors during deployment.

---

### Solutions

**Option 1: Graceful reload**
```bash
# New nginx process starts, old process finishes active requests
nginx -s reload
```

**What we did:** Used `docker-compose restart` which kills container.

**Better approach:**
```bash
docker-compose exec nginx nginx -s reload
```

**Limitation:** Still drops WebSocket connections.

---

**Option 2: Blue-Green Deployment**

```
Current:                    During deploy:

Users → Load Balancer      Users → Load Balancer
            ↓                          ↓
       Blue (active)              Green (active)
       (v1.2)                     (v1.3)
                                   Blue (draining)
```

**Process:**
1. Deploy v1.3 to Green environment
2. Health check passes
3. Load balancer switches traffic to Green
4. Blue drains connections (finishes active requests)
5. Blue shuts down

**Benefits:**
- Zero downtime
- Instant rollback (switch back to Blue)
- Test in production (send 1% traffic first)

---

**Option 3: Canary Deployment**

```
100% traffic → 95% v1.2 + 5% v1.3
             ↓
       50% v1.2 + 50% v1.3
             ↓
       0% v1.2 + 100% v1.3
```

**Process:**
1. Deploy v1.3 to 1 server
2. Send 5% traffic to v1.3
3. Monitor error rates, latency
4. If good, increase to 50%, then 100%
5. If bad, rollback to 0%

**Tools:**
- Kubernetes (native support)
- AWS ALB (weighted target groups)
- Istio (traffic splitting)

---

## 9. HTTP/2 and HTTP/3

### HTTP/2

**What it is:** Major revision of HTTP/1.1

**Benefits:**
- **Multiplexing** - Multiple requests over single connection
- **Header compression** - Reduces overhead
- **Server push** - Send resources before client asks

**HTTP/1.1 problem:**
```
Connection 1: GET /index.html
Connection 2: GET /style.css
Connection 3: GET /script.js
Connection 4: GET /image.png
# 4 connections needed!
```

**HTTP/2 solution:**
```
Connection 1: GET /index.html + GET /style.css + GET /script.js + GET /image.png
# 1 connection, all multiplexed!
```

**Configuration:**
```nginx
server {
    listen 443 ssl http2;
    
    # Requires SSL (HTTP/2 only works over HTTPS in browsers)
    ssl_certificate ...;
    ssl_certificate_key ...;
}
```

**Performance impact:** 10-50% faster page loads.

---

### HTTP/3

**What it is:** HTTP over QUIC (UDP instead of TCP)

**Benefits:**
- **Faster connection establishment** - 0-RTT vs 3-way handshake
- **Better mobile performance** - Handles network switching
- **No head-of-line blocking** - One slow request doesn't block others

**Configuration:**
```nginx
server {
    listen 443 quic reuseport;
    listen 443 ssl;
    
    ssl_certificate ...;
    ssl_certificate_key ...;
    
    # Enable 0-RTT
    ssl_early_data on;
    
    add_header Alt-Svc 'h3=":443"; ma=86400' always;
}
```

**Status:** Still emerging, but supported by Cloudflare, Google, Facebook.

---

## 10. Advanced Patterns

### API Gateway vs Reverse Proxy

**Reverse Proxy (what we built):**
- Routes traffic
- SSL termination
- Basic rate limiting
- Caching

**API Gateway (what enterprises use):**
- Everything reverse proxy does PLUS:
- Authentication/Authorization (JWT, OAuth)
- Request/response transformation
- API versioning (/v1/, /v2/)
- Analytics and monetization
- Developer portal

**Examples:** Kong, AWS API Gateway, Azure API Management

**When to upgrade:**
- Multiple teams managing APIs
- Need API keys for external developers
- Complex auth requirements
- API monetization

---

### CDN (Content Delivery Network)

**What it is:** Caches content at edge locations worldwide.

**How it works:**
```
User in Tokyo → Cloudflare Tokyo POP → Your server (if not cached)
User in London → Cloudflare London POP → Cache hit (fast!)
```

**Benefits:**
- **Latency** - Serve from nearest location
- **Bandwidth savings** - 80-90% cache hit ratio
- **DDoS protection** - Absorbs attacks
- **SSL** - Free certificates

**Providers:** Cloudflare, Fastly, AWS CloudFront, Akamai

**Configuration:**
```
1. Point DNS to CDN
2. CDN fetches from your nginx
3. CDN caches responses
4. Users hit CDN, not your server
```

**Real-world impact:**
Global e-commerce site reduced load time from 2s to 200ms by adding Cloudflare.

---

### Service Mesh

**What it is:** Sidecar proxies for every service in your architecture.

**Traditional:**
```
Service A → Nginx → Service B
```

**Service Mesh (Istio/Linkerd):**
```
Service A → Sidecar A → Sidecar B → Service B
                ↓           ↓
            mTLS, metrics, retry, circuit breaker
```

**Benefits:**
- **mTLS** - Automatic encryption between services
- **Observability** - See all traffic between services
- **Traffic management** - Canary, A/B testing
- **Resilience** - Retry, timeout, circuit breaker

**When to use:**
- 10+ microservices
- Complex service-to-service communication
- Need zero-trust security
- Platform team managing infrastructure

**Trade-off:** Adds complexity, latency (~1-3ms).

---

## Summary: Priority Learning Path

### Before Production (Must Know)
1. **SSL/TLS** - HTTPS is non-negotiable
2. **Security Headers** - Prevent common attacks
3. **Timeouts** - Prevent resource exhaustion
4. **Health Checks** - Don't send traffic to dead backends
5. **Logging** - You can't debug what you can't see

### For Scale (Should Know)
6. **Distributed Rate Limiting** - When you have multiple nginx instances
7. **Cache Invalidation** - When data changes frequently
8. **Zero-Downtime Deployments** - Update without dropping connections
9. **HTTP/2** - Free performance boost

### For Advanced Use (Nice to Know)
10. **WebSockets** - Real-time applications
11. **Service Mesh** - Microservices at scale
12. **CDN** - Global performance

---

## Resources for Further Learning

**Security:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Mozilla SSL Config: https://ssl-config.mozilla.org/

**Performance:**
- Nginx tuning: https://www.nginx.com/blog/tuning-nginx/
- High Performance Browser Networking (book)

**Observability:**
- Prometheus: https://prometheus.io/docs/
- Grafana: https://grafana.com/docs/
- Distributed Tracing: https://opentelemetry.io/

**Advanced Patterns:**
- Kubernetes: https://kubernetes.io/docs/
- Istio: https://istio.io/latest/docs/
- Cloudflare Learning Center: https://www.cloudflare.com/learning/

---

## Final Thoughts

The notebook covered the fundamentals - enough to build and test a working nginx setup. These "unknown unknowns" represent the gap between "learning nginx" and "running nginx in production at scale."

**The progression:**
1. **Learn fundamentals** (what we did)
2. **Add security** (SSL, headers, WAF)
3. **Add reliability** (health checks, circuit breakers)
4. **Add observability** (logging, metrics, tracing)
5. **Scale horizontally** (load balancers, multiple instances)
6. **Optimize** (HTTP/2, CDN, caching strategies)

Each step adds complexity but also resilience and performance. Start with step 1, add step 2 before production, and gradually incorporate the rest as you grow.
