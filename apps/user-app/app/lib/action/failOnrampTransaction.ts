"use server";

import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function failOnrampTransaction(
  token: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id || !token) {
    // console.log("Unauthenticated request", session.user.id, provider, amount)
    return "Unauthenticated request"

  }
  await prisma.onRampTransaction.update({
    where: {
        token: token
    },
    data: {
      status: "Failure"
    },
  });
  return "Failed Transaction";
}
