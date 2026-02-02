# Nginx Testing Guide

## Setup

```bash
# Start containers
docker-compose up -d

# Check nginx config
docker-compose exec nginx nginx -t
```

## Test Rate Limiting (/api/users)

```bash
# Install wrk
brew install wrk

# Test rate limiting - should see some 429s
wrk -t4 -c50 -d10s http://localhost:8080/api/users

# Or with hey
hey -n 100 -c 20 http://localhost:8080/api/users
```

**What to look for:**
- First requests succeed (200)
- After 10 req/sec, get 429 (Too Many Requests)
- Check headers: `X-RateLimit-Limit: 10`

## Test Caching (/api/data)

```bash
# First request - cache miss
# Second request - cache hit (faster)
for i in {1..5}; do
  curl -s -w "\nTime: %{time_total}s\n" http://localhost:8080/api/data
done
```

**What to look for:**
- `X-Cache-Status: MISS` on first request
- `X-Cache-Status: HIT` on subsequent requests
- Response time drops significantly

## View Logs

```bash
# Real-time logs
docker-compose logs -f nginx

# Check cache directory
docker-compose exec nginx ls -la /var/cache/nginx
```

## Resource Limits

Container limited to:
- 1 CPU core
- 512MB RAM

Monitor with:
```bash
docker stats nginx-nginx-1
```
