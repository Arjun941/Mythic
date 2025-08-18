'use server';

/**
 * @fileOverview Lore generation flow for creating narrative descriptions based on card stats.
 *
 * - generateLoreDescription - Function to generate lore descriptions.
 * - GenerateLoreDescriptionInput - Input type for the generateLoreDescription function.
 * - GenerateLoreDescriptionOutput - Output type for the generateLoreDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateLoreDescriptionInputSchema = z.object({
  subject: z.string().describe('The main subject of the card (e.g., a character name, item name).'),
  stats: z.record(z.string(), z.any()).describe('A record of stats for the card, such as attack, defense, and HP.'),
  theme: z.string().describe('The theme of the card (e.g., neon arcade, cartoon jungle).'),
});

export type GenerateLoreDescriptionInput = z.infer<typeof GenerateLoreDescriptionInputSchema>;

const GenerateLoreDescriptionOutputSchema = z.object({
  loreDescription: z.string().describe('A creative lore description for the card.'),
});

export type GenerateLoreDescriptionOutput = z.infer<typeof GenerateLoreDescriptionOutputSchema>;

export async function generateLoreDescription(input: GenerateLoreDescriptionInput): Promise<GenerateLoreDescriptionOutput> {
  return generateLoreDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLoreDescriptionPrompt',
  input: {schema: GenerateLoreDescriptionInputSchema},
  output: {schema: GenerateLoreDescriptionOutputSchema},
  prompt: `You are a creative storyteller who crafts engaging lore descriptions for trading cards.

  Based on the subject, stats, and theme provided, generate a lore description that enhances the card's narrative.

  Subject: {{{subject}}}
  Stats: {{#each stats}}{{{@key}}}: {{{this}}}, {{/each}}
  Theme: {{{theme}}}

  Lore Description:`,
});

const generateLoreDescriptionFlow = ai.defineFlow(
  {
    name: 'generateLoreDescriptionFlow',
    inputSchema: GenerateLoreDescriptionInputSchema,
    outputSchema: GenerateLoreDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
