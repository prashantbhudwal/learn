interface User {
  id: number
  name: string
  email: string
  createdAt: string
}

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

interface Order {
  id: number
  userId: number
  products: Array<{ productId: number; quantity: number }>
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: string
}

// Simulate database
const users: User[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  createdAt: new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
  ).toISOString(),
}))

const products: Product[] = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 10,
  stock: Math.floor(Math.random() * 100),
}))

const orders: Order[] = Array.from({ length: 5000 }, (_, i) => ({
  id: i + 1,
  userId: Math.floor(Math.random() * 1000) + 1,
  products: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
    productId: Math.floor(Math.random() * 500) + 1,
    quantity: Math.floor(Math.random() * 10) + 1,
  })),
  total: Math.floor(Math.random() * 5000) + 50,
  status: ['pending', 'completed', 'cancelled'][
    Math.floor(Math.random() * 3)
  ] as Order['status'],
  createdAt: new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
  ).toISOString(),
}))

// Simulate database query delay
function simulateQuery(): void {
  const delay = Math.random() * 50 + 10 // 10-60ms delay
  const start = Date.now()
  while (Date.now() - start < delay) {}
}

function getUsers(limit: number = 20, offset: number = 0): User[] {
  simulateQuery()
  return users.slice(offset, offset + limit)
}

function getUserById(id: number): User | undefined {
  simulateQuery()
  return users.find((u) => u.id === id)
}

function getProducts(limit: number = 20, offset: number = 0): Product[] {
  simulateQuery()
  return products.slice(offset, offset + limit)
}

function getProductById(id: number): Product | undefined {
  simulateQuery()
  return products.find((p) => p.id === id)
}

function getOrdersByUser(userId: number): Order[] {
  simulateQuery()
  return orders.filter((o) => o.userId === userId)
}

function getOrderStats(): {
  total: number
  completed: number
  pending: number
  revenue: number
} {
  simulateQuery()
  const completed = orders.filter((o) => o.status === 'completed').length
  const pending = orders.filter((o) => o.status === 'pending').length
  const revenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((sum, o) => sum + o.total, 0)

  return {
    total: orders.length,
    completed,
    pending,
    revenue,
  }
}

function searchProducts(query: string): Product[] {
  simulateQuery()
  const lowerQuery = query.toLowerCase()
  return products
    .filter((p) => p.name.toLowerCase().includes(lowerQuery))
    .slice(0, 20)
}

Bun.serve({
  port: 3001,
  async fetch(req: Request): Promise<Response> {
    const url = new URL(req.url)
    const startTime = Date.now()

    // CORS headers
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'X-Response-Time': '',
    }

    try {
      let response: Response

      // Health check
      if (url.pathname === '/health') {
        response = Response.json({
          status: 'ok',
          timestamp: new Date().toISOString(),
        })
      }

      // GET /api/users - List users (cacheable)
      else if (url.pathname === '/api/users' && req.method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') || '20')
        const offset = parseInt(url.searchParams.get('offset') || '0')
        const result = getUsers(limit, offset)
        response = Response.json({
          users: result,
          total: users.length,
          limit,
          offset,
        })
      }

      // GET /api/users/:id - Get specific user
      else if (
        url.pathname.match(/^\/api\/users\/\d+$/) &&
        req.method === 'GET'
      ) {
        const id = parseInt(url.pathname.split('/').pop()!)
        const user = getUserById(id)
        if (!user) {
          response = Response.json({ error: 'User not found' }, { status: 404 })
        } else {
          response = Response.json({ user })
        }
      }

      // GET /api/products - List products (cacheable)
      else if (url.pathname === '/api/products' && req.method === 'GET') {
        const limit = parseInt(url.searchParams.get('limit') || '20')
        const offset = parseInt(url.searchParams.get('offset') || '0')
        const result = getProducts(limit, offset)
        response = Response.json({
          products: result,
          total: products.length,
          limit,
          offset,
        })
      }

      // GET /api/products/:id - Get specific product
      else if (
        url.pathname.match(/^\/api\/products\/\d+$/) &&
        req.method === 'GET'
      ) {
        const id = parseInt(url.pathname.split('/').pop()!)
        const product = getProductById(id)
        if (!product) {
          response = Response.json(
            { error: 'Product not found' },
            { status: 404 },
          )
        } else {
          response = Response.json({ product })
        }
      }

      // GET /api/products/search - Search products (expensive, no cache)
      else if (
        url.pathname === '/api/products/search' &&
        req.method === 'GET'
      ) {
        const query = url.searchParams.get('q') || ''
        if (!query) {
          response = Response.json(
            { error: 'Query parameter required' },
            { status: 400 },
          )
        } else {
          // Simulate heavier search operation
          const start = Date.now()
          while (Date.now() - start < 100) {} // 100ms delay
          const result = searchProducts(query)
          response = Response.json({
            products: result,
            query,
            count: result.length,
          })
        }
      }

      // GET /api/users/:id/orders - Get user orders (rate limited)
      else if (
        url.pathname.match(/^\/api\/users\/\d+\/orders$/) &&
        req.method === 'GET'
      ) {
        const userId = parseInt(url.pathname.split('/')[3])
        const userOrders = getOrdersByUser(userId)
        response = Response.json({
          userId,
          orders: userOrders,
          count: userOrders.length,
        })
      }

      // GET /api/stats - Dashboard stats (expensive calculation)
      else if (url.pathname === '/api/stats' && req.method === 'GET') {
        // Simulate heavy aggregation
        const start = Date.now()
        while (Date.now() - start < 150) {} // 150ms delay
        const stats = getOrderStats()
        response = Response.json(stats)
      }

      // POST /api/orders - Create order (write operation)
      else if (url.pathname === '/api/orders' && req.method === 'POST') {
        // Simulate write operation
        const start = Date.now()
        while (Date.now() - start < 80) {} // 80ms delay

        const body = await req.json().catch(() => null) as Record<string, unknown> | null
        if (!body || typeof body.userId === 'undefined' || typeof body.products === 'undefined') {
          response = Response.json(
            { error: 'Invalid request body' },
            { status: 400 },
          )
        } else {
          response = Response.json(
            {
              success: true,
              orderId: orders.length + 1,
              message: 'Order created',
            },
            { status: 201 },
          )
        }
      }

      // 404 for unknown routes
      else {
        response = Response.json({ error: 'Not found' }, { status: 404 })
      }

      // Add response time header
      const responseTime = Date.now() - startTime
      response.headers.set('X-Response-Time', `${responseTime}ms`)

      return response
    } catch (error) {
      console.error('Error:', error)
      return Response.json({ error: 'Internal server error' }, { status: 500 })
    }
  },
})

console.log('Realistic API server running on http://localhost:3001')
console.log('Endpoints:')
console.log('  GET  /health                 - Health check')
console.log('  GET  /api/users              - List users (cacheable)')
console.log('  GET  /api/users/:id          - Get user')
console.log('  GET  /api/users/:id/orders   - Get user orders (rate limited)')
console.log('  GET  /api/products           - List products (cacheable)')
console.log('  GET  /api/products/:id       - Get product')
console.log('  GET  /api/products/search    - Search products (slow)')
console.log('  GET  /api/stats              - Dashboard stats (slow)')
console.log('  POST /api/orders             - Create order (write)')
