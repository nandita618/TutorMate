// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiCheckCircle, FiXCircle, FiAward, FiClock, FiStar, FiArrowLeft, FiHome, FiRotateCw, FiZap, FiTrendingUp } from 'react-icons/fi';
// import { useParams, useRouter } from 'next/navigation';
// import { getChapterQuestions, markChapterComplete, subjectsData, isChapterComplete } from '@/data/index';
// import confetti from 'canvas-confetti';

// const QuizPage = () => {
//   const { quizId } = useParams();
//   const router = useRouter();
  
//   // Find chapter information
//   const findChapterInfo = (chapterId) => {
//     for (const subjectKey in subjectsData) {
//       const subject = subjectsData[subjectKey].subject;
//       for (const topic of subject.topics) {
//         const chapter = topic.chapters.find(c => c.id === chapterId);
//         if (chapter) {
//           return { 
//             subject: subjectKey, 
//             topic: topic.id, 
//             chapter: chapterId,
//             chapterName: chapter.name
//           };
//         }
//       }
//     }
//     return null;
//   };

//   const chapterInfo = findChapterInfo(quizId);
  
//   if (!chapterInfo) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
//         <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
//           <p className="text-red-500 text-xl mb-4">Chapter not found</p>
//           <button 
//             onClick={() => router.push('/dashboard')} 
//             className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 transition-colors"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { subject, topic, chapter, chapterName } = chapterInfo;
  
//   // State management
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [showResult, setShowResult] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [avatarState, setAvatarState] = useState('neutral');
//   const [questions, setQuestions] = useState([]);
//   const [points, setPoints] = useState(0);
//   const [quizTimeLimit, setQuizTimeLimit] = useState(0);
//   const [showTimeWarning, setShowTimeWarning] = useState(false);
//   const [chapterCompleted, setChapterCompleted] = useState(false);
//   const [xpGained, setXpGained] = useState(0);
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [achievements, setAchievements] = useState([]);
  
//   // Sound references - only the ones we need
//   const correctSoundRef = useRef(null);
//   const incorrectSoundRef = useRef(null);
//   const levelUpSoundRef = useRef(null);

//   // Initialize quiz
//   useEffect(() => {
//     const chapterQuestions = getChapterQuestions(subject, chapter);
//     setQuestions(chapterQuestions);

//     if (chapterQuestions && chapterQuestions.length > 0) {
//       // Set time limit based on number of questions (5 minutes per question)
//       const timeLimit = chapterQuestions.length * 2.5 * 60;
//       setQuizTimeLimit(timeLimit);
//       setTimeLeft(timeLimit);
//     }

//     // Check if chapter is already completed
//     setChapterCompleted(isChapterComplete(subject, topic, chapter));
//   }, [subject, topic, chapter]);

//   // Timer effect
//   useEffect(() => {
//     if (timeLeft <= 0 || showResult) return;

//     const timerId = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
      
//       // Show warning when time is running out
//       if (timeLeft === 60 && !showTimeWarning) {
//         setShowTimeWarning(true);
//         document.querySelector('.timer-container')?.classList.add('animate-pulse');
//       }
      
//       // Time's up
//       if (timeLeft === 0) {
//         setShowResult(true);
//       }
//     }, 1000);

//     return () => clearInterval(timerId);
//   }, [timeLeft, showResult]);

//   // Handle answer selection
//   const handleAnswerSelect = (answerIndex, isCorrectAnswer) => {
//     if (selectedAnswer !== null) return;
    
//     setSelectedAnswer(answerIndex);
//     setIsCorrect(isCorrectAnswer);
//     setShowFeedback(true);
    
//     // Play sound and update state based on correctness
//     if (isCorrectAnswer) {
//       correctSoundRef.current.play();
//       setAvatarState('happy');
//       const pointsEarned = 10;
//       setScore(score + 1);
//       setPoints(points + pointsEarned);
//       setXpGained(xpGained + pointsEarned);
      
//       // Trigger confetti for correct answers
//       confetti({ particleCount: 30, spread: 70, origin: { y: 0.6 } });
//     } else {
//       incorrectSoundRef.current.play();
//       setAvatarState('sad');
//     }
    
