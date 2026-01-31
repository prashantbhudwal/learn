import * as prompts from '@clack/prompts'
import { generateText } from 'ai'

import { google } from '@ai-sdk/google'

export async function generate(input: string) {
  const { text } = await generateText({
    model: google('gemini-3-flash-preview'),
    prompt: input,
    // messages: [],
  })
  return text
}

interface MarkdownRenderer {
  render(text: string, options: {
    heading: (children: string) => string
    paragraph: (children: string) => string
    strong: (children: string) => string
  }): string
}

declare const Bun: {
  markdown?: MarkdownRenderer
}

function renderMarkdown(text: string): string {
  if (!Bun.markdown) return text
  return Bun.markdown.render(text, {
    heading: (children: string) => `\n\x1b[1;4m${children}\x1b[0m\n`,
    paragraph: (children: string) => children + '\n',
    strong: (children: string) => `\x1b[1m${children}\x1b[22m`,
  })
}

while (true) {
  const input = await prompts.text({
    message: 'ask anything...',
  })

  if (prompts.isCancel(input)) {
    break
  }

  const response = await generate(input.toString())

  console.log(renderMarkdown(response))
  // prompts.note(response)
}
