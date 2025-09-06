import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useRouter } from 'wouter';

interface CompletionScreenProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function CompletionScreen({ data }: CompletionScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [, setLocation] = useRouter();

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 200);
    const timer2 = setTimeout(() => setShowConfetti(true), 800);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleGetStarted = () => {
    // Clear onboarding data
    localStorage.removeItem('roome-onboarding');
    
    // Navigate based on role or browsing mode
    if (data.browsingAsGuest) {
      setLocation('/browse');
    } else if (data.role === 'host') {
      setLocation('/host/dashboard');
    } else if (data.role === 'service_provider') {
      setLocation('/services/dashboard');
    } else {
      setLocation('/dashboard');
    }
  };

  const getRoleInfo = () => {
    if (data.browsingAsGuest) {
      return {
        title: 'Welcome to RooMe!',
        subtitle: 'Start exploring amazing accommodations',
        icon: '🏡',
        color: 'from-blue-400 to-blue-600',
        features: [
          'Browse thousands of properties',
          'View detailed listings and photos',
          'Read reviews from other guests',
          'Save favorites (sign up required)'
        ],
        cta: 'Start Exploring',
        nextSteps: 'Ready to browse? Sign up anytime to unlock booking and messaging features.'
      };
    }
    
    switch (data.role) {
      case 'host':
        return {
          title: 'Welcome, Host!',
          subtitle: 'Your hosting journey begins now',
          icon: '🛏️',
          color: 'from-green-400 to-green-600',
          features: [
            'List your property and start earning',
            'Manage bookings and guests',
            'Connect with service providers',
            'Track your hosting performance'
          ],
          cta: 'Go to Host Dashboard',
          nextSteps: 'Ready to list your property? Complete your listing to start receiving bookings.'
        };
      case 'service_provider':
        return {
          title: 'Welcome, Service Provider!',
          subtitle: 'Connect with hosts and guests',
          icon: '🛠️',
          color: 'from-purple-400 to-purple-600',
          features: [
            'Offer your services to the community',
            'Connect with hosts and guests',
            'Manage your service bookings',
            'Build your reputation and reviews'
          ],
          cta: 'Go to Services Dashboard',
          nextSteps: 'Ready to offer services? Set up your service profile to start connecting with clients.'
        };
      default:
        return {
          title: 'Welcome to RooMe!',
          subtitle: 'Your accommodation journey starts here',
          icon: '🏡',
          color: 'from-blue-400 to-blue-600',
          features: [
            'Search and book accommodations',
            'Save your favorite properties',
            'Message hosts directly',
            'Leave reviews and ratings'
          ],
          cta: 'Start Exploring',
          nextSteps: 'Ready to find your perfect stay? Start searching for accommodations in your area.'
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="flex flex-col items-center text-center space-y-8 py-8 relative overflow-hidden" data-testid="completion-screen">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: -10,
                rotate: 0,
                scale: 0
              }}
              animate={{ 
                y: window.innerHeight + 10,
                rotate: 360,
                scale: [0, 1, 0]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}

      {/* Success Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          scale: showContent ? 1 : 0.5, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        <div className={`w-24 h-24 bg-gradient-to-br ${roleInfo.color} rounded-full flex items-center justify-center shadow-xl mx-auto relative`}>
          <span className="text-white text-4xl" role="img" aria-label="success">
            {roleInfo.icon}
          </span>
          
          {/* Sparkle effects */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
          >
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
            <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-yellow-400" />
            <Sparkles className="absolute top-1/2 -left-3 w-3 h-3 text-yellow-400" />
          </motion.div>
        </div>
      </motion.div>

      {/* Success Message */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 30 
        }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="space-y-4"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {roleInfo.title}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {roleInfo.subtitle}
          </p>
        </div>

        {data.personalInfo?.firstName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 max-w-sm mx-auto"
          >
            <div className="flex items-center space-x-3">
              {data.personalInfo.profilePicture ? (
                <img
                  src={data.personalInfo.profilePicture}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className={`w-12 h-12 bg-gradient-to-br ${roleInfo.color} rounded-full flex items-center justify-center`}>
                  <span className="text-white text-lg">👤</span>
                </div>
              )}
              
              <div className="text-left">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {data.personalInfo.firstName} {data.personalInfo.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {data.personalInfo.email}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Features List */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 30 
        }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
            What you can do now:
          </h3>
          
          <ul className="space-y-3">
            {roleInfo.features.map((feature, index) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                className="flex items-center space-x-3"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 text-sm">
                  {feature}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        className="w-full"
      >
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {roleInfo.nextSteps}
          </p>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: showContent ? 1 : 0, 
          y: showContent ? 0 : 20 
        }}
        transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
        className="w-full"
      >
        <Button
          onClick={handleGetStarted}
          className={`w-full h-14 text-lg font-semibold bg-gradient-to-r ${roleInfo.color} hover:shadow-xl transition-all duration-200 rounded-2xl text-white shadow-lg group`}
          data-testid="button-get-started"
        >
          <span className="mr-2">{roleInfo.cta}</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </motion.div>

      {/* Background decorative elements */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          ease: "linear"
        }}
        className="absolute top-8 right-8 opacity-10"
      >
        <span className="text-6xl" role="img" aria-label="celebration">🎉</span>
      </motion.div>

      <motion.div
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-16 left-8 opacity-20"
      >
        <span className="text-4xl" role="img" aria-label="rocket">🚀</span>
      </motion.div>
    </div>
  );
}