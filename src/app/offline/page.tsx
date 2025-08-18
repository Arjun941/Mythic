'use client';

// Offline fallback page for PWA when no internet connection
import { motion } from 'framer-motion';
import { WifiOff, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

export default function OfflinePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <Card className="bg-black/80 border-2 border-yellow-400 p-8 max-w-md mx-auto">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="mb-6"
          >
            <WifiOff className="h-24 w-24 text-yellow-400 mx-auto" />
          </motion.div>
          
          <h1 className="text-2xl font-bold text-yellow-400 mb-4 font-['Press_Start_2P']">
            YOU'RE OFFLINE!
          </h1>
          
          <p className="text-white mb-6 font-['Luckiest_Guy'] text-lg">
            Connect to the internet to create mythic cards with AI magic! ✨
          </p>
          
          <div className="space-y-4">
            <Button
              onClick={() => router.back()}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
