Bun.serve({
  port: 3001,
  fetch(req) {
    const url = new URL(req.url)
    
    if (url.pathname === '/') {
      return new Response('Hello from backend!')
    }
    
    if (url.pathname === '/api/data') {
      return Response.json({ message: 'Data from backend' })
    }
    
    return new Response('Not Found', { status: 404 })
  },
})

console.log('Backend: http://localhost:3001')
