import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!
});

let chatHistory = [
  {
    role: "system",
    content: `
You are CodePilot, a coding-only assistant.

Rules:
- You ONLY answer programming, software development, and computer science questions.
- If the user greets you (hi, hello, hey), reply with a short greeting and ask them to share a coding question.
- If the user asks anything non-technical, reply:
  "I can help only with coding and software development questions."
- Do not give general knowledge answers.
- Keep responses concise and professional.
`
  }
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    chatHistory.push({
      role: "user",
      content: message
    });

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: chatHistory
    });

    const reply =
      response.choices[0]?.message?.content || "No response";

    chatHistory.push({
      role: "assistant",
      content: reply
    });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "AI Error" },
      { status: 500 }
    );
  }
}

// import { Mistral } from "@mistralai/mistralai";

// const client = new Mistral({
//   apiKey: process.env.MISTRAL_API_KEY!
// });

// let chatHistory: { role: string; content: string }[] = [
//   {
//     role: "system",
//     content:
//       "You are a helpful AI coding assistant. Provide clear explanations and optimized code examples."
//   }
// ];

// export async function POST(req: Request) {
//   const { message } = await req.json();

//   chatHistory.push({ role: "user", content: message });

//   const stream = await client.chat.stream({
//     model: "mistral-large-latest",
//     messages: chatHistory
//   });

//   const encoder = new TextEncoder();

//   return new Response(
//     new ReadableStream({
//       async start(controller) {
//         let finalText = "";

//         for await (const chunk of stream) {
//           const token = chunk.choices?.[0]?.delta?.content;
//           if (token) {
//             finalText += token;
//             controller.enqueue(encoder.encode(token));
//           }
//         }

//         chatHistory.push({
//           role: "assistant",
//           content: finalText
//         });

//         controller.close();
//       }
//     }),
//     {
//       headers: {
//         "Content-Type": "text/plain; charset=utf-8",
//         "Cache-Control": "no-cache"
//       }
//     }
//   );
// }
