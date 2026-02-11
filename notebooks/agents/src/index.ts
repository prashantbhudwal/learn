import { Hono } from 'hono'
import { z } from 'zod'

const app = new Hono()

// Validation schemas
const ChatRequestSchema = z.object({
  message: z.string().min(1),
  provider: z.enum(['openai', 'google']).default('openai'),
  model: z.string().optional()
})

const GenerateObjectSchema = z.object({
  prompt: z.string().min(1),
  provider: z.enum(['openai', 'google']).default('openai')
})

// Dummy AI responses for testing without API keys
async function* dummyStream(message: string) {
  const words = `This is a dummy response to: "${message}". In production, this would stream from OpenAI or Google AI.`.split(' ')
  for (const word of words) {
    await new Promise(resolve => setTimeout(resolve, 50))
    yield word + ' '
  }
}

// Health check endpoint
app.get('/', (c) => {
  return c.json({ 
    status: 'ok', 
    service: 'agents-api',
    version: '0.0.1'
  })
})

// Chat endpoint with streaming (dummy implementation)
app.post('/chat', async (c) => {
  try {
    const body = await c.req.json()
    const { message } = ChatRequestSchema.parse(body)

    // Dummy implementation - no API calls
    const stream = dummyStream(message)
    
    return new Response(
      new ReadableStream({
        async start(controller) {
          for await (const chunk of stream) {
            controller.enqueue(new TextEncoder().encode(chunk))
          }
          controller.close()
        }
      }),
      {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked'
        }
      }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid request', details: error.issues }, 400)
    }
    console.error('Chat error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Generate structured object endpoint (dummy implementation)
app.post('/generate-object', async (c) => {
  try {
    const body = await c.req.json()
    const { prompt, provider } = GenerateObjectSchema.parse(body)

    // Dummy JSON response
    const dummyObject = {
      prompt: prompt,
      provider: provider,
      generated: true,
      timestamp: new Date().toISOString(),
      data: {
        example: "This is a dummy response",
        note: "In production, this would use OpenAI or Google AI"
      }
    }

    return c.json(dummyObject)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid request', details: error.issues }, 400)
    }
    console.error('Generate object error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// List available models
app.get('/models', (c) => {
  return c.json({
    openai: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }
    ],
    google: [
      { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash' }
    ]
  })
})

// Error handler
app.onError((err, c) => {
  console.error('Unhandled error:', err)
  return c.json({ error: 'Internal server error' }, 500)
})

export default app
