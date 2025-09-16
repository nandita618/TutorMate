'use client';

import Link from 'next/link';
import { useSession,signIn } from 'next-auth/react';
import { 
  FiAward, 
  FiBook, 
  FiTrendingUp,
  FiClock
} from 'react-icons/fi';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const { data: session, status } = useSession();
  const isLoggedIn = !!session;
  const { isDarkMode } = useTheme();
  if (status === 'loading') {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className={`mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }
  const features = [
    {
      icon: <FiAward size={40} className="text-blue-400" />,
      title: "Gamified Learning",
      description: "Earn points, badges, and climb the leaderboard. Make studying fun and competitive!"
    },
    {
      icon: <FiBook size={40} className="text-blue-400" />,
      title: "Complete Curriculum",
      description: "All subjects for Classes 6-12 with comprehensive NCERT-aligned content and resources."
    },
    {
      icon: <FiTrendingUp size={40} className="text-blue-400" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and performance insights."
    },
    {
      icon: <FiClock size={40} className="text-blue-400" />,
      title: "Daily Challenges",
      description: "Build consistent study habits with daily streaks and timed challenges."
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Transform Your{' '}
              <span className="text-blue-400">Learning Journey</span>
            </h1>
            <p className={`text-xl mb-10 max-w-3xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover the most engaging way to master your syllabus. QuestLearn turns studying into an adventure.
            </p>
            
            {!isLoggedIn ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => signIn('google')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200"
                >
                  Start with Google
                </button>
              </div>
            ) : (
              <Link 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 inline-block"
              >
                Continue Learning
              </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className={`py-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold text-center mb-16 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
             What we offer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className={`text-center p-6 rounded-lg hover:transform hover:scale-105 transition-transform duration-200 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className={`font-semibold text-lg mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {feature.title}
                  </h3>
                  <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}