import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';

export default function GuestSignup() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
    
    // Calculate password strength
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };
  
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };
  
  const getPasswordStrengthLabel = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1: return 'Very Weak';
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return 'Very Weak';
    }
  };
  
  const getPasswordStrengthColor = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1: return '#EF4444'; // red
      case 2: return '#F59E0B'; // orange
      case 3: return '#EAB308'; // yellow
      case 4: return '#84CC16'; // lime
      case 5: return '#10B981'; // green
      default: return '#EF4444';
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (passwordStrength < 3) {
      newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, and symbols';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsNavigating(true);
        
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          // Store user ID for future use
          localStorage.setItem('userId', data.user.id);
          console.log('Account created successfully:', data.user);
          
          // Proceed to step 2: Contact and verification
          setLocation('/guest-contact-verification');
        } else {
          // Handle error
          const errorMessage = data.message || 'Failed to create account';
          setErrors({ general: errorMessage });
          console.error('Signup failed:', data);
        }
        
      } catch (error) {
        console.error('Network error:', error);
        setErrors({ general: 'Network error. Please try again.' });
      } finally {
        setIsNavigating(false);
      }
    }
  };

  return (
    <div className="h-screen bg-slate-800 flex flex-col">
      {/* Header */}
      <div className="flex items-center app-content pt-4">
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

      {/* Page Title */}
      <div className="pb-6">
        <div className="responsive-container max-w-sm">
          <h1 className="text-2xl font-bold text-white text-center mb-3">Sign Up</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="pb-8">
        <div className="responsive-container max-w-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 w-full">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#0390D7', color: 'white' }}>1</div>
              <div className="flex-1 h-1 bg-slate-600 rounded"></div>
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold text-slate-400">2</div>
              <div className="flex-1 h-1 bg-slate-600 rounded"></div>
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold text-slate-400">3</div>
              <div className="flex-1 h-1 bg-slate-600 rounded"></div>
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-semibold text-slate-400">4</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="responsive-container max-w-sm w-full">

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="relative">
              <input
                type="text"
                name="fullName"
                placeholder="First Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:border-transparent transition-all duration-150 ${errors.fullName ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500'}`}
                data-testid="input-full-name"
              />
              {errors.fullName && <p className="text-red-400 text-sm mt-2">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:border-transparent transition-all duration-150 ${errors.email ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500'}`}
                data-testid="input-email"
              />
              {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 pr-16 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:border-transparent transition-all duration-150 ${errors.password ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500'}`}
                data-testid="input-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                data-testid="button-toggle-password"
              >
                <span className="text-sm font-medium">Show</span>
              </button>
            </div>
            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">Password strength:</span>
                  <span style={{ color: getPasswordStrengthColor(passwordStrength) }}>{getPasswordStrengthLabel(passwordStrength)}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(passwordStrength)
                    }}
                  ></div>
                </div>
                <p className="text-sm text-slate-400 mt-2">Must contain: 8+ characters, uppercase, lowercase, number, symbol</p>
              </div>
            )}
            {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password}</p>}

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 pr-16 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:border-transparent transition-all duration-150 ${errors.confirmPassword ? 'focus:ring-red-500 border-red-500' : 'focus:ring-blue-500'}`}
                data-testid="input-confirm-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <span className="text-sm font-medium">Show</span>
              </button>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-2">{errors.confirmPassword}</p>}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full h-14 text-lg font-semibold shadow-lg rounded-xl border-0 mt-8 transition-all duration-200"
              style={{ 
                backgroundColor: isNavigating ? '#64748B' : '#0390D7',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => !isNavigating && (e.currentTarget.style.backgroundColor = '#027BB8')}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => !isNavigating && (e.currentTarget.style.backgroundColor = '#0390D7')}
              data-testid="button-continue"
              disabled={isNavigating}
            >
              {isNavigating ? 'Creating Account...' : 'Sign up'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-300">
              Already have an account?{' '}
              <button 
                onClick={() => setLocation('/login')}
                className="font-medium hover:underline transition-colors"
                style={{ color: '#0390D7' }}
                data-testid="link-login"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}