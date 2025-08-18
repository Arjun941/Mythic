
"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Wand2, BookOpen, RefreshCw, Upload, Sparkles, RotateCcw } from 'lucide-react';
import { MdCameraFront, MdCameraRear } from 'react-icons/md';
import { analyzeImageGenerateStatsLore } from '@/ai/flows/analyze-image-generate-stats-lore';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { MythicCard } from '@/components/mythic-card';
import { LoadingAnimation } from '@/components/loading-animation';
import { PokedexFrame } from '@/components/pokedex-frame';
import { CardDetailsDialog } from '@/components/card-details-dialog';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import type { AnalyzeImageGenerateStatsLoreOutput } from '@/ai/schemas';
import { useRouter } from 'next/navigation';

export function CardCreator() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cardData, setCardData] = useState<AnalyzeImageGenerateStatsLoreOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>();
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // 'user' = front, 'environment' = back
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const visitedLanding = localStorage.getItem('hasVisitedLanding');
    if (visitedLanding !== 'true') {
      router.push('/');
      return;
    }

    const storedApiKey = localStorage.getItem('googleApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, [router]);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        // First, get all available video input devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);

        // Start with the specified facing mode
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        
        // If the preferred facing mode fails, try the opposite
        try {
          const fallbackMode = facingMode === 'user' ? 'environment' : 'user';
          const fallbackConstraints = {
            video: {
              facingMode: fallbackMode,
              width: { ideal: 1280 },
              height: { ideal: 720 }
            }
          };
          
          const fallbackStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
          setHasCameraPermission(true);
          setFacingMode(fallbackMode);
          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
          }
        } catch (fallbackError) {
          console.error('Error accessing any camera:', fallbackError);
          setHasCameraPermission(false);
        }
      }
    };

    getCameraPermission();

    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [facingMode]);
  
  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUri = canvas.toDataURL('image/png');
            setImagePreview(dataUri);
            setCardData(null);
        }
    }
  };

  const handleSwitchCamera = () => {
    // Stop current stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Toggle facing mode
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setCardData(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imagePreview) {
      toast({ title: "No image selected!", description: "Please capture or upload an image.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setCardData(null);

    try {
      const result = await analyzeImageGenerateStatsLore({ photoDataUri: imagePreview, apiKey: apiKey || undefined });
      const resultAudio = new Audio('/SFX/Result.mp3');
      resultAudio.play().catch(e => console.error("Failed to play sound", e));
      setCardData(result);
      setIsLoading(false);
      setIsDetailsOpen(true);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast({ title: "Uh oh! Something went wrong.", description: "There was a problem with our AI. This could be due to an invalid API key or a network issue. Please try again.", variant: "destructive" });
    }
  };
  
  const handleReset = () => {
    // Stop current camera stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    // Reset state
    setImagePreview(null);
    setCardData(null);
    setHasCameraPermission(undefined); // Reset camera permission to trigger re-request
    
    // Restart camera with current facing mode
    const getCameraPermission = async () => {
      try {
        const constraints = {
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
  }

  const renderInitialState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center">
      <motion.h2 
        className="text-2xl md:text-3xl font-headline text-primary-foreground [text-shadow:_2px_2px_0_hsl(var(--foreground)/0.2)] mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Create Your Mythic Card
      </motion.h2>
      
      <motion.div 
        className="relative w-full aspect-[4/3] rounded-lg border-4 border-dashed border-primary-foreground/20 bg-primary-foreground/5 flex items-center justify-center overflow-hidden"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
      >
        {imagePreview ? (
          <motion.div
            className="w-full h-full relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image src={imagePreview} alt="Selected preview" layout="fill" objectFit="contain" className="rounded-md" />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        ) : (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="hidden"></canvas>
            
            {/* Camera Switch Button */}
            {hasCameraPermission === true && availableCameras.length > 1 && (
              <motion.button
                onClick={handleSwitchCamera}
                className="absolute top-4 right-4 z-10 w-12 h-12 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.8)' }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                title={`Switch to ${facingMode === 'user' ? 'back' : 'front'}`}
              >
                <RotateCcw className="w-6 h-6" />
              </motion.button>
            )}
            
            {/* Camera Status Indicator */}
            {hasCameraPermission === true && (
              <motion.div
                className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-sm text-white rounded-full text-xs font-code border border-white/30 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {facingMode === 'user' ? (
                  <>
                    <MdCameraFront className="w-4 h-4" />
                    <span>Front</span>
                  </>
                ) : (
                  <>
                    <MdCameraRear className="w-4 h-4" />
                    <span>Back</span>
                  </>
                )}
              </motion.div>
            )}
            
            {!hasCameraPermission && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center bg-background/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center">
                  <Camera className="w-12 h-12 mx-auto mb-2 text-primary-foreground/50" />
                  <p className="font-code text-sm text-primary-foreground/70">Camera Ready</p>
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
        
      {hasCameraPermission === false && !imagePreview && (
          <Alert variant="default" className="mt-4 border-orange-300 bg-orange-50 text-orange-900">
              <AlertTitle className="text-orange-900 font-bold">Camera Access Optional</AlertTitle>
              <AlertDescription className="text-orange-800">
              Camera not found or denied. You can still upload a file.
              </AlertDescription>
          </Alert>
      )}

      {imagePreview ? (
        <motion.div 
          className="w-full space-y-2 mt-4 font-code"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button onClick={handleSubmit} size="lg" className="w-full text-base py-4 md:py-5 hover:scale-105 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                initial={false}
              />
              <Wand2 className="mr-2 relative z-10" />
              <span className="relative z-10">Generate</span>
              <Sparkles className="ml-2 w-4 h-4 relative z-10 group-hover:animate-pulse" />
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button onClick={handleReset} variant="secondary" size="lg" className="w-full text-base py-4 md:py-5 hover:scale-105 hover:-translate-y-1 transition-all duration-200">
              <RefreshCw className="mr-2" />
              Reset
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          className="w-full space-y-2 mt-4 font-code"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleCapture} 
              disabled={hasCameraPermission !== true} 
              size="lg" 
              className="w-full text-base py-4 md:py-5 hover:scale-105 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                initial={false}
              />
              <Camera className="mr-2 relative z-10" />
              <span className="relative z-10">Capture Image</span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              size="lg" 
              variant="secondary" 
              className="w-full text-base py-4 md:py-5 hover:scale-105 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-secondary/20 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                initial={false}
              />
              <Upload className="mr-2 relative z-10" />
              <span className="relative z-10">Upload File</span>
            </Button>
          </motion.div>
          
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </motion.div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 lg:gap-12 items-center">
        {isLoading && <LoadingAnimation />}
        
        {/* Left Column: Pokedex */}
        <motion.div
          layout
          transition={{ duration: 0.5, type: 'spring' }}
        >
          <PokedexFrame>
            {renderInitialState()}
          </PokedexFrame>
        </motion.div>

        {/* Right Column: Card Display */}
        <div className="w-full h-full flex flex-col items-center justify-center mt-8 md:mt-0">
          <AnimatePresence>
          {cardData && imagePreview ? (
              <motion.div
                key="card"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.5 }}
                className="w-full flex flex-col items-center justify-center gap-6"
              >
                  <MythicCard
                      imagePreview={imagePreview}
                      cardData={cardData}
                  />
                  <Button onClick={() => setIsDetailsOpen(true)} size="lg" variant="outline" className="font-code text-base md:text-lg hover:scale-105 hover:-translate-y-1 transition-transform">
                      <BookOpen className="mr-2" />
                      View Details
                  </Button>
                  <CardDetailsDialog 
                      isOpen={isDetailsOpen} 
                      onOpenChange={setIsDetailsOpen} 
                      cardData={cardData}
                  />
              </motion.div>
          ) : (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="hidden md:flex flex-col items-center justify-center text-center p-8 bg-black/10 rounded-2xl h-[525px] w-[350px] border-4 border-dashed border-primary/20"
            >
              <Sparkles className="w-16 h-16 text-primary-foreground/90 mb-4" />
              <h3 className="font-headline text-2xl text-primary-foreground/80">Your card will appear here</h3>
              <p className="text-primary-foreground/70 mt-2">Capture or upload an image and click "Generate" to see the magic!</p>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>

      {/* Credit Footer */}
      <motion.div 
          className="w-full mt-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="inline-block p-3 rounded-lg bg-primary-foreground/5 border border-primary-foreground/20 backdrop-blur-sm">
          <div className="text-xs sm:text-sm text-primary-foreground/80 font-code">
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
        </div>
        <div className="mt-3 text-xs text-primary-foreground/50 font-code max-w-2xl mx-auto">
          <p>
           "Hey, I'll Use My Trusty Frying Pan,
           <br />
            As A Drying Pan."
           <br />
           - Brock
          </p>
        </div>
      </motion.div>
    </div>
  );
}
