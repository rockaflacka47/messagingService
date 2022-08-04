import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

import { log } from "../common/common";

export async function createOrUpdateUser(username, pw, name, number) {
  try {
    const ret = await prisma.User.upsert({
      where: {
        number: number,
      },
      update: {
        username: username,
        password: pw,
        name: name,
        number: number,
      },
      create: {
        username: username,
        password: pw,
        name: name,
        number: number,
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
export async function createUser(username, pw, name, number) {
  try {
    const ret = await prisma.User.create({
      data: {
        username: username,
        password: pw,
        name: name,
        number: number,
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

export async function updateUser(username, pw, name, number, id) {
  try {
    let ret = await prisma.User.update({
      where: {
        id: id,
      },
      data: {
        username: username,
        password: pw,
        name: name,
        number: number,
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

export async function getUser(id) {
  try {
    let user = await prisma.User.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  } catch (err: any) {
    log.info(err);
    return null;
  }
}

export async function getUserByNum(num) {
  try {
    let user = await prisma.User.findUnique({
      where: {
        number: num,
      },
    });
    log.info(user);
    return user;
  } catch (err: any) {
    log.info(err);
    return null;
  }
}
