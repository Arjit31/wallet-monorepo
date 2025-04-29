import express from "express";
import { prisma } from "@repo/db"

const app = express();
app.use(express.json());

app.post("/bank-webhook", async function (req, res) {
  const paymentDetails: {
    token: string;
    userId: string;
    amount: number;
  } = {
    token: req.body.token,
    userId: req.body.userId,
    amount: req.body.amount,
  };
  try {
    await prisma.$transaction([
      prisma.balance.update({
        where: {
          userId: paymentDetails.userId,
        },
        data: {
          amount: {
            increment: Number(paymentDetails.amount),
          },
        },
      }),
      prisma.onRampTransaction.update({
        where: {
          token: paymentDetails.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);
    res.json("captured");
  } catch (error) {
    console.error(error);
    res.status(411).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3002);
