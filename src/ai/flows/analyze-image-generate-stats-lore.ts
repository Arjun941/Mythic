
'use server';

// Analyzes images and generates card data with stats and lore
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
    AnalyzeImageGenerateStatsLoreInputSchema,
    AnalyzeImageGenerateStatsLoreOutputSchema,
    AnalyzeImageGenerateStatsLoreInput,
    AnalyzeImageGenerateStatsLoreOutput
} from '@/ai/schemas';

const RaritySchema = z.enum(['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']).describe('The rarity of the card, determined by the overall coolness and uniqueness of the image.');

// Define available icon categories for the AI to choose from
const IconHintSchema = z.enum([
    'fire', 'ice', 'lightning', 'heart', 'star', 'shield', 'sword', 'magic', 
    'gem', 'skull', 'rocket', 'camera', 'gamepad', 'music', 'pizza', 'coffee',
    'muscle', 'smile', 'sleep', 'spice', 'bomb', 'eye', 'feather', 'cog',
    'sun', 'moon', 'leaf', 'water', 'mountain', 'fish', 'cat', 'dog', 'utensils'
]).describe('Icon category that best represents this stat visually');

// Enhanced stat object with icon hints
const StatWithIconSchema = z.object({
    value: z.union([z.number(), z.string()]).describe('The stat value (number 1-100 or string for special stats)'),
    iconHint: IconHintSchema.describe('Visual icon category that best represents this stat')
});

const HumanStatsSchema = z.object({
    name: z.string().describe('A creative and fitting name for the entity in the image. Keep it concise - maximum 4 words.'),
    lore: z.string().describe('A detailed and engaging multi-paragraph lore description of the entity in the image, exploring its origins and powers, all based on the visual information in the photo and fitting the category theme. It should be at least 2 sentences long.'),
    stats: z.record(z.string(), StatWithIconSchema).describe('Exactly 4 human-themed stats with creative names and appropriate icon hints. Should include concepts like coolness, skills, personality traits, etc.'),
    category: z.literal('Human').describe("The category of the card, which must be 'Human'"),
    rarity: RaritySchema,
});

const AnimalStatsSchema = z.object({
    name: z.string().describe('A creative and fitting name for the entity in the image. Keep it concise - maximum 4 words.'),
    lore: z.string().describe('A detailed and engaging multi-paragraph lore description of the entity in the image, exploring its origins and powers, all based on the visual information in the photo and fitting the category theme. It should be at least 2 sentences long.'),
    stats: z.record(z.string(), StatWithIconSchema).describe('Exactly 4 animal-themed stats with creative names and appropriate icon hints. Should include concepts like cuteness, energy, abilities, etc.'),
    category: z.literal('Animal').describe("The category of the card, which must be 'Animal'"),
    rarity: RaritySchema,
});

const ObjectStatsSchema = z.object({
    name: z.string().describe('A creative and fitting name for the entity in the image. Keep it concise - maximum 4 words.'),
    lore: z.string().describe('A detailed and engaging multi-paragraph lore description of the entity in the image, exploring its origins and powers, all based on the visual information in the photo and fitting the category theme. It should be at least 2 sentences long.'),
    stats: z.record(z.string(), StatWithIconSchema).describe('Exactly 4 object-themed stats with creative names and appropriate icon hints. Should include concepts like durability, power, utility, etc.'),
    category: z.literal('Object').describe("The category of the card, which must be 'Object'"),
    rarity: RaritySchema,
});

const FoodStatsSchema = z.object({
    name: z.string().describe('A creative and fitting name for the entity in the image. Keep it concise - maximum 4 words.'),
    lore: z.string().describe('A detailed and engaging multi-paragraph lore description of the entity in the image, exploring its origins and powers, all based on the visual information in the photo and fitting the category theme. It should be at least 2 sentences long.'),
    stats: z.record(z.string(), StatWithIconSchema).describe('Exactly 4 food-themed stats with creative names and appropriate icon hints. Should include concepts like flavor, nutrition, appeal, etc.'),
    category: z.literal('Food').describe("The category of the card, which must be 'Food'"),
    rarity: RaritySchema,
});

const RandomStatsSchema = z.object({
    name: z.string().describe('A creative and fitting name for the entity in the image. Keep it concise - maximum 4 words.'),
    lore: z.string().describe('A detailed and engaging multi-paragraph lore description of the entity in the image, exploring its origins and powers, all based on the visual information in the photo and fitting the category theme. It should be at least 2 sentences long.'),
    stats: z.record(z.string(), StatWithIconSchema).describe('Exactly 4 abstract/random stats with creative names and appropriate icon hints. Should include weird, surreal, or meta concepts.'),
    category: z.literal('Random').describe("The category of the card, which must be 'Random'"),
    rarity: RaritySchema,
});

const outputSchema = z.union([
    HumanStatsSchema,
    AnimalStatsSchema,
    ObjectStatsSchema,
    FoodStatsSchema,
    RandomStatsSchema
]);

