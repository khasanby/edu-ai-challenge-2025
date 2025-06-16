import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Custom error class for API-related errors
export class OpenAIError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'OpenAIError';
  }
}

// Validate API key
function validateApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new OpenAIError('OpenAI API key is not set in environment variables');
  }
  if (!apiKey.startsWith('sk-')) {
    throw new OpenAIError('Invalid OpenAI API key format');
  }
  return apiKey;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: validateApiKey(),
});

export async function callOpenAI(prompt: string): Promise<string> {
  try {
    // Make API call
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4.1-mini",
      temperature: 0.7,
      max_tokens: 2000,
    });

    // Extract and validate response
    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new OpenAIError('No response received from OpenAI');
    }

    return response;

  } catch (error) {
    // Handle specific OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API Error:', error.message);
      throw new OpenAIError(
        'Failed to communicate with OpenAI API',
        error
      );
    }

    // Handle network errors
    if (error instanceof Error) {
      console.error('Network Error:', error.message);
      throw new OpenAIError(
        'Failed to connect to OpenAI API',
        error
      );
    }

    // Handle unknown errors
    console.error('Unexpected error:', error);
    throw new OpenAIError(
      'An unexpected error occurred while calling OpenAI API',
      error
    );
  }
} 