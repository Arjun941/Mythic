import { 
  FaSmile, FaHands, FaHeart, FaAtom, FaBed, 
  FaHamburger, FaShieldAlt, FaMagic, FaBomb, FaEye, FaFire,
  FaCoffee, FaGem, FaBolt, FaSkull, FaRocket, FaStar, FaCog,
  FaGamepad, FaMusic, FaPalette, FaFeatherAlt, FaSnowflake,
  FaSun, FaMoon, FaLeaf, FaWater, FaMountain, FaFish, FaCat,
  FaDog, FaSpider, FaCamera, FaFilm, FaUtensils
} from 'react-icons/fa';
import { 
  GiCoolSpices, GiMuscleUp, GiNightSleep, GiChiliPepper,
  GiDiamonds, GiLightningBow, GiFireBowl, GiIceCube,
  GiWindsock, GiEarthAmerica, GiDroplets, GiMountains,
  GiSwordClash, GiPizzaSlice, GiFlexibleLamp, GiFist
} from 'react-icons/gi';
import { HelpCircle } from 'lucide-react';

// Map icon hints to actual React icon components
export const iconHintToComponent: Record<string, React.ElementType> = {
  // Basic elements
  'fire': GiFireBowl,
  'ice': GiIceCube,
  'lightning': GiLightningBow,
  'water': GiDroplets,
  'earth': GiEarthAmerica,
  'air': GiWindsock,
  'sun': FaSun,
  'moon': FaMoon,
  'leaf': FaLeaf,
  'mountain': GiMountains,
  
  // Emotions & expressions
  'heart': FaHeart,
  'smile': FaSmile,
  'sleep': FaBed,
  'eye': FaEye,
  
  // Combat & power
  'sword': GiSwordClash,
  'shield': FaShieldAlt,
  'magic': FaMagic,
  'bomb': FaBomb,
  'skull': FaSkull,
  'muscle': GiMuscleUp,
  
  // Tech & modern
  'rocket': FaRocket,
  'camera': FaCamera,
  'gamepad': FaGamepad,
  'cog': FaCog,
  
  // Special & rare
  'star': FaStar,
  'gem': GiDiamonds,
  'feather': FaFeatherAlt,
  
  // Food & consumption
  'pizza': GiPizzaSlice,
  'coffee': FaCoffee,
  'utensils': FaUtensils,
  'spice': GiCoolSpices,
  'food': FaUtensils,
  'drink': FaCoffee,
  'hamburger': FaHamburger,
  
  // Animals
  'cat': FaCat,
  'dog': FaDog,
  'fish': FaFish,
  'spider': FaSpider,
  
  // Entertainment & arts
  'music': FaMusic,
  'film': FaFilm,
  'palette': FaPalette,
  'art': FaPalette,
  
  // Physical attributes
  'bolt': FaBolt,
  'speed': FaBolt,
  'flex': GiFlexibleLamp,
  'fist': GiFist,
  
  // Additional mappings
  'diamond': GiDiamonds,
  'crystal': GiDiamonds,
  'gear': FaCog,
  'snow': FaSnowflake,
  
  // Default fallback
  'default': HelpCircle,
};

// Function to get icon component from hint with fallback
export function getIconFromHint(iconHint: string): React.ElementType {
  const normalizedHint = iconHint.toLowerCase().trim();
  return iconHintToComponent[normalizedHint] || iconHintToComponent['default'];
}

// For backward compatibility with existing static stat names
export const legacyStatIcons: Record<string, React.ElementType> = {
  // Human stats
  'Coolness': GiCoolSpices,
  'Snack Resistance': GiPizzaSlice,
  'Weird Flex': GiFlexibleLamp,
  'Boss Fight Potential': GiSwordClash,
  
  // Animal stats
  'Cuteness Overload': FaHeart,
  'Chaos Energy': GiLightningBow,
  'Nap Power': FaBed,
  'Snack Acquisition Skill': FaHamburger,
  
  // Object stats
  'Durability': FaShieldAlt,
  'Vibe Strength': FaMagic,
  'Danger to Humanity': FaBomb,
  'Secret Powers': FaGem,
  
  // Food stats
  'Flavor Explosion': GiFireBowl,
  'Grease Factor': FaCoffee,
  'Resistance to Sharing': FaHands,
  'Post-Meal Regret': FaSkull,
  
  // Random stats
  'Absurdity Level': FaEye,
  'Meme Potential': FaCamera,
  'Viral Energy': FaRocket,
  'Reality-Breaking Power': FaCog,
};