//     // Move to next question or show results
//     setTimeout(() => {
//       setShowFeedback(false);
//       if (currentQuestion < questions.length - 1) {
//         setCurrentQuestion(currentQuestion + 1);
//         setSelectedAnswer(null);
//         setIsCorrect(null);
//         setAvatarState('neutral');
//       } else {
//         const finalScore = isCorrectAnswer ? score + 1 : score;
//         setShowResult(true);
        
//         // Mark chapter as complete if score is 70% or higher
//         if (finalScore >= questions.length * 0.7) {
//           levelUpSoundRef.current?.play();
//           if (!chapterCompleted) {
//             markChapterComplete(subject, topic, chapter);
//             setChapterCompleted(true);
            
//             // Big confetti for passing
//             confetti({ 
//               particleCount: 150, 
//               spread: 100,
//               origin: { y: 0.6 }
//             });
            
//             // Achievement for perfect score
//             if (finalScore === questions.length) {
//               const newAchievement = "Perfect Score! +50 Bonus XP";
//               setAchievements(prev => [...prev, newAchievement]);
//               setXpGained(prev => prev + 50);
              
//               setTimeout(() => {
//                 setAchievements(prev => prev.filter(a => a !== newAchievement));
//               }, 3000);
//             }
//           }
//         }
//       }
//     }, 1500);
//   };

//   // Restart quiz
//   const restartQuiz = () => {
//     setCurrentQuestion(0);
//     setSelectedAnswer(null);
//     setScore(0);
//     setShowResult(false);
//     setIsCorrect(null);
//     setTimeLeft(quizTimeLimit);
//     setAvatarState('neutral');
//     setPoints(0);
//     setXpGained(0);
//     setShowTimeWarning(false);
//     setAchievements([]);
    
//     // Reset timer animation
//     document.querySelector('.timer-container')?.classList.remove('animate-pulse');
//   };

//   // Navigation functions
//   const goToChapter = () => {
//     router.push(`/dashboard/subjects/${subject}/${topic}/${chapter}`);
//   };

//   const goToDashboard = () => {
//     router.push('/dashboard');
//   };

//   // Format time display
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
//   };

//   if (questions.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
//         <div className="text-center">
//           <motion.div
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//             className="rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
//           ></motion.div>
//           <p className="text-gray-600 dark:text-gray-300">Loading quiz questions...</p>
//         </div>
//       </div>
//     );
//   }

//   if (showResult) {
//     const percentage = Math.round((score / questions.length) * 100);
//     const passed = percentage >= 70;
    
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
//         {/* Sound elements */}
//         <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
//         <audio ref={incorrectSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
//         <audio ref={levelUpSoundRef} src="/sounds/levelUp.mp3" preload="auto" />
        
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center relative overflow-hidden"
//         >
//           {/* Background decoration */}
//           <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl"></div>
//           <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-xl"></div>
          
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
//             className="w-24 h-24 mx-auto mb-6 relative"
//           >
//             {passed ? (
//               <>
//                 <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
//                   <FiAward className="text-white text-4xl" />
//                 </div>
//                 <motion.div
//                   animate={{ 
//                     scale: [1, 1.2, 1],
//                     rotate: [0, 10, -10, 0]
//                   }}
//                   transition={{ repeat: Infinity, duration: 2 }}
//                   className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1"
//                 >
//                   <FiStar className="text-white" />
//                 </motion.div>
//               </>
//             ) : (
//               <div className="w-full h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
//                 <FiXCircle className="text-white text-4xl" />
//               </div>
//             )}
//           </motion.div>
          
//           <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
//             {passed ? 'Quiz Completed!' : 'Try Again'}
//           </h2>
          
//           <p className="text-gray-600 dark:text-gray-300 mb-2">
//             You scored {score} out of {questions.length}
//           </p>
          
//           <div className="flex items-center justify-center gap-2 mb-4">
//             <FiTrendingUp className="text-blue-500" />
//             <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
//               +{xpGained} XP earned!
//             </p>
//           </div>
          
//           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6 relative overflow-hidden">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${percentage}%` }}
//               transition={{ duration: 1, ease: "easeOut" }}
//               className={`h-4 rounded-full ${percentage >= 70 ? 'bg-green-500' : 'bg-red-500'} relative`}
//             >
//               <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
//             </motion.div>
//             <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-800 dark:text-white">
//               {percentage}%
//             </div>
//           </div>
          
