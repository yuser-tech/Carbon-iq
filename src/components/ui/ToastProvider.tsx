'use client';

/**
 * Toast Notification System
 * Provides user feedback through non-blocking notifications
 */

import { Toaster } from 'react-hot-toast';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * Toast styling configuration for CarbonIQ theme
 */
const toastStyles = {
  // Success toast style
  success: {
    duration: 4000,
    icon: <CheckCircle className="w-5 h-5 text-emerald" aria-hidden="true" />,
    style: {
      background: 'rgba(15, 46, 34, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(76, 175, 80, 0.3)',
      borderRadius: '12px',
      padding: '16px 20px',
      color: '#F5FFF5',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    className: 'font-medium',
  },
  // Error toast style
  error: {
    duration: 6000,
    icon: <XCircle className="w-5 h-5 text-red-400" aria-hidden="true" />,
    style: {
      background: 'rgba(46, 20, 20, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(248, 113, 113, 0.3)',
      borderRadius: '12px',
      padding: '16px 20px',
      color: '#F5FFF5',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    className: 'font-medium',
  },
  // Info toast style
  info: {
    duration: 5000,
    icon: <Info className="w-5 h-5 text-blue-400" aria-hidden="true" />,
    style: {
      background: 'rgba(15, 30, 46, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(96, 165, 250, 0.3)',
      borderRadius: '12px',
      padding: '16px 20px',
      color: '#F5FFF5',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    className: 'font-medium',
  },
  // Warning toast style
  warning: {
    duration: 5000,
    icon: <AlertTriangle className="w-5 h-5 text-yellow-400" aria-hidden="true" />,
    style: {
      background: 'rgba(46, 35, 15, 0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(251, 191, 36, 0.3)',
      borderRadius: '12px',
      padding: '16px 20px',
      color: '#F5FFF5',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
    },
    className: 'font-medium',
  },
};

/**
 * Toast position configuration
 */
const toastPosition = 'bottom-center';

/**
 * Toast Provider Component
 * Wraps the application with toast notification capabilities
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster
        position={toastPosition}
        toastOptions={toastStyles}
        containerStyle={{
          bottom: 80, // Above the navbar
        }}
        reverseOrder={false}
      />
      {children}
    </>
  );
}

/**
 * Custom hook for toast notifications
 * Provides type-safe toast functions
 */
export { toast } from 'react-hot-toast';

export default ToastProvider;
