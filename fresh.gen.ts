// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/[room].tsx";
import * as $1 from "./routes/api/connect.ts";
import * as $2 from "./routes/api/create_room.ts";
import * as $3 from "./routes/api/login.ts";
import * as $4 from "./routes/api/logout.ts";
import * as $5 from "./routes/api/send.ts";
import * as $6 from "./routes/index.tsx";
import * as $7 from "./routes/new.tsx";
import * as $$0 from "./islands/AddRoom.tsx";
import * as $$1 from "./islands/Chat.tsx";

const manifest = {
  routes: {
    "./routes/[room].tsx": $0,
    "./routes/api/connect.ts": $1,
    "./routes/api/create_room.ts": $2,
    "./routes/api/login.ts": $3,
    "./routes/api/logout.ts": $4,
    "./routes/api/send.ts": $5,
    "./routes/index.tsx": $6,
    "./routes/new.tsx": $7,
  },
  islands: {
    "./islands/AddRoom.tsx": $$0,
    "./islands/Chat.tsx": $$1,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
