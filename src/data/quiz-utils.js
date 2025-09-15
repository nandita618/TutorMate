import { subjectsData } from './index';

export const getQuizQuestions = ({ folder, subject, quizId }) => {
  if (!subjectsData[subject]) return [];

  if (folder === 'chapter') {
    // Find chapter by quizId
    const chapter = subjectsData[subject].subject.topics
      .flatMap(t => t.chapters)
      .find(c => c.id === quizId);
    return chapter?.questions || [];
  } else if (folder === 'topic') {
    // All chapters under the topic
    const topic = subjectsData[subject].subject.topics
      .find(t => t.id === quizId);
    return topic?.chapters.flatMap(c => c.questions || []) || [];
  } else if (folder === 'subject') {
    // All chapters under all topics
    return subjectsData[subject].subject.topics
      .flatMap(t => t.chapters.flatMap(c => c.questions || []));
  } else {
    return [];
  }
};
