import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import WelcomeScreen from './screens/WelcomeScreen';
import WhyRooMeScreen from './screens/WhyRooMeScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import SignUpScreen from './screens/SignUpScreen';
import CompletionScreen from './screens/CompletionScreen';

export type UserRole = 'guest' | 'host' | 'service_provider' | null;

export interface OnboardingData {
  role: UserRole;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePicture?: string;
  };
  browsingAsGuest: boolean;
}

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome', component: WelcomeScreen },
  { id: 'why-roome', title: 'Why RooMe', component: WhyRooMeScreen },
  { id: 'role-selection', title: 'Role Selection', component: RoleSelectionScreen },
  { id: 'signup', title: 'Sign Up', component: SignUpScreen },
  { id: 'completion', title: 'Complete', component: CompletionScreen },
];

export default function OnboardingEntry() {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    role: null,
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
    },
    browsingAsGuest: false,
  });

  // Load saved progress from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('roome-onboarding');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setOnboardingData(parsed.data);
        setCurrentStep(parsed.step);
      } catch (error) {
        console.error('Failed to load onboarding progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('roome-onboarding', JSON.stringify({
      step: currentStep,
      data: onboardingData,
    }));
  }, [currentStep, onboardingData]);

  const updateOnboardingData = (updates: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setDirection(1);
    setCurrentStep(prev => {
      // Skip steps based on role selection
      if (prev === 2 && onboardingData.browsingAsGuest) {
        return 4; // Jump to completion for guest browsing
      }
      if (prev === 2 && onboardingData.role === 'guest') {
        return 4; // Jump to completion for guest role
      }
      return Math.min(prev + 1, ONBOARDING_STEPS.length - 1);
    });
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => {
      // Handle back navigation
      if (prev === 4 && (onboardingData.role === 'guest' || onboardingData.browsingAsGuest)) {
        return 2; // Back to role selection
      }
      return Math.max(prev - 1, 0);
    });
  };

  const getVisibleSteps = () => {
    const steps = ['welcome', 'why-roome', 'role-selection'];
    if (!onboardingData.browsingAsGuest && onboardingData.role) {
      steps.push('signup');
    }
    steps.push('completion');
    return steps;
  };

  const getCurrentStepIndex = () => {
    const visibleSteps = getVisibleSteps();
    const currentStepId = ONBOARDING_STEPS[currentStep]?.id;
    return visibleSteps.indexOf(currentStepId);
  };

  const getProgress = () => {
    const visibleSteps = getVisibleSteps();
    const currentIndex = getCurrentStepIndex();
    return ((currentIndex + 1) / visibleSteps.length) * 100;
  };

  const CurrentComponent = ONBOARDING_STEPS[currentStep]?.component;

  if (!CurrentComponent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col"
         data-testid="onboarding-flow">
      {/* Progress Bar - Only show after welcome screen */}
      {currentStep > 0 && (
        <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={prevStep}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                data-testid="button-back"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </motion.button>
              
              <div className="flex-1 mx-4">
                <div className="relative">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgress()}%` }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      data-testid="progress-bar"
                    />
                  </div>
                  
                  {/* Step Indicators */}
                  <div className="absolute -top-1 left-0 right-0 flex justify-between">
                    {getVisibleSteps().map((stepId, index) => {
                      const isCompleted = index < getCurrentStepIndex();
                      const isCurrent = index === getCurrentStepIndex();
                      
                      return (
                        <motion.div
                          key={stepId}
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            isCompleted ? "bg-cyan-500 border-cyan-500" :
                            isCurrent ? "bg-white border-cyan-500 shadow-md" :
                            "bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                          )}
                          initial={{ scale: 0.8 }}
                          animate={{ scale: isCurrent ? 1.2 : 1 }}
                          transition={{ duration: 0.2 }}
                          data-testid={`step-indicator-${index}`}
                        >
                          {isCompleted && (
                            <Check className="w-2 h-2 text-white" />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              <div className="w-10" /> {/* Spacer for alignment */}
            </div>
            
            {/* Step Title */}
            <motion.h2
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-gray-600 dark:text-gray-400 text-center"
              data-testid="step-title"
            >
              Step {getCurrentStepIndex() + 1} of {getVisibleSteps().length}
            </motion.h2>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              data-testid={`screen-${ONBOARDING_STEPS[currentStep]?.id}`}
            >
              <CurrentComponent
                data={onboardingData}
                updateData={updateOnboardingData}
                onNext={nextStep}
                onPrev={prevStep}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}