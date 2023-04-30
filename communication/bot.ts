import { databaseLoader } from "@/communication/database.ts";
import type { MessageView } from "@/communication/types.ts";
import { sleep } from "https://deno.land/x/sleep/mod.ts";

import {
  ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "npm:openai";
import { RoomChannel } from "@/communication/channel.ts";

const configuration = new Configuration({
  apiKey: Deno.env.get("OPENAI_API_KEY"),
});
const openai = new OpenAIApi(configuration);

export async function getNextBotResponse(
  messages: MessageView[]
): Promise<string | null> {
  try {
    const openAIFormattedMessages: ChatCompletionRequestMessage[] =
      messages.map((message) => {
        return {
          role: message.from.name === "Papersnake" ? "assistant" : "user",
          name: message.from.name,
          content: message.message,
        };
      });

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: openAIFormattedMessages,
    });

    const choice = completion.data.choices[0];
    choice.message;

    const botResponse = completion.data.choices[0].message?.content || null;
    return botResponse;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function autobot(
  roomId: number,
  stopSignal: { stop: boolean }
): Promise<void> {
  const database = await databaseLoader.getInstance();
  const botUserId = await database.ensureBotUser();
  const channel = new RoomChannel(roomId);

  while (true) {
    if (stopSignal.stop) {
      break;
    }
    const messages = await database.getRoomMessages(roomId, 10);
    const botResponse = await getNextBotResponse(messages);
    if (botResponse) {
      channel.sendText({
        message: botResponse,
        from: {
          name: "Papersnake",
          avatarUrl:
            "https://chat.notebookgpt.com/origami/static/images/snakelogo.png",
        },
        createdAt: new Date().toISOString(),
      });
      await database.insertMessage({
        text: botResponse,
        roomId: roomId,
        userId: botUserId,
      });
    }
    await sleep(1);
  }
  channel.close();
}
