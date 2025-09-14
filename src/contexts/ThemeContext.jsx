// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';

// const ThemeContext = createContext();

// export function ThemeProvider({ children }) {
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   useEffect(() => {
//     // Check if user has a theme preference in localStorage
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme) {
//       setIsDarkMode(savedTheme === 'dark');
//     }
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = !isDarkMode;
//     setIsDarkMode(newTheme);
//     localStorage.setItem('theme', newTheme ? 'dark' : 'light');
//   };

//   return (
//     <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
//       <div className={isDarkMode ? 'dark' : 'light'}>
//         {children}
//       </div>
//     </ThemeContext.Provider>
//   );
// }

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('questlearn-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('questlearn-theme', newTheme ? 'dark' : 'light');
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      primary: {
        50: isDarkMode ? '#f0f9ff' : '#eff6ff',
        100: isDarkMode ? '#e0f2fe' : '#dbeafe',
        200: isDarkMode ? '#bae6fd' : '#bfdbfe',
        300: isDarkMode ? '#7dd3fc' : '#93c5fd',
        400: isDarkMode ? '#38bdf8' : '#60a5fa',
        500: isDarkMode ? '#0ea5e9' : '#3b82f6',
        600: isDarkMode ? '#0284c7' : '#2563eb',
        700: isDarkMode ? '#0369a1' : '#1d4ed8',
        800: isDarkMode ? '#075985' : '#1e40af',
        900: isDarkMode ? '#0c4a6e' : '#1e3a8a',
      },
      background: {
        primary: isDarkMode ? '#111827' : '#ffffff',
        secondary: isDarkMode ? '#1f2937' : '#f9fafb',
        tertiary: isDarkMode ? '#374151' : '#f3f4f6',
      },
      text: {
        primary: isDarkMode ? '#f9fafb' : '#111827',
        secondary: isDarkMode ? '#d1d5db' : '#6b7280',
        tertiary: isDarkMode ? '#9ca3af' : '#9ca3af',
      },
      border: isDarkMode ? '#374151' : '#e5e7eb',
      success: isDarkMode ? '#10b981' : '#059669',
      warning: isDarkMode ? '#f59e0b' : '#d97706',
      error: isDarkMode ? '#ef4444' : '#dc2626',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-white text-gray-900'
      }`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};