# Agents Notebook

AI-powered agents with Hono, Vercel AI SDK, and multiple LLM providers.

## Setup

```bash
cd notebooks/agents
bun install
```

## Environment Variables

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key_here
```

## Running

```bash
# Development with hot reload
bun run dev

# Production
bun start
```

## API Endpoints

### Chat with AI
```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Explain quantum computing in simple terms",
    "provider": "openai",
    "model": "gpt-4o"
  }'
```

### Generate Structured Object
```bash
curl -X POST http://localhost:3000/generate-object \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a user profile with name, age, and interests",
    "provider": "google"
  }'
```

### List Available Models
```bash
curl http://localhost:3000/models
```

## Providers

- **OpenAI**: GPT-4o, GPT-4o Mini, GPT-4 Turbo
- **Google**: Gemini 1.5 Pro, Gemini 1.5 Flash

## Validation

All endpoints use Zod for request validation with TypeScript types.
