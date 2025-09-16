'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiUser, 
  FiAward, 
  FiBook, 
  FiMenu, 
  FiX,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { PiPathFill } from "react-icons/pi";
import { useTheme } from '@/contexts/ThemeContext';
import { signIn, useSession } from 'next-auth/react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;

  return (
    <nav className={`border-b sticky top-0 z-50 ${
      isDarkMode 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QL</span>
              </div>
              <span className="text-xl font-bold">QuestLearn</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="hover:text-blue-400 font-medium flex items-center space-x-1 transition-colors">
              <FiHome size={18} />
              <span>Home</span>
            </Link>
            <Link href="/dashboard/subjects" className="hover:text-blue-400 font-medium flex items-center space-x-1 transition-colors">
              <FiBook size={18} />
              <span>Subjects</span>
            </Link>
            <Link href="/dashboard/leaderboard" className="hover:text-blue-400 font-medium flex items-center space-x-1 transition-colors">
              <FiAward size={18} />
              <span>Leaderboard</span>
            </Link>
            <Link href="/dashboard/learning-path" className="hover:text-blue-400 font-medium flex items-center space-x-1 transition-colors">
              <PiPathFill size={18} />
              <span>Learning Path</span>
            </Link>
            <Link href="/dashboard/profile" className="hover:text-blue-400 font-medium flex items-center space-x-1 transition-colors">
              <FiUser size={18} />
              <span>Profile</span>
            </Link>
          </div>

          {/* Right Section - Theme Toggle and Auth */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Auth Buttons */}
            {!isLoggedIn ? (
              <div className="hidden md:flex items-center space-x-3">
                <button
                  onClick={() => signIn('google')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                >
                  Sign In
                </button>
              </div>
            ) : (
              <Link 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200 hidden md:block"
              >
                Dashboard
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t py-4 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col space-y-4">
              <Link href="/" className="hover:text-blue-400 font-medium flex items-center space-x-2 transition-colors">
                <FiHome size={20} />
                <span>Home</span>
              </Link>
              <Link href="/dashboard/subjects" className="hover:text-blue-400 font-medium flex items-center space-x-2 transition-colors">
                <FiBook size={20} />
                <span>Subjects</span>
              </Link>
              <Link href="/dashboard/leaderboard" className="hover:text-blue-400 font-medium flex items-center space-x-2 transition-colors">
                <FiAward size={20} />
                <span>Leaderboard</span>
              </Link>
              <Link href="/dashboard/learning-path" className="hover:text-blue-400 font-medium flex items-center space-x-1 transition-colors">
              <PiPathFill size={18} />
              <span>Learning Path</span>
              </Link>
              <Link href="/dashboard/profile" className="hover:text-blue-400 font-medium flex items-center space-x-2 transition-colors">
                <FiUser size={20} />
                <span>Profile</span>
              </Link>
              
              {/* Mobile Auth Buttons */}
              {!isLoggedIn ? (
                <div className="border-t pt-4 flex flex-col space-y-2">
                  <button
                    onClick={() => signIn('google')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center transition duration-200"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <Link 
                  href="/dashboard" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center transition duration-200"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}