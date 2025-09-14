'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeButton({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className = '',
  ...props 
}) {
  const { isDarkMode } = useTheme();
  
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: `bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 ${isDarkMode ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}`,
    secondary: `border ${isDarkMode ? 'border-gray-600 hover:bg-gray-700 text-white' : 'border-gray-300 hover:bg-gray-50 text-gray-700'} focus:ring-gray-500`,
    ghost: `hover:bg-opacity-10 ${isDarkMode ? 'text-white hover:bg-white' : 'text-gray-700 hover:bg-gray-200'}`
  };
  
  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
