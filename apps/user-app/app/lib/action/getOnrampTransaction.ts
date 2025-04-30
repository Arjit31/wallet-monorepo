"use server";

import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import _ from "lodash";

export async function getOnrampTransaction(
  provider: string,
  amount: number,
  token: string
): Promise<{flag: boolean, userId: string, start_time: Date}> {
  const now = new Date();
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id || !provider || !amount || !token) {
    return {flag: false, userId: session.user.id, start_time: now};
  }
  try {
    const transaction = await prisma.onRampTransaction.findFirst({
      where: {
        token: token,
      },
    });
    const currData = {
      userId: session.user.id,
      token: token,
      provider: provider + " Bank",
      amount: amount,
      status: "Processing",
    };
    if (!transaction || _.isMatch(transaction, currData) === false) {
      return {flag: false, userId: session.user.id, start_time: now};
    }
    return {flag: true, userId: session.user.id, start_time: transaction.start_time};
  } catch (error) {
    console.log(error);
    return {flag: false, userId: session.user.id, start_time: now};
  }
}
