"use server";

import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import _ from "lodash";

export async function getOnrampTransaction(
  provider: string,
  amount: number,
  token: string
): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id || !provider || !amount || !token) {
    return false;
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
      return false;
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
