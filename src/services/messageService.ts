import express, { Request, Response } from "express";

import {
  createMessage,
  deleteMessage,
  getForConvoByPage,
} from "../daos/messageDao";

import { io } from "../api";
var conversationService = require("./conversationService");

var userService = require("./userService");

import { log, runAsync } from "../common/common";

var router = express.Router();

async function createMessageInConvo(body, user_id, convo_id) {
  log.info(body);
  let ret = await createMessage(body, user_id, convo_id);
  return ret;
}

router.post(
  "/deleteMessage",
  runAsync(async (req: Request, res: Response) => {
    log.info(req.body);
    let ret = await deleteMessage(req.body.id);
    if (ret === "ALREADY_EXISTS") {
      res.status(405).send("Number Already Exists");
    } else if (ret === "failed") {
      res.status(400).send("Operation Failed");
    }
    res.send(JSON.stringify(ret));
  })
);

router.post(
  "/getForConvoPage",
  runAsync(async (req: Request, res: Response) => {
    log.info(req.body);
    let data = await getForConvoByPage(req.body.convo_id, req.body.page);
    let nextPage;
    if (data.length > 0) {
      nextPage = req.body.page + 1;
    } else {
      nextPage = -1;
    }
    let ret = {
      currPage: req.body.page,
      nextPage: nextPage,
      data: data,
    };
    res.send(JSON.stringify(ret));
  })
);

router.post(
  "/sendMessage",
  runAsync(async (req: Request, res: Response) => {
    log.info(req.body);

    let user_one = await userService.getUserById(req.body.user_one);
    let user_two;
    if (req.body.user_two) {
      user_two = await userService.getUserById(req.body.user_two);
    } else if (req.body.number) {
      user_two = await userService.getUserByNumber(req.body.number);
    }

    let convo = await conversationService.getConvoByIds(
      req.body.user_one,
      user_two.id
    );

    let id = undefined === convo || null === convo ? -1 : convo.id;
    convo = await conversationService.createOrUpdateConversationObject(
      id,
      req.body.name,
      req.body.user_one,
      user_two.id,
      undefined === convo || null == convo ? 0 : convo.messages_sent,
      user_one.name,
      user_two.name
    );
    //create message here
    let message = await createMessageInConvo(
      req.body.body,
      req.body.user_one,
      convo.id
    );
    io.emit("newMessage", { message });
    res.json({ message: message, convo: convo });
  })
);

//export this router to use in our index.js
module.exports = router;
