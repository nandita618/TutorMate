'use client';

import { subjectsData, getProgress } from './index';

// Get 5 random questions from completed chapters
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
  
  // Get questions from random completed chapters
    const allQuestions = [];
  
  completedChapters.forEach(chapter => {
    const questions = subjectData[chapter.subjectId]?.questions?.chapters?.[chapter.chapterId] || [];
    questions.forEach(question => {
      allQuestions.push({
        ...question,
        source: `${chapter.subjectId} - ${chapter.chapter.name}`
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

// Streak management
export const getDailyStreak = () => {
  if (typeof window === 'undefined') return { current: 0, lastCompleted: null };
  
  const streakData = JSON.parse(localStorage.getItem('daily-streak') || '{"current":0,"lastCompleted":null}');
  return streakData;
};

export const updateDailyStreak = () => {
  if (typeof window === 'undefined') return;
  
  const today = new Date().toDateString();
  const streakData = getDailyStreak();
  
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
  localStorage.setItem('daily-streak', JSON.stringify(streakData));
  return streakData;
};

// XP calculation based on completion time (5 questions)
export const calculateXP = (completionTime) => {
  const timeInMinutes = completionTime / 60;
  
  if (timeInMinutes <= 5) return 25;      // 5 mins or less: 25 XP
  if (timeInMinutes <= 10) return 20;     // 10 mins or less: 20 XP
  if (timeInMinutes <= 15) return 15;     // 15 mins or less: 15 XP
  if (timeInMinutes <= 20) return 10;     // 20 mins or less: 10 XP
  return 5;                               // More than 20 mins: 5 XP
};