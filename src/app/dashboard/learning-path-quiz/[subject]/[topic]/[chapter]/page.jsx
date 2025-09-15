// // app/dashboard/learning-path-quiz/[subject]/[topic]/[chapter]/page.jsx
// 'use client';

// import { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiCheckCircle, FiXCircle, FiAward, FiClock, FiStar, FiArrowLeft, FiHome, FiRotateCw, FiZap, FiTrendingUp, FiHeart } from 'react-icons/fi';
// import { useParams, useRouter } from 'next/navigation';
// import { getChapterQuestions, markChapterComplete, subjectsData, isChapterComplete, loseHeart, restoreHearts, getUserStats } from '@/data/index';
// import confetti from 'canvas-confetti';

// export default function QuizPage() {
//   const params = useParams();
//   const subject = params.subject;
//   const topic = params.topic;
//   const chapter = params.chapter;
//   const router = useRouter();
  
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [score, setScore] = useState(0);
//   const [showResult, setShowResult] = useState(false);
//   const [isCorrect, setIsCorrect] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [avatarState, setAvatarState] = useState('neutral');
//   const [streak, setStreak] = useState(0);
//   const [questions, setQuestions] = useState([]);
//   const [quizTimeLimit, setQuizTimeLimit] = useState(0);
//   const [chapterCompleted, setChapterCompleted] = useState(false);
//   const [xpGained, setXpGained] = useState(0);
//   const [showFeedback, setShowFeedback] = useState(false);
//   const [comboMultiplier, setComboMultiplier] = useState(1);
//   const [achievements, setAchievements] = useState([]);
//   const [hearts, setHearts] = useState(5);
  
//   // Sound references
//   const correctSoundRef = useRef(null);
//   const incorrectSoundRef = useRef(null);
//   const levelUpSoundRef = useRef(null);

//   // Initialize quiz
//   useEffect(() => {
//     const chapterQuestions = getChapterQuestions(subject, chapter);
//     setQuestions(chapterQuestions);

//     if (chapterQuestions && chapterQuestions.length > 0) {
//       const timeLimit = chapterQuestions.length * 5 * 60;
//       setQuizTimeLimit(timeLimit);
//       setTimeLeft(timeLimit);
//     }

//     setChapterCompleted(isChapterComplete(subject, topic, chapter));
//     setHearts(getUserStats().hearts || 5);
//   }, [subject, topic, chapter]);

//   const handleAnswerSelect = (answerIndex, isCorrectAnswer) => {
//     if (selectedAnswer !== null || hearts <= 0) return;
    
//     setSelectedAnswer(answerIndex);
//     setIsCorrect(isCorrectAnswer);
//     setShowFeedback(true);
    
//     if (isCorrectAnswer) {
//       correctSoundRef.current.play();
//       setAvatarState('happy');
//       const pointsEarned = 10 * comboMultiplier;
//       setScore(score + 1);
//       setStreak(streak + 1);
//       setXpGained(xpGained + pointsEarned);
      
//       if (streak >= 2 && (streak + 1) % 3 === 0) {
//         setComboMultiplier(comboMultiplier + 0.5);
//         const newAchievement = `Combo x${comboMultiplier + 0.5}!`;
//         setAchievements(prev => [...prev, newAchievement]);
//         setTimeout(() => setAchievements(prev => prev.filter(a => a !== newAchievement)), 3000);
//       }
      
//       confetti({ particleCount: 30, spread: 70, origin: { y: 0.6 } });
//     } else {
//       incorrectSoundRef.current.play();
//       setAvatarState('sad');
//       setStreak(0);
//       setComboMultiplier(1);
      
//       // Lose a heart for wrong answer
//       const newHearts = loseHeart();
//       setHearts(newHearts);
//     }
    
//     setTimeout(() => {
//       setShowFeedback(false);
//       if (currentQuestion < questions.length - 1 && hearts > 0) {
//         setCurrentQuestion(currentQuestion + 1);
//         setSelectedAnswer(null);
//         setIsCorrect(null);
//         setAvatarState('neutral');
//       } else {
//         setShowResult(true);
        
