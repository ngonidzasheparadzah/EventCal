import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function GuestPreferences() {
  const [, setLocation] = useLocation();
  const { state, dispatch, validateStep, canAdvanceToStep } = useOnboarding();
  const [isNavigating, setIsNavigating] = useState(false);

  const accommodationTypes = [
    { id: 'boarding_house', name: 'Boarding House', icon: '🏠' },
    { id: 'private_room', name: 'Private Room', icon: '🛏️' },
    { id: 'lodge', name: 'Lodge', icon: '🏕️' },
    { id: 'hotel', name: 'Hotel', icon: '🏨' },
    { id: 'apartment', name: 'Apartment', icon: '🏢' },
    { id: 'guesthouse', name: 'Guesthouse', icon: '🏡' }
  ];

  const amenityOptions = [
    { id: 'wifi', name: 'Wi-Fi', icon: '📶' },
    { id: 'parking', name: 'Parking', icon: '🚗' },
    { id: 'kitchen', name: 'Kitchen', icon: '🍳' },
    { id: 'laundry', name: 'Laundry', icon: '👕' },
    { id: 'gym', name: 'Gym', icon: '💪' },
    { id: 'pool', name: 'Pool', icon: '🏊' },
    { id: 'garden', name: 'Garden', icon: '🌿' },
    { id: 'security', name: '24/7 Security', icon: '🔒' }
  ];

  const handleAccommodationTypeChange = (typeId: string) => {
    const currentTypes = state.step3.accommodationType;
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter(id => id !== typeId)
      : [...currentTypes, typeId];
    
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { accommodationType: newTypes } 
    });
  };

  const handleAmenityChange = (amenityId: string) => {
    const currentAmenities = state.step3.amenities;
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { amenities: newAmenities } 
    });
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange: [number, number] = [...state.step3.priceRange];
    newRange[index] = value;
    
    // Ensure min doesn't exceed max
    if (index === 0 && value > newRange[1]) {
      newRange[1] = value;
    }
    // Ensure max isn't less than min
    if (index === 1 && value < newRange[0]) {
      newRange[0] = value;
    }
    
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { priceRange: newRange } 
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ 
      type: 'UPDATE_STEP3', 
      payload: { location: e.target.value } 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(3)) {
      dispatch({ 
        type: 'SET_ERRORS', 
        payload: { step3: 'Please select at least one accommodation type and set a valid price range' } 
      });
      return;
    }

    try {
      setIsNavigating(true);
      
      // Update user with preferences
      if (state.userId) {
        const response = await fetch(`/api/user/${state.userId}/onboarding`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ step: 4 }),
        });
        
        if (response.ok) {
          // Onboarding complete! Navigate to home
          localStorage.removeItem('onboardingState'); // Clear onboarding data
          setLocation('/');
        } else {
          dispatch({ 
            type: 'SET_ERRORS', 
            payload: { step3: 'Failed to complete onboarding. Please try again.' } 
          });
        }
      }
      
    } catch (error) {
      console.error('Complete onboarding error:', error);
      dispatch({ 
        type: 'SET_ERRORS', 
        payload: { step3: 'Network error. Please try again.' } 
      });
    } finally {
      setIsNavigating(false);
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
          onClick={() => setLocation('/guest-contact-verification')}
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
          <h1 className="text-lg font-semibold text-gray-900 text-center mb-3">Your Preferences</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="pb-4">
        <div className="responsive-container max-w-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-semibold text-white">✓</div>
              <div className="w-12 h-1" style={{ backgroundColor: '#0390D7' }}></div>
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-semibold text-white">✓</div>
              <div className="w-12 h-1" style={{ backgroundColor: '#0390D7' }}></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#0390D7', color: 'white' }}>3</div>
              <div className="w-12 h-1 bg-gray-200"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-400">4</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="responsive-container max-w-sm w-full pb-6">

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Accommodation Types */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">What type of accommodation are you looking for?</h3>
              <div className="grid grid-cols-2 gap-3">
                {accommodationTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleAccommodationTypeChange(type.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                      state.step3.accommodationType.includes(type.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                    data-testid={`button-accommodation-${type.id}`}
                  >
                    <div className="text-lg mb-1">{type.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{type.name}</div>
                  </button>
                ))}
              </div>
              {state.step3.accommodationType.length === 0 && state.errors.step3 && (
                <p className="text-red-500 text-xs mt-2">Please select at least one accommodation type</p>
              )}
            </div>

            {/* Price Range */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Price Range (USD per night)</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={state.step3.priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(0, parseInt(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="input-price-min"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        min="0"
                        max="1000"
                        value={state.step3.priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(1, parseInt(e.target.value) || 0)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        data-testid="input-price-max"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center text-sm text-gray-600">
                  ${state.step3.priceRange[0]} - ${state.step3.priceRange[1]} per night
                </div>
              </div>
            </div>

            {/* Preferred Location */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Preferred Location</h3>
              <select
                value={state.step3.location}
                onChange={handleLocationChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                data-testid="select-location"
              >
                <option value="">Any location</option>
                {zimbabweCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Preferred Amenities (Optional)</h3>
              <div className="grid grid-cols-2 gap-2">
                {amenityOptions.map(amenity => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => handleAmenityChange(amenity.id)}
                    className={`p-2 rounded-lg border text-left transition-all duration-200 ${
                      state.step3.amenities.includes(amenity.id)
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
            </div>

            {/* Error Display */}
            {state.errors.step3 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm">{state.errors.step3}</p>
              </div>
            )}

            {/* Complete Button */}
            <button
              type="submit"
              className="w-full h-14 text-lg font-semibold shadow-lg rounded-2xl border-0 mt-6"
              style={{ 
                backgroundColor: isNavigating ? '#9CA3AF' : '#0390D7',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => !isNavigating && (e.currentTarget.style.backgroundColor = '#027BB8')}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => !isNavigating && (e.currentTarget.style.backgroundColor = '#0390D7')}
              data-testid="button-complete"
              disabled={isNavigating}
            >
              {isNavigating ? 'Completing Setup...' : 'Complete Setup'}
            </button>
          </form>

          {/* Skip Link */}
          <div className="text-center mt-6">
            <button 
              onClick={() => setLocation('/')}
              className="text-gray-600 font-medium hover:underline text-sm"
              data-testid="button-skip"
            >
              Skip preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}