'use client';

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiBookOpen, FiCheckCircle, FiLock, FiArrowLeft, FiAward, FiTrendingUp } from "react-icons/fi";
import { subjectsData, isChapterComplete } from "@/data/index";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const progressVariants = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 1.5,
      ease: "easeOut"
    }
  }
};

export default function TopicPage() {
  const { subject, topic } = useParams();
  const [hoveredChapter, setHoveredChapter] = useState(null);
  const [progress, setProgress] = useState(0);
  
  const topicData = subjectsData[subject]?.subject?.topics.find((t) => t.id === topic);

  useEffect(() => {
    // Calculate progress percentage
    if (topicData) {
      const completedChapters = topicData.chapters.filter(chapter => 
        isChapterComplete(subject, topic, chapter.id)
      ).length;
      const totalChapters = topicData.chapters.length;
      setProgress((completedChapters / totalChapters) * 100);
    }
  }, [subject, topic, topicData]);

  if (!topicData) {
    return <div className="p-6">Topic not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href={`/dashboard/subjects/${subject}`}>
            <motion.button
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
            >
              <FiArrowLeft className="text-lg" />
            </motion.button>
          </Link>
          <div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
            >
              {topicData.name}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 dark:text-gray-400"
            >
              {topicData.description}
            </motion.p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FiTrendingUp className="text-blue-500 text-xl" />
              <span className="font-semibold">Your Progress</span>
            </div>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              variants={progressVariants}
              initial="hidden"
              animate="visible"
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>

        {/* Chapters Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {topicData.chapters.map((chapter, index) => {
            const completed = isChapterComplete(subject, topic, chapter.id);
            const available = index === 0 || isChapterComplete(subject, topic, topicData.chapters[index - 1].id);

            return (
              <motion.div
                key={chapter.id}
                variants={itemVariants}
                whileHover={{ 
                  scale: available ? 1.05 : 1,
                  rotate: available ? 0.5 : 0,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: available ? 0.95 : 1 }}
                onHoverStart={() => setHoveredChapter(chapter.id)}
                onHoverEnd={() => setHoveredChapter(null)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  completed
                    ? "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/20 border-green-300 dark:border-green-700 shadow-lg"
                    : available
                    ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-2xl hover:border-blue-300"
                    : "bg-gray-100 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 opacity-70"
                }`}
              >
                {/* Chapter Number Badge */}
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    completed ? 'bg-green-500' : available ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                >
                  {index + 1}
                </motion.div>

                <Link
                  href={available ? `/dashboard/subjects/${subject}/${topic}/${chapter.id}` : '#'}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{
                        scale: hoveredChapter === chapter.id ? 1.2 : 1,
                        rotate: hoveredChapter === chapter.id ? 5 : 0
                      }}
                    >
                      {completed ? (
                        <FiCheckCircle className="w-8 h-8 text-green-500" />
                      ) : available ? (
                        <FiBookOpen className="w-8 h-8 text-blue-500" />
                      ) : (
                        <FiLock className="w-8 h-8 text-gray-400" />
                      )}
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {chapter.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {completed ? 'Completed' : available ? 'Available' : 'Locked'}
                      </p>
                    </div>
                  </div>
                  
                  {available && !completed && (
                    <motion.div
                      animate={{ x: hoveredChapter === chapter.id ? 5 : 0 }}
                      transition={{ type: "spring", stiffness: 500 }}
                    >
                      <FiAward className="w-6 h-6 text-blue-400" />
                    </motion.div>
                  )}
                </Link>

                {/* Progress indicator for current chapter */}
                {available && !completed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.8 }}
                    className="absolute bottom-0 left-0 right-0 h-1 bg-blue-200 dark:bg-blue-800 rounded-b-2xl"
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "30%" }}
                      transition={{ duration: 2, delay: index * 0.2 + 1 }}
                      className="h-full bg-blue-500 rounded-b-2xl"
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Completion Celebration */}
        {progress === 100 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mt-8 p-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl text-white text-center"
          >
            <FiAward className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Topic Mastered! 🎉</h3>
            <p>You've completed all chapters in this topic!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}