//         if (hearts > 0 && (score + (isCorrectAnswer ? 1 : 0)) >= questions.length * 0.7) {
//           levelUpSoundRef.current.play();
//           if (!chapterCompleted) {
//             markChapterComplete(subject, topic, chapter);
//             setChapterCompleted(true);
//           }
//           confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
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
//     setTimeLeft(quizTimeLimit);
//     setAvatarState('neutral');
//     setStreak(0);
//     setXpGained(0);
//     setComboMultiplier(1);
//     setAchievements([]);
//     restoreHearts();
//     setHearts(5);
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

//   if (showResult || hearts <= 0) {
//     const percentage = Math.round((score / questions.length) * 100);
//     const passed = percentage >= 70 && hearts > 0;
    
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
//         <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
//         <audio ref={incorrectSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
//         <audio ref={levelUpSoundRef} src="/sounds/levelUp.mp3" preload="auto" />
        
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
//         >
//           {hearts <= 0 ? (
//             <>
//               <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//                 <FiHeart className="text-red-500 text-4xl" />
//               </div>
//               <h2 className="text-3xl font-bold mb-2 text-red-600 dark:text-red-400">Out of Hearts!</h2>
//               <p className="text-gray-600 dark:text-gray-300 mb-4">
//                 You've run out of hearts. Wait for them to regenerate or practice previous chapters.
//               </p>
//             </>
//           ) : (
//             <>
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 className="w-24 h-24 mx-auto mb-6 relative"
//               >
//                 {passed ? (
//                   <>
//                     <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
//                       <FiAward className="text-white text-4xl" />
//                     </div>
//                   </>
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
//                     <FiXCircle className="text-white text-4xl" />
//                   </div>
//                 )}
//               </motion.div>
              
//               <h2 className="text-3xl font-bold mb-2">
//                 {passed ? 'Chapter Complete!' : 'Try Again'}
//               </h2>
              
//               <p className="text-gray-600 dark:text-gray-300 mb-2">
//                 You scored {score} out of {questions.length}
//               </p>
              
//               {passed && (
//                 <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
//                   +{xpGained} XP earned!
//                 </p>
//               )}
//             </>
//           )}
          
//           <div className="flex flex-col gap-4 justify-center">
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={restartQuiz}
//               className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium flex items-center justify-center gap-2"
//             >
//               <FiRotateCw />
//               {hearts <= 0 ? 'Restore Hearts' : 'Try Again'}
//             </motion.button>
            
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={() => router.push('/dashboard/learning-path')}
//               className="px-6 py-3 bg-green-500 text-white rounded-full font-medium flex items-center justify-center gap-2"
//             >
//               <FiHome />
//               Learning Path
//             </motion.button>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   const question = questions[currentQuestion];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-6">
//       <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
//       <audio ref={incorrectSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
//       <audio ref={levelUpSoundRef} src="/sounds/levelUp.mp3" preload="auto" />
      
//       <div className="max-w-2xl mx-auto">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-6">
//           <div className="flex items-center gap-4">
//             <div className="flex items-center bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full">
//               <FiHeart className="text-red-500 mr-1" />
//               <span className="font-medium">{hearts}</span>
//             </div>
            
//             {streak > 1 && (
//               <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 rounded-full">
//                 <FiStar className="text-yellow-500 mr-1" />
//                 <span className="font-medium">×{streak}</span>
//               </div>
//             )}
            
//             {comboMultiplier > 1 && (
//               <div className="flex items-center bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
//                 <FiZap className="text-green-500 mr-1" />
//                 <span className="font-medium">{comboMultiplier}x</span>
//               </div>
//             )}
//           </div>
          
//           <div className="text-lg font-medium">
//             {currentQuestion + 1}/{questions.length}
//           </div>
//         </div>
        
//         {/* Question */}
//         <motion.div
//           key={currentQuestion}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-6"
//         >
//           <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4">
//             {question.question}
//           </h2>
//         </motion.div>
        
//         {/* Answers */}
//         <div className="grid gap-3">
//           {question.options.map((option, index) => {
//             const isSelected = selectedAnswer === index;
//             const isCorrectAnswer = index === question.correctAnswer;
            
//             let bgColor = "bg-white dark:bg-gray-800";
//             let borderColor = "border-gray-200 dark:border-gray-700";
//             let textColor = "text-gray-900 dark:text-white";
            
//             if (selectedAnswer !== null) {
//               if (isSelected) {
//                 bgColor = isCorrect ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30";
//                 borderColor = isCorrect ? "border-green-200 dark:border-green-700" : "border-red-200 dark:border-red-700";
//               } else if (isCorrectAnswer) {
//                 bgColor = "bg-green-50 dark:bg-green-900/20";
//                 borderColor = "border-green-200 dark:border-green-700";
//               }
//             }
            
//             return (
//               <motion.button
//                 key={index}
//                 whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
//                 whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
//                 onClick={() => handleAnswerSelect(index, isCorrectAnswer)}
//                 disabled={selectedAnswer !== null}
//                 className={`p-4 rounded-xl border ${bgColor} ${borderColor} ${textColor} text-left transition-all`}
//               >
//                 {option}
//               </motion.button>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }




// app/dashboard/learning-path-quiz/[subject]/[topic]/[chapter]/page.jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAward, FiClock, FiStar, FiArrowLeft, FiHome, FiRotateCw, FiZap, FiTrendingUp, FiHeart } from 'react-icons/fi';
import { useParams, useRouter } from 'next/navigation';
import { getChapterQuestions, markChapterComplete, subjectsData, isChapterComplete, loseHeart, restoreHearts, getUserStats } from '@/data/index';
import confetti from 'canvas-confetti';

export default function QuizPage() {
  const params = useParams();
  const subject = params.subject;
  const topic = params.topic;
  const chapter = params.chapter;
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
  const [quizTimeLimit, setQuizTimeLimit] = useState(0);
  const [chapterCompleted, setChapterCompleted] = useState(false);
  const [xpGained, setXpGained] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [achievements, setAchievements] = useState([]);
  const [hearts, setHearts] = useState(5);
  
  // Sound references
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);
  const levelUpSoundRef = useRef(null);

  // Initialize quiz
  useEffect(() => {
    const chapterQuestions = getChapterQuestions(subject, chapter);
    setQuestions(chapterQuestions);

    if (chapterQuestions && chapterQuestions.length > 0) {
      const timeLimit = chapterQuestions.length * 5 * 60;
      setQuizTimeLimit(timeLimit);
      setTimeLeft(timeLimit);
    }

    setChapterCompleted(isChapterComplete(subject, topic, chapter));
    setHearts(getUserStats().hearts || 5);
  }, [subject, topic, chapter]);

  const handleAnswerSelect = (answerIndex, isCorrectAnswer) => {
    if (selectedAnswer !== null || hearts <= 0) return;
    
    setSelectedAnswer(answerIndex);
    setIsCorrect(isCorrectAnswer);
    setShowFeedback(true);
    
    if (isCorrectAnswer) {
      correctSoundRef.current.play();
      setAvatarState('happy');
      const pointsEarned = 10 * comboMultiplier;
      setScore(score + 1);
      setStreak(streak + 1);
      setXpGained(xpGained + pointsEarned);
      
      if (streak >= 2 && (streak + 1) % 3 === 0) {
        setComboMultiplier(comboMultiplier + 0.5);
        const newAchievement = `Combo x${comboMultiplier + 0.5}!`;
        setAchievements(prev => [...prev, newAchievement]);
        setTimeout(() => setAchievements(prev => prev.filter(a => a !== newAchievement)), 3000);
      }
      
      confetti({ particleCount: 30, spread: 70, origin: { y: 0.6 } });
    } else {
      incorrectSoundRef.current.play();
      setAvatarState('sad');
      setStreak(0);
      setComboMultiplier(1);
      
      // Lose a heart for wrong answer
      const newHearts = loseHeart();
      setHearts(newHearts);
    }
    
    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1 && hearts > 0) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setAvatarState('neutral');
      } else {
        setShowResult(true);
        
        if (hearts > 0 && (score + (isCorrectAnswer ? 1 : 0)) >= questions.length * 0.7) {
          levelUpSoundRef.current.play();
          if (!chapterCompleted) {
            markChapterComplete(subject, topic, chapter);
            setChapterCompleted(true);
          }
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
        }
      }
    }, 1500);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsCorrect(null);
    setTimeLeft(quizTimeLimit);
    setAvatarState('neutral');
    setStreak(0);
    setXpGained(0);
    setComboMultiplier(1);
    setAchievements([]);
    restoreHearts();
    setHearts(5);
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"
          ></motion.div>
          <p className="text-gray-600 dark:text-gray-300">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (showResult || hearts <= 0) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70 && hearts > 0;
    
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-6 flex items-center justify-center">
        <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
        <audio ref={incorrectSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
        <audio ref={levelUpSoundRef} src="/sounds/levelUp.mp3" preload="auto" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center border-2 border-gray-100 dark:border-gray-700"
        >
          {hearts <= 0 ? (
            <>
              <div className="w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                <div className="relative">
                  <svg className="w-32 h-32 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FiXCircle className="text-white text-6xl" />
                  </div>
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2 text-red-600 dark:text-red-400">Out of Hearts!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You've run out of hearts. Wait for them to regenerate or practice previous chapters.
              </p>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-32 h-32 mx-auto mb-6 relative"
              >
                {passed ? (
                  <>
                    <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                      <FiAward className="text-white text-6xl" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center">
                      <FiStar className="text-white text-xl" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                    <FiXCircle className="text-white text-6xl" />
                  </div>
                )}
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-2">
                {passed ? 'Chapter Complete!' : 'Try Again'}
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                You scored {score} out of {questions.length}
              </p>
              
              {passed && (
                <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-4">
                  +{xpGained} XP earned!
                </p>
              )}
            </>
          )}
          
          <div className="flex flex-col gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={restartQuiz}
              className="px-6 py-4 bg-green-500 text-white rounded-full font-bold flex items-center justify-center gap-2 text-lg"
            >
              <FiRotateCw />
              {hearts <= 0 ? 'Restore Hearts' : 'Try Again'}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/dashboard/learning-path')}
              className="px-6 py-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-600 rounded-full font-bold flex items-center justify-center gap-2 text-lg"
            >
              <FiHome />
              Learning Path
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-4 md:p-6">
      <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto" />
      <audio ref={incorrectSoundRef} src="/sounds/incorrect.mp3" preload="auto" />
      <audio ref={levelUpSoundRef} src="/sounds/levelUp.mp3" preload="auto" />
      
      <div className="max-w-2xl mx-auto">
        {/* Header - Duolingo style */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* Hearts */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="relative -ml-2 first:ml-0">
                  <svg 
                    className={`w-10 h-10 ${i < hearts ? 'text-red-500' : 'text-gray-300 dark:text-gray-600'}`} 
                    viewBox="0 0 24 24" 
                    fill={i < hearts ? 'currentColor' : 'none'} 
                    stroke="currentColor" 
                    strokeWidth="1.5"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>
              ))}
            </div>
            
            {/* Streak */}
            {streak > 0 && (
              <div className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full">
                <FiZap className="text-yellow-500 text-xl mr-2" />
                <span className="font-bold text-lg">{streak}</span>
              </div>
            )}
          </div>
          
          {/* Progress */}
          <div className="text-lg font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full">
            {currentQuestion + 1}/{questions.length}
          </div>
        </div>
        
        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md mb-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            {question.question}
          </h2>
        </motion.div>
        
        {/* Answers */}
        <div className="grid gap-4">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrectAnswer = index === question.correctAnswer;
            
            let bgColor = "bg-white dark:bg-gray-800";
            let borderColor = "border-gray-300 dark:border-gray-600";
            let textColor = "text-gray-900 dark:text-white";
            
            if (selectedAnswer !== null) {
              if (isSelected) {
                bgColor = isCorrect ? "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600" : "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-600";
                textColor = isCorrect ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200";
              } else if (isCorrectAnswer) {
                bgColor = "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700";
                textColor = "text-green-800 dark:text-green-200";
              }
            }
            
            return (
              <motion.button
                key={index}
                whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                whileTap={{ scale: selectedAnswer === null ? 0.98 : 1 }}
                onClick={() => handleAnswerSelect(index, isCorrectAnswer)}
                disabled={selectedAnswer !== null}
                className={`p-5 rounded-2xl border-2 ${bgColor} ${borderColor} ${textColor} text-left transition-all font-medium text-lg`}
              >
                {option}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}