import React from 'react';
import { COLORS } from '../constants';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Using inline styles for dynamic color usage from constants to ensure exact match
  let variantStyles = {};
  let variantClasses = "";

  switch (variant) {
    case 'primary':
      variantStyles = { backgroundColor: COLORS.action, color: '#ffffff' };
      variantClasses = "hover:brightness-90 shadow-lg shadow-red-900/20";
      break;
    case 'secondary':
      variantStyles = { backgroundColor: COLORS.primary, color: '#ffffff' };
      variantClasses = "hover:opacity-90 shadow-lg shadow-gray-900/20";
      break;
    case 'outline':
      variantStyles = { borderColor: COLORS.action, color: COLORS.action, borderWidth: '2px' };
      variantClasses = "hover:bg-red-50";
      break;
    case 'danger':
      variantClasses = "bg-red-800 text-white hover:bg-red-900";
      break;
  }

  return (
    <button 
      className={`${baseStyles} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
      style={Object.keys(variantStyles).length > 0 ? variantStyles : undefined}
      {...props}
    >
      {children}
    </button>
  );
};