// Enhanced function that tries icon hint first, then falls back to legacy mapping, then smart fallback
export function getStatIcon(statName: string, iconHint?: string): React.ElementType {
  // If we have an icon hint, use it
  if (iconHint) {
    const iconFromHint = getIconFromHint(iconHint);
    if (iconFromHint !== iconHintToComponent['default']) {
      return iconFromHint;
    }
  }
  
  // Fall back to legacy static mapping
  const legacyIcon = legacyStatIcons[statName];
  if (legacyIcon) {
    return legacyIcon;
  }
  
  // Smart fallback based on stat name keywords
  const lowerStatName = statName.toLowerCase();
  
  // Physical/strength related
  if (lowerStatName.includes('strength') || lowerStatName.includes('power') || lowerStatName.includes('muscle')) {
    return GiMuscleUp;
  }
  // Speed/agility related
  if (lowerStatName.includes('speed') || lowerStatName.includes('fast') || lowerStatName.includes('quick') || lowerStatName.includes('agility')) {
    return FaBolt;
  }
  // Defense/protection related
  if (lowerStatName.includes('defense') || lowerStatName.includes('shield') || lowerStatName.includes('armor') || lowerStatName.includes('protection')) {
    return FaShieldAlt;
  }
  // Health/life related
  if (lowerStatName.includes('health') || lowerStatName.includes('life') || lowerStatName.includes('vitality') || lowerStatName.includes('hp')) {
    return FaHeart;
  }
  // Intelligence/wisdom related
  if (lowerStatName.includes('intelligence') || lowerStatName.includes('smart') || lowerStatName.includes('wisdom') || lowerStatName.includes('brain')) {
    return FaCog;
  }
  // Magic/mystical related
  if (lowerStatName.includes('magic') || lowerStatName.includes('mystical') || lowerStatName.includes('spell') || lowerStatName.includes('mana')) {
    return FaMagic;
  }
  // Luck/fortune related
  if (lowerStatName.includes('luck') || lowerStatName.includes('fortune') || lowerStatName.includes('chance')) {
    return FaStar;
  }
  // Charisma/social related
  if (lowerStatName.includes('charisma') || lowerStatName.includes('charm') || lowerStatName.includes('social') || lowerStatName.includes('appeal')) {
    return FaSmile;
  }
  // Energy/stamina related
  if (lowerStatName.includes('energy') || lowerStatName.includes('stamina') || lowerStatName.includes('endurance')) {
    return GiLightningBow;
  }
  // Food/consumption related
  if (lowerStatName.includes('food') || lowerStatName.includes('eat') || lowerStatName.includes('hunger') || lowerStatName.includes('taste')) {
    return FaUtensils;
  }
  // Coolness/style related
  if (lowerStatName.includes('cool') || lowerStatName.includes('style') || lowerStatName.includes('swag') || lowerStatName.includes('vibe')) {
    return GiCoolSpices;
  }
  // Cuteness/adorable related
  if (lowerStatName.includes('cute') || lowerStatName.includes('adorable') || lowerStatName.includes('sweet')) {
    return FaHeart;
  }
  // Danger/scary related
  if (lowerStatName.includes('danger') || lowerStatName.includes('scary') || lowerStatName.includes('threat') || lowerStatName.includes('fear')) {
    return FaSkull;
  }
  // Weird/unusual related
  if (lowerStatName.includes('weird') || lowerStatName.includes('strange') || lowerStatName.includes('odd') || lowerStatName.includes('flex')) {
    return GiFlexibleLamp;
  }
  
  // Default fallback
  return iconHintToComponent['default'];
}

// Helper functions for extracting values and icon hints from stat objects
export function getStatValue(statValue: any): string | number {
  if (statValue && typeof statValue === 'object' && 'value' in statValue) {
    return statValue.value;
  }
  return statValue;
}

export function getStatIconHint(statValue: any): string | undefined {
  if (statValue && typeof statValue === 'object' && 'iconHint' in statValue) {
    return statValue.iconHint;
  }
  return undefined;
}
