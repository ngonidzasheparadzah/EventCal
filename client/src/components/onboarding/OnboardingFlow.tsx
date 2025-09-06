import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import WelcomeScreen from './screens/WelcomeScreen';
import WhyRooMeScreen from './screens/WhyRooMeScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import SignUpScreen from './screens/SignUpScreen';
import HostOnboardingScreen from './screens/HostOnboardingScreen';
import ServiceProviderOnboardingScreen from './screens/ServiceProviderOnboardingScreen';
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
  hostInfo?: {
    propertyType: string;
    propertyTitle: string;
    propertyDescription: string;
    verificationDocs: string[];
    instantBooking: boolean;
  };
  serviceProviderInfo?: {
    services: string[];
    availability: string[];
    verificationDocs: string[];
    businessName?: string;
  };
  browsingAsGuest: boolean;
}

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome', component: WelcomeScreen },
  { id: 'why-roome', title: 'Why RooMe', component: WhyRooMeScreen },
  { id: 'role-selection', title: 'Role Selection', component: RoleSelectionScreen },
  { id: 'signup', title: 'Sign Up', component: SignUpScreen },
  { id: 'host-details', title: 'Host Details', component: HostOnboardingScreen },
  { id: 'service-details', title: 'Service Details', component: ServiceProviderOnboardingScreen },
  { id: 'completion', title: 'Complete', component: CompletionScreen },
];

export default function OnboardingFlow() {
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
      if (prev === 3 && onboardingData.browsingAsGuest) {
        return 6; // Jump to completion for guest browsing
      }
      if (prev === 3 && onboardingData.role === 'guest') {
        return 6; // Jump to completion for guest role
      }
      if (prev === 3 && onboardingData.role === 'host') {
        return 4; // Go to host details
      }
      if (prev === 3 && onboardingData.role === 'service_provider') {
        return 5; // Go to service provider details
      }
      if (prev === 4 || prev === 5) {
        return 6; // Go to completion
      }
      return Math.min(prev + 1, ONBOARDING_STEPS.length - 1);
    });
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep(prev => {
      // Handle back navigation based on current step
      if (prev === 4 || prev === 5) {
        return 3; // Back to role selection from role-specific steps
      }
      if (prev === 6 && onboardingData.role === 'host') {
        return 4; // Back to host details
      }
      if (prev === 6 && onboardingData.role === 'service_provider') {
        return 5; // Back to service provider details
      }
      if (prev === 6 && (onboardingData.role === 'guest' || onboardingData.browsingAsGuest)) {
        return 3; // Back to role selection
      }
      return Math.max(prev - 1, 0);
    });
  };

  const getVisibleSteps = () => {
    const steps = ['welcome', 'why-roome', 'role-selection', 'signup'];
    if (onboardingData.role === 'host') {
      steps.push('host-details');
    } else if (onboardingData.role === 'service_provider') {
      steps.push('service-details');
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
    <div className=\"min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col\"\n         data-testid=\"onboarding-flow\">\n      {/* Progress Bar */}\n      <div className=\"sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700\">\n        <div className=\"container mx-auto px-4 py-4\">\n          <div className=\"flex items-center justify-between mb-4\">\n            {currentStep > 0 && (\n              <motion.button\n                initial={{ opacity: 0, x: -20 }}\n                animate={{ opacity: 1, x: 0 }}\n                onClick={prevStep}\n                className=\"p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors\"\n                data-testid=\"button-back\"\n              >\n                <ChevronLeft className=\"w-5 h-5 text-gray-600 dark:text-gray-400\" />\n              </motion.button>\n            )}\n            \n            <div className=\"flex-1 mx-4\">\n              <div className=\"relative\">\n                <div className=\"h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden\">\n                  <motion.div\n                    className=\"h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full\"\n                    initial={{ width: 0 }}\n                    animate={{ width: `${getProgress()}%` }}\n                    transition={{ duration: 0.5, ease: \"easeInOut\" }}\n                    data-testid=\"progress-bar\"\n                  />\n                </div>\n                \n                {/* Step Indicators */}\n                <div className=\"absolute -top-1 left-0 right-0 flex justify-between\">\n                  {getVisibleSteps().map((stepId, index) => {\n                    const isCompleted = index < getCurrentStepIndex();\n                    const isCurrent = index === getCurrentStepIndex();\n                    \n                    return (\n                      <motion.div\n                        key={stepId}\n                        className={cn(\n                          \"w-4 h-4 rounded-full border-2 flex items-center justify-center\",\n                          isCompleted ? \"bg-blue-500 border-blue-500\" :\n                          isCurrent ? \"bg-white border-blue-500 shadow-md\" :\n                          \"bg-gray-200 border-gray-300 dark:bg-gray-700 dark:border-gray-600\"\n                        )}\n                        initial={{ scale: 0.8 }}\n                        animate={{ scale: isCurrent ? 1.2 : 1 }}\n                        transition={{ duration: 0.2 }}\n                        data-testid={`step-indicator-${index}`}\n                      >\n                        {isCompleted && (\n                          <Check className=\"w-2 h-2 text-white\" />\n                        )}\n                      </motion.div>\n                    );\n                  })}\n                </div>\n              </div>\n            </div>\n            \n            <div className=\"w-10\" /> {/* Spacer for alignment */}\n          </div>\n          \n          {/* Step Title */}\n          <motion.h2\n            key={currentStep}\n            initial={{ opacity: 0, y: 10 }}\n            animate={{ opacity: 1, y: 0 }}\n            className=\"text-sm font-medium text-gray-600 dark:text-gray-400 text-center\"\n            data-testid=\"step-title\"\n          >\n            Step {getCurrentStepIndex() + 1} of {getVisibleSteps().length}\n          </motion.h2>\n        </div>\n      </div>\n\n      {/* Content Area */}\n      <div className=\"flex-1 flex items-center justify-center p-4\">\n        <div className=\"w-full max-w-md\">\n          <AnimatePresence mode=\"wait\" custom={direction}>\n            <motion.div\n              key={currentStep}\n              custom={direction}\n              initial={{ opacity: 0, x: direction * 50 }}\n              animate={{ opacity: 1, x: 0 }}\n              exit={{ opacity: 0, x: direction * -50 }}\n              transition={{ duration: 0.3, ease: \"easeInOut\" }}\n              data-testid={`screen-${ONBOARDING_STEPS[currentStep]?.id}`}\n            >\n              <CurrentComponent\n                data={onboardingData}\n                updateData={updateOnboardingData}\n                onNext={nextStep}\n                onPrev={prevStep}\n              />\n            </motion.div>\n          </AnimatePresence>\n        </div>\n      </div>\n    </div>\n  );\n}