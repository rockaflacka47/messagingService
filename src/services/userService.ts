import express, { Request, Response } from "express";

import { createUser, updateUser, getUser, getUserByNum } from "../daos/userDao";
import passwordHash from "password-hash";
import jwt from "jsonwebtoken";

import { log, runAsync } from "../common/common";

var router = express.Router();

router.post(
  "/createUser",
  runAsync(async (req: Request, res: Response) => {
    log.info(req.body);
    let hashedPw = passwordHash.generate(req.body.password);
    let number = Math.floor(
      Math.random() * (99999 - 10000 + 1) + 10000
    ).toString();
    let ret = await createUser(
      req.body.username,
      hashedPw,
      req.body.name,
      number
    );
    if (ret === "ALREADY_EXISTS") {
      res.status(405).send("Number Already Exists");
    } else if (ret === "failed") {
      res.status(400).send("Operation Failed");
    }
    res.json({ auth: true, result: ret });
    // res.send(JSON.stringify(ret));
  })
);

router.post(
  "/updateUser",
  runAsync(async (req: Request, res: Response) => {
    log.info(req.body);
    let hashedPw = passwordHash.generate(req.body.password);
    let ret = await updateUser(
      req.body.username,
      hashedPw,
      req.body.name,
      req.body.number,
      req.body.id
    );
    if (ret === "ALREADY_EXISTS") {
      res.status(405).send("Number Already Exists");
    } else if (ret === "failed") {
      res.status(400).send("Operation Failed");
    }
    res.send(JSON.stringify(ret));
  })
);

router.post(
  "/doLogin",
  runAsync(async (req: Request, res: Response) => {
    log.info(req.body);
    let ret = await getUserByNumber(req.body.number);
    if (!ret) {
      res.json({
        auth: false,
        message: "no user exists with that username or password",
      });
    }
    if (passwordHash.verify(req.body.password, ret.password)) {
      const id = ret.id;
      const token = jwt.sign({ id }, process.env.JWT_SIGN, {
        expiresIn: 1200,
      });

      res.set("Access-Control-Allow-Origin", "*");
      res.json({ auth: true, token: token, result: ret });
    } else {
      res.json({
        auth: false,
        message: "no user exists with that username or password",
      });
    }
  })
);

async function getUserById(user_one: number) {
  let ret = await getUser(user_one);

  if (ret === "ALREADY_EXISTS") {
    return "Error";
  } else if (ret === "failed") {
    return "Failed";
  }
  return ret;
}

async function getUserByNumber(num: number) {
  let ret = await getUserByNum(num);
  return ret;
}

//export this router to use in our index.js
module.exports = {
  router: router,
  getUserById: getUserById,
  getUserByNumber: getUserByNumber,
};