const analyzeImagePrompt = ai.definePrompt({
    name: 'analyzeImagePrompt',
    input: { schema: AnalyzeImageGenerateStatsLoreInputSchema },
    output: { schema: outputSchema },
    prompt: `You are an expert at analyzing images to create funny, engaging, and creative stats and lore for a card game.
        
Analyze the provided image and determine its category from the following options: 'Human', 'Animal', 'Object', 'Food', 'Random'.

Then, based on the category and a deep analysis of the visual details in the image (like clothing, expression, environment, species, pose, ingredients, etc.), generate exactly 4 creative stats with appropriate values and icon hints.

IMPORTANT: For each stat, you must provide:
1. A creative, unique stat name that relates to the image
2. A value: NUMBERS (1-100) for measurable stats, TEXT only for "Weird Flex" stat
3. An iconHint that best represents the stat visually - EVERY stat MUST have an icon

STAT VALUE RULES:
- Use NUMBERS (1-100) for all stats except "Weird Flex"
- "Weird Flex" can be a funny text description
- NO text descriptions for numerical stats (avoid "Expert Level", "Legendary", etc.)

Each stat must be formatted as:
"Stat Name": {
  "value": 85,
  "iconHint": "muscle"
}

ICON COVERAGE - Choose iconHint values from these categories. EVERY stat must use one of these:

PHYSICAL STATS: muscle, bolt, speed, fist, heart, shield, rocket
COMBAT STATS: sword, bomb, skull, magic, gem, diamond, crystal, star
PERSONALITY STATS: smile, eye, sleep, spice, gamepad, music, camera, art
ABILITIES STATS: feather, cog, gear, sun, moon, flex, default
FOOD STATS: pizza, coffee, utensils, spice, food, drink, hamburger
ANIMAL STATS: cat, dog, fish, spider, heart, muscle
ELEMENTAL STATS: fire, water, ice, lightning, earth, air, leaf, mountain, snow
SPECIAL STATS: gem, star, rocket, bomb, magic, cog, film, palette

MANDATORY: Every stat must have an iconHint from the above list. If unsure, use "default" but prefer specific matches based on the stat concept.
3. An iconHint from this list: fire, ice, lightning, heart, star, shield, sword, magic, gem, skull, rocket, camera, gamepad, music, pizza, coffee, muscle, smile, sleep, spice, bomb, eye, feather, cog, sun, moon, leaf, water, mountain, fish, cat, dog, utensils

Choose icon hints that visually represent the stat concept:
- fire: for explosive, hot, spicy, intense stats
- ice: for cool, calm, frozen stats  
- lightning: for energy, speed, electric stats
- heart: for love, cute, emotional stats
- star: for special, magical, shiny stats
- shield: for defense, protection stats
- sword: for attack, combat, sharp stats
- magic: for mystical, supernatural stats
- gem: for valuable, precious, rare stats
- skull: for dangerous, dark, scary stats
- rocket: for fast, powerful, launching stats
- camera: for visual, photogenic, meme stats
- gamepad: for gaming, fun, playful stats
- music: for sound, rhythm, artistic stats
- pizza/coffee/utensils: for food-related stats
- muscle: for strength, physical stats
- smile: for charisma, happiness stats
- sleep: for rest, lazy, dream stats
- spice: for flavor, excitement stats
- bomb: for explosive, dangerous stats
- eye: for vision, awareness, weird stats
- feather: for light, graceful, flying stats
- cog: for mechanical, intelligence stats
- sun/moon: for light/dark, time stats
- leaf: for nature, growth stats
- water: for fluid, calm stats
- mountain: for solid, enduring stats
- fish/cat/dog: for animal-specific stats

Your output MUST be directly inspired by the visual information and avoid generic clichés at all costs.

Finally, assign a rarity to the card based on the visual characteristics of the image:
- Common: Everyday objects, simple photos, generic selfies
- Uncommon: Interesting compositions, funny pet photos, unique food items
- Rare: High-quality photography, very unusual situations or items, expressive portraits
- Epic: Visually stunning images, perfectly timed photos, highly creative or bizarre concepts
- Legendary: Truly one-of-a-kind, iconic, or artistically exceptional images

Image: {{media url=photoDataUri}}`,
});


// Main Flow
export async function analyzeImageGenerateStatsLore(input: AnalyzeImageGenerateStatsLoreInput): Promise<AnalyzeImageGenerateStatsLoreOutput> {
  return analyzeImageGenerateStatsLoreFlow(input);
}

