import { Handler, HandlerContext, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { getCookies } from "$std/http/cookie.ts";
import { databaseLoader } from "@/communication/database.ts";
import Chat from "@/islands/Chat.tsx";
import type { MessageView, UserView } from "@/communication/types.ts";
import { Page } from "@/helpers/Page.tsx";
import { CSS, KATEX_CSS } from "https://deno.land/x/gfm@0.2.1/mod.ts";

import "https://esm.sh/prismjs@1.29.0/components/prism-typescript?no-check";
import "https://esm.sh/prismjs@1.29.0/components/prism-bash?no-check";
import "https://esm.sh/prismjs@1.29.0/components/prism-rust?no-check";
import "https://esm.sh/prismjs@1.29.0/components/prism-python?no-check";
import "https://esm.sh/prismjs@1.29.0/components/prism-r?no-check";

interface Data {
  messages: MessageView[];
  roomName: string;
  user: UserView;
}

export const handler: Handler<Data> = async (
  req: Request,
  ctx: HandlerContext<Data>
): Promise<Response> => {
  // Get cookie from request header and parse it
  const accessToken = getCookies(req.headers)["deploy_chat_token"];
  if (!accessToken) {
    return Response.redirect(new URL(req.url).origin);
  }
  const database = await databaseLoader.getInstance();
  const user = await database.getUserByAccessTokenOrThrow(accessToken);
  if (isNaN(+ctx.params.room)) {
    return new Response("Invalid room id", { status: 400 });
  }

  const [messages, roomName] = await Promise.all([
    database.getRoomMessages(+ctx.params.room),
    database.getRoomName(+ctx.params.room),
  ]);
  return ctx.render({
    messages,
    roomName,
    user: {
      name: user.userName,
      avatarUrl: user.avatarUrl,
    },
  });
};

export default function Room({ data, params }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>{data.roomName} | Deno Chat</title>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <style dangerouslySetInnerHTML={{ __html: KATEX_CSS }} />
      </Head>
      <Page>
        <Chat
          roomId={+params.room}
          initialMessages={data.messages}
          roomName={data.roomName}
          user={data.user}
        />
      </Page>
    </>
  );
}
