// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiCheckCircle, FiXCircle, FiAward, FiClock, FiStar } from 'react-icons/fi';
// import { useParams, useRouter } from 'next/navigation';
// import { getChapterQuestions, markChapterComplete } from '@/data/index';

// const QuizPage = () => {
//   const { subject, topic, chapter } = useParams();
//   const router = useRouter();
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [showResult, setShowResult] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const [avatarState, setAvatarState] = useState('neutral');
//   const [streak, setStreak] = useState(0);
//   const [questions, setQuestions] = useState([]);
  
//   const correctSoundRef = useRef(null);
//   const incorrectSoundRef = useRef(null);
//   const levelUpSoundRef = useRef(null);
//   const streakSoundRef = useRef(null);

//   useEffect(() => {
//     // Load questions for this chapter
//     const chapterQuestions = getChapterQuestions(subject, chapter);
//     setQuestions(chapterQuestions);
    
//     // Set up timer
//     const timer = timeLeft > 0 && !showResult && setInterval(() => {
//       setTimeLeft(timeLeft - 1);
//     }, 1000);
    
//     // Clean up timer
//     return () => clearInterval(timer);
//   }, [timeLeft, showResult, subject, chapter]);

//   useEffect(() => {
//     // Reset timer when question changes
//     setTimeLeft(30);
//   }, [currentQuestion]);

//   useEffect(() => {
//     // Handle timeout
//     if (timeLeft === 0 && !showResult) {
//       handleAnswerSelect(null, false);
//     }
//   }, [timeLeft, showResult]);

//   const handleAnswerSelect = (answerIndex, isCorrectAnswer) => {
//     if (selectedAnswer !== null) return; // Prevent multiple selections
    
//     setSelectedAnswer(answerIndex);
//     setIsCorrect(isCorrectAnswer);
    
//     // Play sound
//     if (isCorrectAnswer) {
//       correctSoundRef.current.play();
//       setAvatarState('happy');
//       setScore(score + 1);
//       setStreak(streak + 1);
      
//       // Play streak sound for every 3 correct answers
//       if ((streak + 1) % 3 === 0) {
//         streakSoundRef.current.play();
//       }
//     } else {
//       incorrectSoundRef.current.play();
//       setAvatarState('sad');
//       setStreak(0);
//     }
    
//     // Show result for 1.5 seconds before moving to next question
//     setTimeout(() => {
//       if (currentQuestion < questions.length - 1) {
//         setCurrentQuestion(currentQuestion + 1);
//         setSelectedAnswer(null);
//         setIsCorrect(null);
//         setAvatarState('neutral');
//       } else {
//         setShowResult(true);
//         if (score + (isCorrectAnswer ? 1 : 0) >= questions.length * 0.7) {
//           levelUpSoundRef.current.play();
//           markChapterComplete(subject, topic, chapter);
//         }
//       }
//     }, 1500);
//   };

//   const restartQuiz = () => {
//     setCurrentQuestion(0);
//     setSelectedAnswer(null);
//     setScore(0);
//     setShowResult(false);
//     setIsCorrect(null);
//     setTimeLeft(30);
//     setAvatarState('neutral');
//     setStreak(0);
//   };

//   const goToChapter = () => {
//     router.push(`/dashboard/subjects/${subject}/${topic}/${chapter}`);
//   };

//   if (questions.length === 0) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
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
//         <audio ref={streakSoundRef} src="/sounds/streak.mp3" preload="auto" />
        
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
//         >
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
          
//           <p className="text-gray-600 dark:text-gray-300 mb-6">
//             You scored {score} out of {questions.length}
//           </p>
          
//           <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-6">
//             <motion.div
//               initial={{ width: 0 }}
//               animate={{ width: `${percentage}%` }}
//               transition={{ duration: 1, ease: "easeOut" }}
//               className={`h-4 rounded-full ${percentage >= 70 ? 'bg-green-500' : 'bg-red-500'}`}
//             />
//           </div>
          
//           <div className="flex gap-4 justify-center">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={restartQuiz}
//               className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium"
//             >
//               Retry Quiz
//             </motion.button>
            
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={goToChapter}
//               className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full font-medium"
//             >
//               Back to Chapter
//             </motion.button>
//           </div>
          
//           {passed && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//               className="mt-6 p-4 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-xl"
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
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
//       {/* Sound elements */}
//       <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
//       <audio ref={incorrectSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
//       <audio ref={levelUpSoundRef} src="/sounds/levelUp.mp3" preload="auto" />
//       <audio ref={streakSoundRef} src="/sounds/streak.mp3" preload="auto" />
      
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Chapter Quiz</h1>
//             <p className="text-gray-600 dark:text-gray-400">{subject} • {topic}</p>
//           </div>
          
