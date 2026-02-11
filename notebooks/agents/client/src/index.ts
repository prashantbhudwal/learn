import * as readline from 'node:readline'
import { sendMessage } from './client.js'
import { UIMessage } from 'ai'

// Track the interface globally so we can close it on HMR
declare global {
  var __rl: readline.Interface | undefined
}

// Close old interface if it exists (HMR cleanup)
if (globalThis.__rl) {
  globalThis.__rl.close()
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Store reference for next HMR reload
globalThis.__rl = rl

// Close on exit
process.on('SIGINT', () => {
  rl.close()
  process.exit(0)
})

function ask(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer))
  })
}

async function main() {
  console.log('🤖 Simple Chat\n')

  const messages: UIMessage[] = []

  while (true) {
    const input = await ask('Your message: ')

    if (!input.trim()) break
    messages.push({
      role: 'user',
      id: crypto.randomUUID(),
      parts: [{ type: 'text', text: input }],
    })

    try {
      const reply = await sendMessage(messages)
      messages.push({
        role: 'assistant',
        id: crypto.randomUUID(),
        parts: [{ type: 'text', text: reply }],
      })
      console.log(`Assistant: ${reply}\n`)
    } catch (err) {
      console.error('Error:', err instanceof Error ? err.message : String(err))
      // Remove the user message since we didn't get a reply
      messages.pop()
    }
  }

  console.log('\nGoodbye! 👋')
  rl.close()
}

main()
