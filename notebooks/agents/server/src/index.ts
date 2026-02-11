import { UIMessage } from 'ai'
import { Hono } from 'hono'
import { oneToolAgent } from './agents/one-tool.agent'

const app = new Hono()

app.post('/chat', async (c) => {
  const { messages } = (await c.req.json()) as {
    messages: UIMessage[]
  }
  const reply = await oneToolAgent(messages)
  return c.json({ reply })
})

export default app
