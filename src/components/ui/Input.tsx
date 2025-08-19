import React from 'react';
import { motion } from 'framer-motion';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  maxLength?: number;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  label,
  type = 'text',
  error,
  disabled = false,
  fullWidth = false,
  className = '',
  maxLength,
  required = false
}) => {
  const baseClasses = 'px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white placeholder:text-gray-600 focus:ring-offset-white';
  
  const stateClasses = error 
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const classes = `${baseClasses} ${stateClasses} ${widthClass} ${className}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        className={classes}
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.1 }}
        aria-describedby={error ? `${label}-error` : undefined}
        aria-invalid={error ? 'true' : 'false'}
      />
      {error && (
        <motion.p 
          id={label ? `${label}-error` : undefined}
          className="mt-1 text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          role="alert"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input; 