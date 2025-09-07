import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import { ChevronLeft, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function GuestSignup() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle guest signup logic here
    console.log('Guest signup:', formData);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <button 
          onClick={() => setLocation('/website-type')}
          className="px-4 py-2 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#0390D7' }}
          data-testid="button-back"
        >
          <ChevronLeft className="w-4 h-4 inline mr-1" />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          {/* Welcome Message */}
          <div className="text-center mb-8">
            <div className="mb-4 p-4 rounded-full bg-green-100 w-16 h-16 mx-auto flex items-center justify-center">
              <User className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Welcome, Guest!
            </h1>
            <p className="text-sm text-gray-600">
              Create your account to start finding amazing accommodations
            </p>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                data-testid="input-full-name"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                data-testid="input-email"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                data-testid="input-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                data-testid="button-toggle-password"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150"
                data-testid="input-confirm-password"
                required
              />
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full h-14 text-lg font-semibold shadow-lg rounded-2xl border-0 mt-6"
              style={{ 
                backgroundColor: '#0390D7',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#027BB8'}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0390D7'}
              data-testid="button-sign-up"
            >
              Create Account
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => setLocation('/login')}
                className="text-blue-600 font-medium hover:underline"
                data-testid="link-login"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}