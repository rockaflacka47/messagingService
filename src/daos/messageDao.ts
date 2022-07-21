import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

import { log } from "../common/common";

export async function createMessage(
  body: String,
  from: Number,
  convoId: Number
) {
  try {
    const ret = await prisma.Message.create({
      data: {
        body: body,
        user_id: from,
        conversation_id: convoId,
      },
    });
    return ret;
  } catch (err: any) {
    log.info(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return "ALREADY_EXISTS";
      }
    }
    return "failed";
  }
}

export async function deleteMessage(id: Number) {
  try {
    const ret = await prisma.Message.delete({
      where: {
        id: id,
      },
    });
    return ret;
  } catch (err: any) {
    log.info(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return "Error";
      }
    }
    return "failed";
  }
}

export async function getForConvoByPage(convoId: number, page: number) {
  try {
    const ret = await prisma.Message.findMany({
      skip: page * 10,
      take: 10,
      where: {
        conversation_id: convoId,
      },
    });
    log.info(ret);
    return ret;
  } catch (err: any) {
    log.info(err);
    return "Error";
  }
}
