import { UIMessage } from 'ai'

const BASE_URL = 'http://localhost:3000'

export async function sendMessage(messages: UIMessage[]): Promise<string> {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Server error ${response.status}: ${text.slice(0, 200)}`)
  }

  const data = await response.json()
  return data.reply
}
