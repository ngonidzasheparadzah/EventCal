import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ChevronLeft, Home, Building, Wrench } from 'lucide-react';

export default function WebsiteType() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<string>('Guest');
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Handle click outside to unselect tabs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tabsContainerRef.current && !tabsContainerRef.current.contains(event.target as Node)) {
        setSelectedType('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const websiteTypes = [
    {
      id: 'Guest',
      label: "I'm looking for a Home",
      title: 'Guest',
      description: 'Find and book accommodation',
      icon: Home,
      isSelected: true
    },
    {
      id: 'Host', 
      label: "I'm looking for Tenants",
      title: 'Host',
      description: 'List your property for guests',
      icon: Building,
      isSelected: false
    },
    {
      id: 'Service Provider',
      label: "I'm looking for Clients",
      title: 'Service Provider',
      description: 'Offer services to hosts & guests',
      icon: Wrench,
      isSelected: false
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
          <div ref={tabsContainerRef} className="space-y-2 mb-8 animate-fade-in-delayed">
            {websiteTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`w-full flex items-center p-4 rounded-lg border-2 transition-all duration-150 ease-out hover:scale-105 active:scale-95 shadow-sm ${
                  selectedType === type.id 
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 scale-105 shadow-lg' 
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-lg hover:bg-gray-50'
                }`}
                data-testid={`button-select-${type.id.toLowerCase().replace(' ', '-')}`}
              >
                {/* Icon */}
                <div className={`mr-3 p-2 rounded-full ${
                  selectedType === type.id 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <type.icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className={`text-base font-bold mb-0.5 ${
                    selectedType === type.id ? 'text-blue-600' : 'text-gray-800'
                  }`}>
                    {type.title}
                  </div>
                  <div className={`text-sm font-medium mb-0.5 ${
                    selectedType === type.id ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    {type.label}
                  </div>
                  <div className={`text-xs ${
                    selectedType === type.id ? 'text-blue-500' : 'text-gray-500'
                  }`}>
                    {type.description}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedType === type.id && (
                  <div className="ml-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
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