import express, { Request, Response } from "express";

import { log, runAsync } from "./common/common";
import { createServer } from "http";
import { Server } from "socket.io";

export const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: 'https://messagingservice.david-rocker.com',
  },
});
import morgan from "morgan";
import cors from "cors";

app.use(cors({ origin: ["http://15.237.36.201", "http://127.0.0.1:3000"] }));
//app.use(cors({origin: true}));

var userService = require("./services/userService");

var messageService = require("./services/messageService");

var conversationService = require("./services/conversationService");

app.use(morgan("dev"));
app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);
// const io = new Server({
//   /* options */
// });

io.on("connection", (socket) => {});

io.on("connect_error", (err) => {
  log.info(`connect_error due to ${err.message}`);
});

httpServer.listen(3331);

app.get(
  "/",
  runAsync(async (req: Request, res: Response) => {
    let ret = "Landing page";
    res.send(ret);
  })
);

app.use("/api/user", userService.router);

app.use("/api/message", messageService);

app.use("/api/conversation", conversationService.router);