//           <div className="flex flex-col gap-4 justify-center">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={restartQuiz}
//               className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-200 dark:hover:shadow-blue-900/30 transition-shadow"
//             >
//               <FiRotateCw />
//               Retry Quiz
//             </motion.button>
            
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={goToChapter}
//               className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full font-medium shadow-lg hover:shadow-gray-200 dark:hover:shadow-gray-900/30 transition-shadow"
//             >
//               Back to Chapter
//             </motion.button>

//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={goToDashboard}
//               className="px-6 py-3 bg-green-500 text-white rounded-full font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-green-200 dark:hover:shadow-green-900/30 transition-shadow"
//             >
//               <FiHome className="inline" />
//               Dashboard
//             </motion.button>
//           </div>
          
//           {passed && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="mt-6 p-4 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl border border-green-200 dark:border-green-800"
//             >
//               <p className="text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
//                 <FiCheckCircle /> Chapter marked as complete!
//               </p>
//             </motion.div>
//           )}
//         </motion.div>
//       </div>
//     );
//   }

//   const question = questions[currentQuestion];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6 relative overflow-hidden">
//       {/* Sound elements */}
//       <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
//       <audio ref={incorrectSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
//       <audio ref={levelUpSoundRef} src="/sounds/levelUp.mp3" preload="auto" />
      
//       {/* Animated background elements */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//         <motion.div
//           animate={{ 
//             x: [0, 100, 0],
//             y: [0, 50, 0],
//             rotate: [0, 180, 360]
//           }}
//           transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//           className="absolute top-1/4 left-1/4 w-20 h-20 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-lg opacity-50"
//         ></motion.div>
//         <motion.div
//           animate={{ 
//             x: [0, -80, 0],
//             y: [0, -30, 0],
//             rotate: [0, -180, -360]
//           }}
//           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
//           className="absolute bottom-1/3 right-1/3 w-16 h-16 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-lg opacity-50"
//         ></motion.div>
//       </div>
      
//       {/* Achievement notifications */}
//       <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
//         <AnimatePresence>
//           {achievements.map((achievement, index) => (
//             <motion.div
//               key={index}
//               initial={{ opacity: 0, x: 100 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 100 }}
//               className="bg-yellow-100 dark:bg-yellow-900/80 border border-yellow-300 dark:border-yellow-700 rounded-lg p-3 shadow-lg flex items-center gap-2"
//             >
//               <FiZap className="text-yellow-600 dark:text-yellow-400 animate-pulse" />
//               <span className="text-yellow-800 dark:text-yellow-200 font-medium text-sm">
//                 {achievement}
//               </span>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
      
//       <div className="max-w-2xl mx-auto relative z-10">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6 md:mb-8">
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => router.back()}
//             className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
//           >
//             <FiArrowLeft />
//             <span>Back</span>
//           </motion.button>
          
//           <div className="flex items-center gap-2 md:gap-4">
//             {/* Timer with warning animation */}
//             <motion.div
//               key={timeLeft}
//               initial={{ scale: 1.2 }}
//               animate={{ scale: 1 }}
//               className={`timer-container flex items-center gap-1 px-2 md:px-3 py-1 rounded-full border ${
//                 timeLeft < 60 ? 
//                 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700' : 
//                 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700'
//               }`}
//             >
//               <FiClock className="text-sm md:text-base" />
//               <span className="font-medium text-sm md:text-base">{formatTime(timeLeft)}</span>
//             </motion.div>
            
//             {/* Score */}
//             <div className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300">
//               {currentQuestion + 1}/{questions.length}
//             </div>
//           </div>
//         </div>
        
//         {/* Progress bar */}
//         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
//           <motion.div 
//             initial={{ width: 0 }}
//             animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
//             transition={{ duration: 0.5 }}
//             className="h-2 rounded-full bg-blue-500"
//           />
//         </div>
        
