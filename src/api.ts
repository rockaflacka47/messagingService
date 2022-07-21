import express, { Request, Response } from "express";

import { runAsync } from "./common/common";

export const app = express();
import morgan from "morgan";
import cors from "cors";
app.use(cors({ origin: true }));

var userService = require("./services/userService");

var messageService = require("./services/messageService");

var conversationService = require("./services/conversationService");

app.use(morgan("dev"));
app.use(
  express.json({
    verify: (req, res, buffer) => (req["rawBody"] = buffer),
  })
);

app.get(
  "/",
  runAsync(async (req: Request, res: Response) => {
    let ret = "Landing page";
    res.send(ret);
  })
);

app.use("/user", userService.router);

app.use("/message", messageService);

app.use("/conversation", conversationService.router);
