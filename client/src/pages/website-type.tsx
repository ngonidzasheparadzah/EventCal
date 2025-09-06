import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';

export default function WebsiteType() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<string>('Business');

  const websiteTypes = [
    {
      id: 'Business',
      label: 'Business',
      icon: '🏪',
      isSelected: true
    },
    {
      id: 'Personal', 
      label: 'Personal',
      icon: '📋',
      isSelected: false
    },
    {
      id: 'My Links',
      label: 'My Links',
      icon: '🗂️',
      isSelected: false,
      isNew: true
    }
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button 
          onClick={() => setLocation('/')}
          className="p-2 rounded-full hover:bg-gray-200"
          data-testid="button-back"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <div 
          className="px-6 py-2 rounded-full text-white text-sm font-medium"
          style={{ backgroundColor: '#1E5EFF' }}
        >
          Skip
        </div>
      </div>

      {/* Character and Question */}
      <div className="flex-1 px-4 py-2">
        <div className="max-w-sm mx-auto">
          {/* Character */}
          <div className="flex items-start mb-6">
            <div className="text-4xl mr-4">🤖</div>
            <div className="bg-white rounded-3xl rounded-tl-sm p-6 shadow-sm border border-gray-200 flex-1">
              <p className="text-lg font-medium text-gray-900">
                What type of website are you creating?
              </p>
            </div>
          </div>

          {/* Website Type Options */}
          <div className="space-y-4 mb-8">
            {websiteTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`w-full flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${
                  selectedType === type.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                data-testid={`button-select-${type.id.toLowerCase().replace(' ', '-')}`}
              >
                <div className="relative">
                  <div className="text-3xl mb-2">{type.icon}</div>
                  {type.isNew && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      NEW
                    </div>
                  )}
                </div>
                <span className={`font-medium ${
                  selectedType === type.id ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {type.label}
                </span>
                {selectedType === type.id && (
                  <div className="w-full h-1 bg-blue-500 rounded-full mt-3"></div>
                )}
              </button>
            ))}
          </div>

          {/* Business Description Image and Text */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mb-8">
            <div className="w-full h-48 bg-gray-100 rounded-2xl mb-4 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&crop=center"
                alt="Business team working"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-center text-gray-700 font-medium">
              Get your business online and showcase your services
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mb-8">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1E5EFF' }}></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
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