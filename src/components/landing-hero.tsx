
"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Dices, Cat, Pizza, KeyRound, Volume2, VolumeX } from 'lucide-react';
import { MdCheckCircle } from 'react-icons/md';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { validateApiKey } from '@/ai/flows/validate-api-key';



// Floating icon animation for background flavor
const floatingVariants = {
  initial: { y: 0, x: 0 },
  animate: {
    y: [0, -10, 5, -5, 0],
    x: [0, 5, -5, 10, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const Icon = ({ icon: Icon, className, style }: { icon: React.ElementType, className?: string, style?: React.CSSProperties }) => (
  <motion.div variants={floatingVariants} initial="initial" animate="animate" className={cn("absolute text-primary opacity-20", className)} style={style}>
    <Icon className="w-full h-full" />
  </motion.div>
);


export function LandingHero() {
  const [apiKey, setApiKey] = useState('');
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isProceeding, setIsProceeding] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  

  // Music player state and logic
  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    localStorage.removeItem('hasVisitedLanding');
    const storedKey = localStorage.getItem('googleApiKey');
    if (storedKey) {
      setApiKey(storedKey);
      setIsKeySaved(true);
    }
    // Restore music state or default to enabled
    const savedMusicState = localStorage.getItem('musicEnabled');
    const musicEnabled = savedMusicState !== null ? savedMusicState === 'true' : true;
    setIsPlaying(musicEnabled);
    audioRef.current = new Audio('/Music/1-03. Kalos Region Theme.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    if (musicEnabled) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
        localStorage.setItem('musicEnabled', 'false');
      });
    }
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggleMusic = () => {
    const newPlayingState = !isPlaying;
    if (newPlayingState) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
    setIsPlaying(newPlayingState);
    localStorage.setItem('musicEnabled', newPlayingState.toString());
  };

  // Validate and save the user's API key
  const handleSaveKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "No API Key Entered",
        description: "Please enter a valid Google AI API key to continue.",
        variant: "destructive",
      });
      return;
    }
    setIsValidating(true);
    const isValid = await validateApiKey(apiKey.trim());
    setIsValidating(false);
    if (isValid) {
      localStorage.setItem('googleApiKey', apiKey.trim());
      setIsKeySaved(true);
      toast({
        title: "API Key Valid!",
        description: "You're all set to create some mythic cards.",
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "The key you entered seems to be invalid. Please check and try again.",
        variant: "destructive",
      });
    }
  };
  
  // User chooses to proceed without their own key
  const handleConfirmSellKidney = () => {
    localStorage.removeItem('googleApiKey');
    setIsProceeding(true);
    toast({
      title: "Welp, can't say I didn't warn you! 😭",
      description: "The app will now use the creator's key. Be gentle.",
    });
  };

  // Enter the card creator, fade out music if playing
  const handleEnterForge = () => {
    if (!isKeySaved && !isProceeding) {
      toast({
        title: "Hold Up, Legend!",
        description: "Please save your API key or... you know... confirm you want to sell my kidney.",
        variant: "destructive",
      });
      return;
    }
    localStorage.setItem('hasVisitedLanding', 'true');
    if (audioRef.current) {
      let volume = audioRef.current.volume;
      const fadeOutInterval = setInterval(() => {
        if (volume > 0.1) {
          volume -= 0.1;
          if (audioRef.current) audioRef.current.volume = volume;
        } else {
          if (audioRef.current) audioRef.current.pause();
          clearInterval(fadeOutInterval);
          router.push('/create');
        }
      }, 100);
    } else {
      router.push('/create');
    }
  };

  return (
    <div className="relative w-full text-center p-4 flex flex-col items-center justify-center gap-8 overflow-hidden">
        <motion.button 
            onClick={toggleMusic}
            className="fixed bottom-4 right-4 z-50 w-12 h-12 md:w-16 md:h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg border-4 border-primary-foreground/50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
                y: [0, -5, 0],
                transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            }}
        >
            {isPlaying ? <Volume2 className="w-6 h-6 md:w-8 md:h-8"/> : <VolumeX className="w-6 h-6 md:w-8 md:h-8"/>}
        </motion.button>
        <Icon icon={Pizza} className="w-16 h-16 md:w-24 md:h-24 top-0 left-10" style={{ animationDelay: '-2s' }} />
        <Icon icon={Dices} className="w-20 h-20 md:w-32 md:h-32 top-1/2 right-0 -translate-y-1/2" style={{ animationDelay: '-5s' }} />
        <Icon icon={Cat} className="w-16 h-16 md:w-28 md:h-28 bottom-0 left-1/4" style={{ animationDelay: '-8s' }} />

        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="z-10 flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6"
        >
            <Image 
                src="/logo.png" 
                alt="Mythic Logo" 
                width={150} 
                height={150} 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32" 
            />
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-headline text-primary-foreground [text-shadow:_2px_2px_0_hsl(var(--primary)/1),_4px_4px_0_hsl(var(--foreground)/0.2)]">
                Mythic!
            </h1>
        </motion.div>

        <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="max-w-3xl text-base md:text-xl text-primary-foreground/90 font-code [text-shadow:_2px_2px_0_hsl(var(--foreground)/0.1)] z-10"
        >
            Ever imagined your cat as a dimension-hopping demigod? Stop wondering. <strong className="text-accent">Mythic turns your clicks into cool Pokémon Cards.</strong>
        </motion.p>
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="z-10 w-full max-w-lg mx-auto bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg border-2 border-primary/50"
        >
          <div className="font-code text-center">
            <h3 className="text-lg md:text-xl font-bold text-card-foreground">A Quick Note from the Creator!</h3>
            <p className="text-sm md:text-base text-card-foreground/80 mt-2">
              This whole thing runs on AI credits, and the dumb creator of this app is broke AF. To keep this site from blowing up (and to save him from selling a kidney), please consider using your own Google AI API key.
            </p>
             <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-accent underline hover:text-accent/80 transition-colors">
              You can get a free one here!
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
            <div className="relative w-full">
              <Input
                type="password"
                placeholder="Paste your key"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setIsKeySaved(false);
                  setIsProceeding(false);
                }}
                disabled={isKeySaved || isValidating}
                className="font-code h-12 text-base bg-card border-2 border-primary/80 focus:bg-card/90 pr-10 text-center placeholder:text-center"
              />
              <AnimatePresence>
              {isKeySaved && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute right-3 top-0 bottom-0 flex items-center justify-center"
                  style={{ color: '#4E7145' }}
                >
                  <MdCheckCircle className="w-5 h-5" />
                </motion.div>
              )}
              </AnimatePresence>
            </div>
             <motion.div
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
             >
               <Button 
                 onClick={handleSaveKey} 
                 size="lg" 
                 className="h-12 text-base font-code w-full sm:w-auto shrink-0 hover:scale-105 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group" 
                 disabled={isKeySaved || isValidating}
               >
                 <motion.div
                   className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                   initial={false}
                 />
                 <span className="relative z-10 flex items-center">
                   <KeyRound className={isValidating ? "mr-2 animate-spin" : "mr-2"} />
                   {isValidating ? "Validating..." : "Save Key"}
                 </span>
               </Button>
             </motion.div>
          </div>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="font-code mt-2 w-full sm:w-auto hover:scale-105 hover:-translate-y-1 transition-all duration-200 text-xs sm:text-sm relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-destructive/30 to-destructive/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    initial={false}
                  />
                  <span className="relative z-10">idgaf...sell ur kidney</span>
                </Button>
              </motion.div>
            </AlertDialogTrigger>
            <AlertDialogContent className="font-code bg-red-600 border-4 border-black text-yellow-300 [text-shadow:2px_2px_0_black]">
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure? 🥹</AlertDialogTitle>
                <AlertDialogDescription className="text-yellow-300/80">
                    I mean, I get it...who wants to go through the hassle of creating an API key, right?  But the free tier has limits, and if too many people use my key, the app will break for everyone. It's okay if you just wanna test it out. But pretty please... be gentle! 😭
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel className="whitespace-normal text-center h-auto border-2 border-white">Nvm, I'll get a key</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmSellKidney} className="whitespace-normal text-center h-auto border-2 border-white">
                    Proceed & Be Gentle
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="z-10"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleEnterForge} 
              size="lg" 
              className="text-xl md:text-2xl py-6 md:py-8 px-8 md:px-10 font-code shadow-lg hover:scale-105 hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group border-2 border-white" 
              disabled={!isKeySaved && !isProceeding}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/30 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={false}
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20"
                animate={{ x: [-300, 300] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ opacity: (isKeySaved || isProceeding) ? 0.3 : 0 }}
              />
              <span className="relative z-10 flex items-center justify-center">
                <ArrowRight className="mr-2 w-6 h-6" />
                Enter Mythic!
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Credit */}
        <motion.div 
            className="mt-6 p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/20 backdrop-blur-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
        >
            <div className="text-xs sm:text-sm text-primary-foreground/80 font-code z-10">
                <p>
                    Made with ☕ by{' '}
                    <a 
                        href="https://bento.me/arjunoff" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-bold underline decoration-2 underline-offset-2 transition-all duration-200 hover:scale-105 inline-block"
                        style={{ color: '#FFD700' }}
                    >
                        OffSpace
                    </a>
                </p>
            </div>
        </motion.div>

        <div className="mt-4 text-xs sm:text-sm text-primary-foreground/50 font-code z-10 max-w-2xl">
            <p>
                "There's No Sense In Going Out Of Your Way To Get Somebody To Like You."
                <br />
                - Ash Ketchum
            </p>
        </div>
    </div>
  );
}

    

    

    