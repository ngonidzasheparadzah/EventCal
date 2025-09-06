import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';

export default function WebsiteType() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<string>('Guest');

  const websiteTypes = [
    {
      id: 'Guest',
      label: "I'm looking for a Home",
      title: 'Guest',
      isSelected: true
    },
    {
      id: 'Host', 
      label: "I'm looking for Tenants",
      title: 'Host',
      isSelected: false
    },
    {
      id: 'Service Provider',
      label: "I'm looking for Clients",
      title: 'Service Provider',
      isSelected: false,
      isNew: true
    }
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <button 
          onClick={() => setLocation('/')}
          className="px-4 py-2 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#1E5EFF' }}
          data-testid="button-back"
        >
          <ChevronLeft className="w-4 h-4 inline mr-1" />
          Back
        </button>
      </div>

      {/* Character and Question */}
      <div className="flex-1 px-4 py-4 flex flex-col justify-center">
        <div className="max-w-sm mx-auto">
          {/* Question */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-base font-medium text-gray-900">
              What best describes your visit to RooMe?
            </h1>
          </div>

          {/* Website Type Options */}
          <div className="space-y-3 mb-12 animate-fade-in-delayed">
            {websiteTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`w-full flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                  selectedType === type.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                data-testid={`button-select-${type.id.toLowerCase().replace(' ', '-')}`}
              >
                <div className="relative">
                  <div className={`text-lg font-bold mb-2 ${
                    selectedType === type.id ? 'text-blue-600' : 'text-gray-800'
                  }`}>
                    {type.title}
                  </div>
                  {type.isNew && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      NEW
                    </div>
                  )}
                </div>
                <span className={`text-xs font-medium ${
                  selectedType === type.id ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {type.label}
                </span>
                {selectedType === type.id && (
                  <div className="w-full h-1 bg-blue-500 rounded-full mt-2"></div>
                )}
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <Button
            className="w-full h-14 text-lg font-semibold shadow-lg rounded-2xl border-0"
            style={{ 
              backgroundColor: '#1E5EFF',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#174ACC'}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1E5EFF'}
            onClick={() => setLocation('/next-step')}
            data-testid="button-continue"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}