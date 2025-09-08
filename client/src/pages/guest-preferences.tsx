import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function GuestPreferences() {
  const [, setLocation] = useLocation();
  const { state, dispatch, validateStep } = useOnboarding();
  const [isNavigating, setIsNavigating] = useState(false);
  const [newHobby, setNewHobby] = useState('');

  const handleDescriptionChange = (description: string) => {
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { description } 
    });
  };

  const handleProfessionChange = (profession: string) => {
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { profession } 
    });
  };

  const handleAddHobby = () => {
    if (newHobby.trim() && !state.step3.hobbies.includes(newHobby.trim())) {
      const updatedHobbies = [...state.step3.hobbies, newHobby.trim()];
      dispatch({ 
        type: 'UPDATE_STEP3', 
        payload: { hobbies: updatedHobbies } 
      });
      setNewHobby('');
    }
  };

  const handleRemoveHobby = (hobbyToRemove: string) => {
    const updatedHobbies = state.step3.hobbies.filter(hobby => hobby !== hobbyToRemove);
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { hobbies: updatedHobbies } 
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddHobby();
    }
  };

  const handleNext = async () => {
    if (!validateStep(3)) {
      return;
    }

    setIsNavigating(true);
    
    try {
      // Navigate to completion or next appropriate screen
      // Since this is now the final step, we could navigate to a completion screen
      // For now, we'll navigate to the main app or dashboard
      setLocation('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  const handleBack = () => {
    setLocation('/guest-contact-verification');
  };

  const isFormValid = validateStep(3);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center app-content">
        <button 
          onClick={handleBack}
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
          <h1 className="text-lg font-semibold text-gray-900 text-center mb-3">About You</h1>
          <p className="text-sm text-gray-600 text-center">Tell us a bit about yourself (optional)</p>
        </div>
      </div>

      {/* Progress Bar - 3 steps total */}
      <div className="pb-4">
        <div className="responsive-container max-w-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-semibold text-white">✓</div>
              <div className="w-16 h-1" style={{ backgroundColor: '#0390D7' }}></div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-semibold text-white">✓</div>
              <div className="w-16 h-1" style={{ backgroundColor: '#0390D7' }}></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#0390D7', color: 'white' }}>3</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="responsive-container max-w-sm w-full pb-6">
          <div className="space-y-6">

            {/* Description */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Tell us about yourself</h3>
              <textarea
                placeholder="Share a bit about who you are, what you enjoy, your background..."
                value={state.step3.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                data-testid="textarea-description"
              />
              <p className="text-xs text-gray-500 mt-1">This helps others get to know you better</p>
            </div>

            {/* Profession */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">What do you do?</h3>
              <input
                type="text"
                placeholder="Student, Software Engineer, Doctor, Entrepreneur..."
                value={state.step3.profession}
                onChange={(e) => handleProfessionChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-profession"
              />
              <p className="text-xs text-gray-500 mt-1">Your profession or current occupation</p>
            </div>

            {/* Hobbies */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Hobbies & Interests</h3>
              
              {/* Add new hobby input */}
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Add a hobby or interest..."
                  value={newHobby}
                  onChange={(e) => setNewHobby(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="input-new-hobby"
                />
                <button
                  onClick={handleAddHobby}
                  disabled={!newHobby.trim()}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-add-hobby"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Display current hobbies */}
              {state.step3.hobbies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {state.step3.hobbies.map((hobby, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      data-testid={`chip-hobby-${index}`}
                    >
                      <span>{hobby}</span>
                      <button
                        onClick={() => handleRemoveHobby(hobby)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        data-testid={`button-remove-hobby-${index}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500">Share your hobbies, interests, or activities you enjoy</p>
            </div>

          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="p-4">
        <div className="responsive-container max-w-sm">
          <button 
            onClick={handleNext}
            disabled={isNavigating || !isFormValid}
            className={`w-full py-3 rounded-full text-white font-medium transition-all duration-200 ${
              isFormValid && !isNavigating
                ? 'bg-blue-500 hover:bg-blue-600 active:scale-95' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            data-testid="button-complete-signup"
          >
            {isNavigating ? 'Completing...' : 'Complete Sign Up'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            All fields are optional, but help us personalize your experience
          </p>
        </div>
      </div>
    </div>
  );
}