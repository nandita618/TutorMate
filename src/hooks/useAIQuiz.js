
// import { useState } from 'react';
// import OpenAI from 'openai';

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true
// });

// export function useAIQuiz() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const generateQuiz = async (subject, topic, chapter, difficulty, questionCount) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const prompt = `
//       Generate a ${difficulty}-level multiple choice quiz with ${questionCount} questions 
//       for the subject "${subject}", topic "${topic}", and chapter "${chapter}". 
//       Format the response strictly as JSON with this structure:
//       {
//         "questions": [
//           {
//             "questionText": "string",
//             "options": ["A", "B", "C", "D"],
//             "correctAnswer": number (0-3),
//             "explanation": "string"
//           }
//         ]
//       }
//       `;

//       const response = await client.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [{ role: "user", content: prompt }],
//         temperature: 0.7,
//       });

//       const quizData = JSON.parse(response.choices[0].message.content);
//       return quizData;
//     } catch (err) {
//       console.error("Error generating quiz:", err);
//       setError("Failed to generate quiz. Try again.");
//       return { questions: [] };
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { generateQuiz, loading, error };
// }


import { useState } from 'react';

export function useAIQuiz() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateQuiz = async (subject, topic, chapter) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, topic, chapter }),
      });

      if (!response.ok) throw new Error('Failed to generate quiz');

      return await response.json();
    } catch (err) {
      console.error("Error generating quiz:", err);
      setError(err.message);
      return { questions: [] };
    } finally {
      setLoading(false);
    }
  };

  return { generateQuiz, loading, error };
}
