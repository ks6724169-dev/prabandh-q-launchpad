import { createServerFn } from "@tanstack/react-start";
import { generateText, type ModelMessage } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

type ChatInput = { messages: { role: "user" | "assistant" | "system"; content: string }[] };

export const aiChat = createServerFn({ method: "POST" })
  .inputValidator((input: unknown): ChatInput => {
    const i = input as ChatInput;
    if (!i || !Array.isArray(i.messages)) throw new Error("messages required");
    return { messages: i.messages.slice(-20) };
  })
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);
    const messages: ModelMessage[] = [
      {
        role: "system",
        content:
          "You are Prabandh Q AI Assistant — a warm, concise tutor and planner for schools and colleges in India. Help with lesson plans, doubt solving, report insights, and academic guidance. Use markdown sparingly. Keep replies focused and helpful.",
      },
      ...data.messages.map((m) => ({ role: m.role, content: m.content }) as ModelMessage),
    ];
    const { text } = await generateText({
      model: gateway("google/gemini-3-flash-preview"),
      messages,
    });
    return { text };
  });
