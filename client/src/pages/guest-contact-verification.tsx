import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function GuestContactVerification() {
  const [, setLocation] = useLocation();
  const { state, dispatch, validateStep, canAdvanceToStep } = useOnboarding();
  const [isNavigating, setIsNavigating] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  // Get user data from localStorage (fallback) or context
  const [userData, setUserData] = useState<any>(null);
  
  useEffect(() => {
    if (state.step1.email) {
      setUserData({ email: state.step1.email });
    } else {
      // Fallback to localStorage for existing users
      const email = localStorage.getItem('userEmail');
      if (email) {
        setUserData({ email });
      }
    }
  }, [state.step1.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    // Update onboarding context
    dispatch({
      type: 'UPDATE_STEP2',
      payload: { [name]: newValue }
    });
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Phone number validation (Zimbabwe format)
    const phoneRegex = /^(\+263|0)(7[0-9]|86)[0-9]{7}$/;
    if (!state.step2.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!phoneRegex.test(state.step2.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid Zimbabwe phone number (e.g., +263771234567 or 0771234567)';
    }
    
    // City validation
    if (!state.step2.city) {
      newErrors.city = 'City is required';
    }
    
    // Address validation
    if (!state.step2.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    // Terms validation
    if (!state.step2.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendEmailVerification = async () => {
    setEmailVerificationSent(true);
    // In a real app, you'd send verification email here
    setTimeout(() => {
      dispatch({ type: 'UPDATE_STEP2', payload: { emailVerified: true } });
    }, 2000);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsNavigating(true);
        
        if (state.userId) {
          // Save contact information
          const contactResponse = await fetch(`/api/user/${state.userId}/contact`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              phoneNumber: state.step2.phoneNumber,
              city: state.step2.city,
              address: state.step2.address
            }),
          });
          
          if (!contactResponse.ok) {
            setErrors({ general: 'Failed to save contact information. Please try again.' });
            return;
          }
          
          // Update onboarding step
          const onboardingResponse = await fetch(`/api/user/${state.userId}/onboarding`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ step: 3 }),
          });
          
          if (onboardingResponse.ok) {
            // Update context step
            dispatch({ type: 'SET_CURRENT_STEP', payload: 3 });
            
            // Proceed to step 3: Preferences
            setLocation('/guest-preferences');
          } else {
            setErrors({ general: 'Failed to update profile. Please try again.' });
          }
        }
        
      } catch (error) {
        console.error('Update error:', error);
        setErrors({ general: 'Network error. Please try again.' });
      } finally {
        setIsNavigating(false);
      }
    }
  };

  const zimbabweCities = [
    'Harare', 'Bulawayo', 'Chitungwiza', 'Mutare', 'Gweru', 
    'Kwekwe', 'Kadoma', 'Masvingo', 'Chinhoyi', 'Norton',
    'Marondera', 'Ruwa', 'Chegutu', 'Zvishavane', 'Bindura',
    'Beitbridge', 'Redcliff', 'Victoria Falls', 'Hwange', 'Chiredzi'
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center app-content">
        <button 
          onClick={() => setLocation('/guest-signup')}
          className="px-4 py-2 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#0390D7' }}
          data-testid="button-back"
        >
          <ChevronLeft className="w-4 h-4 inline mr-1" />
          Back
        </button>
      </div>

      {/* Page Title */}
      <div className="pb-2">
        <div className="responsive-container max-w-sm">
          <h1 className="text-lg font-semibold text-gray-900 text-center mb-3">Contact & Verification</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="pb-4">
        <div className="responsive-container max-w-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-semibold text-white">✓</div>
              <div className="w-16 h-1" style={{ backgroundColor: '#0390D7' }}></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#0390D7', color: 'white' }}>2</div>
              <div className="w-16 h-1 bg-gray-200"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-400">3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="responsive-container max-w-sm w-full">

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Verification Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center">
                  <div className="text-blue-600 text-lg mr-3">✉️</div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Email Verification</p>
                    <p className="text-xs text-blue-600">{userData?.email}</p>
                  </div>
                </div>
                {state.step2.emailVerified ? (
                  <div className="text-green-600 text-lg">✅</div>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendEmailVerification}
                    disabled={emailVerificationSent}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    data-testid="button-verify-email"
                  >
                    {emailVerificationSent ? 'Sent ✓' : 'Verify'}
                  </button>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-lg">
                📱
              </div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number (e.g., +263771234567)"
                value={state.step2.phoneNumber}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                data-testid="input-phone"
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* City Selection */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-lg">
                🏙️
              </div>
              <select
                name="city"
                value={state.step2.city}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 appearance-none bg-white ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                data-testid="select-city"
              >
                <option value="">Select your city</option>
                {zimbabweCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>

            {/* Address */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-lg">
                🏠
              </div>
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={state.step2.address}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                data-testid="input-address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3 mt-6">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={state.step2.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                data-testid="checkbox-terms"
              />
              <label className="text-sm text-gray-700">
                I agree to the{' '}
                <button type="button" className="text-blue-600 underline hover:text-blue-800">
                  Terms and Conditions
                </button>
                {' '}and{' '}
                <button type="button" className="text-blue-600 underline hover:text-blue-800">
                  Privacy Policy
                </button>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>}

            {/* General Error */}
            {errors.general && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Continue Button */}
            <button
              type="submit"
              className="w-full h-14 text-lg font-semibold shadow-lg rounded-2xl border-0 mt-6"
              style={{ 
                backgroundColor: isNavigating ? '#9CA3AF' : '#0390D7',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => !isNavigating && (e.currentTarget.style.backgroundColor = '#027BB8')}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => !isNavigating && (e.currentTarget.style.backgroundColor = '#0390D7')}
              data-testid="button-continue"
              disabled={isNavigating}
            >
              {isNavigating ? 'Updating Profile...' : 'Continue'}
            </button>
          </form>

          {/* Skip Link */}
          <div className="text-center mt-6">
            <button 
              onClick={() => setLocation('/guest-preferences')}
              className="text-gray-600 font-medium hover:underline text-sm"
              data-testid="button-skip"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}