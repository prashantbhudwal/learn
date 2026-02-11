import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { convertToModelMessages, generateText, streamText, UIMessage } from 'ai'

export async function oneToolAgent(messages: UIMessage[]) {
  const coreMessages = await convertToModelMessages(messages)
  const response = await generateText({
    system: 'You are a helpful assistant.',
    model: google('gemini-2.5-flash'),
    messages: coreMessages,
    tools: {},
  })

  return response.text
}
