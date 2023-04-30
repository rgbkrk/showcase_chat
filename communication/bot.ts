import type { MessageView } from "./types.ts";

import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "npm:openai";

const configuration = new Configuration({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});
const openai = new OpenAIApi(configuration);

export async function getNextBotResponse(
  messages: MessageView[]
): Promise<string | null> {
  // Collect only messages

  const openAIFormattedMessages: ChatCompletionRequestMessage[] = messages.map(
    (message) => {
      return {
        role: message.from.name === "Papersnake" ? "assistant" : "user",
        name: message.from.name,
        content: message.message,
      };
    }
  );

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: openAIFormattedMessages,
  });

  const choice = completion.data.choices[0];
  choice.message;

  const botResponse = completion.data.choices[0].message?.content || null;
  return botResponse;
}
