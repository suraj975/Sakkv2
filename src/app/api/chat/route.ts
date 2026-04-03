import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/chatbot/knowledge-base";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  currentPage: string;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured." },
        { status: 500 },
      );
    }

    const body: ChatRequest = await req.json();
    const { messages, currentPage } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required." },
        { status: 400 },
      );
    }

    // Limit conversation history to last 20 messages to control token usage
    const trimmedMessages = messages.slice(-20);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT(currentPage || "/"),
        },
        ...trimmedMessages,
      ],
      temperature: 0.4,
      max_tokens: 600,
    });

    const reply = completion.choices[0]?.message?.content ?? "";

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("[chat/route] Error:", error);
    return NextResponse.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 },
    );
  }
}