//         {/* Avatar with animations */}
//         <div className="flex justify-center mb-6 md:mb-8">
//           <motion.div
//             key={avatarState}
//             initial={{ x: -100, opacity: 0 }}
//             animate={{
//               x: 0,
//               opacity: 1,
//               scale: avatarState === 'happy' ? [1, 1.2] : 
//                      avatarState === 'sad' ? [1, 0.9] : 1,
//               y: avatarState === 'happy' ? [0, -20] : 
//                  avatarState === 'sad' ? [0, 10] : 0,
//             }}
//             exit={{ x: 100, opacity: 0 }}
//             transition={{ 
//               type: "spring", 
//               stiffness: 100,
//               duration: 0.5,
//                repeat:Infinity,
//               repeatType:'reverse'
//             }}
//             className="relative w-24 h-24 md:w-32 md:h-32 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center overflow-hidden border-4 border-white dark:border-gray-600"
//           >
//             <img 
//               src={`/avatars/${avatarState}.png`} 
//               alt={avatarState}
//               className="w-full h-full object-cover"
//             />
            
//             {/* Floating XP indicator */}
//             <AnimatePresence>
//               {showFeedback && isCorrect && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 0 }}
//                   animate={{ opacity: 1, y: -30 }}
//                   exit={{ opacity: 0 }}
//                   className="absolute text-green-500 font-bold text-lg"
//                 >
//                   +10 XP
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </div>
        
//         {/* Question */}
//         <motion.div
//           key={currentQuestion}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6 border border-gray-100 dark:border-gray-700"
//         >
//           <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
//             {question.questionText}
//           </h2>
          
//           {question.image && (
//             <div className="mb-4 rounded-lg overflow-hidden">
//               <img 
//                 src={question.image} 
//                 alt="Question illustration" 
//                 className="w-full h-auto max-h-48 object-contain"
//               />
//             </div>
//           )}
//         </motion.div>
        
//         {/* Answers */}
//         <div className="grid gap-3 md:gap-4">
//           {question.options.map((option, index) => {
//             const isSelected = selectedAnswer === index;
//             const isCorrectAnswer = index === question.correctAnswer;
            
//             let bgColor = "bg-white dark:bg-gray-800";
//             let borderColor = "border-gray-200 dark:border-gray-700";
//             let textColor = "text-gray-900 dark:text-white";
//             let hoverStyle = "hover:bg-gray-50 dark:hover:bg-gray-750";
            
//             if (selectedAnswer !== null) {
//               if (isSelected) {
//                 bgColor = isCorrect ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30";
//                 borderColor = isCorrect ? "border-green-200 dark:border-green-700" : "border-red-200 dark:border-red-700";
//                 textColor = isCorrect ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200";
//               } else if (isCorrectAnswer) {
//                 bgColor = "bg-green-50 dark:bg-green-900/20";
//                 borderColor = "border-green-200 dark:border-green-700";
//                 textColor = "text-green-800 dark:text-green-200";
//               }
//             }
            
//             return (
//               <motion.button
//                 key={index}
//                 whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
//                 whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 onClick={() => handleAnswerSelect(index, isCorrectAnswer)}
//                 disabled={selectedAnswer !== null}
//                 className={`p-4 rounded-xl border ${bgColor} ${borderColor} ${textColor} ${hoverStyle} transition-all text-left flex items-center gap-4 shadow-sm hover:shadow-md disabled:cursor-not-allowed`}
//               >
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
//                   selectedAnswer === null ? 
//                   "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
//                   isSelected ? 
//                     (isCorrect ? 
//                       "bg-green-500 text-white" : 
//                       "bg-red-500 text-white") :
//                     isCorrectAnswer ? 
//                       "bg-green-500 text-white" : 
//                       "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//                 }`}>
//                   {String.fromCharCode(65 + index)}
//                 </div>
//                 <span className="font-medium">{option}</span>
                
//                 {selectedAnswer !== null && (
//                   <div className="ml-auto">
//                     {isSelected && isCorrect && (
//                       <FiCheckCircle className="text-green-500 text-xl" />
//                     )}
//                     {isSelected && !isCorrect && (
//                       <FiXCircle className="text-red-500 text-xl" />
//                     )}
//                     {!isSelected && isCorrectAnswer && (
//                       <FiCheckCircle className="text-green-500 text-xl" />
//                     )}
//                   </div>
//                 )}
//               </motion.button>
//             );
//           })}
//         </div>
        
