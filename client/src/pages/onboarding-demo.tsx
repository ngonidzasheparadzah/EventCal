import React from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function OnboardingDemo() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            RooMe Onboarding Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Experience our immersive multi-step onboarding flow designed specifically for the Zimbabwean accommodation market.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Features Showcased:
          </h2>
          <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>• Conversational welcome screens</li>
            <li>• Animated role selection (Guest/Host/Service Provider)</li>
            <li>• Multi-step form with progress tracking</li>
            <li>• File upload with preview</li>
            <li>• Micro-interactions and smooth animations</li>
            <li>• Guest browsing mode</li>
            <li>• Role-specific completion flows</li>
          </ul>
        </div>

        <Button
          onClick={() => setLocation('/onboarding')}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl"
          data-testid="button-start-onboarding"
        >
          Start Onboarding Experience
        </Button>

        <Button
          onClick={() => setLocation('/')}
          variant="ghost"
          className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          data-testid="button-back-home"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}