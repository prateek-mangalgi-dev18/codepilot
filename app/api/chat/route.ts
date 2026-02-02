import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";


type Role = "system" | "user" | "assistant";

type ChatMessage = {
  role: Role;
  content: string;
};



const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!,
});




const chatHistory: ChatMessage[] = [
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
`,
  },
];



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message: string = body.message;

  
    chatHistory.push({
      role: "user",
      content: message,
    });

  
    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: chatHistory,
    });

    
    const raw = response.choices?.[0]?.message?.content;

const reply =
  typeof raw === "string"
    ? raw
    : raw?.map((c: any) => c.text).join("") || "No response";

    chatHistory.push({
      role: "assistant",
      content: reply,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API Error:", error);

    return NextResponse.json(
      { error: "AI Error" },
      { status: 500 }
    );
  }
}