//         {/* Feedback overlay */}
//         <AnimatePresence>
//           {showFeedback && (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40"
//             >
//               <motion.div
//                 initial={{ scale: 0.8 }}
//                 animate={{ scale: 1 }}
//                 className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center"
//               >
//                 {isCorrect ? (
//                   <>
//                     <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <FiCheckCircle className="text-green-500 text-3xl" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">Correct!</h3>
//                     <p className="text-gray-600 dark:text-gray-400">Great job! Keep it up!</p>
//                   </>
//                 ) : (
//                   <>
//                     <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
//                       <FiXCircle className="text-red-500 text-3xl" />
//                     </div>
//                     <h3 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-2">Incorrect</h3>
//                     <p className="text-gray-600 dark:text-gray-400">Don't worry, try again next time!</p>
//                   </>
//                 )}
//               </motion.div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default QuizPage;






'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAward, FiClock, FiStar, FiArrowLeft, FiSettings, FiRefreshCw } from 'react-icons/fi';
import { useParams, useRouter } from 'next/navigation';
import { markChapterComplete } from '@/data/index';
import { useAIQuiz } from '@/hooks/useAIQuiz';
import confetti from 'canvas-confetti';

const AIQuizPage = () => {
  const { subject, topic, chapter } = useParams();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [avatarState, setAvatarState] = useState('neutral');
  const [streak, setStreak] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [quizSettings, setQuizSettings] = useState({
    difficulty: 'medium',
    questionCount: 5
  });
  const [showSettings, setShowSettings] = useState(false);
  
  const { generateQuiz, loading, error } = useAIQuiz();
  
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const levelUpSoundRef = useRef(null);
  const streakSoundRef = useRef(null);

  useEffect(() => {
    loadAIQuiz();
  }, [subject, topic, chapter]);

  const loadAIQuiz = async () => {
    try {
      const quizData = await generateQuiz(subject, topic, chapter, quizSettings.difficulty, quizSettings.questionCount);
      setQuestions(quizData.questions);
      
      // Set time limit based on question count
      const timeLimits = {
        5: 5 * 60,    // 5 minutes for 5 questions
        10: 10 * 60,  // 10 minutes for 10 questions
        15: 15 * 60,  // 15 minutes for 15 questions
      };
      
      const timeLimit = timeLimits[quizSettings.questionCount] || (quizSettings.questionCount * 60);
      setTimeLeft(timeLimit);
    } catch (err) {
      console.error('Failed to load AI quiz:', err);
    }
  };

  useEffect(() => {
    if (questions.length === 0) return;
    
    if (timeLeft <= 0) {
      handleTimeUp();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, questions]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex, isCorrectAnswer) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setIsCorrect(isCorrectAnswer);
    
    if (isCorrectAnswer) {
      correctSoundRef.current.play();
      setAvatarState('happy');
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak % 3 === 0) {
          streakSoundRef.current.play();
        }
        return newStreak;
      });
    } else {
      incorrectSoundRef.current.play();
      setAvatarState('sad');
      setStreak(0);
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setAvatarState('neutral');
      } else {
        completeQuiz();
      }
    }, 1500);
  };

  const handleTimeUp = () => {
    completeQuiz();
  };

  const completeQuiz = () => {
    setShowResult(true);
    
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    
    if (passed) {
      levelUpSoundRef.current.play();
      confetti({ 
        particleCount: 150, 
        spread: 80, 
        origin: { y: 0.1 } 
      });
      markChapterComplete(subject, topic, chapter);
    }
  };

  const restartQuiz = async () => {
    // Regenerate new questions
    await loadAIQuiz();
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsCorrect(null);
    setAvatarState('neutral');
    setStreak(0);
  };

  const goToChapter = () => {
    router.push(`/dashboard/subjects/${subject}/${topic}/${chapter}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-300">AI is generating your quiz...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="text-red-500 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Failed to generate quiz</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={loadAIQuiz}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2 mx-auto"
          >
            <FiRefreshCw /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Preparing your quiz...</p>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        {/* Sound elements */}
        <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
        <audio ref={incorrectSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
        <audio ref={levelUpSoundRef} src="/sounds/levelUp.mp3" preload="auto" />
        <audio ref={streakSoundRef} src="/sounds/streak.mp3" preload="auto" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 mx-auto mb-6 relative"
          >
            {passed ? (
              <>
                <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                  <FiAward className="text-white text-4xl" />
                </div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1"
                >
                  <FiStar className="text-white" />
                </motion.div>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <FiXCircle className="text-white text-4xl" />
              </div>
            )}
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {passed ? 'Quiz Completed!' : 'Try Again'}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You scored {score} out of {questions.length}
          </p>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-4 rounded-full ${percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
            />
          </div>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartQuiz}
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium flex items-center gap-2"
            >
              <FiRefreshCw /> New Quiz
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(true)}
              className="px-6 py-3 bg-gray-500 text-white rounded-full font-medium flex items-center gap-2"
            >
              <FiSettings /> Settings
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToChapter}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full font-medium"
            >
              Back to Chapter
            </motion.button>
          </div>
          
          {passed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 p-4 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl"
            >
              <p className="text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                <FiCheckCircle /> Chapter marked as complete!
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Quiz Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">Quiz Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Difficulty</label>
                    <select
                      value={quizSettings.difficulty}
                      onChange={(e) => setQuizSettings({...quizSettings, difficulty: e.target.value})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Questions</label>
                    <select
                      value={quizSettings.questionCount}
                      onChange={(e) => setQuizSettings({...quizSettings, questionCount: parseInt(e.target.value)})}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="5">5 Questions</option>
                      <option value="10">10 Questions</option>
                      <option value="15">15 Questions</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowSettings(false);
                      restartQuiz();
                    }}
                    className="flex-1 py-3 bg-blue-500 text-white rounded-lg font-medium"
                  >
                    Apply & New Quiz
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      {/* Sound elements */}
      <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={incorrectSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
      <audio ref={levelUpSoundRef} src="/sounds/levelUp.mp3" preload="auto" />
      <audio ref={streakSoundRef} src="/sounds/streak.mp3" preload="auto" />
      
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <motion.button
            whileHover={{ scale: 1.1, x: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={goToChapter}
            className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all"
          >
            <FiArrowLeft className="text-lg" />
          </motion.button>
          
          <div className="flex items-center gap-4">
            {/* Streak counter */}
            {streak > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full"
              >
                <FiStar className="text-yellow-500" />
                <span className="font-medium text-yellow-700 dark:text-yellow-300">×{streak}</span>
              </motion.div>
            )}
            
            {/* Timer */}
            <motion.div
              key={timeLeft}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                timeLeft < 60 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 
                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              }`}
            >
              <FiClock />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </motion.div>
            
            {/* Score */}
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {currentQuestion + 1}/{questions.length}
            </div>

            {/* Settings button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg"
            >
              <FiSettings className="text-lg" />
            </motion.button>
          </div>
        </div>
        
        {/* AI Generated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium w-fit mx-auto mb-6 flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          AI-Powered Quiz
        </motion.div>
        
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <motion.div
            key={avatarState}
            animate={{ 
              scale: [1, 1.1, 1],
              y: avatarState === 'happy' ? [0, -20, 0] : 
                 avatarState === 'sad' ? [0, 10, 0] : [0, 0, 0]
            }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center"
          >
            <img 
              src={`/avatars/${avatarState}.png`} 
              alt={avatarState}
              className="w-24 h-24"
            />
          </motion.div>
        </div>
        
        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {question.questionText}
          </h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                onClick={() => handleAnswerSelect(index, index === question.correctAnswer)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                  selectedAnswer === null
                    ? 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    : index === question.correctAnswer
                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                    : selectedAnswer === index
                    ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    selectedAnswer === null
                      ? 'bg-gray-200 dark:bg-gray-600'
                      : index === question.correctAnswer
                      ? 'bg-green-500 text-white'
                      : selectedAnswer === index
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className={selectedAnswer !== null && index === question.correctAnswer 
                    ? 'font-medium text-green-700 dark:text-green-300' 
                    : selectedAnswer === index
                    ? 'text-red-700 dark:text-red-300'
                    : 'text-gray-700 dark:text-gray-300'
                  }>
                    {option}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
        
        {/* Explanation */}
        <AnimatePresence>
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`p-4 rounded-2xl mb-8 ${
                isCorrect 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}
            >
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <FiCheckCircle className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
                ) : (
                  <FiXCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium mb-1">
                    {isCorrect ? 'Correct!' : 'Incorrect'}
                  </p>
                  <p>{question.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-2 rounded-full bg-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default AIQuizPage;
