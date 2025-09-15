import chemistryData from './chemistry-dummy-data.json';

// Mock data for other subjects following the SAME structure
export const subjectsData = {
  chemistry: chemistryData,
  physics: {
    subject: {
      id: "physics",
      name: "Physics",
      description: "Class 12 NCERT Physics",
      imageUrl: "/physics.jpg",
      topics: [
        {
          id: "mechanics",
          name: "Mechanics",
          chapters: [
            {
              id: "laws-of-motion",
              name: "1. Laws of Motion",
              pdfUrl: "/dummy-pdf.pdf",
              videos: [ // Changed from videoUrls to videos
                { id: "dQw4w9WgXcQ", title: "Newton's Laws of Motion Explained" },
                { id: "jyjVCbTo5F0", title: "Laws of Motion - Class 12 Physics" }
              ],
              articles: [
                { title: "NCERT Laws of Motion Notes", url: "https://ncert.nic.in/laws-of-motion" }
              ]
            }
            // ... more chapters
          ]
        }
        // ... more topics
      ]
    },
    questions: {
      chapters: {
        "laws-of-motion": [
          {
            id: 1,
            questionText: "What is Newton's First Law?",
            options: [
              "Law of Inertia",
              "Law of Acceleration",
              "Law of Action-Reaction",
              "Law of Gravity"
            ],
            correctAnswer: 0,
            explanation: "Newton's First Law is also known as the Law of Inertia."
          }
        ]
      }
    }
  }
  // ... other subjects
};

// Progress tracking functions (keep the same)
let progressData = {};
export const markChapterComplete = (subject, topic, chapter) => {
  const key = `${subject}-${topic}-${chapter}`;
  progressData[key] = true;
};
export const isChapterComplete = (subject, topic, chapter) => {
  const key = `${subject}-${topic}-${chapter}`;
  return !!progressData[key];
};
export const getProgress = () => {
  // Calculate progress from progressData
  let totalChapters = 0;
  let completedChapters = 0;
  
  Object.entries(subjectsData).forEach(([subjectId, subjectData]) => {
    subjectData.subject.topics.forEach(topic => {
      topic.chapters.forEach(chapter => {
        totalChapters++;
        if (isChapterComplete(subjectId, topic.id, chapter.id)) {
          completedChapters++;
        }
      });
    });
  });
   return {
    total: totalChapters,
    completed: completedChapters,
    percentage: totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0
  };
};

export const getNextChapter = (subjectId, topicId, currentChapterId) => {
  const subject = subjectsData[subjectId]?.subject;
  if (!subject) return null;
  
  const topic = subject.topics.find(t => t.id === topicId);
  if (!topic) return null;
  
  const currentIndex = topic.chapters.findIndex(c => c.id === currentChapterId);
  if (currentIndex === -1 || currentIndex >= topic.chapters.length - 1) return null;
  
  return topic.chapters[currentIndex + 1];
};

// Helper function to get videos for a chapter
export const getChapterVideos = (subjectId, topicId, chapterId) => {
  const chapter = subjectsData[subjectId]?.subject?.topics
    .find(t => t.id === topicId)?.chapters.find(c => c.id === chapterId);
  return chapter?.videos || [];
};

// Helper function to get quiz questions for a chapter
export const getChapterQuestions = (subjectId, chapterId) => {
  return subjectsData[subjectId]?.questions?.chapters?.[chapterId] || [];
};