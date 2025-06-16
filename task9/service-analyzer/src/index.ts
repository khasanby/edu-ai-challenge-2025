import * as readline from 'readline';
import { PromptBuilder } from './promptBuilder';
import { callOpenAI, OpenAIError } from './openaiClient';
import { saveMarkdownReport } from './markdownSaver';

const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';

function printHeader() {
  console.log(`${CYAN}\n🔍 Service Analyzer\n=================${RESET}\n`);
}

function printFooter(filePath: string) {
  console.log(`\n${GREEN}✅ Report generated!${RESET}`);
  console.log(`\nMarkdown report saved to: ${filePath}\n`);
}

function printError(msg: string) {
  console.error(`\n${RED}${msg}${RESET}\n`);
}

async function promptInput(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  printHeader();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  let input = '';
  try {
    // Reprompt until non-empty input
    while (!input.trim()) {
      input = await promptInput(rl, 'Enter a service name or description: ');
      if (!input.trim()) printError('Input cannot be empty. Please try again.');
    }
    console.log('\n⏳ Analyzing service...\n');
    const prompt = PromptBuilder.buildPrompt(input);
    const markdown = await callOpenAI(prompt);
    console.log('\n📊 Service Analysis Report\n========================\n');
    console.log(markdown);
    const filePath = saveMarkdownReport(markdown);
    printFooter(filePath);
  } catch (err) {
    if (err instanceof OpenAIError) {
      printError('OpenAI API error: ' + err.message);
    } else {
      printError('Unexpected error: ' + (err instanceof Error ? err.message : String(err)));
    }
  } finally {
    rl.close();
  }
}

main(); 