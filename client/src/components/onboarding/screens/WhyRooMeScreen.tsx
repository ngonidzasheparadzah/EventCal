import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface WhyRooMeScreenProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function WhyRooMeScreen({ onNext }: WhyRooMeScreenProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: '🏡',
      title: 'Guests',
      description: 'Find your perfect stay',
      color: 'from-cyan-400 to-cyan-600'
    },
    {
      icon: '🛏️',
      title: 'Hosts',
      description: 'Share your space & earn',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: '🛠️',
      title: 'Services',
      description: 'Connect & provide services',
      color: 'from-purple-400 to-purple-600'
    }
  ];

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-8" data-testid="why-roome-screen">
      {/* Conversational text bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          scale: showContent ? 1 : 0.9, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 max-w-sm mx-auto">
          {/* Speech bubble pointer */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-white dark:bg-gray-800 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45"></div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              RooMe brings everyone together
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              Guests, Hosts, and Service Providers - all in one platform for seamless accommodation experiences.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Feature cards with staggered animation */}
      <div className="w-full space-y-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            animate={{ 
              opacity: showContent ? 1 : 0, 
              x: showContent ? 0 : (index % 2 === 0 ? -50 : 50)
            }}
            transition={{ 
              duration: 0.6, 
              delay: 0.2 + (index * 0.1), 
              ease: "easeOut" 
            }}
            className="transform"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-2xl" role="img" aria-label={feature.title}>
                    {feature.icon}
                  </span>
                </div>
                
                <div className="flex-1 text-left">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </div>
                
                <div className="text-cyan-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Supporting illustration */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 30 
        }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm mx-auto"
      >
        <div className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-6 shadow-lg">
          <div className="text-center space-y-3">
            {/* Connection animation */}
            <div className="flex justify-center items-center space-x-1">
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-sm">🏡</span>
              </motion.div>
              
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex-1 h-0.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-green-500"
              />
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-sm">🛠️</span>
              </motion.div>
              
              <motion.div
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="flex-1 h-0.5 bg-gradient-to-r from-green-500 via-purple-500 to-cyan-500"
              />
              
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.4 }}
                className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-sm">👥</span>
              </motion.div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium">Seamless Connections</p>
              <p>One platform, endless possibilities</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
        className="w-full"
      >
        <Button
          onClick={onNext}
          className="w-full h-14 text-lg font-semibold bg-cyan-400 hover:bg-cyan-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl"
          data-testid="button-next"
        >
          Next
        </Button>
      </motion.div>
    </div>
  );
}