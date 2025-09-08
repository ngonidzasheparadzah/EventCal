import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types for onboarding state
export interface OnboardingStep1Data {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface OnboardingStep2Data {
  phoneNumber: string;
  city: string;
  address: string;
  agreeToTerms: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  otpCode: string;
}

export interface OnboardingStep3Data {
  accommodationType: string[];
  priceRange: [number, number];
  amenities: string[];
  location: string;
}

export interface OnboardingState {
  currentStep: number;
  userId: string | null;
  isLoading: boolean;
  errors: { [key: string]: string };
  step1: OnboardingStep1Data;
  step2: OnboardingStep2Data;
  step3: OnboardingStep3Data;
}

// Action types
type OnboardingAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_USER_ID'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERRORS'; payload: { [key: string]: string } }
  | { type: 'UPDATE_STEP1'; payload: Partial<OnboardingStep1Data> }
  | { type: 'UPDATE_STEP2'; payload: Partial<OnboardingStep2Data> }
  | { type: 'UPDATE_STEP3'; payload: Partial<OnboardingStep3Data> }
  | { type: 'RESET_ERRORS' }
  | { type: 'LOAD_FROM_STORAGE' };

// Initial state
const initialState: OnboardingState = {
  currentStep: 1,
  userId: null,
  isLoading: false,
  errors: {},
  step1: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  },
  step2: {
    phoneNumber: '',
    city: '',
    address: '',
    agreeToTerms: false,
    emailVerified: false,
    phoneVerified: false,
    otpCode: ''
  },
  step3: {
    accommodationType: [],
    priceRange: [0, 1000],
    amenities: [],
    location: ''
  }
};

// Reducer
function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'UPDATE_STEP1':
      return { 
        ...state, 
        step1: { ...state.step1, ...action.payload }
      };
    case 'UPDATE_STEP2':
      return { 
        ...state, 
        step2: { ...state.step2, ...action.payload }
      };
    case 'UPDATE_STEP3':
      return { 
        ...state, 
        step3: { ...state.step3, ...action.payload }
      };
    case 'RESET_ERRORS':
      return { ...state, errors: {} };
    case 'LOAD_FROM_STORAGE':
      const savedState = localStorage.getItem('onboardingState');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          return { ...state, ...parsedState };
        } catch (error) {
          console.error('Failed to parse saved onboarding state:', error);
        }
      }
      return state;
    default:
      return state;
  }
}

// Context
interface OnboardingContextType {
  state: OnboardingState;
  dispatch: React.Dispatch<OnboardingAction>;
  validateStep: (step: number) => boolean;
  canAdvanceToStep: (step: number) => boolean;
  saveToStorage: () => void;
  sendOTP: () => Promise<boolean>;
  verifyOTP: (code: string) => Promise<boolean>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Provider component
export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    dispatch({ type: 'LOAD_FROM_STORAGE' });
  }, []);

  // Save state to localStorage whenever it changes
  const saveToStorage = () => {
    const stateToSave = {
      currentStep: state.currentStep,
      userId: state.userId,
      step1: state.step1,
      step2: state.step2,
      step3: state.step3
    };
    localStorage.setItem('onboardingState', JSON.stringify(stateToSave));
  };

  // Save to storage whenever relevant state changes
  useEffect(() => {
    saveToStorage();
  }, [state.currentStep, state.userId, state.step1, state.step2, state.step3]);

  // Validation functions
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      default:
        return false;
    }
  };

  const validateStep1 = (): boolean => {
    const { fullName, email, password, confirmPassword } = state.step1;
    
    // Check all required fields
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    
    // Password validation
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLongEnough = password.length >= 8;
    
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSymbol || !isLongEnough) {
      return false;
    }
    
    // Password confirmation
    if (password !== confirmPassword) {
      return false;
    }
    
    return true;
  };

  const validateStep2 = (): boolean => {
    const { phoneNumber, city, address, agreeToTerms, phoneVerified } = state.step2;
    
    // Check required fields
    if (!phoneNumber.trim() || !city || !address.trim() || !agreeToTerms) {
      return false;
    }
    
    // Phone number validation (Zimbabwe format)
    const phoneRegex = /^(\+263|0)(7[0-9]|86)[0-9]{7}$/;
    if (!phoneRegex.test(phoneNumber.replace(/\s/g, ''))) {
      return false;
    }
    
    // Phone must be verified
    if (!phoneVerified) {
      return false;
    }
    
    return true;
  };

  const validateStep3 = (): boolean => {
    const { accommodationType, priceRange } = state.step3;
    
    // At least one accommodation type selected
    if (accommodationType.length === 0) {
      return false;
    }
    
    // Valid price range
    if (priceRange[0] < 0 || priceRange[1] <= priceRange[0]) {
      return false;
    }
    
    return true;
  };

  const canAdvanceToStep = (targetStep: number): boolean => {
    // Can only advance to next step if current step is valid
    const currentStepValid = validateStep(state.currentStep);
    return currentStepValid && targetStep === state.currentStep + 1;
  };

  // OTP functions
  const sendOTP = async (): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: state.step2.phoneNumber,
          userId: state.userId
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return true;
      } else {
        dispatch({ type: 'SET_ERRORS', payload: { otp: result.message || 'Failed to send OTP' } });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERRORS', payload: { otp: 'Network error. Please try again.' } });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const verifyOTP = async (code: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: state.step2.phoneNumber,
          otpCode: code,
          userId: state.userId
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        dispatch({ type: 'UPDATE_STEP2', payload: { phoneVerified: true, otpCode: code } });
        return true;
      } else {
        dispatch({ type: 'SET_ERRORS', payload: { otp: result.message || 'Invalid OTP code' } });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERRORS', payload: { otp: 'Network error. Please try again.' } });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const contextValue: OnboardingContextType = {
    state,
    dispatch,
    validateStep,
    canAdvanceToStep,
    saveToStorage,
    sendOTP,
    verifyOTP,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

// Hook to use the context
export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}