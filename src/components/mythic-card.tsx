"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { AnalyzeImageGenerateStatsLoreOutput } from '@/ai/schemas';
import { Badge } from './ui/badge';
import { HelpCircle } from 'lucide-react';
import { CardDetailsDialog } from './card-details-dialog';
import { useState } from 'react';
import { getStatIcon } from '@/lib/icon-mapping';

interface MythicCardProps {
  imagePreview: string;
  cardData: AnalyzeImageGenerateStatsLoreOutput;
}

const currentThemeClasses = 'bg-red-600 border-black text-yellow-300 font-code [text-shadow:2px_2px_0_black]';

// Helper function to extract stat value from new structure
const getStatValue = (statData: any): string | number => {
  if (typeof statData === 'object' && statData !== null && 'value' in statData) {
    return statData.value;
  }
  return statData; // fallback for legacy format
};

// Helper function to extract icon hint from new structure
const getStatIconHint = (statData: any): string | undefined => {
  if (typeof statData === 'object' && statData !== null && 'iconHint' in statData) {
    return statData.iconHint;
  }
  return undefined;
};

const StatBubble = ({ icon: Icon, value, className }: { icon: React.ElementType, value: string | number, className?: string }) => {
    return (
        <motion.div 
            className={cn("absolute w-20 h-20 rounded-full flex flex-col items-center justify-center font-code border-4 text-center bg-gradient-to-br from-yellow-300 to-yellow-500 text-black border-yellow-600 shadow-lg", className)}
            initial={{ scale: 0, rotate: 180, y: -20 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 200 }}
            whileHover={{ 
                scale: 1.15, 
                rotate: 5,
                boxShadow: "0 15px 25px rgba(0,0,0,0.4), 0 0 15px rgba(255,235,59,0.3)",
                y: -5
            }}
            style={{
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))"
            }}
        >
            {/* Inner glow effect */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-200/50 to-transparent" />
            
            <motion.div
                className="relative z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
                <Icon className="w-7 h-7 mb-0.5 drop-shadow-sm" />
            </motion.div>
            
            <motion.span 
                className="text-lg font-bold relative z-10 drop-shadow-sm"
                animate={{ 
                    textShadow: [
                        "0 0 0 transparent",
                        "1px 1px 2px rgba(0,0,0,0.3)",
                        "0 0 0 transparent"
                    ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                {value}
            </motion.span>
            
            {/* Sparkle effects for high values */}
            {(typeof value === 'number' && value > 80) || (typeof value === 'string' && parseInt(value) > 80) ? (
                <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{ 
                        boxShadow: [
                            "0 0 0 rgba(255,235,59,0)",
                            "0 0 20px rgba(255,235,59,0.5)",
                            "0 0 0 rgba(255,235,59,0)"
                        ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
            ) : null}
        </motion.div>
    );
}

const rarityColors: Record<string, string> = {
    Common: 'bg-gradient-to-r from-slate-400 to-slate-500 text-black border-slate-600',
    Uncommon: 'bg-gradient-to-r from-emerald-400 to-green-600 text-white border-green-700',
    Rare: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white border-blue-700',
    Epic: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white border-purple-700',
    Legendary: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black border-orange-600',
};

const rarityCardStyles: Record<string, string> = {
    Common: 'border-slate-500 bg-gradient-to-br from-slate-100 to-slate-200',
    Uncommon: 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-100',
    Rare: 'border-blue-500 bg-gradient-to-br from-blue-50 to-sky-100',
    Epic: 'border-purple-500 bg-gradient-to-br from-purple-50 to-violet-100',
    Legendary: 'border-yellow-500 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50',
};

export function MythicCard({ imagePreview, cardData }: MythicCardProps) {
  const { category, stats, name, rarity } = cardData;
  const statEntries = Object.entries(stats);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Find weird flex stat first for prominent display
  const weirdFlexStat = statEntries.find(([key]) => key.toLowerCase().includes('weird flex'));
  const weirdFlexValue = weirdFlexStat?.[1];
  const weirdFlexIconHint = getStatIconHint(weirdFlexValue);
  const WeirdFlexIcon = weirdFlexStat ? getStatIcon(weirdFlexStat[0], weirdFlexIconHint) : null;

  // Get other main stats (excluding weird flex)
  const otherStats = statEntries.filter(([key]) => !key.toLowerCase().includes('weird flex'));
  const primaryStatKey = otherStats[0]?.[0];
  const primaryStatValue = otherStats[0]?.[1];
  const primaryIconHint = getStatIconHint(primaryStatValue);
  const PrimaryIcon = getStatIcon(primaryStatKey, primaryIconHint);

  const secondaryStatKey = otherStats[1]?.[0];
  const secondaryStatValue = otherStats[1]?.[1];
  const secondaryIconHint = getStatIconHint(secondaryStatValue);
  const SecondaryIcon = getStatIcon(secondaryStatKey, secondaryIconHint);


  return (
    <div className="w-[350px] h-[525px] perspective-1000">
      <motion.div
        className={cn(
          "relative w-full h-full rounded-2xl border-8 shadow-2xl overflow-hidden flex flex-col cursor-pointer",
          rarityCardStyles[rarity],
          rarity === 'Legendary' && "animate-pulse"
        )}
        style={{ 
          transformStyle: 'preserve-3d',
          boxShadow: `0 10px 30px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)`
        }}
        whileHover={{ 
          scale: 1.05, 
          rotateY: 15, 
          rotateX: 8, 
          boxShadow: "0px 25px 60px rgba(0,0,0,0.4), 0 0 30px rgba(255,235,59,0.3)",
          filter: "brightness(1.1) saturate(1.1)"
        }}
        initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        onClick={() => setIsDetailsOpen(true)}
      >
        {/* Rarity-based background effects */}
        {rarity === 'Legendary' && (
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-yellow-200/20 via-orange-300/10 to-transparent"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transform: 'translateZ(5px)' }}
          />
        )}
        
        {rarity === 'Epic' && (
          <motion.div
            className="absolute inset-0 bg-gradient-conic from-purple-300/20 via-violet-400/10 to-purple-300/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ transform: 'translateZ(5px)' }}
          />
        )}

        {/* Enhanced decorative elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-20"
          style={{ 
            transform: 'translateZ(15px)',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(255,255,255,0.3) 1px, transparent 1px),
              radial-gradient(circle at 75% 75%, rgba(255,255,255,0.2) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px, 15px 15px'
          }}
          animate={{ 
            backgroundPosition: ['0px 0px, 0px 0px', '20px 20px, 15px 15px'] 
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Corner ornaments */}
        <motion.div 
          className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-black/40"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{ transform: 'translateZ(30px)' }}
        />
        
        <motion.div 
          className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-black/40"
          initial={{ scale: 0, rotate: 90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ transform: 'translateZ(30px)' }}
        />
        
        <motion.div 
          className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-black/40"
          initial={{ scale: 0, rotate: 90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{ transform: 'translateZ(30px)' }}
        />
        
        <motion.div 
          className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-black/40"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ transform: 'translateZ(30px)' }}
        />

        {/* Enhanced shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: [-400, 400] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
          style={{ transform: 'translateZ(25px)', skewX: '-15deg' }}
        />

        {/* Card Header */}
        <motion.div 
          className="relative p-3 border-b-4 border-black/30 bg-gradient-to-r from-white/90 to-gray-100/90 backdrop-blur-sm" 
          style={{ transform: 'translateZ(40px)' }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Decorative header border */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
          
          <div className="flex justify-between items-center mb-2">
            <motion.h3 
              className="text-lg font-code text-black font-bold relative z-10"
              animate={{ 
                textShadow: [
                  "2px 2px 0 rgba(255,215,0,0.3)",
                  "2px 2px 0 rgba(255,140,0,0.5)",
                  "2px 2px 0 rgba(255,215,0,0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                textShadow: "1px 1px 0 rgba(0,0,0,0.1), 2px 2px 4px rgba(0,0,0,0.2)"
              }}
            >
              {name}
            </motion.h3>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative z-10"
            >
              <Badge className={cn("text-xs font-code border-2 px-2 py-1 font-bold shadow-lg", rarityColors[rarity])}>
                {rarity}
              </Badge>
            </motion.div>
          </div>

          {/* Weird Flex Stat*/}
          {weirdFlexValue !== undefined && WeirdFlexIcon && (
            <motion.div 
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1.5 rounded-lg border-2 border-red-600 shadow-lg relative z-10"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 150 }}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 8px 20px rgba(239, 68, 68, 0.4)",
                rotate: 2
              }}
            >
              <WeirdFlexIcon className="w-4 h-4" />
              <span className="font-code font-bold text-xs">
                WEIRD FLEX: {(() => {
                  const value = getStatValue(weirdFlexValue);
                  return typeof value === 'number' ? `${value}/10` : value;
                })()}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            </motion.div>
          )}
        </motion.div>

        {/* Image Container - Larger */}
        <motion.div 
          className="relative w-full h-2/3 border-y-4 border-black/30 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Image frame decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 z-10" />
          <div className="absolute inset-1 border-2 border-white/30 rounded-lg z-10" />
          
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <Image 
              src={imagePreview} 
              alt={name} 
              layout="fill" 
              objectFit="cover" 
              className="saturate-110 contrast-110" 
            />
            
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </motion.div>
          
          {/* Category badge */}
          <motion.div 
            className="absolute top-2 right-2 z-20" 
            style={{ transform: 'translateZ(50px)' }}
            initial={{ scale: 0, rotate: 90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.1 }}
          >
            <Badge className="text-xs font-code border-2 bg-black/80 text-white border-white/50 backdrop-blur-sm px-2 py-1 shadow-lg">
              {category}
            </Badge>
          </motion.div>
        </motion.div>
        
        {/* Stats Section - Compact */}
        <motion.div 
          className="flex-1 flex flex-col justify-center items-center text-center relative p-3 bg-gradient-to-b from-white/50 to-white/70"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {/* Stats Display - Compact Horizontal Layout */}
          <div className="flex justify-center items-center gap-8 w-full">
            {primaryStatValue !== undefined && (
              <motion.div 
                className="flex flex-col items-center gap-1 min-w-[70px]"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 150 }}
                whileHover={{ scale: 1.1, y: -3 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-3 border-yellow-600 flex items-center justify-center shadow-lg">
                  <PrimaryIcon className="w-6 h-6 text-black drop-shadow-sm" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold font-code text-black drop-shadow-sm">{getStatValue(primaryStatValue)}</div>
                  <div className="text-[9px] font-code text-black/70 uppercase tracking-tight leading-tight break-words text-center px-1">
                    {primaryStatKey}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Center Divider */}
            <motion.div 
              className="w-0.5 h-14 bg-gradient-to-b from-transparent via-black/30 to-transparent mx-2"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            />

            {secondaryStatValue !== undefined && (
              <motion.div 
                className="flex flex-col items-center gap-1 min-w-[70px]"
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 150 }}
                whileHover={{ scale: 1.1, y: -3 }}
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 border-3 border-blue-600 flex items-center justify-center shadow-lg">
                  <SecondaryIcon className="w-6 h-6 text-white drop-shadow-sm" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold font-code text-black drop-shadow-sm">{getStatValue(secondaryStatValue)}</div>
                  <div className="text-[9px] font-code text-black/70 uppercase tracking-tight leading-tight break-words text-center px-1">
                    {secondaryStatKey}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Backface for 3D effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-yellow-400 rounded-2xl backface-hidden" style={{ transform: 'rotateY(180deg) translateZ(10px)' }}>
           <div className="w-full h-full flex items-center justify-center">
            <div className="text-black font-black text-5xl transform -scale-x-100">
                MYTHIC
            </div>
           </div>
        </div>
      </motion.div>

      {/* Details Dialog */}
      <CardDetailsDialog 
        isOpen={isDetailsOpen} 
        onOpenChange={setIsDetailsOpen} 
        cardData={cardData} 
      />
    </div>
  );
}
