import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ServiceProviderOnboardingScreenProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function ServiceProviderOnboardingScreen({ data, updateData, onNext }: ServiceProviderOnboardingScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    services: data.serviceProviderInfo?.services || [],
    availability: data.serviceProviderInfo?.availability || [],
    verificationDocs: data.serviceProviderInfo?.verificationDocs || [],
    businessName: data.serviceProviderInfo?.businessName || '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      id: 'services',
      question: "What services do you provide?",
      subtitle: "Select all services you offer"
    },
    {
      id: 'availability',
      question: "When are you available?",
      subtitle: "Let hosts and guests know your schedule"
    },
    {
      id: 'verification',
      question: "Verify your business",
      subtitle: "Build trust with verification documents"
    }
  ];

  const serviceOptions = [
    { id: 'cleaning', name: 'Cleaning Services', icon: '🧽', description: 'House cleaning, laundry' },
    { id: 'catering', name: 'Catering', icon: '🍽️', description: 'Meal preparation, events' },
    { id: 'transport', name: 'Transport', icon: '🚗', description: 'Airport pickup, tours' },
    { id: 'maintenance', name: 'Maintenance', icon: '🔧', description: 'Repairs, handyman services' },
    { id: 'security', name: 'Security', icon: '🛡️', description: 'Property security, guards' },
    { id: 'gardening', name: 'Gardening', icon: '🌱', description: 'Landscaping, plant care' },
    { id: 'photography', name: 'Photography', icon: '📸', description: 'Property photos, events' },
    { id: 'concierge', name: 'Concierge', icon: '🎩', description: 'Personal assistance, bookings' }
  ];

  const availabilityOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  const isStepComplete = () => {
    switch (currentStep) {
      case 0:
        return formData.services.length > 0;
      case 1:
        return formData.availability.length > 0;
      case 2:
        return formData.verificationDocs.length > 0;
      default:
        return false;
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter((s: string) => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleAvailabilityToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d: string) => d !== day)
        : [...prev.availability, day]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({
          ...prev,
          verificationDocs: [...prev.verificationDocs, { name: file.name, data: result }]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      updateData({ serviceProviderInfo: formData });
      onNext();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-8" data-testid="service-provider-onboarding-screen">
      {/* Progress indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -10 }}
        transition={{ duration: 0.4 }}
        className="flex space-x-2 mb-4"
      >
        {steps.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index <= currentStep ? "bg-purple-500" : "bg-gray-300 dark:bg-gray-600"
            )}
          />
        ))}
      </motion.div>

      {/* Conversational text bubble */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          scale: showContent ? 1 : 0.9, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 max-w-sm mx-auto">
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-white dark:bg-gray-800 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45"></div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🛠️</span>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {currentStepData.question}
              </h1>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentStepData.subtitle}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form Content */}
      <motion.div
        key={`service-form-${currentStep}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full space-y-4"
      >
        {currentStep === 0 && (
          // Services Selection
          <div className="grid grid-cols-1 gap-3">
            {serviceOptions.map((service, index) => {
              const isSelected = formData.services.includes(service.id);
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleServiceToggle(service.id)}
                  className={cn(
                    "cursor-pointer transition-all duration-200 p-4 rounded-xl border-2",
                    "bg-white dark:bg-gray-800 hover:shadow-md",
                    isSelected 
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md" 
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                  data-testid={`service-option-${service.id}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-lg">{service.icon}</span>
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {service.description}
                      </p>
                    </div>
                    
                    <Checkbox checked={isSelected} readOnly />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {currentStep === 1 && (
          // Availability Selection
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-left block text-gray-700 dark:text-gray-300 font-medium">
                Business Name (Optional)
              </Label>
              <Input
                placeholder="Your business name"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                data-testid="input-business-name"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-left block text-gray-700 dark:text-gray-300 font-medium">
                Available Days
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {availabilityOptions.map(day => {
                  const isSelected = formData.availability.includes(day);
                  
                  return (
                    <motion.div
                      key={day}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAvailabilityToggle(day)}
                      className={cn(
                        "cursor-pointer p-3 rounded-lg border transition-all duration-200 text-center",
                        isSelected 
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300" 
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
                      )}
                      data-testid={`availability-${day}`}
                    >
                      <span className="font-medium text-sm">{day}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          // Verification Documents
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload documents to verify your business:
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Business license or registration</li>
                  <li>• National ID or passport</li>
                  <li>• Insurance certificates (if applicable)</li>
                </ul>
              </div>
            </div>

            <label htmlFor="service-verification-upload" className="block">
              <input
                id="service-verification-upload"
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                data-testid="input-service-verification-docs"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-20 bg-purple-50 dark:bg-purple-900/20 border-2 border-dashed border-purple-300 dark:border-purple-600 rounded-xl flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <Upload className="w-6 h-6 text-purple-500" />
                <span className="text-purple-600 dark:text-purple-400 font-medium text-sm">
                  Upload Documents
                </span>
              </motion.div>
            </label>

            {formData.verificationDocs.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Uploaded Documents:
                </p>
                {formData.verificationDocs.map((doc: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{doc.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full space-y-3"
      >
        <div className="flex space-x-3">
          <Button
            onClick={handlePrev}
            variant="outline"
            className="flex-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            data-testid="button-prev-service-step"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className={cn(
              "flex-1 h-12 rounded-xl font-semibold transition-all duration-200",
              isStepComplete() 
                ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            )}
            data-testid="button-continue-service-step"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute top-16 right-8 opacity-20"
      >
        <span className="text-4xl" role="img" aria-label="tools">🔧</span>
      </motion.div>
    </div>
  );
}