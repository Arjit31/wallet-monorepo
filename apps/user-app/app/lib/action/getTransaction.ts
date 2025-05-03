"use server";

import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import type { TransactionType } from "@repo/store/types/AllTransactionType";
import { tempReturn } from "@repo/store/types/AllTransactionType";
import { stat } from "fs";

export async function getTransaction() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return [tempReturn];
  }
  const userId = session.user.id;
  try {
    const onrampTxns = await prisma.onRampTransaction.findMany({
      where: { userId },
      select: {
        id: true,
        amount: true,
        start_time: true,
        provider: true,
        status: true,
        user: {
          select: {
            number: true,
          },
        },
      },
    });

    const p2pTxns = await prisma.p2pTransfer.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      select: {
        id: true,
        amount: true,
        time_stamp: true,
        fromUserId: true,
        toUserId: true,
        fromUser: {
          select: { number: true },
        },
        toUser: {
          select: { number: true },
        },
      },
    });

    let transaction: TransactionType[] = [
      ...onrampTxns.map((txn) => ({
        id: txn.id,
        amount: txn.amount,
        createdAt: txn.start_time,
        type: "onramp",
        provider: txn.provider,
        mobileNumber: txn.user.number,
        isSender: false,
        status: txn.status,
      })),
      ...p2pTxns.map((txn) => {
        const isSender = txn.fromUserId === userId;
        const otherNumber = isSender ? txn.toUser.number : txn.fromUser.number;

        return {
          id: txn.id,
          amount: txn.amount,
          createdAt: txn.time_stamp,
          type: "p2p",
          provider: null,
          mobileNumber: otherNumber,
          isSender: isSender,
          status: "Success",
        };
      }),
    ];
    
    transaction = transaction
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    // console.log(transaction);
    if (!transaction) {
      return [tempReturn];
    }
    return transaction;
  } catch (error) {
    console.log(error);
    return [tempReturn];
  }
}
