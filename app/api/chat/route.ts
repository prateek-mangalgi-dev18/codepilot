import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY!
});

let chatHistory = [
  {
    role: "system",
    content:
      "You are a helpful AI coding assistant. Provide clear explanations and optimized code examples."
  }
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessage = body.message;

    chatHistory.push({
      role: "user",
      content: userMessage
    });

    const response = await client.chat.complete({
      model: "mistral-large-latest",
      messages: chatHistory
    });

    const reply = response.choices[0].message.content;

    chatHistory.push({
      role: "assistant",
      content: reply
    });

    return NextResponse.json({ reply });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
