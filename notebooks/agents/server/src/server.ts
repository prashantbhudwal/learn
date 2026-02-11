import app from './index.js'

const port = process.env.PORT || 3000

console.log(`🤖 Agents API starting on http://localhost:${port}`)

export default {
  port,
  fetch: app.fetch,
}
