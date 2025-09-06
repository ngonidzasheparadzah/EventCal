import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignUpScreenProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function SignUpScreen({ data, updateData, onNext }: SignUpScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [currentField, setCurrentField] = useState(0);
  const [formData, setFormData] = useState({
    firstName: data.personalInfo?.firstName || '',
    lastName: data.personalInfo?.lastName || '',
    email: data.personalInfo?.email || '',
    phone: data.personalInfo?.phone || '',
    profilePicture: data.personalInfo?.profilePicture || ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const fields = [
    {
      id: 'name',
      question: "What's your name?",
      subtitle: "We'll use this to personalize your experience",
      fields: [
        { key: 'firstName', placeholder: 'First name', type: 'text' },
        { key: 'lastName', placeholder: 'Last name', type: 'text' }
      ]
    },
    {
      id: 'contact',
      question: "How can we reach you?",
      subtitle: "Add your email and phone for secure communication",
      fields: [
        { key: 'email', placeholder: 'Email address', type: 'email' },
        { key: 'phone', placeholder: 'Phone number', type: 'tel' }
      ]
    },
    {
      id: 'profile',
      question: "Add your profile picture",
      subtitle: "Help others recognize you (optional)",
      fields: []
    }
  ];

  const currentFieldData = fields[currentField];
  const isLastField = currentField === fields.length - 1;
  const canContinue = currentField === 0 
    ? formData.firstName && formData.lastName
    : currentField === 1
    ? formData.email && formData.phone
    : true; // Profile picture is optional

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (isLastField) {
      updateData({ personalInfo: formData });
      onNext();
    } else {
      setCurrentField(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentField > 0) {
      setCurrentField(prev => prev - 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData(prev => ({ ...prev, profilePicture: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-8" data-testid="signup-screen">
      {/* Progress indicator for form steps */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : -10 }}
        transition={{ duration: 0.4 }}
        className="flex space-x-2 mb-4"
      >
        {fields.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              index <= currentField ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
            )}
          />
        ))}
      </motion.div>

      {/* Conversational text bubble */}
      <motion.div
        key={currentField}
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
          {/* Speech bubble pointer */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-white dark:bg-gray-800 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45"></div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {currentFieldData.question}
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {currentFieldData.subtitle}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form Fields */}
      <motion.div
        key={`form-${currentField}`}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full space-y-4"
      >
        {currentField < 2 ? (
          // Regular form fields
          currentFieldData.fields.map((field, index) => (
            <motion.div
              key={field.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="space-y-2"
            >
              <Label htmlFor={field.key} className="text-left block text-gray-700 dark:text-gray-300 font-medium">
                {field.placeholder}
              </Label>
              <Input
                id={field.key}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.key as keyof typeof formData]}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="w-full h-12 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                data-testid={`input-${field.key}`}
              />
            </motion.div>
          ))
        ) : (
          // Profile picture upload
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Profile picture preview */}
            <div className="flex justify-center">
              <div className="relative">
                {formData.profilePicture ? (
                  <img
                    src={formData.profilePicture}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl">👤</span>
                  </div>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </div>
            
            {/* Upload buttons */}
            <div className="space-y-3">
              <label htmlFor="profile-upload" className="block">
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-profile-picture"
                />
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 bg-blue-50 dark:bg-blue-900/20 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-xl flex items-center justify-center space-x-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Upload className="w-5 h-5 text-blue-500" />
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Upload Photo
                  </span>
                </motion.div>
              </label>
              
              <Button
                variant="ghost"
                onClick={() => setFormData(prev => ({ ...prev, profilePicture: '' }))}
                className="w-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                data-testid="button-skip-photo"
              >
                Skip for now
              </Button>
            </div>
          </motion.div>
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
          {currentField > 0 && (
            <Button
              onClick={handlePrev}
              variant="outline"
              className="flex-1 h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              data-testid="button-prev-field"
            >
              Previous
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={!canContinue}
            className={cn(
              "h-12 rounded-xl font-semibold transition-all duration-200",
              currentField === 0 ? "w-full" : "flex-1",
              canContinue 
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl" 
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            )}
            data-testid="button-continue-field"
          >
            {isLastField ? 'Complete Profile' : 'Continue'}
          </Button>
        </div>
      </motion.div>

      {/* Floating elements for engagement */}
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
        className="absolute top-16 right-8 opacity-20"
      >
        <span className="text-4xl" role="img" aria-label="writing">✍️</span>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, -5, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-32 left-8"
      >
        <span className="text-3xl" role="img" aria-label="smile">😊</span>
      </motion.div>
    </div>
  );
}