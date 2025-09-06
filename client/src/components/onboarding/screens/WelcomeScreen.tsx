import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import interiorImageUrl from '@assets/adc0bb02ab607b07cc71434fa22cb839_1757163627498.jpg';

interface WelcomeScreenProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-8 px-4 min-h-screen justify-center" data-testid="welcome-screen">
      {/* Main Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mt-8"
      >
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
          Welcome to RooMe.
        </h1>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          scale: showContent ? 1 : 0.9, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-xs mx-auto"
      >
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <img 
            src={interiorImageUrl} 
            alt="Beautiful modern living room" 
            className="w-full h-80 object-cover"
            data-testid="hero-image"
          />
          {/* Subtle overlay for better visual depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
        </div>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        className="px-4 max-w-sm"
      >
        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
          Find accommodation across Zimbabwe
        </p>
      </motion.div>

      {/* Progress Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex space-x-2"
      >
        <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
      </motion.div>

      {/* Spacer to push button to bottom */}
      <div className="flex-1"></div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
        className="w-full px-4 mt-auto"
      >
        <Button
          onClick={onNext}
          className="w-full h-14 text-lg font-semibold bg-cyan-400 hover:bg-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl border-0"
          data-testid="button-continue"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}