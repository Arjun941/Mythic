import {z} from 'genkit';

// Input/output schemas for AI card generation
export const AnalyzeImageGenerateStatsLoreInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo to analyze, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
  apiKey: z.string().optional().describe('The user provided Google AI API key.'),
});
export type AnalyzeImageGenerateStatsLoreInput = z.infer<typeof AnalyzeImageGenerateStatsLoreInputSchema>;

// Enhanced stat structure with icon hints
const StatWithIconSchema = z.object({
  value: z.union([z.number(), z.string()]).describe('The stat value (number 1-100 or string for special stats)'),
  iconHint: z.string().describe('Icon category that best represents this stat visually')
});

export const AnalyzeImageGenerateStatsLoreOutputSchema = z.object({
  name: z.string().describe('A creative and fitting name for the entity in the image.'),
  category: z.enum(['Human', 'Animal', 'Object', 'Food', 'Random']).describe('The category of the entity in the image.'),
  stats: z.record(z.string(), StatWithIconSchema).describe('A collection of four stats for the entity, with creative names, values, and icon hints.'),
  lore: z.string().describe('A detailed and engaging multi-paragraph lore description of the entity in the image, exploring its origins and powers, all based on the visual information in the photo and fitting the category theme. It should be at least 2 sentences long.'),
  rarity: z.enum(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']).describe('The rarity of the card, determined by the overall coolness and uniqueness of the image.'),
});

export type AnalyzeImageGenerateStatsLoreOutput = z.infer<typeof AnalyzeImageGenerateStatsLoreOutputSchema>;
