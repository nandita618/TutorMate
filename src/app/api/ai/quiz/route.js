
// // app/api/ai/quiz/route.js
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     const { subject, topic, chapter } = await request.json();

//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: 'gpt-4o-mini', // smaller + cheaper; use "gpt-4" if you prefer
//         messages: [
//           {
//             role: 'system',
//             content: `You are an educational quiz generator. Create 5 multiple-choice questions about ${subject} > ${topic} > ${chapter}.
//             Difficulty: medium. Format response strictly as JSON:
//             { "questions": [ { "questionText": string, "options": string[], "correctAnswer": number, "explanation": string } ] }`
//           },
//           {
//             role: 'user',
//             content: `Generate 5 medium-level quiz questions about ${chapter} in ${topic} (${subject}).`
//           }
//         ],
//         temperature: 0.7,
//         max_tokens: 2000,
//       }),
//     });

//     const raw = await response.text();
//     console.log('🔎 OpenAI raw response:', raw);

//     if (!response.ok) {
//       return NextResponse.json({ error: 'AI API request failed', details: raw }, { status: 500 });
//     }

//     const data = JSON.parse(raw);

//     let quizContent;
//     try {
//       quizContent = JSON.parse(data.choices[0].message.content.trim());
//     } catch (parseError) {
//       console.error('❌ JSON parse failed. Content was:', data.choices[0].message.content);
//       return NextResponse.json(
//         { error: 'AI returned invalid JSON', content: data.choices[0].message.content },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json(quizContent);
//   } catch (error) {
//     console.error('AI Quiz generation error:', error);
//     return NextResponse.json({ error: error.message || 'Failed to generate quiz' }, { status: 500 });
//   }
// }



import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // stays private
});

export async function POST(req) {
  try {
    const { subject, topic, chapter } = await req.json();

    const prompt = `
    Generate a medium-level multiple choice quiz with 5 questions
    for the subject "${subject}", topic "${topic}", and chapter "${chapter}".
    Format strictly as JSON:
    {
      "questions": [
        {
          "questionText": "string",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": number (0-3),
          "explanation": "string"
        }
      ]
    }`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

  //   const quizData = JSON.parse(response.choices[0].message.content);
  //   return NextResponse.json(quizData);
  // } catch (err) {
  //   console.error(err);
  //   return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  // }

  
  //  Clean raw AI output 
    let raw = response.choices[0].message.content.trim();
    let cleaned = raw.replace(/```json|```/g, "").trim();

    let quizData;
    try {
      quizData = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("❌ JSON parse failed. Got:", raw);
      return NextResponse.json(
        { error: "AI returned invalid JSON", raw },
        { status: 500 }
      );
    }

    return NextResponse.json(quizData);
  } catch (err) {
    console.error("AI Quiz generation error:", err);
    return NextResponse.json({ error: err.message || "Failed to generate quiz" }, { status: 500 });
  }
}