const analyzeImageGenerateStatsLoreFlow = ai.defineFlow(
  {
    name: 'analyzeImageGenerateStatsLoreFlow',
    inputSchema: AnalyzeImageGenerateStatsLoreInputSchema,
    outputSchema: AnalyzeImageGenerateStatsLoreOutputSchema,
  },
  async (input) => {
    // Determine which API key to use and log it
    const userApiKey = input.apiKey;
    const envApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const apiKeyToUse = userApiKey || envApiKey;
    
    console.log('🚀 Card Generation: Starting image analysis...');
    
    if (userApiKey) {
      console.log('🔑 Card Generation: Using USER-PROVIDED API key');
      console.log(`🔑 Card Generation: User key starts with: ${userApiKey.substring(0, 10)}...`);
    } else if (envApiKey) {
      console.log('🔑 Card Generation: Using ENVIRONMENT API key (fallback)');
      console.log(`🔑 Card Generation: Env key starts with: ${envApiKey.substring(0, 10)}...`);
    } else {
      console.log('❌ Card Generation: NO API KEY AVAILABLE');
      throw new Error('No API key available for card generation');
    }

    const prompt = `You are an expert at analyzing images to create funny, engaging, and creative stats and lore for a card game.
        
Analyze the provided image and determine its category from the following options: 'Human', 'Animal', 'Object', 'Food', 'Random'.

Then, based on the category and a deep analysis of the visual details in the image (like clothing, expression, environment, species, pose, ingredients, etc.), generate the required content. Your output MUST be directly inspired by the visual information and avoid generic clichés at all costs. 

IMPORTANT: Keep names SHORT! Maximum 4 words (like "Sir Floofington the First" or "Captain Thunder Cat"). Long names break the card layout.

You must output ONLY a valid JSON object with this exact structure:
{
  "category": "one of: Human, Animal, Object, Food, Random",
  "name": "the card name (MAX 4 WORDS!)",
  "lore": "the card lore",
  "rarity": "one of: Common, Uncommon, Rare, Epic, Legendary",
  "stats": {
    "Physical Strength": {
      "value": 75,
      "iconHint": "muscle"
    },
    "Battle Experience": {
      "value": 92,
      "iconHint": "sword"
    },
    "Social Charisma": {
      "value": 68,
      "iconHint": "smile"
    },
    "Weird Flex": {
      "value": "Can solve a Rubik's cube blindfolded",
      "iconHint": "gamepad"
    }
  }
}

CRITICAL RULES:
- ALL stats except "Weird Flex" must have NUMBER values (1-100)
- EVERY stat must have a valid iconHint from the provided list
- Generate exactly 4 stats total (including Weird Flex)
- Keep stat names creative but clear

- For 'Human': Generate a funny nickname (MAX 4 WORDS). The 'Weird Flex' must be a unique, funny, and unexpected fact. The lore should be an over-the-top, two-sentence backstory.
- For 'Animal': Create a silly but heroic title (MAX 4 WORDS). The 'Weird Flex' must be a unique, funny, and unexpected fact. The lore should be a ridiculous, two-sentence evolutionary claim with meta-humor.
- For 'Object': Give an epic, meta-aware title to the mundane object (MAX 4 WORDS). The lore should be a mythic, two-sentence origin story referencing internet culture.
- For 'Food': Assign a dramatic, pop-culture-inspired battle name (MAX 4 WORDS). The lore should be a legendary, two-sentence tale about its consumption.
- For 'Random': The content must be abstract and reality-bending. The name should be a random, absurd phrase (MAX 4 WORDS), and the lore should be an unhinged statement about simulation theory or glitches.

Finally, assign a rarity to the card based on the visual characteristics of the image. Be consistent for similar types of images.
- Common: Everyday objects, simple photos, generic selfies.
- Uncommon: Interesting compositions, funny pet photos, unique food items.
- Rare: High-quality photography, very unusual situations or items, expressive portraits.
- Epic: Visually stunning images, perfectly timed photos, highly creative or bizarre concepts.
- Legendary: Truly one-of-a-kind, iconic, or artistically exceptional images that are extremely rare to come across.
Base your decision on factors like image quality, composition, subject matter uniqueness, and emotional impact.

Return ONLY the JSON object, no additional text or formatting.`;

    const { text } = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: [
        { text: prompt },
        { media: { url: input.photoDataUri } }
      ],
      config: {
        apiKey: apiKeyToUse,
        temperature: 0.8,
      },
    });

    if (!text) {
      throw new Error('Could not generate card data.');
    }
    
    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Parse the JSON response
    let parsedOutput;
    try {
      parsedOutput = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ Card Generation: Failed to parse JSON response:', parseError);
      console.log('Raw text response:', text);
      console.log('Cleaned text:', cleanedText);
      throw new Error('Failed to parse generated card data as JSON');
    }
    
    // Validate the output matches our expected schema
    try {
      const validatedOutput = AnalyzeImageGenerateStatsLoreOutputSchema.parse(parsedOutput);
      console.log('✅ Card Generation: Successfully generated card data');
      return validatedOutput;
    } catch (validationError) {
      console.error('❌ Card Generation: Output validation failed:', validationError);
      console.log('Raw output:', parsedOutput);
      throw new Error('Generated card data does not match expected format');
    }
  }
);
