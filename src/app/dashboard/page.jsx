"use client"
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';
import { FiBook, FiAward, FiUser, FiCalendar } from 'react-icons/fi';

export default function DashboardPage() {
  const { data: session } = useSession();
  const { isDarkMode } = useTheme();

  const stats = [
    {
      title: 'Current Streak',
      value: '7 days',
      icon: <FiCalendar size={24} />,
      color: 'text-green-400',
      link: '/dashboard/profile'
    },
    {
      title: 'Total Points',
      value: '1,250',
      icon: <FiAward size={24} />,
      color: 'text-yellow-400',
      link: '/dashboard/leaderboard'
    },
    {
      title: 'Subjects',
      value: '5',
      icon: <FiBook size={24} />,
      color: 'text-blue-400',
      link: '/dashboard/subjects'
    }
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {session?.user?.name}!
          </h1>
          <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Ready to continue your learning journey?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Link
              key={index}
              href={stat.link}
              className={`p-6 rounded-lg shadow-md transition-transform hover:scale-105 ${
                isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={stat.color}>
                  {stat.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className={`p-6 rounded-lg shadow-md ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/dashboard/subjects"
              className={`p-4 rounded-lg border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-colors text-center ${
                isDarkMode ? 'border-blue-400' : 'border-blue-500'
              }`}
            >
              <FiBook className="inline-block mr-2" />
              Browse Subjects
            </Link>
            <Link
            href="/dashboard/daily-challenge"
            className={`p-4 rounded-lg border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white transition-colors text-center ${
              isDarkMode ? 'border-purple-400' : 'border-purple-500'
            }`}
          >
            <FiCalendar className="inline-block mr-2" />
            Daily Challenge
          </Link>
            <Link
              href="/dashboard/leaderboard"
              className={`p-4 rounded-lg border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white transition-colors text-center ${
                isDarkMode ? 'border-green-400' : 'border-green-500'
              }`}
            >
              <FiAward className="inline-block mr-2" />
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Recent Activity (Placeholder) */}
        <div className={`mt-8 p-6 rounded-lg shadow-md ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Your recent quizzes and progress will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}