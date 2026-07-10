import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PageLoader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background-luxury select-none"
        >
          <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 bg-accent-luxury/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="flex flex-col items-center max-w-xs w-full text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="relative mb-8 flex items-center justify-center w-24 h-24 rounded-full border border-accent-luxury/20"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-t-2 border-r-2 border-accent-luxury"
              />
              <span className="font-serif text-3xl font-bold text-accent-luxury tracking-wider gold-glow">365</span>
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="font-serif text-2xl tracking-widest text-white uppercase mb-2"
            >
              The Travel Café
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.4 }}
              className="font-sans text-xs tracking-widest text-gray-luxury uppercase mb-8"
            >
              Good Food. Great Moments.
            </motion.p>

            <div className="w-full h-[1px] bg-white/10 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-accent-luxury to-white"
              />
            </div>
            <span className="font-sans text-[10px] tracking-widest text-accent-luxury uppercase mt-2 opacity-80">
              Loading {Math.min(100, Math.round(progress))}%
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
