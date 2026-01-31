import { intro, outro, select } from '@clack/prompts';
import color from 'picocolors';

async function main() {
  console.clear();
  intro(color.bgCyan(color.black(' OpenQuiz ')));

  const action = await select({
    message: 'What would you like to do?',
    options: [
      { value: 'start', label: 'Start Quiz' },
      { value: 'create', label: 'Create Quiz' },
      { value: 'exit', label: 'Exit' },
    ],
  });

  if (action === 'start') {
    console.log(color.green('Starting quiz... (placeholder)'));
  } else if (action === 'create') {
    console.log(color.blue('Creating quiz... (placeholder)'));
  }

  outro('Thanks for playing!');
}

main().catch(console.error);
