"use client";

import { getStatIcon, getStatValue, getStatIconHint } from '@/lib/icon-mapping';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { AnalyzeImageGenerateStatsLoreOutput } from '@/ai/schemas';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface CardDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cardData: AnalyzeImageGenerateStatsLoreOutput;
}

const currentThemeClasses = 'bg-red-600 border-black text-yellow-300 font-code [text-shadow:2px_2px_0_black]';

const rarityColors: Record<string, string> = {
    Common: 'bg-gray-400 text-black',
    Uncommon: 'bg-green-500 text-white',
    Rare: 'bg-blue-500 text-white',
    Epic: 'bg-purple-600 text-white',
    Legendary: 'bg-yellow-500 text-black',
};

const Stat = ({ statKey, statValue, color }: { statKey: string, statValue: any, color: string }) => {
  const iconHint = getStatIconHint(statValue);
  const Icon = getStatIcon(statKey, iconHint);
  const value = getStatValue(statValue);
  
  return (
    <div className="flex items-center gap-3 bg-black/20 p-3 rounded-md">
      <Icon className={cn("w-8 h-8", color)} />
      <div className="text-left">
        <div className="text-lg font-bold truncate">{value}</div>
        <div className="text-sm uppercase opacity-80">{statKey}</div>
      </div>
    </div>
  );
};

export function CardDetailsDialog({ isOpen, onOpenChange, cardData }: CardDetailsDialogProps) {
  const { name, stats, lore, category, rarity } = cardData;

  const weirdFlex = stats['Weird Flex'];
  const otherStats = Object.fromEntries(
    Object.entries(stats).filter(([key]) => key !== 'Weird Flex')
  );

  // Generate additional derived stats for enhanced details
  const totalStatValue = Object.values(otherStats).reduce((sum: number, val: unknown) => {
    const extractedValue = getStatValue(val);
    const numVal = typeof extractedValue === 'number' ? extractedValue : parseInt(String(extractedValue)) || 0;
    return sum + numVal;
  }, 0);

  const additionalStats = {
    'Total Power': Math.round(totalStatValue),
    'Stat Average': Math.round(totalStatValue / Object.keys(otherStats).length),
    'Rarity Multiplier': rarity === 'Legendary' ? '3x' : rarity === 'Epic' ? '2.5x' : rarity === 'Rare' ? '2x' : rarity === 'Uncommon' ? '1.5x' : '1x',
    'Category Bonus': category === 'Human' ? '+15%' : category === 'Animal' ? '+10%' : category === 'Object' ? '+5%' : category === 'Food' ? '+20%' : '+12%',
    'Meme Tier': totalStatValue > 80 ? 'S-Tier' : totalStatValue > 60 ? 'A-Tier' : totalStatValue > 40 ? 'B-Tier' : totalStatValue > 20 ? 'C-Tier' : 'D-Tier',
    'Battle Rating': Math.round(totalStatValue * (rarity === 'Legendary' ? 1.5 : rarity === 'Epic' ? 1.3 : rarity === 'Rare' ? 1.2 : rarity === 'Uncommon' ? 1.1 : 1.0))
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-lg p-0 border-8 overflow-hidden", currentThemeClasses)}>
          <ScrollArea className="max-h-[80vh]">
            <div className="p-6 flex flex-col gap-6">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-3xl font-bold font-code">{name}</DialogTitle>
                    <div className="flex gap-2">
                        <Badge className="w-fit bg-gray-700 text-yellow-300">{category}</Badge>
                        <Badge className={cn("w-fit", rarityColors[rarity])}>{rarity}</Badge>
                    </div>
                </DialogHeader>

                {/* Weird Flex Section - Prominent */}
                {weirdFlex && (
                    <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 p-4 rounded-lg border-2 border-red-500 text-left">
                        <h4 className="text-xl uppercase mb-3 font-code flex items-center gap-2 text-red-300">
                            {(() => {
                                const WeirdFlexIcon = getStatIcon('Weird Flex', getStatIconHint(weirdFlex));
                                return <WeirdFlexIcon className="w-6 h-6 inline-block" />;
                            })()} 
                            WEIRD FLEX
                        </h4>
                        <p className="text-lg leading-relaxed whitespace-pre-wrap text-white font-code bg-black/30 p-3 rounded">
                            {(() => {
                                const value = getStatValue(weirdFlex);
                                // If it's a number, add /10, otherwise show the text as-is with quotes
                                return typeof value === 'number' ? `${value}/10` : `"${value}"`;
                            })()}
                        </p>
                    </div>
                )}

                {/* Core Stats */}
                <div>
                    <h3 className="text-xl font-code mb-3 text-yellow-300 uppercase border-b border-yellow-300/30 pb-2">Core Stats</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(otherStats).map(([key, value]) => (
                            <Stat key={key} statKey={key} statValue={value} color="text-yellow-300" />
                        ))}
                    </div>
                </div>

                {/* Enhanced Stats */}
                <div>
                    <h3 className="text-xl font-code mb-3 text-blue-300 uppercase border-b border-blue-300/30 pb-2">Advanced Analytics</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.entries(additionalStats).map(([key, value]) => {
                            // Static icons for advanced analytics
                            const getAnalyticsIcon = (statName: string) => {
                                switch(statName) {
                                    case 'Total Power': return '⚡';
                                    case 'Stat Average': return '📊';
                                    case 'Rarity Multiplier': return '✨';
                                    case 'Category Bonus': return '🏆';
                                    case 'Meme Tier': return '🎭';
                                    case 'Battle Rating': return '⚔️';
                                    default: return '📈';
                                }
                            };
                            return (
                                <div key={key} className="flex items-center gap-3 bg-black/20 p-3 rounded-md">
                                    <span className="text-2xl">{getAnalyticsIcon(key)}</span>
                                    <div className="text-left">
                                        <div className="text-lg font-bold truncate">{value}</div>
                                        <div className="text-sm uppercase opacity-80">{key}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* Lore Section */}
                <div className="bg-gradient-to-br from-black/40 to-gray-900/40 p-4 rounded-lg border border-white/20 text-left">
                    <h4 className="text-xl uppercase mb-3 font-code text-green-300 border-b border-green-300/30 pb-2">Mythic Lore</h4>
                    <p className="text-base leading-relaxed whitespace-pre-wrap text-white font-code">{lore}</p>
                </div>
            </div>
          </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
