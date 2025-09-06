import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HostOnboardingScreenProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function HostOnboardingScreen({ data, updateData, onNext }: HostOnboardingScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    propertyType: data.hostInfo?.propertyType || '',
    propertyTitle: data.hostInfo?.propertyTitle || '',
    propertyDescription: data.hostInfo?.propertyDescription || '',
    verificationDocs: data.hostInfo?.verificationDocs || [],
    instantBooking: data.hostInfo?.instantBooking || false,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      id: 'property-details',
      question: "Tell us about your property",
      subtitle: "Help guests understand what you're offering"
    },
    {
      id: 'verification',
      question: "Let's verify your property",
      subtitle: "Upload documents to build trust with guests"
    },
    {
      id: 'preferences',
      question: "Set your hosting preferences",
      subtitle: "Customize how you want to host"
    }
  ];

  const propertyTypes = [
    'Apartment', 'House', 'Room', 'Lodge', 'Guesthouse', 
    'Boarding House', 'Hotel Room', 'Cottage', 'Cabin'
  ];

  const isStepComplete = () => {
    switch (currentStep) {
      case 0:
        return formData.propertyType && formData.propertyTitle && formData.propertyDescription;
      case 1:
        return formData.verificationDocs.length > 0;
      case 2:
        return true; // Preferences are optional
      default:
        return false;
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
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
      updateData({ hostInfo: formData });
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
    <div className="flex flex-col items-center text-center space-y-8 py-8" data-testid="host-onboarding-screen">
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
              index <= currentStep ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
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
              <span className="text-2xl">🏡</span>
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
        key={`host-form-${currentStep}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full space-y-6"
      >
        {currentStep === 0 && (
          // Property Details
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-left block text-gray-700 dark:text-gray-300 font-medium">
                Property Type
              </Label>
              <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                <SelectTrigger className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700">
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-left block text-gray-700 dark:text-gray-300 font-medium">
                Property Title
              </Label>
              <Input
                placeholder="e.g., Cozy 2-bedroom apartment in Harare"
                value={formData.propertyTitle}
                onChange={(e) => handleInputChange('propertyTitle', e.target.value)}
                className="w-full h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                data-testid="input-property-title"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-left block text-gray-700 dark:text-gray-300 font-medium">
                Property Description
              </Label>
              <Textarea
                placeholder="Describe your property, amenities, and what makes it special..."
                value={formData.propertyDescription}
                onChange={(e) => handleInputChange('propertyDescription', e.target.value)}
                className="w-full h-24 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                data-testid="textarea-property-description"
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          // Verification Documents
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload documents to verify your property:
                </p>
                <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                  <li>• Property ownership documents</li>
                  <li>• ID or passport</li>
                  <li>• Utility bills (optional)</li>
                </ul>
              </div>
            </div>

            <label htmlFor="verification-upload" className="block">
              <input
                id="verification-upload"
                type="file"
                multiple
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="hidden"
                data-testid="input-verification-docs"
              />
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-20 bg-green-50 dark:bg-green-900/20 border-2 border-dashed border-green-300 dark:border-green-600 rounded-xl flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <Upload className="w-6 h-6 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium text-sm">
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
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{doc.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          // Hosting Preferences
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="space-y-1">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Instant Booking
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Allow guests to book immediately without approval
                  </p>
                </div>
                <Switch
                  checked={formData.instantBooking}
                  onCheckedChange={(checked) => handleInputChange('instantBooking', checked)}
                  data-testid="switch-instant-booking"
                />
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-lg">💡</span>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Pro Tip
                  </h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Instant booking can increase your bookings by up to 30%. You can always change this later.
                </p>
              </div>
            </div>
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
            data-testid="button-prev-host-step"
          >
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!isStepComplete()}
            className={cn(
              "flex-1 h-12 rounded-xl font-semibold transition-all duration-200",
              isStepComplete() 
                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            )}
            data-testid="button-continue-host-step"
          >
            {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </motion.div>

      {/* Floating elements */}
      <motion.div
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute top-16 right-8 opacity-20"
      >
        <span className="text-4xl" role="img" aria-label="house">🏠</span>
      </motion.div>
    </div>
  );
}