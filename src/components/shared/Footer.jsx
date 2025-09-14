import Link from 'next/link';
import { FiBook, FiAward, FiUser, FiHome } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const { isDarkMode } = useTheme();

  return (
    <footer className={`py-12 ${
      isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">QuestLearn</h3>
            <p className="opacity-90">Making learning fun and effective for students everywhere.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="opacity-90 hover:text-blue-400 hover:opacity-100 transition-colors flex items-center space-x-2"><FiHome size={16} /><span>Home</span></Link></li>
              <li><Link href="/dashboard/subjects" className="opacity-90 hover:text-blue-400 hover:opacity-100 transition-colors flex items-center space-x-2"><FiBook size={16} /><span>Subjects</span></Link></li>
              <li><Link href="/dashboard/leaderboard" className="opacity-90 hover:text-blue-400 hover:opacity-100 transition-colors flex items-center space-x-2"><FiAward size={16} /><span>Leaderboard</span></Link></li>
              <li><Link href="/dashboard/profile" className="opacity-90 hover:text-blue-400 hover:opacity-100 transition-colors flex items-center space-x-2"><FiUser size={16} /><span>Profile</span></Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="opacity-90 hover:text-blue-400 hover:opacity-100 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="opacity-90 hover:text-blue-400 hover:opacity-100 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="opacity-90 hover:text-blue-400 hover:opacity-100 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="opacity-90 hover:text-blue-400 hover:opacity-100 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className={`border-t mt-8 pt-8 text-center opacity-90 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-800'
        }`}>
          <p>© 2025 QuestLearn. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}