import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, X, Plus } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function GuestPreferences() {
  const [, setLocation] = useLocation();
  const { state, dispatch, validateStep } = useOnboarding();
  const [isNavigating, setIsNavigating] = useState(false);
  const [newHobby, setNewHobby] = useState('');

  // Amenity options
  const amenityOptions = [
    { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
    { id: 'parking', name: 'Parking', icon: '🚗' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'laundry', name: 'Laundry', icon: '👕' },
    { id: 'gym', name: 'Gym', icon: '💪' },
    { id: 'pool', name: 'Pool', icon: '🏊' },
    { id: 'garden', name: 'Garden', icon: '🌿' },
    { id: 'security', name: '24/7 Security', icon: '🔒' },
    { id: 'cleaning', name: 'Cleaning Service', icon: '🧽' },
    { id: 'balcony', name: 'Balcony', icon: '🏗️' },
    { id: 'aircon', name: 'Air Conditioning', icon: '❄️' },
    { id: 'heating', name: 'Heating', icon: '🔥' }
  ];

  // Roommate preference options
  const roommateOptions = [
    { id: 'quiet', name: 'Quiet environment', icon: '🤫' },
    { id: 'social', name: 'Social atmosphere', icon: '🎉' },
    { id: 'student', name: 'Students preferred', icon: '🎓' },
    { id: 'professional', name: 'Working professionals', icon: '💼' },
    { id: 'mature', name: 'Mature adults (25+)', icon: '👥' },
    { id: 'young', name: 'Young adults (18-25)', icon: '🧑‍🤝‍🧑' },
    { id: 'no_smoking', name: 'Non-smoking only', icon: '🚭' },
    { id: 'pets_ok', name: 'Pet-friendly', icon: '🐕' },
    { id: 'mixed_gender', name: 'Mixed gender', icon: '👫' },
    { id: 'female_only', name: 'Female residents only', icon: '👩' },
    { id: 'male_only', name: 'Male residents only', icon: '👨' },
    { id: 'clean', name: 'Clean & organized', icon: '✨' }
  ];

  const handleAccommodationLookingForChange = (value: string) => {
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { accommodationLookingFor: value } 
    });
  };

  const handleOccupationChange = (value: string) => {
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { occupation: value } 
    });
  };

  const handleAddHobby = () => {
    if (newHobby.trim() && !(state.step3.hobbies || []).includes(newHobby.trim())) {
      const updatedHobbies = [...(state.step3.hobbies || []), newHobby.trim()];
      dispatch({ 
        type: 'UPDATE_STEP3', 
        payload: { hobbies: updatedHobbies } 
      });
      setNewHobby('');
    }
  };

  const handleRemoveHobby = (hobbyToRemove: string) => {
    const updatedHobbies = (state.step3.hobbies || []).filter(hobby => hobby !== hobbyToRemove);
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

  const handleAmenityToggle = (amenityId: string) => {
    const currentAmenities = state.step3.preferredAmenities || [];
    const updatedAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { preferredAmenities: updatedAmenities } 
    });
  };

  // Define conflicting preference groups
  const conflictGroups = [
    ['student', 'professional'], // Students vs Working professionals
    ['mature', 'young'], // Mature adults vs Young adults  
    ['mixed_gender', 'female_only', 'male_only'], // Gender preferences (mutually exclusive)
    ['quiet', 'social'] // Quiet vs Social environment
  ];

  const handleRoommatePreferenceToggle = (prefId: string) => {
    const currentPrefs = state.step3.roommatePreferences || [];
    
    // If already selected, just remove it
    if (currentPrefs.includes(prefId)) {
      const updatedPrefs = currentPrefs.filter(id => id !== prefId);
      dispatch({ 
        type: 'UPDATE_STEP3', 
        payload: { roommatePreferences: updatedPrefs } 
      });
      return;
    }
    
    // Find which conflict group this preference belongs to
    const conflictGroup = conflictGroups.find(group => group.includes(prefId));
    
    let updatedPrefs = [...currentPrefs];
    
    // If this preference belongs to a conflict group, remove other options from that group
    if (conflictGroup) {
      const conflictingOptions = conflictGroup.filter(option => option !== prefId);
      updatedPrefs = updatedPrefs.filter(pref => !conflictingOptions.includes(pref));
    }
    
    // Add the new preference
    updatedPrefs = [...updatedPrefs, prefId];
    
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { roommatePreferences: updatedPrefs } 
    });
  };

  // API mutation to save user preferences
  const savePreferencesMutation = useMutation({
    mutationFn: async (preferences: {
      preferredAmenities: string[];
      accommodationLookingFor: string;
      roommatePreferences: string[];
      hobbies: string[];
      occupation: string;
    }) => {
      const response = await fetch(`/api/user/${state.userId}/preferences`, {
        method: 'POST',
        body: JSON.stringify(preferences),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to save preferences');
      }
      
      return await response.json();
    },
  });

  // API mutation to update onboarding step
  const updateOnboardingStepMutation = useMutation({
    mutationFn: async (step: number) => {
      const response = await fetch(`/api/user/${state.userId}/onboarding`, {
        method: 'PATCH',
        body: JSON.stringify({ step }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to update onboarding step');
      }
      
      return await response.json();
    },
  });

  const handleNext = async () => {
    setIsNavigating(true);
    
    try {
      // Create complete account with all collected data
      const completeAccountData = {
        // Stage 1 data
        fullName: state.step1.fullName,
        email: state.step1.email,
        password: state.step1.password,
        // Stage 2 data
        phoneNumber: state.step2.phoneNumber,
        city: state.step2.city,
        address: state.step2.address,
        // Stage 3 data
        preferences: {
          preferredAmenities: state.step3.preferredAmenities || [],
          accommodationLookingFor: state.step3.accommodationLookingFor || '',
          roommatePreferences: state.step3.roommatePreferences || [],
          hobbies: state.step3.hobbies || [],
          occupation: state.step3.occupation || '',
        }
      };

      // Create complete account
      const response = await fetch('/api/auth/complete-signup', {
        method: 'POST',
        body: JSON.stringify(completeAccountData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to create account');
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Complete account created successfully:', data.user);
        
        // Navigate to dashboard
        setLocation('/dashboard');
      } else {
        throw new Error(data.message || 'Failed to create account');
      }
      
    } catch (error) {
      console.error('Error completing signup:', error);
      // Could add error state here to show user the error
    } finally {
      setIsNavigating(false);
    }
  };


  const handleBack = () => {
    setLocation('/guest-contact-verification');
  };

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
          <p className="text-sm text-gray-600 text-center">Help us understand your preferences (optional)</p>
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

            {/* What do you look for in accommodation */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">What do you look for in accommodation?</h3>
              <textarea
                placeholder="Describe what's important to you in accommodation - location, atmosphere, amenities, etc..."
                value={state.step3.accommodationLookingFor}
                onChange={(e) => handleAccommodationLookingForChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                data-testid="textarea-accommodation-looking-for"
              />
              <p className="text-xs text-gray-500 mt-1">This helps us show you the most relevant accommodations</p>
            </div>

            {/* Preferred Amenities */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Preferred Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {amenityOptions.map(amenity => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.id)}
                    className={`p-2 rounded-lg border text-left transition-all duration-200 ${
                      (state.step3.preferredAmenities || []).includes(amenity.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    data-testid={`button-amenity-${amenity.id}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{amenity.icon}</span>
                      <span className="text-xs font-medium text-gray-900">{amenity.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Select the amenities most important to you</p>
            </div>

            {/* Roommate Preferences */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Roommate & Environment Preferences</h3>
              <div className="grid grid-cols-2 gap-2">
                {roommateOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleRoommatePreferenceToggle(option.id)}
                    className={`p-2 rounded-lg border text-left transition-all duration-200 ${
                      (state.step3.roommatePreferences || []).includes(option.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    data-testid={`button-roommate-${option.id}`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{option.icon}</span>
                      <span className="text-xs font-medium text-gray-900">{option.name}</span>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Tell us about your ideal living environment</p>
            </div>

            {/* Occupation */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Occupation</h3>
              <input
                type="text"
                placeholder="Student, Software Engineer, Doctor, Entrepreneur..."
                value={state.step3.occupation || ''}
                onChange={(e) => handleOccupationChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="input-occupation"
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
              {(state.step3.hobbies || []).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {(state.step3.hobbies || []).map((hobby, index) => (
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

      {/* Action Button */}
      <div className="p-4">
        <div className="responsive-container max-w-sm">
          <button 
            onClick={handleNext}
            disabled={isNavigating}
            className={`w-full py-3 rounded-full text-white font-medium transition-all duration-200 ${
              !isNavigating
                ? 'bg-blue-500 hover:bg-blue-600 active:scale-95' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            data-testid="button-complete-signup"
          >
            {isNavigating ? 'Completing...' : 'Complete Sign Up'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-2">
            All preferences are optional and can be updated later
          </p>
        </div>
      </div>
    </div>
  );
}