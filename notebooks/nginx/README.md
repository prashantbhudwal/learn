# Nginx Learning with Docker

Learn Nginx locally using Docker - no system installation needed.

## Quick Start

```bash
# 1. Start nginx with default config
docker run -d -p 8080:80 --name nginx-learn nginx

# 2. Test it
curl http://localhost:8080

# 3. Stop and remove
docker stop nginx-learn && docker rm nginx-learn
```

## Project Structure

```
notebooks/nginx/
├── docker-compose.yml      # Easy startup
├── nginx.conf              # Main nginx config
├── html/                   # Static files
│   └── index.html
└── README.md              # This file
```

## Using Docker Compose (Recommended)

```bash
# Start nginx
docker-compose up -d

# View logs
docker-compose logs -f

# Reload config without restarting
docker-compose exec nginx nginx -s reload

# Stop
docker-compose down
```

## Learning Path

1. **Static file server** - Serve HTML/CSS/JS
2. **Reverse proxy** - Forward to your Bun backend
3. **Load balancing** - Multiple backends
4. **SSL/HTTPS** - Self-signed certificates
5. **Caching** - Cache responses
6. **Rate limiting** - Limit requests

## Common Commands

```bash
# Test nginx config
docker-compose exec nginx nginx -t

# Enter container shell
docker-compose exec nginx sh

# View nginx version
docker-compose exec nginx nginx -v

# Check running config
docker-compose exec nginx cat /etc/nginx/nginx.conf
```

## Config Hot-Reload

Edit `nginx.conf`, then:
```bash
docker-compose exec nginx nginx -s reload
```

No restart needed!
