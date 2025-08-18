import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI({ apiKey: false })], // Disable auto API key detection
  model: 'googleai/gemini-2.0-flash',
});
