import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UserRole } from '../OnboardingFlow';

interface RoleSelectionScreenProps {
  data: any;
  updateData: (updates: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function RoleSelectionScreen({ data, updateData, onNext }: RoleSelectionScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(data.role);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const roles = [
    {
      id: 'guest' as UserRole,
      icon: '🏡',
      title: 'Guest',
      description: 'Find and book stays',
      subtitle: 'Discover amazing accommodations across Zimbabwe',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      id: 'host' as UserRole,
      icon: '🛏️',
      title: 'Host',
      description: 'List your property and earn',
      subtitle: 'Share your space with travelers and earn income',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      id: 'service_provider' as UserRole,
      icon: '🛠️',
      title: 'Service Provider',
      description: 'Offer cleaning, catering, or transport',
      subtitle: 'Connect with hosts and guests to provide services',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-800'
    }
  ];

  const handleRoleSelect = (roleId: UserRole) => {
    setSelectedRole(roleId);
    updateData({ role: roleId, browsingAsGuest: false });
  };

  const handleBrowseAsGuest = () => {
    updateData({ role: null, browsingAsGuest: true });
    onNext();
  };

  const handleContinue = () => {
    if (selectedRole) {
      onNext();
    }
  };

  return (
    <div className=\"flex flex-col items-center text-center space-y-6 py-8\" data-testid=\"role-selection-screen\">\n      {/* Conversational text bubble */}\n      <motion.div\n        initial={{ opacity: 0, scale: 0.9, y: 20 }}\n        animate={{ \n          opacity: showContent ? 1 : 0, \n          scale: showContent ? 1 : 0.9, \n          y: showContent ? 0 : 20 \n        }}\n        transition={{ duration: 0.6, ease: \"easeOut\" }}\n        className=\"relative mb-2\"\n      >\n        <div className=\"bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 max-w-sm mx-auto\">\n          {/* Speech bubble pointer */}\n          <div className=\"absolute -bottom-2 left-1/2 transform -translate-x-1/2\">\n            <div className=\"w-4 h-4 bg-white dark:bg-gray-800 border-l border-b border-gray-100 dark:border-gray-700 transform rotate-45\"></div>\n          </div>\n          \n          <div className=\"space-y-2\">\n            <h1 className=\"text-xl font-bold text-gray-900 dark:text-gray-100\">\n              What brings you to RooMe today?\n            </h1>\n            \n            <p className=\"text-gray-600 dark:text-gray-400 text-sm\">\n              Choose your role to get started\n            </p>\n          </div>\n        </div>\n      </motion.div>\n\n      {/* Role Cards */}\n      <div className=\"w-full space-y-4\">\n        {roles.map((role, index) => {\n          const isSelected = selectedRole === role.id;\n          \n          return (\n            <motion.div\n              key={role.id}\n              initial={{ opacity: 0, y: 30 }}\n              animate={{ \n                opacity: showContent ? 1 : 0, \n                y: showContent ? 0 : 30 \n              }}\n              transition={{ \n                duration: 0.6, \n                delay: 0.1 + (index * 0.1), \n                ease: \"easeOut\" \n              }}\n              whileHover={{ scale: 1.02, y: -2 }}\n              whileTap={{ scale: 0.98 }}\n              onClick={() => handleRoleSelect(role.id)}\n              className={cn(\n                \"cursor-pointer transition-all duration-300 transform\",\n                \"bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg\",\n                \"border-2 hover:shadow-xl\",\n                isSelected \n                  ? `${role.borderColor} ${role.bgColor} shadow-xl` \n                  : \"border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600\"\n              )}\n              data-testid={`role-card-${role.id}`}\n            >\n              <div className=\"flex items-center space-x-4\">\n                {/* Role Icon */}\n                <motion.div \n                  animate={isSelected ? { scale: [1, 1.1, 1] } : {}}\n                  transition={{ duration: 0.5 }}\n                  className={cn(\n                    \"w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg\",\n                    `bg-gradient-to-br ${role.color}`\n                  )}\n                >\n                  <span className=\"text-white text-2xl\" role=\"img\" aria-label={role.title}>\n                    {role.icon}\n                  </span>\n                </motion.div>\n                \n                {/* Role Info */}\n                <div className=\"flex-1 text-left\">\n                  <div className=\"flex items-center space-x-2\">\n                    <h3 className=\"text-lg font-semibold text-gray-900 dark:text-gray-100\">\n                      {role.title}\n                    </h3>\n                    {isSelected && (\n                      <motion.div\n                        initial={{ scale: 0 }}\n                        animate={{ scale: 1 }}\n                        transition={{ type: \"spring\", stiffness: 500, damping: 30 }}\n                        className=\"w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center\"\n                      >\n                        <svg className=\"w-4 h-4 text-white\" fill=\"currentColor\" viewBox=\"0 0 20 20\">\n                          <path fillRule=\"evenodd\" d=\"M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z\" clipRule=\"evenodd\" />\n                        </svg>\n                      </motion.div>\n                    )}\n                  </div>\n                  \n                  <p className=\"text-gray-700 dark:text-gray-300 font-medium text-sm mb-1\">\n                    {role.description}\n                  </p>\n                  \n                  <p className=\"text-gray-500 dark:text-gray-400 text-xs\">\n                    {role.subtitle}\n                  </p>\n                </div>\n                \n                {/* Selection Indicator */}\n                <div className={cn(\n                  \"w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200\",\n                  isSelected \n                    ? \"border-blue-500 bg-blue-500\" \n                    : \"border-gray-300 dark:border-gray-600\"\n                )}>\n                  {isSelected && (\n                    <motion.div\n                      initial={{ scale: 0 }}\n                      animate={{ scale: 1 }}\n                      transition={{ type: \"spring\", stiffness: 500, damping: 30 }}\n                      className=\"w-2 h-2 bg-white rounded-full\"\n                    />\n                  )}\n                </div>\n              </div>\n            </motion.div>\n          );\n        })}\n      </div>\n\n      {/* Action Buttons */}\n      <motion.div\n        initial={{ opacity: 0, y: 20 }}\n        animate={{ \n          opacity: showContent ? 1 : 0, \n          y: showContent ? 0 : 20 \n        }}\n        transition={{ duration: 0.6, delay: 0.5, ease: \"easeOut\" }}\n        className=\"w-full space-y-3\"\n      >\n        {/* Continue Button */}\n        <Button\n          onClick={handleContinue}\n          disabled={!selectedRole}\n          className={cn(\n            \"w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-2xl\",\n            selectedRole \n              ? \"bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white\" \n              : \"bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed\"\n          )}\n          data-testid=\"button-continue\"\n        >\n          Continue\n        </Button>\n        \n        {/* Browse as Guest Option */}\n        <Button\n          onClick={handleBrowseAsGuest}\n          variant=\"ghost\"\n          className=\"w-full h-12 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200\"\n          data-testid=\"button-browse-guest\"\n        >\n          Not now - Browse as guest\n        </Button>\n      </motion.div>\n\n      {/* Floating encouragement */}\n      <motion.div\n        animate={{ \n          scale: [1, 1.05, 1],\n          rotate: [0, 2, -2, 0]\n        }}\n        transition={{ \n          duration: 4, \n          repeat: Infinity, \n          ease: \"easeInOut\"\n        }}\n        className=\"absolute top-12 right-6 opacity-20\"\n      >\n        <span className=\"text-4xl\" role=\"img\" aria-label=\"thinking\">🤔</span>\n      </motion.div>\n\n      <motion.div\n        animate={{ \n          y: [0, -8, 0],\n          opacity: [0.1, 0.3, 0.1]\n        }}\n        transition={{ \n          duration: 3, \n          repeat: Infinity, \n          ease: \"easeInOut\",\n          delay: 1.5\n        }}\n        className=\"absolute bottom-24 left-6\"\n      >\n        <span className=\"text-3xl\" role=\"img\" aria-label=\"choice\">✨</span>\n      </motion.div>\n    </div>\n  );\n}