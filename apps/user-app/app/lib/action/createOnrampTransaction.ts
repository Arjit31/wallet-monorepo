"use server";

import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import axios from "axios";

export async function createOnrampTransaction(
  provider: string,
  amount: number
) {
  console.log(provider, amount)
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id || !provider || !amount || amount <= 0) {
    // console.log("Unauthenticated request", session.user.id, provider, amount)
    return "Unauthenticated request"

  }
  const token = (Math.random() * 1000).toString();
  console.log("hi");
  await prisma.onRampTransaction.create({
    data: {
      status: "Processing",
      token: token,
      provider: provider,
      amount: amount,
      start_time: new Date(),
      userId: session.user.id,
    },
  });
  const res = await axios.post(process.env.NEXT_PUBLIC_WEBHOOK_URL + "/setExpiry", {
    token: token,
    userId: session.user.id
  })
  // console.log(res)
  return token;
}