//           <div className="flex items-center gap-4">
//             {/* Streak counter */}
//             {streak > 1 && (
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full"
//               >
//                 <FiStar className="text-yellow-500" />
//                 <span className="font-medium text-yellow-700 dark:text-yellow-300">×{streak}</span>
//               </motion.div>
//             )}
            
//             {/* Timer */}
//             <motion.div
//               key={timeLeft}
//               initial={{ scale: 1.2 }}
//               animate={{ scale: 1 }}
//               className={`flex items-center gap-1 px-3 py-1 rounded-full ${
//                 timeLeft < 10 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 
//                 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
//               }`}
//             >
//               <FiClock />
//               <span className="font-medium">{timeLeft}s</span>
//             </motion.div>
            
//             {/* Score */}
//             <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
//               {currentQuestion + 1}/{questions.length}
//             </div>
//           </div>
//         </div>
        
//         {/* Avatar */}
//         <div className="flex justify-center mb-8">
//           <motion.div
//             key={avatarState}
//             animate={{ 
//               scale: [1, 1.1, 1],
//               y: avatarState === 'happy' ? [0, -20, 0] : 
//                  avatarState === 'sad' ? [0, 10, 0] : [0, 0, 0]
//             }}
//             transition={{ duration: 0.5 }}
//             className="w-32 h-32 rounded-full bg-white dark:bg-gray-700 shadow-lg flex items-center justify-center"
//           >
//             <img 
//               src={`/avatars/${avatarState}.png`} 
//               alt={avatarState}
//               className="w-24 h-24"
//             />
//           </motion.div>
//         </div>
        
//         {/* Question */}
//         <motion.div
//           key={currentQuestion}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8"
//         >
//           <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
//             {question.questionText}
//           </h2>
          
//           <div className="space-y-3">
//             {question.options.map((option, index) => (
//               <motion.button
//                 key={index}
//                 whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
//                 whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
//                 onClick={() => handleAnswerSelect(index, index === question.correctAnswer)}
//                 disabled={selectedAnswer !== null}
//                 className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
//                   selectedAnswer === null
//                     ? 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30'
//                     : index === question.correctAnswer
//                     ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
//                     : selectedAnswer === index
//                     ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
//                     : 'bg-gray-100 dark:bg-gray-700'
//                 }`}
//               >
//                 <div className="flex items-center">
//                   <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
//                     selectedAnswer === null
//                       ? 'bg-gray-200 dark:bg-gray-600'
//                       : index === question.correctAnswer
//                       ? 'bg-green-500 text-white'
//                       : selectedAnswer === index
//                       ? 'bg-red-500 text-white'
//                       : 'bg-gray-200 dark:bg-gray-600'
//                   }`}>
//                     {String.fromCharCode(65 + index)}
//                   </div>
//                   <span className={selectedAnswer !== null && index === question.correctAnswer 
//                     ? 'font-medium text-green-700 dark:text-green-300' 
//                     : selectedAnswer === index
//                     ? 'text-red-700 dark:text-red-300'
//                     : 'text-gray-700 dark:text-gray-300'
//                   }>
//                     {option}
//                   </span>
//                 </div>
//               </motion.button>
//             ))}
//           </div>
//         </motion.div>
        
//         {/* Explanation */}
//         <AnimatePresence>
//           {selectedAnswer !== null && (
//             <motion.div
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 20 }}
//               className={`p-4 rounded-2xl mb-8 ${
//                 isCorrect 
//                   ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
//                   : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
//               }`}
//             >
//               <div className="flex items-start gap-3">
//                 {isCorrect ? (
//                   <FiCheckCircle className="text-green-500 text-xl mt-0.5 flex-shrink-0" />
//                 ) : (
//                   <FiXCircle className="text-red-500 text-xl mt-0.5 flex-shrink-0" />
//                 )}
//                 <div>
//                   <p className="font-medium mb-1">
//                     {isCorrect ? 'Correct!' : 'Incorrect'}
//                   </p>
//                   <p>{question.explanation}</p>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
        
//         {/* Progress bar */}
//         <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
//           <motion.div
//             initial={{ width: 0 }}
//             animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
//             transition={{ duration: 0.5 }}
//             className="h-2 rounded-full bg-blue-500"
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizPage;