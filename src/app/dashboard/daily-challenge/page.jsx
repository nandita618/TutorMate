
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FiAward, FiClock, FiCalendar, FiCheckCircle, FiXCircle, FiHome, FiArrowLeft } from 'react-icons/fi';

// Mock data for subjects and questions
const subjectsData = {
  math: {
    subject: {
      name: "Mathematics",
      topics: [
        {
          id: "algebra",
          name: "Algebra",
          chapters: [
            { id: "linear-equations", name: "Linear Equations" },
            { id: "quadratic-equations", name: "Quadratic Equations" }
          ]
        },
        {
          id: "geometry",
          name: "Geometry",
          chapters: [
            { id: "triangles", name: "Triangles" },
            { id: "circles", name: "Circles" }
          ]
        }
      ]
    },
    questions: {
      chapters: {
        "linear-equations": [
          {
            id: 1,
            questionText: "Solve for x: 2x + 5 = 13",
            options: ["x = 4", "x = 5", "x = 6", "x = 7"],
            correctAnswer: 0
          },
          {
            id: 2,
            questionText: "If 3x - 7 = 14, what is the value of x?",
            options: ["x = 5", "x = 6", "x = 7", "x = 8"],
            correctAnswer: 2
          }
        ],
        "quadratic-equations": [
          {
            id: 1,
            questionText: "What is the solution to x² - 5x + 6 = 0?",
            options: ["x = 2, 3", "x = 1, 6", "x = -2, -3", "x = -1, -6"],
            correctAnswer: 0
          }
        ],
        "triangles": [
          {
            id: 1,
            questionText: "What is the sum of interior angles in a triangle?",
            options: ["90°", "180°", "270°", "360°"],
            correctAnswer: 1
          }
        ],
        "circles": [
          {
            id: 1,
            questionText: "What is the formula for the circumference of a circle?",
            options: ["C = πr²", "C = 2πr", "C = 2πd", "C = πd²"],
            correctAnswer: 1
          }
        ]
      }
    }
  },
  science: {
    subject: {
      name: "Science",
      topics: [
        {
          id: "physics",
          name: "Physics",
          chapters: [
            { id: "motion", name: "Motion" },
            { id: "energy", name: "Energy" }
          ]
        }
      ]
    },
    questions: {
      chapters: {
        "motion": [
          {
            id: 1,
            questionText: "What is the SI unit of force?",
            options: ["Joule", "Newton", "Watt", "Pascal"],
            correctAnswer: 1
          }
        ],
        "energy": [
          {
            id: 1,
            questionText: "Which of the following is a renewable energy source?",
            options: ["Coal", "Natural Gas", "Solar", "Oil"],
            correctAnswer: 2
          }
        ]
      }
    }
  }
};

// Progress management without localStorage
let userProgress = {};

export const getProgress = () => {
  return userProgress;
};

export const markChapterComplete = (key) => {
  userProgress[key] = true;
  return userProgress;
};

// Get random questions from completed chapters (can be less than 5)
export const getDailyChallengeQuestions = () => {
  const progress = getProgress();
  const completedChapters = [];
  
  // Find all completed chapters
  Object.entries(subjectsData).forEach(([subjectId, subjectData]) => {
    subjectData.subject?.topics?.forEach(topic => {
      topic.chapters?.forEach(chapter => {
        const key = `${subjectId}-${topic.id}-${chapter.id}`;
        if (progress[key]) {
          completedChapters.push({
            subjectId,
            topicId: topic.id,
            chapterId: chapter.id,
            chapter
          });
        }
      });
    });
  });
  
  if (completedChapters.length === 0) return [];
  
  // Get all available questions from completed chapters
  const allQuestions = [];
  
  completedChapters.forEach(chapter => {
    const questions = subjectsData[chapter.subjectId]?.questions?.chapters?.[chapter.chapterId] || [];
    questions.forEach(question => {
      allQuestions.push({
        ...question,
        source: `${subjectsData[chapter.subjectId].subject.name} - ${chapter.chapter.name}`
      });
    });
  });
  
  // If we have 5 or more questions, select 5 random ones
  if (allQuestions.length >= 5) {
    const selectedQuestions = [];
    const usedIndices = new Set();
    
    while (selectedQuestions.length < 5 && usedIndices.size < allQuestions.length) {
      const randomIndex = Math.floor(Math.random() * allQuestions.length);
      
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex);
        selectedQuestions.push(allQuestions[randomIndex]);
      }
    }
    
    return selectedQuestions;
  }
  
  // If we have fewer than 5 questions, return all available questions
  return allQuestions;
};

// Streak management without localStorage
let streakData = { current: 0, lastCompleted: null };

export const getDailyStreak = () => {
  return streakData;
};

export const updateDailyStreak = () => {
  const today = new Date().toDateString();
  
  if (streakData.lastCompleted === today) return streakData; // Already completed today
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  
  if (streakData.lastCompleted === yesterdayStr) {
    // Consecutive day
    streakData.current += 1;
  } else if (!streakData.lastCompleted || new Date(streakData.lastCompleted) < yesterday) {
    // Broken streak or first time
    streakData.current = 1;
  }
  
  streakData.lastCompleted = today;
  return streakData;
};

