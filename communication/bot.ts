import type { MessageView } from "./types.ts";

export async function getNextBotResponse(
  messages: MessageView[]
): Promise<string> {
  // Call the OpenAI API to generate the bot's next response based on the previous messages.
  // Use the OpenAI API key from the environment variables.
  const openAI_API_Key = Deno.env.get("OPENAI_API_KEY");

  // Just for fun we'll take the first letter of each word in each message and concatenate them together.
  // after that's working we'll use OpenAI. For now, fake it.

  const fakeResponse = messages
    .map((message) => {
      return message.message
        .split(" ")
        .map((word) => {
          return word[0];
        })
        .join("");
    })
    .join(" ");

  return fakeResponse;
}
