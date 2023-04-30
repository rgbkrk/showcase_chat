import { Handlers } from "$fresh/server.ts";
import { autobot } from "@/communication/bot.ts";

const roomBots: Record<number, { stopSignal: { stop: boolean } }> = {};

export const handler: Handlers = {
  async POST(req, _ctx) {
    const data = await req.json();
    const roomId = data.roomId;

    if (roomBots[roomId]) {
      roomBots[roomId].stopSignal.stop = !roomBots[roomId].stopSignal.stop;
    } else {
      roomBots[roomId] = { stopSignal: { stop: false } };
      autobot(roomId, roomBots[roomId].stopSignal);
    }

    return new Response("OK", { status: 200 });
  },
};
