// bot.ts
import "$std/dotenv/load.ts";

import { Database } from "@/communication/database.ts";
import { Server } from "@/communication/server.ts"; // Add this import

const server = new Server(); // Add this line

const BOT_NAME = "Origamist";
const BOT_AVATAR_URL =
  "https://chat.notebookgpt.com/origami/static/images/snakelogo.png";

async function main() {
  // Initialize the database instanc
  const database = new Database();

  // Join a room or create a new room
  const roomName = "BotRoom";
  const roomId = await database.ensureRoom(roomName);

  // Simulate sending messages periodically
  setInterval(async () => {
    const message = generateRandomBotMessage();
    await database.insertBotMessage({
      text: message,
      roomId: roomId,
      botName: BOT_NAME,
      botAvatarUrl: BOT_AVATAR_URL,
    });

    server.sendBotMessage(roomId, message);

    console.log(`Bot sent message to room ${roomName}: ${message}`);
  }, 5000);
}

function generateRandomBotMessage(): string {
  const messages = ["we are something", "we are nothing", "we are everything"];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

main().catch((e) => {
  console.error("Error in bot process:", e);
});
