import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import interiorImageUrl from '@assets/adc0bb02ab607b07cc71434fa22cb839_1757163627498.jpg';
import propertyImageUrl from '@assets/4d8f2d40ea93693d1b35f72e0700f452_1757166284914.jpg';
import servicesImageUrl from '@assets/02e413ffda63af7c548cfa3128373ec2_1757166641084.jpg';
import logoUrl from '@assets/BackgroundEraser_20250906_144355719_1757164631834.png';

export default function OnboardingDemo() {
  const [, setLocation] = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      image: interiorImageUrl,
      text: "Find accommodation across Zimbabwe"
    },
    {
      image: propertyImageUrl,
      text: "List your property"
    },
    {
      image: servicesImageUrl,
      text: "Provide Services"
    }
  ];

  // Auto-scroll every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => {
        const nextSlide = (prevSlide + 1) % slides.length;
        return nextSlide;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Reset to first slide on mount to ensure consistent state
  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-between px-4 py-4">
      <div className="w-full max-w-sm mx-auto flex flex-col justify-between h-full">
        {/* Logo and Title */}
        <div className="text-center pt-2">
          <img 
            src={logoUrl} 
            alt="RooMe Logo" 
            className="w-32 h-32 mx-auto"
          />
          <h1 className="text-2xl font-semibold" style={{ color: '#2C2C2C' }}>
            Welcome to <span style={{ color: '#1E5EFF' }}>RooMe</span>.
          </h1>
        </div>
        
        {/* Hero Image */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div 
            className="w-full relative overflow-hidden rounded-3xl shadow-2xl cursor-pointer"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          >
            <img 
              key={currentSlide}
              src={slides[currentSlide].image} 
              alt="Property showcase" 
              className="w-full h-56 object-cover transition-all duration-500"
            />
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="space-y-4 pb-4">
          {/* Subtitle */}
          <div className="text-center">
            <p className="text-base text-gray-600 dark:text-gray-400 font-medium transition-all duration-500">
              {slides[currentSlide].text}
            </p>
          </div>
          
          {/* Progress Dots */}
          <div className="flex justify-center space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full cursor-pointer transition-colors duration-300"
                style={{
                  backgroundColor: currentSlide === index ? '#1E5EFF' : '#d1d5db'
                }}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
          
          {/* CTA Button */}
          <Button
            className="w-full h-12 text-lg font-semibold shadow-lg rounded-2xl border-0 transition-colors duration-200"
            style={{ 
              backgroundColor: '#1E5EFF',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#174ACC'}
            onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1E5EFF'}
            onClick={() => setLocation('/landing')}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}