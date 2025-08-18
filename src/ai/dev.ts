import { config } from 'dotenv';
config();

import '@/ai/schemas.ts';
import '@/ai/flows/generate-lore-description.ts';
import '@/ai/flows/analyze-image-generate-stats-lore.ts';
import '@/ai/flows/validate-api-key.ts';
