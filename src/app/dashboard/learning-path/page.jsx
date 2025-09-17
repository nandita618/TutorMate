// app/dashboard/learning-path/page.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiBook, FiAward, FiHeart, FiArrowRight, FiHome, FiCheckCircle, FiLock, FiZap } from 'react-icons/fi';
import { subjectsData, getProgress, getUserStats, isChapterComplete } from '@/data/index';
import { useTheme } from '@/contexts/ThemeContext';

export default function LearningPathPage() {
  const { isDarkMode } = useTheme();
  const [activeSubject, setActiveSubject] = useState('chemistry');
  const [progress, setProgress] = useState({ total: 0, completed: 0, percentage: 0 });
  const [stats, setStats] = useState({ hearts: 5, totalXP: 0, streak: 0 });
  const [hearts, setHearts] = useState(5);

  useEffect(() => {
    // Initialize progress and stats
    const progressData = getProgress();
    setProgress(progressData);
    
    const userStats = getUserStats();
    setStats(userStats);
    setHearts(userStats.hearts);
  }, []);

  // Create 5 nodes for each chapter
  const createChapterNodes = (chapter, chapterIndex, topicId, subjectId) => {
    const nodes = [];
    const totalNodes = 5;
    
    for (let i = 0; i < totalNodes; i++) {
      const nodeId = `${chapter.id}-node-${i+1}`;
      const nodeCompleted = isChapterComplete(subjectId, topicId, nodeId);
      
      // Check if node is accessible
      let accessible = false;
      if (i === 0) {
        accessible = true; // First node is always accessible
      } else {
        const prevNodeId = `${chapter.id}-node-${i}`;
        accessible = isChapterComplete(subjectId, topicId, prevNodeId);
      }
      
      nodes.push({
        id: nodeId,
        name: `Part ${i+1}`,
        completed: nodeCompleted,
        accessible: accessible,
        index: i,
        totalNodes: totalNodes
      });
    }
    
    return nodes;
  };

  const calculateTopicProgress = (subjectId, topicId) => {
    const topic = subjectsData[subjectId]?.subject?.topics.find(t => t.id === topicId);
    if (!topic) return 0;

    let completedNodes = 0;
    let totalNodes = 0;
    
    topic.chapters.forEach(chapter => {
      const nodes = createChapterNodes(chapter, 0, topicId, subjectId);
      totalNodes += nodes.length;
      completedNodes += nodes.filter(node => node.completed).length;
    });

    return Math.round((completedNodes / totalNodes) * 100);
  };

  const getNodeStatus = (node) => {
    if (node.completed) return 'completed';
    if (node.accessible) return 'available';
    return 'locked';
  };

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${
    isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
  }`}
>

      <div className="max-w-6xl mx-auto">
        {/* Header - Duolingo style */}
        <div className={`flex items-center justify-between mb-8 p-4 ${
    isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-2xl shadow-md border border-gray-200 dark:border-gray-700`}>
          <Link href="/dashboard" className="flex items-center text-green-500 hover:text-green-600 transition-colors font-bold">
            <FiHome className="mr-2" /> Dashboard
          </Link>
          
          <h1 className={`text-3xl font-bold text-center  ${
    isDarkMode ? 'text-white':'text-gray-900'}`}>Learning Path</h1>
          
          <div className="flex items-center gap-4">
            {/* Hearts */}
            {/* <div className="flex items-center bg-white dark:bg-gray-700 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-600">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="relative -ml-2 first:ml-0">
                  <svg 
                    className={`w-8 h-8 ${i < hearts ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`} 
                    viewBox="0 0 24 24" 
                    fill={i < hearts ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              ))}
            </div> */}
            <div className="flex items-center bg-white dark:bg-gray-700 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-600">
                {/* Single heart */}
                <svg
                  className={`w-8 h-8 ${hearts > 0 ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`}
                  viewBox="0 0 24 24"
                  fill={hearts > 0 ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>

                {/* Number of hearts */}
                <span className="ml-2 font-semibold text-lg text-gray-800 dark:text-gray-200">{hearts}</span>
              </div>

            
            {/* XP */}
            <div className="flex items-center bg-white dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600">
              <FiAward className="text-yellow-500 text-xl mr-2" />
              <span className="font-bold text-gray-900 dark:text-white">{stats.totalXP || 0}</span>
            </div>
            
            {/* Streak */}
            {stats.streak > 0 && (
              <div className="flex items-center bg-white dark:bg-gray-700 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600">
                <FiZap className="text-yellow-500 text-xl mr-2" />
                <span className="font-bold text-gray-900 dark:text-white">{stats.streak}</span>
              </div>
            )}
          </div>
        </div>

        {/* Subject Navigation */}
        <div className="flex overflow-x-auto gap-3 mb-8 pb-4">
          {Object.entries(subjectsData).map(([subjectId, subjectData]) => (
            <motion.button
              key={subjectId}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSubject(subjectId)}
              className={`flex-shrink-0 px-6 py-3 rounded-2xl transition-all flex items-center gap-3 font-medium ${
                activeSubject === subjectId
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md border border-gray-200 dark:border-gray-700'
              }`}
            >
              <span>{subjectData.subject.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Learning Path Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              {subjectsData[activeSubject]?.subject.name} Learning Path
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Complete nodes in order to unlock new content
            </p>
          </div>

          {/* Progress Overview */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-8 border border-green-200 dark:border-green-800">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-900 dark:text-white">Overall Progress</span>
              <span className="font-bold text-green-600 dark:text-green-400">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {progress.completed} of {progress.total} nodes completed
            </p>
          </div>

          {/* Topics and Chapters Path */}
          <div className="space-y-12">
            {subjectsData[activeSubject]?.subject.topics.map((topic, topicIndex) => (
              <div key={topic.id} className="relative">
                {/* Topic Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {topicIndex + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{topic.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {calculateTopicProgress(activeSubject, topic.id)}% Complete
                    </p>
                  </div>
                </div>

                {/* Chapters with Nodes */}
                {topic.chapters.map((chapter, chapterIndex) => {
                  const chapterNodes = createChapterNodes(chapter, chapterIndex, topic.id, activeSubject);
                  
                  return (
                    <div key={chapter.id} className="mb-10 last:mb-0">
                      {/* Chapter Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {chapterIndex + 1}
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{chapter.name}</h4>
                      </div>

                      {/* Nodes Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {chapterNodes.map((node, nodeIndex) => {
                          const nodeStatus = getNodeStatus(node);
                          
                          return (
                            <div key={node.id} className="flex flex-col items-center">
                              {/* Node */}
                              <motion.div
                                whileHover={{ scale: node.accessible ? 1.1 : 1 }}
                                className={`relative w-14 h-14 rounded-full ${node.accessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                              >
                                {nodeStatus === 'completed' ? (
                                  <div className="w-full h-full rounded-full bg-green-500 flex items-center justify-center text-white shadow-lg">
                                    <FiCheckCircle className="text-xl" />
                                  </div>
                                ) : nodeStatus === 'available' ? (
                                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-700 border-4 border-green-500 flex items-center justify-center shadow-lg">
                                    <span className="text-green-500 font-bold">{nodeIndex + 1}</span>
                                  </div>
                                ) : (
                                  <div className="w-full h-full rounded-full bg-gray-300 dark:bg-gray-600 border-4 border-gray-400 dark:border-gray-500 flex items-center justify-center shadow-lg">
                                    <FiLock className="text-gray-500 dark:text-gray-400" />
                                  </div>
                                )}
                              </motion.div>

                              {/* Node Label */}
                              <p className="text-xs mt-2 text-center text-gray-600 dark:text-gray-400">
                                {node.name}
                              </p>

                              {/* Node Action */}
                              {node.accessible ? (
                                <Link
                                  href={`/dashboard/learning-path-quiz/${activeSubject}/${topic.id}/${chapter.id}?node=${node.index}`}
                                  className="mt-2 px-3 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors flex items-center gap-1 font-medium"
                                >
                                  {node.completed ? 'Review' : 'Start'}
                                  <FiArrowRight className="text-xs" />
                                </Link>
                              ) : (
                                <div className="mt-2 px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-xs flex items-center gap-1 font-medium">
                                  <FiLock className="text-xs" />
                                  Locked
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Chapter Resources */}
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Chapter Resources</h5>
                        <div className="flex flex-wrap gap-2">
                          {chapter.videos && chapter.videos.length > 0 && (
                            <Link
                              href={`/dashboard/resources/${activeSubject}/${topic.id}/${chapter.id}/videos`}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-700/50 transition-colors"
                            >
                              Videos ({chapter.videos.length})
                            </Link>
                          )}
                          {chapter.articles && chapter.articles.length > 0 && (
                            <Link
                              href={`/dashboard/resources/${activeSubject}/${topic.id}/${chapter.id}/articles`}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-700/50 transition-colors"
                            >
                              Articles ({chapter.articles.length})
                            </Link>
                          )}
                          {chapter.pdfUrl && (
                            <Link
                              href={chapter.pdfUrl}
                              className="px-3 py-1 bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-700/50 transition-colors"
                              target="_blank"
                            >
                              PDF Notes
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}