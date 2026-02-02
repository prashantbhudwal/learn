const BACKEND_URL = 'http://localhost:3001'
const PROXY_PORT = 3000

Bun.serve({
  port: PROXY_PORT,
  async fetch(req) {
    const url = new URL(req.url)
    const targetUrl = new URL(url.pathname + url.search, BACKEND_URL)
    
    return await fetch(targetUrl.toString(), {
      method: req.method,
      headers: req.headers,
      body: req.body,
    })
  },
})

console.log(`Proxy: http://localhost:${PROXY_PORT} → ${BACKEND_URL}`)
