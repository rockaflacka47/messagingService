import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

import { log } from "../common/common";

export async function createOrUpdateConversation(
  id: number,
  name: String,
  user_one: number,
  user_two: number,
  messagesSent: number,
  name_one: String,
  name_two: String
) {
  try {
    messagesSent += 1;
    const ret = await prisma.Conversation.upsert({
      where: {
        id: id,
      },
      update: {
        messages_sent: messagesSent,
      },
      create: {
        user_one: user_one,
        user_two: user_two,
        name: null === name ? undefined : name,
        messages_sent: 0,
        user_one_name: name_one,
        user_two_name: name_two,
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

export async function getConvo(user_one, user_two) {
  try {
    const convo = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            OR: [
              {
                user_one: user_one,
              },
              {
                user_two: user_one,
              },
            ],
          },
          {
            OR: [
              {
                user_one: user_two,
              },
              {
                user_two: user_two,
              },
            ],
          },
        ],
      },
    });
    log.info(convo);
    return convo;
  } catch (err: any) {
    log.info(err);
    return "failed";
  }
}

export async function archiveConversation(id: number, archived: boolean) {
  try {
    const archivedConvo = await prisma.conversation.update({
      where: {
        id: id,
      },
      data: {
        archived: archived,
      },
    });
    return archivedConvo;
  } catch (err: any) {
    log.info(err);
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2025") {
        return "Conversation Doesn't Exist";
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

export async function getConvos(userId: number, archived: boolean) {
  try {
    const ret = await prisma.conversation.findMany({
      orderBy: [
        {
          updated_at: "desc",
        },
      ],
      where: {
        archived: archived,
        OR: [
          {
            user_one: userId,
          },
          {
            user_two: userId,
          },
        ],
      },
    });
    log.info(ret);
    return ret;
  } catch (err: any) {
    log.info(err);
    return "Error";
  }
}
