
import { cn } from "@/lib/utils";
import Image from "next/image";
import { motion } from "framer-motion";

const PokedexFrame = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div 
      className={cn("relative w-full h-full mx-auto font-code flex flex-col", className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <motion.div 
        className="relative z-10 flex flex-col bg-primary rounded-2xl shadow-2xl shadow-black/30 border-4 border-primary-foreground/20 h-full"
        whileHover={{ 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 235, 59, 0.2)" 
        }}
        transition={{ duration: 0.3 }}
      >
        
        {/* Top Bar (Decorations) */}
        <div className="w-full p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <motion.div 
              className="w-12 h-12 rounded-full bg-cyan-300 border-4 border-background/20 ring-4 ring-cyan-200 shadow-inner shadow-black/20 relative overflow-hidden"
              animate={{ 
                boxShadow: [
                  "inset 0 0 20px rgba(0, 255, 255, 0.5)",
                  "inset 0 0 30px rgba(0, 255, 255, 0.8)",
                  "inset 0 0 20px rgba(0, 255, 255, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-48, 48] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            
            <div className="flex gap-2">
              {[
                { color: "bg-red-500", delay: 0 },
                { color: "bg-yellow-400", delay: 0.2 },
                { color: "bg-green-500", delay: 0.4 }
              ].map((light, i) => (
                <motion.div
                  key={i}
                  className={`w-4 h-4 rounded-full ${light.color} border-2 border-background/20`}
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: light.delay 
                  }}
                />
              ))}
            </div>
          </div>
          
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <Image src="/logo.png" alt="Mythic Logo" width={50} height={50} />
            </motion.div>
            <motion.h1 
              className="text-[32px] font-bold text-primary-foreground [text-shadow:_2px_2px_0_hsl(var(--foreground)/0.2)] font-headline tracking-wider"
              animate={{
                textShadow: [
                  "2px 2px 0 hsl(var(--foreground)/0.2)",
                  "2px 2px 0 hsl(var(--accent)/0.8)",
                  "2px 2px 0 hsl(var(--foreground)/0.2)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Mythic
            </motion.h1>
          </motion.div>
        </div>

        {/* Screen */}
        <motion.div 
          className="flex-1 bg-gray-200 dark:bg-gray-800 p-2.5 md:p-4 rounded-xl m-2 md:m-4 mt-0 border-4 border-gray-600/50 dark:border-gray-900/50 shadow-inner shadow-black/50 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Screen scan lines effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
            animate={{ y: [-100, 100] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "linear",
              repeatDelay: 2 
            }}
          />
          
          <motion.div 
            className="w-full h-full rounded-lg shadow-inner shadow-black/20 p-4 flex flex-col relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, #FF2500 0%, #FF4500 100%)',
              backgroundSize: '100% 100%'
            }}
            whileHover={{ 
              boxShadow: "inset 0 0 20px rgba(255, 235, 59, 0.1)" 
            }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export { PokedexFrame };
