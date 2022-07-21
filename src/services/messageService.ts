import express, { Request, Response } from "express";

import {
  createMessage,
  deleteMessage,
  getForConvoByPage,
} from "../daos/messageDao";

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

router.get(
  "/getForConvoPage",
  runAsync(async (req: Request, res: Response) => {
    log.info(req.body);
    let data = await getForConvoByPage(req.body.convo_id, req.body.page);
    let ret = {
      currPage: req.body.page,
      nextPage: req.body.page + 1,
      data: data,
    };
    res.send(JSON.stringify(ret));
  })
);

router.post(
  "/sendMessage",
  runAsync(async (req: Request, res: Response) => {
    log.info(req.body);
    let convo = await conversationService.getConvoByIds(
      req.body.user_one,
      req.body.user_two
    );
    let user_one = await userService.getUserById(req.body.user_one);
    let user_two = await userService.getUserById(req.body.user_two);
    let id = undefined === convo || null === convo ? -1 : convo.id;
    convo = await conversationService.createOrUpdateConversationObject(
      id,
      req.body.name,
      req.body.user_one,
      req.body.user_two,
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
    res.send(JSON.stringify(message));
  })
);

//export this router to use in our index.js
module.exports = router;
