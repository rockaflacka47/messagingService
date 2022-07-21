import express, { Request, Response } from "express";

import {
  createOrUpdateConversation,
  getConvo,
  archiveConversation,
  getConvos,
} from "../daos/conversationDao";

import { log, runAsync } from "../common/common";

var router = express.Router();

async function createOrUpdateConversationObject(
  id: number,
  name: String,
  user_one: number,
  user_two: number,
  messagesSent: number,
  name_one: String,
  name_two: String
) {
  log.info("in create convo");

  let ret = await createOrUpdateConversation(
    id,
    name,
    user_one,
    user_two,
    messagesSent,
    name_one,
    name_two
  );
  if (ret === "ALREADY_EXISTS") {
    return "Error";
  } else if (ret === "failed") {
    return "Failed";
  }
  log.info(ret);
  return ret;
}

async function getConvoByIds(user_one: number, user_two: number) {
  let ret = await getConvo(user_one, user_two);

  if (ret === "ALREADY_EXISTS") {
    return "Error";
  } else if (ret === "failed") {
    return "Failed";
  }
  return ret;
}

router.post(
  "/updateArchived",
  runAsync(async (req: Request, res: Response) => {
    log.info(req.body);
    let archivedConvo = await archiveConversation(
      req.body.convo_id,
      req.body.archived
    );
    if (archivedConvo === "Conversation Doesn't Exist") {
      res.status(500).send("Conversation Doesn't Exist");
    }
    res.send(JSON.stringify(archivedConvo));
  })
);

router.get(
  "/getConvos",
  runAsync(async (req: Request, res: Response) => {
    log.info(req.body);
    let convos = await getConvos(req.body.user_id, req.body.archived);
    res.send(JSON.stringify(convos));
  })
);

//export this router to use in our index.js
module.exports = {
  router: router,
  createOrUpdateConversationObject: createOrUpdateConversationObject,
  getConvoByIds: getConvoByIds,
};
