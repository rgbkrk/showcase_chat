import { HandlerContext } from "$fresh/server.ts";
import { getCookies } from "$std/http/cookie.ts";
import { emojify } from "emojify";
import { databaseLoader } from "@/communication/database.ts";
import { RoomChannel } from "@/communication/channel.ts";
import { badWordsCleanerLoader } from "@/helpers/bad_words.ts";
import { ApiSendMessage } from "@/communication/types.ts";
import { getNextBotResponse } from "../../communication/bot.ts";

export async function handler(
  req: Request,
  _ctx: HandlerContext
): Promise<Response> {
  const accessToken = getCookies(req.headers)["deploy_chat_token"];
  if (!accessToken) {
    return new Response("Not signed in", { status: 401 });
  }
  const database = await databaseLoader.getInstance();
  const user = await database.getUserByAccessTokenOrThrow(accessToken);
  const data = (await req.json()) as ApiSendMessage;
  const channel = new RoomChannel(data.roomId);
  const from = {
    name: user.userName,
    avatarUrl: user.avatarUrl,
  };

  if (data.kind === "isTyping") {
    // Send `is typing...` indicator.
    channel.sendIsTyping(from);
    channel.close();
    return new Response("OK");
  }

  const badWordsCleaner = await badWordsCleanerLoader.getInstance();
  const message = emojify(badWordsCleaner.clean(data.message));

  // Fetch the last 10 messages from the database for the current room
  const lastMessages = await database.getRoomMessages(data.roomId, 10);

  const createdAt = new Date().toISOString();

  channel.sendText({
    message: message,
    from,
    createdAt,
  });

  // Call the bot function periodically after receiving a user message, you can use a counter or timestamp to control the frequency
  const messages = [...lastMessages, { message, from, createdAt }];

  const botResponse = await getNextBotResponse(messages);
  const botUserId = await database.ensureBotUser();

  if (botResponse !== null) {
    channel.sendText({
      message: botResponse,
      from: {
        name: "Papersnake",
        avatarUrl:
          "https://chat.notebookgpt.com/origami/static/images/snakelogo.png",
      },
      createdAt: new Date().toISOString(),
    });
  }

  channel.close();

  await database.insertMessage({
    text: message,
    roomId: data.roomId,
    userId: user.userId,
  });
  if (botResponse !== null) {
    await database.insertMessage({
      text: botResponse,
      roomId: data.roomId,
      userId: botUserId,
    });
  }

  return new Response("OK");
}
