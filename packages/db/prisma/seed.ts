import { prisma } from "../src/index";
declare const process: any;
import bcrypt from "bcrypt";

async function main() {
  const hashedPassword1 = await bcrypt.hash("alice", 10);
  const hashedPassword2 = await bcrypt.hash("bob", 10);
  const alice = await prisma.user.upsert({
    where: { number: "9999999999" },
    update: {
      password: hashedPassword1,
      balance: {
        update: {
          amount: 20000,
          locked: 0,
        },
      },
    },
    create: {
      email: "alice@example.com",
      number: "9999999999",
      password: hashedPassword1,
      name: "alice",
      balance: {
        create: {
          amount: 20000,
          locked: 0,
        },
      },
      onRampTransaction: {
        create: {
          start_time: new Date(),
          status: "Success",
          amount: 20000,
          token: "122",
          provider: "HDFC Bank",
        },
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { number: "9999999998" },
    update: {
      password: hashedPassword2,
      balance: {
        update: {
          amount: 0,
          locked: 0,
        },
      },
    },
    create: {
      email: "bob@example.com",
      number: "9999999998",
      password: hashedPassword2,
      name: "bob",
      balance: {
        create: {
          amount: 0,
          locked: 0,
        },
      },
      onRampTransaction: {
        create: {
          start_time: new Date(),
          status: "Failure",
          amount: 2000,
          token: "123",
          provider: "HDFC Bank",
        },
      },
    },
  });

  console.log({ alice, bob });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
