import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const plugins = GEMINI_API_KEY
  ? [googleAI({ apiKey: GEMINI_API_KEY })]
  : [];

export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.5-flash',
});
