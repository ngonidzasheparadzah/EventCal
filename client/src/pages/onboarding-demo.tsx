import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import interiorImageUrl from '@assets/adc0bb02ab607b07cc71434fa22cb839_1757163627498.jpg';

export default function OnboardingDemo() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Welcome Screen Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              Welcome to RooMe.
            </h1>
            
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <img 
                src={interiorImageUrl} 
                alt="Beautiful modern living room" 
                className="w-full h-48 object-cover"
              />
            </div>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              Find accommodation across Zimbabwe
            </p>
            
            {/* Progress Dots */}
            <div className="flex justify-center space-x-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            
            <Button
              className="w-full h-12 text-lg font-semibold bg-cyan-400 hover:bg-cyan-500 text-white shadow-lg rounded-2xl"
              disabled
            >
              Continue
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            ✨ Updated Welcome Screen
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            The welcome screen now matches your Fig design reference with RooMe branding, beautiful interior image, and cyan color scheme.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Complete Onboarding Features:
          </h3>
          <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Welcome screen matching Fig design</li>
            <li>• "Welcome to RooMe." title</li>
            <li>• Beautiful interior hero image</li>
            <li>• "Find accommodation across Zimbabwe" subtitle</li>
            <li>• RooMe cyan color scheme</li>
            <li>• Progress dots like Fig design</li>
            <li>• Multi-step role selection flow</li>
            <li>• Guest browsing mode</li>
          </ul>
        </div>

        <Button
          onClick={() => setLocation('/')}
          variant="outline"
          className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          data-testid="button-back-home"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}