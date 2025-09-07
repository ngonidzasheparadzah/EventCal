import React from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft } from 'lucide-react';

export default function GuestContactVerification() {
  const [, setLocation] = useLocation();

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <button 
          onClick={() => setLocation('/guest-signup')}
          className="px-4 py-2 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#0390D7' }}
          data-testid="button-back"
        >
          <ChevronLeft className="w-4 h-4 inline mr-1" />
          Back
        </button>
      </div>

      {/* Page Title */}
      <div className="px-4 pb-2">
        <div className="max-w-sm mx-auto">
          <h1 className="text-lg font-semibold text-gray-900 text-center mb-3">Contact and Verification</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-4 pb-4">
        <div className="max-w-sm mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-xs font-semibold text-white">✓</div>
              <div className="w-12 h-1 bg-blue-500"></div>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: '#0390D7', color: 'white' }}>2</div>
              <div className="w-12 h-1 bg-gray-200"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-400">3</div>
              <div className="w-12 h-1 bg-gray-200"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-400">4</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-4 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          <div className="text-center">
            <div className="mb-4 p-4 rounded-full bg-green-100 w-16 h-16 mx-auto flex items-center justify-center text-green-600 text-2xl">
              ✅
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Great! Step 1 Complete
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              This is step 2: Contact and Verification page
            </p>
            <p className="text-xs text-gray-500">
              (This page will be developed in the next iteration)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}