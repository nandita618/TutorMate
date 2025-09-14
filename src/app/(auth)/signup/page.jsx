'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiArrowLeft } from 'react-icons/fi';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useTheme } from '@/contexts/ThemeContext';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    classLevel: ''
  });
  const { isDarkMode } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup attempt:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className={`w-full max-w-md p-8 rounded-lg shadow-md ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Back to Home */}
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-blue-400 hover:text-blue-300 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to home
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Join QuestLearn and start your learning adventure
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="classLevel" className="block text-sm font-medium mb-2">
                Class Level
              </label>
              <select
                id="classLevel"
                name="classLevel"
                required
                value={formData.classLevel}
                onChange={handleChange}
                className={`w-full py-3 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="">Select your class</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  ) : (
                    <FiEye className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Account
            </button>
          </form>

          <div className={`mt-6 text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}