// 'use client';
// import { useParams } from 'next/navigation';
// import { getQuizQuestions } from '@/data/quiz-utils';

// export default function ChapterQuizPage() {
//   const { quizId, subject } = useParams();

//   const questions = getQuizQuestions({
//     folder: 'chapter',
//     subject: subject, // pass the subject param
//     quizId: quizId,
//   });

//   return (
//     <div>
//       <h1>Subject Quiz: {quizId}</h1>
//       {questions.length === 0 ? (
//         <p>No questions found.</p>
//       ) : (
//         questions.map((q, idx) => (
//           <div key={idx}>
//             <p>{q.questionText}</p>
//             <ul>
//               {q.options.map((opt, i) => (
//                 <li key={i}>{opt}</li>
//               ))}
//             </ul>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
