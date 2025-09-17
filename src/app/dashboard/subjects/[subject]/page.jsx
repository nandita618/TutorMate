'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { FiBookOpen, FiCheckCircle, FiArrowRight, FiTrendingUp, FiAward, FiBarChart2 } from "react-icons/fi";
import { subjectsData, isChapterComplete } from "@/data/index";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

const subjectVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      duration: 0.8
    }
  }
};

const glowVariants = {
  initial: { 
    boxShadow: "0 0 0 0 rgba(99, 102, 241, 0)",
    backgroundPosition: "0% 50%"
  },
  pulse: {
    boxShadow: [
      "0 0 0 0 rgba(99, 102, 241, 0)",
      "0 0 25px 12px rgba(99, 102, 241, 0.4)",
      "0 0 0 0 rgba(99, 102, 241, 0)"
    ],
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    transition: {
      boxShadow: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: "loop"
      },
      backgroundPosition: {
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }
};

const progressBarVariants = {
  hidden: { width: "0%" },
  visible: (progress) => ({
    width: `${progress}%`,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      delay: 0.3
    }
  })
};

export default function SubjectPage() {
  const { subject } = useParams();
  const [hoveredTopic, setHoveredTopic] = useState(null);
  const [mounted, setMounted] = useState(false);
  const subjectData = subjectsData[subject]?.subject;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!subjectData) {
    return <div className="p-6">Subject not found</div>;
  }

  // Calculate overall progress for the subject
  const calculateSubjectProgress = () => {
    let totalChapters = 0;
    let completedChapters = 0;

    subjectData.topics.forEach(topic => {
      topic.chapters.forEach(chapter => {
        totalChapters++;
        if (isChapterComplete(subject, topic.id, chapter.id)) {
          completedChapters++;
        }
      });
    });

    return totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;
  };

  const subjectProgress = calculateSubjectProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with Hero Animation */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12 relative"
        >
          {/* Animated Background Elements */}
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="absolute -top-20 -left-20 w-40 h-40 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              rotate: {
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20 blur-xl"
          />

          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring" }}
            className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 relative z-10"
          >
            {subjectData.name}
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative z-10"
          >
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              {subjectData.description}
            </p>
            
            {/* Subject Icon */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg"
            >
              <FiBookOpen className="w-8 h-8 text-white" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Overall Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 mb-12 relative overflow-hidden"
        >
          {/* Animated background gradient */}
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 bg-[length:200%_100%]"
          />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full"
              >
                <FiTrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  Mastery Progress
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {subjectProgress === 100 ? "Subject Mastered! 🎉" : "Your learning journey"}
                </p>
              </div>
            </div>
            
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            >
              {Math.round(subjectProgress)}%
            </motion.span>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="mt-6 relative z-10">
            <div className="w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-3 overflow-hidden">
              <motion.div
                custom={subjectProgress}
                variants={progressBarVariants}
                initial="hidden"
                animate="visible"
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
              >
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent bg-[length:200%_100%]"
                />
              </motion.div>
            </div>
            
            {/* Progress milestones */}
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Achievement badges */}
          {subjectProgress > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="flex items-center gap-3 mt-4"
            >
              <FiAward className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {subjectProgress >= 100 ? "Subject Master" : 
                 subjectProgress >= 75 ? "Advanced Learner" :
                 subjectProgress >= 50 ? "Making Progress" : "Getting Started"}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.8
              }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {subjectData.topics.map((topic, index) => {
            const completedChapters = topic.chapters.filter(chapter => 
              isChapterComplete(subject, topic.id, chapter.id)
            ).length;
            const topicProgress = (completedChapters / topic.chapters.length) * 100;

            return (
              <motion.div
                key={topic.id}
                variants={subjectVariants}
                whileHover={{ 
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredTopic(topic.id)}
                onHoverEnd={() => setHoveredTopic(null)}
                className="relative group"
              >
                <Link href={`/dashboard/subjects/${subject}/${topic.id}`}>
                  <motion.div
                    variants={glowVariants}
                    initial="initial"
                    animate={hoveredTopic === topic.id ? "pulse" : "initial"}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-gradient-to-br from-blue-500 to-purple-500" />

                    <div className="relative z-10">
                      {/* Topic Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <motion.div
                            animate={{ 
                              rotate: hoveredTopic === topic.id ? 360 : 0,
                              scale: hoveredTopic === topic.id ? 1.1 : 1
                            }}
                            transition={{ duration: 0.3 }}
                            className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
                          >
                            <FiBarChart2 className="w-5 h-5 text-white" />
                          </motion.div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {topic.name}
                          </h3>
                        </div>
                        <motion.div
                          animate={{ 
                            x: hoveredTopic === topic.id ? 5 : 0,
                            scale: hoveredTopic === topic.id ? 1.2 : 1
                          }}
                          transition={{ type: "spring", stiffness: 500 }}
                        >
                          <FiArrowRight className="w-6 h-6 text-blue-500" />
                        </motion.div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
                        {topic.description}
                      </p>

                      {/* Progress and Stats */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Progress</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {Math.round(topicProgress)}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${topicProgress}%` }}
                            transition={{ duration: 1.5, delay: index * 0.1 + 1 }}
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                          />
                        </div>

                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{completedChapters}/{topic.chapters.length} chapters</span>
                          <span>
                            {topicProgress === 100 ? "🎉 Complete" : 
                             topicProgress >= 50 ? "🔥 Halfway" : "🚀 Started"}
                          </span>
                        </div>
                      </div>

                      {/* Hover effect overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl"
                      />
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Completion Celebration */}
        {subjectProgress === 100 && mounted && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 1.5 }}
            className="mt-12 p-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl text-white text-center shadow-2xl"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center"
            >
              <FiAward className="w-8 h-8" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-2">Subject Mastered! 🏆</h3>
            <p className="opacity-90">You've conquered every topic in {subjectData.name}!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}