// XP calculation based on completion time
export const calculateXP = (completionTime) => {
  const timeInMinutes = completionTime / 60;
  
  if (timeInMinutes <= 5) return 25;      // 5 mins or less: 25 XP
  if (timeInMinutes <= 10) return 20;     // 10 mins or less: 20 XP
  if (timeInMinutes <= 15) return 15;     // 15 mins or less: 15 XP
  if (timeInMinutes <= 20) return 10;     // 20 mins or less: 10 XP
  return 5;                               // More than 20 mins: 5 XP
};

export default function DailyChallengePage() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes max
  const [startTime, setStartTime] = useState(null);
  const [completionTime, setCompletionTime] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const correctSoundRef = useRef(null);
  const levelUpSoundRef = useRef(null);

  // Initialize with some completed chapters for testing
  useEffect(() => {
    if (!hasInitialized) {
      // Mark some chapters as completed for demonstration
      markChapterComplete('math-algebra-linear-equations');
      markChapterComplete('math-geometry-triangles');
      markChapterComplete('science-physics-motion');
      
      const dailyQuestions = getDailyChallengeQuestions();
      setQuestions(dailyQuestions);
      setStartTime(Date.now());
      
      // Load current streak
      const streakData = getDailyStreak();
      setStreak(streakData.current);
      
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  useEffect(() => {
    if (timeLeft <= 0 && !showResult && questions.length > 0) {
      setShowResult(true);
      setCompletionTime(20 * 60); // Max time
    }

    const timer = timeLeft > 0 && !showResult && questions.length > 0 && setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, questions.length]);

  const handleAnswerSelect = (answerIndex, isCorrectAnswer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);
    setIsCorrect(isCorrectAnswer);

    if (isCorrectAnswer) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        setCompletionTime(timeTaken);
        
        const xp = calculateXP(timeTaken);
        setXpEarned(xp);
        
        // Update streak if they passed (70% or better)
        const percentage = Math.round((score + (isCorrectAnswer ? 1 : 0)) / questions.length * 100);
        if (percentage >= 70) {
          const newStreak = updateDailyStreak();
          setStreak(newStreak.current);
        }
        
        setShowResult(true);
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const restartChallenge = () => {
    const dailyQuestions = getDailyChallengeQuestions();
    setQuestions(dailyQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setIsCorrect(null);
    setTimeLeft(20 * 60);
    setStartTime(Date.now());
    setCompletionTime(0);
    setXpEarned(0);
  };

  if (questions.length === 0 && hasInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full">
          <FiCalendar className="text-blue-500 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">No Daily Challenge Available</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Complete some chapters first to unlock daily challenges!
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push('/subjects')}
              className="bg-blue-500 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-600 transition-colors"
            >
              Browse Subjects
            </button>
            <button
              onClick={() => {
                // Mark some chapters as completed for testing
                markChapterComplete('math-algebra-linear-equations');
                markChapterComplete('math-geometry-triangles');
                markChapterComplete('science-physics-motion');
                restartChallenge();
              }}
              className="bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
            >
              Simulate Completed Chapters (Demo)
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResult && questions.length > 0) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 70;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 mx-auto mb-6"
          >
            {passed ? (
              <div className="w-full h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center">
                <FiAward className="text-white text-3xl" />
              </div>
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <FiXCircle className="text-white text-3xl" />
              </div>
            )}
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2">
            {passed ? 'Challenge Complete!' : 'Try Again Tomorrow'}
          </h2>
          
          <div className="space-y-2 mb-6">
            <p>Score: {score}/{questions.length} ({percentage}%)</p>
            <p>Time: {formatTime(completionTime)}</p>
            <p className="text-green-500 font-semibold">+{xpEarned} XP</p>
            <p className="text-blue-500 font-semibold">Streak: {streak} days</p>
          </div>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-500 text-white rounded-full text-sm flex items-center"
            >
              <FiHome className="inline mr-1" /> Dashboard
            </button>
            
            {!passed && (
              <button
                onClick={restartChallenge}
                className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm"
              >
                Retry Now
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold">Loading Challenge...</h2>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <button 
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-500"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-center">Daily Challenge</h1>
            <p className="text-sm text-gray-500 text-center">Streak: {streak} days</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              <FiClock />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
            
            <div className="text-lg font-medium">
              {currentQuestion + 1}/{questions.length}
            </div>
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8"
        >
          <p className="text-sm text-gray-500 mb-2">{question.source}</p>
          <h2 className="text-xl font-semibold mb-4">{question.questionText}</h2>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index, index === question.correctAnswer)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedAnswer === null
                    ? 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                    : index === question.correctAnswer
                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                    : selectedAnswer === index
                    ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                    : 'bg-gray-100 dark:bg-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
          <div 
            className="h-2 rounded-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}