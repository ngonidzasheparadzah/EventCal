import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [rememberMe, setRememberMe] = useState(false);

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
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
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
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setIsNavigating(true);
        
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          // Store user data for future use
          localStorage.setItem('userId', data.user.id);
          console.log('Login successful:', data.user);
          
          // Redirect to home page
          setLocation('/home');
        } else {
          // Handle error
          const errorMessage = data.message || 'Invalid credentials';
          setErrors({ general: errorMessage });
          console.error('Login failed:', data);
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

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="responsive-container max-w-sm w-full">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white text-center mb-3">Log In</h1>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
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
              {errors.password && <p className="text-red-400 text-sm mt-2">{errors.password}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  data-testid="checkbox-remember-me"
                />
                <span className="ml-2 text-sm text-slate-300">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setLocation('/forgot-password')}
                className="text-sm font-medium transition-colors"
                style={{ color: '#0390D7' }}
                data-testid="link-forgot-password"
              >
                Forgot Password
              </button>
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="mt-4 p-4 bg-red-900/20 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Log In Button */}
            <button
              type="submit"
              className="w-full h-14 text-lg font-semibold shadow-lg rounded-xl border-0 mt-8 transition-all duration-200"
              style={{ 
                backgroundColor: isNavigating ? '#64748B' : '#0390D7',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => !isNavigating && (e.currentTarget.style.backgroundColor = '#027BB8')}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => !isNavigating && (e.currentTarget.style.backgroundColor = '#0390D7')}
              data-testid="button-login"
              disabled={isNavigating}
            >
              {isNavigating ? 'Signing In...' : 'Log in'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-sm text-slate-300">
              Don't have an account?{' '}
              <button 
                onClick={() => setLocation('/guest-signup')}
                className="font-medium hover:underline transition-colors"
                style={{ color: '#0390D7' }}
                data-testid="link-signup"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}