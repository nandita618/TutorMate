

'use client';

import { motion,  } from "framer-motion";//AnimatePresence
import { FiFileText, FiYoutube, FiCheckCircle, FiArrowRight, FiExternalLink, FiArrowLeft, FiBookOpen, FiAward, FiPlay, FiClock } from "react-icons/fi";
import { subjectsData, markChapterComplete, getNextChapter, getChapterVideos, getChapterQuestions, isChapterComplete } from "@/data/index";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import confetti from 'canvas-confetti';

export default function ChapterPage() {
  const { subject, topic, chapter } = useParams();
  const router = useRouter();
  const [showConfetti, setShowConfetti] = useState(false);
  const [chapterCompleted, setChapterCompleted] = useState(false);
  //const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const completeSoundRef = useRef(null);
  
  const chapterData = subjectsData[subject]?.subject?.topics
    .find((t) => t.id === topic)?.chapters.find((c) => c.id === chapter);

  const nextChapter = getNextChapter(subject, topic, chapter);
  const videos = getChapterVideos(subject, topic, chapter);
  const questions = getChapterQuestions(subject, chapter);

  useEffect(() => {
    // Check if chapter is already completed
    setChapterCompleted(isChapterComplete(subject, topic, chapter));
  }, [subject, topic, chapter]);

  const handleComplete = () => {
    if (!chapterCompleted) {
      markChapterComplete(subject, topic, chapter);
      setChapterCompleted(true);
      setShowConfetti(true);
      completeSoundRef.current.play();
      confetti({ particleCount: 100, spread: 70 });
    }
  };
  // const handleComplete = () => {
  //   setShowConfirmModal(true); // Open the modal instead of completing
  // };
  // const confirmCompletion = () => {
  //   if (!chapterCompleted) {
  //     markChapterComplete(subject, topic, chapter);
  //     setChapterCompleted(true);
  //     setShowConfetti(true);
  //     completeSoundRef.current.play();
  //     confetti({ particleCount: 100, spread: 70 });
  //   }
  //   setShowConfirmModal(false); // Close the modal
  // };
  // const cancelCompletion = () => {
  //   setShowConfirmModal(false); // Close the modal
  // };

  const handleTakeQuiz = () => {
    //console.log('Navigating to quiz for chapter:', chapter);
  router.push(`/dashboard/quiz/chapter/${chapter}`);
};

  if (!chapterData) {
    return <div className="p-6">Chapter not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      {/* Sound elements */}
      <audio ref={completeSoundRef} src="/sounds/levelUp.mp3" preload="auto" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header with back button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/dashboard/subjects/${subject}/${topic}`)}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
          >
            <FiArrowLeft className="text-lg" />
          </motion.button>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {chapterData.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {subject} • {topic}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PDF Viewer - Larger size */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiFileText className="text-blue-500 text-xl" />
                  <h2 className="font-semibold text-lg">Study Material</h2>
                </div>
              </div>
              
              {/* Enhanced PDF Viewer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700"
              >
                <iframe
                  src={chapterData.pdfUrl}
                  className="w-full h-96 md:h-[500px] lg:h-[600px]"
                  title="PDF Viewer"
                />
                
                {/* PDF Controls Overlay */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg"
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      iframe.contentWindow.postMessage('zoomIn', '*');
                    }}
                  >
                    <span className="text-lg font-bold">+</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg"
                    onClick={() => {
                      const iframe = document.querySelector('iframe');
                      iframe.contentWindow.postMessage('zoomOut', '*');
                    }}
                  >
                    <span className="text-lg font-bold">-</span>
                  </motion.button>
                </div>
              </motion.div>
              
              {/* Chapter Navigation */}
              <div className="flex justify-between mt-6">
                <motion.button
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(`/dashboard/subjects/${subject}/${topic}`)}
                  className="flex items-center gap-2 text-blue-500 font-medium"
                >
                  <FiArrowLeft />
                  Back to Topics
                </motion.button>
                
                {nextChapter && chapterCompleted && (
                  <motion.button
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/dashboard/subjects/${subject}/${topic}/${nextChapter.id}`)}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Next Chapter
                    <FiArrowRight />
                  </motion.button>
                )}
              </div>
            </div>
            
            {/* Additional Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Quick Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FiBookOpen className="text-green-500" />
                  Quick Summary
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {chapterData.summary || "Key concepts and important points from this chapter will appear here for quick revision."}
                </p>
              </div>
              
              {/* Flashcards */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <FiAward className="text-yellow-500" />
                  Flashcards
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Interactive flashcards to help you memorize key terms and definitions from this chapter.
                </p>
                <button className="mt-3 text-blue-500 text-sm font-medium">
                  View Flashcards →
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg"
            >
              <h3 className="font-semibold text-lg mb-4">Your Progress</h3>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-600 dark:text-gray-300">Completion</span>
                <span className="font-bold text-blue-500">{chapterCompleted ? '100%' : '0%'}</span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="h-2 rounded-full bg-blue-500 transition-all duration-500" 
                  style={{ width: chapterCompleted ? '100%' : '0%' }} 
                />
              </div>
              
              {/* Quiz Button - Only show if chapter is not completed */}
              {!chapterCompleted && questions.length > 0 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTakeQuiz}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 mb-4 transition-all hover:shadow-lg"
                >
                  <FiPlay className="text-lg" />
                  Take Quiz
                </motion.button>
              )}
              
              {/* Quiz Info */}
              {questions.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <FiClock className="text-sm" />
                  <span>{questions.length} questions • ~{questions.length * 5} minutes</span>
                </div>
              )}
              
              {/* Mark as Complete Button - Only show if chapter is completed */}
              {chapterCompleted ? (
                <div className="text-center">
                  <div className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 opacity-75">
                    <FiCheckCircle className="text-lg" />
                    Chapter Completed
                  </div>
                  
                  {nextChapter && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => router.push(`/dashboard/subjects/${subject}/${topic}/${nextChapter.id}`)}
                      className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg"
                    >
                      Go to Next Chapter
                      <FiArrowRight className="text-lg" />
                    </motion.button>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={!chapterCompleted}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiCheckCircle className="text-lg" />
                  Mark as Complete
                </button>
              )}
            </motion.div>

            {/* Videos */}
            {videos.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FiYoutube className="text-red-500 text-xl" />
                  <h3 className="font-semibold text-lg">Video Resources</h3>
                </div>
                <div className="space-y-4">
                  {videos.map((video, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}`}
                        className="w-full h-full"
                        title={video.title}
                        allowFullScreen
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 p-2">
                        {video.title}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Articles */}
            {chapterData.articles && chapterData.articles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FiExternalLink className="text-blue-500 text-xl" />
                  <h3 className="font-semibold text-lg">Recommended Articles</h3>
                </div>
                <div className="space-y-3">
                  {chapterData.articles.map((article, index) => (
                    <motion.a
                      key={index}
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 5 }}
                      className="block p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {article.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new URL(article.url).hostname}
                      </p>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Related Topics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg"
            >
              <h3 className="font-semibold text-lg mb-4">Related Topics</h3>
              <div className="space-y-2">
                {chapterData.relatedTopics?.map((topic, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-2 p-2 text-sm text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer"
                  >
                    <FiArrowRight className="text-xs" />
                    <span>{topic}</span>
                  </motion.div>
                )) || (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No related topics available.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Confetti */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50" />
        )}
      </div>
      
    </div>
  );
}