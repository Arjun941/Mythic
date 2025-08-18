
"use client";

import React from 'react';
import { motion } from 'framer-motion';

const PixelSpinner = () => (
    <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="relative"
        style={{ width: 100, height: 100 }}
    >
        {/* Outer ring */}
        <motion.div
            className="absolute inset-0 border-4 border-primary border-t-accent rounded-none"
            style={{ 
                clipPath: 'polygon(0 0, 100% 0, 100% 25%, 75% 25%, 75% 75%, 25% 75%, 25% 25%, 0 25%)'
            }}
            animate={{ 
                boxShadow: [
                    '0 0 0 hsl(var(--primary))',
                    '0 0 20px hsl(var(--accent))',
                    '0 0 0 hsl(var(--primary))'
                ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
        />
        
        {/* Inner spinning element */}
        <motion.div
            className="absolute inset-4 bg-gradient-to-br from-primary to-accent"
            style={{ 
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)'
            }}
            animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
        />
        
        {/* Center pixel dot */}
        <motion.div
            className="absolute top-1/2 left-1/2 w-3 h-3 bg-accent transform -translate-x-1/2 -translate-y-1/2"
            animate={{ 
                scale: [1, 1.5, 1],
                rotate: [0, 180, 360]
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
        />
    </motion.div>
);

const FloatingPixels = () => (
    <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-2 h-2 bg-accent opacity-60"
                style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                }}
                animate={{
                    y: [-20, -40, -20],
                    x: [-10, 10, -10],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.5, 1, 0.5]
                }}
                transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                }}
            />
        ))}
    </div>
);

export function LoadingAnimation() {
  const [subtitleIndex, setSubtitleIndex] = React.useState(0);

  const subtitles = [
    "Professor Oak is taking notes...",
    "Wild data appeared!",
    "Gotta analyze 'em all!",
    "The Mythic Council deliberates...",
    "Arceus is calculating stats...",
    "Team Rocket isn't stealing this one!",
    "Pikachu used Thunder Analysis!",
    "Critical hit on data processing!",
    "It's super effective against boredom!",
    "Loading... please don't turn off the power!",
    "Mewtwo is impressed by this specimen..."
  ];

  // Shuffle subtitles randomly on each load
  const [shuffledSubtitles] = React.useState(() => {
    const shuffled = [...subtitles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  React.useEffect(() => {
    const subtitleInterval = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % shuffledSubtitles.length);
    }, 2000); 

    return () => {
      clearInterval(subtitleInterval);
    };
  }, [shuffledSubtitles.length]);

  return (
    <motion.div 
      className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center gap-6 z-50 p-4 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FloatingPixels />
      
      <div className="relative z-10">
        <PixelSpinner />
      </div>
      
      <motion.div
        className="space-y-3"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h2 
          className="font-code text-lg md:text-xl text-primary-foreground"
          animate={{ 
            textShadow: [
              '2px 2px 0 hsl(var(--primary))',
              '2px 2px 0 hsl(var(--accent))',
              '2px 2px 0 hsl(var(--primary))'
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          ANALYZING IMAGE...
        </motion.h2>
        
        <motion.p 
          key={subtitleIndex}
          className="font-headline text-base md:text-lg text-accent max-w-xs"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: [0.7, 1, 0.7],
            scale: 1
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          {shuffledSubtitles[subtitleIndex]}
        </motion.p>
        
        <motion.div
          className="flex justify-center gap-1 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
