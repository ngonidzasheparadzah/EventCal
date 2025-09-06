import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import interiorImageUrl from '@assets/adc0bb02ab607b07cc71434fa22cb839_1757163627498.jpg';
import logoUrl from '@assets/BackgroundEraser_20250906_144355719_1757164631834.png';

export default function OnboardingDemo() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm mx-auto flex flex-col justify-center min-h-screen space-y-6">
        {/* Logo */}
        <div className="text-center pt-8">
          <img 
            src={logoUrl} 
            alt="RooMe Logo" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Welcome to RooMe.
          </h1>
        </div>
        
        {/* Hero Image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full relative overflow-hidden rounded-3xl shadow-2xl">
            <img 
              src={interiorImageUrl} 
              alt="Beautiful modern living room" 
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
        
        {/* Subtitle */}
        <div className="text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
            Find accommodation across Zimbabwe
          </p>
        </div>
        
        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
        
        {/* CTA Button */}
        <div className="pb-8">
          <Button
            className="w-full h-14 text-lg font-semibold bg-cyan-400 hover:bg-cyan-500 text-white shadow-lg rounded-2xl border-0"
            onClick={() => setLocation('/landing')}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}