import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { SYSTEM_PROMPT, getPageContext } from "@/lib/chatbot/knowledge-base";

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

// Tool definition: lets the AI call get_page_context to understand what's on screen
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_page_context",
      description:
        "Get detailed information about what is currently visible on a specific page of the Madmoon app — including UI elements the user can see, available actions, and helpful tips. Call this when the user asks about something specific on their current page, wants step-by-step UI guidance, or seems confused about where to tap/click.",
      parameters: {
        type: "object",
        properties: {
          page: {
            type: "string",
            description:
              "The page route to inspect (e.g. /home, /auctions, /search, /plates/abc123). Use the currentPage from the system prompt if the user is asking about their current screen.",
          },
        },
        required: ["page"],
      },
    },
  },
];

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

    const systemMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [{ role: "system", content: SYSTEM_PROMPT(currentPage || "/") }];

    // First call — AI may call the get_page_context tool
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [...systemMessages, ...trimmedMessages],
      tools,
      tool_choice: "auto",
      temperature: 0.4,
      max_tokens: 600,
    });

    let assistantMessage = completion.choices[0]?.message; // let: reassigned in tool-call branch

    // Handle tool call if the AI requested page context
    if (
      assistantMessage?.tool_calls &&
      assistantMessage.tool_calls.length > 0
    ) {
      const toolCall = assistantMessage.tool_calls[0];
      let toolResult = "";

      if (
        toolCall.type === "function" &&
        toolCall.function.name === "get_page_context"
      ) {
        let args: { page?: string } = {};
        try {
          args = JSON.parse(toolCall.function.arguments) as { page?: string };
        } catch {
          args = {};
        }
        const page = args.page ?? currentPage ?? "/";
        const context = getPageContext(page);

        if (context) {
          toolResult = JSON.stringify({
            page,
            title: context.title,
            description: context.description,
            visibleElements: context.visibleElements,
            availableActions: context.availableActions,
            tips: context.tips,
          });
        } else {
          toolResult = JSON.stringify({
            page,
            note: "No specific page context available for this route.",
          });
        }
      }

      // Second call — send tool result back so the AI can formulate its answer
      const secondCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          ...systemMessages,
          ...trimmedMessages,
          assistantMessage,
          {
            role: "tool",
            tool_call_id: toolCall.id,
            content: toolResult,
          },
        ],
        temperature: 0.4,
        max_tokens: 600,
      });

      assistantMessage = secondCompletion.choices[0]?.message;
    }

    const reply = assistantMessage?.content ?? "";
    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error("[chat/route] Error:", error);
    return NextResponse.json(
      { error: "Failed to get a response. Please try again." },
      { status: 500 },
    );
  }
}
