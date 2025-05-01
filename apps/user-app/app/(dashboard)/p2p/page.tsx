import { SendCard } from "../../components/SendCard";
import { BalanceCard } from "../../components/BalanceCard";
import { OnRampTransactions } from "../../components/OnRampTransaction";
import { prisma } from "@repo/db";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { P2PTransaction } from "../../components/p2pTransaction";

async function getBalance() {
  const session = await getServerSession(authOptions);
  const balance = await prisma.balance.findFirst({
    where: {
      userId: session?.user?.id,
    },
  });
  console.log(balance, session?.user?.id);
  return {
    amount: balance?.amount || 0,
    locked: balance?.locked || 0,
  };
}

async function getP2PTransactions() {
  const session = await getServerSession(authOptions);
  const txns = await prisma.p2pTransfer.findMany({
    where: {
      OR: [
        {
          toUserId: session?.user?.id,
        },
        { fromUserId: session?.user?.id },
      ],
    },
    include: {
      fromUser: { select: { number: true } },
      toUser: { select: { number: true } },
    },
    orderBy: {
      time_stamp: "desc",
    },
  });
  return txns.map((t: any) => ({
    time: t.time_stamp,
    amount: t.amount,
    from: t.fromUserId,
    to: t.toUserId,
    userId: session?.user?.id,
    fromNumber: t.fromUser.number,
    toNumber: t.toUser.number

  }));
}

export default async function () {
  const balance = await getBalance();
  const transactions = await getP2PTransactions();
  return (
    <div className="w-screen">
      <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        P2P Transfer
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
        <div>
          <SendCard />
        </div>
        <div>
          {/* <BalanceCard amount={balance.amount} locked={balance.locked} /> */}
          <div className="pt-4">
            <P2PTransaction transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  );
}
