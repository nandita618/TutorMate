'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  FiBook, 
  FiCpu, 
  FiPenTool, 
  FiTrendingUp, 
  FiActivity,
  FiAward
} from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';
import { subjectsData, getProgress, isChapterComplete } from '@/data/index';

const subjectIcons = {
  chemistry: FiPenTool,
  physics: FiActivity,
  maths: FiTrendingUp,
  english: FiBook,
  'computer science': FiCpu
};

export default function SubjectsPage() {
  const { isDarkMode } = useTheme();
  const progress = getProgress();

  const calculateSubjectProgress = (subjectId) => {
    const subject = subjectsData[subjectId]?.subject;
    if (!subject) return 0;
    
    let totalChapters = 0;
    let completedChapters = 0;
    
    subject.topics.forEach(topic => {
      topic.chapters.forEach(chapter => {
        totalChapters++;
        if (isChapterComplete(subjectId, topic.id, chapter.id)) {
          completedChapters++;
        }
      });
    });
    
    return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-2">Subjects</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Choose a subject to start your learning journey. Track your progress across all topics and chapters.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(subjectsData).map(([subjectId, data]) => {
            const Icon = subjectIcons[subjectId] || FiBook;
            const progress = calculateSubjectProgress(subjectId);
            
            return (
              <Link key={subjectId} href={`/dashboard/subjects/${subjectId}`}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    isDarkMode
                      ? 'bg-gray-800 hover:bg-gray-700'
                      : 'bg-white hover:bg-gray-50 border border-gray-200'
                  } shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    {progress === 100 && (
                      <FiAward className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-lg mb-2">{data.subject.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {data.subject.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm">{progress}%</span>
                  </div>
                  
                  <div className={`w-full h-2 rounded-full mt-2 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="h-2 rounded-full bg-green-500 transition-all duration-1000"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}