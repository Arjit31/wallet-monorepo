"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { prisma } from "@repo/db";

export async function p2pTransfer(to: string, amount: number) {
  if(Number.isNaN(amount) || amount <= 0){
    return {
      message: "Enter valid number",
    };
  }
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;
  if (!from) {
    return {
      message: "Error while sending",
    };
  }
  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      message: "User not found",
    };
  }
  if(from === toUser.id){
    return {
      message: "Cannot send money to itself",
    };
  }
  try {
    
    // interactive transaction
    await prisma.$transaction(async (tx: any) => {
      await prisma.$queryRaw`SELECT * FROM "Balance"  WHERE "userId"  = ${from} FOR UPDATE`;
      const fromBalance = await tx.balance.findUnique({
        where: { userId: from },
      });
      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }
      
      await tx.balance.update({
        where: { userId: from },
        data: { amount: { decrement: amount } },
      });
      
      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });
      await tx.p2pTransfer.create({
        data: {
          amount: amount,
          time_stamp: new Date(),
          fromUserId: from,
          toUserId: toUser.id,
        },
      });
    });
    return {
      message: "success",
    };
  } catch (error: any) {
    console.log(error);
    if(error.toString() === "Error: Insufficient funds"){
      return {
        message: "Insufficient funds",
      };
    }
    return {
      message: "Internal Server Error",
    };
  }
}
